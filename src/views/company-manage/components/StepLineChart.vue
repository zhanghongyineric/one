<!--
  - FileName: StepLineChart.vue
  - @author: ZhouJiaXing
  - @date: 2021/5/25 上午11:14
  -->

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
      const data = chartData.map(item => {
        return {
          value: item,
          itemStyle: {
            color: this.getColor(item)
          }
        }
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          position: 'top',
          // alwaysShowContent: true,
          formatter: function(data) {
            return `<div>
              <svg class="code" aria-hidden="true" fill=${data.color} width="100" height="100">
                <use xlink:href="#icon-code"/>
              </svg>
            </div>`
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'none',
            minValueSpan: 3600 * 24 * 1000 * 5// 最小缩放范围为5天
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            brushSelect: false,
            minValueSpan: 3600 * 24 * 1000 * 5 // 最小缩放范围为5天

          }
        ],
        grid: {
          top: '5%',
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月第1周', '1月第2周', '1月第3周', '1月第4周', '2月第1周', '2月第2周', '2月第3周', '2月第4周']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: function(value) {
                return colorOption.map[value]
              }
            }
          }
        ],
        series: [
          {
            name: '安全码',
            type: 'line',
            step: 'start',
            stack: '总量',
            symbolSize: 10,
            areaStyle: {
              color: '#73c0de'
            },
            lineStyle: {
              color: '#73c0de'
            },
            emphasis: {
              focus: 'series'
            },
            data: data,
            itemStyle: {
              color: 'red'
            }
          }
        ]
      })
    }
  }
}
</script>
