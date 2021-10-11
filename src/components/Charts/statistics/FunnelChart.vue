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
      require: true,
      default: () => []
    },
    title: {
      type: String,
      default: '',
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
      handler() {
        this.$nextTick(() => {
          this.setOptions()
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
      this.chart = echarts.init(this.$el).dispose()
      this.chart = null
      this.chart = echarts.init(this.$el)
      this.setOptions()
    },
    setOptions() {
      const colorList = [
        '#1D4F77',
        '#286C91',
        '#1C3C63',
        '#3B92C5',
        '#439DC3',
        '#84BCD1',
        '#A1C1CC',
        '#CFDDDF',
        '#E6E9EA'
      ]
      this.chart.setOption({
        title: {
          text: this.title,
          textStyle: {
            color: '#fff'
          },
          x: 10,
          y: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%',
          show: true
        },
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '45%',
            top: 60,
            bottom: 60,
            width: '50%',
            min: 0,
            max: 100,
            minSize: '30%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              formatter: (params) => {
                return params.value + '%'
              },
              textStyle: {
                color: '#fff'
              }
            },
            labelLine: {
              length: 20,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              normal: {
                color: (params) => {
                  return colorList[params.dataIndex]
                }
              }
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: this.chartData
          },
          {
            name: '漏斗图',
            type: 'funnel',
            left: '45%',
            top: 60,
            hoverAnimation: false,
            silent: true,
            bottom: 60,
            width: '50%',
            min: 0,
            max: 100,
            minSize: '30%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'left',
              formatter: (params) => {
                return params.name
              },
              textStyle: {
                color: '#fff'
              }
            },
            labelLine: {
              length: 20,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              normal: {
                color: (params) => {
                  return colorList[params.dataIndex]
                }
              }
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: this.chartData
          }
        ]
      })
    }
  }
}
</script>
