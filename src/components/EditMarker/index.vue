<template>
  <div class="change-marker" @dblclick="flag = false">
    <span v-if="flag" class="text">{{ input }}</span>
    <el-input
      v-else
      v-model="input"
      type="text"
      maxlength="8"
      :focus="true"
      @blur="inputBlur"
    />
    <el-popconfirm
      title="确定删除该标签吗？"
      @confirm="deleteMarker"
    >
      <span slot="reference" class="el-icon-close" />
    </el-popconfirm>

  </div>
</template>

<script>
export default {
  name: 'EditMarker',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      flag: true,
      input: ''
    }
  },
  watch: {
    value(val) {
      this.input = val
    }
  },
  created() {
    this.input = this.value
  },
  methods: {
    changeValue(val) {
      this.$emit('update:value', val)
    },
    deleteMarker() {
      this.$emit('delete', true)
    },
    inputBlur() {
      if (!this.input.length) {
        this.$confirm('确定删除该标签吗？')
          .then(_ => {
            this.deleteMarker()
          })
          .catch(_ => {
            this.input = this.value
            this.flag = true
          })
      } else {
        this.changeValue(this.input)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.change-marker {
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  padding: 0 0 0 10px;
  margin: 10px;
  .text {
    flex: 1;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
  }
  .el-input {
    flex: 1;
    ::v-deep .el-input__inner {
      border-width: 0;
      height: 30px;
      line-height: 30px;
      padding: 0;
    }
  }
  .el-icon-close {
    cursor: pointer;
    padding: 0 5px;
    line-height: 30px;
  }
}
</style>
