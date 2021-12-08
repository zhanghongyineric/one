<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-row :gutter="12">
          <el-form :model="listQuery" label-width="80px">
            <el-col :md="4" :sm="24">
              <el-form-item label="地区:">
                <el-cascader
                  v-model="listQuery.zoneId"
                  size="small"
                  :options="searchCityOptions"
                  placeholder="请选择地区"
                  style="width:100%;"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="查询时间:">
                <el-time-picker
                  v-model="listQuery.time"
                  is-range
                  arrow-control
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="请选择时间范围"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="车牌号:">
                <el-input
                  v-model="listQuery.plateNum"
                  size="small"
                  placeholder="请输入车牌号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <template v-if="advanced">
              <el-col :md="5" :sm="12">
                <el-form-item label="企业:">
                  <el-input placeholder="请输入企业名称" :v-model="listQuery.unitId" size="small" style="margin-top:4px;">
                    <el-button slot="append" icon="el-icon-plus" @click="companyVisible = true" />
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="驾驶员:">
                  <el-input
                    v-model="listQuery.plateNum"
                    size="small"
                    placeholder="请输入驾驶员姓名"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :md="4" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select
                    v-model="listQuery.vehicleType"
                    size="small"
                    placeholder="请选择车辆类型"
                    multiple
                  >
                    <el-option value="1" label="货车" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警时长:">
                  <el-input v-model="listQuery.alarmDuration" placeholder="请输入报警时长（秒）" size="small" />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警类型:">
                  <el-select
                    v-model="listQuery.alarmType"
                    size="small"
                    placeholder="请选择报警类型"
                    multiple
                  >
                    <el-option value="1" label="疲劳驾驶" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警分级:">
                  <el-select
                    v-model="listQuery.alarmLevel"
                    size="small"
                    placeholder="请选择报警分级"
                    multiple
                  >
                    <el-option value="1" label="1级" />
                    <el-option value="2" label="2级" />
                    <el-option value="3" label="3级" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="处理状态:">
                  <el-select
                    v-model="listQuery.status"
                    size="small"
                    placeholder="请选择处理状态"
                    multiple
                  >
                    <el-option value="1" label="已处理" />
                    <el-option value="2" label="未处理" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="4" :sm="24">
                <el-form-item label="报警来源:">
                  <el-select
                    v-model="listQuery.from"
                    size="small"
                    placeholder="请选择报警来源"
                    multiple
                  >
                    <el-option value="1" label="Gps" />
                    <el-option value="2" label="ads" />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :md="!advanced && 5 || 16" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
            <el-col :md="4" :sm="24" style="margin-top:3px;">
              <el-button type="primary" size="small" @click="resetQuery">表格导出</el-button>
              <el-button type="primary" size="small" @click="handleSearch">批量处理</el-button>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="selection"
          width="60"
          fixed="left"
        />
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column label="操作" align="center" fixed="left" width="120px">
          <i class="el-icon-edit-outline icon" @click="handleVisible = true" />
          <i class="el-icon-data-line icon icon-spacing" @click="trajectoryVisible = true" />
        </el-table-column>
        <el-table-column label="车牌号" prop="plateNum" min-width="100px" align="center" />
        <el-table-column label="车牌颜色" prop="plateColor" />
        <el-table-column label="车牌类型" prop="vehicleType" />
        <el-table-column label="驾驶员" prop="driver" />
        <el-table-column label="所属企业" prop="unitName" />
        <el-table-column label="报警类型" prop="alarmType" />
        <el-table-column label="程度/分级" prop="alarmType" />
        <el-table-column label="报警来源" prop="alarmSource" />
        <el-table-column label="开始时间" prop="alarmSource" />
        <el-table-column label="结束时间" prop="alarmSource" />
        <el-table-column label="报警时长" prop="alarmSource" />
        <el-table-column label="开始速度" prop="alarmSource" />
        <el-table-column label="结束速度" prop="alarmSource" />
        <el-table-column label="开始位置" prop="alarmSource" />
        <el-table-column label="结束位置" prop="alarmSource" />
        <el-table-column label="报警信息" prop="alarmSource" />
        <el-table-column label="处理状态" prop="alarmSource" />
        <el-table-column label="处理方式" prop="alarmSource" />
        <el-table-column label="处理时间" prop="alarmSource" />
        <el-table-column label="备注内容" prop="alarmSource" />
        <el-table-column label="处理人" prop="alarmSource" />
      </el-table>
      <CompanySelect :visible="companyVisible" @close="updateVisible" />
      <HandleAlarm :visible="handleVisible" @close="updateVisible" />
      <HistoricalTrajectory :visible="trajectoryVisible" @close="updateVisible" />
    </el-card>
  </div>
</template>

<script>
import CompanySelect from '../component/company-select.vue'
import HandleAlarm from '../component/handle-alarm.vue'
import HistoricalTrajectory from '../component/historical-trajectory.vue'

export default {
  name: 'GPSAlarm',
  components: { CompanySelect, HandleAlarm, HistoricalTrajectory },
  data() {
    return {
      // 搜索条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        zoneId: ''
      },
      listLoading: false,
      searchCityOptions: [], // 搜索条件地区选项
      disabled: false, // 禁用搜索地区
      advanced: false, // 是否展开搜索框
      tableData: [
        {
          plateNum: '川A12345'
        }
      ],
      companyVisible: false, // 企业选择框
      handleVisible: false, // 报警处理框
      trajectoryVisible: false // 历史轨迹弹框
    }
  },
  methods: {
    // 重置搜索条件
    resetQuery() {},
    // 点击搜索按钮
    handleSearch() {},
    // 监听弹框是否显示
    updateVisible(val) {
      this.companyVisible = val
      this.handleVisible = val
      this.trajectoryVisible = val
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  font-size:20px;
  color:#409EFF;
  cursor: pointer;
}

.icon-spacing {
  margin-left: 10px;
}
</style>
