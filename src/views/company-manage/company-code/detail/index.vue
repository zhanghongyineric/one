<template>
  <DetailPage :company-id="companyId" />
</template>

<script>

import DetailPage from '../../components/CompanyDetail'

export default {
  name: 'CompanyDetail',
  components: {
    DetailPage
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['companyId']
}
</script>
