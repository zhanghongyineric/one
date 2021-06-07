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
                  placeholder="请输入平台名称"
                  :debounce="500"
                  @select="selectPlatform"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="服务车辆类型:">
                <el-select v-model="listQuery.serviceVehicleTypeCode" placeholder="请选择服务车辆类型">
                  <el-option
                    v-for="item in serviceCarKinds"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="接入平台性质:">
                  <el-select v-model="listQuery.characterCode" placeholder="请选择接入平台性质">
                    <el-option
                      v-for="item in accessPlatformBelong"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="接入平台类型:">
                  <el-select v-model="listQuery.typeCode" placeholder="请选择接入平台类型">
                    <el-option
                      v-for="item in accessPlatformKinds"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="平台支持功能:">
                  <el-select v-model="listQuery.functions" placeholder="请选择平台支持功能">
                    <el-option
                      v-for="item in platformSupportFeatures"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :md="8" :sm="24">
                <el-form-item label="服务地区:">
                  <el-select v-model="listQuery.serviceArea" placeholder="请选择服务地区范围">
                    <el-option
                      v-for="item in serviceArea"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :md="8" :sm="24">
                <el-form-item label="平台状态:">
                  <el-select v-model="listQuery.status" placeholder="请选择平台状态">
                    <el-option
                      v-for="item in platformStatus"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="备案状态:">
                  <el-select v-model="listQuery.keepOnRecord" placeholder="请选择备案状态">
                    <el-option
                      v-for="item in recordStatus"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
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
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="platformName" label="平台名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="platformCode" label="平台编码" min-width="80" show-overflow-tooltip />
        <el-table-column prop="developerName" label="服务商名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="serviceArea" label="服务地区范围" min-width="150" show-overflow-tooltip />
        <el-table-column prop="keepOnRecord" label="是否备案" min-width="100" show-overflow-tooltip />
        <!-- <el-table-column prop="number" label="传真" min-width="130" /> -->
        <el-table-column prop="status" label="平台状态" min-width="90" />
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
        top="20px"
        :before-close="closeDialog"
      >
        <el-form ref="dialogForm" :rules="rules" :model="dialogData" label-width="120px">
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
                <el-select v-model="dialogData.protocolVersion" placeholder="请选择版本协议">
                  <el-option
                    v-for="item in protocolVersionOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
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
                <el-select v-model="dialogData.characterCode" placeholder="请选择接入平台性质">
                  <el-option
                    v-for="item in accessPlatformBelong"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台类型：" prop="typeCode ">
                <el-select v-model="dialogData.typeCode" placeholder="请选择接入平台类型">
                  <el-option
                    v-for="item in accessPlatformKinds"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
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
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
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
                <el-select v-model="dialogData.allowConnect" placeholder="请选择是否可连接">
                  <el-option
                    v-for="item in allowConnectOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务商名称：" prop="developerName">
                <el-input v-model="dialogData.developerName" placeholder="请输入服务商名称" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="备案状态：" prop="keepOnRecord">
                <el-select v-model="dialogData.keepOnRecord" placeholder="请选择备案状态">
                  <el-option
                    v-for="item in recordStatus"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24" :sm="24">
              <el-form-item label="服务地区范围：" prop="serviceArea">
                <el-select
                  v-model="dialogData.serviceArea"
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
          <el-form-item label="平台支持功能：" prop="functions">
            <el-checkbox-group
              v-model="dialogData.functions"
            >
              <el-checkbox v-for="item in platformSupportFeatures" :key="item.label" :label="item.label">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="服务车辆类型：" prop="serviceVehicleTypeCode">
            <el-checkbox-group
              v-model="dialogData.serviceVehicleTypeCode"
            >
              <el-checkbox v-for="item in serviceCarKinds" :key="item.label" :label="item.label">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span v-if="detail" style="margin-left: 35%">
          <el-button type="primary" @click="delData()">删除</el-button>
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
import RemoteSearch from '../../../components/RemoteSearch/select'

export default {
  name: 'AccessPlatformInformation',
  components: { Pagination, RemoteSearch },
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
  watch: {
    // platformSupportFeatures: function(newVal, oldVal) {
    //   const functionsMap = new Map()
    //   newVal.forEach(item => {
    //     functionsMap.set(item.label, item.value)
    //   })
    //   this.tableData.forEach(item => {
    //     const fnArr = item.functions.split(',')
    //   const fnText = []
    //     fnArr.forEach(code => {
    //       fnText.push(functionsMap.get(code))
    //     })
    //     item.functions = fnText.join(',')
    //   })
    // },
    recordStatus: function(newVal, oldVal) {
      const recordsMap = new Map()
      newVal.forEach(item => {
        recordsMap.set(parseInt(item.label), item.value)
      })
      this.tableData.forEach(item => {
        item.keepOnRecord = recordsMap.get(item.keepOnRecord)
      })
    },
    platformStatus: function(newVal, oldVal) {
      const statusMap = new Map()
      newVal.forEach(item => {
        statusMap.set(parseInt(item.label), item.value)
      })
      this.tableData.forEach(item => {
        item.status = statusMap.get(item.status)
      })
    }
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
        facilitatorName({ developerName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.unitName
              item.value = item.unitName
            })
            cb(res.data)
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
      this.listQuery.platformName = item.value
      this.getList()
    },
    getQueryConditions() {
      queryConditions()
        .then(res => {
          const { data } = res
          console.log(res)
          this.serviceCarKinds = data['服务车辆类型']
          this.accessPlatformBelong = data['接入平台性质']
          this.accessPlatformKinds = data['接入平台类型']
          this.platformSupportFeatures = data['平台支持功能']
          this.platformStatus = data['平台状态']
          this.recordStatus = data['备案状态']
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
    handleCreate() {
      this.modify = false
      this.dialogVisible = true
      this.detail = false
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
            item.allowConnect = this.connectMap.get(item.allowConnect)
            item.protocolVersion = this.versionMap.get(item.protocolVersion)
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
      data.serviceArea = row.serviceArea.split(',')
      data.functions = row.functions.split(',')
      data.serviceVehicleTypeCode = row.serviceVehicleTypeCode.split(',')
      this.dialogData = { ...data }
    },
    modifyData(row) {
      this.modify = true
      this.dialogVisible = true
      this.detail = false
      this.currentRow = row
      const data = { ...row }
      data.serviceArea = row.serviceArea.split(',')
      data.functions = row.functions.split(',')
      data.serviceVehicleTypeCode = row.serviceVehicleTypeCode.split(',')
      this.dialogData = { ...data }
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
        serviceArea: '',
        functions: '',
        serviceVehicleTypeCode: ''
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
          if (this.modify) this.dialogData.id = this.currentRow.id
          const req = { ...this.dialogData }
          req.serviceArea = this.dialogData.serviceArea.join(',')
          req.functions = this.dialogData.functions.join(',')
          req.serviceVehicleTypeCode = this.dialogData.serviceVehicleTypeCode.join(',')

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
      this.$confirm('确定删除该条数据？')
        .then(() => {
          deleteData({ id: this.currentRow.id })
            .then(res => {
              this.dialogVisible = false
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
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
