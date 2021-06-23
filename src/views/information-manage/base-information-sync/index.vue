<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <el-button type="primary" size="small" @click="device">设备</el-button>
      <el-button type="primary" size="small" @click="driver">司机</el-button>
      <el-button type="primary" size="small" @click="company">企业</el-button>
      <el-button type="primary" size="small" @click="certificate">运输证</el-button>
      <el-button type="primary" size="small" @click="car">车辆</el-button>
      <el-button type="primary" size="small" @click="platform">平台</el-button>
    </el-card>
  </div>
</template>

<script>
import {
  device,
  driver,
  company,
  certificate,
  car,
  platform
} from '@/api/information-manage/imformation-sync'

export default {
  name: 'BaseInformationSync',
  data() {
    return {}
  },
  methods: {
    device() {
      device()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    },
    driver() {
      driver()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    },
    company() {
      company()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    },
    certificate() {
      certificate()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    },
    car() {
      car()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    },
    platform() {
      platform()
        .then(res => {
          this.$message({
            type: 'success',
            message: '成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '失败！'
          })
          throw err
        })
    }
  }
}
</script>
