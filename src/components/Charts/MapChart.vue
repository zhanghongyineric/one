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
    setOptions() {
      this.chart.setOptions({
        title: {
          text: '在线车辆分布'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(val) {
            // return val.data.name + '<br>人数: ' + val.data.value + '人'
          }
        },
        series: [
          {
            type: 'map',
            map: '四川',
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d',
                label: {
                  show: true,
                  color: 'white'
                }
              }
            },
            roam: true,
            top: 70,
            label: {
              show: true
            },
            data: [
              { name: '阿坝藏族羌族自治州', value: 0 },
              { name: '巴中市', value: 0 },
              { name: '成都市', value: 0 },
              { name: '达州市', value: 0 },
              { name: '德阳市', value: 0 },
              { name: '甘孜藏族自治州', value: 0 },
              { name: '广安市', value: 0 },
              { name: '广元市', value: 0 },
              { name: '乐山市', value: 0 },
              { name: '凉山彝族自治州', value: 0 },
              { name: '泸州市', value: 0 },
              { name: '眉山市', value: 0 },
              { name: '绵阳市', value: 0 },
              { name: '内江市', value: 0 },
              { name: '南充市', value: 0 },
              { name: '攀枝花市', value: 0 },
              { name: '遂宁市', value: 0 },
              { name: '雅安市', value: 0 },
              { name: '宜宾市', value: 0 },
              { name: '资阳市', value: 0 },
              { name: '自贡市', value: 0 }
            ]
          }
        ]
      })
    }
  }
}
</script>
