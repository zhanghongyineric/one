<!--月报管理-->
<template>
  <div class="layout-content history-code">
    <el-card class="box-card">
      <!--搜索栏-->
      <header class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :xs="24" :sm="12" :md="6">
              <el-form-item label="选择平台:">
                <ChoosePlatform v-model="listQuery.platform" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-form-item label="统计周期:">
                <el-date-picker
                  v-model="listQuery.period"
                  type="week"
                  format="yyyy 第 WW 周"
                  placeholder="选择周"
                  :picker-options="{firstDayOfWeek:1}"
                />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :xs="12" :sm="12" :md="6">
              <div
                class="table-page-search-submitButtons"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>

              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6">
              <el-button
                type="primary"
                size="small"
                plain
                class="to-report-manage"
                @click="$router.push({name:'ReportManage',params:{type:'month'}})"
              >
                月报管理
              </el-button>
            </el-col>
          </el-row>
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
            <BaseTable title="运输企业考核后十名" :data="endTenData" :loading="listLoading" style="margin-bottom: 10px;" />
            <!--主动安全报警类型环比-->
            <BaseTable title="主动安全报警类型环比" :data="activeSafetyData" :loading="listLoading" style="margin-bottom: 10px;" />
          </el-col>
          <el-col :span="12">
            <!--车辆基本情况统计-->
            <VehicleStatistics
              ref="vehicleStatistics"
              :data="vehicleStatisticsData"
              :loading="listLoading"
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
            <BaseTable title="服务商考核" :data="facilitatorData" :loading="listLoading" style="margin-bottom: 10px;" />
            <!--高风险名单分析-->
            <BaseTable
              title="高风险名单分析"
              :data="dangerListData"
              :loading="listLoading"
              show-filter
              style="margin-bottom: 10px;"
            >
              <template>
                <el-radio-group v-model="dangerListType" size="medium" @change="filterActiveSafetyData">
                  <el-radio-button label="1">运输企业</el-radio-button>
                  <el-radio-button label="2">营运车辆</el-radio-button>
                </el-radio-group>
                <el-checkbox-group v-model="dangerListCheckList">
                  <el-checkbox :label="2">累计2次</el-checkbox>
                  <el-checkbox :label="3">累计3次</el-checkbox>
                  <el-checkbox :label="4">累计4次</el-checkbox>
                  <el-checkbox :label="5">累计5次</el-checkbox>
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
  // provide() {
  //   return {
  //     'demo': 'fuck'
  //   }
  // },
  provide: {
    test: '213'
  },
  data() {
    return {
      demo: 1,
      list: [], // 表格数据
      listLoading: true, // 加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: { // 查询条件
        platform: -999, // 平台
        period: new Date() // 统计周期
      },
      listQueryTemp: { // 用于重置查询条件
        platform: null, // 平台
        period: new Date() // 统计周期
      },

      regionVehicleData: {}, // 区县车辆统计情况数据
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
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: '1',
            label: '服务商'
          },
          {
            prop: '2',
            label: '平台连通率'
          },
          {
            prop: '3',
            label: '车辆上线率'
          },
          {
            prop: '4',
            label: '轨迹完整率'
          },
          {
            prop: '5',
            label: '数据合格率'
          },
          {
            prop: '6',
            label: '卫星定位漂移率'
          },
          {
            prop: '7',
            label: '得分'
          },
          {
            prop: '8',
            label: '得分环比'
          }
        ],
        tableData: [
          {
            index: 1,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56,
            6: 1234,
            7: 768,
            8: 234
          },
          {
            index: 2,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56,
            6: 1234,
            7: 768,
            8: 234
          }
        ]
      }, // 服务商考核数据
      endTenData: {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: '1',
            label: '企业'
          },
          {
            prop: '2',
            label: '车辆入网率'
          },
          {
            prop: '3',
            label: '车辆上线率'
          },
          {
            prop: '4',
            label: '轨迹完整率'
          },
          {
            prop: '5',
            label: '数据合格率'
          },
          {
            prop: '6',
            label: '卫星定位漂移率'
          },
          {
            prop: '66',
            label: '平均车辆超速次数'
          },
          {
            prop: '666',
            label: '平均疲劳驾驶时长'
          },
          {
            prop: '7',
            label: '得分'
          },
          {
            prop: '8',
            label: '得分环比'
          }
        ],
        tableData: [
          {
            index: 1,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56,
            6: 1234,
            66: 2234,
            666: 2234,
            7: 768,
            8: 234
          },
          {
            index: 2,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56,
            6: 1234,
            66: 2234,
            666: 2234,
            7: 768,
            8: 234
          }
        ]
      }, // 运输考核后十名数据
      activeSafetyData: {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: '1',
            label: '企业'
          },
          {
            prop: '2',
            label: '报警总数'
          },
          {
            prop: '3',
            label: 'ADAS报警数'
          },
          {
            prop: '4',
            label: 'DSM报警数'
          },
          {
            prop: '5',
            label: '危险驾驶环比'
          }
        ],
        tableData: [
          {
            index: 1,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56
          },
          {
            index: 2,
            1: 45,
            2: 234,
            3: 5621,
            4: 324,
            5: 56
          }
        ]
      }, // 主动安全报警类型环比数据
      dangerListData: {
        tableHead: [
          {
            prop: 'index',
            label: '序号'
          },
          {
            prop: '1',
            label: '企业'
          },
          {
            prop: '2',
            label: '累计进入报警名单次数'
          }
        ],
        tableData: [
          {
            index: 1,
            1: '大英通达',
            2: 2
          },
          {
            index: 2,
            1: '宜宾港',
            2: 3
          }
        ], // 存放过滤后表格数据
        tableDataAll: [
          {
            index: 1,
            1: '大英通达',
            2: 2
          },
          {
            index: 2,
            1: '宜宾港',
            2: 3
          }
        ]// 存放全部表格数据
      }, // 高风险名单分析数据
      dangerListType: '1', // 高风险名单分析类型筛选
      dangerListCheckList: [2, 3, 4, 5]// 高风险名单分析数据次数筛选
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 点击搜索
    handleSearch() {
      // console.log(this.listQuery.period.getW)
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      setTimeout(_ => {
        this.listLoading = false
        this.regionVehicleData = {
          // 表头 prop表头对应表格数据字段，；label中文标签
          tableHead: [
            {
              prop: 'name',
              label: '地区'
            },
            {
              prop: 'region1',
              label: '巴州区'
            },
            {
              prop: 'region2',
              label: '恩阳区'
            },
            {
              prop: 'region3',
              label: '南江区'
            },
            {
              prop: 'region4',
              label: '平昌区'
            },
            {
              prop: 'region5',
              label: '通江区'
            }
          ],
          // 表格数据
          tableData: [
            {
              name: '上月上线数',
              region1: 435,
              region2: 235,
              region3: 335,
              region4: 535,
              region5: 135
            },
            {
              name: '本月上线数',
              region1: 535,
              region2: 235,
              region3: 835,
              region4: 235,
              region5: 735
            },
            {
              name: '上月车辆报警数',
              region1: 435,
              region2: 235,
              region3: 335,
              region4: 535,
              region5: 135
            },
            {
              name: '本月车辆报警数',
              region1: 935,
              region2: 535,
              region3: 235,
              region4: 935,
              region5: 535
            }
          ]
        }
        this.vehicleStatisticsData = [
          {
            vehicleType: '农村客运车辆1',
            vehicleNum: 12312,
            OnlineVehicleNum: 2412,
            OnlineRadio: 17,
            mileage: 435423,
            averageMileage: 1234,
            dayAverageMileage: 34,
            alarmAverageHundred: 1
          },
          {
            vehicleType: '农村客运车辆2',
            vehicleNum: 22312,
            OnlineVehicleNum: 1412,
            OnlineRadio: 7,
            mileage: 235423,
            averageMileage: 2234,
            dayAverageMileage: 24,
            alarmAverageHundred: 2
          },
          {
            vehicleType: '农村客运车辆3',
            vehicleNum: 32312,
            OnlineVehicleNum: 3412,
            OnlineRadio: 9,
            mileage: 335423,
            averageMileage: 3234,
            dayAverageMileage: 54,
            alarmAverageHundred: 5
          }
        ]
        this.vehicleTendencyData = {
          chartData: [
            [1231, 2, 3, 2134, 5, 6, 7, 1231, 2, 3, 2134, 5, 6, 7, 1231, 2, 3, 2134, 5, 6, 7, 1231, 2, 3, 2134, 5, 6, 7, 5, 6, 7],
            [122, 2, 3, 2134, 1235, 6, 7, 122, 2, 3, 2134, 1235, 6, 7, 122, 2, 3, 2134, 1235, 6, 7, 122, 2, 3, 2134, 1235, 6, 7, 5, 6, 7],
            [131, 2, 1233, 4, 745, 13, 7, 131, 2, 1233, 4, 745, 13, 7, 131, 2, 1233, 4, 745, 13, 7, 131, 2, 1233, 4, 745, 13, 7, 5, 6, 7],
            [1231, 1232, 3, 4, 3, 6, 7, 1231, 1232, 3, 4, 3, 6, 7, 1231, 1232, 3, 4, 3, 6, 7, 1231, 1232, 3, 4, 3, 6, 7, 5, 6, 7]
          ],
          tableData: []
        }
      }, 100)
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    filterActiveSafetyData() {

    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.to-report-manage {
  float: right;
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
</style>
