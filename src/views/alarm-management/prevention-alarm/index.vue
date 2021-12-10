<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-row :gutter="12">
          <el-form :model="listQuery" label-width="80px">
            <el-col :md="4" :sm="24">
              <el-form-item label="地区:">
                <el-cascader
                  v-model="listQuery.deptId"
                  size="small"
                  :options="searchCityOptions"
                  placeholder="请选择地区"
                  style="width:100%;"
                  :disabled="disabled"
                  :props="areaProps"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="查询时间:">
                <el-date-picker
                  v-model="listQuery.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="请选择时间范围"
                  size="small"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="车牌号:">
                <el-input
                  v-model="listQuery.plateNum"
                  size="small"
                  placeholder="请输入车牌号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <template v-if="advanced">
              <el-col :md="5" :sm="12">
                <el-form-item label="企业:">
                  <el-input v-model="listQuery.unitName" placeholder="请选择企业" size="small" style="margin-top:4px;">
                    <el-button slot="append" icon="el-icon-plus" @click="companyVisible = true" />
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="驾驶员:">
                  <el-input
                    v-model="listQuery.driverName"
                    size="small"
                    placeholder="请输入驾驶员姓名"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :md="4" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select
                    v-model="listQuery.vehicleTypeCodes"
                    size="small"
                    placeholder="请选择车辆类型"
                    multiple
                  >
                    <el-option
                      v-for="{label,value} in vehicleTypes"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警类型:">
                  <el-select
                    v-model="listQuery.cbArmType"
                    size="small"
                    placeholder="请选择报警类型"
                    multiple
                  >
                    <el-option :value="listQuery.cbArmType" class="selece-tree">
                      <el-tree
                        ref="alarmTypeTree"
                        :data="alarmTypeTree"
                        :props="defaultProps"
                        style="min-height: 200px;"
                        show-checkbox
                        @check="checkAlarmType"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警分级:">
                  <el-select
                    v-model="listQuery.alarmLevel"
                    size="small"
                    placeholder="请选择报警分级"
                  >
                    <el-option
                      v-for="{label,value} in alarmLevels"
                      :key="value"
                      :value="value"
                      :label="label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="处理状态:">
                  <el-select
                    v-model="listQuery.cbHandleStatus"
                    size="small"
                    placeholder="请选择处理状态"
                  >
                    <el-option value="1" label="已处理" />
                    <el-option value="0" label="未处理" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警来源:">
                  <el-select
                    v-model="listQuery.sourceCode"
                    size="small"
                    placeholder="请选择报警来源"
                  >
                    <el-option
                      v-for="{label,value} in alarmSource"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :md="!advanced && 5 || 19" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
            <el-col :md="5" :sm="24" style="margin-top:3px;">
              <el-button type="primary" size="small" @click="dowloadExcel">表格导出</el-button>
              <el-button type="primary" size="small" @click="batchHandle">批量处理</el-button>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="selection"
          width="60"
          fixed="left"
        />
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column label="操作" align="center" fixed="left" width="120px">
          <template slot-scope="scope">
            <i v-if="scope.row.cbHandleStatus === 1" class="el-icon-edit-outline icon-disabled" />
            <i v-else class="el-icon-edit-outline icon" @click="openHandleDialog(scope.row)" />
            <i class="el-icon-view icon icon-spacing" @click="detailVisible = true" />
            <i class="el-icon-data-line icon icon-spacing" @click="trajectoryVisible = true" />
          </template>
        </el-table-column>
        <el-table-column label="车牌号" prop="plateNum" min-width="100px" align="center" fixed="left" />
        <el-table-column label="车牌颜色" prop="plateColorCode" min-width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.plateColorCode | plateColorFilter }}
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" prop="vehicleTypeCode" min-width="120px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.vehicleTypeCode | vehicleTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="驾驶员" prop="driverName" min-width="100px" align="center" />
        <el-table-column label="所属企业" prop="unitName" min-width="150px" align="center" show-overflow-tooltip />
        <el-table-column label="报警类型" prop="cbArmName" min-width="150px" align="center" show-overflow-tooltip />
        <el-table-column label="程度/分级" prop="alarmType" align="center" min-width="100px" />
        <el-table-column label="报警来源" prop="sourceCode" align="center" min-width="120px">
          <template slot-scope="scope">
            {{ scope.row.sourceCode | sourceCodeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="armTimeStart" min-width="160px" align="center" />
        <el-table-column label="结束时间" prop="armTimeEnd" min-width="160px" align="center" />
        <el-table-column label="报警时长" prop="alarmTime" align="center" min-width="100px" />
        <el-table-column label="开始速度" prop="startSpeed" align="center" min-width="100px" />
        <el-table-column label="结束速度" prop="endSpeed" align="center" min-width="100px" />
        <el-table-column label="开始位置" prop="startPosition" min-width="250px" align="center" show-overflow-tooltip />
        <el-table-column label="结束位置" prop="endPosition" min-width="250px" align="center" show-overflow-tooltip />
        <el-table-column label="报警信息" prop="" align="center" min-width="150px" />
        <el-table-column label="处理状态" prop="cbHandleStatus" align="center" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.cbHandleStatus === 1" style="color:#42B983;">已处理</span>
            <span v-else style="color:#F56C6C;">未处理</span>
          </template>
        </el-table-column>
        <el-table-column label="处理方式" prop="cbHandleModeCode" align="center" min-width="100px" />
        <el-table-column label="处理时间" prop="cbHandleTime" min-width="160px" align="center" />
        <el-table-column label="备注内容" prop="cbHandleInfo" align="center" min-width="100px" show-overflow-tooltip />
        <el-table-column label="处理人" prop="cbHandlerName" align="center" min-width="100px" />
      </el-table>
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        class="pagination"
        @pagination="getList"
      />
      <CompanySelect
        :visible="companyVisible"
        @close="updateVisible"
        @selected-unit="getSelectedUnit"
      />
      <HandleAlarm
        :rows="currentRow"
        :visible="handleVisible"
        @close="updateVisible"
        @update-date="getList"
      />
      <AlarmDetail :visible="detailVisible" @close="updateVisible" />
      <HistoricalTrajectory :visible="trajectoryVisible" @close="updateVisible" />
    </el-card>
  </div>
</template>

<script>
import CompanySelect from '../component/company-select.vue'
import HandleAlarm from '../component/handle-alarm.vue'
import AlarmDetail from '../component/alarm-detail.vue'
import HistoricalTrajectory from '../component/historical-trajectory.vue'
import Pagination from '@/components/Pagination'
import {
  activeDefenseAlarmType,
  areaCode,
  selectAlarm
} from '@/api/alarm-management/prevention-alarm'

// 字典
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
let that

export default {
  name: 'PreventionAlarm',
  components: {
    CompanySelect,
    HandleAlarm,
    AlarmDetail,
    HistoricalTrajectory,
    Pagination
  },
  filters: {
    plateColorFilter(code) {
      return that.plateColorMap[code]
    },
    vehicleTypeFilter(code) {
      return that.vehicleTypeMap[code]
    },
    sourceCodeFilter(code) {
      return that.alarmSourceMap[code]
    }
  },
  data() {
    return {
      // 搜索条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        deptId: '',
        sourceCode: '',
        unitIds: [],
        plateNum: '',
        driverName: '',
        vehicleTypeCodes: [],
        cbArmType: [],
        alarmLevel: '',
        cbHandleStatus: null,
        startTime: '',
        endTime: '',
        flag: '1',
        time: [],
        unitName: ''
      },
      total: 0, // 数据总数
      listLoading: false,
      searchCityOptions: [], // 搜索条件地区选项
      disabled: false, // 禁用搜索地区
      advanced: false, // 是否展开搜索框
      tableData: [], // 表格数据
      companyVisible: false, // 企业选择框
      handleVisible: false, // 报警处理框
      detailVisible: false, // 报警详情弹框
      trajectoryVisible: false, // 历史轨迹弹框
      areaProps: {
        label: 'unitName',
        value: 'unitId',
        expandTrigger: 'hover'
      },
      alarmSource: [], // 报警来源选项
      alarmSourceMap: {}, // 报警来源对象
      vehicleTypes: [], // 车辆类型选项
      vehicleTypeMap: {}, // 车辆类型对象
      alarmLevels: [], // 报警等级选项
      plateColorMap: {}, // 车牌颜色对象
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.choiceDate) {
            const startDay = (new Date(this.choiceDate).getDate() - 1) * 24 * 3600 * 1000
            const endDay = (new Date(new Date(this.choiceDate).getFullYear(), new Date(this.choiceDate).getMonth() + 1, 0).getDate() - new Date(this.choiceDate).getDate()) * 24 * 3600 * 1000
            const minTime = this.choiceDate - startDay
            const maxTime = this.choiceDate + endDay
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      currentRow: [], // 当前操作行
      alarmTypeTree: [], // 报警类型树数据
      defaultProps: {
        children: 'children',
        label: 'violationName'
      },
      choiceDate: '' // 限制选择日期
    }
  },
  created() {
    that = this
    this.alarmSource = onlineOption['数据来源'].list
    this.alarmSourceMap = onlineOption['数据来源'].map
    this.vehicleTypes = onlineOption['vehicle_type_code'].list
    this.vehicleTypeMap = onlineOption['vehicle_type_code'].map
    this.alarmLevels = onlineOption['alarm_level'].list
    this.plateColorMap = onlineOption['车牌颜色编码'].map
  },
  mounted() {
    this.getDate()
    this.getAreaCode()
    this.getAlarmType()
    this.getList()
  },
  methods: {
    // 获取本月初到当前日期
    getDate() {
      const date = new Date()
      const month = date.getMonth() + 1
      const day = date.getDate()
      this.listQuery.time = [`2021-${month}-01`, `2021-${month}-${day}`]
    },
    // 查询报警信息
    getList() {
      this.listLoading = true
      this.setListQuery()
      selectAlarm({ ...this.listQuery })
        .then(({ data }) => {
          this.tableData = data.list
          this.total = data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 转换部分搜索条件的数据格式
    setListQuery() {
      const { time } = this.listQuery
      this.listQuery.startTime = time[0]
      this.listQuery.endTime = time[1]
      if (Array.isArray(this.listQuery.deptId)) {
        this.listQuery.deptId = this.listQuery.deptId[1]
      }
      if (Array.isArray(this.listQuery.cbHandleStatus)) {
        this.listQuery.cbHandleStatus = null
      }
      if (Array.isArray(this.listQuery.alarmLevel)) {
        this.listQuery.alarmLevel = ''
      }
    },
    // 获取报警类型
    getAlarmType() {
      activeDefenseAlarmType()
        .then(({ data }) => {
          this.alarmTypeTree = data
        })
        .catch(err => {
          throw err
        })
    },
    // 获取地区
    getAreaCode() {
      areaCode()
        .then(({ data }) => {
          for (let i = 0; i < data.length; i++) {
            this.deleteEmptyChilren(data[i])
          }
          this.searchCityOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 删除地区最后的空 chilren
    deleteEmptyChilren(data) {
      data.children.length === 0 ? data.children = null : data.children.forEach(v => this.deleteEmptyChilren(v))
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        deptId: '',
        sourceCode: '',
        unitIds: [],
        plateNum: '',
        driverName: '',
        vehicleTypeCodes: [],
        cbArmType: [],
        alarmLevel: '',
        cbHandleStatus: null,
        startTime: '',
        endTime: '',
        flag: '1',
        time: []
      }
      this.getDate()
      this.getList()
    },
    // 点击搜索按钮
    handleSearch() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 监听弹框是否显示
    updateVisible(val) {
      this.companyVisible = val
      this.handleVisible = val
      this.detailVisible = val
      this.trajectoryVisible = val
      this.currentRow = []
    },
    // 打开处理弹框
    openHandleDialog(row) {
      this.currentRow.push(row)
      this.handleVisible = true
    },
    // 批量处理
    batchHandle() {
      this.currentRow = this.$refs.table.selection
      this.handleVisible = true
    },
    // 表格导出
    dowloadExcel() {},
    // 获取选中的企业
    getSelectedUnit(unit) {
      unit.forEach(item => {
        this.listQuery.unitName = this.listQuery.unitName + ' ' + item.unitName
        this.listQuery.unitIds.push(item.unitId)
      })
    },
    // 选择报警类型
    checkAlarmType() {
      this.listQuery.cbArmType = []
      const nodes = this.$refs.alarmTypeTree.getCheckedNodes(true)
      nodes.forEach(item => {
        this.listQuery.cbArmType.push(item.violationCode)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  font-size:20px;
  color:#409EFF;
  cursor: pointer;
}

.icon-disabled {
  font-size:20px;
  color:#ccc;
}

.icon-spacing {
  margin-left: 10px;
}

.selece-tree {
  width:320px;
  height:240px;
  overflow:auto;
  background-color:#fff;
}
</style>
