<!-- 主要用于监测首页中间的在线统计柱状图 -->
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
      default: '29%'
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
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      this.chart.setOption({
        legend: {
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        dataset: {
          source: [
            ['city', '当前在线', '累计在线'],
            ['成都市', 2000, 3000],
            ['绵阳市', 900, 1500],
            ['遂宁市', 1523, 1888],
            ['巴中市', 999, 1999],
            ['宜宾市', 2000, 3000],
            ['达州市', 900, 1500],
            ['德阳市', 1523, 1888],
            ['自贡市', 999, 1999]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: '#FCD967'
            }
          },
          {
            type: 'bar',
            itemStyle: {
              color: '#2FC4FE'
            }
          }
        ]
      })
    }
  }
}
</script>
