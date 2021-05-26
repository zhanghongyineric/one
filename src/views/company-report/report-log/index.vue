<!--
  - FileName: 日志报备
  - @author: ZhouJiaXing
  - @date: 2021/5/6 下午1:51
  -->

<template>
  <div class="layout-content report-log">
    <el-card v-loading="loading" class="box-card">

      <!--报备状态-->
      <div v-if="status!=='4'" class="not-report f-col ai-c jc-c">
        <h1><i :class="iconClass" :style="{color:status==='1'||status==='3'?'red':'green'}" />{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
        <el-button
          v-if="status==='1'||status==='3'"
          :loading="buttonLoading"
          type="primary"
          :disabled="status!=='1'"
          @click="startReport"
        >开始报备
        </el-button>
      </div>

      <!--报备中-->
      <Reporting v-if="status==='4'" :status.sync="status" />
    </el-card>
  </div>
</template>

<script>
import Reporting from './components/reporting'
import { getReportStatus, startReport } from '@/api/company-report/report-log'

export default {
  name: 'ReportLog',
  components: {
    Reporting
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      status: '0' // 报备状态 1 表示未报备 2 表示已报备 3 表示今日报备超时 4 表示报备中 需要调接口查询
    }
  },
  computed: {
    title() {
      const title = {
        1: '今日日志未报备 请尽快报备',
        2: '今日日志已报备 请移至处理日志查看',
        3: '报备时间已过 今日未报备'
      }
      return title[this.status]
    },
    subtitle() {
      const title = {
        1: '请在今日下午6：00前报备昨日违章，否则视为未报',
        2: '请在3日内处理完日志中的违章内容',
        3: '昨日违章未提交报备'
      }
      return title[this.status]
    },
    iconClass() {
      const iconClass = {
        1: 'el-icon-warning-outline',
        2: 'el-icon-circle-check',
        3: 'el-icon-warning-outline'
      }
      return iconClass[this.status]
    }
  },
  created() {
    getReportStatus().then(res => {
      this.status = res.data
      this.loading = false
    }).catch(e => {
      this.loading = false
    })
  },
  methods: {
    // 开始报备
    startReport() {
      if (new Date().getHours() < 5) {
        this.$message('每日凌晨5点开发报备')
        return
      }
      this.buttonLoading = true
      startReport().then(res => {
        this.status = '4'
        this.buttonLoading = false
      }).catch(e => {
        this.buttonLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  .not-report {
    height: 180px;

    h1 {
      font-size: 24px;
      line-height: 24px;
      font-weight: normal;

      i {
        margin-right: 5px;
        color: red;
        font-size: 24px
      }
    }

    .subtitle {
      margin-bottom: 25px;
    }
  }
}
</style>
