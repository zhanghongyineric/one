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
        <el-autocomplete
          v-model="searchText"
          :fetch-suggestions="searchSuggestions"
          placeholder="请输入内容"
          @select="selectSuggestion"
        >
          <el-select slot="prepend" v-model="searchCond" placeholder="请选择">
            <el-option label="车牌号" value="plateNum" />
            <el-option label="企业名" value="unitName" />
          </el-select>
          <i
            slot="suffix"
            class="el-icon-search el-input__icon i-cursor"
            @click="search"
          />
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
            <span class="addr">{{ item.address }}</span>
          </template>
        </el-autocomplete>
      </div>
      <div style="margin-bottom: 10px">
        <el-checkbox v-model="allCheck" @change="checkedAll">全选</el-checkbox>
        <!-- <span class="check-text first-span">已选企业：{{ checkedUnits }}家</span> -->
        <span class="check-text second-span">已选车辆：{{ checkedCars }}辆</span>
      </div>
      <div v-loading="treeLoading" class="company-list">
        <el-tree
          ref="unitTree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          :highlight-current="true"
          expand-on-click-node
          node-key="unitName"
          @check="checkNode"
        />
      </div>
    </div>
    <div v-show="showTable" class="close-symbol" @click="showTable = false">
      <div class="bottom-arrow" />
    </div>
    <div v-show="showTable" v-loading="containerLoading" class="table-box">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        fit
        style="width:100%;"
        height="200"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="acc" label="状态" width="100" align="center">
          <template v-slot="{row}">
            <span v-if="row.acc === '0'">关闭</span>
            <span v-else>开启</span>
          </template>
        </el-table-column>
        <el-table-column prop="vehiIdNo" label="车牌号" align="center" width="120" />
        <el-table-column prop="unitName" show-overflow-tooltip label="所属企业" align="center" />
        <el-table-column prop="speed" label="速度" align="center" width="100" />
        <el-table-column prop="position" show-overflow-tooltip label="位置" align="center" />
      </el-table>
    </div>
    <div v-show="!showTable" class="expand-symbol" @click="showTable = true">
      <div class="top-arrow" />
    </div>
  </div>
</template>

<script>
import {
  selectPlateNum,
  unitVehicle,
  vehicleNumber,
  vehicleLocationInformation,
  selectUnitName
} from '@/api/live-monitor/message'

export default {
  name: 'MessageMonitor',
  data() {
    return {
      containerLoading: false,
      treeLoading: false,
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
        children: 'children',
        label: 'unitName'
      },
      showTable: true,
      searchText: '',
      searchCond: 'plateNum',
      searchPlaceholder: {
        plateNum: '请输入车牌号',
        unitName: '请输入企业名'
      },
      realTimeCount: 0, // 在线车辆
      onlineCount: 0, // 上线数
      vehicletotal: 0, // 入网车辆数
      checkedCars: 0, // 已选中的车辆数
      checkedUnits: 0, // 已选中的企业数
      markers: [], // 所有标记点位置
      timer: null // 定时调用获取在线车辆数接口
    }
  },
  watch: {
    markers: {
      deep: true,
      handler() {
        this.setMarkers()
      }
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
    this.startInterval()
  },
  deactivated() {
    clearInterval(this.timer)
    this.timer = null
  },
  activated() {
    this.startInterval()
  },
  methods: {
    startInterval() {
      this.timer = setInterval(() => {
        this.getVehicleNumber()
      }, 4000)
    },
    checkedAll() {
      this.treeLoading = true
      setTimeout(() => {
        if (this.allCheck) {
          this.$refs.unitTree.setCheckedNodes(this.treeData)
          this.checkNode()
        } else {
          this.$refs.unitTree.setCheckedKeys(this.treeData)
          this.markers = []
          this.tableData = []
        }
        this.treeLoading = false
      }, 1500)
    },
    getOnlineVehicleData(req) {
      vehicleLocationInformation(req)
        .then((res) => {
          const { data } = res

          let geocoder; let lnglat = []
          AMap.plugin('AMap.Geocoder', function() {
            geocoder = new AMap.Geocoder({ city: '' })
          })
          data.forEach(item => {
            lnglat = [item.latitude, item.longitude]
            this.markers.push({
              icon: 'https://webapi.amap.com/images/car.png',
              position: lnglat
            })
            geocoder.getAddress(lnglat, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                item.position = result.regeocode.formattedAddress
              }
            })
          })
          setTimeout(() => {
            this.tableData = data
          }, 500)
        })
        .catch(err => {
          throw err
        })
    },
    checkNode() {
      const checkedNodes = this.$refs.unitTree.getCheckedNodes(true)
      if (checkedNodes.length === 0) {
        this.markers = []
        this.tableData = []
        this.containerLoading = false
      } else {
        this.containerLoading = true
        setTimeout(() => {
          let count = 0; const req = []
          checkedNodes.forEach(v => {
            if (v && v.plateNum) {
              if (v.plateNum.substr(0, 1) === '川') {
                count++
                req.push({ plateNum: v.plateNum, unitName: v.enterpriseName })
              }
            }
          })
          this.getOnlineVehicleData(req)
          this.checkedCars = count
        }, 500)
      }
    },
    setMarkers() {
      this.map.clearMap()
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })
      this.markers.forEach(marker => {
        new AMap.Marker({
          map: this.map,
          icon: marker.icon,
          position: [marker.position[0], marker.position[1]],
          offset: new AMap.Pixel(-13, -30)
        })
      })
      this.map.setFitView()
      this.containerLoading = false
    },
    async searchSuggestions(queryString, cb) {
      if (queryString) {
        if (this.searchCond === 'plateNum') {
          const { data } = await selectPlateNum({ plateNum: queryString })
          data.forEach(item => {
            item.label = item.plateNum
            item.value = item.plateNum
          })
          cb(data)
        } else {
          const { data } = await selectUnitName({ unitName: queryString })
          data.forEach(item => {
            item.label = item.unitName
            item.value = item.unitName
          })
          cb(data)
        }
      } else {
        cb([])
        return
      }
    },
    selectSuggestion(item) {
      this.containerLoading = true
      if (this.searchCond === 'plateNum') {
        const req = [{ plateNum: item.plateNum }]
        vehicleLocationInformation(req)
          .then((res) => {
            const { data } = res
            this.markers.push({
              icon: 'https://webapi.amap.com/images/car.png',
              position: [data[0].latitude, data[0].longitude]
            })
            let geocoder; let lnglat = []
            AMap.plugin('AMap.Geocoder', function() {
              geocoder = new AMap.Geocoder({ city: '' })
            })
            data.forEach(item => {
              lnglat = [item.latitude, item.longitude]
              geocoder.getAddress(lnglat, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  item.position = result.regeocode.formattedAddress
                }
              })
            })
            setTimeout(() => {
              this.tableData = data
            }, 500)
          })
          .catch(err => {
            throw err
          })
      }
    },
    getVehicleNumber() {
      vehicleNumber()
        .then(res => {
          const { data: { realTimeCount, onlineCount, vehicletotal }} = res
          this.realTimeCount = realTimeCount
          this.onlineCount = onlineCount
          this.vehicletotal = vehicletotal
        })
        .catch(err => {
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
    recursionTree(children) {
      children.forEach(child => {
        if (child.children.length) {
          this.recursionTree(child.children)
        } else if (!child.children.length && child.vehicles) {
          child.children = child.vehicles
          child.children.forEach(item => {
            item.unitName = item.plateNum
          })
        }
      })
    },
    getTreeDeep(data) {
      data.forEach((v, i) => {
        if (v.children.length) {
          this.recursionTree(v.children)
        }
      })
    },
    getUnitVehicle() {
      this.treeLoading = true
      unitVehicle({ unitName: '' })
        .then(res => {
          const { data } = res
          this.treeData = data
          this.treeLoading = false
        })
        .catch(err => {
          this.treeLoading = false
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
    }
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
  overflow-x: auto;

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

::v-deep .el-autocomplete {
  width: 100% !important;
}

.i-cursor {
  cursor: pointer;
}

::v-deep .el-loading-mask {
  background-color: #1C2F41;
}

.expand-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent transparent #fff transparent;
  position: absolute;
  bottom: 0;
  left: 60%;
  cursor: pointer;
}

.top-arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ccc;
  transform: rotate(45deg);
  position: relative;
  top: 35px;
  left: 10px;
}

.close-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color:  transparent  transparent #fff  transparent;
  position: absolute;
  bottom: 200px;
  left: 60%;
  cursor: pointer;
}

.bottom-arrow {
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #ccc;
  border-right: 2px solid #ccc;
  transform: rotate(45deg);
  position: relative;
  top: 30px;
  left: 10px;
}
</style>
