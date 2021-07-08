<template>
  <div class="trackquery">
    <div id="container" class="map" :style="styleSize" />
    <div v-if="lineArr.length > 0" class="contbtn">
      <div class="flex-demo">
        <el-button v-if="startshow" class="btncol" type="primary" @click="starmove">开始动画</el-button>
        <div class="flex-demo">
          <el-button v-if="endshow ==true" :disabled="btndisabled" class="btncol" type="danger" @click="endmove">暂停播放</el-button>
          <el-button v-if="endshow ==false" :disabled="btndisabled" class="btncol" type="success" @click="resumeAnimation">继续播放</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'MonitorHome',
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
      k: 0
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
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap() {
      //  测试数据
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
                strokeColor: colors[currentLen], // 线颜色
                strokeWeight: 6 // 线宽
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
              var passedPolyline = new AMap.Polyline({
                map: this.map,
                strokeColor: '#AF5', // 线颜色
                strokeOpacity: 1, // 线透明度
                strokeWeight: 6 // 线宽
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
    starmove() {
      this.endshow = true
      this.startshow = true
      this.btndisabled = false
      this.marker.moveAlong(this.lineArrlast, 1200)
    },
    // 暂停播放
    endmove() {
      this.endshow = false
      this.marker.pauseMove()
    },
    // 继续播放
    resumeAnimation() {
      this.endshow = true
      this.marker.resumeMove()
    },
    // 停止播放
    stopAnimation() {
      this.marker.stopMove()
    } }}
</script>
<style scoped>
.contbtn {
  position: fixed;
  top: 15%;
  left: 12%;
  min-height: 130px;
  min-width: 200px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btncol {
  margin: 10px 0;
}
</style>
