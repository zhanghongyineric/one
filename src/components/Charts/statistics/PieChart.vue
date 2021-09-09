<!-- 主要用于监测首页饼状图 -->
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
      const colorList = ['#749F83', '#5EA8C8', '#91C7AE', '#337DA2', '#F1C67D', '#DF8330', '#C7E2F5', '#FCD967', '#17808F', '#48B078', '#2FC4FE']
      this.chart.setOption({
        title: {
          text: '车辆类型入网车辆数占比：',
          x: 10,
          y: 10,
          textStyle: {
            color: '#fff'
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
                  color: '#fff'
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
