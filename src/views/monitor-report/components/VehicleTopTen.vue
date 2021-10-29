<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">车辆违章报警排名前十</span>
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

    <nav class="f jc-sb ai-c">
      <el-radio-group v-model="violationType" size="medium">
        <el-radio-button :label="0">超速报警</el-radio-button>
        <el-radio-button :label="1">疲劳驾驶</el-radio-button>
        <el-radio-button :label="2">凌晨运营</el-radio-button>
        <el-radio-button :label="3">离线位移</el-radio-button>
      </el-radio-group>
    </nav>
    <el-table
      v-loading="loading"
      :data="tableData"
      align="center"
      border
    >
      <el-table-column
        type="index"
        label="排序"
        width="50"
      />
      <el-table-column
        prop="plateNum"
        label="车牌号"
      />
      <el-table-column
        prop="unitName"
        label="所属企业"
        min-width="150"
        show-overflow-tooltip
      />

      <el-table-column
        prop="vehicleType"
        label="车辆类型"
      />
      <el-table-column
        prop="region"
        label="区域"
      />
      <el-table-column
        prop="violationAlarmCount"
        label="报警数"
        width="50"
      />
      <el-table-column
        v-slot="{row}"
        prop="relativeRatio"
        label="报警数环比"
      >
        {{ row.relativeRatio === null ?'-':`${row.relativeRatio}%` }}
      </el-table-column>
      <el-table-column
        prop="g"
        label="报警处理数"
      >
        -
      </el-table-column>
      <el-table-column
        prop="g"
        label="报警处理数环比"
      >
        -
      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'VehicleTopTen',
  props: {
    data: {
      type: Array,
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
      violationType: 0
    }
  },
  computed: {
    tableData() {
      return this.data[this.violationType]
    }
  },
  methods: {
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['排序', '车牌号', '所属企业', '车辆类型', '区域', '报警数', '报警数环比', '报警处理数', '报警处理数环比']// 表头显示文字
        const filterVal = ['index', 'plateNum', 'unitName', 'vehicleType', 'region', 'violationAlarmCount', 'relativeRatio', 'none', 'none']// 表格字段
        const sheetName = ['超速报警', '疲劳驾驶', '凌晨运营', '离线位移']
        const data = this.data.map((table, index) => ({
          header: tHeader,
          data: this.formatJson(filterVal, this.formatTableData(table)),
          sheetName: sheetName[index],
          autoWidth: true
        }))

        excel.export_json_to_excel_multi({
          data: data,
          bookType: 'xlsx', // 导出文件类型
          filename: '车辆违章报警排名前十'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 格式化表格数据
    formatTableData(tableData) {
      return tableData.map((item, index) => ({
        ...item,
        index: index + 1,
        relativeRatio: item.relativeRatio === null ? '-' : `${item.relativeRatio}%`
      }))
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
.table-title{
  margin-bottom: 10px;
}
nav{
  margin-bottom: 20px;
}
</style>
