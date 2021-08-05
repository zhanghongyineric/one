<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from './chart-resize'
import sichuanJson from '@/utils/sichuan.json'

export default {
  mixins: [chartResize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '70%'
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
      echarts.registerMap('四川', sichuanJson)
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions() {
      this.chart.setOption({
        series: [{
          type: 'map',
          mapType: '四川',
          label: {
            show: true,
            normal: {
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              textStyle: {
                color: '#24292e'
              }
            }
          },
          itemStyle: {
            normal: {
              label: {
                show: true// 默认是否显示省份名称
              },
              borderWidth: 1,
              borderColor: '#17CCDA',
              areaColor: '#17808F'
            },
            emphasis: {
              label: {
                show: true// 选中状态是否显示省份名称
              },
              areaStyle: {
                color: '#17808F'// 选中状态的地图板块颜色
              },
              areaColor: '#19F1FF'
            }
          },
          data: [
            { 'name': '成都市', 'value': 200 },
            { 'name': '巴中市', 'value': 100 }
          ]
        }],
        tooltip: {
          trigger: 'item',
          formatter: (val) => {
            if (val.value) return `${val.name}：${val.value}辆`
            else return `${val.name}：0辆`
          }
        }
      })
    }
  }
}
</script>
