<template>
  <div class="layout-content">
    <el-card>
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        size="small"
        @click="goBack"
      >返回登录</el-button>
      <div class="list ql-editor" />
    </el-card>
  </div>
</template>
<script>
import { historicVersion } from '@/api/system-manage/version-manage'

export default {
  name: 'HistoryVersion',
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
      historicVersion({ port: this.sysCode })
        .then(res => {
          const { data } = res
          const eleList = document.getElementsByClassName('list')[0]
          const eleItem = document.createElement('div')
          eleItem.className = 'list-item'
          eleItem.innerHTML = data[0].content + data[0].historyContent
          eleList.appendChild(eleItem)
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
