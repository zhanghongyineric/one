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
      chart: null,
      timer: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
        clearInterval(this.timer)
        this.timer = null
        let index = 0

        const { length } = this.chartData
        this.timer = setInterval(() => {
          if (this.chart) {
            this.chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: index
            })
          }
          setTimeout(() => {
            for (let i = 0; i < length + 1; i++) {
              if (i !== index) {
                if (this.chart) {
                  this.chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: i
                  })
                }
              }
            }
          }, 2700)
          index++
          if (index >= length) index = 0
        }, 3000)
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
        tooltip: {
          position: 'top',
          formatter: (val) => {
            return val.value[0] + '<br/>' +
            '当前在线：' + val.value[1] + '辆' + '<br/>' +
            '累计在线：' + val.value[2] + '辆'
          },
          textStyle: {
            align: 'left',
            color: '#fff'
          },
          backgroundColor: '#151D2C'
        },
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
