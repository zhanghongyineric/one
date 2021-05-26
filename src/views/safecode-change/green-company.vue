<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="80px" size="small">
        <el-row :gutter="48">
          <el-col :md="8" :sm="24">
            <el-form-item label="关键字:">
              <el-input
                v-model="search.keyword"
                placeholder="请输入企业名称或手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="small" @click="resetSearch">重置</el-button>
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!--表格-->
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableList"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="index"
          label="编号"
          width="50"
        />
        <el-table-column
          prop="companyName"
          label="企业名称"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="area"
          label="行政区域"
          min-width="170"
          show-overflow-tooltip
        />
        <el-table-column
          prop="companyType"
          label="企业类别"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="companyFzr"
          label="企业负责人"
          min-width="120"
        />
        <el-table-column
          prop="tel"
          label="负责人电话"
          min-width="120"
        />
        <el-table-column v-slot="{row}" label="上周安全码" prop="lastWeek" width="100" :row-style="{height: '53px'}">
          <template>
            <svg-icon
              class="safe-code"
              icon-class="code"
              :style="{color: row.lastWeek}"
            />
          </template>
        </el-table-column>
        <el-table-column v-slot="{row}" label="本周安全码" prop="currentWeek" width="100">
          <template>
            <svg-icon
              class="safe-code"
              icon-class="code"
              :style="{color: row.currentWeek}"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GreenCompany',
  // eslint-disable-next-line vue/require-prop-types
  props: ['codeId'],
  data() {
    return {
      search: {
        keyword: ''
      },
      listLoading: false,
      tableList: [{
        companyName: '四川明亚智行',
        area: '四川成都',
        companyType: '客运',
        companyFzr: '张三',
        tel: '13533333333',
        lastWeek: 'green',
        currentWeek: 'red'
      }]
    }
  },
  methods: {
    resetSearch() {},
    getList() {}
  }
}
</script>

<style lang="scss" scoped>
::v-deep table .safe-code {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
}

::v-deep .el-table__row {
    height: 53px;
}
</style>
