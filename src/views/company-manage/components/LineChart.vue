<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
import resize from './mixins/resize'
import { colorOption, colors } from '@/options'

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
      type: Array,
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
    getColor(value) {
      let color = ''
      // 企业折线图
      if (this.$route.params.driverId === undefined) {
        switch (value) {
          case 1:
            color = colors.green
            break
          case 2:
            color = colors.blue
            break
          case 3:
            color = colors.yellow
            break
          case 4:
            color = colors.red
            break
          default:
            console.log('未被捕获的value')
            color = colors.red
        }
      } else { // 用户折线图
        if (value <= 59) {
          color = colors.red
        } else if (value <= 79) {
          color = colors.yellow
        } else if (value <= 89) {
          color = colors.blue
        } else {
          color = colors.green
        }
      }
      return color
    },
    setOptions(chartData) {
      const series = chartData.map(chart => {
        return {
          ...chart,
          data: chart.data.map(value => {
            return {
              // 企业和用户的日期，安全码等级对应字段不一样
              value: value
            }
          })
        }
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          position: 'top',
          // alwaysShowContent: true,
          // formatter: function(data) {
          //   return `<div>
          //     <svg class="code" aria-hidden="true" fill=${data.color} width="100" height="100">
          //       <use xlink:href="#icon-code"/>
          //     </svg>
          //   </div>`
          // },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['红码', '黄码', '蓝码', '绿码'],
          right: 0,
          itemStyle: {
            borderCap: 'round'
          }
        },
        grid: {
          top: '10%',
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis:
          {
            type: 'category',
            data: ['1月第1周', '1月第2周', '1月第3周', '1月第4周', '2月第1周', '2月第2周', '2月第3周', '2月第4周']
          },
        yAxis: {
          type: 'value'
        },
        series: series
      })
    }
  }
}
</script>
