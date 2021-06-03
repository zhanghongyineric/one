<template>
  <el-autocomplete
    v-model="inputQuery"
    :fetch-suggestions="getList"
    :placeholder="`请输入关键字查询${label}`"
    style="width: 100%"
    :debounce="500"
    :disabled="disabled"
    @select="handleSelect"
  />
</template>

<script>

export default {
  name: 'RemoteSearch', // 远程搜索组件
  props: {
    searchWhenNull: { // 查询字段为空时要不要查询
      type: Boolean,
      default: false
    },
    value: { // 用于实现v-model
      type: String,
      default: ''
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    label: { // 标签名
      type: String,
      default: ''
    },
    apiMethod: { // 查询数据函数
      type: Function,
      required: true
    }
  },
  computed: {
    inputQuery: {
      get() {
        return this.value
      },
      set(val) {
        console.log('input')
        this.$emit('input', val)// 用于实现v-model
      }
    }
  },
  methods: {
    handleSelect(item) {
      this.$nextTick(() => {
        this.$emit('onSelect', item)
      })
    },
    getList(queryString, cb) {
      // 查询字段为空时要不要查询
      if (!this.searchWhenNull && !queryString) {
        cb([])
        return
      }
      this.apiMethod(queryString).then((res) => {
        cb(res.data && res.data.list)
      }).catch(e => {
        console.log(e)
        cb([])
      })
    }
  }
}
</script>
