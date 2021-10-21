<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">车辆违章类型报警趋势</span>
      <div class="buttons">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          :loading="downloadLoading"
          @click="handleDownload"
        >导出表格
        </el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-edit"
          @click="dialogVisible = true"
        >编辑图表
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-bottom: 30px;"
      border
    >
      <el-table-column
        label="报警名称"
        prop="a"
      />
      <el-table-column
        label="报警数"
        prop="a"
      />
      <el-table-column
        label="轻微"
        prop="a"
      />
      <el-table-column
        label="一般"
        prop="a"
      />
      <el-table-column
        label="严重"
        prop="a"
      />
      <el-table-column
        label="报警环比数"
        prop="a"
      />
    </el-table>
    <Echarts ref="lineChart" />
    <EditChartDialog :visible.sync="dialogVisible" :chart-data="chartData" @updateChartData="updateChartData" />
  </el-card>
</template>

<script>
import Echarts from '@/components/Echarts'
import { deepClone } from '@/utils'
import EditChartDialog from '@/views/monitor-report/components/EditChartDialog'

export default {
  name: 'VehicleTendency',
  components: { EditChartDialog, Echarts },
  props: {
    data: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹窗可见性
      downloadLoading: false, // 表格下载加载状态
      tableData: [], // 表格数据
      chartData: []
      // 图表数据
    }
  },
  watch: {
    data({ chartData, tableData }) {
      if (chartData.length) {
        this.chartData = chartData
        this.renderChart(chartData)
      }
      this.tableData = deepClone(tableData)
    }
  },
  methods: {
    // 更新图表数据并重新渲染
    updateChartData(data) {
      this.chartData = data
      this.renderChart(data)
    },
    // 通过表格数据渲染图表
    renderChart(data) {
      const chartData = data.map(item => Object.values(item))

      this.$refs['lineChart'].setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['疲劳驾驶', '时段禁行', '离线位移', '超速报警']
        },
        color: ['#D97559', '#E4C477', '#5087EC', '#68BBC4'],
        toolbox: {
          right: 10,
          feature: {
            saveAsImage: {
              title: '下载图表',
              name: '区县车辆统计情况',
              iconStyle: {
                borderColor: '#409EFF'
              }
            }
          }
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '疲劳驾驶',
            type: 'line',
            data: chartData[0]
          },
          {
            name: '时段禁行',
            type: 'line',
            data: chartData[1]
          },
          {
            name: '离线位移',
            type: 'line',
            data: chartData[2]
          },
          {
            name: '超速报警',
            type: 'line',
            data: chartData[3]
          }
        ]
      })
    },
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableHead.filter(head => head.visible).map(item => item.label)// 表头显示文字
        const filterVal = this.tableHead.filter(head => head.visible).map(item => item.prop)// 表格字段
        const list = this.tableData // 表格数据
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '区县车辆统计情况',
          autoWidth: true,
          bookType: 'xlsx'// 导出文件类型
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__row td {
  padding: 5px 0;

  span {
    line-height: 32px;
  }
}

.header-setting {
  margin-right: 10px;
}
</style>
