<!--月报管理-->
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
                  @initFinished="platformInitFinished"
                  @change="getMonthList"
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
                  @change="getMonthList"
                />
                <el-select
                  v-model="listQuery.month"
                  placeholder="无数据"
                  style="width: 100px;"
                  @change="getList"
                >
                  <el-option
                    v-for="num in monthList"
                    :key="num"
                    :label="`第${num}月`"
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
            <!--  @click="$router.push({name:'ReportManage',params:{type:'month'}})"-->
            <!--&gt;-->
            <!--  月报管理-->
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
        <div v-show="!listQuery.platform" class="choose-platform"><i class="el-icon-warning" />请先选择平台</div>

        <el-row v-show="listQuery.platform" :gutter="10">
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
            <!--运输企业考核后十名-->
            <!--<BaseTable title="运输企业考核后十名" :data="endTenData" :loading="listLoading" style="margin-bottom: 10px;" />-->
            <!--主动安全报警类型环比-->
            <BaseTable title="主动安全报警类型环比" :data="activeSafetyData" :loading="listLoading" style="margin-bottom: 10px;" />
          </el-col>
          <el-col :span="12">
            <!--车辆基本情况统计-->
            <VehicleStatistics
              ref="vehicleStatistics"
              :data="vehicleStatisticsData"
              :loading="listLoading"
              :vehicle-type="selectedVehicle"
              style="margin-bottom: 10px;"
            />
            <!--车辆违章类型报警趋势-->
            <VehicleTendency
              ref="regionVehicle"
              :data="vehicleTendencyData"
              :loading="listLoading"
              type="month"
              style="margin-bottom: 10px;"
            />
            <!--服务商考核-->
            <!--<BaseTable title="服务商考核" :data="facilitatorData" :loading="listLoading" style="margin-bottom: 10px;" />-->
            <!--高风险名单分析-->
            <BaseTable
              title="高风险名单分析"
              :data="dangerListData"
              :all-data="dangerListData.tableDataAll"
              :loading="listLoading"
              :config="{
                title:'高风险报警名单分析',
                company:{
                  sheetName:'运输企业',
                  header:['序号','企业','累计进入报警名单次数']
                },
                vehicle:{
                  sheetName:'营运车辆',
                  header:['序号','车牌号','累计进入报警名单次数']
                },
              }"
              show-filter
              multi
              style="margin-bottom: 10px;"
            >
              <template>
                <el-radio-group v-model="dangerListType" size="medium" @change="filterActiveSafetyData">
                  <el-radio-button label="company">运输企业</el-radio-button>
                  <el-radio-button label="vehicle">营运车辆</el-radio-button>
                </el-radio-group>
                <el-checkbox-group v-model="dangerListCheckList" @change="filterActiveSafetyData">
                  <el-checkbox :label="2">累计2次</el-checkbox>
                  <el-checkbox :label="3">累计3次</el-checkbox>
                  <el-checkbox :label="4">累计4次及以上</el-checkbox>
                </el-checkbox-group>
              </template>
            </BaseTable>
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
import BaseTable from '@/views/monitor-report/components/BaseTable'
import { netGetMonthData, netGetMonth } from '@/api/monitor-report'

const onlineOptions = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'MonthReport',
  components: {
    BaseTable,
    VehicleTendency,
    DangerDrive,
    VehicleStatistics,
    RegionVehicle,
    ChoosePlatform
  },
  data() {
    const currentYear = new Date().getFullYear().toString()

    return {
      list: [], // 表格数据
      monthList: [], // 有数据的月份列表
      listLoading: true, // 加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      options: {
        vehicleTypeList: onlineOptions.monitor_report_vehicle_type.list
      },
      currentYear, // 当前年份
      listQuery: { // 查询条件
        platform: null, // 平台
        year: currentYear, // 统计周期
        month: null,
        vehicleType: []// 车辆类型
      },
      listQueryTemp: { // 用于重置查询条件
        platform: null, // 平台
        year: currentYear, // 统计周期
        month: null,
        vehicleType: []// 车辆类型
      },

      regionVehicleData: {
        tableHead: [],
        tableData: []
      }, // 区县车辆统计情况数据
      vehicleStatisticsData: [], // 车辆基本情况统计数据
      dangerDriveData: {
        ADAS: [],
        DSM: []
      }, // 危险驾驶事件数据
      vehicleTendencyData: {
        chartData: [],
        tableData: []
      }, // 车辆违章类型报警趋势数据
      violationTopTenData: {}, // 违章报警前十数据
      vehicleTopTenData: {}, // 车辆违章报警前十数据
      facilitatorData: {
        tableHead: [],
        tableData: []
      }, // 服务商考核数据
      endTenData: {
        tableHead: [],
        tableData: []
      }, // 运输考核后十名数据
      activeSafetyData: {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: 'unitName',
            label: '企业'
          },
          {
            prop: 'alarmCount',
            label: '报警总数'
          },
          {
            prop: 'adasAlarmCount',
            label: 'ADAS报警数'
          },
          {
            prop: 'dsmAlarmCount',
            label: 'DSM报警数'
          },
          {
            prop: 'relativeRatio',
            label: '危险驾驶环比'
          }
        ],
        tableData: []
      }, // 主动安全报警类型环比数据
      dangerListData: {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: 'name',
            label: '企业'
          },
          {
            prop: 'count',
            label: '累计进入报警名单次数'
          }
        ],
        tableData: [], // 存放过滤后表格数据
        tableDataAll: {
          company: [],
          vehicle: []
        }, // 存放全部表格数据
        tableHeadAll: {
          company: [
            {
              prop: 'index',
              label: '序号'
            },
            {
              prop: 'name',
              label: '企业'
            },
            {
              prop: 'count',
              label: '报警总数'
            }
          ],
          vehicle: [
            {
              prop: 'index',
              label: '序号'
            },
            {
              prop: 'name',
              label: '车牌号'
            },
            {
              prop: 'count',
              label: '报警总数'
            }
          ]
        }// 存放全部表格数据
      }, // 高风险名单分析数据
      dangerListType: 'company', // 高风险名单分析类型筛选
      dangerListCheckList: [2, 3, 4]// 高风险名单分析数据次数筛选
    }
  },
  computed: {
    // 选中的车辆类型
    selectedVehicle() {
      return this.listQuery.vehicleType.map(type => onlineOptions.monitor_report_vehicle_type.map[type])
    }

  },
  created() {
    const vehicleType = onlineOptions.monitor_report_vehicle_type

    // 车辆类型默认全部选中
    this.listQuery.vehicleType = this.listQueryTemp.vehicleType = vehicleType.list.map(item => item.value)
  },

  methods: {
    // 重置数据
    resetData() {
      this.regionVehicleData = {
        tableHead: [],
        tableData: []
      } // 区县车辆统计情况数据
      this.vehicleStatisticsData = [] // 车辆基本情况统计数据
      this.dangerDriveData = {
        ADAS: [],
        DSM: []
      } // 危险驾驶事件数据
      this.vehicleTendencyData = {
        chartData: [],
        tableData: []
      } // 车辆违章类型报警趋势数据
      this.violationTopTenData = {} // 违章报警前十数据
      this.vehicleTopTenData = {} // 车辆违章报警前十数据
      this.facilitatorData = {
        tableHead: [],
        tableData: []
      } // 服务商考核数据
      this.endTenData = {
        tableHead: [],
        tableData: []
      } // 运输考核后十名数据
      this.activeSafetyData = {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: 'unitName',
            label: '企业'
          },
          {
            prop: 'alarmCount',
            label: '报警总数'
          },
          {
            prop: 'adasAlarmCount',
            label: 'ADAS报警数'
          },
          {
            prop: 'dsmAlarmCount',
            label: 'DSM报警数'
          },
          {
            prop: 'relativeRatio',
            label: '危险驾驶环比'
          }
        ],
        tableData: []
      }// 主动安全报警类型环比数据
      this.dangerListData = {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: 'name',
            label: '企业'
          },
          {
            prop: 'count',
            label: '报警总数'
          }
        ],
        tableData: [], // 存放过滤后表格数据
        tableDataAll: {
          company: [],
          vehicle: []
        }, // 存放全部表格数据
        tableHeadAll: {
          company: [
            {
              prop: 'index',
              label: '序号'
            },
            {
              prop: 'name',
              label: '企业'
            },
            {
              prop: 'count',
              label: '报警总数'
            }
          ],
          vehicle: [
            {
              prop: 'index',
              label: '序号'
            },
            {
              prop: 'name',
              label: '车牌号'
            },
            {
              prop: 'count',
              label: '报警总数'
            }
          ]
        }// 存放全部表格数据
      }// 高风险名单分析数据
      this.dangerListType = 'company' // 高风险名单分析类型筛选
      this.dangerListCheckList = [2, 3, 4]// 高风险名单分析数据次数筛选
    },
    // 禁用日期
    disabledDate(date) {
      return +date.getFullYear() > +this.currentYear
    },
    // 平台加载完成回调
    platformInitFinished(platForm) {
      this.listQuery.platform = this.listQueryTemp.platform = platForm

      if (platForm) this.getMonthList('init')
      else this.listLoading = false
    },
    // 获取平台有数据的月
    getMonthList(type) {
      const { year, platform } = this.listQuery
      netGetMonth({ year, plateId: platform })
        .then(res => {
          this.monthList = res.data

          if (this.monthList.length) {
            this.listQuery.month = this.monthList[0]
            this.getList()
            if (type === 'init') this.listQueryTemp.month = this.monthList[0]
          } else {
            this.listQuery.month = null
            if (type !== 'init') this.resetData()
          }
        })
    },
    // 点击搜索
    handleSearch() {
      // console.log(this.listQuery.period.getW)
      this.getList()
    },
    // 获取列表
    getList() {
      const { platform, year, month } = this.listQuery

      if (this.monthList.length === 0) return this.$message.warning('所选年份中没有数据')
      if (!platform) return this.$message.warning('请先选择平台')
      this.listLoading = true

      netGetMonthData({
        plateId: platform,
        circle: `${year}-${month}`,
        vehicleTypes: this.listQuery.vehicleType.join(',')
      }).then(({ data }) => {
        // 区县车辆统计情况数据
        this.regionVehicleData = data.regionVehicleInfo
        // 危险驾驶事件数据
        this.dangerDriveData = {
          ADAS: data.adas || [],
          DSM: data.dsm || []
        }
        // 车辆违章类型报警趋势表格和图表
        this.vehicleTendencyData = {
          tableData: data.violation,
          chartData: data.violationTrend
        }
        // 主动安全报警类型环比数据
        this.activeSafetyData.tableData = data.unitTopAlarmRank.map((item, index) => ({ index: index + 1, ...item }))
        // 车辆基本情况统计数据
        this.vehicleStatisticsData = data.vehicleBaseInfo
        // 高风险名单分析数据
        this.dangerListData.tableDataAll.company = this.dangerListData.tableData = data.unitRankByMonth.map((item, index) => ({ index: index + 1, ...item }))
        this.dangerListData.tableDataAll.vehicle = data.vehicleRankByMonth.map((item, index) => ({ index: index + 1, ...item }))

        this.listLoading = false
      }).catch(_ => {
        this.listLoading = false
      })
    },
    // 根据筛选条件过滤数据并设置表头
    filterActiveSafetyData() {
      this.dangerListData.tableHead = this.dangerListData.tableHeadAll[this.dangerListType]
      this.dangerListData.tableData = this.dangerListData.tableDataAll[this.dangerListType].filter(item => this.dangerListCheckList.includes(item.count))
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getMonthList()
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.to-report-manage {
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
