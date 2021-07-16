<template>
  <div class="container">
    <el-row :gutter="20" class="left">
      <el-col :span="8">
        <div class="box">
          <pie-chart
            :chart-data="carChartData"
            :showlegend="true"
            :position="['50%','60%']"
          />
        </div>
        <div class="box">
          <bar-chart :x-data="companyChartXData" :y-data="companyChartYData" :height="'120%'" />
        </div>
        <div class="box">
          <span class="title">重点关注车辆列表</span>
          <el-table
            :data="carList"
            fit
            border
            highlight-current-row
            style="width:100%;margin-top: 20px"
          >
            <el-table-column prop="number" label="车牌号码" />
            <el-table-column prop="number" label="车牌颜色" />
            <el-table-column prop="number" label="车辆类型" />
            <el-table-column prop="number" label="驾驶员" />
            <el-table-column prop="number" label="行驶里程" />
            <el-table-column prop="number" label="安全系数" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center" />
      </el-col>
      <el-col :span="8">
        <div class="box" />
        <div class="box" />
        <div class="box" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PieChart from '@/components/Charts/PieChart.vue'
import BarChart from '@/components/Charts/BarChart.vue'

export default {
  name: 'MonitorHome',
  components: { PieChart, BarChart },
  data() {
    return {
      carChartData: [
        { value: 1048, name: '班线客运' },
        { value: 735, name: '普通客运' },
        { value: 580, name: '旅游客运' },
        { value: 484, name: '危险品运输' },
        { value: 300, name: '出租' },
        { value: 200, name: '农村客运' },
        { value: 200, name: '公交' },
        { value: 200, name: '个体户' }
      ],
      companyChartXData: ['宜宾长顺运输公司', '遂宁运输有限公司', '阳光汽车公司', '成都交通运输公司'],
      companyChartYData: [5, 8, 10, 15],
      carList: []
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    headerStyle() {
      return 'headerStyle'
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 84px);
  background-color: #0E1521;
}

.left {
  padding: 10px;
  box-sizing: border-box;
}

.box {
  width: 100%;
  height: calc(29vh);
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #151D2C;
  padding: 10px;
  box-sizing: border-box;
}

.center {
  width: 100%;
  height: calc(100vh - 110px);
  background-color: #151D2C;
}

.title {
  font-size: 18px;
  color: #fff;
  font-weight: 700;
}

// ::v-deep .el-table,
// ::v-deep .el-table--border,
// ::v-deep .el-table--group,
// ::v-deep .el-table__header-wrapper {
//   border-color: #151D2C !important;
//   background-color: #151D2C !important;
//   color: white !important;
// }

// ::v-deep .headerStyle {
//     background-color: #151D2C !important;
//   color: white !important;
// }

</style>
