<template>
  <div class="container" style="width:100%" :style="{'background-color':theme?'':'#F0F2F5'}">
    <div class="table-page-search-wrapper search-box" :style="{'background-color':theme?'':'#fff'}">
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
                :disabled="disabled"
              />
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
      <div class="left-box" :style="{'background-color': theme?'#0E1A2A':'#fff'}">
        <line-mix-bar
          :yname="'车辆数'"
          :line-name="'入网率'"
          :x-data="lineMixBarXData"
          :line-data="accessRateData"
          :legend-data="legendData"
          :bar-chart-data="barChartData"
          :ymax="ymax"
          :text-color="theme?'#fff':'#606266'"
        />
      </div>
      <div class="right-box" :style="{'background-color':theme?'':'#fff'}">
        <pie-chart
          :text-color="theme?'#fff':'#606266'"
          :chart-data="pieChartData"
          :title="'车辆类型入网车辆数占比：'"
          style="display:inline-block;"
        />
        <funnel-chart
          :chart-data="funnelChartData"
          :title="'入网率：'"
          style="display:inline-block;"
          :text-color="theme?'#fff':'#606266'"
        />
      </div>
    </div>
    <div class="content-box">
      <div class="left-box" :style="tableWidth">
        <el-table
          :data="tableData"
          stripe
          fit
          :border="false"
          height="100%"
          style="width:100%"
          :highlight-current-row="false"
          size="small"
        >
          <el-table-column label="地区" align="center" prop="region" min-width="110" fixed />
          <el-table-column label="应入网车辆总数（辆）" align="center" prop="allVehicleCount" min-width="170" />
          <el-table-column label="入网车辆总数（辆）" align="center" prop="vehicleCount" min-width="160" />
          <el-table-column label="总入网率" align="center" prop="networkAccessRate">
            <template v-slot="{row}">
              <span>{{ row.networkAccessRate | networkAccessRateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in twoLevelColums"
            :key="item"
            :label="item"
            align="center"
          >
            <el-table-column label="应入网车辆总数（辆）" :prop="item + 'all'" min-width="170" align="center" />
            <el-table-column label="入网车辆总数（辆）" :prop="item + 'count'" min-width="160" align="center" />
            <el-table-column label="总入网率" :prop="item + 'rate'" align="center" />
          </el-table-column>
        </el-table>
      </div>
      <div class="right-box" :style="{'background-color':theme?'':'#fff'}">
        <span class="trend-title" :style="{color: theme?'':'#606266'}">入网车辆趋势</span>
        <el-date-picker
          v-model="trendYear"
          type="year"
          placeholder="选择年"
          size="mini"
          class="trend-date-picker"
          value-format="yyyy"
          @change="getVehicleTrends"
        />
        <line-chart :chart-data="lineChartData" :text-color="theme?'#fff':'#606266'" />
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
  vehicleSystem,
  sectorStatistics,
  vehicleTrends
} from '@/api/statistics-inquire/vehicle-status'

const vehicleTypeMap = JSON.parse(localStorage.getItem('onlineOption'))['vehicle_type_code'].map

export default {
  name: 'VehicleStatus',
  components: { lineMixBar, FunnelChart, PieChart, LineChart },
  filters: {
    networkAccessRateFilter(rate) {
      return (rate * 100).toFixed() + '%'
    }
  },
  data() {
    return {
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      searchQuery: {
        unitId: ['622', '800'],
        startTime: '',
        endTime: ''
      },
      time: [],
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
      lineMixBarXData: [],
      accessRateData: [],
      legendData: [],
      barChartData: [],
      ymax: 0,

      twoLevelColums: [],
      trendYear: '2021',
      tableWidth: 'width:55%;',
      disabled: false // 地区是否可选择
    }
  },
  computed: {
    theme() {
      const localTheme = localStorage.getItem('theme')
      const stateTheme = this.$store.state.settings.theme
      if (stateTheme !== localTheme) {
        this.$store.commit('settings/CHANGE_THEME', localTheme)
      }
      return localStorage.getItem('theme') === 'dark'
    },
    roleName() {
      return this.$store.state.user.roleName
    },
    unitId() {
      return this.$store.state.user.unitId
    }
  },
  created() {
    this.judgeRole()
    this.getTime()
    this.getVehicleData()
    this.getAreaCode()
    this.getSectorStatistics()
    this.getVehicleTrends()
  },
  mounted() {
    const currentDate = new Date()
    this.trendYear = currentDate.getFullYear().toString()
  },
  methods: {
    // 判断角色赋值地区
    judgeRole() {
      this.roleName === '平台管理员'
        ? (this.listQuery.regionId = ['622', this.unitId.toString()]) && (this.disabled = true)
        : ''
    },
    // 获取当前月份，并赋值搜索条件中的默认开始和结束时间
    getTime() {
      const currentDate = new Date()
      this.trendYear = currentDate.getFullYear().toString()
      let month = currentDate.getMonth() + 1
      month = month < 10 ? `0${month}` : `${month}`
      this.$set(this, 'time', [this.trendYear + (month - 1), this.trendYear + month])
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
    },
    // 将表格数据与字段对应
    getTableData(data, allVehicle, vehicle, netRate) {
      const dataTemp = data
      const keys = [...allVehicle.keys()]
      dataTemp.forEach((item, i) => {
        keys.forEach((key, j) => {
          let allCount = ''; let count = ''; let rate = ''
          allCount = key + 'all'
          count = key + 'count'
          rate = key + 'rate'
          item[allCount] = allVehicle.get(key).data[i] || 0
          item[count] = vehicle.get(key).data[i] || 0
          item[rate] = netRate.get(key)[i] || '0%'
        })
      })
      this.tableData = dataTemp
      // 合计
      const sumObj = {
        region: '合计',
        allVehicleCount: 0,
        vehicleCount: 0,
        networkAccessRate: 0
      }
      data.forEach(item => {
        sumObj.allVehicleCount += parseInt(item.allVehicleCount)
        sumObj.vehicleCount += parseInt(item.vehicleCount)
        if (!isNaN(item.networkAccessRate * 100)) {
          sumObj.networkAccessRate += item.networkAccessRate * 100
        }
      })

      // 各类车应入网车辆总数
      for (const item of allVehicle) {
        const title = item[0] + 'all'
        let sum = 0
        item[1].data.forEach(val => {
          sum += val
        })
        sumObj[title] = sum
      }
      // 各类车实际入网车辆总数及总入网率
      for (const item of vehicle) {
        const title = item[0] + 'count'
        const all = item[0] + 'all'
        const rate = item[0] + 'rate'
        let sum = 0
        item[1].data.forEach(val => {
          sum += val
        })
        sumObj[title] = sum
        sumObj[rate] = (sumObj[title] / sumObj[all] * 100).toFixed() + '%'
      }
      sumObj.networkAccessRate = sumObj.networkAccessRate / data.length / 100
      this.tableData.push(sumObj)
    },
    changeDate() {
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
    },
    // 获取趋势图数据
    getVehicleTrends() {
      this.lineChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      vehicleTrends({
        year: this.trendYear,
        unitId: parseInt(this.searchQuery.unitId)
      })
        .then(res => {
          const { data } = res
          const trendData = new Array(12).fill(0)
          data.forEach(item => {
            item.yearPlusMonth = item.yearPlusMonth.toString().split(`${this.trendYear}`)[1]
            trendData[item.yearPlusMonth - 1] = item.vehicleCount
          })
          this.lineChartData = trendData
        })
        .catch(err => {
          throw err
        })
    },
    search() {
      this.getSectorStatistics()
      this.getVehicleData()
      this.getVehicleTrends()
      this.tableWidth = 'width:55.5%;'
      setTimeout(() => {
        this.tableWidth = 'width:55%'
      }, 500)
    },
    // 扇形图和漏斗图数据
    getSectorStatistics() {
      this.pieChartData = []
      this.funnelChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      this.searchQuery.unitId = parseInt(this.searchQuery.unitId)
      sectorStatistics({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          data.forEach(v => {
            this.pieChartData.push({ value: v.vehicleCount, name: vehicleTypeMap[v.vehicleTypeCode] })
            this.funnelChartData.push({
              value: (v.networkAccessRate * 100).toFixed(2),
              name: vehicleTypeMap[v.vehicleTypeCode]
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
          for (let i = 0; i < data.length; i++) {
            this.deleteEmptyChilren(data[i])
          }
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
      const vehicleCountMap = new Map()
      const allVehicleCountMap = new Map()
      const networkAccessRateMap = new Map()
      data.forEach(v => {
        this.lineMixBarXData.push(v.region)
        if (!isNaN(v.networkAccessRate)) {
          this.accessRateData.push((v.networkAccessRate * 100).toFixed())
        } else {
          v.networkAccessRate = '0'
          this.accessRateData.push(0)
        }
        v.children.forEach(item => {
          this.legendData.push(vehicleTypeMap[item.vehicleTypeCode])
        })
      })
      this.legendData = Array.from(new Set(this.legendData))
      this.legendData.forEach((v, index) => {
        allVehicleCountMap.set(v, {
          name: v,
          type: 'bar',
          stack: '应入网',
          data: [],
          itemStyle: {
            normal: {
              color: colorList[index]
            }
          }
        })
        vehicleCountMap.set(v, {
          name: v,
          type: 'bar',
          stack: '入网',
          data: [],
          itemStyle: {
            normal: {
              color: colorList[index]
            }
          }
        })
        networkAccessRateMap.set(v, [])
      })
      data.forEach((v, index) => {
        v.children.forEach(item => {
          vehicleCountMap.get(vehicleTypeMap[item.vehicleTypeCode]).data.push(item.vehicleCount)
          allVehicleCountMap.get(vehicleTypeMap[item.vehicleTypeCode]).data.push(item.allVehicleCount)
          if (!isNaN(v.networkAccessRate)) {
            networkAccessRateMap.get(vehicleTypeMap[item.vehicleTypeCode]).push((item.networkAccessRate * 100).toFixed() + '%')
          } else {
            networkAccessRateMap.get(vehicleTypeMap[item.vehicleTypeCode]).push('0%')
          }
        })
        for (const value of vehicleCountMap.values()) {
          if (value.data.length < index + 1) {
            value.data.push(0)
          }
        }
        for (const value of allVehicleCountMap.values()) {
          if (value.data.length < index + 1) {
            value.data.push(0)
          }
        }
        for (const value of networkAccessRateMap.values()) {
          if (value.length < index + 1) {
            value.push('')
          }
        }
      })

      this.twoLevelColums = [...allVehicleCountMap.keys()]
      this.barChartData = [...allVehicleCountMap.values(), ...vehicleCountMap.values()]
      this.getTableData(data, allVehicleCountMap, vehicleCountMap, networkAccessRateMap)
    },
    getMaxYdata(data) {
      data.forEach(item => {
        if (item.allVehicleCount > this.ymax) {
          this.ymax = item.allVehicleCount
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
      this.tableData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      this.searchQuery.unitId = parseInt(this.searchQuery.unitId)
      vehicleSystem({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          this.getBarChartData(data)
          this.getMaxYdata(data)
        })
        .catch(err => {
          throw err
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
