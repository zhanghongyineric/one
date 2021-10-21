<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">危险驾驶事件</span>
    </div>

    <section>
      <div class="table-title f jc-sb ai-c">
        <h3 style="margin: 0">ADAS报警</h3>
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
      <el-table
        v-loading="loading"
        :data="data.ADAS"
        border
      >
        <el-table-column
          prop="a"
          label="总报警数"
          show
        />
        <el-table-column
          prop="b"
          label="2级报警"
        />
        <el-table-column
          prop="c"
          label="车道偏离2级"
        />
        <el-table-column
          prop="d"
          label="前向碰撞2级"
        />
        <el-table-column
          prop="f"
          label="车距过近2级"
        />
        <el-table-column
          prop="g"
          label="驾驶辅助功能失效2级"
        />

      </el-table>
    </section>
    <section>
      <div class="table-title f jc-sb ai-c" style="margin-top: 10px;">
        <h3 style="margin: 0">DSM报警</h3>
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
      <el-table
        v-loading="loading"
        :data="data.DSM"
        border
      >
        <el-table-column
          prop="a"
          label="总报警数"
          show
        />
        <el-table-column
          prop="b"
          label="2级报警"
        />
        <el-table-column
          prop="c"
          label="接打电话"
        />
        <el-table-column
          prop="d"
          label="抽烟"
        />
        <el-table-column
          prop="f"
          label="生理疲劳"
        />
        <el-table-column
          prop="g"
          label="分神驾驶"
        />
        <el-table-column
          prop="h"
          label="长时间不目视前方"
        />
        <el-table-column
          prop="i"
          label="未监测到驾驶员"
        />

      </el-table>
    </section>
  </el-card>
</template>

<script>
const sumRow = []// 记录统计行的数据

export default {
  name: 'DangerDrive',
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
      rows: [], // 所有的行
      visibleRows: [], // 展示的行
      sumRow: []
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
</style>
