<template>
  <div class="pei-con" />
</template>

<script>
// import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TooltipComponent, GridComponent } from 'echarts/components'
import { colors } from '@/options'

export default {
  name: 'LineChart',
  props: {
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    },
    resize: {
      type: Boolean
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    resize: function() {
      this.chart.resize()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })

    window.onresize = _ => {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
    },
    setOptions(chartData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        grid: {
          top: '5%',
          right: '5%',
          left: '2%',
          bottom: '50px',
          containLabel: true
        },
        color: [colors.red, colors.yellow, colors.blue, colors.green, '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['一月第1周', '一月第2周', '一月第3周', '一月第4周', '二月第1周', '二月第2周', '二月第3周'],
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100
        }],
        series: [
          {
            name: '安全码',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            color: '#409EFF',
            // data: chartData
            data: [120, 230, 224, 218, 135, 147, 260]
          },
          {
            name: '安全码',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            color: '#7EE697',
            // data: chartData
            data: [850, 230, 224, 218, 135, 147, 260]
          }
        ]
      })
    }
  }
}
</script>
<style>
.pei-con {
  width: 100%;
  height: 100%;
}
</style>
