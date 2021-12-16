<template>
  <el-dialog
    title="主动安全报警处理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    top="100px"
    custom-class="base-dialog min-width-dialog"
    :before-close="closeDialog"
  >
    <div>
      <el-row>
        <el-divider />
        <el-col :md="7">
          <i class="el-icon-truck icon" />
          <span class="text">{{ carInfo.plateNum }}</span>
          <span class="plate-text" :style="plateColor">{{ plateColorMap[carInfo.plateColorCode] }}</span>
        </el-col>
        <el-col :md="7">
          <i class="el-icon-sunrise icon color" />
          <span class="text color">{{ carInfo.cbArmName }}</span>
        </el-col>
        <el-col :md="4">
          <i class="el-icon-odometer icon" />
          <span class="text">{{ carInfo.startSpeed }}km/h</span>
        </el-col>
        <el-col :md="6">
          <i class="el-icon-time icon" />
          <span class="text">{{ carInfo.armTimeStart }}</span>
        </el-col>
        <el-col :md="12" class="col-spacing">
          <i class="el-icon-office-building icon" />
          <span class="text">{{ carInfo.unitName }}</span>
        </el-col>
        <el-col :md="12" class="col-spacing">
          <i class="el-icon-s-grid icon" />
          <span class="text">起：{{ carInfo.startPosition }} 止：{{ carInfo.endPosition }}</span>
        </el-col>
        <el-col :md="24" class="col-spacing">
          <i class="el-icon-map-location icon" />
          <span class="text">{{ carInfo.startLocation }}</span>
        </el-col>
      </el-row>
      <div class="content">
        <div class="left">
          <el-tabs tab-position="bottom">
            <el-tab-pane label="报警视频">
              <p v-if="videos.length === 0" class="none-file">本报警未上传视频附件</p>
              <!-- eslint-disable -->
              <div
                v-for="(item,index) in videos"
                v-else-if="videos.length > 1"
                :key="item.fs"
                class="alarm-videos"
              >
                <video
                  :id="'video' + index"
                  class="video-js"
                >
                  <source type="video/mp4" :src="item.downloadUrl">
                </video>
              </div>
              <!-- eslint-enable -->

              <div
                v-for="(item,index) in videos"
                v-else
                :key="item.fs"
                class="one-alarm-video"
              >
                <video
                  :id="'video' + index"
                  class="video-js one-vjs-fluid"
                >
                  <source type="video/mp4" :src="item.downloadUrl">
                </video>
              </div>
            </el-tab-pane>

            <el-tab-pane label="报警图片">
              <div v-if="images.length > 0" style="width:100%;height:100%;">
                <el-image
                  v-if="visible"
                  :src="currentImgSrc"
                  fit="fill"
                  style="width:100%;height:450px;"
                  :preview-src-list="preImages"
                />
                <i
                  class="el-icon-arrow-right arrow-icon right-arrow"
                  @click="switchImg('next')"
                />
                <i
                  class="el-icon-arrow-left arrow-icon left-arrow"
                  @click="switchImg('last')"
                />
                <el-pagination
                  background
                  layout="pager"
                  :total="images.length"
                  class="image-num"
                  :page-size="1"
                  small
                  :current-page="imgIndex + 1"
                  @current-change="handleChange"
                />
              </div>
              <p v-else class="none-file">本报警未上传图片附件</p>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <div class="driver-info-card">
            <el-row>
              <el-col :md="12">
                <i class="el-icon-s-custom icon" />
                <span class="text">{{ driverInfo.personName }}</span>
              </el-col>
              <el-col :md="12">
                <i class="el-icon-phone icon" />
                <span class="text">{{ driverInfo.tel }}</span>
              </el-col>
              <el-col :md="24">
                <svg-icon icon-class="idcard" class="icon" />
                <span class="text">{{ driverInfo.idCardNum }}</span>
              </el-col>
            </el-row>
          </div>
          <div id="mapContainer" class="map" />
          <div class="map-buttons">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="alarmHandle"
            >报警处理</el-button>
            <el-button type="primary" plain size="mini">证据导出</el-button>
            <el-button type="primary" plain size="mini">状态数据</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { findDriver } from '@/api/alarm-management/prevention-alarm'
import axios from 'axios'

// 字典
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'AlarmDetail',
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
      // 车牌颜色样式
      plateColor: {
        backgroundColor: '#FA8C16',
        color: '#000'
      },
      driverInfo: {
        idCardNum: '',
        tel: '',
        personName: ''
      }, // 驾驶员信息
      carInfo: {}, // 车辆信息
      plateColorMap: {}, // 车牌颜色对象
      colorList: {
        '蓝色': '#409EFF',
        '黄色': '#FA8C16',
        '黑色': '#000',
        '白色': '#fff',
        '绿色': '#42B983',
        '其他': '#ccc',
        '渐变绿色': '#42B983',
        '黄绿双拼': '#FA8C16'
      }, // 车牌颜色
      videos: [], // 报警视频
      images: [], // 报警图片
      preImages: [], // 预览图片
      currentImgSrc: '', // 当前展示的图片
      imgIndex: 0 // 当前展示图片的索引
    }
  },
  watch: {
    visible(n, o) {
      if (n) {
        this.$nextTick(() => {
          this.initialMap()
        })
      }
    },
    rows: {
      deep: true,
      handler(n) {
        if (n.length > 0) {
          this.carInfo = n[0]
          this.getDriverInfo()
          this.setPlateBackgroundColor()
          this.getAlarmInfomation()
        }
      }
    },
    images: {
      deep: true,
      handler(n) {
        this.preImages = []
        this.imgIndex = 0
        if (n.length > 0) {
          this.currentImgSrc = n[this.imgIndex].downloadUrl
          n.forEach(item => {
            this.preImages.push(item.downloadUrl)
          })
        }
      }
    },
    imgIndex(n) {
      if (this.images) this.currentImgSrc = this.images[n].downloadUrl
    }
  },
  created() {
    this.plateColorMap = onlineOption['车牌颜色编码'].map
  },
  methods: {
    // 设置车牌颜色背景色
    setPlateBackgroundColor() {
      const color = this.plateColorMap[this.carInfo.plateColorCode]
      this.plateColor.backgroundColor = this.colorList[color]
      color === '蓝色'
        ? this.plateColor.color = '#fff'
        : this.plateColor.color = '#000'
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
      this.videos = []
      this.images = []
      this.currentImgSrc = ''
      this.preImages = []
      this.imgIndex = 0
    },
    // 初始化地图
    initialMap() {
      this.map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12
      })
    },
    // 获取驾驶员信息
    getDriverInfo() {
      findDriver({ driverId: this.rows[0].driverId })
        .then(({ data }) => {
          this.driverInfo = data
        })
        .catch(err => {
          throw err
        })
    },
    // 报警处理
    alarmHandle() {
      this.$emit('handle-alarm')
    },
    // 获取报警片和视频
    getAlarmInfomation() {
      const row = this.rows[0]
      axios.get('https://www.api.gosmooth.com.cn/jsession/get?account=myyfb&password=MYYFB123')
        .then(res => {
          axios.get('https://www.api.gosmooth.com.cn/attach', {
            params: {
              jsession: res.data.jsession,
              toMap: 2,
              guid: row.guid,
              devIdno: row.deviceIdNo,
              alarmType: row.armType,
              begintime: row.armTimeStart
            },
            timeout: 10000
          })
            .then(({ data }) => {
              this.videos = data.vedios
              this.images = data.images
              this.initVideo()
            })
            .catch(err => {
              throw err
            })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '登录失败！'
          })
          throw err
        })
    },
    // 初始化视频方法
    initVideo() {
      if (this.videos.length > 0) {
        for (let index = 0; index < this.videos.length; index++) {
          setTimeout(() => {
            this.$video('video' + index, {
              controls: true,
              autoplay: 'muted',
              preload: 'auto',
              notSupportedMessage: '此视频暂无法播放，请稍后再试',
              aspectRatio: '4:3',
              playbackRates: [0.5, 1, 1.5, 2, 3],
              controlBar: {
                'currentTimeDisplay': true,
                'timeDivider': true,
                'durationDisplay': true,
                'remainingTimeDisplay': false
              }
            })
          })
        }
      }
    },
    // 点击箭头切换图片
    switchImg(val) {
      if (val === 'last' && this.imgIndex > 0) this.imgIndex--
      else if (val === 'next' && this.imgIndex < this.images.length - 1) this.imgIndex++
    },
    // 点击页码切换图片
    handleChange(val) {
      this.imgIndex = val - 1
    }
  }
}
</script>
<style scoped lang="scss">
.icon {
    font-size: 18px;
    margin-right: 5px;
}
.text {
    font-size: 15px;
    font-weight: 700;
}
.plate-text {
    // color: #fff;
    display: inline-block;
    padding: 2px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-left: 5px;
    margin-bottom: -2px;
}
.color {
  color: #FF7272;
}
.col-spacing {
    margin-top: 10px;
}
.content {
    height: 500px;
    margin-top: 5px;
    width: 100%;

    .left {
        width: 50%;
        display: inline-block;

        .alarm-videos {
          width: 50% !important;
          min-width: 175px !important;
          display: inline-block !important;
        }

        .one-alarm-video {
          width: 100% !important;
          min-width: 175px !important;
          // display: inline-block !important;
        }

        .arrow-icon {
          color:#fff;
          font-size:30px;
          font-weight: 700;
          cursor: pointer;
        }

        .left-arrow {
          position: absolute;
          right: 90%;
          top: 200px;
        }

        .right-arrow {
          position: absolute;
          right: 5%;
          top: 200px;
        }

        .image-num {
          position: absolute;
          bottom: 5px;
        }

        .none-file {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 220px;
          text-align: center;
        }
    }

    .right {
        width: 50%;
        height: 100%;
        display: inline-block;
        position: relative;

        .map-buttons {
            margin-top: 5px;
            display: flex;
            // justify-content: center;
        }

        .map {
            height:94%;
            width:100%;
        }

        .driver-info-card {
            box-sizing: border-box;
            padding: 5px 10px;
            width: 250px;
            height: 50px;
            background-color: #fff;
            box-shadow: 0px 0px 10px #808080;
            position: absolute;
            top: 5px;
            left: 10px;
            border-radius: 5px;
            z-index: 999;
        }
    }
}

.vjs-fluid {
  height: 224px !important;
}
.one-vjs-fluid {
  width: 100% !important;
  height: 455px !important;
}

::v-deep .el-dialog__body {
    padding: 10px 20px !important;
}
::v-deep .el-divider {
    margin-top: -10px !important;
    margin-bottom: 10px !important;
}
::v-deep .el-tabs__nav-scroll{
	width:50%;
	margin:0 auto -10px;
}
::v-deep .el-tabs__nav-wrap::after {
    height: 0 !important;
}
</style>
