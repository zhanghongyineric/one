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
      default: '50%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      default: () => [],
      required: true
    },
    title: {
      type: String,
      default: '',
      required: true
    },
    textColor: {
      type: String,
      default: '#fff'
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
    setOptions(data) {
      const colorList = ['#749F83', '#5EA8C8', '#91C7AE', '#337DA2', '#F1C67D', '#DF8330', '#C7E2F5', '#FCD967', '#17808F', '#48B078', '#2FC4FE']
      this.chart.setOption({
        title: {
          text: this.title,
          x: 10,
          y: 10,
          textStyle: {
            color: this.textColor
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '车辆类型',
            type: 'pie',
            radius: '50%',
            data: this.chartData,
            label: {
              normal: {
                textStyle: {
                  fontSize: '14',
                  fontweight: '500',
                  color: this.textColor
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
