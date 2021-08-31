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
    },
    mapData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      mapDataMap: new Map(),
      timer: null
    }
  },
  watch: {
    mapData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
        clearInterval(this.timer)
        this.timer = null
        if (this.mapData.length) {
          let index = 0
          const { length } = this.mapData
          this.timer = setInterval(() => {
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
            if (index > length) index = 0
          }, 3000)
        }
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
          selectedMode: false,
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
                show: true
              },
              borderWidth: 1,
              borderColor: '#17CCDA',
              areaColor: '#17808F'
            },
            emphasis: {
              label: {
                show: true
              },
              areaStyle: {
                color: '#17808F'
              },
              areaColor: '#19F1FF'
            }
          },
          data: this.mapData
        }],
        tooltip: {
          trigger: 'item',
          formatter: (val) => {
            if (val.value) {
              return val.name + '：' + '<br/>' +
              '当前在线：' + val.value + '辆' + '<br/>' +
              '累计在线：' + val.data.count + '辆'
            } else return `暂无数据`
          },
          textStyle: {
            align: 'left'
          }
        }
      })
    }
  }
}
</script>
