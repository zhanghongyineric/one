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
                  v-for="{cbArmType,cbArmName} in alarmsType"
                  :key="cbArmType"
                  :value="cbArmType"
                  :label="cbArmName"
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

// 车辆类型字典
const vehicleTypeMap = JSON.parse(localStorage.getItem('onlineOption'))['vehicle_type_code'].map

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
        endTime: '202110'
      },
      time: [],
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

      alarmsTypeMap: new Map(), // 报警类型编码与名称对应关系
      alarmsTypeToNameMap: new Map(), // 报警类型编码与字段对应关系
      tableLabel: '',
      tableProp: '',
      tableWidth: 'width:55%;',
      typeFiled: ''
    }
  },
  watch: {
    alarmType() {
      this.tableProp = this.alarmsTypeToNameMap.get(this.alarmType)
      this.tableLabel = this.alarmsTypeMap.get(this.alarmType)
      this.tableWidth = 'width:55.5%;'
      setTimeout(() => {
        this.tableWidth = 'width:55%'
      })
      this.typeFiled = this.alarmsTypeToNameMap.get(this.alarmType)
    }
  },
  created() {
    this.getDate()
  },
  mounted() {
    this.getAlarmsVehicleType()
  },
  methods: {
    getDate() {
      const currentDate = new Date()
      this.trendYear = currentDate.getFullYear().toString()
      let month = currentDate.getMonth() + 1
      month = month < 10 ? `0${month}` : `${month}`
      this.time[0] = this.trendYear + '01'
      this.time[1] = this.trendYear + month
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
      setTimeout(() => {
        this.getAreaCode()
        this.getVehicleData()
      })
    },
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
          data.forEach(v => {
            v.fieldName = v.fieldName ? v.fieldName.replace(/\_(\w)/g, (_, text) => (text.toUpperCase())) : ''
            this.alarmsTypeMap.set(v.cbArmType, v.cbArmName)
            this.alarmsTypeToNameMap.set(v.cbArmType, v.fieldName)
          })
          this.alarmsType = data
          const { cbArmType, cbArmName } = data[0]
          this.alarmType = cbArmType
          this.yname = cbArmName + '次数'
          this.yLineName = cbArmName + '总次数'
          this.pieTitle = cbArmName + '次数占比：'
          this.funnelTitle = cbArmName + '次数占比：'
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
      alarmsVehicleTrends({ year: this.trendYear, unitId: this.searchQuery.unitId })
        .then(res => {
          const { data } = res; const trendData = []; const types = {}
          for (const v of this.alarmsTypeToNameMap.values()) { types[v] = 0 }
          for (let i = 1; i <= 12; i++) {
            let index
            i < 10 ? index = `0${i}` : index = i
            data.forEach(item => { item.alarmDate === this.trendYear + index ? trendData.push(item) : '' })
            if (!trendData[i - 1]) trendData.push({ alarmDate: `${this.trendYear}${index}`, ...types })
          }
          trendData.forEach(item => { this.lineChartData.push(item[this.typeFiled] || 0) })
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
      const type = this.alarmsTypeMap.get(this.alarmType)
      this.yname = type + '次数'
      this.yLineName = type + '总次数'
      this.pieTitle = type + '次数占比：'
      this.funnelTitle = type + '次数占比：'
    },
    getSectorStatistics() {
      this.pieChartData = []
      this.funnelChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      sectorStatistics({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          let sum = 0
          data.forEach(v => { sum += v[this.typeFiled] })
          data.forEach(v => {
            this.pieChartData.push({ value: v[this.typeFiled], name: vehicleTypeMap[v.vehicleType] })
            this.funnelChartData.push({
              value: Math.ceil(v[this.typeFiled] === 0 ? '' : v[this.typeFiled] / sum * 100),
              name: vehicleTypeMap[v.vehicleType]
            })
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
    getBarChartData(data) {
      const colorList = ['#91C7AE', '#339999', '#99CCFF', '#66CC99', '#EBAC4A', '#666699', '#FF99CC', '#CC9933', '#FFCC33', '#003333']
      const allVehicleCountMap = new Map()
      data.forEach(v => {
        this.lineMixBarXData.push(v.zoneName)
        this.accessRateData.push(v[this.typeFiled])
        v.alarmTypes.forEach(item => {
          this.legendData.push(vehicleTypeMap[item.vehicleType])
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
      })
      data.forEach((v, index) => {
        v.alarmTypes.forEach(item => {
          allVehicleCountMap.get(vehicleTypeMap[item.vehicleType]).data.push(item[this.typeFiled])
        })
        this.legendData.forEach((item, index1) => {
          allVehicleCountMap.get(item).data.length < index + 1 ? allVehicleCountMap.get(item).data.push(0) : ''
        })
      })
      this.twoLevelColums = [...allVehicleCountMap.keys()]
      this.barChartData = [...allVehicleCountMap.values()]
    },
    getMaxYdata(data) {
      data.forEach(item => {
        item[this.typeFiled] > this.ymax ? this.ymax = item[this.typeFiled] : ''
      })
      let num = '1'
      for (let i = 0; i < JSON.stringify(this.ymax).length; i++) { num += '0' }
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
          this.getAllVehicleType(data.alarmTypeDtos)
          this.getBarChartData(data.alarmDtos)
          this.getMaxYdata(data.alarmDtos)
          data.alarmDtos.forEach(item => {
            item.alarmTypes.forEach(v => {
              const filed = this.allVehicleTypeNames.get(vehicleTypeMap[v.vehicleType])
              item[filed] = v[this.typeFiled]
            })
          })
          this.tableData = data.alarmDtos

          // 合计行
          const sumObj = { zoneName: '合计' }
          const sum = this.typeFiled
          const foo = ([first, ...rest]) => first.toUpperCase() + rest.join('')
          sumObj[sum] = data['total' + foo(this.typeFiled)]
          this.twoLevelColums.forEach(v => {
            data.alarmTypeDtos.forEach(item => {
              vehicleTypeMap[item.vehicleType] === v ? sumObj[this.allVehicleTypeNames.get(v)] = item[this.typeFiled] : ''
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
        this.allVehicleTypeNames.set(vehicleTypeMap[item.vehicleType], typeFiled)
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
