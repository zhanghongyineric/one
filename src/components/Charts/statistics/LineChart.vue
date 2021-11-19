<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '../chart-resize'

export default {
  mixins: [chartResize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      required: true
    },
    textColor: {
      default: '#fff',
      type: String
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
      handler() {
        this.setOptions()
      }
    },
    textColor: {
      handler() {
        this.initChart()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.chart = echarts.init(this.$el).dispose()
      this.chart = null
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions() {
      this.chart.setOption({
        // title: {
        //   text: '入网车辆趋势',
        //   textStyle: {
        //     color: '#fff'
        //   },
        //   x: 10,
        //   y: 10
        // },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          y: 40,
          y2: 60,
          x: 100,
          x2: 50
        },
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: this.textColor
            }
          },
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          nameTextStyle: {
            color: this.textColor
          },
          splitLine: {
            lineStyle: {
              color: '#696969'
            },
            show: true
          },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: this.textColor
            }
          }
        },
        series: [{
          data: this.chartData,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#61A0A8',
              lineStyle: {
                color: '#61A0A8'
              }
            }
          },
          smooth: true
        }]
      })
    }
  }
}
</script>
