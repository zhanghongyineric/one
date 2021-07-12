<template>
  <div>
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
          <el-progress :text-inside="true" :stroke-width="15" :percentage="70" />

        </div>
        <div class="check-box">
          <el-radio v-model="playSpeed" label="1">×1</el-radio>
          <el-radio v-model="playSpeed" label="5">×5</el-radio>
          <el-radio v-model="playSpeed" label="10">×10</el-radio>
          <el-radio v-model="playSpeed" label="20">×20</el-radio>
          <el-radio v-model="playSpeed" label="50">×50</el-radio>
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
  </div>
</template>
<script>

export default {
  name: 'HistoricalTrajectory',
  data() {
    return {
      styleSize: {
        height: '',
        width: ''
      },
      btndisabled: true,
      startshow: true,
      endshow: true,
      map: '',
      lineArr: [],
      lineArrlast: [],
      lineArrPre: [],
      marker: '',
      searchFormData: {
        plateNum: '川A12345'
      },
      playSpeed: '1',
      showPause: false,
      begin: true,
      speed: 100
    }
  },
  created() {
    // 事件监听，实时获取屏幕宽高
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  mounted() {
    this.getmap()
  },
  methods: {
    switchPlay() {
      this.showPause = !this.showPause
    },
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap() {
      // 测试数据
      this.lineArr = [
        '30.572903,104.06632|30.572803,104.06612|30.572703,104.07632|30.571903,104.04632|30.562903,104.10632'
      ]
      // eslint-disable-next-line no-unused-vars
      let polylineX,
        nColorLength,
        currentLen,
        latlonarr,
        pointList
      const colors = [
        '#3366cc',
        '#dc3912',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#316395',
        '#994499',
        '#22aa99',
        '#6633cc',
        '#329262',
        '#5574a6',
        '#3b3eac'
      ]
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })
      if (this.lineArr.length > 0) {
        for (let j = 0; j < this.lineArr.length; j++) {
          polylineX = 'polyline' + j // 计算取颜色的函数
          nColorLength = colors.length
          currentLen = 0
          if (j > nColorLength) {
            currentLen = j % 14
          } else {
            currentLen = j
          }
          latlonarr = this.lineArr[j].split('|')
          if (latlonarr.length > 0) {
            if (j < this.lineArr.length - 1) {
              this.lineArrPre = []
              for (let i = 0; i < latlonarr.length; i++) {
                pointList = latlonarr[i].split(',')
                if (pointList.length > 0) {
                  this.lineArrPre.push(
                    new AMap.LngLat(pointList[1], pointList[0])
                  )
                }
              }
              polylineX = new AMap.Polyline({
                map: this.map,
                path: this.lineArrPre,
                showDir: true,
                strokeColor: colors[currentLen], // 线颜色
                strokeWeight: 3 // 线宽
              })
            } else {
              // 最后一条轨迹绘制移动轨迹
              for (let i = 0; i < latlonarr.length; i++) {
                pointList = latlonarr[i].split(',')
                if (pointList.length > 0) {
                  this.lineArrlast.push(
                    new AMap.LngLat(pointList[1], pointList[0])
                  )
                }
              }
              polylineX = new AMap.Polyline({
                map: this.map,
                path: this.lineArrlast,
                showDir: true,
                strokeColor: colors[currentLen],
                strokeWeight: 3
              })
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
              const passedPolyline = new AMap.Polyline({
                map: this.map,
                strokeColor: '#AF5', // 线颜色
                strokeOpacity: 1, // 线透明度
                strokeWeight: 3 // 线宽
              })
              this.marker.on('moving', function(e) {
                passedPolyline.setPath(e.passedPath)
              })
            }
          }
        }
      }
      this.map.setFitView()
    },
    // 开始播放
    startmove() {
      if (!this.showPause && this.begin) {
        this.marker.moveAlong(this.lineArrlast, this.speed)
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
      this.showPause = true
      this.begin = false
      this.marker.stopMove()
      this.marker.moveAlong(this.lineArrlast, this.speed)
    },
    search() {
      this.speed = 1200
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
</style>
