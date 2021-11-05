<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title" style="color:#fff;">区县车辆统计情况</span>
      <div class="buttons">
        <el-popover trigger="hover">
          <div>
            <el-checkbox
              v-for="(item,index) in tableHead"
              :key="index"
              v-model="item.visible"
              :disabled="item.disabled"
              style="display:block;"
              @change="renderChartByTableData"
            >
              {{ item.label }}
            </el-checkbox>
          </div>
          <el-button slot="reference" type="primary" plain size="mini" icon="el-icon-setting" class="header-setting">
            表头设置
          </el-button>
        </el-popover>
        <el-button v-show="!editing" type="primary" plain size="mini" icon="el-icon-edit" @click="editing = true">编辑表格
        </el-button>
        <el-button v-show="editing" type="success" plain size="mini" icon="el-icon-check" @click="finishEdit">完成编辑
        </el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          :loading="downloadLoading"
          @click="handleDownload"
        >导出表格
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
        v-for="head in visibleTableHead"
        :key="head.prop"
        :prop="head.prop"
        :label="head.label"
      >
        <template v-slot="{row}">
          <span v-show="!editing || head.prop === 'name'">{{ row[head.prop] }}</span>
          <el-input-number
            v-show="editing && head.prop !== 'name'"
            v-model="row[head.prop]"
            style="width: 100%;"
            :controls="false"
            size="small"
          />
        </template>
      </el-table-column>
    </el-table>
    <Echarts ref="lineChart" resize-when-set-option />
  </el-card>
</template>

<script>
import Echarts from '@/components/Echarts'
import { deepClone } from '@/utils'

export default {
  name: 'RegionVehicle',
  components: { Echarts },
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
      downloadLoading: false, // 表格下载加载状态
      editing: false, // 编辑中
      tableHead: [], // 表头
      tableData: []// 表格数据
    }
  },
  computed: {
    visibleTableHead() {
      return this.tableHead.filter(head => head.visible)
    }
  },
  watch: {
    data(data) {
      this.setOption(deepClone(data))
    }
  },
  methods: {
    finishEdit() {
      this.editing = false
      this.renderChartByTableData(this.tableHead, this.tableData)
    },
    // 把数据格式化为表格和图表需要的数据
    setOption({ tableHead, tableData }) {
      // 格式化表格数据
      this.tableHead = tableHead.map((head, index) => ({ ...head, visible: true, disabled: index === 0 }))
      this.tableData = tableData
      this.renderChartByTableData()
    },
    // 通过表格数据渲染图表
    renderChartByTableData() {
      const legend = [] // 图表图例
      const xAxisData = this.tableHead.slice(1).filter(head => head.visible).map(item => item.label)
      // 判断一个字段是否需要显示
      const isVisible = (prop) => {
        return this.tableHead.find(head => head.prop === prop).visible
      }
      // 筛选出需要展示的图表数据
      const chartData = this.tableData.map(data => {
        const cData = []

        legend.push(data.name)
        Object.keys(data).slice(1).forEach(key => {
          if (isVisible(key)) {
            cData.push(data[key])
          }
        })
        return cData
      })
      this.$refs['lineChart'].setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legend,
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
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: legend[0],
            type: 'bar',
            barWidth: 30,
            data: chartData[0]
          },
          {
            name: legend[1],
            type: 'bar',
            barWidth: 30,
            data: chartData[1]
          },
          {
            name: legend[2],
            type: 'line',
            data: chartData[2]
          },
          {
            name: legend[3],
            type: 'line',
            data: chartData[3]
          }
        ]
      }, xAxisData.length > 0)
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
::v-deep {
  .el-card__body {
    width: 100%;
  }

  .el-table__row td {
    padding: 5px 0;

    span {
      line-height: 32px;
    }
  }
}

.header-setting {
  margin-right: 10px;
}
</style>
