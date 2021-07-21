<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-form
          v-model="listQuery"
          label-width="100px"
        >
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="违章名称:">
                <el-input v-model="listQuery.name" placeholder="请输入违章名称" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-button type="primary" size="small" style="margin-bottom: 10px">新增规则</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="violationNo" label="规则编号" width="100" />
        <el-table-column prop="violationName" label="规则名称" min-width="150px" />
        <el-table-column prop="script" label="规则描述" min-width="200px" />
        <el-table-column prop="degreeScript" label="违章程度描述" min-width="200px" />
        <el-table-column label="操作" align="center" width="120px">
          <template v-slot="{row}">
            <el-button type="danger" size="mini" @click="delData(row)">删除</el-button>
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
import {
  selectList,
  save,
  deleteData
} from '@/api/business-manage/rules-manage'
import Pagination from '@/components/Pagination'

export default {
  name: 'RulesManage',
  components: { Pagination },
  data() {
    return {
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      symbols: []
    }
  },
  created() {
    this.getList()
    this.symbols = JSON.parse(localStorage.getItem('onlineOption'))['计算符号'].list
  },
  methods: {
    getList() {
      this.listLoading = true
      selectList({ ...this.listQuery })
        .then(res => {
          const { data: { list, total }} = res
          this.list = list
          this.total = total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    delData(row) {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          this.listLoading = true
          deleteData({ id: parseInt(row.id) })
            .then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getList()
            })
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
