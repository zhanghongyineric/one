<!--基础卡片表格模块-->
<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title" style="color:#fff">{{ title }}</span>
      <div class="buttons">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          :loading="downloadLoading"
          @click="handleDownload"
        >导出表格
        </el-button>
      </div>
    </div>
    <nav v-if="showFilter" class="filter f ai-c">
      <slot />
    </nav>
    <el-table
      v-loading="loading"
      :data="data.tableData"
      align="center"
      border
    >
      <el-table-column
        v-for="head in data.tableHead"
        :key="head.prop"
        :prop="head.prop"
        :label="head.label"
        :min-width="head.width"
        :show-overflow-tooltip="head.showOverflowTooltip"
      />
    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'BaseTable',
  props: {
    // 表格表头和数据
    data: {
      type: Object,
      required: true
    },
    // 是否多表格
    multi: {
      type: Boolean,
      default: false
    },
    // 多个表格时所有的表格数据
    allData: {
      type: Object,
      default: _ => ({})
    },
    // 多表格时的配置文件
    config: {
      type: Object,
      default: _ => ({})
    },
    // 加载状态
    loading: {
      type: Boolean,
      required: true
    },

    // 表格标题
    title: {
      type: String,
      required: true
    },
    // 是否显示筛选条件
    showFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      downloadLoading: false // 表格下载加载状态
    }
  },
  methods: {
    // 下载表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.data.tableHead.map(item => item.label)// 表头显示文字
        const filterVal = this.data.tableHead.map(item => item.prop)// 表格字段

        if (!this.multi) {
          const list = this.data.tableData // 表格数据
          const data = this.formatJson(filterVal, list)

          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.title,
            autoWidth: true,
            bookType: 'xlsx'// 导出文件类型
          })
        } else {
          const data = Object.keys(this.allData).map(key => ({
            sheetName: this.config[key].sheetName,
            multiHeader: this.config[key].multiHeader,
            header: tHeader,
            merges: this.config[key].merges,
            data: this.formatJson(filterVal, this.allData[key]),
            autoWidth: true
          }))

          excel.export_json_to_excel_multi({
            data: data,
            bookType: 'xlsx', // 导出文件类型
            filename: this.title
          })
        }

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

.table-title {
  margin-bottom: 10px;
}
.filter{
  gap:20px;
  margin-bottom: 20px;
}
</style>
