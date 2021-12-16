<template>
  <el-dialog
    title="轨迹回放"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="50px"
    custom-class="base-dialog min-width-dialog"
    :before-close="closeDialog"
  >
    <div class="container">
      <div id="map" class="map" :style="mapHeight" />
      <el-divider />
      <div class="footer">
        <span class="footer-title">轨迹点</span>
        <div class="footer-button">
          <svg-icon icon-class="dowload-file" class="icon" @click="dowloadFile" />
          <svg-icon
            v-if="showTable"
            :style="{fill:showTable&&tableHeight.height!=='550px'?'#409EFF':''}"
            icon-class="shrink"
            class="icon"
            @click="shrinkTable"
          />
          <svg-icon v-else icon-class="open" class="icon" @click="openTable" />
          <svg-icon
            icon-class="full-screen"
            :style="{fill:tableHeight.height==='550px'?'#409EFF':''}"
            class="icon"
            @click="fullScreen"
          />
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          fit
          highlight-current-row
          :style="tableHeight"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column label="时间" align="center" prop="time" min-width="150px" />
          <el-table-column label="速度" align="center" prop="speed" min-width="100px" />
          <el-table-column label="限速值(公里/时)" align="center" prop="limit-speed" min-width="150px" />
          <el-table-column label="当时里程" align="center" prop="cur-mile" min-width="120px" />
          <el-table-column label="行驶里程" align="center" prop="driving-mile" min-width="120px" />
          <el-table-column label="位置" align="center" prop="location" min-width="200px" show-overflow-tooltip />
          <el-table-column label="状态" align="center" prop="status" min-width="200px" show-overflow-tooltip />
          <el-table-column label="报警" align="center" prop="alarm" min-width="150px" />
          <el-table-column label="是否补传" align="center" prop="repair" min-width="80px" />
        </el-table>

        <Pagination
          v-show="total>0 && showTable"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          class="pagination"
          @pagination="getList"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { alarmTrajectoryDowload } from '@/api/alarm-management/prevention-alarm'

export default {
  name: 'HistoricalTrajectory',
  components: { Pagination },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null, // 地图
      tableData: [{}, {}, {}], // 表格数据
      total: 0, // 数据总数
      listQuery: {
        pageSize: 10,
        pageNum: 1
      },
      mapHeight: { height: '550px', transition: 'height .5s' }, // 地图高度
      tableHeight: { height: '0', transition: 'height .5s' }, // 表格高度
      showTable: false // 是否显示表格
    }
  },
  watch: {
    visible(n) {
      if (n) {
        this.$nextTick(() => {
          this.initialMap()
        })
      }
    }
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
    },
    // 初始化地图
    initialMap() {
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12
      })
    },
    // 下载文件
    dowloadFile() {
      const row = this.rows[0]
      const params = {
        startTime: row.armTimeStart,
        endTime: row.armTimeEnd,
        vehicleId: row.vehicleId,
        plateNum: row.plateNum,
        unitName: row.unitName,
        cbArmName: row.cbArmName
        // pageNum: 1,
        // pageSize: 10
      }
      alarmTrajectoryDowload({ ...params })
        .then(_ => {
          this.closeDialog()
        })
        .catch(err => {
          throw err
        })
    },
    // 展开表格
    openTable() {
      this.mapHeight.height = '275px'
      this.tableHeight.height = '212px'
      this.showTable = true
    },
    // 表格全屏
    fullScreen() {
      if (this.tableHeight.height === '550px') {
        this.tableHeight.height = '0'
        this.mapHeight.height = '550px'
        this.showTable = false
      } else {
        this.tableHeight.height = '550px'
        this.mapHeight.height = '0'
        this.showTable = true
      }
    },
    // 获取表格数据
    getList() {},
    // 收起表格
    shrinkTable() {
      if (this.tableHeight.height === '550px') {
        this.tableHeight.height = '212px'
        this.mapHeight.height = '275px'
      } else {
        this.showTable = false
        this.tableHeight.height = '0'
        this.mapHeight.height = '550px'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  .map {
    width: 100%;
    height: 550px;
  }

  .footer {
    height: 40px;
    padding: 10px 10px 10px 20px;
    display: flex;
    justify-content: space-between;

    .footer-title {
        font-size: 16px;
        font-weight: 700;
    }

    .footer-button {
      .icon {
        font-size: 20px;
        margin-right: 5px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }

  .table {
    position: relative;

    .pagination {
      padding: 10px 10px;
      justify-content:flex-start;
    }

  }

}

::v-deep .el-dialog__body {
    padding: 0 !important;
}

::v-deep .el-divider--horizontal {
  margin: 0 !important;
}
</style>
