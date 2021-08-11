<!--主要用于监测首页的横向柱状图-->
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
      default: '100%'
    },
    yData: {
      type: Array,
      required: true
    },
    xData: {
      type: Array,
      require: true,
      default: () => []
    },
    showlegend: {
      type: Boolean,
      default: false
    },
    position: {
      type: Array,
      default: () => ['50%', '50%']
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    xData: {
      deep: true,
      handler() {
        this.setOptions()
      }
    },
    yData: {
      deep: true,
      handler() {
        this.setOptions()
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
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '安全隐患企业排行',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            textStyle: {
              color: '#ccc'
            },
            formatter: function(val) {
              if (val.length > 10) {
                return val.substring(0, 10) + '...'
              }
              return val
            }
          }
        },
        grid: {
          containLabel: true
        },
        series: [
          {
            name: '风险程度',
            type: 'bar',
            data: this.yData,
            itemStyle: {
              normal: {
                color: '#FCD967'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
