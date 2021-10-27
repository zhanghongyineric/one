<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">违章报警排名前十</span>
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
      <el-radio-group v-model="unitType" size="medium">
        <el-radio-button label="1">运输企业</el-radio-button>
        <el-radio-button label="2">营运企业</el-radio-button>
      </el-radio-group>

    </nav>
    <el-table
      v-loading="loading"
      :data="data.DSM"
      align="center"
      border
    >
      <el-table-column
        prop="a"
        label="排序"
        show
        width="50"
      />
      <el-table-column
        prop="b"
        label="企业"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="c"
        label="车辆总数"
        width="50"
      />
      <el-table-column
        prop="d"
        label="车辆报警数"
        width="70"
      />
      <el-table-column
        prop="f"
        label="总报警数"
        width="50"
      />
      <el-table-column
        prop="g"
        label="车均报警"
        width="50"
      />
      <el-table-column
        align="center"
        label="违规报警"
      >
        <el-table-column
          prop="g"
          label="超速"
        />
        <el-table-column
          prop="g"
          label="疲劳驾驶"
        />
        <el-table-column
          prop="g"
          label="时段禁行"
        />
        <el-table-column
          prop="g"
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
      unitType: '1'
    }
  },
  methods: {
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['车辆类型', '车辆数', '在线车辆数', '在线率', '累计行驶总里程', '车辆平均行驶里程', '车辆日均行驶里程', '百公里车辆平均报警数']// 表头显示文字
        const filterVal = ['vehicleType', 'vehicleNum', 'OnlineVehicleNum', 'OnlineRadio', 'mileage', 'averageMileage', 'dayAverageMileage', 'alarmAverageHundred']// 表格字段
        const list = this.tableData.concat([sumRow]) // 表格数据
        const data = this.formatJson(filterVal, list)

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '车辆基本情况统计',
          autoWidth: true,
          bookType: 'xlsx'// 导出文件类型
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
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
