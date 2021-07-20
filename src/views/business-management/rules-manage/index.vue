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
        <el-table-column prop="name" label="规则名称" min-width="150px" />
        <el-table-column prop="desc" label="规则描述" min-width="200px" />
        <el-table-column prop="level" label="等级描述" min-width="200px" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RulesManage',
  data() {
    return {
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  }
}
</script>
