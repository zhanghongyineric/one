<template>
  <div class="layout-content">
    <el-card>
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        @click="goBack"
      >返回登录</el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="版本号" prop="number" width="130px" />
        <el-table-column label="版本描述" prop="content" show-overflow-tooltip />
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
import { historicVersion } from '@/api/system-manage/version-manage'
import Pagination from '@/components/Pagination'

export default {
  name: 'HistoryVersion',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        port: ''
      }
    }
  },
  computed: {
    sysCode() {
      return this.$route.query.code
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.port = this.sysCode
      historicVersion({ ...this.listQuery })
        .then(res => {
          const { data: { list, total }} = res
          this.list = list
          this.total = total
          this.listLoading = false
        })
        .catch(err => {
          throw err
        })
    },
    goBack() {
      this.$router.push('/login')
    }
  }
}
</script>
