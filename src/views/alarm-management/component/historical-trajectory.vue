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
      <div>
        <div id="map" class="map" :style="mapHeight" />
        <div class="slider-container">
          <svg-icon
            v-if="!isPlay"
            icon-class="play"
            class="slider-button"
            @click="play"
          />
          <svg-icon
            v-else
            icon-class="pause"
            class="slider-button"
            @click="pause"
          />
          <el-slider
            v-if="tableHeight.height==='0'"
            v-model="sliderVal"
            class="slider-tra"
            :show-tooltip="false"
            :step="0.0001"
          />
          <div v-if="showMulBox" class="mul-box">
            <ul>
              <li @click="times=1;showMulBox=false;">1X</li>
              <li @click="times=2;showMulBox=false;">2X</li>
              <li @click="times=3;showMulBox=false;">3X</li>
              <li @click="times=5;showMulBox=false;">5X</li>
            </ul>
          </div>
          <span class="play-mul" @click="showMulBox = true">
            {{ `${times}X` }}
          </span>
        </div>
      </div>
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
          :height="tableHeight.height"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column label="时间" align="center" prop="reportTime" min-width="160px" />
          <el-table-column
            v-slot="{row}"
            label="速度"
            align="center"
            prop="speed"
            min-width="120px"
          >
            {{ `${row.speed} km/h` }}
          </el-table-column>
          <el-table-column label="限速值(公里/时)" align="center" prop="limit-speed" min-width="150px" />
          <el-table-column label="当时里程" align="center" prop="cur-mile" min-width="120px" />
          <el-table-column label="行驶里程" align="center" prop="driving-mile" min-width="120px" />
          <el-table-column
            label="位置"
            align="center"
            prop="location"
            min-width="220px"
            show-overflow-tooltip
          />
          <el-table-column
            v-slot="{row}"
            label="ACC状态"
            align="center"
            prop="acc"
            min-width="200px"
            show-overflow-tooltip
          >
            {{ row.acc === '1' ? 'acc开启' : 'acc关闭' }}
          </el-table-column>
          <el-table-column label="报警" align="center" prop="cbArmName" min-width="150px" />
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
<script src="//webapi.amap.com/ui/1.1/main.js?v=1.1.1"></script>
<script>
import Pagination from '@/components/Pagination'
import carImg from '../img/car.png'
import {
  alarmTrajectoryDowload,
  alarmTrajectory
} from '@/api/alarm-management/prevention-alarm'

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
    },
    from: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      map: null, // 地图
      tableData: [], // 表格数据
      total: 0, // 数据总数
      listQuery: {
        pageSize: 10,
        pageNum: 1
      },
      mapHeight: { height: '550px', transition: 'height .5s' }, // 地图高度
      tableHeight: { height: '0', transition: 'height .5s' }, // 表格高度
      showTable: false, // 是否显示表格
      sliderVal: 0, // 进度条
      isPlay: false, // 是否在播放
      pathSimplifierIns: null,
      actualList: [],
      navgtr: null,
      navgtrSpeed: 800,
      times: 1, // 倍速
      alreadyPlay: false, // 判断是继续播放开始重头开始
      showMulBox: false, // 显示倍速选项框
    }
  },
  watch: {
    visible(n) {
      if (n) {
        this.$nextTick(() => {
          this.times=1
          this.initialMap()
          this.getList()
        })
      }
    },
    sliderVal(newVal) {
      // if (!this.isOnSlider) {
      //   return false;
      // }
      this.sliderChange(newVal)
    }
  },
  mounted() {

  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.actualList = []
      this.mapHeight = { height: '550px', transition: 'height .5s' }
      this.tableHeight = { height: '0', transition: 'height .5s' }
      this.$emit('close', false)
    },
    // 初始化地图
    initialMap() {
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/light'
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
        cbArmName: row.cbArmName,
        ...this.listQuery
      }
      alarmTrajectoryDowload({ ...params })
        .then(_ => {
          this.closeDialog()
        })
        .catch(err => {
          throw err
        })
    },
    // 获取表格数据
    getList() {
      const row = this.rows[0]
      const params = {
        startTime: row.armTimeStart,
        endTime: row.armTimeEnd,
        vehicleId: row.vehicleId,
        plateNum: row.plateNum,
        unitName: row.unitName,
        cbArmName: row.cbArmName,
        ...this.listQuery,
        flag: this.from
      }
      alarmTrajectory({ ...params })
        .then(({ data }) => {
          this.tableData = data.list
          this.total = data.total || 0
          if (data.list) {
            data.list.forEach(item => {
              this.actualList.push([item.longitude,item.latitude])
              if (!item.location) {
                this.getLocation(item)
              }
            })
            if (this.actualList.length > 0) {
              this.initPathSimplifier()
            }
          } else {
            this.$message({
              type: 'warning',
              message: '暂无轨迹信息！'
            })
          }
        })
        .catch(err => {
          throw err
        })
    },
    // 通过经纬度获取位置
    getLocation(row) {
      let geocoder
      AMap.plugin('AMap.Geocoder', function() {
        geocoder = new AMap.Geocoder({ city: '', radius: 1000 })
      })
      const lnglat = [row.longitude, row.latitude]
      if (lnglat.length > 1) {
        geocoder.getAddress(lnglat, (status, result) => {
          const { regeocode } = result
          if (status === 'complete' && regeocode) {
            row.location = regeocode.formattedAddress
          }
        })
      }
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
    },
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.color === '1') return 'danger-alarm'
      else return 'normal-alarm'
    },
    // 播放轨迹
    play() {
      this.isPlay = true
      if (this.alreadyPlay) {
        this.navgtr.resume()
      } else {
        this.alreadyPlay = true
        this.navgtr.start(0)
      }
    },
    // 暂停轨迹
    pause() {
      this.isPlay = false
      this.navgtr.pause()
    },
    // 初始化组件实例
    initPathSimplifier() {
      const that = this
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        // 创建一个巡航轨迹路线
        that.pathSimplifierIns = new PathSimplifier({
          zIndex: 100, // 地图层级，
          map: this.map, // 所属的地图实例
          // 巡航路线轨迹列表
          getPath: (pathData, pathIndex) => {
            return pathData.path
          },
          // hover每一个轨迹点，展示内容
          // getHoverTitle: function(pathData, pathIndex, pointIndex) {
          //   if (pointIndex >= 0) {
          //     return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length
          //   }
          //   return pathData.name + '，点数量' + pathData.path.length
          // },
          // 自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
          // 绘制路线节点
          renderOptions: {
            renderAllPointsIfNumberBelow: -1, // 描绘路径点，如不需要设为-1
            pathTolerance: 2,
            keyPointTolerance: 0,
            pathLineStyle: {
              lineWidth: 6,
              strokeStyle: '#409eff',
              borderWidth: 1,
              borderStyle: '#eeeeee',
              dirArrowStyle: false
            },
            pathLineHoverStyle: {
              lineWidth: 6,
              strokeStyle: '#ff0000',
              borderWidth: 1,
              borderStyle: '#cccccc',
              dirArrowStyle: false
            },
            dirArrowStyle: {
              stepSpace: 30,
              strokeStyle: "#ffffff",
              lineWidth: 2
            },
            pathLineSelectedStyle: {
              lineWidth: 6,
              strokeStyle: '#409eff',
              borderWidth: 1,
              borderStyle: '#cccccc',
              dirArrowStyle: true
            },
            keyPointStyle: {
              radius: 0,
              fillStyle: 'rgba(8, 126, 196, 1)',
              lineWidth: 1,
              strokeStyle: '#eeeeee'
            },
            keyPointHoverStyle: {
              radius: 0,
              fillStyle: 'rgba(0, 0, 0, 0)',
              lineWidth: 2,
              strokeStyle: '#ffa500'
            },
            keyPointOnSelectedPathLineStyle: {
              radius: 0,
              fillStyle: 'rgba(8, 126, 196, 1)',
              lineWidth: 2,
              strokeStyle: '#eeeeee'
            }
          }
        })

        // 设置数据
        that.pathSimplifierIns.setData([{
          name: '路线0',
          path: that.actualList
        }])
        // 对第一条线路（即索引 0）创建一个巡航器
        that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
          loop: false, // 循环播放
          speed: that.navgtrSpeed, // 巡航速度，单位千米/小时
          pathNavigatorStyle: {
            initRotateDegree: -90,
            width: 48,
            height: 24,
            autoRotate: true,
            content: PathSimplifier.Render.Canvas.getImageContent(
              carImg,
              function onload() {
                that.pathSimplifierIns.renderLater()
              },
              onerror
              ),
            strokeStyle: null,
            fillStyle: null
          }
        })

        that.navgtr.on('start resume', function() {
          that.navgtr._startTime = Date.now()
          that.navgtr._startDist = this.getMovedDistance()
        })
        that.navgtr.on('stop pause', function() {
          that.navgtr._movedTime = Date.now() - that.navgtr._startTime
          that.navgtr._movedDist = this.getMovedDistance() - that.navgtr._startDist
        })
        that.navgtr.on('move', function(data, position) {
          const idx = position.dataItem.pointIndex // 走到了第几个点
          const tail = position.tail // 至下一个节点的比例位置
          const totalIdx = idx + tail
          const len = position.dataItem.pathData.path.length

          // 计算下一个距离速度
          if (idx < len - 1) {
            that.navgtr.setSpeed(that.navgtrSpeed * that.times)
          }
          // 进度条实时展示tail
          !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100)
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.isPlay = false
            that.sliderVal = 0
          }
        })
      })
    },
    // openSlider(){
    //   this.isOnSlider = true;
    // },
    // closeSlider(){
    //   this.isOnSlider = false;
    // },
    sliderChange(val){
      let newVal = typeof(newVal)==='number' ? val : this.sliderVal
      let num = parseInt((newVal / 100) * this.actualList.length);
      let decimal = String((newVal / 100) * this.actualList.length).split('.')[1]||0
      this.navgtr.moveToPoint(num, Number('0.'+decimal));
      this.pathSimplifierIns.renderLater();
    },
  }
}
</script>
<style scoped lang="scss">
.container {
  .map {
    width: 100%;
    height: 550px;
  }

  .slider-container {
    width: 65%;
    height: 40px;
    position:absolute;
    bottom: 50px;
    background-color:#fff;
    left: 20%;
    border-radius: 20px;

    .slider-button {
      height: 30px;
      width: 30px;
      display: inline-block;
      margin: 4px 0 0 10px;
      cursor: pointer;
    }

    .slider-tra {
      width: 85%;
      display: inline-block;
      position: absolute;
      left: 55px;
    }

    .play-mul {
      display: inline-block;
      font-size: 15px;
      color: #409EFF;
      position:absolute;
      right: 12px;
      top: 10px;
      cursor: pointer;
    }

    .mul-box {
      position:absolute;
      right: 10px;
      bottom: 40px;
      background-color: #fff;
      width: 30px;
      ul {
        padding: 5px;
      }
      ul li{
        list-style-type:none;
        cursor: pointer;
      }
      li:hover {
        color: #409EFF;
      }
    }
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

::v-deep .el-table .danger-alarm {
  color: red !important;
}

::v-deep .el-table .normal-alarm {
  color: green !important;
}
</style>
