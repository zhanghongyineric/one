<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'// 5.0版本与之前版本引入方式不同
import resize from '../mixins/resize'

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
        console.log(val)
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
          trigger: 'item',
          formatter: '{b} {d}%',
          backgroundColor: 'black',
          borderColor: 'black',
          textStyle: {
            color: 'white'
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [15, 120],
            data: chartData,
            roseType: 'area',
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n {d}%',
              fontStyle: 'italic',
              fontSize: 14,
              backgroundColor: 'transparent',
              color: 'white'
            }
          }
        ]
      })
    }
  }
}
</script>
