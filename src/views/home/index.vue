<!--
  - FileName: 首页中转页面
  - @author: ZhouJiaXing
  - @date: 2021/4/16 下午5:38
  -->

<template>
  <!--企业主页-->
  <CompanyHome v-if="role === 'unit'" />
  <!--政府主页-->
  <GovHome v-else-if="role === 'gov' || role === 'admin'" />
  <!--管理员主页-->
  <!--<AdminHome v-else-if="role === 'admin'" />-->
</template>`

<script>

import CompanyHome from '@/views/home/unit-dashboard'
import AdminHome from '@/views/home/admin-dashboard'
import GovHome from '@/views/home/gov-dashboard/newIndex'
export default {
  name: 'Home',
  components: {
    AdminHome,
    CompanyHome,
    GovHome
  },
  computed: {
    role() {
      return this.$store.state.user.role
    }
  }
}
</script>

<style scoped>

</style>
