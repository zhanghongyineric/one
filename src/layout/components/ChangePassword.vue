
<!--
  - FileName: ChangePassword.vue
  - @author: ChenHaiPing
  - @date: 2021/4/20 上午10:39
  -->

<template>
  <!--修改密码弹窗-->
  <el-dialog
    title="修改密码"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    custom-class="base-dialog dialog-col-1"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="createFormData"
      label-width="100px"
    >
      <el-form-item label="密码:" prop="password">
        <el-input
          v-model="createFormData.password"
          type="password"
          placeholder="请输入原始密码"
          auto-complete="new-password"
        />
      </el-form-item>
      <el-form-item label="新密码:" prop="newPassWord">
        <el-input
          v-model="createFormData.newPassWord"
          type="password"
          placeholder="请输入新密码"
          auto-complete="new-password"
        />
      </el-form-item>
      <el-form-item label="确认新密码:" prop="passwordConfirm">
        <el-input
          v-model="createFormData.passwordConfirm"
          type="password"
          placeholder="请确认新密码"
          auto-complete="new-password"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        取消
      </el-button>
      <el-button type="primary" :loading="buttonLoading" @click="updateData()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/user/password-update'
export default {
  name: 'ChangePassword',
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    const passWords = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原始密码'))
      } else if (value.length < 8) {
        callback(new Error('密码必须大于等于8位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.length < 8) {
        callback(new Error('密码必须大于等于8位'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.createFormData.newPassWord) {
        callback(new Error('两次输入的新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      buttonLoading: false,
      createFormData: {
        password: '',
        newPassWord: '',
        passwordConfirm: ''
      },
      rules: {
        password: [{ required: true, trigger: 'blur', validator: passWords }],
        newPassWord: [{ required: true, trigger: 'blur', validator: validatePass }],
        passwordConfirm: [{ required: true, trigger: 'blur', validator: validatePass2 }]
      } // 新增和编辑框的规则
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const passwords = {
            password: this.createFormData.newPassWord,
            prePassword: this.createFormData.password
          }
          updatePassword(passwords).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            location.reload()
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
