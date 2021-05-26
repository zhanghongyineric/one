<template>
  <div class="layout-content detail-page">
    <el-card v-loading="loading" class="box-card">
      <div class="unitInfo f" style="width: 100%;">
        <div>
          <div class="title">
            驾驶员信息
          </div>
          <div class="info f-sa">
            <div class="left">
              <GaugeChart width="200px" height="200px" :chart-data="gaugeChart" />
              <p class="text">本周安全指数:{{ gaugeChart }}分</p>
            </div>
            <div class="right">
              <p><span>姓名:{{ driverInfo.driverName || '-' }} </span></p>
              <p>电话:{{ driverInfo.driverTel || '-' }}</p>
              <p>行政区域：{{ driverInfo.area || '-' }}</p>
              <p>驾驶性质：{{ driverInfo.category || '-' }}</p>
              <p>所属企业：{{ driverInfo.unitName || '-' }}</p>
            </div>
          </div>
        </div>
        <div style="margin-left: 20px">
          <div class="title">
            历史安全码
          </div>
          <div class="pieChart">
            <!--            <div class="pickYear">-->
            <!--              <el-date-picker-->
            <!--                v-model="pieChartYear"-->
            <!--                style="width: 100px"-->
            <!--                size="mini"-->
            <!--                type="year"-->
            <!--                placeholder="选择年"-->
            <!--                :clearable="false"-->
            <!--                @change="handleYearChange"-->
            <!--              />-->
            <!--            </div>-->
            <PieChart width="400px" height="220px" :chart-data="pieChart" />
          </div>
        </div>
      </div>
      <div class="unsafe" style="width: 100%;padding-top: 20px">
        <div class="title">
          本周不安全驾驶行为
        </div>
        <div class="panelGroup f-sa">
          <div class="panel f-1 f-c-c" style="background: #5470c6">
            <span>本周总里程：{{ weekUnsafe.totalMils || '-' }}公里</span>
          </div>
          <div class="panel f-1 f-c-c" style="background: #ee6666">
            <span>严重违规：{{ weekUnsafe.verViolation || '-' }}次</span>
            <span
              class="showDetail"
              @click="showDetail(1)"
            >查看详情</span>
          </div>
          <div class="panel f-1 f-c-c" style="background: #fac858">
            <span>一般违规：{{ weekUnsafe.serViolation || '-' }}次</span>
            <span
              class="showDetail"
              @click="showDetail(2)"
            >查看详情</span>
          </div>
          <div class="panel f-1 f-c-c" style="background: #73c0de">
            <span>轻微违规：{{ weekUnsafe.simViolation || '-' }}次  </span>
            <span
              class="showDetail"
              @click="showDetail(3)"
            >查看详情</span>
          </div>
        </div>
        <div class="safe-code-change" style="width: 100%;padding-top: 20px">
          <div class="title">
            安全码走势
          </div>
          <LineChart height="260px" :chart-data="lineChart" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import GaugeChart from '../../components/GaugeChart'
import PieChart from '../../components/PieChart'
import LineChart from '../../components/LineChart'
import { fetchDriver, fetchLineChart, fetchPieChart, fetchUnsafe } from '@/api/company-manage/driver-code'

export default {
  name: 'Detail',
  components: {
    GaugeChart,
    PieChart,
    LineChart
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['driverId'],
  data() {
    return {
      loading: true,
      pieChartYear: new Date().getFullYear().toString(),
      gaugeChart: -1, // 设置为0当值为0时不会触发watch,
      pieChart: [],
      lineChart: [],
      driverInfo: {},
      weekUnsafe: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {

    // 跳转到违规详情页面
    showDetail(level) {
      this.$router.push({
        name: 'DriverViolation',
        query: { driverId: this.driverId, level }
      })
    },
    // 获取页面所需数据
    getData() {
      const params = {
        driverId: this.driverId
      }
      Promise.all([
        fetchDriver(params),
        fetchUnsafe(params),
        fetchLineChart(params),
        fetchPieChart(params)
      ]).then((res) => {
        this.loading = false // 开启loading动画

        this.driverInfo = res[0].data || {}
        this.weekUnsafe = res[1].data || {}

        // 格式化折线图数据
        this.lineChart = res[2].data || []
        // 格式化饼图数据
        this.pieChart = Object.keys(res[3].data || {}).map(key => {
          const obj = res[3].data[key]
          return {
            name: obj.name,
            value: obj.value
          }
        })

        this.gaugeChart = this.driverInfo.safeScore ? this.driverInfo.safeScore : 0
      }).catch(e => {
        this.loading = false
        console.log(e)
      })
    },
    handleYearChange(date) {
      console.log(date.getFullYear().toString())
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-page {
  .title {
    margin: 10px 0;
    padding-left: 10px;
    border-left: 4px solid #32ffc7;
    font-size: 18px;
  }

  .unitInfo {
    width: 500px;

    .pieChart {
      position: relative;
      height: 220px;
      border: 2px solid #32ffc7;

      .pickYear {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 9;
      }
    }
  }

  .info {
    width: 550px;
    height: 220px;
    background: rgb(166, 237, 237);
    border-radius: 5px;

    .left {
      .text {
        margin: -10px 0 0 0;
        text-align: center;
      }
    }

    .right {
      width: 220px;
    }
  }

  .panelGroup {
    .panel {
      position: relative;
      height: 150px;
      margin: 0 10px 0 10px;
      border-radius: 5px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      .showDetail {
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
