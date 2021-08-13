<template>
  <div class="container">
    <div id="container" class="map" :style="styleSize" />
    <div class="left-box">
      <div class="static-box">
        <div class="statistics-num">
          <span class="number">{{ vehicletotal }}</span>
          <span class="text">入网车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">{{ onlineCount }}</span>
          <span class="text">上线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">{{ realTimeCount }}</span>
          <span class="text">在线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">0</span>
          <span class="text">报警车辆</span>
        </div>
      </div>
      <el-divider />
      <div style="padding-top: 20px;padding-bottom: 20px">
        <el-input v-model="searchText" :placeholder="searchPlaceholder[searchCond]" class="input-with-select">
          <el-select slot="prepend" v-model="searchCond" placeholder="请选择">
            <el-option label="车牌号" value="plateNum" />
            <el-option label="企业名" value="unitName" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </div>
      <div style="margin-bottom: 10px">
        <el-checkbox v-model="allCheck">全选</el-checkbox>
        <span class="check-text first-span">已选企业：0家</span>
        <span class="check-text second-span">已选车辆：0辆</span>
      </div>
      <div class="company-list">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          show-checkbox
        />
      </div>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        fit
        style="width: 100%;height:100%;"
      >
        <el-table-column type="index" />
        <el-table-column prop="number" label="车牌号" />
        <el-table-column prop="number" label="所属企业" />
        <el-table-column prop="number" label="车辆类型" />
        <el-table-column prop="number" label="是否双驾" />
        <el-table-column prop="number" label="定位时间" />
        <el-table-column prop="number" label="接收时间" />
        <el-table-column prop="number" label="卫星速度" />
        <el-table-column prop="number" label="记录仪速度" />
        <el-table-column prop="number" label="限速" />
        <el-table-column prop="number" label="位置" />
        <el-table-column prop="number" label="状态" />
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  selectPlateNum,
  unitVehicle,
  vehicleNumber
} from '@/api/live-monitor/message'

export default {
  name: 'MessageMonitor',
  data() {
    return {
      styleSize: {
        height: '',
        width: ''
      },
      map: '',
      allCheck: false,
      activeNames: [],
      company: false,
      checkList: [],
      tableData: [],
      treeData: [],
      defaultProps: {
        children: 'vehicles',
        label: 'plateNum'
      },
      searchText: '',
      searchCond: 'plateNum',
      searchPlaceholder: {
        plateNum: '请输入车牌号',
        unitName: '请输入企业名'
      },
      realTimeCount: 0, // 在线车辆
      onlineCount: 0, // 上线数
      vehicletotal: 0 // 入网车辆数
    }
  },
  created() {
    // 事件监听，实时获取屏幕宽高
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getUnitVehicle()
    this.getVehicleNumber()
  },
  mounted() {
    this.getmap()
  },
  methods: {
    getVehicleNumber() {
      vehicleNumber()
        .then((res) => {
          const { data: { realTimeCount, onlineCount, vehicletotal }} = res
          this.realTimeCount = realTimeCount
          this.onlineCount = onlineCount
          this.vehicletotal = vehicletotal
        })
        .catch((err) => {
          throw err
        })
    },
    search() {
      if (this.searchCond === 'plateNum') {
        this.getDataByPlateNum()
      } else {
        this.getUnitVehicle()
      }
    },
    getDataByPlateNum() {
      selectPlateNum({
        plateNum: this.searchText
      })
        .then(res => {
          console.log(res, '车牌')
        })
        .catch(err => {
          throw err
        })
    },
    getUnitVehicle() {
      unitVehicle({ unitName: '' })
        .then(res => {
          const { data } = res
          data.forEach(item => {
            item.plateNum = item.unitName
            if (item.plateNum.length > 17) {
              item.plateNum = item.plateNum.substring(0, 17) + '...'
            }
          })
          this.treeData = data
          console.log(this.treeData, '企业')
        })
        .catch(err => {
          throw err
        })
    },
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap() {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })
      this.map.setFitView()
    },
    handleChange(val) {}
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.left-box {
  width: 400px;
  height: 100%;
  background-color: #1C2F41;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 10px;
  padding-right: 10px;
  overflow-y: auto;
}

::v-deep .el-divider--horizontal {
  margin: 0 !important;
}

::v-deep .amap-logo {
  display: none !important;
}

::v-deep .amap-copyright {
  display: none !important;
}

.static-box {
  width: 100%;
  height: 90px;
  padding: 10px 0 0 10px;
  display: flex;
  justify-content: space-between;

  div {
    display: inline-block;
  }
}

  .statistics-num {
    display: flex;
    flex-direction: column;
    margin: 8px 0;

    span {
      display: block;
      color: #ccc;
      text-align: center;
    }

    .number {
      font-size: 25px;
      margin-bottom: 3px;
    }

    .text {
      font-size: 12px;
      color: #269DDD;
    }
}

.check-text {
  font-size: 12px;
  color: #a9a9a9;
  margin-top: 5px;
}

.first-span {
  margin-left: 60px;
  position: absolute;
  right: 130px;
}

.second-span {
  margin-left: 10px;
  position: absolute;
  right: 10px;
}

.company-list {
  padding-left: 20px;
  padding-right: 20px;
}

.company-list ::v-deep .el-checkbox__label {
  color: #ccc !important;
}

::v-deep .el-checkbox__label {
  color: #fff !important;
}

::v-deep .el-collapse-item__wrap {
  background-color: #1C2F41 !important;
  border: 0 !important;
}

::v-deep .el-collapse-item__header {
  background-color: #1C2F41 !important;
}

::v-deep .el-collapse-item__arrow {
  color: #fff;
}

::v-deep .el-collapse {
  border: 0 !important;
}

::v-deep .el-collapse-item__header {
  border: 0 !important;
}

::v-deep .el-tree {
  background-color: #1C2F41 !important;
}

::v-deep .el-tree-node__label {
  color: #fff;
}

::v-deep .el-tree-node__content {
  background-color: #1C2F41 !important;
}

.table-box {
  width: calc(100% - 400px);
  height: 200px;
  position: absolute;
  bottom: 0;
  right: 0;
}

::-webkit-scrollbar {
  // 滚动条的背景
  width: 16px;
  height: 14px;
  background: #1C2F41;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  width: 20px;
  border: 5px solid transparent;
}

::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px #1C2F41 inset;
}

::-webkit-scrollbar-thumb {
  //滚动条的滑块样式修改
  width: 20px;
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px #1d262e inset;
}

::-webkit-scrollbar-corner {
  background: #1C2F41;
}

.input-with-select ::v-deep .el-input-group__prepend {
  background-color: #fff !important;
}

::v-deep .el-select {
  width: 90px;
}
</style>
