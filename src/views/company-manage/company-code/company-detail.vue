<!--
  - FileName: company-detail.vue
  - @author: ZhouJiaXing
  - @date: 2021/4/19 下午3:57
  -->

<template>
  <DetailPage :company-id="companyId" />
</template>

<script>

import DetailPage from '../components/CompanyDetail'

export default {
  name: 'CompanyDetail',
  components: {
    DetailPage
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['companyId']
}
</script>
