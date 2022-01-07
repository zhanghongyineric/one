<template>
  <el-dialog
    title="报警处理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="100px"
    custom-class="base-dialog dialog-col-1"
    :before-close="closeDialog"
  >

    <el-form :model="data" label-width="100px" :rules="rules">
      <el-row>
        <el-col :md="24">
          <el-form-item label="处理方式:" prop="cbHandleModeCode">
            <el-select
              v-model="data.cbHandleModeCode"
              size="small"
              placeholder="请选择处理方式"
            >
              <el-option
                v-for="{label,value} in handleTypeOptions"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24">
          <el-form-item label="备注内容:" prop="cbHandleInfo">
            <el-input v-model="data.cbHandleInfo	" placeholder="请输入备注内容" type="textarea" rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  handleAlarm
} from '@/api/alarm-management/prevention-alarm'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'HandleAlarm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    },
    returnToDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {
        cbHandleInfo: '已确认',
        cbHandleModeCode: '',
        guids: [],
        startTime: '',
        cbHandleModeName: '',
        cbHandlerId: '',
        cbHandlerName: ''
      },
      handleTypeOptions: [],
      rules: {
        cbHandleModeCode: [{ required: true, trigger: 'change', message: '请选择处理方式' }]
        // cbHandleInfo: [{ required: true, message: '请输入备注内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleTypeOptions = onlineOption['alarm_handle_type'].list
  },
  mounted() {
    console.log(this.$parent, 'parent')
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      if (this.returnToDetail) this.$emit('open-detail')
      else this.$emit('close', false)
    },
    // 确定选择
    submit() {
      this.setHandleReq()
      handleAlarm({ ...this.data })
        .then(_ => {
          this.$message({
            type: 'success',
            message: '处理成功！'
          })
          this.$emit('close', false)
          this.$emit('update-data')
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '处理失败！'
          })
          throw err
        })
    },
    // 组成请求参数
    setHandleReq() {
      this.data.guids = []
      const typeMap = onlineOption['alarm_handle_type'].map
      const userId = this.$store.state.user.userId
      const userName = this.$store.state.user.name
      this.rows.forEach(v => { this.data.guids.push(v.guid) })
      this.data.startTime = this.rows[0].armTimeStart
      this.data.cbHandleModeName = typeMap[this.data.cbHandleModeCode]
      this.data.cbHandlerId = userId
      this.data.cbHandlerName = userName
    }
  }
}
</script>
