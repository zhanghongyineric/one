<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-button size="small" type="primary" class="addbtn" @click="addVersion">新增版本</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="版本号" prop="version" />
        <el-table-column label="版本描述" prop="version" />
        <el-table-column label="所属系统" prop="version" />
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'VersionManage',
  data() {
    return {
      listLoading: false,
      list: []
    }
  },
  methods: {
    addVersion() {

    }
  }
}
</script>
<style scoped lang="scss">
.addbtn {
    margin-bottom: 20px;
}
</style>
