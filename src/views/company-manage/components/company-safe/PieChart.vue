<!--
  - FileName: PieChart.vue
  - @author: ChenHaiPing
  - @date: 2021/4/16 上午11:20
  -->

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
import resize from '../mixins/resize'
import { colors } from '@/options'

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
    setOptions(chartData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        color: [colors.red, colors.yellow, colors.blue, colors.green, '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '安全码',
            type: 'pie',
            right: '20%',
            radius: ['30%', '80%'],
            data: chartData,
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{b|{b}}\n{hr|}\n  {per|{c}家 {d}%}  ',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 25,
                  align: 'center'
                },
                per: {
                  padding: [3, 4],
                  borderRadius: 4,
                  height: 25
                }
              }
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        ]
      })
    }
  }
}
</script>
