<template>
  <el-dialog
    title="报警处理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="100px"
    custom-class="base-dialog dialog-col-1"
    :before-close="closeDialog"
  >
    <el-row>
      <el-form v-model="data" label-width="80px">
        <el-col :md="24">
          <el-form-item label="处理方式:">
            <el-select
              v-model="data.type"
              size="small"
              placeholder="请选择处理方式"
            >
              <el-option value="1" label="测试" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24">
          <el-form-item label="备注内容:">
            <el-input v-model="data.memo" placeholder="请输入备注内容" type="textarea" rows="3" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'HandleAlarm',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {
        memo: '已确认'
      }
    }
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
    },
    // 确定选择
    submit() {
      this.$emit('close', false)
    }
  }
}
</script>
