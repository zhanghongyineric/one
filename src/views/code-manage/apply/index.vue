<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="80px" size="small">
        <el-row :gutter="48">
          <!-- <el-col :md="8" :sm="24">
            <el-form-item label="申请状态:">
              <el-select v-model="search.status" placeholder="请选择申请状态">
                <el-option v-for="item in applyStatus" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :md="8" :sm="24">
            <el-form-item label="关键字:">
              <el-input
                v-model="search.keyword"
                placeholder="请输入身份证或手机号"
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
          prop="driverName"
          label="姓名"
          min-width="100"
        />
        <el-table-column
          prop="idCard"
          label="身份证号码"
          min-width="170"
        />
        <el-table-column
          prop="driverTel"
          label="电话"
          min-width="120"
        />
        <el-table-column
          prop="palte_info"
          label="车牌号"
          min-width="120"
        />
        <el-table-column
          prop="typeDesc"
          label="车辆类型"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="category"
          label="资格类别"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="categoryNo"
          label="资格证号"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="endTime"
          label="有效期"
          min-width="160"
        />
        <el-table-column
          prop="unitName"
          label="上岗企业"
          min-width="280"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="申请时间"
          min-width="160"
        />
        <!-- <el-table-column
          label="申请状态"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="apply-suc">成功</span>
            <span v-if="scope.row.status === 1">失败</span>
          </template>
        </el-table-column> -->
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
import request from '@/utils/request'
import { applyStatus } from '@/options'

export default {
  name: 'Apply',
  components: {
    Pagination
  },
  data() {
    return {
      search: {
        status: '',
        keyword: ''
      },
      tableList: [],
      total: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      checkArr: [],
      listLoading: true,
      applyStatus: applyStatus.list
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      request({
        url: '/driver/safeCodeSelect',
        method: 'post',
        data: { ...this.listQuery, ...this.search }
      }).then(res => {
        this.tableList = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    resetSearch() {
      this.search = {
        status: '',
        keyword: ''
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.work-card {
  .search {
    .el-button {
      margin-left: 20px;
    }
  }
  .main-table {
    .driver {
      padding: 0 5px;
    }
    .apply-suc {
      color: #0ABB05;
    }
  }
}
</style>
