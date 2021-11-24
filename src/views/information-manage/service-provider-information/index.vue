<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <el-form
        class="table-page-search-wrapper search"
        label-width="80px"
        size="small"
      >
        <el-row :gutter="24">
          <el-col :md="6" :sm="24">
            <el-form-item label="数据源:">
              <el-select
                v-model="listQuery.sourceCode"
                size="small"
                placeholder="请选择数据源"
              >
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="名称:">
              <el-autocomplete
                v-model="listQuery.unitName"
                :fetch-suggestions="searchCompany"
                placeholder="请输入服务商名称关键字"
                :debounce="500"
                clearable
                style="width:100%"
                @select="selectCompany"
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="状态:">
              <el-select v-model="listQuery.status" placeholder="请选择申请状态">
                <el-option v-for="item in optionGroup" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="small" @click="resetQuery">重置</el-button>
              <el-button type="primary" size="small" @click="getList">查询</el-button>
              <el-button type="primary" size="small" @click="addCompany">添加服务商</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableData"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="60" align="center" />
        <el-table-column prop="unitName" label="服务商名称" min-width="130" show-overflow-tooltip align="center" />
        <el-table-column prop="contact" label="联系人" min-width="70" />
        <el-table-column prop="businessLicenseCode" label="社会统一信用代码" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="mobilePhone" label="手机号" min-width="120" align="center" />
        <el-table-column prop="email" label="邮箱" min-width="120" show-overflow-tooltip align="center" />
        <el-table-column prop="postcode" label="传真" min-width="120" align="center" />
        <el-table-column prop="unitAddress" label="地址" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="status" label="状态" min-width="150" align="center">
          <template slot-scope="scope">
            <span :style="scope.row.status | styleFilter">{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row)"
            >查看详情</el-button>
            <el-button
              class="btn"
              type="warning"
              size="small"
              @click="modifyData(scope.row)"
            >更新信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        custom-class="base-dialog dialog-col-1"
        :title="getTitle()"
        :visible.sync="dialogVisible"
        top="50px"
        :before-close="closeDialog"
      >
        <el-form
          ref="dialogForm"
          :rules="rules"
          :model="dialogData"
          label-width="150px"
          :disabled="detail"
        >
          <el-form-item label="服务商名称：" prop="unitName">
            <el-input v-model="dialogData.unitName" placeholder="请输入服务商名称" size="small" clearable />
          </el-form-item>
          <el-form-item label="社会统一信用代码：" prop="businessLicenseCode">
            <el-input v-model="dialogData.businessLicenseCode" placeholder="请输入社会统一信用代码" clearable size="small" />
          </el-form-item>
          <el-form-item label="地址：" prop="unitAddress">
            <el-input v-model="dialogData.unitAddress" placeholder="请输入详细地址" clearable size="small" />
          </el-form-item>
          <el-form-item label="联系人：" prop="contact">
            <el-input v-model="dialogData.contact" clearable placeholder="请输入联系人名字" size="small" />
          </el-form-item>
          <el-form-item label="联系电话：" prop="telephone">
            <el-input v-model="dialogData.telephone" clearable placeholder="请输入联系电话" size="small" />
          </el-form-item>
          <el-form-item label="联系手机：" prop="mobilePhone">
            <el-input v-model="dialogData.mobilePhone" clearable placeholder="请输入联系手机" size="small" />
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="email">
            <el-input v-model="dialogData.email" clearable placeholder="请输入联系邮箱" size="small" />
          </el-form-item>
          <el-form-item label="联系传真：" prop="postcode">
            <el-input v-model="dialogData.postcode" clearable placeholder="请输入联系传真" size="small" />
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="dialogData.status" placeholder="请选择状态" size="small">
              <el-option v-for="item in statusOption" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <span v-if="detail" style="margin-left: 35%">
          <el-button type="danger" @click="delData()">删除</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </span>
        <span v-else style="margin-left: 35%">
          <el-button type="primary" @click="submit()">保存</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  selectList,
  getStatus,
  save,
  deleteData
} from '@/api/information-manage/service-provider'
import { isPhoneNumber } from '@/utils'
import { facilitatorName } from '@/api/information-manage/car-base-information'

let that

export default {
  name: 'ServiceProviderInformation',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      let statusText
      that.statusOption.forEach(item => {
        if (item.value === status) {
          statusText = item.label
        }
      })
      return statusText
    },
    styleFilter(status) {
      let statusText
      that.statusOption.forEach(item => {
        if (item.value === status) {
          statusText = item.label
        }
      })
      if (statusText === '正常') {
        return {
          'color': 'green'
        }
      } else {
        return {
          'color': 'red'
        }
      }
    }
  },
  data() {
    const validateUnitTel = (rule, value, callback) => {
      if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      advanced: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        status: null,
        sourceCode: '200100'
      },
      area: [],
      optionGroup: [
        {
          label: '全部',
          value: null
        },
        {
          label: '正常',
          value: null
        },
        {
          label: '注销',
          value: null
        }
      ],
      statusOption: [],
      total: 1,
      listLoading: false,
      tableData: [],
      dialogVisible: false,
      rules: {
        unitName: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
        businessLicenseCode: [{ required: true, message: '请输入社会统一信用代码', trigger: 'blur' }],
        unitAddress: [{ required: true, message: '请选择地址', trigger: 'change' }],
        mobilePhone: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }]
      },
      dialogData: {
        unitName: '',
        businessLicenseCode: '',
        contact: '',
        mobilePhone: '',
        telephone: '',
        email: '',
        postcode: '',
        unitAddress: '',
        status: null,
        logo: ''
      },
      modify: false,
      detail: false,
      imgsFiles: [],
      currentRow: {},
      fileList: [],
      dataSourceOptions: []
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.dataSourceOptions = onlineOption['数据来源'].list
    // this.listQuery.sourceCode = this.dataSourceOptions[0].value
    this.getStatusCode()
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchCompany(queryString, cb) {
      if (queryString) {
        facilitatorName({ unitName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.id
              item.value = item.unitName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectCompany(val) {
      this.listQuery.unitName = val.unitName
    },
    getStatusCode() {
      this.listLoading = true
      getStatus()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            if (item.label === '正常') {
              this.optionGroup[1].value = parseInt(item.value)
            } else {
              this.optionGroup[2].value = parseInt(item.value)
            }
          })
          this.statusOption.push(this.optionGroup[1])
          this.statusOption.push(this.optionGroup[2])
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    getList() {
      this.listLoading = true
      selectList({ ...this.listQuery })
        .then(res => {
          const { data } = res
          this.tableData = data.list
          this.total = data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        status: null
      }
      this.getList()
    },
    showDetails(row) {
      this.dialogData = { ...row }
      this.currentRow = row
      this.dialogVisible = true
      this.detail = true
      if (row.logo) this.fileList.push({ url: process.env.VUE_APP_IMAGES_BASE_URL + row.logo })
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    addCompany() {
      this.modify = false
      this.dialogVisible = true
      this.detail = false
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    previewImg(file) {
      this.imgsFiles.push(file.raw)
      if (this.modify) this.fileList.push(file)
    },
    handleRemove(file) {
      if (!file.raw) {
        this.fileList.forEach((item, index) => {
          if (file.url === item.url) {
            this.fileList.splice(index, 1)
          }
        })
      } else {
        this.imgsFiles.forEach((item, index) => {
          if (file.raw.uid === item.uid) {
            this.imgsFiles.splice(index, 1)
          }
        })
      }
    },
    resetForm() {
      this.dialogData = {
        unitName: '',
        businessLicenseCode: '',
        contact: '',
        mobilePhone: '',
        telephone: '',
        email: '',
        postcode: '',
        unitAddress: '',
        status: null
      }
    },
    submit() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          // 上传图片
          // const uploadReq = []
          // const form = new FormData()
          // form.append('fileName', this.imgsFiles[0])
          // uploadReq.push(upload(form))

          // Promise.all(uploadReq)
          //   .then(res => {
          //     this.dialogData.logo = res[0].data.fileUrl
          // 提交数据
          this.dialogData.facilitatorId = this.currentRow.facilitatorId
          this.dialogData.updatorName = this.$store.state.user.name
          this.dialogData.updatorNo = this.$store.state.user.userId
          this.dialogData.creatorName = this.$store.state.user.name
          this.dialogData.creatorNo = this.$store.state.user.userId

          save({ ...this.dialogData })
            .then(res => {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: this.modify ? '修改成功' : '添加成功！'
              })
              this.imgsFiles = []
              this.fileList = []
              this.resetForm()
              this.getList()
            })
            .catch(err => {
              throw err
            })
            // })
            // .catch(err => {
            //   this.$message({
            //     type: 'error',
            //     message: '图片过大，上传失败'
            //   })
            //   throw err
            // })
        }
      })
    },
    delData() {
      this.$confirm('确认删除该条数据吗？')
        .then(() => {
          this.listLoading = true
          deleteData({ facilitatorId: this.currentRow.facilitatorId })
            .then(res => {
              this.dialogVisible = false
              if (this.tableData.length === 1 && this.listQuery.pageNum !== 1) {
                this.listQuery.pageNum--
              }
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getList()
              this.resetForm()
            })
            .catch(err => {
              this.listLoading = false
              this.$message({
                type: 'error',
                message: '删除失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
    },
    modifyData(row) {
      this.dialogData = { ...row }
      this.modify = true
      this.dialogVisible = true
      this.currentRow = row
      this.detail = false
      if (row.logo) this.fileList.push({ url: process.env.VUE_APP_IMAGES_BASE_URL + row.logo })
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    closeDialog() {
      this.dialogVisible = false
      setTimeout(() => this.resetForm(), 500)
      this.fileList = []
    },
    getTitle() {
      if (this.modify && !this.detail) return '更新'
      else if (!this.modify && !this.detail) return '新增'
      else return '详情'
    }
  }
}
</script>
