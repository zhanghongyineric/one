<!--选择平台-->
<template>
  <el-select
    v-model="platform"
    placeholder="请选择平台"
    filterable
    class="select-platform"
  >
    <el-option
      v-for="item in deptList"
      :key="item.deptId"
      :label="item.deptName"
      :value="item.deptId"
    />
  </el-select>
</template>

<script>
import { netGetDept } from '@/api/public/admin'

export default {
  name: 'ChoosePlatform',
  props: {
    // 平台id
    value: {
      type: Number,
      default: null
    },
    // 是否默认选中第一个
    defaultFirstOption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deptList: []
      // key: value
    }
  },
  computed: {
    platform: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change')
      }
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    // 获取平台列表
    getDeptList() {
      netGetDept().then(res => {
        this.deptList = res.data
        if (this.defaultFirstOption) {
          const platForm = this.deptList.length ? res.data[0].deptId : null

          this.$emit('initFinished', platForm)
        }
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
