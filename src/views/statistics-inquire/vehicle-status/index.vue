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
  </div>
</template>

<script>
export default {
  name: 'VehicleStatus',
  data() {
    return {}
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

::v-deep .el-form-item__label {
  color: #fff;
}
</style>
