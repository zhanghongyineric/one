<template>
  <div class="layout-content">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px">
          <el-row :gutter="48">
            <el-col :md="6" :sm="24">
              <el-form-item label="地区：">
                <el-cascader
                  v-model="listQuery.regionId"
                  style="width:100%;"
                  placeholder="请选择地区"
                  size="small"
                  :options="areaOptions"
                  :props="areaProps"
                />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="车牌号:">
                <el-input v-model="listQuery.plateNum" placeholder="请输入车牌号" size="small" clearable />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="所属企业:">
                <el-autocomplete
                  v-model="listQuery.unitName"
                  :fetch-suggestions="searchType"
                  placeholder="请输入企业名称关键字"
                  :debounce="500"
                  size="small"
                  clearable
                  style="width:100%;"
                  @select="selectSearchCompany"
                />
              </el-form-item>
            </el-col>
            <template v-if="advanced">
              <el-col :md="6" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select v-model="listQuery.vehicleType" size="small" placeholder="请选择车辆类型">
                  <!-- <el-option
                      v-for="item in driverVelTyeOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    /> -->
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :md="6" :sm="24">
                <el-form-item label="时间范围:">
                  <el-date-picker
                    v-model="listQuery.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </template>
            <el-col :md="!advanced && 6 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableData"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" align="center" />
        <el-table-column prop="plateNum" label="车牌号" width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="unitName" label="所属企业" min-width="300" align="center" />
        <el-table-column prop="alarmType" label="报警类型" min-width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.alarmType | alarmTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="220" align="center" show-overflow-tooltip />
        <el-table-column prop="vehicleType" label="车辆类型" min-width="110" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleType | vehicleTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import axios from 'axios'
import {
  areaCode,
  activeDefenseAlarm,
  enterpriseName
} from '@/api/live-monitor/alarm-detail'

let that

export default {
  name: 'AlarmDetail',
  components: { Pagination },
  filters: {
    alarmTypeFilter(type) {
      let text = type
      that.alarmTypeOptions.forEach(item => {
        item.value === type ? text = item.label : ''
      })
      return text
    },
    vehicleTypeFilter(type) {
      let text = type
      that.vehicleTypeOptions.forEach(v => {
        v.value === type ? text = v.label : ''
      })
      return text
    }
  },
  data() {
    return {
      advanced: false,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        startTime: '2021-9-25 00:00:00',
        endTime: '2021-9-26 00:00:00',
        regionId: '800'
      },
      tableData: [],
      listLoading: false,
      areaOptions: [],
      areaProps: {
        label: 'unitName',
        children: 'children',
        value: 'unitId',
        expandTrigger: 'hover',
        checkStrictly: false
      },
      vehicleTypeOptions: [],
      alarmTypeOptions: []
    }
  },
  created() {
    that = this
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.vehicleTypeOptions = onlineOption['vehicle_type_code'].list
    this.alarmTypeOptions = onlineOption['报警类型编码'].list
    console.log(this.vehicleTypeOptions)
  },
  mounted() {
    this.getAreaCode()
    this.getList()
  },
  methods: {
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
    searchType(queryString, cb) {
      if (queryString) {
        enterpriseName({ unitName: queryString })
          .then(({ data }) => {
            data.forEach(item => {
              item.label = item.unitName
              item.value = item.unitName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectSearchCompany(v) {
      this.listQuery.unitId = v.unitId
      this.listQuery.unitName = v.unitName
    },
    resetQuery() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1
      }
    },
    showDetails(row) {
      axios.get('http://121.36.18.123/StandardApiAction_alarmEvidence.action', {
        jsession: '649b7687-6792-41a2-b9be-7806f2a0d3fa',
        toMap: 2,
        guid: row.guid,
        devIdno: row.devIdno,
        alarmType: row.alarmType,
        begintime: row.startTime
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          throw err
        })
    },
    search() {},
    getList() {
      this.listLoading = true
      activeDefenseAlarm({ ...this.listQuery })
        .then(({ data }) => {
          console.log(data)
          this.total = data.total
          this.tableData = data.list
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    }
  }
}
</script>
