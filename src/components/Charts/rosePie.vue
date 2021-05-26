<template>
  <div class="pei-con" />
</template>

<script>
// import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TooltipComponent } from 'echarts/components'
import { colors } from '@/options'

export default {
  name: 'RosePie',
  props: {
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    },
    radius: {
      type: Array,
      default() {
        return ['0%', '80%']
      }
    },
    labelInLine: {
      type: Boolean,
      default: true
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
          trigger: 'item',
          formatter: function(res) {
            return `${res.seriesName}
                    <br/>${res.marker} ${res.name}： <b>${res.value}</b>家<span style="font-size: 12px">(${res.percent}%)</span>`
          }
        },
        color: [colors.red, colors.yellow, colors.blue, colors.green, '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '安全码',
            type: 'pie',
            radius: this.radius,
            data: chartData,
            // data: [{value: 1048, name: '搜索'},
            //   {value: 735, name: '直接'},
            //   {value: 484, name: '联盟'},
            //   {value: 300, name: '视频'}],
            roseType: 'area',
            label: {
              show: true,
              formatter: this.labelInLine ? '{b} {d}%' : '{b}\n{c}家 {d}%'
            },
            labelLine: {
              length: 10
            }
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
