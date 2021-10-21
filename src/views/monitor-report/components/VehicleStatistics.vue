<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">车辆基本情况统计</span>
      <div class="buttons">
        <el-popover trigger="hover">
          <div>
            <el-checkbox
              v-for="item in rows"
              v-model="item.visible"
              style="display:block;"
              @change="rowChange"
            >
              {{ item.label }}
            </el-checkbox>
          </div>
          <el-button slot="reference" type="primary" plain size="mini" icon="el-icon-setting" class="header-setting">
            行设置
          </el-button>
        </el-popover>
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
      border
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        prop="vehicleType"
        label="车辆类型"
        show
      />
      <el-table-column
        prop="vehicleNum"
        label="车辆数"
      />
      <el-table-column
        prop="OnlineVehicleNum"
        label="在线车辆数"
      />
      <el-table-column
        prop="OnlineRadio"
        label="在线率"
      />
      <el-table-column
        prop="mileage"
        label="累计行驶总里程"
      />
      <el-table-column
        prop="averageMileage"
        label="车辆平均行驶里程"
      />
      <el-table-column
        prop="dayAverageMileage"
        label="车辆日均行驶里程"
      />
      <el-table-column
        prop="alarmAverageHundred"
        label="百公里车辆平均报警数"
      />

    </el-table>
  </el-card>
</template>

<script>
let sumRow = []// 记录统计行的数据

export default {
  name: 'VehicleStatistics',
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
      editing: false, // 编辑中
      tableData: [], // 表格数据
      rows: [], // 所有的行
      visibleRows: [], // 展示的行
      sumRow: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler(data) {
        this.tableData = data
        this.rows = data.map((item, index) => ({ label: item.vehicleType, index, visible: true }))
      }
    }
  },
  methods: {
    // 行选中发生改变
    rowChange() {
      const tableData = []

      this.rows.forEach(row => {
        if (row.visible) {
          tableData.push(this.data[row.index])
        }
      })
      this.tableData = tableData
    },
    // 自定义表格列统计方法
    getSummaries(param) {
      const { columns, data } = param

      let totalCar = 0 // 总车辆
      let totalOnLineCar = 0// 总在线车辆
      let totalOnlineRadio = 0// 总在线率
      let totalMileage = 0// 总行驶里程
      let totalAverageMileage = 0// 总平均行驶里程
      let totalDayAverageMileage = 0// 总日均行驶里程
      let totalAlarmAverageHundred = 0// 总百公里平均报警

      let totalDayMileage = 0// 总日行驶里程
      let totalAlarmHundred = 0// 总百公里报警

      data.forEach(item => {
        totalCar += item[columns[1].property]
        totalOnLineCar += item[columns[2].property]
        totalMileage += item[columns[4].property]

        totalDayMileage += item[columns[1].property] * item[columns[6].property]
        totalAlarmHundred += item[columns[1].property] * item[columns[7].property]
      })

      totalOnlineRadio = (totalOnLineCar / totalCar * 100).toFixed(2) // 计算总在线率
      totalAverageMileage = (totalMileage / totalCar).toFixed(2)// 计算总平均行驶里程
      totalDayAverageMileage = (totalDayMileage / totalCar).toFixed(2)// 计算总日均行驶里程
      totalAlarmAverageHundred = (totalAlarmHundred / totalCar).toFixed(2)// 计算总百公里平均报警

      // 在导出表格时，将sumRow追加到表格数据里面
      sumRow = {
        'vehicleType': `合计`,
        'vehicleNum': `${totalCar}辆`,
        'OnlineVehicleNum': `${totalOnLineCar}辆`,
        'OnlineRadio': `${totalOnlineRadio}%`,
        'mileage': `${totalMileage}km`,
        'averageMileage': `${totalAverageMileage}km`,
        'dayAverageMileage': `${totalDayAverageMileage}km`,
        'alarmAverageHundred': `${totalAlarmAverageHundred}次`
      }

      return [
        `合计`,
        `${totalCar}辆`,
        `${totalOnLineCar}辆`,
        `${totalOnlineRadio}%`,
        `${totalMileage}km`,
        `${totalAverageMileage}km`,
        `${totalDayAverageMileage}km`,
        `${totalAlarmAverageHundred}次`
      ]
    },
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
</style>
