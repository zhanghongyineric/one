<!-- 主防报警 -->
<template>
  <div class="container" style="width:100%" :style="{'background-color':theme?'':'#F0F2F5'}">
    <div class="table-page-search-wrapper search-box" :style="{'background-color':theme?'':'#fff'}">
      <el-form label-width="100px">
        <el-row :gutter="24">
          <el-col :md="5" :sm="24">
            <el-form-item label="报警分类：">
              <el-select
                v-model="alarmSource"
                placeholder="请选择报警分类"
                size="mini"
              >
                <el-option label="dms报警" value="0" />
                <el-option label="adas报警" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
            <el-form-item label="报警名称：">
              <el-select
                v-model="alarmType"
                placeholder="请选择报警名称"
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
          <el-col :md="5" :sm="24">
            <el-form-item label="地区：">
              <el-cascader
                v-model="searchQuery.unitId"
                placeholder="请选择地区"
                size="mini"
                :options="areaOptions"
                :props="areaProps"
                style="width:100%"
                @change="search"
              />
            </el-form-item>
          </el-col>
          <el-col :md="5" :sm="24">
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
          <el-col :md="4" :sm="24">
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
          :text-color="theme?'#fff':'#606266'"
        />
      </div>
      <div class="right-box" :style="{'background-color':theme?'':'#fff'}">
        <pie-chart
          :chart-data="pieChartData"
          :title="pieTitle"
          style="display:inline-block;"
          :text-color="theme?'#fff':'#606266'"
        />
        <funnel-chart
          :chart-data="funnelChartData"
          :title="funnelTitle"
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
          <el-table-column :label="tableLabel + '总次数（次）'" align="center" :prop="tableLabel" min-width="170" />
          <el-table-column
            v-for="item in twoLevelColums"
            :key="item"
            :label="item"
            align="center"
          >
            <el-table-column :label="tableLabel + '次数（次）'" :prop="item" min-width="170" align="center" />
          </el-table-column>
        </el-table>
      </div>
      <div class="right-box" :style="{'background-color':theme?'':'#fff'}">
        <span class="trend-title" :style="{color: theme?'':'#606266'}">报警趋势</span>
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
  data() {
    return {
      alarmType: '',
      tableData: [],
      searchQuery: {
        unitId: 800,
        startTime: 202101,
        endTime: 202111,
        alarmTypeCode: ''
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
      lineMixBarXData: [],
      accessRateData: [],
      legendData: [],
      barChartData: [],
      ymax: 0,
      yname: '',
      yLineName: '',
      pieTitle: '',
      funnelTitle: '', // 扇形图title

      twoLevelColums: [], // 表格双层行的数据，主要包括所有车辆类型
      trendYear: '2021',

      alarmsTypeMap: new Map(), // 报警名称编码与名称对应关系

      tableLabel: '', // 报警名称
      tableWidth: 'width:55%;', // 表格宽度
      alarmSource: '0' // 报警分类 0 dms报警 1 adas报警
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
    }
  },
  watch: {
    alarmType() {
      this.tableLabel = this.alarmsTypeMap.get(this.alarmType)
      this.getVehicleData()
    },
    tableData: {
      deep: true,
      handler(nval, oval) {
        this.tableWidth = 'width:55.5%;'
        setTimeout(() => {
          this.tableWidth = 'width:55%'
        })
      }
    },
    alarmSource(newV, oldV) {
      this.getAlaramTypeBySource()
    }
  },
  created() {
    this.getAlaramTypeBySource()
  },
  mounted() {
    this.getDate()
  },
  methods: {
    getDate() {
      const currentDate = new Date()
      this.trendYear = currentDate.getFullYear().toString()
      let month = currentDate.getMonth() + 1
      month = month < 10 ? `0${month}` : `${month}`
      this.$set(this, 'time', [this.trendYear + (month - 1), this.trendYear + month])
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
      setTimeout(() => {
        this.getAreaCode()
      })
    },
    changeDate() {
      this.searchQuery.startTime = this.time[0]
      this.searchQuery.endTime = this.time[1]
    },
    // 通过报警分类获取报警名称
    getAlaramTypeBySource() {
      alarmsVehicleType({ type: this.alarmSource })
        .then(({ data }) => {
          data.forEach(v => {
            this.alarmsTypeMap.set(v.cbArmType, v.cbArmName)
          })
          this.$set(this, 'alarmsType', data)
          const { cbArmType, cbArmName } = data[0]
          this.alarmType = cbArmType
          this.yname = cbArmName + '次数'
          this.yLineName = cbArmName + '总次数'
          this.pieTitle = cbArmName + '次数占比：'
          this.funnelTitle = cbArmName + '次数占比：'
          this.getSectorStatistics()
          this.getVehicleTrends()
        })
        .catch(err => {
          throw err
        })
    },
    // 获取趋势图数据
    getVehicleTrends() {
      this.lineChartData = []
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      alarmsVehicleTrends({
        year: this.trendYear,
        unitId: parseInt(this.searchQuery.unitId),
        alarmTypeCode: this.alarmType
      })
        .then(res => {
          const { data } = res
          const trendData = new Array(12).fill(0)
          data.forEach(item => {
            item.yearPlusMonth = item.yearPlusMonth.toString().split(`${this.trendYear}`)[1]
            trendData[item.yearPlusMonth - 1] = item.alarmCount
          })
          this.lineChartData = trendData
        })
        .catch(err => {
          throw err
        })
    },
    // 搜索数据
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
    // 获取梯形图及扇形图数据
    getSectorStatistics() {
      this.pieChartData = []
      this.funnelChartData = []
      this.searchQuery.alarmTypeCode = this.alarmType
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      sectorStatistics({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          let sum = 0
          data.forEach(v => { sum += v.alarmCount })
          data.forEach(v => {
            this.pieChartData.push({ value: v.alarmCount, name: vehicleTypeMap[v.vehicleTypeCode] })
            this.funnelChartData.push({
              value: v.alarmCount === 0 ? '' : v.alarmCount / sum * 100,
              name: vehicleTypeMap[v.vehicleTypeCode]
            })
          })
          this.funnelChartData.forEach(item => {
            if (item.value) {
              item.value = item.value.toFixed(2)
            } else {
              item.value = 0
            }
          })
        })
        .catch(err => {
          throw err
        })
    },
    // 获取地区选项
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
    // 删除最后一层空的 hilren
    deleteEmptyChilren(data) {
      data.children.length === 0 ? data.children = null : data.children.forEach(v => this.deleteEmptyChilren(v))
    },
    getBarChartData(data) {
      const colorList = ['#91C7AE', '#339999', '#99CCFF', '#66CC99', '#EBAC4A', '#666699', '#FF99CC', '#CC9933', '#FFCC33', '#003333']
      const allVehicleCountMap = new Map()
      const accessRateMap = {}
      this.tableData = []
      data.forEach(v => {
        const typeName = vehicleTypeMap[v.vehicleTypeCode]
        this.lineMixBarXData.push(v.region)
        this.legendData.push(typeName)
        if (accessRateMap[v.region]) {
          accessRateMap[v.region] += v.alarmCount
        } else {
          accessRateMap[v.region] = v.alarmCount
        }
      })
      this.lineMixBarXData = Array.from(new Set(this.lineMixBarXData))
      this.legendData = Array.from(new Set(this.legendData))
      this.accessRateData = Object.values(accessRateMap)
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
      this.getTableData(data, allVehicleCountMap)
      this.twoLevelColums = [...allVehicleCountMap.keys()]
      this.barChartData = [...allVehicleCountMap.values()]
    },
    // 获取表格数据
    getTableData(data, allVehicleCountMap) {
      const dataMap = {}
      this.lineMixBarXData.forEach((v) => {
        dataMap[v] = {}
      })

      data.forEach((item) => {
        const name = item.region
        dataMap[name][vehicleTypeMap[item.vehicleTypeCode]] = item.alarmCount
      })

      for (const i of Object.values(dataMap)) {
        this.legendData.forEach((v) => {
          if (!i[v]) {
            i[v] = 0
          }
        })
      }
      for (const i of Object.values(dataMap)) {
        for (const j in i) {
          allVehicleCountMap.get(j).data.push(i[j])
        }
      }

      for (const i in dataMap) {
        const data = { region: i }
        data[this.tableLabel] = 0
        for (const j in dataMap[i]) {
          data[j] = dataMap[i][j]
          data[this.tableLabel] += data[j]
        }
        this.tableData.push(data)
      }
    },
    getMaxYdata(data) {
      data.forEach(item => {
        item.alarmCount > this.ymax ? this.ymax = item.alarmCount : ''
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
      if (this.searchQuery.unitId.length === 2) this.searchQuery.unitId = this.searchQuery.unitId[1]
      this.searchQuery.alarmTypeCode = this.alarmType
      alarmsVehicleSystem({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          this.getBarChartData(data)
          this.getMaxYdata(data)

          // 合计行
          const sumObj = { region: '合计' }
          this.twoLevelColums.forEach(v => {
            let sum = 0; let total = 0
            this.tableData.forEach(item => {
              sum += item[v]
              total += item[this.tableLabel]
            })
            sumObj[this.tableLabel] = total
            sumObj[v] = sum
          })
          this.tableData.push(sumObj)
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
