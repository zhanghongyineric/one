<!--
  - FileName: 完结日志
  - @author: ZhouJiaXing
  - @date: 2021/5/10 下午2:06
  -->

<template>
  <div class="layout-content finish-log">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="日志编号:">
                <el-input v-model="listQuery.logId" placeholder="请输入日志编号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleDownload">下载XLS</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="日志编号" prop="logId" />
        <el-table-column label="违章日期" prop="violationTime" />
        <el-table-column label="报备时间" prop="reportTime" />
        <el-table-column label="完结时间" prop="handleTime" />
        <el-table-column v-slot="{row}" label="完结评价" prop="evaluation">
          <span :style="{color: getColor(row.evaluation) }">{{ row.evaluation }}</span>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination
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

import { fetchList } from '@/api/company-report/finish-log'
import Pagination from '@/components/Pagination'
import { downloadLog } from '@/api/company-report/finish-log' // 分页

export default {
  name: 'FinishLog',
  components: { Pagination },

  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        logId: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        logId: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {

      } // 存放选项的数据
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 导出表格数据
    handleDownload() {
      downloadLog()
    },
    // 获取完结评价颜色
    getColor(text) {
      return text.includes('超时') ? 'red' : '#606266'
    },

    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }

  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
