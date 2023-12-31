<!-- 主要用于信息管理首页柱状图 -->
<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '@/components/Charts/chart-resize'

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
      require: true,
      default: () => []
    },
    xData: {
      type: Array,
      require: true,
      default: () => []
    },
    colorList: {
      type: Array,
      default: () => ['#FF7070', '#5C7BD9', '#FFDC60', '#009966', '#7ED3F4']
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme === 'dark'
    }
  },
  watch: {
    theme() {
      this.setOptions()
    },
    chartData: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.setOptions(val)
        })
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
        xAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            show: true,
            textStyle: {
              color: this.theme ? '#ccc' : '#606266'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: this.theme ? '#ccc' : '#606266'
            }
          }
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        series: [{
          data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: (params) => {
                const colorList = this.colorList
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      })
    }
  }
}
</script>
