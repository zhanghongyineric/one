<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
import resize from './mixins/resize'
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
      type: Object,
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
        title: {
          text: chartData.title,
          show: chartData.title,
          left: 'left',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        // legend: {
        //   top: '5%',
        //   right: '0%',
        //   orient: 'vertical'
        // },
        color: [colors.red, colors.yellow, colors.blue, colors.green, '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '安全码',
            type: 'pie',
            roseType: 'radius',
            // top: '20',
            // right: '20%',
            radius: '80%',
            data: chartData.data,
            label: {
              show: true,
              lineHeight: 20,
              formatter: '{b}{c}个\n 占比{d}%'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
