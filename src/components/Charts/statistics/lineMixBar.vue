<!-- 堆叠柱状加折线图 -->
<template>
  <div :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '../chart-resize'

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
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions()
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
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['货运车辆', '客运车辆', '入网率'],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['成都市', '遂宁市', '雅安市', '宜宾市', '巴中市'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '车辆数',
            min: 0,
            max: 25000,
            interval: 5000
            // axisLabel: {
            //   formatter: '{value} ml'
            // }
          },
          {
            type: 'value',
            name: '入网率',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '货运车辆',
            type: 'bar',
            data: [209, 490, 709, 2320, 2560]
          },
          {
            name: '客运车辆',
            type: 'bar',
            data: [269, 5934, 904, 2645, 2873]
          },
          {
            name: '入网率',
            type: 'line',
            yAxisIndex: 1,
            data: [20, 22, 33, 45, 63]
          }
        ]
      })
    }
  }
}
</script>
