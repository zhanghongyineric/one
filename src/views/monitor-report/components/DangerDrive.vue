<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">危险驾驶事件</span>
    </div>

    <section>
      <div class="table-title f jc-sb ai-c">
        <h3 style="margin: 0">ADAS报警</h3>
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          :loading="downloadLoading"
          @click="handleDownload('ADAS')"
        >导出表格
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="data.ADAS.tableData"
        border
      >
        <el-table-column
          v-for="head in data.ADAS.tableHead"
          :key="head.prop"
          :prop="head.prop"
          :label="head.label"
        />
      </el-table>
    </section>
    <section>
      <div class="table-title f jc-sb ai-c" style="margin-top: 10px;">
        <h3 style="margin: 0">DSM报警</h3>
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          :loading="downloadLoading"
          @click="handleDownload('DSM')"
        >导出表格
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="data.DSM.tableData"
        border
      >
        <el-table-column
          v-for="head in data.DSM.tableHead"
          :key="head.prop"
          :prop="head.prop"
          :label="head.label"
        />
      </el-table>
    </section>
  </el-card>
</template>

<script>

export default {
  name: 'DangerDrive',
  props: {
    data: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false // 表格下载加载状态
    }
  },
  methods: {
    // 下载表格
    handleDownload(type) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.data[type].tableHead.map(item => item.label)// 表头显示文字
        const filterVal = this.data[type].tableHead.map(item => item.prop)// 表格字段
        const list = this.data[type].tableData // 表格数据
        const data = this.formatJson(filterVal, list)

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `${type}报警数据`,
          autoWidth: true,
          bookType: 'xlsx'// 导出文件类型
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__row td {
  padding: 5px 0;

  span {
    line-height: 32px;
  }
}

.header-setting {
  margin-right: 10px;
}
.table-title{
  margin-bottom: 10px;
}
</style>
