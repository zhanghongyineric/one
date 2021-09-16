<template>
  <div class="layout-content company-information">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="企业名称:">
                <el-input v-model="listQuery.unitName" clearable placeholder="请输入企业名称" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="运营类型:">
                <el-select v-model="listQuery.operationType" placeholder="请选择运营类型">
                  <el-option
                    v-for="item in optionGroup.companyTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="运营状态:">
                  <el-select v-model="listQuery.status" placeholder="请选择运营状态">
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
                <el-form-item label="所属地区:">
                  <AreaSelect v-model="listQuery.place" size="small" limit-area :area-text.sync="listQuery.area" />
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
          align="center"
        />
        <el-table-column v-slot="{row}" label="企业名称" prop="unitName" min-width="400" show-overflow-tooltip align="center">
          {{ row.unitName || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="运营类型" prop="operationType" min-width="300" align="center">
          {{ row.operationType | companyRoleFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="所属地区" prop="zoneId" min-width="200" align="center">
          {{ row.zoneId | companyZoneFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="运营状态" prop="status" width="300" align="center">
          {{ row.status | companyStatusFilter }}
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleDetail(row)">
              查看详情
            </el-button>
            <el-button type="warning" size="mini" @click="handleUpdate(row)">
              更新信息
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

      <!--编辑、新增、查看详情共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog"
        top="40px"
        :before-close="closeDialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="140px"
          :disabled="disableStatus"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="企业名称:" prop="unitName">
                <el-input v-model="createFormData.unitName" size="small" clearable placeholder="请输入企业名称" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="企业简称:" prop="shortName">
                <el-input v-model="createFormData.shortName" size="small" clearable placeholder="请输入企业简称" />
              </el-form-item>
            </el-col>
            <!-- <el-col :md="8" :sm="24">
              <el-form-item
                label="企业级别:"
                prop="aptitudeLevel"
              >
                <el-select
                  v-model="createFormData.aptitudeLevel"
                  size="small"
                  clearable
                  placeholder="请选择企业级别"
                >
                  <el-option
                    v-for="item in optionGroup.roleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="上级企业单位:" prop="upUnitName">
                <el-autocomplete
                  v-model="createFormData.upUnitName"
                  :fetch-suggestions="searchCompany"
                  placeholder="请输入上级企业名称关键字"
                  :debounce="500"
                  size="small"
                  clearable
                  @select="selectCompany"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="行政区域:" prop="zoneId">
                <AreaSelect v-model="createFormData.zoneId" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="社会统一信用代码:" prop="businessLicense">
                <el-input v-model="createFormData.businessLicense" size="small" clearable placeholder="请输入社会统一信用代码" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item
                label="企业经济类型:"
                prop="economicType"
              >
                <el-select
                  v-model="createFormData.economicType"
                  size="small"
                  clearable
                  placeholder="请选择企业经济类型"
                >
                  <el-option
                    v-for="item in optionGroup.economyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="地址:" prop="unitAddress" class="address">
                <el-input
                  v-model="createFormData.unitAddress"
                  size="small"
                  clearable
                  placeholder="请输入地址"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="法人:" prop="lrname">
                <el-input v-model="createFormData.lrname" size="small" clearable placeholder="请输入法人" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="电话号码:" prop="telephone">
                <el-input v-model="createFormData.telephone" size="small" clearable placeholder="请输入电话号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="联系人:" prop="contact">
                <el-input v-model="createFormData.contact" size="small" clearable placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="联系电话:" prop="contactphone">
                <el-input v-model="createFormData.contactphone" size="small" clearable placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="传真号码:" prop="postcode">
                <el-input v-model="createFormData.postcode" size="small" clearable placeholder="请输入传真号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="企业注册地代码:" prop="registerZoneId">
                <el-input v-model="createFormData.registerZoneId" size="small" clearable placeholder="请输入企业注册地代码" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="运输经营范围代码:" prop="businessScopeCode">
                <el-input v-model="createFormData.businessScopeCode" size="small" clearable placeholder="请输入运输经营范围代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="经营范围描述:" prop="businesScopeScript">
                <el-input v-model="createFormData.businesScopeScript" size="small" clearable placeholder="请输入经营范围描述" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item
                label="企业运营类型:"
                prop="operationType"
              >
                <el-select
                  v-model="createFormData.operationType"
                  placeholder="请选择企业类型"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in optionGroup.companyTypes"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="备注信息:" prop="remark">
                <el-input v-model="createFormData.remark" size="small" clearable placeholder="请输入备注信息" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="排序编号:" prop="orderNumber">
                <el-input v-model="createFormData.orderNumber" size="small" clearable placeholder="请输入排序编号" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item
                label="状态:"
                prop="status"
              >
                <el-select
                  v-model="createFormData.status"
                  size="small"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in optionGroup.accountTypeList"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="运输经营许可证号:" prop="transportLincense">
                <el-input v-model="createFormData.transportLincense" size="small" clearable placeholder="请输入道路运输经营许可证号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="许可证有效期起:" prop="transportStartDate">
                <el-date-picker
                  v-model="createFormData.transportStartDate"
                  size="small"
                  clearable
                  type="date"
                  placeholder="请选择道路经营许可证有效期起"
                  format="yyyy 年 MM 月 dd 日"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="许可证有效期止:" prop="transportEndDate">
                <el-date-picker
                  v-model="createFormData.transportEndDate"
                  size="small"
                  clearable
                  type="date"
                  placeholder="请选择道路经营许可证有效期止"
                  format="yyyy 年 MM 月 dd 日"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">
            取消
          </el-button>
          <div v-if="dialogStatus==='create'">
            <el-button type="primary" :loading="buttonLoading" @click="createData()">
              确认
            </el-button>
          </div>
          <div v-else-if="dialogStatus==='update'">
            <el-button type="primary" :loading="buttonLoading" @click="updateData()">
              确认
            </el-button>
          </div>
          <div v-else-if="dialogStatus==='detail'">
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;margin-right:10px;"
              @confirm="handleDelete()"
            >
              <el-button slot="reference" size="large" type="danger" style="margin-left: -5px">
                删除
              </el-button>
            </el-popconfirm>
          </div>

        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  fetchList,
  companyStatus,
  companyRoleStatus,
  companyEconomyStatus,
  updateCount,
  deleteCount,
  addCount,
  upUnitName
} from '@/api/information-manage/company-base-information'
import Pagination from '@/components/Pagination'
import AreaSelect from '@/components/AreaSelect'
import { isPhoneNumber } from '@/utils'
import { companyLevel } from '@/options'
import getAreaText from '@/utils/AreaCodeToText'
import { CodeToText } from 'element-china-area-data'

let that
export default {
  name: 'CompanyBaseInformation',
  components: { Pagination, AreaSelect },
  filters: {
    companyRoleFilter: function(role) {
      if (role) {
        let roleText
        that.optionGroup.companyTypes.forEach(item => {
          if (item.value === role) {
            roleText = item.label
          }
        })
        return roleText
      } else return '其他'
    },
    companyStatusFilter: function(status) {
      let statusText
      that.optionGroup.accountTypeList.forEach(item => {
        if (item.value === status) {
          statusText = item.label
        }
      })
      return statusText
    },
    companyZoneFilter: function(zoneid) {
      if (zoneid) {
        const zoneText = CodeToText[zoneid.toString()]
        return zoneText
      } else return ''
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
    return {
      unitAddress: null,
      dialogFormVisible: false,
      disableStatus: false,
      rowId: '',
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        status: '',
        operationType: '',
        unitName: '',
        place: [],
        area: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        status: '',
        operationType: '',
        unitName: '',
        place: [],
        area: ''
      }, // 用于重置查询条件
      area: [],
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        roleList: companyLevel.list,
        economyList: [
          {
            label: '集体',
            value: null
          },
          {
            label: '私营',
            value: null
          },
          {
            label: '个体',
            value: null
          },
          {
            label: '联营',
            value: null
          },
          {
            label: '股份制',
            value: null
          },
          {
            label: '外商独资',
            value: null
          },
          {
            label: '港,澳,台商投资企业',
            value: null
          },
          {
            label: '有限责任',
            value: null
          },
          {
            label: '其他经济',
            value: null
          },
          {
            label: '有限',
            value: null
          },
          {
            label: '个人独资',
            value: null
          },
          {
            label: '普通合伙',
            value: null
          },
          {
            label: '其他有限责任公司',
            value: null
          },
          {
            label: '国有',
            value: null
          }
        ],
        accountTypeList: [],
        companyTypes: []
      }, // 存放选项的数据
      createFormData: {
        unitName: '',
        shortName: '',
        aptitudeLevel: 1,
        upUnitName: '',
        zoneId: [],
        businessLicense: '',
        economicType: '',
        unitAddress: '',
        lrname: '',
        telephone: '',
        contact: '',
        contactphone: '',
        postcode: '',
        registerZoneId: '',
        businessScopeCode: '',
        businesScopeScript: '',
        operationType: '',
        remark: '',
        status: '',
        transportLincense: '',
        transportStartDate: '',
        transportEndDate: '',
        operatingPermitImage: ''
      },
      createFormDataTemp: {
        unitName: '',
        shortName: '',
        aptitudeLevel: 1,
        upUnitName: '',
        zoneId: [],
        businessLicense: '',
        economicType: '',
        unitAddress: '',
        lrname: '',
        telephone: '',
        contact: '',
        contactphone: '',
        postcode: '',
        registerZoneId: '',
        businessScopeCode: '',
        businesScopeScript: '',
        operationType: '',
        remark: '',
        status: '',
        transportLincense: '',
        transportStartDate: '',
        transportEndDate: '',
        operatingPermitImage: ''
      }, // 存储新增和编辑框的数据
      // 用于重置新增的数据
      rules: {
        unitName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        telephone: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        shortName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
        // aptitudeLevel: [{ required: true, message: '请选择企业级别', trigger: 'change' }],
        zoneId: [{ required: true, message: '请选择行政区域', trigger: 'change' }],
        businessLicense: [{ required: true, message: '请输入社会统一信用代码', trigger: 'blur' }],
        economicType: [{ required: true, message: '请选择企业经济类型', trigger: 'change' }],
        registerZoneId: [{ required: true, message: '请选择企业注册地', trigger: 'change' }],
        businessScopeCode: [{ required: true, message: '请选择道路运输经营范围代码', trigger: 'change' }],
        operationType: [{ required: true, message: '请选择企业运营类型', trigger: 'change' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '详情'
      }, // 弹出框标题
      dialogStatus: '',
      poiPicker: null,
      operatingPermitImage: []
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.handleSearch()
    this.getStatusCode()
    this.companyRole()
    this.economyListCode()
  },
  methods: {
    closeDialog() {
      this.dialogFormVisible = false
      this.createFormData = { ...this.createFormDataTemp }
      console.log(this.createFormData, '关闭')
    },
    // 运营状态
    getStatusCode() {
      this.listLoading = true
      companyStatus()
        .then(res => {
          const { data } = res
          this.optionGroup.accountTypeList = data
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    searchCompany(queryString, cb) {
      if (queryString) {
        upUnitName({ upUnitName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.unitId
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
      this.createFormData.upUnitId = val.unitId
    },
    // 企业运营类型
    companyRole() {
      this.listLoading = true
      companyRoleStatus()
        .then(res => {
          const { data } = res
          this.optionGroup.companyTypes = data
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 企业经济类型
    economyListCode() {
      this.listLoading = true
      companyEconomyStatus()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            console.log(data)
            if (item.label === '集体') {
              this.optionGroup.economyList[0].value = parseInt(item.value)
            } else if (item.label === '私营') {
              this.optionGroup.economyList[1].value = parseInt(item.value)
            } else if (item.label === '个体') {
              this.optionGroup.economyList[2].value = parseInt(item.value)
            } else if (item.label === '联营') {
              this.optionGroup.economyList[3].value = parseInt(item.value)
            } else if (item.label === '股份制') {
              this.optionGroup.economyList[4].value = parseInt(item.value)
            } else if (item.label === '外商独资') {
              this.optionGroup.economyList[5].value = parseInt(item.value)
            } else if (item.label === '港,澳,台商投资企业') {
              this.optionGroup.economyList[6].value = parseInt(item.value)
            } else if (item.label === '有限责任') {
              this.optionGroup.economyList[7].value = parseInt(item.value)
            } else if (item.label === '其他经济') {
              this.optionGroup.economyList[8].value = parseInt(item.value)
            } else if (item.label === '有限') {
              this.optionGroup.economyList[9].value = parseInt(item.value)
            } else if (item.label === '个人独资') {
              this.optionGroup.economyList[10].value = parseInt(item.value)
            } else if (item.label === '普通合伙') {
              this.optionGroup.economyList[11].value = parseInt(item.value)
            } else if (item.label === '其他有限责任公司') {
              this.optionGroup.economyList[12].value = parseInt(item.value)
            } else if (item.label === '国有') {
              this.optionGroup.economyList[13].value = parseInt(item.value)
            }
          })
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      const place = this.listQuery.place
      fetchList(
        {
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
          zoneId: place[2] || place[1],
          status: this.listQuery.status,
          operationType: this.listQuery.operationType,
          unitName: this.listQuery.unitName
        }).then((res) => {
        const { data: { list, total }} = res
        this.list = list
        this.total = total
        this.listLoading = false
      }).catch((err) => {
        this.listLoading = false
        throw err
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
      this.disableStatus = false
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
          this.createFormData.economicType = this.createFormData.economicType.toString()
          const requestData = {
            ...this.createFormData,
            zoneId: this.createFormData.zoneId[2] || this.createFormData.zoneId[1]
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
    // 点击查看详情
    handleDetail(row) {
      console.log(this.optionGroup.economyList)
      if (row.economicType) row.economicType = parseInt(row.economicType)
      this.rowId = row.unitId
      this.createFormData = { ...row }
      if (this.createFormData.zoneId) {
        this.createFormData.zoneId = getAreaText(this.createFormData.zoneId.toString())
      }
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.disableStatus = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 点击更新信息
    handleUpdate(row) {
      if (row.economicType) row.economicType = parseInt(row.economicType)
      this.rowId = row.unitId
      this.createFormData = { ...row }
      if (this.createFormData.zoneId) {
        this.createFormData.zoneId = getAreaText(this.createFormData.zoneId.toString())
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disableStatus = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存更新信息
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const zoneId = this.createFormData.zoneId
          this.createFormData.economicType = this.createFormData.economicType.toString()
          const requestData = {
            id: this.rowId,
            ...this.createFormData,
            zoneId: zoneId[2] || zoneId[1]
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
    handleDelete() {
      this.listLoading = true
      deleteCount({ unitId: this.rowId }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        if (this.list.length === 1 && this.listQuery.pageNum !== 1) {
          this.listQuery.pageNum--
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  :nth-child(2){
    margin-left: 10px;
  }
}
</style>
