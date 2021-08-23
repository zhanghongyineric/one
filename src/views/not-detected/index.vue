<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="60px" size="small">
        <el-row :gutter="48">
          <el-col :md="7" :sm="22" :xs="22" style="padding-right: 0">
            <el-form-item label="时间:">
              <el-select v-model="search.flag" placeholder="请选择超时天数">
                <el-option
                  v-for="item in daysList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="1" :sm="2" :xs="2" style="padding-left: 0">
            <el-popover
              placement="top"
              title="时间筛选说明"
              width="400"
              trigger="hover"
              content="从今日开始，筛选离今日最近几天的未报备企业记录。例如今日日期为10号，近2天则筛选在9号，8号时未报备的企业。近3天为7号时未报备的企业，3~5天为6号，5号未报备的企业，5天以上则为4号及以前的未报备企业。"
            >
              <span slot="reference" class="el-icon-info" style="line-height: 32px; padding: 0 5px" />
            </el-popover>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="关键字:">
              <el-input
                v-model="search.keyword"
                placeholder="搜索企业/日志编号"
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
        <el-table-column prop="logId" label="日志编号" min-width="170" />
        <el-table-column prop="reportTime" label="报备时间" min-width="170" />
        <el-table-column prop="violationTime" label="违章日期" min-width="170" />
        <el-table-column prop="size" label="未检测违章条数" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.size }}条</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template slot-scope="scope">
            <router-link
              exact
              :to="{query: {...scope.row, ...{search: search}},
                    path: '/not-detected/:' + scope.row.logId}"
            >详情</router-link>
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
import { download, getSearchList } from '@/api/government-report/government-report.js'
export default {
  name: 'NotDetected',
  components: {
    Pagination
  },
  data() {
    return {
      tableList: [],
      search: {
        keyword: '',
        flag: ''
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      daysList: [],
      loading: false
    }
  },
  created() {
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.daysList = onlineOption.recent_days.list
    this.search.flag = this.daysList[0].value
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSearchList({ ...this.search, ...this.listQuery }, 'notDetectedForDays')
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
      this.search = {
        keyword: '',
        flag: this.daysList[0].value
      }
      this.getList()
    },
    download() {
      this.loading = true
      download({ flag: this.search.flag }, 'notDetectedXlsDownload')
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
a {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
  padding: 5px 15px;
  border-radius: 3px;
  white-space: nowrap;
  display: inline-block;
  font-size: 12px;
}
</style>
