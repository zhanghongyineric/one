<!--主要用于监测首页的考核分析部分-->
<template>
  <div :style="{height,width}" class="chart" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '@/components/Charts/chart-resize'

export default {
  mixins: [chartResize],
  props: {
    width: {
      type: String,
      default: '33%'
    },
    height: {
      type: String,
      default: '80%'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
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
      const color = ['#6d9de0', '#49d896', '#f5d03a', '#f5853a', '#f5503a']
      const pieSeries = []
      const lineYAxis = []

      this.chartData.forEach((v, i) => {
        pieSeries.push({
          name: '设备',
          type: 'pie',
          clockWise: false,
          hoverAnimation: false,
          radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
          center: ['50%', '50%'],
          label: {
            show: false
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
          clockWise: false,
          hoverAnimation: false,
          radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
          center: ['50%', '50%'],
          label: {
            show: false
          },
          data: [{
            value: 7.5,
            itemStyle: {
              color: 'rgba(0, 0, 0, 0)'
            }
          }, {
            value: 2.5,
            name: '',
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            }
          }]
        })
        v.percent = v.value.toFixed(0) + '%'
        lineYAxis.push({
          value: i,
          textStyle: {
            rich: {
              circle: {
                color: color[i],
                padding: [0, 5]
              }
            }
          }
        })
      })

      const option = {
        backgroundColor: this.theme ? '#151D2C' : '#fff',
        color: color,
        title: {
          subtext: this.title,
          x: 'center',
          y: -10,
          subtextStyle: {
            color: '#ccc',
            fontSize: 14
          }
        },
        grid: {
          top: '17%',
          bottom: '61%',
          left: '48%',
          containLabel: false
        },
        yAxis: [{
          zlevel: 1000,
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: (params) => {
              const item = this.chartData[params]
              return item.name + ' ' + item.percent
            },
            interval: 0,
            inside: true,
            textStyle: {
              color: '#fff',
              fontSize: 11
            },
            show: true
          },
          data: lineYAxis
        }],
        xAxis: [{
          show: false
        }],
        series: pieSeries
      }
      this.chart.setOption(option)
    }
  }
}
</script>
<style scoped>
.chart {
  display: inline-block;
  margin-top: 15px;
}
</style>
