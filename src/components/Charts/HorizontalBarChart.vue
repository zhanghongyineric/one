<!--主要用于监测首页的横向柱状图-->
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
      default: '100%'
    },
    yData: {
      type: Array,
      required: true
    },
    xData: {
      type: Array,
      require: true,
      default: () => []
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
    xData: {
      deep: true,
      handler(val) {
        this.setOptions()
      }
    },
    theme() {
      this.setOptions()
    },
    yData: {
      deep: true,
      handler(val) {
        this.setOptions()
        let index = 0
        const { length } = this.yData
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
    setOptions() {
      const colors = ['#FFFFCB', '#FFFEA7', '#FFFD7F', '#FFFE66', '#FFFD4A', '#FFFD29', '#FFFC01']
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: '#151D2C',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '安全隐患企业排行',
          left: 'left',
          textStyle: {
            color: this.theme ? '#fff' : '#606266'
          }
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            textStyle: {
              color: '#ccc'
            },
            formatter: function(val) {
              if (val.length > 10) {
                return val.substring(0, 10) + '...'
              }
              return val
            }
          }
        },
        grid: {
          containLabel: true
        },
        series: [
          {
            name: '风险程度',
            type: 'bar',
            data: this.yData,
            itemStyle: {
              normal: {
                color: (params) => {
                  return colors[params.dataIndex]
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
