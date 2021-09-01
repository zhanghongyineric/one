<!-- 主要用于监测首页饼状图 -->
<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '../chart-resize'

export default {
  mixins: [chartResize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '50%'
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
        let index = 0
        const { length } = this.chartData
        setInterval(() => {
          this.chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
          })
          this.chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index
          })
          setTimeout(() => {
            for (let i = 0; i < length + 1; i++) {
              if (i !== index) {
                this.chart.dispatchAction({
                  type: 'downplay',
                  seriesIndex: 0,
                  dataIndex: i
                })
              }
            }
          }, 2700)
          index++
          if (index >= length) index = 0
        }, 3000)
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
      const colorList = ['#72E1DE', '#6D9DE0', '#339933', '#19F1FF', '#EC4472', '#FF9A90', '#C7E2F5', '#FCD967', '#17808F', '#48B078', '#2FC4FE']
      this.chart.setOption({
        title: {
          text: '车辆类型入网车辆数占比',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },

        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '班线客运' },
              { value: 735, name: '危险品运输' },
              { value: 580, name: '公交车' },
              { value: 484, name: '出租车' },
              { value: 300, name: '普通货运' }
            ],
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
