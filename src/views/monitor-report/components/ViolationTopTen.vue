<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title" :style="{color:theme?'#fff':''}">违章报警排名前十</span>
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
      <el-radio-group v-model="queryType" size="medium">
        <el-radio-button label="company">运输企业</el-radio-button>
        <el-radio-button label="vehicle">营运车辆</el-radio-button>
      </el-radio-group>

    </nav>
    <!--运输企业-->
    <el-table
      v-show="queryType === 'company'"
      v-loading="loading"
      :data="tableData"
      align="center"
      border
    >
      <el-table-column
        label="排序"
        type="index"
        width="50"
      />
      <el-table-column
        prop="unitName"
        label="企业"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="vehicleCount"
        label="车辆总数"
        width="70"
      />
      <el-table-column
        prop="alarmVehicleCount"
        label="车辆报警数"
        width="70"
      />
      <el-table-column
        prop="violationAlarmCount"
        label="总报警数"
        width="70"
      />
      <el-table-column
        prop="vehicleAvgAlarmCount"
        label="车均报警"
        width="70"
      />
      <el-table-column
        align="center"
        label="违规报警"
      >
        <el-table-column
          prop="alarm1"
          label="超速"
        />
        <el-table-column
          prop="alarm2"
          label="疲劳驾驶"
        />
        <el-table-column
          prop="alarm3"
          label="时段禁行"
        />
        <el-table-column
          prop="alarm4"
          label="离线位移"
        />
      </el-table-column>

    </el-table>
    <!--营运车辆-->
    <el-table
      v-show="queryType === 'vehicle'"
      v-loading="loading"
      :data="tableData"
      align="center"
      border
    >
      <el-table-column
        label="排序"
        type="index"
        width="50"
      />
      <el-table-column
        prop="plateNum"
        label="车牌号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="plateType"
        label="车牌颜色"
        width="50"
      />
      <el-table-column
        prop="unitName"
        label="所属企业"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="vehicleType"
        label="车辆类型"
      />
      <el-table-column
        prop="violationAlarmCount"
        label="总报警数"
        width="50"
      />
      <el-table-column
        align="center"
        label="违规报警"
      >
        <el-table-column
          prop="alarm1"
          label="超速"
        />
        <el-table-column
          prop="alarm2"
          label="疲劳驾驶"
        />
        <el-table-column
          prop="alarm3"
          label="时段禁行"
        />
        <el-table-column
          prop="alarm4"
          label="离线位移"
        />
      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'ViolationTopTen',
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
      queryType: 'company'
    }
  },
  computed: {
    tableData() {
      return this.data[this.queryType]
    },
    theme() {
      return this.$store.state.settings.theme === 'dark'
    }
  },
  methods: {
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const config = {
          company: {
            sheetName: '运输企业',
            multiHeader: [['排序', '企业', '车辆总数', '车辆报警数', '总报警数', '车均报警', '违规报警', '', '', '']],
            header: ['', '', '', '', '', '', '超速', '疲劳驾驶', '时段禁行', '离线位移'],
            merges: ['A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:F2', 'G1:J1'],
            filterVal: ['index', 'unitName', 'vehicleCount', 'alarmVehicleCount', 'violationAlarmCount', 'vehicleAvgAlarmCount', 'alarm1', 'alarm2', 'alarm3', 'alarm4'],
            autoWidth: true
          },
          vehicle: {
            sheetName: '营运车辆',
            multiHeader: [['排序', '车牌号', '车辆颜色', '所属企业', '车辆类型', '总报警数', '违规报警', '', '', '']],
            header: ['', '', '', '', '', '', '超速', '疲劳驾驶', '时段禁行', '离线位移'],
            merges: ['A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:F2', 'G1:J1'],
            filterVal: ['index', 'plateNum', 'plateType', 'unitName', 'vehicleType', 'violationAlarmCount', 'alarm1', 'alarm2', 'alarm3', 'alarm4'],
            autoWidth: true
          }
        }
        const data = Object.keys(this.data).map(key => ({
          sheetName: config[key].sheetName,
          multiHeader: config[key].multiHeader,
          header: config[key].header,
          merges: config[key].merges,
          data: this.formatJson(config[key].filterVal, this.formatTableData(this.data[key])),
          autoWidth: true
        }))

        excel.export_json_to_excel_multi({
          data: data,
          bookType: 'xlsx', // 导出文件类型
          filename: '违章报警排名前十'
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
