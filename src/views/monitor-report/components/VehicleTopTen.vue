<template>
  <el-card class="box-card">
    <div slot="header" class="f">
      <span class="title">车辆违章报警排名前十</span>
    </div>

    <nav class="f jc-sb ai-c">
      <el-radio-group v-model="violationType" size="medium">
        <el-radio-button label="1">超速报警</el-radio-button>
        <el-radio-button label="2">疲劳驾驶</el-radio-button>
        <el-radio-button label="3">凌晨运营</el-radio-button>
        <el-radio-button label="4">离线位移</el-radio-button>
      </el-radio-group>
      <el-button
        type="primary"
        plain
        size="mini"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >导出表格
      </el-button>
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
        prop="c"
        label="车牌号"
      />
      <el-table-column
        prop="b"
        label="所属企业"
        min-width="150"
        show-overflow-tooltip
      />

      <el-table-column
        prop="d"
        label="车辆类型"
      />
      <el-table-column
        prop="f"
        label="区域"
      />
      <el-table-column
        prop="g"
        label="报警数"
        width="50"
      />
      <el-table-column
        prop="g"
        label="报警数环比"
      />
      <el-table-column
        prop="g"
        label="报警处理数"
      />
      <el-table-column
        prop="g"
        label="报警处理数环比"
      />

    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'VehicleTopTen',
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
      violationType: '1'
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
