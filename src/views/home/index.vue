<template>
  <div class="container" :style="{'background-color': theme?'#0E1521':'#F0F2F5'}">
    <transition name="fade">
      <div v-show="showInfo" class="infomation">
        <el-row :gutter="20">
          <el-col :md="12" :sm="24">
            <div
              :style="{'background-color': theme?'#151d2c':'#fff'}"
              class="box"
              @click="gotoPage('/information-manage/driver-base-information')"
            >
              <p :style="{'color': theme?'#fff':'#606266'}">驾驶员信息</p>
              <div class="top-box">
                <div class="chart-box-left">
                  <bar-chart
                    :x-data="['从业', '待业', '注销']"
                    :chart-data="[driverData.work,driverData.unwork,driverData.logout]"
                    :color-list="['#009966', '#FAC858', '#FF7070']"
                  />
                </div>
                <div class="text-box">
                  <span class="num" :style="{'color': theme?'#fff':'#606266'}">{{ driverData.all }}</span>
                  <span :style="{'color': theme?'#fff':'#606266'}">
                    <svg-icon :icon-class="'driver'" style="width:25px;height:25px;position:relative;top:5px;" />
                    驾驶员总数
                  </span>
                </div>
                <div class="chart-box-right">
                  <pie-chart :name="'驾驶员'" :chart-data="driverPieData" />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="12" :sm="24">
            <div
              class="box"
              :style="{'background-color': theme?'#151d2c':'#fff'}"
              @click="gotoPage('/information-manage/car-base-information')"
            >
              <p :style="{'color': theme?'#fff':'#606266'}">车辆信息</p>
              <div class="top-box">
                <div class="chart-box-left">
                  <bar-chart
                    :class-name="'carColChart'"
                    :x-data="['停运', '注销', '转出', '正常', '暂停']"
                    :chart-data="[carData.stop,carData.logout,carData.out,carData.normal,carData.pause]"
                  />
                </div>
                <div class="text-box">
                  <span class="num" :style="{'color': theme?'#fff':'#606266'}">{{ carData.all }}</span>
                  <span :style="{'color': theme?'#fff':'#606266'}">
                    <svg-icon :icon-class="'car'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                    车辆总数
                  </span>
                </div>
                <div class="chart-box-right">
                  <pie-chart :name="'车辆'" :chart-data="carPieData" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px">
          <el-col :md="8" :sm="24">
            <div
              class="box"
              :style="{'background-color': theme?'#151d2c':'#fff'}"
              @click="gotoPage('/information-manage/company-base-information')"
            >
              <p :style="{'color': theme?'#fff':'#606266'}">企业信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['营运', '歇业']"
                    :chart-data="[companyData.normal,companyData.pause]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num" :style="{'color': theme?'#fff':'#606266'}">{{ companyData.all }}</span>
                  <span :style="{'color': theme?'#fff':'#606266'}">
                    <svg-icon :icon-class="'company'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                    企业总数
                  </span>
                </div>
                <div class="bottom-chart-box-right">
                  <pie-chart :name="'企业'" :chart-data="companyPieData" />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="8" :sm="24">
            <div
              class="box"
              :style="{'background-color': theme?'#151d2c':'#fff'}"
              @click="gotoPage('/information-manage/access-platform-information')"
            >
              <p :style="{'color': theme?'#fff':'#606266'}">接入平台信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['正常', '歇业']"
                    :chart-data="[platformData.normal,platformData.pause]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num" :style="{'color': theme?'#fff':'#606266'}">{{ platformData.all }}</span>
                  <span :style="{'color': theme?'#fff':'#606266'}">
                    <svg-icon :icon-class="'platform'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                    平台总数
                  </span>
                </div>
                <div class="bottom-chart-box-right">
                  <pie-chart :name="'接入平台'" :chart-data="platformPieData" />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="8" :sm="24">
            <div
              class="box"
              :style="{'background-color': theme?'#151d2c':'#fff'}"
              @click="gotoPage('/information-manage/service-provider-information')"
            >
              <p :style="{'color': theme?'#fff':'#606266'}">服务商信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['正常', '注销']"
                    :chart-data="[serviceData.normal,serviceData.logout]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num" :style="{'color': theme?'#fff':'#606266'}">{{ serviceData.all }}</span>
                  <span :style="{'color': theme?'#fff':'#606266'}">
                    <svg-icon :icon-class="'service'" style="width: 15px;height: 15px;" />
                    服务商总数
                  </span>
                </div>
                <div class="bottom-chart-box-right">
                  <pie-chart :name="'服务商'" :chart-data="servicePieData" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div
          class="expand-symbol"
          :style="{'border-bottom-color': theme?'#0E1521':'#F0F2F5'}"
          @click="showInfo = false"
        >
          <div class="top-arrow" />
        </div>
      </div>
    </transition>
    <transition name="fade1">
      <div v-show="!showInfo" class="monitor">
        <el-row :gutter="20" class="left" :style="{'background-color': theme?'#0E1521':'#F0F2F5'}">
          <el-col :span="8">
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff'}">
              <monitor-pie-chart
                :chart-data="carChartData"
                :showlegend="true"
                :position="['50%','65%']"
              />
            </div>
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff'}">
              <monitor-bar-chart :x-data="companyChartXData" :y-data="companyChartYData" :height="'120%'" />
            </div>
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff',cursor:'pointer'}" @click="toFocusVehicle">
              <span class="title" :style="{'color': theme?'#fff':'#606266'}">重点关注车辆列表</span>
              <el-table
                ref="carTable"
                :data="carList"
                fit
                style="width:100%;margin-top: 20px;"
                :cell-style="{padding:'0px'}"
                height="80%"
                :stripe="true"
              >
                <el-table-column prop="plateNum" label="车牌号码" width="100px" align="center" show-overflow-tooltip />
                <el-table-column prop="plateColor" label="车牌颜色" width="100px" align="center" show-overflow-tooltip />
                <el-table-column prop="vehicleType" label="车辆类型" show-overflow-tooltip align="center" />
                <el-table-column prop="safecodeScore" label="安全码得分" align="center" show-overflow-tooltip />
                <el-table-column prop="safecodeColor" label="安全码颜色" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <svg-icon v-if="scope.row.safecodeColor == 1" icon-class="safecode" style="width:16px;height: 16px;background-color:#018E60;margin-top:5px;" />
                    <svg-icon v-else-if="scope.row.safecodeColor == 2" icon-class="safecode" style="width:16px;height: 16px;background-color:#4ea1db;margin-top:5px;" />
                    <svg-icon v-else-if="scope.row.safecodeColor == 3" icon-class="safecode" style="width:16px;height: 16px;background-color:#E6A23C;margin-top:5px;" />
                    <svg-icon v-else icon-class="safecode" style="width:16px;height: 16px;background-color:#F56C6C;margin-top:5px;" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="center" :style="{'background-color': theme?'#151d2c':'#fff'}">
              <span
                class="center-text"
                style="margin-right:35px;"
                :style="{'color': theme?'#fff':'#606266'}"
              >上线车辆：
                <span class="center-num">{{ allCars }}</span> 辆</span>
              <span class="center-text" :style="{'color': theme?'#fff':'#606266'}">在线车辆：
                <span class="center-num">{{ totalOnlineCars }}</span> 辆</span>
              <map-chart
                :map-data="mapData"
                @city-data="updateCityData"
                @right-click="getOnlineVehicle"
                @show-city="setShowCity"
              />
              <dataset-bar-chart :chart-data="mapChartData" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff',cursor:'pointer'}">
              <span class="title" :style="{'color': theme?'#fff':'#606266'}">报警事件</span>
              <el-table
                ref="eventTable"
                :data="eventList"
                fit
                highlight-current-row
                style="width:100%;margin-top:20px;"
                :cell-style="{padding:'0px'}"
                height="80%"
                :stripe="true"
                @row-click="toAlarmDetail"
              >
                <el-table-column prop="plateNum" label="车牌号码" align="center" show-overflow-tooltip width="90px" />
                <el-table-column prop="plateColor" label="车牌颜色" align="center" show-overflow-tooltip width="80px" />
                <el-table-column prop="armTimeStart" label="报警时间" align="center" show-overflow-tooltip width="170px" />
                <el-table-column prop="cbArmName" label="报警类型" align="center" show-overflow-tooltip />
              </el-table>
            </div>
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff'}">
              <span class="title" style="display:block;" :style="{'color': theme?'#fff':'#606266'}">考核分析</span>
              <mutil-pie-chart :chart-data="facilitatorChartData" :title="'服务商'" />
              <mutil-pie-chart :chart-data="mechanismChartData" :title="'运管机构'" />
              <mutil-pie-chart :chart-data="unitAssessChartData" :title="'运输企业'" />
            </div>
            <div class="box-monitor" :style="{'background-color': theme?'#151d2c':'#fff'}">
              <span class="title" :style="{'color': theme?'#fff':'#606266'}">报警趋势分析</span>
              <el-date-picker
                v-model="trendYear"
                type="year"
                placeholder="选择年"
                size="mini"
                style="position:absolute;right:40px;"
                value-format="yyyy"
              />
              <line-chart :chart-data="trendData" />
            </div>
          </el-col>
        </el-row>
        <div class="monitor-top-box" :style="{'background-color': theme?'#0E1521':'#F0F2F5'}">
          <div class="back-color" :style="{'background-color': theme?'#0E1521':'#F0F2F5'}" />
          <div class="back-triangle" :style="{'border-top-color': theme?'#304156':'#fff'}" />
          <div class="closed-box-inner" :style="{'background-color': theme?'#304156':'#fff'}">
            <el-row :gutter="20">
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span
                    class="title-text"
                    :style="{'color': theme?'#fff':'#606266'}"
                    @click="gotoPage('/information-manage/driver-base-information')"
                  >驾驶员信息</span>
                  <span class="little-num">从业：{{ driverData.work }}</span>
                  <span class="little-num">待业：{{ driverData.unwork }}</span>
                  <span class="little-num">注销：{{ driverData.logout }}</span>
                </div>
              </el-col>
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span
                    class="title-text"
                    :style="{'color': theme?'#fff':'#606266'}"
                    @click="gotoPage('/information-manage/car-base-information')"
                  >车辆信息</span>
                  <span class="little-num">正常：{{ carData.normal }}</span>
                  <span class="little-num">停运：{{ carData.stop }}</span>
                  <span class="little-num">注销：{{ carData.logout }}</span>
                  <span class="little-num">转出：{{ carData.out }}</span>
                  <span class="little-num">暂停：{{ carData.pause }}</span>
                </div>
              </el-col>
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span
                    class="title-text"
                    :style="{'color': theme?'#fff':'#606266'}"
                    @click="gotoPage('/information-manage/company-base-information')"
                  >企业信息</span>
                  <span class="little-num">营运：{{ companyData.normal }}</span>
                  <span class="little-num">歇业：{{ companyData.pause }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          class="close-symbol"
          :style="{'border-top-color':theme?'#0E1521':'#F0F2F5'}"
          @click="showInfo = true"
        >
          <div class="bottom-arrow" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
const statusMap = onlineOption['operate_status'].map
import {
  companyNumber,
  serviceNumber,
  platformNumber,
  carNumber,
  driverNumber
} from '@/api/information-manage/home'
import {
  enterpriseRanking,
  vehicleProportion,
  facilitatorAssessmentAnalysis,
  mechanismAssessmentAnalysis,
  unitAssessmentAnalysis,
  onlineVehicle,
  trendAnalysis,
  alarmEvent,
  keyVehicle,
  cityVehicle
} from '@/api/home'
import BarChart from './components/VerticalBarChart.vue'
import PieChart from './components/InfomationPie.vue'
import MonitorPieChart from './components/PieChart.vue'
import MonitorBarChart from './components/HorizontalBarChart.vue'
import MutilPieChart from './components/MutilPieChart.vue'
import LineChart from './components/LineChart.vue'
import MapChart from './components/MapChart.vue'
import DatasetBarChart from './components/DatasetBarChart.vue'

export default {
  name: 'Home',
  components: {
    BarChart,
    PieChart,
    MonitorPieChart,
    MonitorBarChart,
    MutilPieChart,
    LineChart,
    MapChart,
    DatasetBarChart
  },
  data() {
    return {
      showInfo: false,
      companyData: {
        all: 0,
        normal: 0,
        pause: 0
      },
      serviceData: {
        all: 0,
        normal: 0,
        pause: 0
      },
      platformData: {
        all: 0,
        normal: 0,
        pause: 0
      },
      carData: {
        stop: 0,
        all: 0,
        pause: 0,
        normal: 0,
        logout: 0,
        out: 0
      },
      driverData: {
        all: 0,
        work: 0,
        unwork: 0,
        logout: 0
      },
      driverAll: 0,
      driverPieData: [],
      carAll: 0,
      carPieData: [],
      companyAll: 0,
      companyPieData: [],
      platformAll: 0,
      platformPieData: [],
      serviceAll: 0,
      servicePieData: [],

      carChartData: [],
      companyChartXData: [],
      companyChartYData: [],
      eventList: [],
      carList: [],
      totalOnlineCars: 0,
      allCars: 0,
      mapData: [],
      mapChartData: [
        ['city', '当前在线', '累计在线']
      ],
      facilitatorChartData: [],
      mechanismChartData: [],
      unitAssessChartData: [],
      trendData: [],
      mapDataMap: new Map(),
      timer: null, // 定时任务请求地图数据
      showCity: false, // 地图当前展示是否是城市
      trendYear: '' // 趋势当前年
    }
  },
  computed: {
    unitId() {
      return this.$store.state.user.unitId
    },
    role() {
      return this.$store.state.user.role
    },
    theme() {
      return this.$store.state.settings.theme === 'dark'
    }
  },
  watch: {
    showCity(n) {
      if (n) {
        clearInterval(this.timer)
        this.timer = null
      } else {
        this.intervalOnlineCars()
      }
    },
    trendYear() {
      this.getTrendAnalysis()
    }
  },
  created() {
    this.getCompanyNum()
    this.getServiceNum()
    this.getPlatformNum()
    this.getCarNum()
    this.getDriverNum()
    this.getEnterpriseRanking()
    this.getVehicleProportion()
    this.getKeyVehicle()
    // this.getFacilitator()
    // this.getMechanism()
    // this.getUnit()
    this.getCityData()
    this.getAlarmEvent()
    this.intervalOnlineCars()
  },
  mounted() {
    const etable = this.$refs.eventTable.bodyWrapper
    const ctable = this.$refs.carTable.bodyWrapper
    setInterval(() => {
      etable.scrollTop += 1
      ctable.scrollTop += 1
      if (etable.scrollTop + etable.clientHeight >= etable.scrollHeight) etable.scrollTop = 0
      if (ctable.scrollTop + ctable.clientHeight >= ctable.scrollHeight) ctable.scrollTop = 0
    }, 100)
    this.trendYear = new Date().getFullYear().toString()
  },
  methods: {
    // 获取报警事件数据
    getAlarmEvent() {
      alarmEvent()
        .then(({ data }) => {
          if (data) {
            this.eventList = data
            const colorMap = onlineOption['车牌颜色编码'].map
            this.eventList.forEach(item => { item.plateColor = colorMap[item.plateColor] })
          }
        })
        .catch(err => {
          throw err
        })
    },
    toAlarmDetail(row) {
      this.$router.push({
        path: '/alarm-management/prevention-alarm',
        query: {
          plateNum: row.plateNum
        }
      })
    },
    // 定时请求数据
    intervalOnlineCars() {
      this.timer = window.setInterval(() => {
        this.getOnlineVehicle()
        this.getAlarmEvent()
      }, 150000)
      this.$once('hook:deactivated', () => {
        clearInterval(this.timer)
        this.timer = null
      })
      this.$once('hook:activated', () => {
        this.intervalOnlineCars()
      })
    },
    // 判断当前是否在展示城市
    setShowCity(val) {
      this.showCity = val
    },
    getFacilitator() {
      facilitatorAssessmentAnalysis()
        .then((res) => {
          const { data } = res
          this.facilitatorChartData = [
            {
              name: '车辆上线率',
              value: data.vehicleUplineRate * 100
            },
            {
              name: '数据合格率',
              value: data.dynamicDataQualifiedRate * 100
            }
          ]
        })
    },
    getTrendAnalysis() {
      trendAnalysis({ year: this.trendYear })
        .then(res => {
          const { data } = res
          const arr = new Array(12).fill(0)
          if (data) {
            data.forEach(v => {
              arr[parseInt(v.month - 1)] = v.count
            })
            this.trendData = arr
          } else this.trendData = []
        })
        .catch(err => {
          throw err
        })
    },
    getMechanism() {
      mechanismAssessmentAnalysis()
        .then(res => {
          const { data } = res
          this.mechanismChartData = [
            {
              name: '车辆上线率',
              value: data.vehicleUplineRate * 100
            },
            {
              name: '车辆入网率',
              value: data.vehicleAccessRate * 100
            },
            {
              name: '数据合格率',
              value: data.dataQualifiedRate * 100
            }
          ]
        })
    },
    getUnit() {
      unitAssessmentAnalysis()
        .then(res => {
          const { data } = res
          this.unitAssessChartData = [
            {
              name: '车辆上线率',
              value: data.vehicleUplineRate * 100
            },
            {
              name: '车辆入网率',
              value: data.vehicleAccessRate * 100
            },
            {
              name: '数据合格率',
              value: data.dataQualifiedRate * 100
            }
          ]
        })
    },
    getOnlineVehicle() {
      onlineVehicle()
        .then(res => {
          const { data: { realTimetotal, city, onlineVehicletotal }} = res
          this.totalOnlineCars = realTimetotal
          this.allCars = onlineVehicletotal
          this.mapData = []
          this.mapDataMap = new Map()
          this.mapChartData = [
            ['city', '当前在线', '累计在线']
          ]
          city.forEach(item => {
            const { realTimeCount, onlineCount, deptName, deptId, vehicleSum } = item
            if (deptName.includes('分中心')) {
              this.mapData.push({
                value: realTimeCount,
                name: deptName.split('分中心')[0] + '市',
                count: onlineCount,
                sum: vehicleSum,
                deptId
              })
            } else if (deptName.includes('中心')) {
              this.mapData.push({
                value: realTimeCount,
                name: deptName.split('中心')[0] + '市',
                count: onlineCount,
                sum: vehicleSum,
                deptId
              })
            }
            this.mapData.push({
              value: realTimeCount,
              name: deptName,
              count: onlineCount,
              sum: vehicleSum,
              deptId
            })
            this.mapChartData.push([deptName, realTimeCount, onlineCount])
          })
        })
    },
    getKeyVehicle() {
      keyVehicle({
        pageNum: 1,
        pageSize: 50
      }).then(res => {
        const { data } = res
        const colorMap = onlineOption['车牌颜色编码'].map
        const vehicleMap = onlineOption['vehicle_type_code'].map
        data.forEach(item => {
          item.plateColor = colorMap[item.plateColor]
          item.vehicleType = vehicleMap[item.vehicleType]
        })
        this.carList = data
      })
    },
    getEnterpriseRanking() {
      enterpriseRanking({
        pageNum: 1,
        pageSize: 10
      })
        .then(res => {
          const { data: { list, total }} = res
          const startIndex = total > 7 ? 6 : total - 1
          for (let i = startIndex; i >= 0; i--) {
            this.companyChartXData.push(list[i].unitName)
            this.companyChartYData.push(list[i].overScore)
          }
        })
    },
    getVehicleProportion() {
      vehicleProportion({
        pageNum: 1,
        pageSize: 10
      })
        .then(res => {
          const { data } = res
          const vehicleMap = onlineOption['vehicle_type_code'].map
          data.forEach(item => {
            this.carChartData.push({
              value: item.count,
              name: vehicleMap[item.vehicleType]
            })
          })
        })
    },
    getCompanyNum() {
      companyNumber()
        .then(res => {
          const { data } = res
          let all = 0
          data.forEach(item => {
            all += parseInt(item.statusCount)
            switch (statusMap[item.status]) {
              case '营运':
                this.companyData.normal = item.statusCount
                break
              case '歇业':
                this.companyData.pause = item.statusCount
                break
              default: break
            }
          })
          this.companyData.all = all
          this.companyPieData = [
            { value: this.companyData.normal, name: '营运', itemStyle: { color: '#009966' }},
            { value: this.companyData.pause, name: '歇业', itemStyle: { color: '#FF7070' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    getServiceNum() {
      serviceNumber()
        .then(res => {
          const { data } = res
          let all = 0
          data.forEach(item => {
            all += parseInt(item.statusCount)
            switch (statusMap[item.status]) {
              case '正常':
                this.serviceData.normal = item.statusCount
                break
              case '注销':
                this.serviceData.logout = item.statusCount
                break
              default: break
            }
          })
          this.serviceData.all = all
          this.servicePieData = [
            { value: this.serviceData.normal, name: '正常', itemStyle: { color: '#009966' }},
            { value: this.serviceData.logout, name: '注销', itemStyle: { color: '#FF7070' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    getPlatformNum() {
      platformNumber()
        .then(res => {
          const { data } = res
          let all = 0
          data.forEach(item => {
            all += parseInt(item.statusCount)
            switch (statusMap[item.status]) {
              case '正常':
                this.platformData.normal = item.statusCount
                break
              case '歇业':
                this.platformData.pause = item.statusCount
                break
              default: break
            }
          })
          this.platformData.all = all
          this.platformPieData = [
            { value: this.platformData.normal, name: '正常', itemStyle: { color: '#009966' }},
            { value: this.platformData.pause, name: '歇业', itemStyle: { color: '#FF7070' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    getCarNum() {
      carNumber()
        .then(res => {
          const { data } = res
          let all = 0
          data.forEach(item => {
            all += parseInt(item.statusCount)
            switch (statusMap[item.status]) {
              case '停运':
                this.carData.stop = item.statusCount
                break
              case '暂停服务':
                this.carData.pause = item.statusCount
                break
              case '正常':
                this.carData.normal = item.statusCount
                break
              case '注销':
                this.carData.logout = item.statusCount
                break
              case '转出':
                this.carData.out = item.statusCount
                break
              default: break
            }
          })
          this.carData.all = all
          this.carPieData = [
            { value: this.carData.stop, name: '停运', itemStyle: { color: '#FF7070' }},
            { value: this.carData.logout, name: '注销', itemStyle: { color: '#5C7BD9' }},
            { value: this.carData.out, name: '转出', itemStyle: { color: '#FFDC60' }},
            { value: this.carData.normal, name: '正常', itemStyle: { color: '#009966' }},
            { value: this.carData.pause, name: '暂停', itemStyle: { color: '#7ED3F4' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    getDriverNum() {
      driverNumber()
        .then(res => {
          const { data } = res
          let all = 0
          data.forEach(item => {
            all += parseInt(item.statusCount)
            switch (statusMap[item.status]) {
              case '从业':
                this.driverData.work = item.statusCount
                break
              case '待业':
                this.driverData.unwork = item.statusCount
                break
              case '注销':
                this.driverData.logout = item.statusCount
                break
              default: break
            }
          })
          this.driverData.all = all
          this.driverPieData = [
            { value: this.driverData.work, name: '从业', itemStyle: { color: '#009966' }},
            { value: this.driverData.unwork, name: '待业', itemStyle: { color: '#FAC858' }},
            { value: this.driverData.logout, name: '注销', itemStyle: { color: '#FF7070' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    gotoPage(path) {
      this.$router.push(path)
    },
    toFocusVehicle() {
      this.$router.push('/business-management/focus-on-vehicles')
    },
    // 更新城市数据
    updateCityData(data) {
      this.allCars = data.onlineVehicletotal
      this.totalOnlineCars = data.realTimetotal
      this.mapChartData = [
        ['city', '当前在线', '累计在线']
      ]
      data.city.forEach(item => {
        const { realTimeCount, onlineCount, deptName, deptId, vehicleSum } = item
        this.mapData.push({
          value: realTimeCount,
          name: deptName,
          count: onlineCount,
          sum: vehicleSum,
          deptId
        })
        this.mapChartData.push([deptName, realTimeCount, onlineCount])
      })
    },
    // 角色为市级时，获取该市级数据,为 admin 时获取四川省
    getCityData() {
      if (this.role !== 'area') {
        this.getOnlineVehicle()
      } else {
        cityVehicle({ cityId: this.unitId })
          .then(({ data }) => {
            this.updateCityData(data)
            data.city.forEach(item => {
              const { realTimeCount, onlineCount, deptName, deptId, vehicleSum } = item
              this.mapData.push({
                value: realTimeCount,
                name: deptName,
                count: onlineCount,
                sum: vehicleSum,
                deptId
              })
              this.mapChartData.push([deptName, realTimeCount, onlineCount])
            })
          })
          .catch(err => {
            throw err
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  position: relative;
}

.box {
  width: 100%;
  height: 407px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
}

.top-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90%;
}

.bottom-box {
  left: 45% !important;
}

.num {
  font-size: 40px;
  margin-bottom: 5px;
}

.text-box {
  position: absolute;
  top: 40%;
  left: 47%;
}

.text-box span {
  display: block;
  text-align: center;
}

p {
  margin: 0;
  text-align: center;
  padding-top: 15px;
  font-size: 20px;
  font-weight: 700;
}

.chart-box-left {
  width: 55%;
  height: 80%;
  position: absolute;
  left: -5%;
}

.bottom-chart-box-left {
  width: 50%;
  height: 70%;
  position: absolute;
  left: -4%;
}

.bottom-box-position {
  margin-top: 30px;
}

.chart-box-right {
  width: 40%;
  height: 70%;
  position: absolute;
  right: 1%;
}

.bottom-chart-box-right {
  width: 40%;
  height: 80%;
  position: absolute;
  right: 1%;
}

.chart-style {
  width: 100%;
  height: 100%;
}

.closed-box {
  width: 99%;
  height: 50px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding-left: 20px;
  padding-top: 10px;
}

.monitor-top-box {
  width:100%;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-radius: 10px;
}

.back-color {
  position: absolute;
  height: 100px;
  width: 10px;
  left: -10px;
}

.back-triangle {
  position: absolute;
  bottom: 0;
  height: 5px;
  width: 5px;
  border-width: 4px 4px;
  border-style: solid;
  border-color: transparent;
}

.closed-box-inner {
  width: 98.8%;
  height: 100%;
  padding: 10px;
  border-radius: 10px;

  .content-box {
    width: 99%;
    height: 70px;
    text-align: center;
    line-height: 70px;

      .title-text {
        font-size: 18px;
        font-weight: 700;
        display:block;
        position: relative;
        bottom: 17px;
        cursor: pointer;
      }

      .little-num {
        display: inline-block;
        color: #4ea1db;
        margin-right: 15px;
        position: relative;
        bottom: 50px;
      }
  }
}

.expand-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  position: absolute;
  bottom: 50px;
  left: 48%;
  cursor: pointer;
}

.top-arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ccc;
  transform: rotate(45deg);
  position: relative;
  top: 35px;
  left: 10px;
}

.close-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  position: absolute;
  top: 100px;
  left: 48%;
  cursor: pointer;
}

.bottom-arrow {
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #ccc;
  border-right: 2px solid #ccc;
  transform: rotate(45deg);
  position: relative;
  bottom: 15px;
  left: 10px;
}

.box-monitor {
  width: 100%;
  height: calc(29vh - 30px);
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.left {
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.center {
  width: 100%;
  height: calc(100vh - 110px - 90px);
  background-color: #151D2C;
  text-align: center;
}

.center-text {
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
  margin-top: 20px;
  letter-spacing: 1px;

  .center-num {
    color: #2EB5EA;
    font-size: 30px;
  }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 2s
}
.fade-enter, .fade-leave-to {
    opacity: 0.5
}

.fade1-enter-active, .fade-leave-active {
    transition: opacity 2s
}
.fade1-enter, .fade-leave-to {
    opacity: 0.5
}

@media screen and (max-width: 1450px) {
  .text-box {
    left: 42%;
  }
}

@media screen and (max-width: 990px) {
  .box {
    margin: 10px;
  }
}

::v-deep ::-webkit-scrollbar {
  // 滚动条的背景
  width: 1px;
  height: 14px;
  background: #151D2C;
}

::v-deep ::-webkit-scrollbar-track,
::v-deep ::-webkit-scrollbar-thumb {
  border-radius: 999px;
  width: 10px;
  border: 1px solid transparent;
}

::v-deep ::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px #151D2C inset;
}

::v-deep ::-webkit-scrollbar-thumb {
  //滚动条的滑块样式修改
  width: 20px;
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px #151D2C inset;
}

::v-deep ::-webkit-scrollbar-corner {
  background: #151D2C;
}
</style>
