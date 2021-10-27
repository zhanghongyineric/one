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
                <ChoosePlatform v-model="listQuery.platform" default-first-option @initFinished="initFinished" />
              </el-form-item>
              <el-form-item label="统计周期:">
                <el-date-picker
                  v-model="listQuery.year"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  style="width: 120px;margin-right: 10px;"
                />
                <el-select v-model="listQuery.week" placeholder="选择周" style="width: 100px;">
                  <el-option
                    v-for="num in 54"
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

            <el-button
              type="primary"
              size="small"
              plain
              class="to-report-manage"
              @click="$router.push({name:'ReportManage',params:{type:'week'}})"
            >
              周报管理
            </el-button>
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
            <!--服务商考核-->
            <ViolationTopTen :data="violationTopTenData" :loading="listLoading" />
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
import { fetchWeekData, fetchWeek } from '@/api/monitor-report'

const onlineOptions = JSON.parse(localStorage.getItem('onlineOption'))
console.log(onlineOptions)
export default {
  name: 'WeekReport',
  components: {
    VehicleTopTen,
    ViolationTopTen,
    VehicleTendency,
    DangerDrive,
    VehicleStatistics,
    RegionVehicle,
    ChoosePlatform
  },
  data() {
    return {
      hasWeek: false, // 是否有周的数据
      hasPlatform: false, // 是否有平台数据
      week: '', // 周
      listLoading: true, // 加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      options: {
        vehicleTypeList: onlineOptions.monitor_report_vehicle_type.list
      },
      listQuery: { // 查询条件
        platform: null, // 平台
        year: new Date().getFullYear().toString(), // 年份
        week: 1,
        vehicleType: []// 车辆类型
      },
      listQueryTemp: { // 用于重置查询条件
        platform: null, // 平台
        year: new Date().getFullYear().toString(), // 年份
        week: 1, // 周
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
      violationTopTenData: {}, // 违章报警前十
      vehicleTopTenData: {}// 车辆违章报警前十
    }
  },
  computed: {
    selectedVehicle() {
      return this.listQuery.vehicleType.map(type => onlineOptions.monitor_report_vehicle_type.map[type]
      )
    }
  },
  created() {
    const vehicleType = onlineOptions.monitor_report_vehicle_type

    // 车辆类型默认全部选中
    this.listQuery.vehicleType = this.listQueryTemp.vehicleType = vehicleType.list.map(item => item.value)
    // 获取周
    fetchWeek().then(res => {
      this.listQuery.week = res.data
      this.hasWeek = true
      if (this.hasPlatform) this.getList()
    })
  },
  methods: {
    // 平台加载完成回调
    initFinished(platForm) {
      this.hasPlatform = true
      this.listQuery.platform = this.listQueryTemp.platform = platForm
      if (this.hasWeek && platForm) this.getList()
    },
    // 点击搜索
    handleSearch() {
      console.log(this.listQuery)
      this.getList()
    },
    // 获取周报数据
    getList() {
      if (!this.listQuery.platform) return this.$message.warning('请先选择平台')

      const params = {
        plateId: this.listQuery.platform,
        vehicleTypes: this.listQuery.vehicleType.join(','),
        circle: `${this.listQuery.year}-${this.listQuery.week}`// 周期
      }

      this.listLoading = true
      fetchWeekData(params).then(({ data }) => {
        console.log(data)

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
        this.listLoading = false
      })
        .catch(e => console.log(e))
      // setTimeout(_ => {
      //   this.listLoading = false
      //   this.regionVehicleData = {
      //     // 表头 prop表头对应表格数据字段，；label中文标签
      //     tableHead: [
      //       {
      //         prop: 'name',
      //         label: '地区'
      //       },
      //       {
      //         prop: 'region1',
      //         label: '巴州区'
      //       },
      //       {
      //         prop: 'region2',
      //         label: '恩阳区'
      //       },
      //       {
      //         prop: 'region3',
      //         label: '南江区'
      //       },
      //       {
      //         prop: 'region4',
      //         label: '平昌区'
      //       },
      //       {
      //         prop: 'region5',
      //         label: '通江区'
      //       }
      //     ],
      //     // 表格数据
      //     tableData: [
      //       {
      //         name: '上周上线数',
      //         region1: 435,
      //         region2: 235,
      //         region3: 335,
      //         region4: 535,
      //         region5: 135
      //       },
      //       {
      //         name: '本周上线数',
      //         region1: 535,
      //         region2: 235,
      //         region3: 835,
      //         region4: 235,
      //         region5: 735
      //       },
      //       {
      //         name: '上周车辆报警数',
      //         region1: 435,
      //         region2: 235,
      //         region3: 335,
      //         region4: 535,
      //         region5: 135
      //       },
      //       {
      //         name: '本周车辆报警数',
      //         region1: 935,
      //         region2: 535,
      //         region3: 235,
      //         region4: 935,
      //         region5: 535
      //       }
      //     ]
      //   }
      //   this.vehicleStatisticsData = [
      //     {
      //       vehicleType: '农村客运车辆1',
      //       vehicleNum: 12312,
      //       OnlineVehicleNum: 2412,
      //       OnlineRadio: 17,
      //       mileage: 435423,
      //       averageMileage: 1234,
      //       dayAverageMileage: 34,
      //       alarmAverageHundred: 1
      //     },
      //     {
      //       vehicleType: '农村客运车辆2',
      //       vehicleNum: 22312,
      //       OnlineVehicleNum: 1412,
      //       OnlineRadio: 7,
      //       mileage: 235423,
      //       averageMileage: 2234,
      //       dayAverageMileage: 24,
      //       alarmAverageHundred: 2
      //     },
      //     {
      //       vehicleType: '农村客运车辆3',
      //       vehicleNum: 32312,
      //       OnlineVehicleNum: 3412,
      //       OnlineRadio: 9,
      //       mileage: 335423,
      //       averageMileage: 3234,
      //       dayAverageMileage: 54,
      //       alarmAverageHundred: 5
      //     }
      //   ]
      //   this.vehicleTendencyData = {
      //     chartData: [
      //       [1231, 2, 3, 2134, 5, 6, 7],
      //       [122, 2, 3, 2134, 1235, 6, 7],
      //       [131, 2, 1233, 4, 745, 13, 7],
      //       [1231, 1232, 3, 4, 3, 6, 7]
      //     ],
      //     tableData: [
      //       {
      //         name: '疲劳驾驶',
      //         a: 1,
      //         b: 2
      //       },
      //       {
      //         name: '时段禁行',
      //         a: 1,
      //         b: 2
      //       },
      //       {
      //         name: '离线位移',
      //         a: 1,
      //         b: 2
      //       },
      //       {
      //         name: '超速报警',
      //         a: 1,
      //         b: 2
      //       }
      //     ]
      //   }
      // }, 100)
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
.vehicle-type-label{
  width: 108px;
  flex-shrink: 0;
}
</style>
