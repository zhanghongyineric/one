<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <el-button type="primary" size="small" @click="device">设备</el-button>
      <el-button type="primary" size="small" @click="driver">司机</el-button>
      <el-button type="primary" size="small" @click="company">企业</el-button>
      <el-button type="primary" size="small" @click="certificate">运输证</el-button>
      <el-button type="primary" size="small" @click="car">车辆</el-button>
      <el-button type="primary" size="small" @click="platform">平台</el-button>
      <div class="gps-box">
        <span class="gps-text">同步GPS：</span>
        <el-select
          v-model="partion"
          placeholder="请选择区间"
          size="small"
          style="margin-right: 10px"
        >
          <el-option v-for="num in 4" :key="num" :value="num" :label="num" />
        </el-select>
        <el-date-picker
          v-model="yearMonth"
          type="month"
          placeholder="请选择年月"
          size="small"
          style="margin-right: 10px"
          value-format="yyyyMM"
          format="yyyyMM"
        />
        <el-date-picker
          v-model="yearMonthDay"
          type="date"
          size="small"
          placeholder="请选择年月日"
          style="margin-right: 10px"
          value-format="yyyy-MM-dd"
        />
        <el-button type="primary" size="small" @click="gps">同步GPS</el-button>
      </div>
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
  platform,
  gps
} from '@/api/information-manage/imformation-sync'

export default {
  name: 'BaseInformationSync',
  data() {
    return {
      partion: null,
      yearMonth: '',
      yearMonthDay: ''
    }
  },
  methods: {
    device() {
      this.$confirm('确定同步设备信息？')
        .then(() => {
          device()
            .then(_ => {
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
            .then(_ => {
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
            .then(_ => {
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
            .then(_ => {
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
            .then(_ => {
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
            .then(_ => {
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
    },
    gps() {
      this.$confirm('确定同步gps信息？')
        .then(() => {
          gps({
            partion: this.partion,
            yearMonth: this.yearMonth,
            yearMonthDay: this.yearMonthDay
          })
            .then(_ => {
              this.$message({
                type: 'success',
                message: '同步gps信息成功！'
              })
              this.partion = null
              this.yearMonth = ''
              this.yearMonthDay = ''
            })
            .catch(err => {
              // this.$message({
              //   type: 'error',
              //   message: '同步gps信息失败！'
              // })
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
<style scoped>
.gps-box {
  margin-top: 20px;
}

.gps-text {
  font-size: 14px;
  font-weight: 700;
}
</style>
