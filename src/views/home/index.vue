<template>
  <div class="container">
    <transition name="fade">
      <div v-show="showInfo" class="infomation">
        <el-row :gutter="20">
          <el-col :md="12" :sm="24">
            <div class="box" @click="gotoPage('/information-manage/driver-base-information')">
              <p>驾驶员信息</p>
              <div class="top-box">
                <div class="chart-box-left">
                  <bar-chart
                    :x-data="['从业', '待业', '注销']"
                    :chart-data="[driverData.work,driverData.unwork,driverData.logout]"
                    :color-list="['#009966', '#FAC858', '#FF7070']"
                  />
                </div>
                <div class="text-box">
                  <span class="num">{{ driverData.all }}</span>
                  <span class="total-num">
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
            <div class="box" @click="gotoPage('/information-manage/car-base-information')">
              <p>车辆信息</p>
              <div class="top-box">
                <div class="chart-box-left">
                  <bar-chart
                    :class-name="'carColChart'"
                    :x-data="['停运', '注销', '转出', '正常', '暂停']"
                    :chart-data="[carData.stop,carData.logout,carData.out,carData.normal,carData.pause]"
                  />
                </div>
                <div class="text-box">
                  <span class="num">{{ carData.all }}</span>
                  <span class="total-num">
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
              @click="gotoPage('/information-manage/company-base-information')"
            >
              <p>企业信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['营运', '歇业']"
                    :chart-data="[companyData.normal,companyData.pause]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num">{{ companyData.all }}</span>
                  <span class="total-num">
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
            <div class="box" @click="gotoPage('/information-manage/access-platform-information')">
              <p>接入平台信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['正常', '歇业']"
                    :chart-data="[platformData.normal,platformData.pause]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num">{{ platformData.all }}</span>
                  <span class="total-num">
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
            <div class="box" @click="gotoPage('/information-manage/service-provider-information')">
              <p>服务商信息</p>
              <div class="top-box">
                <div class="bottom-chart-box-left bottom-box-position">
                  <bar-chart
                    :x-data="['正常', '注销']"
                    :chart-data="[serviceData.normal,serviceData.pause]"
                    :color-list="['#009966', '#FF7070']"
                  />
                </div>
                <div class="text-box bottom-box">
                  <span class="num">{{ serviceData.all }}</span>
                  <span class="total-num">
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
        <div class="expand-symbol" @click="showInfo = false">
          <div class="top-arrow" />
        </div>
      </div>
    </transition>
    <transition name="fade1">
      <div v-show="!showInfo" class="monitor">
        <el-row :gutter="20" class="left">
          <el-col :span="8">
            <div class="box-monitor">
              <monitor-pie-chart
                :chart-data="carChartData"
                :showlegend="true"
                :position="['50%','60%']"
              />
            </div>
            <div class="box-monitor">
              <monitor-bar-chart :x-data="companyChartXData" :y-data="companyChartYData" :height="'120%'" />
            </div>
            <div class="box-monitor">
              <span class="title">重点关注车辆列表</span>
              <el-table
                ref="carTable"
                :data="carList"
                fit
                style="width:100%;margin-top: 20px;"
                :header-cell-style="tableHeaderColor"
                :row-style="tableRowStyle"
                :cell-style="{padding:'0px'}"
                height="80%"
                :stripe="true"
              >
                <el-table-column prop="plateNum" label="车牌号码" width="100px" align="center" show-overflow-tooltip />
                <el-table-column prop="plateColor" label="车牌颜色" width="100px" align="center" show-overflow-tooltip />
                <el-table-column prop="vehicleType" label="车辆类型" show-overflow-tooltip align="center" />
                <el-table-column prop="vehicleSumFactor" label="安全系数" align="center" show-overflow-tooltip />
              </el-table>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <!-- <span class="center-text">实时在线车辆： -->
              <span class="center-text" style="margin-right:35px;">入网车辆：
                <span class="center-num">{{ aCars }}</span> 辆</span>
              <span class="center-text">在线车辆：
                <span class="center-num">{{ totalOnlineCars }}</span> 辆</span>
              <map-chart :map-data="mapData" />
              <dataset-bar-chart :chart-data="mapChartData" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box-monitor">
              <span class="title">报警事件</span>
              <el-table
                ref="eventTable"
                :data="eventList"
                fit
                highlight-current-row
                style="width:100%;margin-top:20px;"
                :header-cell-style="tableHeaderColor"
                :row-style="tableRowStyle"
                :cell-style="{padding:'0px'}"
                height="80%"
                :stripe="true"
              >
                <el-table-column prop="plateNum" label="车牌号码" align="center" show-overflow-tooltip width="90px" />
                <el-table-column prop="plateColor" label="车牌颜色" align="center" show-overflow-tooltip width="80px" />
                <el-table-column prop="armTimeStart" label="报警时间" align="center" show-overflow-tooltip width="170px" />
                <el-table-column prop="cbArmName" label="报警类型" align="center" show-overflow-tooltip />
              </el-table>
            </div>
            <div class="box-monitor">
              <span class="title" style="display: block;">考核分析</span>
              <mutil-pie-chart :chart-data="facilitatorChartData" :title="'服务商'" />
              <mutil-pie-chart :chart-data="mechanismChartData" :title="'运管机构'" />
              <mutil-pie-chart :chart-data="unitAssessChartData" :title="'运输企业'" />
            </div>
            <div class="box-monitor">
              <span class="title">报警趋势分析</span>
              <line-chart :chart-data="trendData" />
            </div>
          </el-col>
        </el-row>
        <div class="monitor-top-box">
          <div class="closed-box-inner">
            <el-row :gutter="20">
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span class="title-text">驾驶员信息</span>
                  <span class="little-num">从业：{{ driverData.work }}</span>
                  <span class="little-num">待业：{{ driverData.unwork }}</span>
                  <span class="little-num">注销：{{ driverData.logout }}</span>
                </div>
              </el-col>
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span class="title-text">车辆信息</span>
                  <span class="little-num">正常：{{ carData.normal }}</span>
                  <span class="little-num">停运：{{ carData.stop }}</span>
                  <span class="little-num">注销：{{ carData.logout }}</span>
                  <span class="little-num">转出：{{ carData.out }}</span>
                  <span class="little-num">暂停：{{ carData.pause }}</span>
                </div>
              </el-col>
              <el-col :md="8" :span="24">
                <div class="content-box">
                  <span class="title-text">企业信息</span>
                  <span class="little-num">营运：{{ companyData.normal }}</span>
                  <span class="little-num">歇业：{{ companyData.pause }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="close-symbol" @click="showInfo = true">
          <div class="bottom-arrow" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
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
  keyVehicle,
  facilitatorAssessmentAnalysis,
  mechanismAssessmentAnalysis,
  unitAssessmentAnalysis,
  onlineVehicle,
  trendAnalysis,
  alarmEvent
} from '@/api/home'
import BarChart from '@/components/Charts/VerticalBarChart.vue'
import PieChart from '@/components/Charts/InfomationPie.vue'
import MonitorPieChart from '@/components/Charts/PieChart.vue'
import MonitorBarChart from '@/components/Charts/HorizontalBarChart.vue'
import MutilPieChart from '@/components/Charts/MutilPieChart.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import MapChart from '@/components/Charts/MapChart.vue'
import DatasetBarChart from '@/components/Charts/DatasetBarChart.vue'
import getAreaText from '@/utils/AreaCodeToText'
import { CodeToText } from 'element-china-area-data'

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
      aCars: 0,
      mapData: [],
      mapChartData: [
        ['city', '当前在线', '累计在线']
      ],
      facilitatorChartData: [],
      mechanismChartData: [],
      unitAssessChartData: [],
      trendData: [],
      mapDataMap: new Map()

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
    this.getFacilitator()
    this.getMechanism()
    this.getUnit()
    this.getOnlineVehicle()
    this.getTrendAnalysis()
    this.getAlarmEvent()
  },
  mounted() {
    this.intervalOnlineCars()
    const etable = this.$refs.eventTable.bodyWrapper
    const ctable = this.$refs.carTable.bodyWrapper
    setInterval(() => {
      etable.scrollTop += 1
      ctable.scrollTop += 1
      if (etable.scrollTop + etable.clientHeight >= etable.scrollHeight) etable.scrollTop = 0
      if (ctable.scrollTop + ctable.clientHeight >= ctable.scrollHeight) ctable.scrollTop = 0
    }, 100)
  },
  methods: {
    getAlarmEvent() {
      alarmEvent()
        .then(res => {
          this.eventList = res.data
          const onlineOptions = JSON.parse(localStorage.getItem('onlineOption'))['车牌颜色编码'].map
          this.eventList.forEach(item => { item.plateColor = onlineOptions[item.plateColor] })
        })
        .catch(err => {
          throw err
        })
    },
    intervalOnlineCars() {
      const timer = window.setInterval(() => {
        this.getOnlineVehicle()
        this.getAlarmEvent()
      }, 30000)
      this.$once('hook:deactivated', () => {
        clearInterval(timer)
      })
      this.$once('hook:activated', () => {
        this.intervalOnlineCars()
      })
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
      trendAnalysis()
        .then(res => {
          const { data } = res
          // for (let i = 1; i < 13; i++) {
          //   if (!data[0][i]) data[0][i] = 0
          // }
          // this.trendData = Object.values(data[0])
          this.trendData = Object.values(data)
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
          const { data: { realTimetotal, onlineVehicles, a }} = res
          this.totalOnlineCars = realTimetotal
          this.aCars = a
          this.mapData = []
          this.mapDataMap = new Map()
          this.mapChartData = [
            ['city', '当前在线', '累计在线']
          ]
          onlineVehicles.forEach(item => {
            const city = CodeToText[getAreaText(item.zoneId)[1]]
            const { realTimeCount, onlineCount } = item
            this.mapData.push({
              value: realTimeCount,
              name: city,
              count: onlineCount
            })
            this.mapChartData.push([city, realTimeCount, onlineCount])
          })

          this.mapData.forEach(v => {
            if (!this.mapDataMap.get(v.name)) this.mapDataMap.set(v.name, [v.value, v.count])
            else {
              const val = this.mapDataMap.get(v.name)[0]
              const count = this.mapDataMap.get(v.name)[1]
              this.mapDataMap.set(v.name, [v.value + val, v.count + count])
            }
          })

          this.mapData = []
          for (const item of this.mapDataMap) {
            this.mapData.push({
              name: item[0],
              value: item[1][0],
              count: item[1][1]
            })
          }

          // 同一个市可能有很多数据，应将同一个市的所有数据相加
          if (this.mapChartData[1]) {
            const { length } = this.mapChartData
            for (let i = 1; i < length; i++) {
              for (let j = i + 1; j < length; j++) {
                if (this.mapChartData[j][0] === this.mapChartData[i][0]) {
                  this.mapChartData[i][1] += this.mapChartData[j][1]
                  this.mapChartData[i][2] += this.mapChartData[j][2]
                }
              }
            }
            const cityMap = new Map()
            for (let i = 1; i < this.mapChartData.length; i++) {
              const city = this.mapChartData[i][0]
              const online = this.mapChartData[i][1]
              const total = this.mapChartData[i][2]
              if (!cityMap.has(city)) {
                cityMap.set(city, `${city},${online},${total}`)
              }
            }
            const dataArr = [['city', '当前在线', '累计在线']]
            for (const value of cityMap.values()) {
              dataArr.push(value.split(','))
            }
            this.mapChartData = dataArr
          }
        })
    },
    getKeyVehicle() {
      keyVehicle({
        pageNum: 1,
        pageSize: 50
      }).then(res => {
        const { data } = res
        this.carList = data
      })
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #202B3A;color: #fff;font-weight: 500;'
      }
    },
    tableRowStyle() {
      return { 'background-color': '#122230', 'color': '#fff', 'height': 0 }
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
          data.forEach(item => {
            this.carChartData.push({
              value: item.count,
              name: item.vehicleType
            })
          })
        })
    },
    getCompanyNum() {
      companyNumber()
        .then(res => {
          const { data } = res
          this.companyData.all = data['全部']
          this.companyData.normal = data['运营']
          this.companyData.pause = data['歇业']
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
          this.serviceData.all = data['全部']
          this.serviceData.normal = data['正常']
          this.serviceData.pause = data['注销']
          this.servicePieData = [
            { value: this.serviceData.normal, name: '正常', itemStyle: { color: '#009966' }},
            { value: this.serviceData.pause, name: '注销', itemStyle: { color: '#FF7070' }}
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
          this.platformData.all = data['全部']
          this.platformData.normal = data['正常']
          this.platformData.pause = data['歇业']
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
          this.carData.stop = data['停运']
          this.carData.all = data['全部']
          this.carData.pause = data['暂停服务']
          this.carData.normal = data['正常']
          this.carData.logout = data['注销']
          this.carData.out = data['转出']
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
          this.driverData.all = data['全部']
          this.driverData.work = data['从业']
          this.driverData.unwork = data['待业']
          this.driverData.logout = data['注销']
          this.driverPieData = [
            { value: data['从业'], name: '从业', itemStyle: { color: '#009966' }},
            { value: data['待业'], name: '待业', itemStyle: { color: '#FAC858' }},
            { value: data['注销'], name: '注销', itemStyle: { color: '#FF7070' }}
          ]
        })
        .catch(err => {
          throw err
        })
    },
    gotoPage(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  background-color: #0E1521;
  position: relative;
}

.box {
  width: 100%;
  height: 407px;
  background-color: #151D2C;
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
  color: #fff;
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
  color: #fff;
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

.total-num {
  color: #fff;
}

.closed-box {
  width: 99%;
  height: 50px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding-left: 20px;
  background-color: #0E1521;
  padding-top: 10px;
}

.monitor-top-box {
  width:100%;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding-left: 20px;
  background-color: #0E1521;
  padding-top: 10px;
}

.closed-box-inner {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #0E1521;

  .content-box {
    background-color: #0E1521;
    width: 99%;
    height: 70px;
    text-align: center;
    line-height: 70px;

      .title-text {
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        display:block;
        position: relative;
        bottom: 17px;
      }

      .little-num {
        display: inline-block;
        color: #19F1FF;
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
  border-color: transparent transparent #0E1521 transparent;
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
  border-color: #0E1521 transparent  transparent  transparent;
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
  background-color: #151D2C;
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
  background-color: #0E1521;
}

.title {
  font-size: 18px;
  color: #fff;
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
  color: #fff;
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

::v-deep .el-table {
  background-color: #151D2C !important;
}

::v-deep .el-table::before {
  width: 0 !important;
}

::v-deep .el-table tbody tr:hover>td {
  background: #122230 !important;
}

::v-deep .el-table__body tr.current-row > td {
  background-color: #122230 !important;
  color: #fff;
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

::v-deep .gutter {
  width: 0px !important;
  background-color: #151D2C !important;
}

::v-deep .el-table td {
  border: 0 !important;
}

::v-deep .el-table th.is-leaf {
  border: 0 !important;
}

::v-deep .el-table__row--striped td {
  background-color: #222C3C !important;
}

</style>
