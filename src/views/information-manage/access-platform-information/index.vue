<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="110px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="平台名称:">
                <el-autocomplete
                  v-model="listQuery.platformName"
                  :fetch-suggestions="searchType"
                  placeholder="请输入平台名称关键字"
                  :debounce="500"
                  clearable
                  @select="selectPlatform"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="服务车辆类型:">
                <el-select v-model="listQuery.serviceVehicleTypeCode" placeholder="请选择服务车辆类型">
                  <el-option
                    v-for="item in serviceCarKinds"
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
                <el-form-item label="平台支持功能:">
                  <el-select v-model="listQuery.functions" placeholder="请选择平台支持功能">
                    <el-option
                      v-for="item in platformSupportFeatures"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="接入平台类型:">
                  <el-select v-model="listQuery.typeCode" placeholder="请选择接入平台类型">
                    <el-option
                      v-for="item in accessPlatformKinds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="接入平台性质:">
                  <el-select v-model="listQuery.characterCode" placeholder="请选择接入平台性质">
                    <el-option
                      v-for="item in accessPlatformBelong"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="平台状态:">
                  <el-select v-model="listQuery.status" size="small" placeholder="请选择平台状态">
                    <el-option
                      v-for="item in platformStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="备案状态:">
                  <el-select v-model="listQuery.keepOnRecord" placeholder="请选择备案状态">
                    <el-option
                      v-for="item in recordStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
                <el-button type="primary" size="small" @click="getList">查询</el-button>
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

      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableData"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" align="center" />
        <el-table-column prop="platformName" label="平台名称" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="characterCode" label="接入平台性质" min-width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.characterCode | characterCodeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeCode" label="接入平台类型" min-width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeCode | typeCodeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="functions" label="平台支持功能" min-width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.functions | functionsFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceVehicleTypeCode" label="服务车辆类型" min-width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serviceVehicleTypeCode | serviceVehicleTypeCodeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="developerName" label="服务商名称" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="serviceArea" label="服务地区范围" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="keepOnRecord" label="备案状态" min-width="100" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.keepOnRecord | keepOnRecordFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="平台状态" width="90" align="center">
          <template slot-scope="scope">
            <span
              :style="scope.row.status | styleFilter"
            >{{ scope.row.status | statusFilter }}</span>
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

      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="modify ? '更新' : '添加'"
        :visible.sync="dialogVisible"
        top="40px"
        :before-close="closeDialog"
      >
        <el-form
          ref="dialogForm"
          :rules="rules"
          :model="dialogData"
          label-width="120px"
          :disabled="detail"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台名称：" prop="platformName">
                <el-input v-model="dialogData.platformName" placeholder="请输入平台名称" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台编码：" prop="platformCode">
                <el-input v-model="dialogData.platformCode" placeholder="请输入平台编码" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="用户名：" prop="userName">
                <el-input v-model="dialogData.userName" placeholder="请输入用户名" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="dialogData.password" placeholder="请输入密码" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="版本协议：" prop="protocolVersion">
                <el-select v-model="dialogData.protocolVersion" size="small" placeholder="请选择版本协议">
                  <el-option
                    v-for="item in protocolVersionOptions"
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
              <el-form-item label="联系人：" prop="contact">
                <el-input v-model="dialogData.contact" placeholder="请输入联系人" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="联系电话：" prop="contactInfo">
                <el-input v-model="dialogData.contactInfo" placeholder="请输入联系电话" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台性质：" prop="characterCode">
                <el-select v-model="dialogData.characterCode" size="small" placeholder="请选择接入平台性质">
                  <el-option
                    v-for="item in accessPlatformBelong"
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
              <el-form-item label="接入平台类型：" prop="typeCode ">
                <el-select v-model="dialogData.typeCode" size="small" placeholder="请选择接入平台类型">
                  <el-option
                    v-for="item in accessPlatformKinds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="终端接入IP：" prop="deviceIp">
                <el-input v-model="dialogData.deviceIp" placeholder="请输入终端接入IP" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="终端接入端口：" prop="devicePort">
                <el-input v-model="dialogData.devicePort" placeholder="请输入终端接入端口" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="平台状态：" prop="status">
                <el-select v-model="dialogData.status" placeholder="请选择平台状态">
                  <el-option
                    v-for="item in platformStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台IP：" prop="ip">
                <el-input v-model="dialogData.ip" placeholder="请输入接入平台IP" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台端口：" prop="port">
                <el-input v-model="dialogData.port" placeholder="请输入接入平台端口" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="M1：" prop="m1">
                <el-input v-model="dialogData.m1" placeholder="请输入内容" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="IA1：" prop="ia1">
                <el-input v-model="dialogData.ia1" placeholder="请输入内容" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="IC1：" prop="ic1">
                <el-input v-model="dialogData.ic1" placeholder="请输入内容" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="是否可连接：" prop="allowConnect">
                <el-select v-model="dialogData.allowConnect" size="small" placeholder="请选择是否可连接">
                  <el-option
                    v-for="item in allowConnectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务商名称：" prop="developerName">
                <el-autocomplete
                  v-model="dialogData.developerName"
                  :fetch-suggestions="searchTypeService"
                  placeholder="请输入服务商名称关键字"
                  :debounce="500"
                  size="small"
                  @select="selectService"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="备案状态：" prop="keepOnRecord">
                <el-select v-model="dialogData.keepOnRecord" size="small" placeholder="请选择备案状态">
                  <el-option
                    v-for="item in recordStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务地区范围：" prop="serviceArea">
                <el-select
                  v-model="dialogData.serviceArea"
                  size="small"
                  multiple
                  placeholder="请选择服务地区范围"
                >
                  <el-option
                    v-for="item in serviceAreaOptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台支持功能：" prop="functions">
                <el-select
                  v-model="dialogData.functions"
                  size="small"
                  multiple
                  placeholder="请选择平台支持功能"
                >
                  <el-option
                    v-for="item in platformSupportFeatures"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务车辆类型：" prop="serviceVehicleTypeCode">
                <el-select
                  v-model="dialogData.serviceVehicleTypeCode"
                  size="small"
                  multiple
                  placeholder="请选择服务车辆类型"
                >
                  <el-option
                    v-for="item in serviceCarKinds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span v-if="detail" style="margin-left: 40%">
          <el-button type="danger" @click="delData()">删除</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </span>
        <span v-else style="margin-left: 40%">
          <el-button type="primary" @click="submit()">保存</el-button>
          <el-button type="danger" @click="closeDialog()">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { serviceArea } from '@/options'
import Pagination from '@/components/Pagination'
import {
  queryConditions,
  protocolVersion,
  selectList,
  save,
  deleteData,
  allowConnect,
  facilitatorName
} from '@/api/information-manage/access-platform'
import { platformInfoName } from '@/api/information-manage/car-base-information'

let that

export default {
  name: 'AccessPlatformInformation',
  components: { Pagination },
  filters: {
    characterCodeFilter(code) {
      if (code) {
        let text
        that.accessPlatformBelong.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.value == code) {
            text = item.label
          }
        })
        return text
      }
    },
    typeCodeFilter(code) {
      if (code) {
        let text
        that.accessPlatformKinds.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.value == code) {
            text = item.label
          }
        })
        return text
      }
    },
    functionsFilter(fn) {
      if (fn) {
        let text = ''; const fnArr = fn.split(','); const textArr = []
        fnArr.forEach(f => {
          that.platformSupportFeatures.forEach(item => {
            // eslint-disable-next-line eqeqeq
            if (item.value == f) {
              const temp = item.label
              textArr.push(temp)
            }
          })
        })
        text = textArr.join(',')
        return text
      }
    },
    serviceVehicleTypeCodeFilter(fn) {
      if (fn) {
        let text = ''; const fnArr = fn.split(','); const textArr = []
        fnArr.forEach(f => {
          that.serviceCarKinds.forEach(item => {
            // eslint-disable-next-line eqeqeq
            if (item.value == f) {
              const temp = item.label
              textArr.push(temp)
            }
          })
        })
        text = textArr.join(',')
        return text
      }
    },
    statusFilter(status) {
      if (status) {
        let text
        that.platformStatus.forEach(item => {
          if (item.value === status) {
            text = item.label
          }
        })

        return text
      }
    },
    styleFilter(status) {
      if (status) {
        let text
        that.platformStatus.forEach(item => {
          if (item.value === status) {
            text = item.label
          }
        })
        if (text === '正常') {
          return {
            'color': '#3CB371'
          }
        } else {
          return {
            'color': '#EE6666'
          }
        }
      }
    },
    keepOnRecordFilter(record) {
      let text
      that.recordStatus.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.value == record) {
          text = item.label
        }
      })
      return text
    }
  },
  data() {
    return {
      advanced: false,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        platformName: '',
        serviceVehicleTypeCode: '',
        characterCode: '',
        typeCode: '',
        functions: '',
        keepOnRecord: null,
        status: null,
        serviceArea: ''
      },
      total: 1,
      serviceCarKinds: [],
      accessPlatformBelong: [],
      accessPlatformKinds: [],
      platformSupportFeatures: [],
      serviceArea: [],
      platformStatus: [],
      recordStatus: [],
      protocolVersionOptions: [],
      allowConnectOptions: [],
      serviceAreaOptions: serviceArea.list,
      tableData: [],
      modify: false,
      dialogVisible: false,
      dialogData: {
        platformName: '',
        platformCode: '',
        userName: '',
        password: '',
        protocolVersion: '',
        contact: '',
        contactInfo: '',
        characterCode: '',
        typeCode: '',
        deviceIp: '',
        status: '',
        devicePort: '',
        ip: '',
        port: '',
        m1: '',
        ia1: '',
        ic1: '',
        allowConnect: '',
        developerName: '',
        keepOnRecord: '',
        serviceArea: [],
        functions: [],
        serviceVehicleTypeCode: []
      },
      area: [],
      rules: {
        platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
        platformCode: [{ required: true, message: '请输入平台编码', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        protocolVersion: [{ required: true, message: '请选择版本协议', trigger: 'change' }],
        characterCode: [{ required: true, message: '请选择接入平台性质', trigger: 'change' }],
        deviceIp: [{ required: true, message: '请输入终端接入IP', trigger: 'blur' }],
        devicePort: [{ required: true, message: '请输入终端接入端口', trigger: 'blur' }],
        status: [{ required: true, message: '请选择平台状态', trigger: 'change' }],
        ip: [{ required: true, message: '请输入接入平台IP', trigger: 'blur' }],
        port: [{ required: true, message: '请输入接入平台端口', trigger: 'blur' }],
        m1: [{ required: true, message: '请输入m1', trigger: 'blur' }],
        ic1: [{ required: true, message: '请输入ic1', trigger: 'blur' }],
        ia1: [{ required: true, message: '请输入ia1', trigger: 'blur' }],
        allowConnect: [{ required: true, message: '请选择是否可连接', trigger: 'change' }],
        keepOnRecord: [{ required: true, message: '请选择备案状态', trigger: 'change' }]
      },
      detail: false,
      currentRow: {},
      connectMap: new Map(),
      versionMap: new Map()
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.getQueryConditions()
    this.getProtocolVersion()
    this.getAllowConnect()
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchType(queryString, cb) {
      if (queryString) {
        this.listQuery.platformName = queryString
        platformInfoName({ platformName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.platformName
              item.value = item.platformName
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
    searchTypeService(queryString, cb) {
      if (queryString) {
        facilitatorName({ developerName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.unitName
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
    selectPlatform(item) {
      this.listQuery.platformName = item.value
    },
    selectService(item) {
      this.dialogData.developerName = item.value
    },
    getQueryConditions() {
      queryConditions()
        .then(res => {
          const { data } = res
          this.serviceCarKinds = data['服务车辆类型']
          this.accessPlatformBelong = data['接入平台性质']
          this.accessPlatformKinds = data['接入平台类型']
          this.platformSupportFeatures = data['平台支持功能']
          this.platformStatus = data['平台状态']
          this.recordStatus = data['备案状态']
          this.recordStatus.forEach(item => {
            item.value = parseInt(item.value)
          })
          this.platformStatus.forEach(item => {
            item.value = parseInt(item.value)
          })
        })
        .catch(err => {
          throw err
        })
    },
    getProtocolVersion() {
      protocolVersion()
        .then(res => {
          const { data } = res
          this.protocolVersionOptions = data
          data.forEach(item => {
            this.versionMap.set(parseInt(item.label), item.value)
          })
        })
        .catch(err => {
          throw err
        })
    },
    getAllowConnect() {
      allowConnect()
        .then(res => {
          const { data } = res
          this.allowConnectOptions = data
          data.forEach(item => {
            this.connectMap.set(parseInt(item.label), item.value)
          })
        })
        .catch(err => {
          throw err
        })
    },
    // 新增
    handleCreate() {
      this.modify = false
      this.dialogVisible = true
      this.detail = false
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        platformName: '',
        serviceVehicleTypeCode: '',
        characterCode: '',
        typeCode: '',
        functions: '',
        keepOnRecord: null,
        status: null,
        serviceArea: ''
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      selectList({ ...this.listQuery })
        .then(res => {
          const { data } = res
          this.total = data.total
          this.tableData = data.list
          this.listLoading = false
          this.tableData.forEach(item => {
            if (item.allowConnect)item.allowConnect = item.allowConnect.toString()
            if (item.protocolVersion) item.protocolVersion = item.protocolVersion.toString()
          })
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    showDetails(row) {
      this.detail = true
      this.dialogVisible = true
      this.currentRow = row
      const data = { ...row }
      if (row.serviceArea) data.serviceArea = row.serviceArea.split(',')
      if (row.functions) data.functions = row.functions.split(',')
      if (row.serviceVehicleTypeCode) data.serviceVehicleTypeCode = row.serviceVehicleTypeCode.split(',')
      this.dialogData = { ...data }
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    modifyData(row) {
      this.modify = true
      this.dialogVisible = true
      this.detail = false
      this.currentRow = row
      const data = { ...row }
      if (row.serviceArea) data.serviceArea = row.serviceArea.split(',')
      if (row.functions) data.functions = row.functions.split(',')
      if (row.serviceVehicleTypeCode)data.serviceVehicleTypeCode = row.serviceVehicleTypeCode.split(',')
      this.dialogData = { ...data }
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    resetDialogData() {
      this.dialogData = {
        platformName: '',
        platformCode: '',
        userName: '',
        password: '',
        protocolVersion: '',
        contact: '',
        contactInfo: '',
        characterCode: '',
        typeCode: '',
        deviceIp: '',
        status: '',
        devicePort: '',
        ip: '',
        port: '',
        m1: '',
        ia1: '',
        ic1: '',
        allowConnect: '',
        developerName: '',
        keepOnRecord: '',
        serviceArea: [],
        functions: [],
        serviceVehicleTypeCode: []
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.resetDialogData()
    },
    submit() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          this.dialogData.updatorName = this.$store.state.user.name
          this.dialogData.updatorNo = this.$store.state.user.userId
          this.dialogData.creatorName = this.$store.state.user.name
          this.dialogData.creatorNo = this.$store.state.user.userId
          if (this.modify) this.dialogData.platformId = this.currentRow.platformId.toString()
          const req = { ...this.dialogData }
          if (this.dialogData.serviceArea) req.serviceArea = this.dialogData.serviceArea.join(',')
          if (this.dialogData.functions) req.functions = this.dialogData.functions.join(',')
          if (this.dialogData.serviceVehicleTypeCode) req.serviceVehicleTypeCode = this.dialogData.serviceVehicleTypeCode.join(',')

          save({ ...req })
            .then(res => {
              this.dialogVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: this.modify ? '修改成功' : '新增成功！'
              })
              this.resetDialogData()
            })
            .catch(err => {
              throw err
            })
        }
      })
    },
    delData() {
      this.$confirm('确定删除该条数据？删除后无法恢复')
        .then(() => {
          deleteData({ platformId: this.currentRow.platformId.toString() })
            .then(res => {
              this.dialogVisible = false
              if (this.listQuery.pageNum !== 1 && this.tableData.length === 1) {
                this.listQuery.pageNum--
              }
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
            })
            .catch(err => {
              throw err
            })
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          throw err
        })
    }
  }
}
</script>
