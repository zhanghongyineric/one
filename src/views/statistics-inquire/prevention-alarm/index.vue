<!-- 主防报警 -->
<template>
  <div class="container" style="width:100%">
    <div class="table-page-search-wrapper search-box">
      <el-form label-width="100px">
        <el-row :gutter="48">
          <el-col :md="6" :sm="24">
            <el-form-item label="地区：">
              <el-cascader
                v-model="searchQuery.unitId"
                placeholder="请选择地区"
                size="mini"
                :options="areaOptions"
                :props="areaProps"
                @change="search"
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="报警类型：">
              <el-select
                v-model="alarmType"
                placeholder="请选择报警类型"
                size="mini"
                @change="search"
              >
                <el-option
                  v-for="{value,label} in alarmsType"
                  :key="value"
                  :value="value"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="时间范围：">
              <el-date-picker
                v-model="time"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                value-format="yyyyMM"
                @change="changeDate"
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-search"
                style="margin-top:5px;"
                @click="search"
              />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <div class="left-box" style="background-color: #0E1A2A;">
        <line-mix-bar
          :x-data="lineMixBarXData"
          :line-data="accessRateData"
          :legend-data="legendData"
          :bar-chart-data="barChartData"
          :ymax="ymax"
          :yname="yname"
          :line-name="yLineName"
          :line-min="0"
          :line-max="ymax"
          :line-formatter="'{value}'"
        />
      </div>
      <div class="right-box">
        <pie-chart :chart-data="pieChartData" :title="pieTitle" style="display:inline-block;" />
        <funnel-chart :chart-data="funnelChartData" :title="funnelTitle" style="display:inline-block;" />
      </div>
    </div>
    <div class="content-box">
      <div class="left-box" :style="tableWidth">
        <el-table
          :data="tableData"
          stripe
          fit
          :border="false"
          :header-cell-style="tableHeaderColor"
          height="100%"
          style="width:100%"
          :highlight-current-row="false"
          size="small"
        >
          <el-table-column label="地区" align="center" prop="zoneName" min-width="110" fixed />
          <el-table-column :label="tableLabel + '总次数（次）'" align="center" :prop="tableProp" min-width="170" />
          <!-- <el-table-column label="入网车辆总数（辆）" align="center" prop="vehicleCount" min-width="160" />
          <el-table-column label="总入网率" align="center" prop="networkAccessRate">
            <template v-slot="{row}">
              <span>{{ row.networkAccessRate | networkAccessRateFilter }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            v-for="item in twoLevelColums"
            :key="item"
            :label="item"
            align="center"
          >
            <el-table-column :label="tableLabel + '次数（次）'" :prop="allVehicleTypeNames.get(item)" min-width="170" align="center" />
            <!-- <el-table-column label="入网车辆总数（辆）" :prop="allVehicleTypeNames.get(item) + 'count'" min-width="160" align="center" />
            <el-table-column label="总入网率" :prop="allVehicleTypeNames.get(item) + 'rate'" align="center" /> -->
          </el-table-column>
        </el-table>
      </div>
      <div class="right-box">
        <span class="trend-title">报警趋势</span>
        <el-date-picker
          v-model="trendYear"
          type="year"
          placeholder="选择年"
          size="mini"
          class="trend-date-picker"
          value-format="yyyy"
          @change="getVehicleTrends"
        />
        <line-chart :chart-data="lineChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import lineMixBar from '@/components/Charts/statistics/lineMixBar.vue'
import FunnelChart from '@/components/Charts/statistics/FunnelChart.vue'
import LineChart from '@/components/Charts/statistics/LineChart.vue'
import PieChart from '@/components/Charts/statistics/PieChart.vue'
import {
  areaCode,
  alarmsVehicleType,
  alarmsVehicleSystem,
  sectorStatistics,
  alarmsVehicleTrends
} from '@/api/statistics-inquire/prevention-alarm'

export default {
  name: 'PreventionAlarm',
  components: { lineMixBar, FunnelChart, PieChart, LineChart },
  filters: {
    networkAccessRateFilter(rate) {
      return rate * 100 + '%'
    }
  },
  data() {
    return {
      alarmType: '',
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      searchQuery: {
        unitId: '800',
        startTime: '202101',
        endTime: '202109'
      },
      time: ['202101', '202109'],
      alarmsType: [],
      areaOptions: [],
      areaProps: {
        label: 'unitName',
        children: 'children',
        value: 'unitId',
        checkStrictly: false
      },
      pieChartData: [],
      funnelChartData: [],
      lineChartData: [],
      statisticalPeriod: [
        {
          label: '本年度',
          value: '1'
        }
      ],

      lineMixBarXData: [],
      accessRateData: [],
      legendData: [],
      barChartData: [],
      ymax: 0,
      yname: '',
      yLineName: '',
      pieTitle: '',
      funnelTitle: '',

      twoLevelColums: [],
      allVehicleTypeNames: new Map(),
      trendYear: '2021',

      alarmsTypeMap: new Map(),
      tableLabel: '',
      tableProp: '',
      tableWidth: 'width:55%;'
    }
  },
  watch: {
    alarmType() {
      // this.alarmType === '601000' ? this.tableLabel = '普通超速报警' : '离线位移报警'
      if (this.alarmType === '601000') {
        this.tableLabel = '普通超速报警'
        this.tableProp = 'vehicleOverSpeedNum'
      } else if (this.alarmType === '608000') {
        this.tableLabel = '离线位移报警'
        this.tableProp = 'vehicleOfflineMoveNum'
      } else {
        this.tableProp = null
      }
      this.tableWidth = 'width:55.5%;'
      setTimeout(() => {
        this.tableWidth = 'width:55%'
      })
    }
  },
  created() {
    this.getAlarmsVehicleType()
    this.getVehicleData()
    this.getAreaCode()
  },
  mounted() {
    const currentDate = new Date()
    this.trendYear = currentDate.getFullYear().toString()
  },
  methods: {
    getTableData(data, allVehicle, vehicle, netRate) {
      const dataTemp = data
      const keys = [...allVehicle.keys()]
      dataTemp.forEach((item, i) => {
        keys.forEach((key, j) => {
          let allCount = ''; let count = ''; let rate = ''
          allCount = this.allVehicleTypeNames.get(key) + 'all'
          count = this.allVehicleTypeNames.get(key) + 'count'
          rate = this.allVehicleTypeNames.get(key) + 'rate'
          item[allCount] = allVehicle.get(key).data[i]
          item[count] = vehicle.get(key).data[i]
          item[rate] = netRate.get(key)[i]
        })
      })
      this.tableData = dataTemp
    },
    changeDate() {
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
    },
    getAlarmsVehicleType() {
      alarmsVehicleType()
        .then((res) => {
          const { data } = res
          this.alarmType = '601000'
          this.alarmsType = data
          data.forEach(v => {
            this.alarmsTypeMap.set(v.value, v.label)
          })
          const type = this.alarmsTypeMap.get(this.alarmType)
          this.yname = type + '次数'
          this.yLineName = type + '总次数'
          this.pieTitle = '车辆类型' + type + '次数占比：'
          this.funnelTitle = type + '次数占比：'
          this.getSectorStatistics()
          this.getVehicleTrends()
        })
        .catch((err) => {
          throw err
        })
    },
    getVehicleTrends() {
      this.lineChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      alarmsVehicleTrends({
        year: this.trendYear,
        unitId: this.searchQuery.unitId
      })
        .then(res => {
          const { data } = res
          const trendData = []
          for (let i = 1; i <= 12; i++) {
            let index
            if (i < 10) index = `0${i}`
            else index = i
            data.forEach(item => {
              if (item.alarmDate === this.trendYear + index) {
                trendData.push(item)
              }
            })
            if (!trendData[i - 1]) {
              trendData.push({
                alarmDate: `${this.trendYear}${index}`,
                vehicleOfflineMoveNum: 0,
                vehicleOverSpeedNum: 0
              })
            }
          }
          trendData.forEach(item => {
            if (this.alarmType === '601000') this.lineChartData.push(item.vehicleOverSpeedNum)
            else if (this.alarmType === '608000') this.lineChartData.push(item.vehicleOfflineMoveNum)
          })
        })
        .catch(err => {
          throw err
        })
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) return 'background-color:#1C2733;font-weight:500;'
    },
    search() {
      this.tableData = []
      this.getSectorStatistics()
      this.getVehicleData()
      this.getVehicleTrends()
      // this.barChartData = []
    },
    getSectorStatistics() {
      this.pieChartData = []
      this.funnelChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      sectorStatistics({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          let sum = 0
          data.forEach(v => {
            if (this.alarmType === '601000') {
              sum += v.vehicleOverSpeedNum
            } else if (this.alarmType === '608000') {
              sum += v.vehicleOfflineMoveNum
            }
          })
          data.forEach(v => {
            if (this.alarmType === '601000') {
              this.pieChartData.push({ value: v.vehicleOverSpeedNum, name: v.vehicleTypeName })
              this.funnelChartData.push({ value: Math.ceil(v.vehicleOverSpeedNum / sum * 100), name: v.vehicleTypeName })
            } else if (this.alarmType === '608000') {
              this.pieChartData.push({ value: v.vehicleOfflineMoveNum, name: v.vehicleTypeName })
              this.funnelChartData.push({ value: Math.ceil(v.vehicleOfflineMoveNum / sum * 100), name: v.vehicleTypeName })
            }
          })
        })
        .catch(err => {
          throw err
        })
    },
    getAreaCode() {
      areaCode()
        .then(res => {
          const { data } = res
          this.deleteEmptyChilren(data[0])
          this.areaOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    deleteEmptyChilren(data) {
      data.children.length === 0 ? data.children = null : data.children.forEach(v => this.deleteEmptyChilren(v))
    },
    // 将接口返回数据转换为echarts需要的数据格式
    getBarChartData(data) {
      const colorList = ['#91C7AE', '#339999', '#99CCFF', '#66CC99', '#EBAC4A', '#666699', '#FF99CC', '#CC9933', '#FFCC33', '#003333']
      // const vehicleCountMap = new Map()
      const allVehicleCountMap = new Map()
      // const networkAccessRateMap = new Map()
      data.forEach(v => {
        this.lineMixBarXData.push(v.zoneName)
        if (this.alarmType === '601000') this.accessRateData.push(v.vehicleOverSpeedNum)
        else if (this.alarmType === '608000') this.accessRateData.push(v.vehicleOfflineMoveNum)
        v.alarmTypes.forEach(item => {
          this.legendData.push(item.vehicleTypeName)
        })
      })
      this.legendData = Array.from(new Set(this.legendData))
      this.legendData.forEach((v, index) => {
        allVehicleCountMap.set(v, {
          name: v,
          type: 'bar',
          stack: '车辆类型',
          data: [],
          itemStyle: {
            normal: {
              color: colorList[index]
            }
          }
        })
        // vehicleCountMap.set(v, {
        //   name: v,
        //   type: 'bar',
        //   stack: '入网',
        //   data: [],
        //   itemStyle: {
        //     normal: {
        //       color: colorList[index]
        //     }
        //   }
        // })
        // networkAccessRateMap.set(v, [])
      })

      data.forEach((v, index) => {
        v.alarmTypes.forEach(item => {
          // vehicleCountMap.get(item.vehicleTypeName).data.push(item.vehicleCount)
          if (this.alarmType === '601000') {
            allVehicleCountMap.get(item.vehicleTypeName).data.push(item.vehicleOverSpeedNum)
          } else if (this.alarmType === '608000') allVehicleCountMap.get(item.vehicleTypeName).data.push(item.vehicleOfflineMoveNum)
          // networkAccessRateMap.get(item.vehicleTypeName).push(item.networkAccessRate * 100 + '%')
        })
        this.legendData.forEach((item, index1) => {
          allVehicleCountMap.get(item).data.length < index + 1 ? allVehicleCountMap.get(item).data.push(0) : ''
        })
        // for (const value of vehicleCountMap.values()) {
        //   if (value.data.length < index + 1) {
        //     value.data.push(0)
        //   }
        // }
        // for (const value of allVehicleCountMap.values()) {
        //   if (value.data.length < index + 1) {
        //     value.data.push(0)
        //   }
        // }
        // for (const value of networkAccessRateMap.values()) {
        //   if (value.length < index + 1) {
        //     value.push('')
        //   }
        // }
      })

      this.twoLevelColums = [...allVehicleCountMap.keys()]
      this.barChartData = [...allVehicleCountMap.values()]
      // this.getTableData(data, allVehicleCountMap, vehicleCountMap, networkAccessRateMap)
    },
    getMaxYdata(data) {
      data.forEach(item => {
        if (item.vehicleOverSpeedNum > this.ymax) {
          this.ymax = item.vehicleOverSpeedNum
        }
      })
      let num = '1'
      for (let i = 0; i < JSON.stringify(this.ymax).length; i++) {
        num += '0'
      }
      this.ymax = parseInt(num)
    },
    getVehicleData() {
      this.lineMixBarXData = []
      this.accessRateData = []
      this.legendData = []
      this.barChartData = []
      this.ymax = 0
      this.twoLevelColums = []
      this.allVehicleTypeNames = new Map()
      this.tableData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      alarmsVehicleSystem({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          console.log(data, 'data')
          this.getAllVehicleType(data.alarmTypeDtos)
          this.getBarChartData(data.alarmDtos)
          this.getMaxYdata(data.alarmDtos)
          data.alarmDtos.forEach(item => {
            item.alarmTypes.forEach(v => {
              const filed = this.allVehicleTypeNames.get(v.vehicleTypeName)
              if (this.alarmType === '601000') item[filed] = v.vehicleOverSpeedNum
              else if (this.alarmType === '608000') item[filed] = v.vehicleOfflineMoveNum
            })
          })
          this.tableData = data.alarmDtos

          // 合计
          let sum
          if (this.alarmType === '601000') sum = 'vehicleOverSpeedNum'
          else if (this.alarmType === '608000') sum = 'vehicleOfflineMoveNum'
          const sumObj = { zoneName: '合计' }
          sumObj[sum] = this.alarmType === '601000' ? data.totalVehicleOverSpeedNum : data.totalVehicleOfflineMoveNum
          this.twoLevelColums.forEach(v => {
            data.alarmTypeDtos.forEach(item => {
              if (item.vehicleTypeName === v) {
                if (this.alarmType === '601000') sumObj[this.allVehicleTypeNames.get(v)] = item.vehicleOverSpeedNum
                else if (this.alarmType === '608000') sumObj[this.allVehicleTypeNames.get(v)] = item.vehicleOfflineMoveNum
                // ? sumObj[this.allVehicleTypeNames.get(v)] = item.vehicleOverSpeedNum
                // : sumObj[this.allVehicleTypeNames.get(v)] = item.vehicleOfflineMoveNum
              }
            })
          })
          this.tableData.push(sumObj)
        })
        .catch(err => {
          throw err
        })
    },
    getAllVehicleType(types) {
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
      const maxLen = chars.length
      types.forEach(item => {
        let typeFiled = ''
        for (let i = 0; i < 4; i++) {
          typeFiled += chars.charAt(Math.floor(Math.random() * maxLen))
        }
        this.allVehicleTypeNames.set(item.vehicleTypeName, typeFiled)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 84px);
  background-color: #0E1521;
  padding: 10px;
  color: #fff;
}

.search-box {
  width: 100%;
  background-color: #1C2638;
  border-radius: 1px;
  padding-top: 15px;
}

.time-text {
  color: #9FACBB;
  font-weight: 700;
  margin-right: 7%;
  font-size: 14px;
  cursor: pointer;
}

.time-text:hover {
  color: #409EFF;
}

.active {
  color: #409EFF;
}

.content-box {
  width: 100%;
  height: 44.5%;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}

.left-box {
  width: 55%;
  height: 100%;
  background-color: #1C2638;
  border-radius: 5px;
  display: inline-block;
}

.right-box {
  width: 44.5%;
  height: 100%;
  background-color: #1C2638;
  border-radius: 5px;
  display: inline-block;
}

::v-deep .el-form-item__label {
  color: #fff;
}

::v-deep .el-input__inner,
::v-deep .el-range-input,
// ::v-deep .el-table,
::v-deep .has-gutter {
  background-color: #212F40 !important;
  color: #fff;
}

::v-deep .el-table thead.is-group th {
  background-color: #212F40 !important;
  font-weight: 500 !important;
  color: #fff !important;
}

::v-deep .el-table__fixed {
  color: #fff !important;
}

::v-deep .el-table {
  overflow: auto !important;
  background-color: #1C2733 !important;
  color: #fff !important;
}

::v-deep .el-table__row--striped td {
  background-color: #1C2733 !important;
}

::v-deep .el-table__row {
  background-color: #222C3C !important;
}

::v-deep .el-table tbody tr { pointer-events:none !important; }

::v-deep .el-table td {
  border: 0 !important;
}

::v-deep .el-table--border {
  border: 0 !important;
}

::v-deep .cell {
  color: #ccc !important;
  font-weight: 700 !important;
}

::v-deep .el-range-separator {
  color: #ccc !important;
}

::v-deep .el-table__fixed::before {
  height: 0 !important;
}

::v-deep .el-table--group::after {
  width: 0 !important;
}

::v-deep .el-table::before {
  height: 0 !important;
}

.trend-title {
  font-size: 18px;
  font-weight: 700;
  display: inline-block;
  margin-top: 10px;
  margin-left: 15px;
}

.trend-date-picker {
  position: absolute;
  right: 20px;
  margin-top: 10px;
}
</style>
