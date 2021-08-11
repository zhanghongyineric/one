<!-- 主要用于监测首页中间的在线统计柱状图 -->
<template>
  <div :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from './chart-resize'

export default {
  mixins: [chartResize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '29%'
    },
    chartData: {
      type: Array,
      default: () => []
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
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      this.chart.setOption({
        legend: {
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        dataset: {
          source: this.chartData
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccc'
            }
          }
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: '#FCD967'
            }
          },
          {
            type: 'bar',
            itemStyle: {
              color: '#2FC4FE'
            }
          }
        ]
      })
    }
  }
}
</script>
