<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title" style="color:#fff">车辆违章类型报警趋势</span>
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
      :data="data.tableData"
      style="width: 100%;margin-bottom: 30px;"
      border
    >
      <el-table-column
        label="报警名称"
        prop="violationName"
      />
      <el-table-column
        label="报警数"
        prop="violationCount"
      />
      <el-table-column
        label="轻微"
        prop="c"
      >
        -
      </el-table-column>
      <el-table-column
        label="一般"
        prop="d"
      >
        -
      </el-table-column>
      <el-table-column
        label="严重"
        prop="e"
      >
        -
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        label="报警环比数"
        prop="relativeRatio"
      >
        {{ row.relativeRatio === null?'-': `${row.relativeRatio}%` }}
      </el-table-column>
    </el-table>
    <Echarts ref="lineChart" resize-when-set-option />
    <EditChartDialog :visible.sync="dialogVisible" :table-head="tableHead" :table-data="tableData" :type="type" @updateChartData="updateChartData" />
  </el-card>
</template>

<script>
import Echarts from '@/components/Echarts'
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
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹窗可见性
      downloadLoading: false, // 表格下载加载状态
      chartData: [], // 图表数据
      chartLegend: [], // 图表图例
      tableHead: [], // 编辑表格的表头
      tableData: []// 编辑表格的表格数据
    }
  },
  watch: {
    data({ chartData }) {
      this.chartData = chartData
      if (this.chartData.length) {
        const types = ['疲劳驾驶', '时段禁行', '离线位移', '超速报警']
        const length = this.chartData[0].length
        /*
          根据图表数据构建周报或者月报的编辑表格的表头和数据
        */

        // 构建表头和图例
        this.chartLegend = []
        this.tableHead = [{ 'label': '报警名称', prop: 'name' }]
        if (this.type === 'week') { // 周报
          const weekMap = ['一', '二', '三', '四', '五', '六', '日']

          for (let i = 0; i < 7; i++) {
            this.tableHead.push({
              'label': `星期${weekMap[i]}`, prop: String(i)
            })
            this.chartLegend.push(`星期${weekMap[i]}`)
          }
        } else { // 月报
          for (let i = 0; i < length; i++) {
            this.tableHead.push({
              'label': `${i + 1}日`,
              prop: String(i)
            })
            this.chartLegend.push(`${i + 1}日`)
          }
        }
        // 构建表格数据
        this.tableData = chartData.map((item, index) => {
          const obj = { name: types[index] }

          item.forEach((value, index) => {
            obj[index] = value
          })

          return obj
        })
        this.renderChart()
      }
    }
  },
  methods: {
    // 更新图表数据并重新渲染
    updateChartData(data) {
      this.chartData = data
      this.renderChart(data)
    },
    // 通过表格数据渲染图表
    renderChart() {
      const hasData = this.chartData.some(item => item.length)// 是否存在有数据的图表
      this.$refs['lineChart'].setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['疲劳驾驶', '时段禁行', '离线位移', '超速报警'],
          textStyle: {
            color: '#fff'
          }
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
          data: this.chartLegend
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '疲劳驾驶',
            type: 'line',
            data: this.chartData[0]
          },
          {
            name: '时段禁行',
            type: 'line',
            data: this.chartData[1]
          },
          {
            name: '离线位移',
            type: 'line',
            data: this.chartData[2]
          },
          {
            name: '超速报警',
            type: 'line',
            data: this.chartData[3]
          }
        ]
      }, hasData)
    },
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['报警名称', '报警数', '轻微', '一般', '严重', '报警环比数']// 表头显示文字
        const filterVal = ['violationName', 'violationCount', 'a', 'b', 'c', 'relativeRatio']// 表格字段
        const list = this.data.tableData.map(item => ({ ...item, relativeRatio: item.relativeRatio === null ? '-' : `${item.relativeRatio}%` })) // 表格数据
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
