<template>
  <el-dialog
    title="编辑图表数据"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
  >
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="head in tableHead"
        :key="head.prop"
        v-slot="{row}"
        :prop="head.prop"
        :label="head.label"
      >
        <template>
          <span v-if="head.prop==='name'">{{ row[head.prop] }}</span>
          <el-input-number v-else v-model="row[head.prop]" :controls="false" />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditChartDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    tableHead: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    },
    dialogWidth() {
      return this.type === 'week' ? '50%' : '100%'
    }
  },
  methods: {
    confirm() {
      this.dialogVisible = false
      const chartData = this.tableData.map(item => {
        const temp = { ...item }

        delete temp.name
        return Object.values(temp)
      })
      this.$emit('updateChartData', chartData)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-input-number {
    width: 60px;

    .el-input__inner {
      padding: 0 !important;
    }
  }
}

</style>
