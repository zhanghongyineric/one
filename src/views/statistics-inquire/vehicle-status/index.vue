<template>
  <div class="container">
    <div class="table-page-search-wrapper search-box">
      <el-form label-width="100px">
        <el-row :gutter="48">
          <el-col :md="6" :sm="24">
            <el-form-item label="地区：">
              <el-cascader placeholder="请选择地区" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="统计周期：">
              <span class="time-text">上月</span>
              <span class="time-text active">本月</span>
              <span class="time-text">本季度</span>
              <span class="time-text">本年度</span>
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
          <el-col :md="4" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="mini" type="primary" icon="el-icon-search" style="margin-top:5px;" />
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <div class="left-box" style="background-color: #0E1A2A;">
        <line-mix-bar />
      </div>
      <div class="right-box">
        <pie-chart style="display:inline-block;" />
        <funnel-chart style="display:inline-block;" />
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
        <line-chart />
      </div>
    </div>
  </div>
</template>

<script>
import lineMixBar from '@/components/Charts/lineMixBar.vue'
import Pagination from '@/components/Pagination'
import FunnelChart from '@/components/Charts/FunnelChart.vue'
import LineChart from '@/components/Charts/static/LineChart.vue'
import PieChart from '@/components/Charts/static/PieChart.vue'

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
      total: 10,
      xData: [],
      yData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {},
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) return 'background-color: #212F40;color: #fff;font-weight: 500;'
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
}
</style>
