<template>
  <el-cascader
    v-model="selectedOptions"
    :size="size"
    :options="options"
    filterable
    clearable
    placeholder="请选择或者直接输入关键字"
    style="width: 100%;"
    :disabled="disabled || isDisabled"
    @change="handleChange"
  />
</template>

<script>
import { regionDataPlus, CodeToText } from 'element-china-area-data'
import { mapGetters } from 'vuex'
export default {
  props: {
    value: { // 存放区域代码
      type: Array,
      default: () => []
    },
    limitArea: { // 是否根据账号角色区域决定数据显示到那一层级
      type: Boolean,
      default: false
    },
    areaText: { // 区域地址文本
      type: String,
      default: ''
    },
    fullAreaText: { // 完整区域地址文本
      type: String,
      default: ''
    },
    fullAreaCode: { // 完整区域地址代码
      type: String,
      default: ''
    },
    size: { // 尺寸
      type: String,
      default: 'small'
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: regionDataPlus,
      isDisabled: false
    }
  },
  computed: {
    selectedOptions: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    ...mapGetters(['role', 'province', 'city', 'region'])
  },
  created() {
    // 限制可选择区域
    if (this.limitArea) {
      // 管理员账号不限制
      if (this.role !== 'admin') {
        this.options = this.getOptions(this.province, this.city, this.region)
        // 如果是区级账号，默认选中不可编辑
        if (this.region) {
          this.selectedOptions = [this.region]
          this.isDisabled = true
        } else {
          this.handleChange(['']) // 触发一次change,设置默认areaText
        }
      }
    }
  },
  methods: {
    // 根据账号行政区域判断显示哪些行政区域
    getOptions(province, city, part) {
      let cityData = []
      let partData = []
      let exactPartData = []

      try {
        if (province === '') {
          return this.options
        } else {
          cityData = this.options.find(item => item.value === province).children

          if (city === '') {
            return cityData
          } else {
            partData = cityData.find(item => item.value === city).children

            if (part === '') {
              return partData
            } else {
              exactPartData = partData.find(item => item.value === part)
              return [exactPartData]
            }
          }
        }
      } catch (error) {
        console.error('AreaSelect:解析地址时出错', error)
        return []
      }
    },
    // 把区域代码数组转换为文本
    codeArrayToText(codeArray) {
      let areaText = ''
      if (codeArray[0] === '') {
        // 如果进行了区域限制，把角色所在的地区设置进去
        if (this.limitArea) {
          if (this.city) {
            areaText = CodeToText[this.city]
          } else if (this.province) {
            areaText = CodeToText[this.province]
          } else {
            areaText = '中国'
          }
        } else {
          areaText = '中国'
        }
      } else {
        areaText = codeArray.map(item => {
          const text = CodeToText[item]
          return text === '市辖区' || text === '全部' ? '' : text
        }).join('')
      }
      return areaText
    },
    // 选中区域
    handleChange(codes) {
      const codeArray = [...codes]
      let fullCodeArray = [...codes]

      // 如果限制了区域则需要进行补全
      if (this.limitArea) {
        if (this.region) {
          fullCodeArray = []// 先清空可能存在的选择
          fullCodeArray.unshift(this.region)
        }
        if (this.city) {
          fullCodeArray.unshift(this.city)
        }
        if (this.province) {
          fullCodeArray.unshift(this.province)
        }
      }
      const areaText = this.codeArrayToText(codeArray)
      const fullAreaText = this.codeArrayToText(fullCodeArray)
      this.$emit('update:areaText', areaText)
      this.$emit('update:fullAreaText', fullAreaText)
      this.$emit('change', { codeArray, fullCodeArray, areaText, fullAreaText })
    }
  }
}
</script>
