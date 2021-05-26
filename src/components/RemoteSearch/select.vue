<template>
  <el-select
    v-model="selectValue"
    filterable
    remote
    :placeholder="`请输入关键字查询${label}`"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="handleSelect"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'RemoteSelectSearch', // 远程选择型搜索组件(只能选择搜索结果，不能使用输入的内容)
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
    },
    formatter: { // 如何格式化数据
      type: Function,
      required: false,
      default: data => data
    }
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)// 用于实现v-model
      }
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        this.apiMethod(query).then(res => {
          this.loading = false
          this.options = this.formatter(res.data && res.data.list)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    handleSelect(value) {
      this.$emit('onSelect', this.options.find(item => item.value === value))
    }
  }
}
</script>
