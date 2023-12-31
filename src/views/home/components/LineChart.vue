<!-- 趋势变化曲线图 -->
<template>
  <div :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '@/components/Charts/chart-resize'

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
        this.setOptions(val)
        let index = 0
        const { length } = this.chartData
        setInterval(() => {
          if (this.chart) {
            this.chart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: index
            })
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
    setOptions() {
      const colors = ['#5470C6', '#EE6666']
      const option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: this.theme ? '#151D2C' : '#fff',
          textStyle: {
            color: this.theme ? '#fff' : '#606266'
          }
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: this.theme ? '#ccc' : '#606266'
              },
              interval: 0
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return params.value
                }
              }
            },
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: this.theme ? '#ccc' : '#606266'
              },
              formatter: function(val) {
                return val > 9999 ? val / 10000 + '万' : val
              }
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'line',
            smooth: true,
            emphasis: {
              focus: 'series'
            },
            data: this.chartData
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
