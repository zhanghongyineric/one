<template>
  <div class="chart-container">
    <div v-show="hasData" ref="chart" :class="className" :style="{height:height,width:width}" />
    <p v-show="!hasData" :style="{height:height,width:width}" class="no-chart-data  f jc-c ai-c">暂无图表数据</p>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'Echarts',
  mixins: [resize],
  props: {
    // 容器类名
    className: {
      type: String,
      default: 'chart'
    },
    // 容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // 容器高度
    height: {
      type: String,
      default: '350px'
    },
    // 窗口宽高变化时是否自动调整图表大小
    autoResize: {
      type: Boolean,
      default: true
    },
    // 图表设置数据时是否执行resize(用于解决图表宽度为百分比且初始化时父节点不存在的问题)
    resizeWhenSetOption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      hasData: false
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
    // 初始化图表
    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
    },
    // 设置数据
    setOption(options, hasData = true) {
      this.hasData = hasData
      this.$nextTick(_ => {
        if (this.resizeWhenSetOption) this.chart.resize()
        this.chart.setOption(options)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.no-chart-data{
  font-size: 14px;
  color: #909399;
  border: 1px solid #EBEEF5;
}
</style>
