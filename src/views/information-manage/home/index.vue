<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="12" :sm="24">
        <div class="box" @click="gotoPage('/information-manage/driver-base-information')">
          <p>驾驶员信息</p>
          <div class="top-box">
            <div class="chart-box-left">
              <bar-chart
                :x-data="['从业', '待业', '注销']"
                :chart-data="[driverData.work,driverData.unwork,driverData.logout]"
                :color-list="['#A9DF96', '#FAC858', '#FF7070']"
              />
            </div>
            <div class="text-box">
              <span class="num">{{ driverData.all }}</span>
              <span>
                <svg-icon :icon-class="'driver'" style="width: 25px;height: 25px;position:relative;top: 5px;" />
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
              <span>
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
                :color-list="['#A9DF96', '#FF7070']"
              />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ companyData.all }}</span>
              <span>
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
                :color-list="['#A9DF96', '#FF7070']"
              />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ platformData.all }}</span>
              <span>
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
                :color-list="['#A9DF96', '#FF7070']"
              />
            </div>
            <div class="text-box bottom-box">
              <span class="num">{{ serviceData.all }}</span>
              <span>
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
    <div />
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
import BarChart from '@/components/Charts/VerticalBarChart.vue'
import PieChart from '@/components/Charts/InfomationPie.vue'

export default {
  name: 'InformationHome',
  components: { BarChart, PieChart },
  data() {
    return {
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
      servicePieData: []
    }
  },
  created() {
    this.getCompanyNum()
    this.getServiceNum()
    this.getPlatformNum()
    this.getCarNum()
    this.getDriverNum()
  },
  methods: {
    getCompanyNum() {
      companyNumber()
        .then(res => {
          const { data } = res
          this.companyData.all = data['全部']
          this.companyData.normal = data['运营']
          this.companyData.pause = data['歇业']
          this.companyPieData = [
            { value: this.companyData.normal, name: '营运', itemStyle: { color: '#9FE080' }},
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
            { value: this.serviceData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
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
            { value: this.platformData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
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
            { value: this.carData.normal, name: '正常', itemStyle: { color: '#9FE080' }},
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
            { value: data['从业'], name: '从业', itemStyle: { color: '#A9DF96' }},
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

<style scoped>
.container {
  padding: 20px;
}

.box {
  width: 100%;
  height: 350px;
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
