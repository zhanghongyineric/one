<!--
  - FileName: 日期范围选择
  - @author: ZhouJiaXing
  - @date: 2021/5/11 下午5:05
  -->

<template>
  <el-date-picker
    v-model="dateRange"
    type="daterange"
    align="right"
    unlink-panels
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    :picker-options="pickerOptions"
  />
</template>

<script>
export default {
  name: 'DateRange',
  props: {
    // 是否需要快捷选项
    needPicker: {
      type: Boolean,
      default: true
    },
    // 日期区间
    value: {
      type: Array,
      default: () => []
    },
    // 开始日期
    beginDate: {
      type: Date,
      default: () => new Date()
    },
    // 结束日期
    endRange: {
      type: Date,
      default: () => new Date()
    },
    // 自定义快捷选项
    customShortcuts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const defaultOptions = [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]

    const pickerOptions = this.customShortcuts.length ? this.customShortcuts : defaultOptions

    return {
      pickerOptions: this.needPicker
        ? pickerOptions : ''
    }
  },
  computed: {
    dateRange: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('update:beginDate', val[0])
        this.$emit('update:endDate', val[1])
      }
    }
  }
}
</script>

<style scoped>

</style>
