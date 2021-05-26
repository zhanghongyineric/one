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
      // this.setOptions()
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
          formatter: '{b}<br /> {c}家',
          backgroundColor: 'black',
          borderColor: 'black',
          textStyle: {
            color: 'white'
          }
        },
        xAxis: {
          type: 'category',
          data: ['船山区', '安居区', '射洪县', '蓬溪县', '大英县'],
          axisLabel: {
            rotate: 45,
            margin: 9,
            color: 'white'
          }
        },
        yAxis: [{
          type: 'value',
          name: '企业数量',
          nameTextStyle: {
            color: 'white'
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: 'white'
          },
          axisLine: {
            show: true
          }
        }],
        series: [
          {
            type: 'bar',
            data: chartData,
            barWidth: 20
          }
        ]
      })
    }
  }
}
</script>
