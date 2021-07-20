<template>
  <div class="container">
    <div id="container" class="map" :style="styleSize" />
    <div v-if="lineArr.length > 0" class="contbtn">
      <div class="search-box">
        <el-form
          ref="searchForm"
          :model="searchFormData"
          label-width="80px"
        >
          <el-form-item label="车牌号码:">
            <el-input v-model="searchFormData.plateNum" size="small" placeholder="请输入车牌号" clearable />
          </el-form-item>
          <el-form-item label="起始时间:">
            <el-date-picker
              v-model="searchFormData.startTime"
              type="datetime"
              placeholder="选择开始日期时间"
              size="small"
            />
          </el-form-item>
          <el-form-item label="结束时间:">
            <el-date-picker
              v-model="searchFormData.endTime"
              size="small"
              type="datetime"
              placeholder="选择结束日期时间"
            />
          </el-form-item>

        </el-form>
        <el-button id="sbtn" type="primary" size="small" @click="search">查询</el-button>
        <div class="replay-box">
          <span>回放进度：</span>
          <el-progress :text-inside="true" :stroke-width="15" :percentage="value" />

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
    <div class="bottom-table">
      <!-- <span class="hidden-btn">隐藏</span> -->
      <el-table
        :data="tableData"
        style="width: 100%;height:100%;"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="status" label="车辆状态" min-width="120" align="center" />
        <el-table-column prop="time" label="上报时间" min-width="120" align="center" />
        <el-table-column prop="km" label="GPS里程(公里)" min-width="120" align="center" />
        <el-table-column prop="speed" label="速度(km/h)" min-width="120" align="center" />
        <el-table-column prop="positionDes" label="位置描述" min-width="120" align="center" />
      </el-table>
    </div>
  </div>
</template>
<script>
import { position } from '@/api/live-monitor/history'
import connect from '@/utils/mqtt'

export default {
  name: 'HistoricalTrajectory',
  data() {
    return {
      styleSize: {
        height: '',
        width: ''
      },
      searchFormData: {
        plateNum: ''
      },
      map: null,
      lineArr: [],
      lineArrlast: [],
      marker: null,
      showPause: false,
      begin: true,
      value: 0,
      speedCount: 1, // 目前选择的倍数
      progressTime: 0, // 时间
      palyStayus: 0, // 0->未开始  1->行驶中  2->暂停
      speedList: [1, 5, 10, 20, 50], // 倍数数据
      markerSpeed: 100, // 初始化速度
      passedPolyline: null,
      positionIndex: [], // 轨迹起始点--车辆所在的位置
      passedPath: 0, // 存放（播放时点击倍数）抓取到的位置
      int: null, // 定时器--进度条
      timeInt: null, // 定时器--时间
      curreGDPath: null, // 存放（播放时点击倍数）抓取到的经纬度
      polyline: null, // 轨迹线路
      passedArr: [],
      lineArrCopy: [],
      tableData: [
        {
          status: 'ACC:ON',
          time: '2021-07-11 08:17:34',
          km: '20.1',
          speed: '85.1',
          positionDes: '四川省雅安市天全县二郎山罗家饭店东北53米'
        }
      ],
      topic: ''
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  created() {
    this.getHeight()
    // 拼接连接主题topic
    this.topic = this.token + '/private/' + 'position'
  },
  mounted() {
    this.getmap()
    // 事件监听，实时获取屏幕宽高
    window.addEventListener('resize', this.getHeight)
    this.connectMqtt()
  },
  methods: {
    switchPlay() {
      this.showPause = !this.showPause
    },
    connectMqtt() {
      this.client = connect()
      this.client.on('connect', () => {
        this.client.subscribe(
          this.topic, // 订阅主题
          { qos: 2 }, // 保证消息传递次数
          (err) => {
            console.log(err || '订阅成功')
          }
        )
      })
      // 失败重连
      this.client.on('reconnect', (error) => {
        console.log('正在重连:', error)
      })
      // 连接失败
      this.client.on('error', (error) => {
        console.log('连接失败:', error)
      })
      // 接收消息
      this.client.on('message', (topic, message) => {
        console.log('收到消息：', message.toString())
      })
    },
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap() {
      // 测试数据
      this.lineArr = [
        [30.572903, 104.06632],
        [30.572713, 104.06632],
        [30.572513, 104.06632],
        [30.572313, 104.06632],
        [30.572113, 104.06632],
        [30.572113, 104.06629],
        [30.572113, 104.06619],
        [30.572113, 104.06609],
        [30.572113, 104.06599],
        [30.572113, 104.06589],
        [30.572113, 104.06579],
        [30.572113, 104.06569],
        [30.572113, 104.06559],
        [30.572113, 104.06549],
        [30.572113, 104.06539],
        [30.572113, 104.06529],
        [30.572113, 104.06519],
        [30.572113, 104.06509],
        [30.572113, 104.06499],
        [30.572113, 104.06489],
        [30.572113, 104.06479],
        [30.572113, 104.06469],
        [30.572113, 104.06459],
        [30.572113, 104.06449],
        [30.572113, 104.06439],
        [30.572113, 104.06429],
        [30.572113, 104.06419],
        [30.572113, 104.06409]
      ]
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
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
        this.lineArrCopy = this.lineArrlast
        this.initPolyline()
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
          this.curreGDPath = new AMap.LngLat(
            e.passedPath[e.passedPath.length - 1].lng,
            e.passedPath[e.passedPath.length - 1].lat
          )
          this.passedPath = e.passedPath.length
        })
      }
      this.map.setFitView()
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
      this.speedCount = 1
      const markerSpeed = this.markerSpeed * this.speedCount
      this.showPause = true
      this.begin = false
      this.lineArrlast = this.lineArrCopy
      this.marker.stopMove()
      this.marker.moveAlong(this.lineArrlast, markerSpeed)
    },
    search() {
      position({
        plateNum: '川A12345',
        topic: this.topic,
        time: '2021-7-15 15:05:51'
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          throw err
        })
    },
    // 初始化回放路线
    initPolyline() {
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArrlast,
        showDir: true,
        strokeColor: '#3366cc', // 线颜色
        strokeWeight: 6 // 线宽
      })
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: '#AF5', // 线颜色
        strokeWeight: 6 // 线宽
      })
    },
    changeCount() {
      const markerSpeed = this.speedCount * this.markerSpeed
      this.marker.pauseMove()
      this.lineArrlast = this.lineArrlast.slice(this.passedPath)
      this.lineArrlast.unshift(this.curreGDPath)
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArrlast,
        showDir: true,
        strokeColor: '#3366cc', // 线颜色
        strokeWeight: 6 // 线宽
      })
      this.marker.moveAlong(this.lineArrlast, markerSpeed)
    }
  }
}
</script>
<style scoped lang="scss">
.contbtn {
  position: fixed;
  top: 15%;
  left: 12%;
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
  left: 240px;
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
    width: 220px;
  }
}

.check-box {
  padding-top: 10px;
  padding-left: 10px;
}

::v-deep .el-radio__label {
  padding-left: 1px !important;
  color: #fff;
}

::v-deep .el-radio {
  margin-right: 22px !important;
}

.play-box{
  padding: 7px 10px;
  background-color: #409EFF;
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
  left: 200px;
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
</style>
