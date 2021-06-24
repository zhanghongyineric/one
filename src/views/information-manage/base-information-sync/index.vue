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
      this.$confirm('确定同步设备信息？')
        .then(() => {
          device()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步设备信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步设备信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    },
    driver() {
      this.$confirm('确定同步司机信息？')
        .then(() => {
          driver()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步司机信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步司机信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    },
    company() {
      this.$confirm('确定同步企业信息？')
        .then(() => {
          company()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步企业信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步企业信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    },
    certificate() {
      this.$confirm('确定同步运输证信息？')
        .then(() => {
          certificate()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步运输证信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步运输证信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    },
    car() {
      this.$confirm('确定同步车辆信息？')
        .then(() => {
          car()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步车辆信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步车辆信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    },
    platform() {
      this.$confirm('确定同步平台信息？')
        .then(() => {
          platform()
            .then(res => {
              this.$message({
                type: 'success',
                message: '同步平台信息成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '同步平台信息失败！'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          })
        })
    }
  }
}
</script>
