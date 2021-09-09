<!-- 堆叠柱状加折线图 -->
<template>
  <div :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '../chart-resize'

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
    legendData: {
      type: Array,
      default: () => [],
      required: true
    },
    xData: {
      type: Array,
      default: () => [],
      required: true
    },
    lineData: {
      type: Array,
      default: () => [],
      required: true
    },
    barChartData: {
      type: Array,
      default: () => [],
      required: true
    },
    ymax: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    legendData: {
      deep: true,
      handler(val) {
        this.setOptions()
      }
    },
    barChartData: {
      deep: true,
      handler(val) {
        this.setOptions()
      }
    },
    xData: {
      deep: true,
      handler(val) {
        this.setOptions()
      }
    },
    ymax: {
      handler(val) {
        this.setOptions()
      }
    },
    lineData: {
      deep: true,
      handler(val) {
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
          trigger: 'axis'
        },
        legend: {
          data: this.legendData,
          textStyle: {
            color: '#fff'
          },
          bottom: 10
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              textStyle: {
                color: '#ccc'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '车辆数',
            nameTextStyle: {
              color: '#fff'
            },
            min: 0,
            max: this.ymax,
            interval: this.ymax / 5,
            axisLabel: {
              formatter: '{value} 辆',
              textStyle: {
                color: '#ccc'
              }
            }
          },
          {
            type: 'value',
            name: '入网率',
            nameTextStyle: {
              color: '#fff'
            },
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %',
              textStyle: {
                color: '#ccc'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#696969'
              },
              show: true
            }
          }
        ],
        series: [
          ...this.barChartData,
          {
            name: '入网率',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#2ec7c9',
                lineStyle: {
                  color: '#2ec7c9'
                }
              }
            },
            yAxisIndex: 1,
            data: this.lineData,
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff'
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
