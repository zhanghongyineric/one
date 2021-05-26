<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="60px" size="small">
        <el-row :gutter="48">
          <el-col :md="8" :sm="24">
            <el-form-item label="关键字:">
              <el-input
                v-model="search.keyword"
                placeholder="搜索车牌号/驾驶员"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="small" @click="resetSearch">重置</el-button>
              <el-button type="primary" size="small" @click="getList">查询</el-button>
              <el-button :loading="loading" type="primary" size="small" @click="download">下载excel</el-button>
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
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="unitName" label="企业名称" min-width="220" />
        <el-table-column prop="plateId" label="车牌号" min-width="120" />
        <el-table-column prop="typeName" label="营运类型" min-width="120">
          <!--<template slot-scope="scope">-->
          <!--  {{ transportType[scope.row.safeLevelId] }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column prop="driverName" label="驾驶员" min-width="80" />
        <el-table-column prop="violationType" label="违章类型" min-width="120">
          <template slot-scope="scope">
            {{ violationType[scope.row.violationTypeId] }}
          </template>
        </el-table-column>
        <el-table-column prop="violationTime" label="违章时间" min-width="170" />
        <el-table-column label="操作" min-width="90" align="center">
          <template slot-scope="scope">
            <BreakInfo :index="scope.$index" :list="tableList" />
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
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
import Pagination from '@/components/Pagination' // 分页
import BreakInfo from '@/components/BreakInfo' // 分页
import { download, getSearchList } from '@/api/government-report/government-report.js'
export default {
  name: 'NotReportedCompany',
  components: {
    Pagination,
    BreakInfo
  },
  data() {
    return {
      tableList: [],
      search: {
        keyword: '',
        unitId: 0,
        violationTime: ''
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      dialogVisible: false,
      breakInfo: {},
      currIndex: 0,
      violationType: [],
      transportType: [],
      loading: false
    }
  },
  created() {
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.violationType = onlineOption.violation_type.map
    this.transportType = onlineOption.transport_type.map
    this.search.unitId = Number(this.$route.query.unitId)
    this.search.violationTime = this.$route.query.noReportTime
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSearchList({ ...this.search, ...this.listQuery }, 'selectUnitViolationList')
        .then(res => {
          this.tableList = res.data.list
          this.total = res.data.total
          this.listLoading = false
        }).catch(err => {
          this.listLoading = false
          throw err
        })
    },
    resetSearch() {
      this.search.keyword = ''
      this.getList()
    },
    download() {
      this.loading = true
      download({ flag: this.$route.query.search.flag }, 'noReportXlsDownload')
        .then(_ => {
          this.loading = false
        }).catch(_ => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>

