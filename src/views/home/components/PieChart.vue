<!-- 主要用于监测首页饼状图 -->
<template>
  <div :class="className" :style="{height,width}" />
</template>
<script>
import * as echarts from 'echarts'
import chartResize from '@/components/Charts/chart-resize'

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
  computed: {
    theme() {
      const localTheme = localStorage.getItem('theme')
      const stateTheme = this.$store.state.settings.theme
      if (stateTheme !== localTheme) {
        this.$store.commit('settings/CHANGE_THEME', localTheme)
      }
      return localStorage.getItem('theme') === 'dark'
    }
  },
  watch: {
    theme() {
      this.setOptions(this.chartData)
    },
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
        let index = 0
        const { length } = this.chartData
        setInterval(() => {
          if (this.chart) {
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
          }
          setTimeout(() => {
            for (let i = 0; i < length + 1; i++) {
              if (i !== index) {
                if (this.chart) {
                  this.chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: i
                  })
                }
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
      const colorList = [
        '#72E1DE',
        '#6D9DE0',
        '#339933',
        '#19F1FF',
        '#EC4472',
        '#FF9A90',
        '#C7E2F5',
        '#FCD967',
        '#17808F',
        '#48B078',
        '#2FC4FE',
        '#996699',
        '#333399',
        '#CC9966'
      ]
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          backgroundColor: this.theme ? '#151D2C' : '#fff',
          textStyle: {
            color: this.theme ? '#fff' : '#606266'
          }
        },
        title: {
          text: '车辆概况',
          left: 'left',
          textStyle: {
            color: this.theme ? '#fff' : '#606266'
          }
        },
        legend: {
          top: '13%',
          left: 'center',
          textStyle: {
            fontSize: 10,
            color: this.theme ? '#fff' : '#606266'
          },
          itemWidth: 10,
          show: this.showlegend,
          selectedMode: true
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
            data,
            itemStyle: {
              normal: {
                color: (params) => {
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
