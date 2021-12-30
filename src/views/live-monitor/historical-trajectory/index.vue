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
          <el-form-item label="车牌信息:" prop="plateNum">
            <el-autocomplete
              ref="autocomplete"
              v-model="searchFormData.plateNum"
              size="small"
              placeholder="请输入车牌号"
              clearable
              :fetch-suggestions="searchType"
              :debounce="500"
              style="width:220px;"
              @select="selectPlateNum"
              @clear="setBlur"
            />
          </el-form-item>
          <el-form-item label="开始时间:" prop="startTime">
            <el-date-picker
              v-model="searchFormData.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="startPickerOptions"
            />
          </el-form-item>
          <el-form-item label="结束时间:" prop="endTime">
            <el-date-picker
              v-model="searchFormData.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="endPickerOptions"
              :disabled="disabled"
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
      <div :class="[showTable ? 'close-arrow' : 'expand-arrow']" />
    </div>
    <div v-show="showTable" class="table-box">
      <Table
        ref="tableList"
        :start-time="searchFormData.startTime"
        :end-time="searchFormData.endTime"
        :vehicle-id="vehicleId"
      />
    </div>
  </div>
</template>
<script>
import { position, findPlateNum } from '@/api/live-monitor/history'
import Table from './components/table.vue'

const plateColorMap = JSON.parse(localStorage.getItem('onlineOption'))['车牌颜色编码'].map

export default {
  name: 'HistoricalTrajectory',
  components: { Table },
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
        time: [],
        pageNum: 1,
        pageSize: 20
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
        startTime: [{ required: true, message: '请选择查询日期', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择时间范围', trigger: 'change' }]
      },
      time_variable: 0,
      vehicleId: '', // 搜索车辆的 ID
      // 开始时间限制
      startPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > new Date().getTime()
        }
      },
      // 结束时间限制
      endPickerOptions: {
        disabledDate: (time) => {
          const stime = this.searchFormData.startTime
          if (time) {
            const st = Date.parse(stime.replace(/-/g, '/'))
            return time.getTime() > st + 86400000 || time.getTime() < st - 0
          }
        }
      },
      // 未选择开始时间则禁用结束时间选择
      disabled: true
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    'searchFormData.startTime': {
      deep: true,
      handler(n, o) {
        if (n) this.disabled = false
      }
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
    // 模糊查询
    searchType(queryString, cb) {
      if (queryString) {
        findPlateNum({ plateNum: queryString })
          .then(res => {
            const { data } = res
            const searchData = []
            data.forEach(item => {
              searchData.push({
                label: item.plateNum,
                value: item.plateNum + '\xa0\xa0\xa0' + plateColorMap[item.plateColor],
                id: item.vehicleId
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
    // 选择车牌联想
    selectPlateNum(item) {
      this.searchFormData.plateNum = item.value
      this.vehicleId = item.id
    },
    // 重置搜索条件
    reset() {
      this.searchFormData = this.$options.data().searchFormData
      this.$nextTick(() => {
        this.$refs['searchForm'].clearValidate()
      })
    },
    // 获取窗口高度
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
    // 模糊查询存在 bug，点击清空后，再输入内容不显示联想词，需先失去焦点，再对焦
    setBlur() {
      document.activeElement.blur()
      this.$refs.autocomplete.focus()
    },
    // 点击查询
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.tableData = []
          this.clearMap()
          this.getAllPosition()
          this.$refs.tableList.$emit('clear-data')
          this.$refs.tableList.getTableData()
        }
      })
    },
    // 获取所有点位信息数据，用于绘制轨迹
    getAllPosition() {
      this.loading = true
      position({
        vehicleId: this.vehicleId,
        startTime: this.searchFormData.startTime,
        endTime: this.searchFormData.endTime
      })
        .then(res => {
          this.lineArr = []
          const { data } = res
          data.forEach(item => {
            this.lineArr.push([item.latitude, item.longitude])
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
    },
    // 绘制轨迹
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
    // 初始化回放路线组件
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
    // 改变播放倍速
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
.search-box {
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}

#sbtn {
  position: relative;
  left: 185px;
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

.table-box {
  width: 621px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
}

.expand-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color:  transparent #b4b5b6 transparent  transparent;
  position: absolute;
  top: 50%;
  right: 0;
  cursor: pointer;
}

.close-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent #b4b5b6 transparent   transparent;
  position: absolute;
  top: 50%;
  right: 621px;
  cursor: pointer;
}

.close-arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid #0E1521;
  border-right: 2px solid #0E1521;
  transform: rotate(45deg);
  position: relative;
  top: 10px;
  left: 30px;
}

.expand-arrow {
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #0E1521;
  border-left: 2px solid #0E1521;
  transform: rotate(45deg);
  position: relative;
  top: 10px;
  left: 35px;
}
</style>
