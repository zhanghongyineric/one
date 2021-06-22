<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="12" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/driver-base-information')">
          <p>驾驶员信息</p>
          <div class="top-box">
            <div class="chart-box-left">
              <div id="driverCol" class="chart-style" />
            </div>
            <div class="text-box">
              <span class="num">{{ driverData.all }}</span>
              <span>
                <svg-icon :icon-class="'driver'" style="width: 25px;height: 25px;position:relative;top: 5px;" />
                驾驶员总数
              </span>
            </div>
            <div class="chart-box-right">
              <div id="driver" class="chart-style" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="12" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/car-base-information')">
          <p>车辆信息</p>
          <div class="top-box">
            <div class="chart-box-left">
              <div id="carCol" class="chart-style" />
            </div>
            <div class="text-box">
              <span class="num">{{ carData.all }}</span>
              <span>
                <svg-icon :icon-class="'car'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                车辆总数
              </span>
            </div>
            <div class="chart-box-right">
              <div id="car" class="chart-style" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/company-base-information')">
          <p>企业信息</p>
          <div class="top-box">
            <div class="bottom-chart-box-left bottom-box-position">
              <div id="companyCol" class="chart-style" />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ companyData.all }}</span>
              <span>
                <svg-icon :icon-class="'company'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                企业总数
              </span>
            </div>
            <div class="bottom-chart-box-right">
              <div id="company" class="chart-style" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/access-platform-information')">
          <p>接入平台信息</p>
          <div class="top-box">
            <div class="bottom-chart-box-left bottom-box-position">
              <div id="platformCol" class="chart-style" />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ platformData.all }}</span>
              <span>
                <svg-icon :icon-class="'platform'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                平台总数
              </span>
            </div>
            <div class="bottom-chart-box-right">
              <div id="platform" class="chart-style" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/service-provider-information')">
          <p>服务商信息</p>
          <div class="top-box">
            <div class="bottom-chart-box-left bottom-box-position">
              <div id="serviceCol" class="chart-style" />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ serviceData.all }}</span>
              <span>
                <svg-icon :icon-class="'service'" style="width: 15px;height: 15px;" />
                服务商总数
              </span>
            </div>
            <div class="bottom-chart-box-right">
              <div id="service" class="chart-style" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
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

export default {
  name: 'InformationHome',
  data() {
    return {
      driverChart: {},
      driverColChart: {},

      carChart: {},
      carColChart: {},

      companyChart: {},
      companyColChart: {},

      platformChart: {},
      platformColChart: {},

      serviceChart: {},
      serviceColChart: {},

      driverOption: {},
      driverColOption: {},

      carOption: {},
      carColOption: {},

      companyOption: {},
      companyColOption: {},

      platformOption: {},
      platformColOption: {},

      serviceOption: {},
      serviceColOption: {},

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
      }
    }
  },
  watch: {
    driverData: {
      deep: true,
      handler(val) {
        this.updateEcharts()
      }
    }
  },
  created() {
    this.getCompanyNum()
    this.getServiceNum()
    this.getPlatformNum()
    this.getCarNum()
    this.getDriverNum()
  },
  mounted() {
    const dc = this.driverChart = this.$echarts.init(document.getElementById('driver'))
    const dcc = this.driverColChart = this.$echarts.init(document.getElementById('driverCol'))
    const cc = this.carChart = this.$echarts.init(document.getElementById('car'))
    const ccc = this.carColChart = this.$echarts.init(document.getElementById('carCol'))
    const comc = this.companyChart = this.$echarts.init(document.getElementById('company'))
    const comcc = this.companyColChart = this.$echarts.init(document.getElementById('companyCol'))
    const pc = this.platformChart = this.$echarts.init(document.getElementById('platform'))
    const pcc = this.platformColChart = this.$echarts.init(document.getElementById('platformCol'))
    const sc = this.serviceChart = this.$echarts.init(document.getElementById('service'))
    const scc = this.serviceColChart = this.$echarts.init(document.getElementById('serviceCol'))

    window.addEventListener('resize', function() {
      dcc.resize()
      dc.resize()
      cc.resize()
      ccc.resize()
      comc.resize()
      comcc.resize()
      pc.resize()
      pcc.resize()
      sc.resize()
      scc.resize()
    })
  },
  methods: {
    getCompanyNum() {
      companyNumber()
        .then(res => {
          const { data } = res
          this.companyData.all = data['全部']
          this.companyData.normal = data['运营']
          this.companyData.pause = data['歇业']
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
        })
        .catch(err => {
          throw err
        })
    },
    updateEcharts() {
      this.driverOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: '驾驶员状态',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.driverData.work, name: '从业', itemStyle: { color: '#A9DF96' }},
              { value: this.driverData.unwork, name: '待业', itemStyle: { color: '#FAC858' }},
              { value: this.driverData.logout, name: '注销', itemStyle: { color: '#FF7070' }}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.driverColOption = {
        xAxis: {
          type: 'category',
          data: ['从业', '待业', '注销']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data: [
            this.driverData.work,
            this.driverData.unwork,
            this.driverData.logout
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#A9DF96', '#FAC858', '#FF7070']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.carOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: '运营状态',
            type: 'pie',
            radius: '50%',
            center: ['40%', '50%'],
            data: [
              { value: this.carData.stop, name: '停运', itemStyle: { color: '#FF7070' }},
              { value: this.carData.logout, name: '注销', itemStyle: { color: '#5C7BD9' }},
              { value: this.carData.out, name: '转出', itemStyle: { color: '#FFDC60' }},
              { value: this.carData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
              { value: this.carData.pause, name: '暂停', itemStyle: { color: '#7ED3F4' }}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.carColOption = {
        xAxis: {
          type: 'category',
          data: ['停运', '注销', '转出', '正常', '暂停']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data: [
            this.carData.stop,
            this.carData.logout,
            this.carData.out,
            this.carData.normal,
            this.carData.pause
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#FF7070', '#5C7BD9', '#FFDC60', '#9FE080', '#7ED3F4']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.companyOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: '营运状态',
            type: 'pie',
            radius: '50%',
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: this.companyData.normal, name: '营运', itemStyle: { color: '#9FE080' }},
              { value: this.companyData.pause, name: '歇业', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.companyColOption = {
        xAxis: {
          type: 'category',
          data: ['营运', '歇业']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data: [
            this.companyData.normal,
            this.companyData.pause
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#A9DF96', '#FF7070']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.platformOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: '营运状态',
            type: 'pie',
            radius: '50%',
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: this.platformData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
              { value: this.platformData.pause, name: '歇业', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.platformColOption = {
        xAxis: {
          type: 'category',
          data: ['正常', '歇业']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data: [
            this.serviceData.normal,
            this.serviceData.pause
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#A9DF96', '#FF7070']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.serviceOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: '服务商状态',
            type: 'pie',
            radius: '50%',
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: this.serviceData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
              { value: this.serviceData.pause, name: '注销', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.serviceColOption = {
        xAxis: {
          type: 'category',
          data: ['正常', '注销']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data: [
            this.serviceData.normal,
            this.serviceData.pause
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function(params) {
                const colorList = ['#A9DF96', '#FF7070']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.driverChart.setOption(this.driverOption)
      this.driverColChart.setOption(this.driverColOption)
      this.carChart.setOption(this.carOption)
      this.carColChart.setOption(this.carColOption)
      this.companyChart.setOption(this.companyOption)
      this.companyColChart.setOption(this.companyColOption)
      this.platformChart.setOption(this.platformOption)
      this.platformColChart.setOption(this.platformColOption)
      this.serviceChart.setOption(this.serviceOption)
      this.serviceColChart.setOption(this.serviceColOption)
    },
    gotoPage(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.box {
  width: 100%;
  height: 400px;
  background-color: #fff;
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
  color: #464646;
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
</style>
