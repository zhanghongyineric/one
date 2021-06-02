<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="平台名称:">
                <el-input v-model="listQuery.accountType" placeholder="请输入平台名称" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车辆类型:">
                <el-select v-model="listQuery.accountType" placeholder="请选择服务车辆类型">
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
                <el-form-item label="平台性质:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择接入平台性质">
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
                <el-form-item label="平台类型:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择接入平台类型">
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
                <el-form-item label="平台功能:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择平台支持功能">
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
                <el-form-item label="服务地区:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择服务地区范围">
                    <el-option
                      v-for="item in serviceArea"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="平台状态:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择平台状态">
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
                  <el-select v-model="listQuery.accountType" placeholder="请选择备案状态">
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
        <el-table-column prop="name" label="平台名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="code" label="平台编码" min-width="100" show-overflow-tooltip />
        <el-table-column prop="feature" label="平台支持功能" min-width="110" show-overflow-tooltip />
        <el-table-column prop="adress" label="地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="beian" label="是否备案" min-width="150" show-overflow-tooltip />
        <el-table-column prop="number" label="传真" min-width="130" />
        <el-table-column prop="status" label="状态" min-width="130" />
        <el-table-column fixed="right" label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row.id,scope.$index)"
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
      >
        <el-form :rules="rules" :model="dialogData" label-width="120px">
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台名称：" prop="name">
                <el-input v-model="dialogData.name" placeholder="请输入平台名称" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台编码：" prop="code">
                <el-input v-model="dialogData.code" placeholder="请输入平台编码" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="用户名：" prop="username">
                <el-input v-model="dialogData.username" placeholder="请输入用户名" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="dialogData.password" placeholder="请输入密码" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="版本协议：" prop="rule">
                <el-select v-model="dialogData.rule" placeholder="请选择版本协议">
                  <el-option label="全部" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="联系人：" prop="person">
                <el-input v-model="dialogData.person" placeholder="请输入联系人" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="联系电话：" prop="tel">
                <el-input v-model="dialogData.tel" placeholder="请输入联系电话" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台性质：" prop="belong">
                <el-select v-model="dialogData.belong" placeholder="请选择接入平台性质">
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
              <el-form-item label="接入平台类型：" prop="type">
                <el-select v-model="dialogData.type" placeholder="请选择接入平台类型">
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
              <el-form-item label="终端接入IP：" prop="ip">
                <el-input v-model="dialogData.ip" placeholder="请输入终端接入IP" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="终端接入端口：" prop="port">
                <el-input v-model="dialogData.port" placeholder="请输入终端接入端口" size="small" />
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
              <el-form-item label="接入平台IP：" prop="pip">
                <el-input v-model="dialogData.pip" placeholder="请输入接入平台IP" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="接入平台端口：" prop="pport">
                <el-input v-model="dialogData.pport" placeholder="请输入接入平台端口" size="small" />
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
              <el-form-item label="是否可连接：" prop="concat">
                <el-select v-model="dialogData.concat" placeholder="请选择是否可连接">
                  <el-option label="是" :value="true" />
                  <el-option label="否" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务商名称：" prop="sname">
                <el-input v-model="dialogData.sname" placeholder="请输入服务商名称" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="备案状态：" prop="beian">
                <el-select v-model="dialogData.beian" placeholder="请选择备案状态">
                  <el-option label="已备案" :value="true" />
                  <el-option label="未备案" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24" :sm="24">
              <el-form-item label="服务地区范围：" prop="area">
                <AreaSelect v-model="area" size="small" limit-area :area-text.sync="dialogData.adress" @update:areaText="setAreaText" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="平台支持功能：" prop="feature">
            <el-checkbox-group
              v-model="dialogData.feature"
            >
              <el-checkbox v-for="item in platformSupportFeaturesNotAll" :key="item.value" :label="item.label">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="服务车辆类型：" prop="carType">
            <el-checkbox-group
              v-model="dialogData.carType"
            >
              <el-checkbox v-for="item in serviceCarKindsNotAll" :key="item.value" :label="item.label">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span style="margin-left: 35%">
          <el-button type="primary" @click="submit()">保存</el-button>
          <el-button type="primary" @click="submit()">关闭</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {
  serviceCarKinds,
  accessPlatformBelong,
  accessPlatformKinds,
  platformSupportFeatures,
  serviceArea,
  platformStatus,
  recordStatus,
  platformSupportFeaturesNotAll,
  serviceCarKindsNotAll
} from '@/options'
import Pagination from '@/components/Pagination'
import AreaSelect from '@/components/AreaSelect'

export default {
  name: 'AccessPlatformInformation',
  components: { Pagination, AreaSelect },
  data() {
    return {
      advanced: false,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: '',
        accountType: '',
        account: ''
      },
      total: 1,
      serviceCarKinds: serviceCarKinds.list,
      accessPlatformBelong: accessPlatformBelong.list,
      accessPlatformKinds: accessPlatformKinds.list,
      platformSupportFeatures: platformSupportFeatures.list,
      serviceArea: serviceArea.list,
      platformStatus: platformStatus.list,
      recordStatus: recordStatus.list,
      platformSupportFeaturesNotAll: platformSupportFeaturesNotAll.list,
      serviceCarKindsNotAll: serviceCarKindsNotAll.list,
      tableData: [
        {
          name: '四川明亚智行',
          code: '510266',
          feature: '行驶记录仪',
          adress: '成都市西部智谷',
          beian: '已备案',
          number: '0817-13598443',
          status: '正常'
        }
      ],
      modify: false,
      dialogVisible: false,
      dialogData: {
        adress: '',
        feature: [],
        carType: []
      },
      area: [],
      rules: {
        name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入平台编码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        rule: [{ required: true, message: '请选择版本协议', trigger: 'change' }],
        belong: [{ required: true, message: '请选择接入平台性质', trigger: 'change' }],
        belong: [{ required: true, message: '请选择接入平台性质', trigger: 'change' }],
        ip: [{ required: true, message: '请输入终端接入IP', trigger: 'blur' }],
        port: [{ required: true, message: '请输入终端接入端口', trigger: 'blur' }],
        status: [{ required: true, message: '请选择平台状态', trigger: 'change' }],
        pip: [{ required: true, message: '请输入接入平台IP', trigger: 'blur' }],
        pport: [{ required: true, message: '请输入接入平台端口', trigger: 'blur' }],
        m1: [{ required: true, message: '请输入m1', trigger: 'blur' }],
        ic1: [{ required: true, message: '请输入ic1', trigger: 'blur' }],
        ia1: [{ required: true, message: '请输入ia1', trigger: 'blur' }],
        concat: [{ required: true, message: '请选择是否可连接', trigger: 'change' }],
        beian: [{ required: true, message: '请选择备案状态', trigger: 'change' }]
      }
    }
  },
  mounted() {
    console.log(this.serviceCarKindsNotAll)
  },
  methods: {
    handleSearch() {},
    handleCreate() {
      this.modify = false,
      this.dialogVisible = true
    },
    resetQuery() {},
    getList() {},
    showDetails() {},
    modifyData(row) {
      this.dialogData = { ...row }
      this.modify = true
      this.dialogVisible = true
    },
    setAreaText(data) {
      this.dialogData.adress = data
    }
  }
}
</script>
