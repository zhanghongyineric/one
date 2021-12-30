<template>
  <el-dialog
    title="选择企业"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="100px"
    custom-class="base-dialog dialog-col-1 company-select"
    :before-close="closeDialog"
  >
    <span class="text">查找:</span>
    <el-autocomplete
      ref="autocomplete"
      v-model="unitName"
      class="input"
      :fetch-suggestions="searchType"
      placeholder="请输入企业关键字"
      :debounce="500"
      clearable
      size="small"
      style="width:300px;"
      @select="selectUnit"
      @clear="setBlur"
    />
    <el-button type="primary" size="small" @click="search">查询</el-button>
    <div class="tree-container">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="unitName"
        highlight-current
        :default-expanded-keys="searchKeys"
        :props="defaultProps"
      />
    </div>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  enterpriseTree,
  findUnitName
} from '@/api/alarm-management/prevention-alarm'

export default {
  name: 'CompanySelect',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      unitName: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'unitName'
      },
      treeNodes: [], // 树节点
      searchKeys: []
    }
  },
  watch: {
    searchKeys: {
      deep: true,
      handler() {
        this.treeNodes = document.getElementsByClassName('company-select')[0].getElementsByClassName('el-tree-node__label')
      }
    }
  },
  created() {
    this.getEnterpriseTree()
  },
  methods: {
    // 获取企业树
    getEnterpriseTree() {
      enterpriseTree()
        .then(({ data }) => {
          this.treeData = data
        })
        .catch(err => {
          throw err
        })
    },
    searchType(queryString, cb) {
      if (queryString) {
        findUnitName({ unitName: queryString })
          .then(res => {
            const { data } = res
            const arr = []
            data.forEach(item => {
              arr.push({
                label: item.unitName,
                value: item.unitName
              })
            })
            cb(arr)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectUnit(item) {
      this.unitName = item.label
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
    },
    // 查询企业
    search() {
      this.searchKeys = []
      document.getElementsByClassName('tree-container')[0].scrollTop = 0
      this.getInfoByUnitname()
      setTimeout(() => {
        this.treeNodes.forEach(item => {
          if (item.innerText === this.unitName) {
            document.getElementsByClassName('tree-container')[0].scrollTop = item.offsetTop - 50
          }
        })
      }, 500)
    },
    // 使输入框失去焦点（修复点击清空按钮时，继续输入检索内容，这时候没有继续触发事件的 bug）
    setBlur() {
      document.activeElement.blur()
      this.$refs.autocomplete.focus()
    },
    // 获取搜索企业的信息
    getInfoByUnitname() {
      findUnitName({ unitName: this.unitName })
        .then(({ data }) => {
          this.searchKeys.push(data[0].unitName)
          this.$refs.tree.setCurrentKey(data[0].unitName)
        })
        .catch(err => {
          throw err
        })
    },
    // 确定选择
    submit() {
      const nodes = this.$refs.tree.getCheckedNodes(true)
      this.$emit('close', false)
      this.$emit('selected-unit', nodes)
    }
  }
}
</script>

<style scoped lang="scss">
.text {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
}

.input {
    width: 200px;
    margin-left: 10px;
    margin-right: 20px;
}

.tree-container {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    margin-top: 10px;
    padding: 5px 0 0 10px;
    overflow: auto;
}
</style>
