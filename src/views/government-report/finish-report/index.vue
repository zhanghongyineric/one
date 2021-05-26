<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="60px" size="small">
        <el-row :gutter="48">
          <el-col :md="4" :sm="24">
            <el-form-item label-width="0">
              <el-select v-model="search.weekFlag" placeholder="时间">
                <el-option
                  v-for="item in weekFlagList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="22" :xs="22" style="padding-right: 10px">
            <el-form-item label-width="0">
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
              content="企业报备后，有3天的规定处理时间。超时时间则为超过规定处理时间的时长。例如，企业在1号报备，规定处理时间到3号，在4号时未处理完结，则其超时1天。"
            >
              <span slot="reference" class="el-icon-info" style="line-height: 32px; padding: 0 5px" />
            </el-popover>
          </el-col>
          <el-col :md="7" :sm="24">
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
        <el-table-column prop="handleTime" label="完结时间" min-width="170" />
        <el-table-column label="完结评价" min-width="140">
          <template slot-scope="scope">
            <span
              :class="{red: scope.row.evaluation !== '按时完成'}"
            >{{ scope.row.evaluation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <router-link
              exact
              :to="{query: {...scope.row, ...{search: search}},
                    path: '/government-report/finish-report/:' + scope.row.logId}"
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
import { download, getMarkersList, getSearchList } from '@/api/government-report/government-report.js'
export default {
  name: 'FinishReport',
  components: {
    Pagination
  },
  data() {
    return {
      tableList: [],
      search: {
        keyword: '',
        flag: '1',
        weekFlag: '1'
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      total: 0,
      daysList: [{
        label: '按时完结',
        value: '1'
      }, {
        label: '超时2~3天',
        value: '2'
      }, {
        label: '超时3~5天',
        value: '3'
      }, {
        label: '超时5天以上',
        value: '4'
      }],
      weekFlagList: [{
        label: '本周',
        value: '1'
      }, {
        label: '上周',
        value: '2'
      }],
      loading: false
    }
  },
  created() {
    this.getList()
    getMarkersList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSearchList({ ...this.search, ...this.listQuery }, 'selectEndList')
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
        flag: '1',
        weekFlag: '1'
      }
      this.getList()
    },
    download() {
      this.loading = true
      download(this.search, 'endReportXlsDownload')
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
  padding: 2px 15px;
  border-radius: 3px;
  white-space: nowrap;
  display: inline-block;
  font-size: 12px;
}
.red {
  color: #ff2525;
}
</style>

