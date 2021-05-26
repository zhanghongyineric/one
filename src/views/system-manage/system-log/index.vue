<!--
  - FileName: 系统日志
  - @author: ZhouJiaXing
  - @date: 2021/5/11 下午4:56
  -->

<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="日志类型:">
                <el-select
                  v-model="listQuery.type"
                  placeholder="请选择日志类型"
                  @change="()=>$nextTick(() => handleSearch())"
                >
                  <el-option
                    v-for="{label,value} in optionGroup.logType"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="操作日期:">
                <DateRange v-model="listQuery.queryTime" />
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="操作用户:">
                  <el-input v-model="listQuery.username" placeholder="请输入操作用户" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="操作企业:">
                  <el-input v-model="listQuery.unitName" placeholder="请输入操作企业" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
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
        <!--<el-table-column v-slot="{row}" label="日志类型" prop="type">-->
        <!--  {{ row.type | typeFilter }}-->
        <!--</el-table-column>-->
        <el-table-column label="操作用户" prop="username" />
        <el-table-column label="操作人ID" prop="createBy" />
        <el-table-column label="操作说明" prop="title" />
        <el-table-column label="操作时间" prop="createTime" min-width="110px" />
        <el-table-column label="IP" prop="remoteAddr" />
        <el-table-column label="浏览器" prop="userAgent" min-width="100px" show-overflow-tooltip />
        <el-table-column label="请求地址" prop="requestUri" min-width="100px" show-overflow-tooltip />
        <el-table-column label="请求方法" prop="method" />
        <el-table-column label="请求参数" prop="params" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作时间" prop="time" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作异常" prop="exception" />
        <el-table-column label="操作企业" prop="unitName" min-width="100px" show-overflow-tooltip />

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
import Pagination from '@/components/Pagination' // 分页
import DateRange from '@/components/DateRange'
import { fetchAllLog } from '@/api/user/user' // 分页
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'SystemLog',
  components: { Pagination, DateRange },
  filters: {
    typeFilter: function(type) {
      return type
    }
  },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        type: '0',
        queryTime: [],
        unitName: '',
        username: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        type: '0',
        queryTime: [],
        unitName: '',
        username: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        logType: onlineOption.log_type.list
      } // 存放选项的数据
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchAllLog(this.listQuery).then(response => {
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
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
