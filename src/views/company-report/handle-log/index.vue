<!--
  - FileName: 处理日志
  - @author: ZhouJiaXing
  - @date: 2021/5/10 下午2:06
  -->
<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="日志编号:" label-width="80px">
                <el-input v-model="listQuery.logId" placeholder="请输入日志编号" clearable @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item
                label="剩余处理时间:"
                class="rest-time"
                label-width="108px"
              >
                <el-popover
                  placement="top-start"
                  title="时间筛选说明"
                  width="200"
                  trigger="hover"
                  content="报备日志后，企业有3天的规定处理时间（包括报备当日）。超时时间则为超过规定处理时间的时长。例如，企业在1号报备，规定处理时间到3号，在4号时未处理完结，则超时1天。"
                >
                  <el-icon slot="reference" class="el-icon-question" />
                </el-popover>
                <el-select
                  v-model="listQuery.flag"
                  placeholder="请选择剩余处理时间"
                >
                  <el-option
                    v-for="{label,value} in optionGroup.restTimeList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>

            </el-col>

            <!--查询操作按钮-->
            <el-col :md="8" :sm="24">
              <div
                class="table-page-search-submitButtons"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
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
        <el-table-column label="报备时间" prop="reportTime" />
        <el-table-column v-slot="{row}" label="剩余处理时间" prop="restTime">
          <span :style="{color: getColor(row.restTime) }">{{ row.restTime }}</span>
        </el-table-column>
        <el-table-column label="未处理违章数" prop="size" />
        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="showDetail(row.reportTime)">
              详情
            </el-button>
          </template>
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

// import { fetchList, createAccount, updateAccount } from '@/api/demo-page.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination'
import { downloadLog, fetchLog } from '@/api/company-report/handle-log' // 分页

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'HandleLog',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        logId: '',
        flag: '5'
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        logId: '',
        flag: '5'
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      optionGroup: {
        restTimeList: onlineOption.rest_time.list
      } // 存放选项的数据
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 获取处理时间颜色
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
      fetchLog(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 查看日志详情
    showDetail(reportTime) {
      this.$router.push({
        name: 'HandleLogDetail',
        query: {
          reportTime,
          flag: this.listQuery.flag
        }
      })
    },
    // 导出表格数据
    handleDownload() {
      downloadLog({
        flag: this.listQuery.flag
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.rest-time {
  .el-icon-question {
    position: absolute;
    left: -116px;
    top: 9px;
    cursor: pointer;
  }
}
</style>
