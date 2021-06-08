<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="12" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/driver-base-information')">
          <p>驾驶员信息</p>
          <div class="top-box">
            <div class="text-box">
              <span class="num">988</span>
              <span>
                <svg-icon :icon-class="'driver'" style="width: 25px;height: 25px;position:relative;top: 5px;" />
                驾驶员总数
              </span>
            </div>
            <div id="driver" class="chart" />
          </div>
        </div>
      </el-col>
      <el-col :md="12" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/car-base-information')">
          <p>车辆信息</p>
          <div class="top-box">
            <div class="text-box">
              <span class="num">2641</span>
              <span>
                <svg-icon :icon-class="'car'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                车辆总数
              </span>
            </div>
            <div id="car" class="chart" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/company-base-information')">
          <p>企业信息</p>
          <div class="top-box">
            <div class="text-box" style="left: 10%">
              <span class="num">461</span>
              <span>
                <svg-icon :icon-class="'company'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                企业总数
              </span>
            </div>
            <div id="company" class="sm-chart" />
          </div>
        </div>
      </el-col>
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/access-platform-information')">
          <p>接入平台信息</p>
          <div class="top-box">
            <div class="text-box" style="left: 10%">
              <span class="num">35</span>
              <span>
                <svg-icon :icon-class="'platform'" style="width: 20px;height: 20px;position:relative;top: 3px;" />
                平台总数
              </span>
            </div>
            <div id="platform" class="sm-chart" />
          </div>
        </div>
      </el-col>
      <el-col :md="8" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/service-provider-information')">
          <p>服务商信息</p>
          <div class="top-box">
            <div class="text-box" style="left: 10%">
              <span class="num">42</span>
              <span>
                <svg-icon :icon-class="'service'" style="width: 15px;height: 15px;" />
                服务商总数
              </span>
            </div>
            <div id="service" class="sm-chart" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'InformationHome',
  data() {
    return {
      driverChart: {},
      carChart: {},
      companyChart: {},
      platformChart: {},
      serviceChart: {},
      driverOption: {},
      carOption: {},
      companyOption: {},
      platformOption: {},
      serviceOption: {}
    }
  },
  mounted() {
    this.driverChart = this.$echarts.init(document.getElementById('driver'))
    this.carChart = this.$echarts.init(document.getElementById('car'))
    this.companyChart = this.$echarts.init(document.getElementById('company'))
    this.platformChart = this.$echarts.init(document.getElementById('platform'))
    this.serviceChart = this.$echarts.init(document.getElementById('service'))
    this.updateEcharts()
  },
  methods: {
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
              { value: 1048, name: '从业' },
              { value: 735, name: '待业' },
              { value: 580, name: '注销' }
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
              { value: 348, name: '停运' },
              { value: 235, name: '注销' },
              { value: 580, name: '转出' },
              { value: 980, name: '正常' },
              { value: 580, name: '暂停服务' }
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
      this.companyOption = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '营运状态',
            type: 'pie',
            radius: ['30%', '50%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: 312, name: '营运', itemStyle: { color: '#9FE080' }},
              { value: 149, name: '歇业', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.platformOption = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '营运状态',
            type: 'pie',
            radius: ['30%', '50%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: 25, name: '正常', itemStyle: { color: '#9FE080' }},
              { value: 10, name: '歇业', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.serviceOption = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '服务商状态',
            type: 'pie',
            radius: ['30%', '50%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: [
              { value: 34, name: '正常', itemStyle: { color: '#9FE080' }},
              { value: 8, name: '注销', itemStyle: { color: '#FF7070' }}
            ]
          }
        ]
      }
      this.driverChart.setOption(this.driverOption)
      this.carChart.setOption(this.carOption)
      this.companyChart.setOption(this.companyOption)
      this.platformChart.setOption(this.platformOption)
      this.serviceChart.setOption(this.serviceOption)
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
}

.chart {
  width: 350px;
  height: 350px;
  position: absolute;
  right: 40px;
}

.sm-chart {
  width: 250px;
  height: 250px;
  position: absolute;
  right: 40px;
  top: 80px;
}

.num {
  font-size: 40px;
  margin-bottom: 5px;
}

.text-box {
  position: absolute;
  top: 40%;
  left: 20%;
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

@media screen and (max-width: 1300px) and (min-width: 990px) {
  .text-box {
    display: none;
  }
}

@media screen and (max-width: 990px) {
  .box {
    margin: 10px;
  }
}
</style>
