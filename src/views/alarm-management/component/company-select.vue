<template>
  <el-dialog
    title="选择企业"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="100px"
    custom-class="base-dialog dialog-col-1"
    :before-close="closeDialog"
  >
    <span class="text">查找:</span>
    <el-input v-model="unitName" class="input" size="small" clearable placeholder="请输入企业名称" />
    <el-button type="primary" size="small" @click="search">查询</el-button>
    <div class="tree-container">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
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
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
    },
    // 查询企业
    search() {},
    // 确定选择
    submit() {
      this.$emit('close', false)
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
