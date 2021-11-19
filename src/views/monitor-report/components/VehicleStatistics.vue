<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title" style="color:#fff">车辆基本情况统计</span>
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
      />
      <el-table-column
        prop="vehicleCount"
        label="车辆数"
      />
      <el-table-column
        prop="vehicleOnlineCount"
        label="在线车辆数"
      />
      <el-table-column
        v-slot="{row}"
        prop="onlineRate"
        label="在线率"
      >
        {{ row.onlineRate === null?'-':`${row.onlineRate}%` }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="mileage"
        label="累计行驶总里程"
        width="130"
      >
        {{ row.mileage === null?'-':row.mileage }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="mileageAvg"
        label="车辆平均行驶里程"
      >
        {{ row.mileageAvg === null?'-':row.mileageAvg }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="mileageDayAvg"
        label="车辆日均行驶里程"
      >
        {{ row.mileageDayAvg === null?'-':row.mileageDayAvg }}
      </el-table-column>
      <el-table-column
        v-slot="{row}"
        prop="alarmCountByMileage"
        label="百公里车辆平均报警数"
      >
        {{ row.alarmCountByMileage === null?'-':row.alarmCountByMileage }}
      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>
let sumRow = []// 记录统计行的数据
import { BigNumber } from 'bignumber.js'
export default {
  name: 'VehicleStatistics',
  props: {
    // 表格数据
    data: {
      type: Array,
      required: true
    },
    // 需要显示的车辆类型
    vehicleType: {
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
      allTableData: [], // 所有的表格数据
      sumRow: []
    }
  },
  computed: {
    // 筛选后的表格数据
    tableData() {
      return this.data.filter(item => this.vehicleType.includes(item.vehicleType))
    }
  },
  methods: {
    // 自定义表格列统计方法
    getSummaries(param) {
      const { columns, data } = param

      let totalCar = new BigNumber(0) // 总车辆
      let totalOnLineCar = new BigNumber(0) // 总在线车辆
      let totalOnlineRadio = new BigNumber(0) // 总在线率
      let totalMileage = new BigNumber(0) // 总行驶里程
      let totalAverageMileage = new BigNumber(0) // 总平均行驶里程
      let totalDayAverageMileage = new BigNumber(0) // 总日均行驶里程
      let totalAlarmAverageHundred = new BigNumber(0) // 总百公里平均报警

      let totalDayMileage = new BigNumber(0) // 总日行驶里程
      let totalAlarmHundred = new BigNumber(0)// 总百公里报警

      data.forEach(item => {
        totalCar = totalCar.plus(item[columns[1].property])
        totalOnLineCar = totalOnLineCar.plus(item[columns[2].property])
        totalMileage = totalMileage.plus(item[columns[4].property])

        totalDayMileage = totalDayMileage.plus(new BigNumber(item[columns[1].property]).times(item[columns[6].property] || 0))
        totalAlarmHundred = totalAlarmHundred.plus(new BigNumber(item[columns[1].property]).times(item[columns[7].property] || 0))
      })

      totalOnlineRadio = totalCar.toNumber() === 0 ? '-' : totalOnLineCar.dividedBy(totalCar).times(100).toFixed(2) // 计算总在线率
      totalAverageMileage = totalCar.toNumber() === 0 ? '-' : totalMileage.dividedBy(totalCar).toFixed(2)// 计算总平均行驶里程
      totalDayAverageMileage = totalCar.toNumber() === 0 ? '-' : totalDayMileage.dividedBy(totalCar).toFixed(2)// 计算总日均行驶里程
      totalAlarmAverageHundred = totalCar.toNumber() === 0 ? '-' : totalAlarmHundred.dividedBy(totalCar).toFixed(2)// 计算总百公里平均报警

      // 在导出表格时，将sumRow追加到表格数据里面
      sumRow = {
        'vehicleType': `合计`,
        'vehicleCount': `${totalCar}辆`,
        'vehicleOnlineCount': `${totalOnLineCar}辆`,
        'onlineRate': `${totalOnlineRadio}%`,
        'mileage': `${totalMileage}km`,
        'mileageAvg': `${totalAverageMileage}km`,
        'mileageDayAvg': `${totalDayAverageMileage}km`,
        'alarmCountByMileage': `${totalAlarmAverageHundred}次`
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
        const filterVal = ['vehicleType', 'vehicleCount', 'vehicleOnlineCount', 'onlineRate', 'mileage', 'mileageAvg', 'mileageDayAvg', 'alarmCountByMileage']// 表格字段
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
