<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
import resize from './mixins/resize'

export default {
  mixins: [resize],
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Number,
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
    },
    setOptions(chartData) {
      this.chart.setOption({
        series: [{
          type: 'gauge',
          radius: '90%',
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.59, '#ee6666'],
                [0.79, '#fac858'],
                [0.89, '#5470c6'],
                [1, '#91cc75']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'inherit'
            }
          },
          axisTick: {
            distance: -10,
            length: 5,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -10,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'inherit',
            distance: 15,
            fontSize: 18
          },
          detail: {
            valueAnimation: true,
            // formatter: '{value} km/h',
            formatter: function(value) {
              let text = ''
              if (value <= 59) {
                text = '高风险'
              } else if (value <= 79) {
                text = '较高风险'
              } else if (value <= 89) {
                text = '一般风险'
              } else {
                text = '低风险'
              }

              return [
                '{a|' + value + '}',
                '{b|' + text + '}'
              ].join('\n')
            },
            rich: {
              a: {
                color: 'inherit',
                padding: [25, 15, 0, 0],
                lineHeight: 35,
                fontSize: 22,
                align: 'center'
              },
              b: {
                color: 'inherit',
                padding: [15, 15, 0, 0],
                fontSize: 14,
                align: 'center'
              }
            },
            color: 'inherit'
          },
          data: [{
            value: chartData
          }]
        }]
      })
    }
  }
}
</script>
