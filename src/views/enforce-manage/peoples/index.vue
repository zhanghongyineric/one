<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="地区:">
                <AreaSelect v-model="listQuery.unitPlace" size="small" limit-area :area-text.sync="areas" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item>
                <el-input v-model="listQuery.unitId" placeholder="请搜索身份证号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24" style="margin-top: 5px;">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="编号"
          type="index"
          width="50"
          align="center"
        />

        <el-table-column label="姓名" prop="userName" width="70" align="center" />
        <el-table-column label="性别" prop="userSex" width="50" align="center" />
        <el-table-column label="电话" prop="userPhone" width="110" align="center" />
        <el-table-column label="身份证" prop="userId" width="160" align="center" />
        <el-table-column label="所属区域" prop="userArea" width="110" align="center" show-overflow-tooltip />
        <el-table-column label="主管单位" prop="userUnit" width="150" align="center" show-overflow-tooltip />
        <el-table-column label="执法类型" prop="lawType" width="180" align="center" />
        <!--        <el-table-column label="执法证件" prop="lawCredentials" align="center">-->
        <!--          <el-image-->
        <!--            v-for="item in srcList"-->
        <!--            :key="item.url"-->
        <!--            style="width: 60px; height: 60px"-->
        <!--            :src="item.url"-->
        <!--            :preview-src-list="item.image"-->
        <!--          />-->
        <!--        </el-table-column>-->
        <el-table-column label="执法证件" prop="lawCredentials" align="center">
          <el-image :src="imgs" :preview-src-list="imgs1" style="width: 100px;height: 40px" />
        </el-table-column>
        <el-table-column label="身份类别" prop="userCategory" width="110" align="center" />
        <el-table-column v-slot="{row}" label="创建时间" prop="createTime" width="160" align="center">
          {{ row.createTime| dateFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="状态" prop="status" width="70" align="center">
          <span :style="{color:row.status===0?'#F56C6C':'#67C23A'}">
            {{ row.status | statusFilter }}
          </span>
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;margin-right:10px;"
              @confirm="handleDelete(row)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
            <el-button
              v-if="row.status === 1"
              size="mini"
              type="warning"
              @click="handleToggle(row, false)"
            >
              禁用
            </el-button>
            <el-button v-else size="mini" type="success" @click="handleToggle(row, true)">
              启用
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="姓名:" prop="userName">
            <el-input
              v-model="createFormData.userName"
              placeholder="请输入姓名"
              auto-complete="off"
              :disabled="dialogStatus==='update'"
            />
          </el-form-item>
          <el-form-item label="性别:" prop="userSex">
            <el-select v-model="createFormData.userSex" placeholder="请选择性别" :disabled="dialogStatus==='update'">
              <el-option
                v-for="item in options"
                :key="item.userSex"
                :label="item.label"
                :value="item.userSex"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话:" prop="userPhone">
            <el-input
              v-model="createFormData.userPhone"
              placeholder="请输入手机号"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="身份证:" prop="userId">
            <el-input
              v-model="createFormData.userId"
              placeholder="请输入身份证号"
              auto-complete="off"
              :disabled="dialogStatus==='update'"
            />
          </el-form-item>
          <el-form-item label="所属区域:" prop="userArea">
            <AreaSelect v-model="createFormData.userArea" size="medium" limit-area :area-text.sync="createFormData.areaText" />
          </el-form-item>
          <el-form-item label="主管单位:" prop="userUnit">
            <el-input
              v-model="createFormData.userUnit"
              placeholder="请输入所属主管单位"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="执法类型:" prop="lawType">
            <el-select v-model="createFormData.lawType" placeholder="请选择执法类型">
              <el-option
                v-for="item in options1"
                :key="item.lawType"
                :label="item.label"
                :value="item.lawType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="身份类别:" prop="userCategory">
            <el-select v-model="createFormData.userCategory" placeholder="请选择身份类别">
              <el-option
                v-for="item in options2"
                :key="item.userCategory"
                :label="item.label"
                :value="item.userCategory"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执法凭证:" prop="lawCredentials">
            <!--            <el-button-->
            <!--              icon="el-icon-upload2"-->
            <!--              size="small"-->
            <!--            >上传图片一张最大10M</el-button>-->
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeAvatarUpload"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" icon="el-icon-upload2">请上传一张图片且不超过10MB</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" :loading="buttonLoading" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>

      </el-dialog>
    </el-card>
  </div>
</template>

<script>

// import { addCount, changeCountState, deleteCount, fetchList, updateCount, test } from '@/api/user.js'
import { searchCompany } from '@/api/company-manage/company'
import Pagination from '@/components/Pagination' // 分页
import AreaSelect from '@/components/AreaSelect'
import { isPhoneNumber, isIdNumber, parseTime } from '@/utils'
import { roleOption, statusOption } from '@/options'
import img from './images/1.png'
import img2 from './images/2.jpg'

export default {
  name: 'AccountManage',
  components: { Pagination, AreaSelect },
  filters: {
    statusFilter: function(status) {
      return statusOption.map[status]
    },
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },
  data() {
    const validateUnitTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateUnitId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'))
      } else if (!isIdNumber(value)) {
        callback(new Error('身份证输入不合法'))
      } else {
        callback()
      }
    }
    const validateUnitIamge = (rule, value, callback) => {
      if (!value) {
        callback(alert('请上传执法凭证'))
      } else {
        callback()
      }
    }
    return {
      imgs: img,
      imgs1: [img2],
      // srcList: [
      //   {
      //     url: 'img',
      //     image: ['img']
      //   }
      // ],
      fileList: [],
      address: null,
      searchKey: '',
      searchOption: {
        city: '成都市',
        citylimit: true
      },
      dialogFormVisible: false,
      options: [{
        value: '选项1',
        label: '男'
      }, {
        value: '选项2',
        label: '女'
      }],
      options1: [{
        lawType: '选项1',
        label: '交通运输行政执法'
      }, {
        lawType: '选项2',
        label: '交通综合行政执法'
      }, {
        lawType: '选项3',
        label: '公路路政执法'
      }, {
        lawType: '选项4',
        label: '道路运政执法'
      }, {
        lawType: '选项5',
        label: '水路运政执法'
      }, {
        lawType: '选项6',
        label: '航道行政执法'
      }, {
        lawType: '选项7',
        label: '港口行政执法'
      }, {
        lawType: '选项8',
        label: '海口行政执法'
      }],
      options2: [{
        value: '选项1',
        label: '正规编制'
      }, {
        value: '选项2',
        label: '非正规编制'
      }],
      value: '',
      areas: '',
      list: [
        {
          userName: '刘备',
          userSex: '男',
          userPhone: '13200001111',
          userId: 51011019885216332,
          userArea: '四川遂宁',
          userUnit: '遂宁交警一大队',
          lawType: '交通运输综合执法',
          lawCredentials: '',
          userCategory: '正规编制',
          createTime: '2021-3-26',
          status: '已生效'
        },
        {
          userName: '李小寒',
          userSex: '男',
          userPhone: '13200001111',
          userId: 51011019885216332,
          userArea: '四川遂宁',
          userUnit: '遂宁交警一大队',
          lawType: '交通运输综合执法',
          lawCredentials: '',
          userCategory: '非正规编制',
          createTime: '2021-3-26',
          status: '已生效'
        },
        {
          userName: '刘备',
          userSex: '男',
          userPhone: '13200001111',
          userId: 51011019885216332,
          userArea: '四川遂宁',
          userUnit: '遂宁交警一大队',
          lawType: '交通运输综合执法',
          lawCredentials: '',
          userCategory: '正规编制',
          createTime: '2021-3-26',
          status: '已生效'
        }

      ], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: [],
        unitId: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: [],
        unitId: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: statusOption.list,
        roleList: roleOption.list
      }, // 存放选项的数据
      createFormData: {
        userName: '',
        userSex: '',
        userPhone: '',
        userId: '',
        userArea: [],
        areaText: '',
        userUnit: '',
        lawType: '',
        userCategory: '',
        lawCredentials: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        userName: '',
        userSex: '',
        userPhone: '',
        userId: '',
        userArea: [],
        areaText: '',
        userUnit: '',
        lawType: '',
        userCategory: '',
        lawCredentials: ''
      }, // 用于重置新增的数据
      rules: {
        userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        userSex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        userPhone: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        userId: [{ required: true, trigger: 'blur', validator: validateUnitId }],
        userArea: [{ required: true, message: '请输入所属区域', trigger: 'blur' }],
        userUnit: [{ required: true, message: '请输入所属主管单位', trigger: 'blur' }],
        lawType: [{ required: true, message: '请选择执法类型', trigger: 'blur' }],
        userCategory: [{ required: true, message: '请选择身份类别', trigger: 'blur' }],
        lawCredentials: [{ required: true, trigger: 'blur', validator: validateUnitIamge }] },
      // 新增和编辑框的规则
      textMap: {
        update: '修改',
        create: '新增'
      }, // 弹出框标题
      dialogStatus: ''
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    // this.getList()
  },

  methods: {
    // 图片上传
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制仅上传 1 张图片`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeAvatarUpload(file) {
      const isLtM = file.size / 1024 < 10

      if (!isLtM) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLtM
    },

    // 将数据格式化后传递给remote-select组件
    formatter(data) {
      return data.map(item => {
        return {
          ...item,
          label: item.value
        }
      })
    },
    // 选择公司
    toChoosePoint() {
      this.pickLocation = true
      this.searchKey = this.createFormData.address
    },
    initSearch() {
      const vm = this
      const map = this.amapManager.getMap()
      // eslint-disable-next-line no-undef
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        var poiPicker = new PoiPicker({
          input: 'search',
          placeSearchOptions: {
            map: map,
            pageSize: 10
          },
          suggestContainer: 'searchTip',
          searchResultsContainer: 'searchTip'
        })
        vm.poiPicker = poiPicker
        // 监听poi选中信息
        poiPicker.on('poiPicked', function(poiResult) {
          // console.log(poiResult)
          const source = poiResult.source
          const poi = poiResult.item
          if (source !== 'search') {
            poiPicker.searchByKeyword(poi.name)
          } else {
            poiPicker.clearSearchResults()
            vm.markers = []
            const lng = poi.location.lng
            const lat = poi.location.lat
            const address = poi.cityname + poi.adname + poi.name
            vm.center = [lng, lat]
            vm.markers.push([lng, lat])
            vm.lng = lng
            vm.lat = lat
            vm.address = address
            vm.searchKey = address
          }
        })
      })
    },
    searchByHand() {
      if (this.searchKey !== '') {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
    },
    choosePoint() {
      if (!this.address) {
        this.$message.error('请选择地址')
        return
      }
      this.createFormData.address = this.address
      this.createFormData.longitude = this.lng
      this.createFormData.latitude = this.lat
      this.pickLocation = false
    },
    // 搜索公司
    selectCompany(item) {
      // 自动填充部分表单
      this.createFormData.unitTel = item.phone
    },
    // 搜索公司
    searchCompany(query) {
      return searchCompany(query)
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(({ data: { list, total }}) => {
      //   this.list = list
      //   this.total = total
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 将userArea拆分成后端需要的数据
          const userArea = this.createFormData.userArea
          const requestData = {
            ...this.createFormData,
            province: userArea[0] || '',
            city: userArea[1] || '',
            region: userArea[2] || '',
            area: this.createFormData.areaText
          }

          addCount(requestData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      let userArea = [row.province, row.city, row.region]

      // 剔除多余的空字符串，方便组件回显
      if (userArea.indexOf('') !== -1) {
        userArea = userArea.slice(0, userArea.indexOf('') + 1)
      }

      this.createFormData = { ...row, password: '', passwordConfirm: '', userArea } // 由于表格没有密码，不设置会为undefined
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 将userArea拆分成后端需要的数据
          const userArea = this.createFormData.userArea
          const requestData = {
            ...this.createFormData,
            province: userArea[0] || '',
            city: userArea[1] || '',
            region: userArea[2] || '',
            area: this.createFormData.areaText
          }

          updateCount(requestData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 删除数据

    handleDelete(row) {
      if (row.status === 1) {
        this.$message({
          message: '你必须先禁用账号才能删除',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.listLoading = true
      deleteCount({ userId: row.userId }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
          this.listQuery.pageNumber--
        }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    },
    // 状态切换
    handleToggle(row) {
      changeCountState({
        userId: row.userId
      }).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.container {
  width: 700px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  border: 1px solid #999;
}

.search-box-account {
  position: absolute;
  z-index: 5;
  width: 70%;
  left: 13%;
  top: 10px;
  height: 30px;
  display: flex;

  .el-cascader--small {
    max-width: 300px;
    flex: 1;
  }

  .el-button {
    margin-top: 2px;
    height: 36px;
  }

  .address {
    margin: 0 10px;
    flex: 1;
    min-width: 100px;
  }

  .tip-box {
    width: 100%;
    max-height: 260px;
    position: absolute;
    top: 40px;
    overflow-y: auto;
    background-color: #fff;
  }
}

.account-manage .address ::v-deep.el-form-item__content {
  display: flex;

  .el-input {
    flex: 1;
    margin-right: 10px;
  }

}

.pick-location {
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 26px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
  }

  ::v-deep.el-dialog {

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
    }

  }
}
</style>
<style lang="scss">
.sousuo {
  display: flex;
}

.search-box-account {
  .el-input--small .el-input__inner {
    line-height: 40px;
    height: 40px;
    width: 300px !important;
  }
}
</style>
