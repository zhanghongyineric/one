<template>
  <div v-loading="loading" class="container">
    <div id="container" class="map" :style="styleSize" />
    <div class="contbtn">
      <div class="search-box">
        <el-form
          ref="searchForm"
          :model="searchFormData"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="车牌号码:" prop="plateNum">
            <el-autocomplete
              v-model="searchFormData.plateNum"
              size="small"
              placeholder="请输入车牌号"
              clearable
              :fetch-suggestions="searchType"
              :debounce="500"
              style="width:220px;"
              @select="selectPlateNum"
            />
          </el-form-item>
          <el-form-item label="查询日期:" prop="date">
            <el-date-picker
              v-model="searchFormData.date"
              type="date"
              placeholder="请选择查询日期"
              size="small"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="时间范围:" prop="time">
            <el-time-picker
              v-model="searchFormData.time"
              is-range
              size="small"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="请选择时间范围"
              style="width:220px;"
              value-format=" HH:mm:ss"
            />
          </el-form-item>

        </el-form>
        <div id="sbtn">
          <el-button type="warning" size="small" @click="reset">重置</el-button>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </div>

        <div class="replay-box">
          <span>回放进度：</span>
          <el-progress :text-inside="true" :stroke-width="15" :percentage="perValue" />
        </div>
        <div class="check-box">
          <el-radio
            v-for="item in speedList"
            :key="item"
            v-model="speedCount"
            :label="item"
            @change="changeCount"
          >×{{ item }}</el-radio>
        </div>
        <div class="btns-box">
          <div class="play-box" @click="startmove">
            <div v-show="!showPause" class="play" />
            <div v-show="showPause" class="pause" />
          </div>
          <div class="cancel-box" @click="replayAnimation">
            <div class="cancel" />
          </div>
        </div>
      </div>
    </div>
    <div :class="[showTable ? 'close-symbol' : 'expand-symbol']" @click="showTable = !showTable">
      <div :class="[showTable ? 'bottom-arrow' : 'top-arrow']" />
    </div>
    <div v-show="showTable" class="bottom-table">
      <el-table
        :data="tableData"
        style="width: 100%;height:100%;"
        border
        fit
        highlight-current-row
        height="200"
        @cell-mouse-enter="getLocation"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="status" label="ACC状态" min-width="120" align="center" />
        <el-table-column prop="time" label="上报时间" min-width="120" align="center" />
        <el-table-column prop="speed" label="速度(km/h)" min-width="120" align="center" />
        <el-table-column
          prop="positionDes"
          label="位置描述"
          min-width="120"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>
<script>
import { position, findPlateNum } from '@/api/live-monitor/history'

export default {
  name: 'HistoricalTrajectory',
  data() {
    return {
      styleSize: {
        height: '',
        width: ''
      },
      searchFormData: {
        plateNum: '',
        startTime: '',
        endTime: '',
        date: '',
        time: []
      },
      passedTime: 0,
      passedTimeTemp: 0,
      passedPolylineLength: 0,
      loading: false,
      map: null,
      lineArr: [[30.572903, 104.06632]],
      lineArrlast: [],
      marker: null,
      showPause: false,
      begin: true,
      perValue: 0,
      speedCount: 1, // 目前选择的倍数
      speedList: [1, 5, 10, 20, 50], // 倍数数据
      markerSpeed: 100, // 初始化速度
      passedPolyline: null,
      passedPath: 0, // 存放（播放时点击倍数）抓取到的位置
      curreGDPath: null, // 存放（播放时点击倍数）抓取到的经纬度
      polyline: null, // 轨迹线路
      tableData: [],
      showTable: true,
      alreadyPercent: 0,
      rules: {
        plateNum: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        date: [{ required: true, message: '请选择查询日期', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间范围', trigger: 'change' }]
      },
      time_variable: 0
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  created() {
    this.getHeight()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.searchFormData.plateNum) {
        vm.searchFormData.plateNum = vm.$route.query.plateNum
      }
    })
  },
  mounted() {
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      center: [104.06632, 30.572903],
      zoom: 12,
      mapStyle: 'amap://styles/grey'
    })
    this.map.setFitView()
    // 事件监听，实时获取屏幕宽高
    window.addEventListener('resize', this.getHeight)
  },
  methods: {
    searchType(queryString, cb) {
      if (queryString) {
        findPlateNum({ plateNum: queryString })
          .then(res => {
            const { data } = res
            const searchData = []
            data.forEach(item => {
              searchData.push({
                label: item,
                value: item
              })
            })
            cb(searchData)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectPlateNum(item) {
      this.searchFormData.plateNum = item.value
    },
    reset() {
      this.searchFormData = {
        plateNum: '',
        startTime: '',
        endTime: ''
      }
      this.$nextTick(() => {
        this.$refs['searchForm'].clearValidate()
      })
    },
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap(defaultCenter) {
      this.lineArrlast = []
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: defaultCenter,
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })

      if (this.lineArr.length > 0) {
        for (let i = 0; i < this.lineArr.length; i++) {
          if (this.lineArr[i].length > 0) {
            this.lineArrlast.push(
              new AMap.LngLat(this.lineArr[i][1], this.lineArr[i][0])
            )
          }
        }
        this.initPolyline()
        // 计算轨迹播放时间
        this.time_variable = (this.polyline.getLength() / 1000 / (this.markerSpeed * this.speedCount)) * 60 * 60
      }
    },
    // 开始播放
    startmove() {
      const markerSpeed = this.markerSpeed * this.speedCount
      if (!this.showPause && this.begin) {
        this.marker.moveAlong(this.lineArrlast, markerSpeed)
        this.showPause = true
        this.begin = false
      } else if (this.showPause && !this.begin) {
        this.showPause = false
        this.marker.pauseMove()
      } else if (!this.showPause && !this.begin) {
        this.showPause = true
        this.marker.resumeMove()
      }
    },
    // 重新播放
    replayAnimation() {
      this.search()
      // this.speedCount = 1
      // this.markerSpeed = 100
      // const markerSpeed = this.markerSpeed * this.speedCount
      // this.perValue = 0
      // this.alreadyPercent = 0
      // this.showPause = true
      // this.begin = false
      // this.lineArrlast = this.lineArrCopy
      // this.marker.stopMove()

      // this.marker.moveAlong(this.lineArrlast, markerSpeed)
    },
    clearMap() {
      this.map.clearMap()
      this.lineArr = [[30.572903, 104.06632]]
      this.lineArrlast = []
      this.marker = null
      this.showPause = false
      this.begin = true
      this.perValue = 0
      this.speedCount = 1 // 目前选择的倍数
      this.markerSpeed = 100 // 初始化速度
      this.passedPolyline = null
      this.passedPath = 0 // 存放（播放时点击倍数）抓取到的位置
      this.curreGDPath = null // 存放（播放时点击倍数）抓取到的经纬度
      this.polyline = null // 轨迹线路
      this.alreadyPercent = 0
      this.tableData = []
      this.passedTimeTemp = 0
      this.passedTime = 0
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.clearMap()
          const { date, time } = this.searchFormData
          this.searchFormData.startTime = date + time[0]
          this.searchFormData.endTime = date + time[1]
          position({
            topic: this.topic,
            ...this.searchFormData
          })
            .then(res => {
              this.lineArr = []
              const { data } = res
              data.forEach(item => {
                const lat = item.latitude
                const lng = item.longitude
                this.lineArr.push([lat, lng])
                this.tableData.push({
                  status: item.acc === '0' ? 'ACC关闭' : 'ACC开启',
                  time: item.reportTime,
                  speed: item.speed,
                  positionDes: lng + ',' + lat
                })
              })
              if (data.length > 0) {
                this.getmap([data[0].longitude, data[0].latitude])
                this.setLine()
              }
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              throw err
            })
        }
      })
    },
    setLine() {
      if (this.lineArrlast.length > 0) {
        this.marker = new AMap.Marker({
          map: this.map,
          position: [this.lineArrlast[0].lng, this.lineArrlast[0].lat],
          icon: 'https://webapi.amap.com/images/car.png',
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle: -90
        })
      }
      this.marker.on('moving', (e) => {
        this.passedPolyline.setPath(e.passedPath)
        this.passedTime = ((this.passedPolyline.getLength()) / 1000 / (this.markerSpeed * this.speedCount)) * 60 * 60
        if ((((this.passedTime / this.time_variable) * 100) + this.alreadyPercent).toFixed(2) * 1 > 100) this.perValue = 100
        else this.perValue = (((this.passedTime / this.time_variable) * 100) + this.alreadyPercent).toFixed(2) * 1
        this.curreGDPath = new AMap.LngLat(
          e.passedPath[e.passedPath.length - 1].lng,
          e.passedPath[e.passedPath.length - 1].lat
        )
        this.passedPath = e.passedPath.length
      })
    },
    // 初始化回放路线
    initPolyline() {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArrlast,
        showDir: true,
        strokeColor: '#3366cc',
        strokeWeight: 6
      })
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: '#3366cc',
        strokeWeight: 6
      })
    },
    changeCount() {
      const markerSpeed = this.speedCount * this.markerSpeed
      this.time_variable = (this.polyline.getLength() / 1000 / markerSpeed) * 60 * 60
      this.passedPolylineLength = this.passedPolyline.getLength()
      if (this.perValue && this.perValue <= 100) {
        this.marker.pauseMove()
        this.lineArrlast = this.lineArrlast.slice(this.passedPath)
        this.lineArrlast.unshift(this.curreGDPath)
        this.polyline = new AMap.Polyline({
          map: this.map,
          path: this.lineArrlast,
          showDir: true,
          strokeColor: '#3366cc',
          strokeWeight: 6
        })
        this.marker.moveAlong(this.lineArrlast, markerSpeed)
        this.alreadyPercent = this.perValue
      }
    },
    getLocation(row) {
      let geocoder
      AMap.plugin('AMap.Geocoder', function() {
        geocoder = new AMap.Geocoder({ city: '', radius: 1000 })
      })
      const lnglat = row.positionDes.split(',')
      if (lnglat.length > 1) {
        geocoder.getAddress(lnglat, (status, result) => {
          const { regeocode } = result
          if (status === 'complete' && regeocode) {
            row.positionDes = regeocode.formattedAddress
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.contbtn {
  position: absolute;
  top: 3%;
  left: 3%;
  min-height: 130px;
  min-width: 200px;
  background: #304156;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}
.btncol {
  margin: 10px 0;
}
.search-box {
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}

#sbtn {
  position: relative;
  left: 185px;
  // left: 250px;
}

::v-deep .el-form-item__label {
  color: #fff !important;
}

.replay-box {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  padding-left: 10px;

  span {
    display: inline-block;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    margin-top: 1px;
  }

  div {
    display: inline-block;
    width: 230px;
  }
}

.check-box {
  padding-top: 10px;
  padding-left: 10px;
}

::v-deep .el-radio__label {
  padding-left: 3px !important;
  color: #fff;
}

::v-deep .el-radio {
  margin-right: 22px !important;
}

.play-box{
  padding: 7px 10px;
  background-color: #4ea1db;
  box-sizing: border-box;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;
}

.cancel-box {
  padding: 8px;
  background-color: #EF6A5D;
  box-sizing: border-box;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
}

.btns-box {
  position: relative;
  left: 230px;
  padding-top: 10px;
}

.play{
  border-style: solid;
  border-width: 8px 0 8px 12px;
  border-color: transparent transparent transparent #fff;
}

.pause{
  width: 20px;
  height: 15px;
  border-style: double;
  border-width: 0px 0px 0px 10px;
  border-color: #fff;
}

.cancel {
  height: 13px;
  width: 13px;
  background-color: #fff;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.bottom-table {
  width: 100%;
  height: 200px;
  position: absolute;
  bottom: 0;

}

.hidden-btn {
  color: #fff;
  position: relative;
  left: 49%;
  cursor: pointer;
  display: block;
}

::v-deep .amap-logo {
  display: none !important;
}

::v-deep .amap-copyright {
  display: none !important;
}

.expand-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color:  transparent transparent #0E1521 transparent;
  position: absolute;
  bottom: 0;
  left: 50%;
  cursor: pointer;
  // transition: left .3s;
}

.close-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent transparent #0E1521  transparent;
  position: absolute;
  bottom: 200px;
  left: 50%;
  cursor: pointer;
}

.bottom-arrow {
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #b4b5b6;
  border-right: 2px solid #b4b5b6;
  transform: rotate(45deg);
  position: relative;
  top: 30px;
  left: 10px;
}

.top-arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid #b4b5b6;
  border-left: 2px solid #b4b5b6;
  transform: rotate(45deg);
  position: relative;
  top: 35px;
  left: 10px;
}
</style>
