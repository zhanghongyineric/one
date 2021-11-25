<!--周报管理-->
<template>
  <div class="layout-content history-code">
    <el-card class="box-card">
      <!--搜索栏-->
      <header class="table-page-search-wrapper">
        <el-form :inline="true" :model="listQuery" label-width="80px" size="small">

          <div class="f jc-sb">
            <!--基本搜索条件-->
            <div class="search-query f fw-w">
              <el-form-item label="选择平台:">
                <ChoosePlatform
                  v-model="listQuery.platform"
                  default-first-option
                  @change="getWeekList"
                  @initFinished="initFinished"
                />
              </el-form-item>
              <el-form-item label="统计周期:">
                <el-date-picker
                  v-model="listQuery.year"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                  style="width: 120px;margin-right: 10px;"
                  :picker-options="{disabledDate:disabledDate}"
                  :clearable="false"
                  @change="getWeekList"
                />
                <el-select
                  v-model="listQuery.week"
                  placeholder="无数据"
                  style="width: 100px;"
                  @change="getList"
                >
                  <el-option
                    v-for="num in weekList"
                    :key="num"
                    :label="`第${num}周`"
                    :value="num"
                  />
                </el-select>
              </el-form-item>
              <!--查询操作按钮-->
              <div
                class="table-page-search-submitButtons"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>

              </div>
            </div>

            <!--<el-button-->
            <!--  type="primary"-->
            <!--  size="small"-->
            <!--  plain-->
            <!--  class="to-report-manage"-->
            <!--  @click="$router.push({name:'ReportManage',params:{type:'week'}})"-->
            <!--&gt;-->
            <!--  周报管理-->
            <!--</el-button>-->
          </div>

          <div class="vehicle-type-query f ai-c">
            <label for="vehicleType" class="vehicle-type-label el-form-item__label">车辆统计范围:</label>
            <el-checkbox-group id="vehicleType" v-model="listQuery.vehicleType" @change="getList">
              <el-checkbox
                v-for="item in options.vehicleTypeList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

        </el-form>
      </header>

      <main class="main">
        <el-row :gutter="10">
          <el-col :span="12">
            <!--区县车辆统计情况-->
            <RegionVehicle
              ref="regionVehicle"
              :data="regionVehicleData"
              :loading="listLoading"
              style="margin-bottom: 10px;"
            />
            <!--危险驾驶事件-->
            <DangerDrive ref="dangerDrive" :data="dangerDriveData" :loading="listLoading" style="margin-bottom: 10px;" />
            <!--违章报警排名前十-->
            <ViolationTopTen :data="violationTopTenData" :loading="listLoading" style="margin-bottom: 10px;" />
            <!--主动安全报警排名-->
            <BaseTable
              title="主动安全报警排名前十"
              :data="activeSafetyTableData"
              :all-data="activeSafetyData"
              multi
              :loading="listLoading"
              :config="activeSafetyConfig"
              show-filter
              style="margin-bottom: 10px;"
            >
              <template>
                <el-radio-group v-model="activeSafetyType" size="medium">
                  <el-radio-button label="company">运输企业</el-radio-button>
                  <el-radio-button label="vehicle">营运车辆</el-radio-button>
                </el-radio-group>
              </template>
            </BaseTable>
          </el-col>
          <el-col :span="12">
            <!--车辆基本情况统计-->
            <VehicleStatistics
              ref="vehicleStatistics"
              :data="vehicleStatisticsData"
              :vehicle-type="selectedVehicle"
              :loading="listLoading"
              style="margin-bottom: 10px;"
            />
            <!--车辆违章类型报警趋势-->
            <VehicleTendency
              ref="regionVehicle"
              :data="vehicleTendencyData"
              :loading="listLoading"
              type="week"
              style="margin-bottom: 10px;"
            />
            <!--车辆违章报警排名前十-->
            <VehicleTopTen :data="vehicleTopTenData" :loading="listLoading" />
          </el-col>
        </el-row>
      </main>
    </el-card>
  </div>
</template>

<script>

import ChoosePlatform from '@/components/ChoosePlatform'
import RegionVehicle from '@/views/monitor-report/components/RegionVehicle'
import VehicleStatistics from '@/views/monitor-report/components/VehicleStatistics'
import DangerDrive from '@/views/monitor-report/components/DangerDrive'
import VehicleTendency from '@/views/monitor-report/components/VehicleTendency'
import ViolationTopTen from '@/views/monitor-report/components/ViolationTopTen'
import VehicleTopTen from '@/views/monitor-report/components/VehicleTopTen'
import { netGetWeekData, netGetWeek } from '@/api/monitor-report'
import BaseTable from '@/views/monitor-report/components/BaseTable'

const onlineOptions = JSON.parse(localStorage.getItem('onlineOption'))
export default {
  name: 'WeekReport',
  components: {
    BaseTable,
    VehicleTopTen,
    ViolationTopTen,
    VehicleTendency,
    DangerDrive,
    VehicleStatistics,
    RegionVehicle,
    ChoosePlatform
  },
  data() {
    const currentYear = new Date().getFullYear().toString()

    return {
      hasWeek: false, // 是否有周的数据
      hasPlatform: false, // 是否有平台数据
      currentWeek: '', // 当前最新数据的周
      currentYear, // 当前年份
      weekList: [], // 当前年中有数据的周列表
      listLoading: true, // 加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      options: {
        vehicleTypeList: onlineOptions.monitor_report_vehicle_type.list
      },
      listQuery: { // 查询条件
        platform: null, // 平台
        year: currentYear, // 年份
        week: null,
        vehicleType: []// 车辆类型
      },
      listQueryTemp: { // 用于重置查询条件
        platform: null, // 平台
        year: currentYear, // 年份
        week: null, // 周
        vehicleType: []// 车辆类型
      },
      regionVehicleData: {
        tableHead: [],
        tableData: []
      }, // 区县车辆统计情况数据
      vehicleStatisticsData: [], // 车辆基本情况统计数据
      dangerDriveData: {
        ADAS: {
          tableHead: [],
          tableData: []
        },
        DSM: {
          tableHead: [],
          tableData: []
        }
      }, // 危险驾驶事件数据
      vehicleTendencyData: {
        chartData: [],
        tableData: []
      }, // 车辆违章类型报警趋势数据
      violationTopTenData: {
        company: [],
        vehicle: []
      }, // 违章报警前十
      vehicleTopTenData: [[], [], [], []], // 车辆违章报警前十
      activeSafetyTableHead: {
        company: [
          { label: '排序', prop: 'index' },
          { label: '企业名称', prop: 'unitName' },
          { label: '报警总数', prop: 'alarmCount' },
          { label: 'adas报警数', prop: 'adasAlarmCount' },
          { label: 'dsm报警数', prop: 'dsmAlarmCount' },
          { label: '环比（%）', prop: 'relativeRatio' }
        ],
        vehicle: [
          { label: '排序', prop: 'index' },
          { label: '车牌号', prop: 'plateNum' },
          { label: '企业名称', prop: 'unitName' },
          { label: '报警总数', prop: 'alarmCount' },
          { label: 'adas报警数', prop: 'adasAlarmCount' },
          { label: 'dsm报警数', prop: 'dsmAlarmCount' },
          { label: '环比（%）', prop: 'relativeRatio' }
        ]
      },
      activeSafetyData: {
        company: [],
        vehicle: []
      }, // 主动安全报警
      activeSafetyType: 'company',
      activeSafetyConfig: {
        company: {
          sheetName: '运输企业'
        },
        vehicle: {
          sheetName: '营运车辆',
          header: ['排序', '车牌号', '企业名称', '报警总数', 'adas报警数', 'dsm报警数', '环比（%）'],
          filterVal: ['index', 'plateNum', 'unitName', 'alarmCount', 'adasAlarmCount', 'dsmAlarmCount', 'relativeRatio']
        }
      }
    }
  },
  computed: {
    // 选中的车辆类型
    selectedVehicle() {
      return this.listQuery.vehicleType.map(type => onlineOptions.monitor_report_vehicle_type.map[type])
    },
    // 主动安全表格数据
    activeSafetyTableData() {
      return {
        tableHead: this.activeSafetyTableHead[this.activeSafetyType],
        tableData: this.activeSafetyData[this.activeSafetyType]
      }
    }
  },
  created() {
    const vehicleType = onlineOptions.monitor_report_vehicle_type

    // 车辆类型默认全部选中
    this.listQuery.vehicleType = this.listQueryTemp.vehicleType = vehicleType.list.map(item => item.value)
  },
  methods: {
    // 重置表格数据
    resetTableData() {
      this.regionVehicleData = {
        tableHead: [],
        tableData: []
      } // 区县车辆统计情况数据
      this.vehicleStatisticsData = [] // 车辆基本情况统计数据
      this.dangerDriveData = {
        ADAS: {
          tableHead: [],
          tableData: []
        },
        DSM: {
          tableHead: [],
          tableData: []
        }
      } // 危险驾驶事件数据
      this.vehicleTendencyData = {
        chartData: [],
        tableData: []
      } // 车辆违章类型报警趋势数据
      this.violationTopTenData = {
        company: [],
        vehicle: []
      }// 违章报警前十
      this.vehicleTopTenData = [[], [], [], []] // 车辆违章报警前十
      this.activeSafetyData = {
        company: [],
        vehicle: []
      } // 主动安全报警
      this.activeSafetyType = 'company'
    },
    // 获取周
    getWeekList(type) {
      netGetWeek({ year: this.listQuery.year, plateId: this.listQuery.platform }).then(res => {
        const week = res.data.length ? res.data[0] : null

        this.listQuery.week = week
        if (type === 'init') this.currentWeek = week
        else this.resetTableData()
        this.weekList = res.data
        this.hasWeek = true

        if (this.hasPlatform && this.listQuery.week) this.getList()
        else this.listLoading = false
      })
    },
    // 禁用日期
    disabledDate(date) {
      return +date.getFullYear() > +this.currentYear
    },
    // 平台加载完成回调
    initFinished(platForm) {
      this.hasPlatform = true
      this.listQuery.platform = this.listQueryTemp.platform = platForm
      if (platForm) this.getWeekList('init')
      else this.listLoading = false
    },
    // 点击搜索
    handleSearch() {
      this.getList()
    },
    // 获取周报数据
    getList() {
      if (!this.listQuery.platform) return this.$message.warning('请先选择平台')
      if (this.weekList.length === 0) return this.$message.warning('所选年份中没有数据')
      const params = {
        plateId: this.listQuery.platform,
        vehicleTypes: this.listQuery.vehicleType.join(','),
        circle: `${this.listQuery.year}-${this.listQuery.week}`// 周期
      }

      this.listLoading = true
      netGetWeekData(params).then(({ data }) => {
        // 区县车辆统计情况
        this.regionVehicleData = {
          tableHead: data.regionVehicleInfo.tableHead,
          tableData: data.regionVehicleInfo.tableData
        }
        // 危险驾驶事件
        this.dangerDriveData = {
          ADAS: {
            tableHead: data.adas.tableHead,
            tableData: data.adas.tableData
          },
          DSM: {
            tableHead: data.dsm.tableHead,
            tableData: data.dsm.tableData
          }
        }
        // 车辆基本情况统计
        this.vehicleStatisticsData = data.vehicleBaseInfo
        // 车辆违章类型报警趋势表格和图表
        this.vehicleTendencyData = {
          tableData: data.violation,
          chartData: data.violationTrend
        }
        // 违章报警前十
        this.violationTopTenData = {
          company: data.unitRank,
          vehicle: data.vehicleRank
        }
        // 车辆违章报警前十
        this.vehicleTopTenData = data.vehicleViolationAlarmRank
        // 主动安全报警
        this.activeSafetyData = {
          company: data.unitTopAlarmRank.map((item, index) => ({ ...item, index: index + 1 })),
          vehicle: data.vehicleTopAlarmRank.map((item, index) => ({ ...item, index: index + 1 }))
        }
        this.listLoading = false
      }).catch(_ => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getWeekList()
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.box-card {
  width: 100%;
}

.to-report-manage {
  //float: right;
  height: 32px;
}

.main {
  .choose-platform {
    line-height: 150px;
    text-align: center;
  }

  ::v-deep .el-card__header {
    padding: 10px;
  }
}

.vehicle-type-label {
  width: 108px;
  flex-shrink: 0;
}
</style>
