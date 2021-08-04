<!-- 趋势变化曲线图 -->
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
    }
  },
  data() {
    return {
      chart: null
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
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        // legend: {
        //   data: ['数量']
        // },
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
            // axisLine: {
            //   onZero: false,
            //   lineStyle: {
            //     color: '#fff'
            //   }
            // },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return '数量  ' + params.value +
                    (params.seriesData.length ? '：' + params.seriesData[0].data : '')
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
            type: 'value'
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
            data: [
              2000,
              5000,
              1200,
              3000,
              3300,
              7000,
              8000,
              6000,
              6100,
              4100,
              3900,
              3500
            ]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
