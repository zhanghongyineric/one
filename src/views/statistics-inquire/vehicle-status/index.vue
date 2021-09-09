<template>
  <div class="container">
    <div class="table-page-search-wrapper search-box">
      <el-form label-width="100px">
        <el-row :gutter="48">
          <el-col :md="6" :sm="24">
            <el-form-item label="地区：">
              <el-cascader
                v-model="searchQuery.unitId"
                placeholder="请选择地区"
                size="mini"
                :options="areaOptions"
                :props="areaProps"
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="统计周期：">
              <span
                v-for="item in statisticalPeriod"
                :key="item.value"
                :class="['time-text',item.value===searchQuery.status?'active':'']"
                @click="chooseStatus(item.value)"
              >{{ item.label }}</span>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <el-form-item label="时间范围：">
              <el-date-picker
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="mini" type="primary" icon="el-icon-search" style="margin-top:5px;" />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <div class="left-box" style="background-color: #0E1A2A;">
        <line-mix-bar
          :x-data="lineMixBarXData"
          :line-data="accessRateData"
          :legend-data="legendData"
          :bar-chart-data="barChartData"
          :ymax="ymax"
        />
      </div>
      <div class="right-box">
        <pie-chart :chart-data="pieChartData" style="display:inline-block;" />
        <funnel-chart :chart-data="funnelChartData" style="display:inline-block;" />
      </div>
    </div>
    <div class="content-box">
      <div class="left-box">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          style="background-color:#0E1521;"
          @pagination="getList"
        />
        <el-table
          v-model="tableData"
          :striped="true"
          fit
          border
          :header-cell-style="tableHeaderColor"
        >
          <el-table-column label="地区" align="center" />
          <el-table-column label="应入网车辆总数（辆）" align="center" />
          <el-table-column label="入网车辆总数（辆）" align="center" />
          <el-table-column label="总入网率" align="center" />
          <el-table-column label="新增入网车辆" align="center" />
        </el-table>
      </div>
      <div class="right-box">
        <line-chart :chart-data="lineChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import lineMixBar from '@/components/Charts/statistics/lineMixBar.vue'
import Pagination from '@/components/Pagination'
import FunnelChart from '@/components/Charts/statistics/FunnelChart.vue'
import LineChart from '@/components/Charts/statistics/LineChart.vue'
import PieChart from '@/components/Charts/statistics/PieChart.vue'
import {
  areaCode,
  vehicleSystem,
  sectorStatistics,
  vehicleTrends
} from '@/api/statistics-inquire/vehicle-status'

export default {
  name: 'VehicleStatus',
  components: { lineMixBar, Pagination, FunnelChart, PieChart, LineChart },
  data() {
    return {
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      searchQuery: {
        unitId: '800',
        status: '1',
        startTime: '',
        endTime: ''
      },
      areaOptions: [],
      areaProps: {
        label: 'unitName',
        children: 'children',
        value: 'unitId',
        checkStrictly: false
      },
      total: 10,
      xData: [],
      yData: [],
      pieChartData: [],
      funnelChartData: [],
      lineChartData: [],
      statisticalPeriod: [
        {
          label: '本年度',
          value: '1'
        }
      ],

      lineMixBarXData: [],
      accessRateData: [],
      legendData: [],
      barChartData: [],
      ymax: 0
    }
  },
  created() {
    this.getVehicleData()
    this.getAreaCode()
    this.getSectorStatistics()
    this.getVehicleTrends()
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {},
    getVehicleTrends() {
      vehicleTrends({ year: '2021' })
        .then(res => {
          console.log(res)
          const { data } = res
          for (let i = 0; i < 12; i++) {
            if (!data[i]) data[i] = 0
          }
          this.lineChartData = Object.values(data)
        })
        .catch(err => {
          throw err
        })
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) return 'background-color: #212F40;color: #fff;font-weight: 500;'
    },
    chooseStatus(val) {
      this.searchQuery.status = val
    },
    getSectorStatistics() {
      sectorStatistics({
        unitId: '800',
        status: '1'
      })
        .then(res => {
          const { data } = res
          data.forEach(v => {
            this.pieChartData.push({ value: v.vehicleCount, name: v.vehicleTypeName })
            this.funnelChartData.push({ value: v.networkAccessRate * 100, name: v.vehicleTypeName })
          })
        })
        .catch(err => {
          throw err
        })
    },
    getAreaCode() {
      areaCode()
        .then(res => {
          const { data } = res
          this.deleteEmptyChilren(data[0])
          this.areaOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    deleteEmptyChilren(data) {
      data.children.length === 0 ? data.children = null : data.children.forEach(v => this.deleteEmptyChilren(v))
    },
    // 将接口返回数据转换为echarts需要的数据格式
    getBarChartData(data) {
      const colorList = ['#91C7AE', '#339999', '#99CCFF', '#66CC99', '#EBAC4A', '#666699', '#FF99CC', '#CC9933', '#FFCC33', '#003333']
      const vehicleCountMap = new Map()
      const allVehicleCountMap = new Map()
      data.forEach(v => {
        this.lineMixBarXData.push(v.zoneName)
        this.accessRateData.push(v.networkAccessRate * 100)
        v.typeAndProbabilitys.forEach(item => {
          this.legendData.push(item.vehicleTypeName)
        })
      })
      this.legendData = Array.from(new Set(this.legendData))
      this.legendData.forEach((v, index) => {
        allVehicleCountMap.set(v, {
          name: v,
          type: 'bar',
          stack: '应入网',
          data: [],
          itemStyle: {
            normal: {
              color: colorList[index]
            }
          }
        })
        vehicleCountMap.set(v, {
          name: v,
          type: 'bar',
          stack: '入网',
          data: [],
          itemStyle: {
            normal: {
              color: colorList[index]
            }
          }
        })
      })
      data.forEach((v, index) => {
        v.typeAndProbabilitys.forEach(item => {
          vehicleCountMap.get(item.vehicleTypeName).data.push(item.vehicleCount)
          allVehicleCountMap.get(item.vehicleTypeName).data.push(item.allVehicleCount)
        })
        for (const value of vehicleCountMap.values()) {
          if (value.data.length < index + 1) {
            value.data.push(0)
          }
        }
        for (const value of allVehicleCountMap.values()) {
          if (value.data.length < index + 1) {
            value.data.push(0)
          }
        }
      })
      this.barChartData = [...allVehicleCountMap.values(), ...vehicleCountMap.values()]
    },
    getMaxYdata(data) {
      data.forEach(item => {
        if (item.allVehicleCount > this.ymax) {
          this.ymax = item.allVehicleCount
        }
      })
      let num = '1'
      for (let i = 0; i < JSON.stringify(this.ymax).length; i++) {
        num += '0'
      }
      this.ymax = parseInt(num)
    },
    getVehicleData() {
      vehicleSystem({ ...this.searchQuery })
        .then(res => {
          const { data } = res
          this.getBarChartData(data)
          this.getMaxYdata(data)
        })
        .catch(err => {
          throw err
        })
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 84px);
  background-color: #0E1521;
  padding: 10px;
  color: #fff;
}

.search-box {
  width: 100%;
  background-color: #1C2638;
  border-radius: 1px;
  padding-top: 15px;
}

.time-text {
  color: #9FACBB;
  font-weight: 700;
  margin-right: 7%;
  font-size: 14px;
  cursor: pointer;
}

.time-text:hover {
  color: #409EFF;
}

.active {
  color: #409EFF;
}

.content-box {
  width: 100%;
  height: 44.5%;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}

.left-box {
  width: 55%;
  height: 100%;
  background-color: #1C2638;
  border-radius: 5px;
  display: inline-block;
}

.right-box {
  width: 44.5%;
  height: 100%;
  background-color: #1C2638;
  border-radius: 5px;
  display: inline-block;
}

::v-deep .el-form-item__label {
  color: #fff;
}

::v-deep .el-input__inner,
::v-deep .el-range-input,
::v-deep .el-table,
::v-deep .has-gutter {
  background-color: #212F40 !important;
  color: #fff;
}
</style>
