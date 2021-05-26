<!--
  - FileName: 账号管理
  - @author: ZhouJiaXing
  - @date: 2021/4/30 下午4:38
  -->

<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="账号类型:">
                <el-select v-model="listQuery.accountType" placeholder="请选择账号类型">
                  <el-option value="" label="全部" />
                  <el-option
                    v-for="item in optionGroup.accountTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="账号:">
                <el-input v-model="listQuery.account" placeholder="请输入账号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="企业名称:">
                  <el-input v-model="listQuery.unitName" placeholder="请输入企业名称" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="企业电话:">
                  <el-input v-model="listQuery.unitTel" placeholder="请输入企业电话" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>

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
          align="left"
        />
        <el-table-column v-slot="{row}" label="账号类别" prop="role">
          {{ row.role | roleFilter }}
        </el-table-column>
        <el-table-column label="账号" prop="username" show-overflow-tooltip min-width="150px" />
        <el-table-column v-slot="{row}" label="企业名称" prop="unitName" min-width="250px" show-overflow-tooltip>
          {{ row.unitName || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="企业电话" prop="unitTel" min-width="130px" show-overflow-tooltip>
          {{ row.unitTel || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="行政区域" prop="area" min-width="180px" show-overflow-tooltip>
          {{ row.area || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="详细地址" prop="address" min-width="250px" show-overflow-tooltip>
          {{ row.address || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="创建日期" prop="createTime" min-width="160px">
          {{ row.createTime| dateFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" fixed="right" label="状态" prop="status">
          <span :style="{color:row.status===0?'#F56C6C':'#67C23A'}">
            {{ row.status | statusFilter }}
          </span>
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
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
          <el-form-item
            label="账号类别:"
            prop="role"
          >
            <el-select
              v-model="createFormData.role"
              placeholder="请选择账号类别"
              :disabled="dialogStatus==='update'"
            >
              <el-option
                v-if="dialogStatus === 'update'"
                key="unit"
                label="企业"
                value="unit"
              />

              <el-option
                v-for="{label,value} in optionGroup.roleList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>

          <!--公司选择-->
          <el-form-item v-if="createFormData.role==='unit'" label="企业名称:" prop="unitName">
            <RemoteSearch
              v-model="createFormData.unitName"
              :api-method="searchCompany"
              :formatter="formatter"
              label="企业"
              @onSelect="selectCompany"
            />
          </el-form-item>
          <el-form-item v-if="createFormData.role==='unit'" label="企业电话:" prop="unitTel">
            <el-input v-model="createFormData.unitTel" placeholder="请输入企业电话" />
          </el-form-item>

          <!--区域选择-->
          <el-form-item v-if="createFormData.role!=='admin'" label="行政区域:" prop="areaCode">
            <AreaSelect v-model="createFormData.areaCode" size="large" :area-text.sync="createFormData.areaText" />
          </el-form-item>
          <el-form-item v-if="createFormData.role==='unit'" label="企业地址:" prop="address" class="address">
            <el-input
              v-model="createFormData.address"
              placeholder="请通过右侧选点确定企业地址"
              disabled
            />
            <!--传入对象，选点成功后会将修改了address、longitude、latitude的对象传回-->
            <!--需要手动修改绑定choosePoint事件-->
            <ChoosePoint :infos.sync="createFormData" />
          </el-form-item>

          <el-form-item label="账号:" prop="username">
            <el-input
              v-model="createFormData.username"
              placeholder="请输入账号"
              auto-complete="off"
              :disabled="dialogStatus==='update'"
            />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              v-model="createFormData.password"
              type="password"
              placeholder="请输入密码"
              auto-complete="new-password"
            />
          </el-form-item>
          <el-form-item label="确认密码:" prop="passwordConfirm">
            <el-input
              v-model="createFormData.passwordConfirm"
              type="password"
              placeholder="请确认密码"
              auto-complete="new-password"
            />
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

import { addCount, changeCountState, deleteCount, fetchList, updateCount } from '@/api/user/user.js'
import { searchCompany } from '@/api/company-manage/company'
import Pagination from '@/components/Pagination' // 分页
import AreaSelect from '@/components/AreaSelect'
import RemoteSearch from '@/components/RemoteSearch/select'
import { isPhoneNumber, parseTime } from '@/utils'
import { roleOption, statusOption } from '@/options'
import ChoosePoint from '@/components/ChoosePoint'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'AccountManage',
  components: { Pagination, AreaSelect, RemoteSearch, ChoosePoint },
  filters: {
    statusFilter: function(status) {
      return statusOption.map[status]
    },
    roleFilter: function(role) {
      return roleOption.map[role]
    },
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },
  data() {
    const validateUnitTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入企业电话'))
      } else if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确企业电话'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        if (this.dialogStatus === 'create') {
          callback(new Error('请输入新密码'))
        } else {
          callback() // 编辑可以不输入密码
        }
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        if (this.dialogStatus === 'create') {
          callback(new Error('请再次输入新密码'))
        } else {
          callback()// 编辑可以不输入密码
        }
      } else if (value !== this.createFormData.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    // const self = this
    return {
      address: null,
      dialogFormVisible: false,
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: '',
        accountType: '',
        account: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: '',
        accountType: '',
        account: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: statusOption.list,
        roleList: roleOption.listNoUnit,
        accountTypeList: onlineOption.account_type.list
      }, // 存放选项的数据
      createFormData: {
        role: 'admin',
        unitName: '',
        unitTel: '',
        unitId: '',
        areaCode: [],
        areaText: '',
        username: '',
        password: '',
        passwordConfirm: '',
        longitude: '',
        latitude: '',
        address: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        role: 'admin',
        unitName: '',
        unitTel: '',
        unitId: '',
        areaCode: [],
        areaText: '',
        username: '',
        password: '',
        passwordConfirm: '',
        longitude: '',
        latitude: '',
        address: ''
      }, // 用于重置新增的数据
      rules: {
        role: [{ required: true, message: '请选择账号类型', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        unitTel: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        areaCode: [{ required: true, message: '请选择区域', trigger: 'change' }],
        address: [{ required: true, message: '请选择地址', trigger: 'change' }],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        passwordConfirm: [{ required: true, trigger: 'blur', validator: validatePass2 }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogStatus: '',
      poiPicker: null
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    this.getList()
  },
  methods: {
    // 将数据格式化后传递给remote-select组件
    formatter(data) {
      console.log(data)
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
    // 选择公司
    selectCompany(item) {
      // 自动填充部分表单
      this.createFormData.unitTel = item.phone
      this.createFormData.unitId = item.id
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
      this.listLoading = true
      fetchList(this.listQuery).then(({ data: { list, total }}) => {
        this.list = list
        this.total = total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
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

          // 将areaCode拆分成后端需要的数据
          const areaCode = this.createFormData.areaCode
          const requestData = {
            ...this.createFormData,
            province: areaCode[0] || '',
            city: areaCode[1] || '',
            region: areaCode[2] || '',
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
      let areaCode = [row.province, row.city, row.region]

      // 剔除多余的空字符串，方便组件回显
      if (areaCode.indexOf('') !== -1) {
        areaCode = areaCode.slice(0, areaCode.indexOf('') + 1)
      }

      this.createFormData = { ...row, password: '', passwordConfirm: '', areaCode } // 由于表格没有密码，不设置会为undefined
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

          // 将areaCode拆分成后端需要的数据
          const areaCode = this.createFormData.areaCode
          const requestData = {
            ...this.createFormData,
            province: areaCode[0] || '',
            city: areaCode[1] || '',
            region: areaCode[2] || '',
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

::v-deep .amap-box {
  height: 100vh !important;
}

.account-manage .address ::v-deep.el-form-item__content {
  display: flex;

  .el-input {
    flex: 1;
    margin-right: 10px;
  }

}

</style>
