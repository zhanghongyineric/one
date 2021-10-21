<template>
  <el-dialog
    title="编辑图表数据"
    :visible.sync="dialogVisible"
  >
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="type"
        label="报警名称"
      />
      <el-table-column
        v-for="head in tableHead"
        :key="head.props"
        v-slot="{row}"
        :prop="head.props"
        :label="head.label"
      >
        <el-input v-model="row[head.props]" />
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
    chartData: {
      type: Array,
      required: true
    }
  },
  // inject: ['demo', 'test'],
  data() {
    return {
      tableHead: [
        { label: '周一', props: 'monday' },
        { label: '周二', props: 'tuesday' },
        { label: '周三', props: 'wednesday' },
        { label: '周四', props: 'thursday' },
        { label: '周五', props: 'friday' },
        { label: '周六', props: 'saturday' },
        { label: '周日', props: 'sunday' }
      ], // 表头数据
      tableData: []
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
    data: {
      get() {
        const types = ['疲劳驾驶', '时段禁行', '离线位移', '超速报警']

        console.log(this.chartData.map((item, index) => ({ type: types[index], ...item })))
        return this.chartData.map((item, index) => ({ type: types[index], ...item }))
      },
      set(data) {
        console.log(data)
        this.$emit('update:tableData', data)
      }
    }
  },
  watch: {
    chartData(data) {
      const types = ['疲劳驾驶', '时段禁行', '离线位移', '超速报警']

      this.tableData = data.map((item, index) => ({ type: types[index], ...item }))
    }
  },
  created() {
    // console.log(this.demo, this.test)
  },
  methods: {
    confirm() {
      console.log(this.demo)
      return
      this.dialogVisible = false
      const chartData = this.tableData.map(item => {
        const temp = { ...item }

        delete temp.type
        return temp
      })
      this.$emit('updateChartData', chartData)
    }
  }
}
</script>

<style scoped>

</style>
