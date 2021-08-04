<!--主要用于监测首页的考核分析部分-->
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
      default: '90%'
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
      const color = ['#6d9de0', '#49d896', '#f5d03a', '#f5853a', '#f5503a']
      const chartData = [{
        name: '平台连通率',
        value: 60
      },
      {
        name: '车辆上线率',
        value: 50
      },
      {
        name: '车辆入网率',
        value: 50
      }
      ]
      const pieSeries = []

      chartData.forEach((v, i) => {
        pieSeries.push({
          type: 'pie',
          clockWise: false,
          hoverAnimation: true,
          radius: [75 - i * 15 + '%', 68 - i * 15 + '%'],
          center: ['40%', '50%'],
          label: {
            show: true
          },
          data: [{
            value: v.value,
            name: v.name
          }, {
            value: 100 - v.value,
            name: '',
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            }
          }]
        })
        pieSeries.push({
          name: '',
          type: 'pie',
          silent: true,
          z: 1,
          clockWise: false, // 顺时加载
          hoverAnimation: false, // 鼠标移入变大
          radius: [75 - i * 15 + '%', 68 - i * 15 + '%'],
          center: ['40%', '50%'],
          label: {
            show: false
          },
          data: [{
            value: 100,
            itemStyle: {
              color: '#e8f4ff' // 圆环颜色
            }
          },
          {
            value: 0,
            name: '',
            itemStyle: {
              color: 'red'
            }
          }
          ]
        })
        v.percent = v.value + '%'
      })

      const option = {
        backgroundColor: '#151D2C',
        color: color,
        legend: {
          itemWidth: 14,
          itemHeight: 8,
          icon: 'circle',
          left: '80%',
          top: '20%',
          formatter: (name) => {
            return (
              '{name|' + name + '} {percent|' + chartData.find((item) => {
                return item.name === name
              }).percent + '}'
            )
          },
          textStyle: {
            color: '#beceff', // 元字颜色
            fontSize: 14,
            rich: {
              name: {
                color: '#a6acba',
                fontSize: 11
              },
              percent: {
                color: '#fff',
                fontSize: 11
              }
            }
          }
        },
        series: pieSeries
      }
      this.chart.setOption(option)
    }
  }
}
</script>
