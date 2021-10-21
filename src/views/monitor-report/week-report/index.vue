<!--周报管理-->
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
                @click="$router.push({name:'ReportManage',params:{type:'week'}})"
              >
                周报管理
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
            <!--服务商考核-->
            <ViolationTopTen :data="violationTopTenData" :loading="listLoading" />
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
              type="week"
              style="margin-bottom: 10px;"
            />
            <!--违章报警排名前十-->
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

export default {
  name: 'WeekReport',
  components: {
    VehicleTopTen,
    ViolationTopTen,
    VehicleTendency,
    DangerDrive,
    VehicleStatistics,
    RegionVehicle,
    ChoosePlatform },
  data() {
    return {
      test: {
        text: 1,
        array: []
      },
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
      violationTopTenData: {}, // 违章报警前十
      vehicleTopTenData: {}// 车辆违章报警前十
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
              name: '上周上线数',
              region1: 435,
              region2: 235,
              region3: 335,
              region4: 535,
              region5: 135
            },
            {
              name: '本周上线数',
              region1: 535,
              region2: 235,
              region3: 835,
              region4: 235,
              region5: 735
            },
            {
              name: '上周车辆报警数',
              region1: 435,
              region2: 235,
              region3: 335,
              region4: 535,
              region5: 135
            },
            {
              name: '本周车辆报警数',
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
            [1231, 2, 3, 2134, 5, 6, 7],
            [122, 2, 3, 2134, 1235, 6, 7],
            [131, 2, 1233, 4, 745, 13, 7],
            [1231, 1232, 3, 4, 3, 6, 7]
          ],
          tableData: [
            {
              name: '疲劳驾驶',
              a: 1,
              b: 2
            },
            {
              name: '时段禁行',
              a: 1,
              b: 2
            },
            {
              name: '离线位移',
              a: 1,
              b: 2
            },
            {
              name: '超速报警',
              a: 1,
              b: 2
            }
          ]
        }
      }, 100)
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
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
