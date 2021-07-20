<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from './chart-resize'

export default {
  mixins: [chartResize],
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
      default: '100%'
    },
    chartData: {
      type: Array,
      required: true
    },
    showlegend: {
      type: Boolean,
      default: false
    },
    position: {
      type: Array,
      default: () => ['50%', '50%']
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
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '车辆概况',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          top: '10%',
          left: 'center',
          textStyle: {
            fontSize: 10,
            color: '#fff'
          },
          itemWidth: 10,
          show: this.showlegend
        },
        series: [
          {
            name: '车辆统计',
            type: 'pie',
            radius: ['40%', '70%'],
            center: this.position,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20'
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ]
      })
    }
  }
}
</script>
