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
        <el-col :md="6">
          <i class="el-icon-truck icon" />
          <span class="text">川A12345</span>
          <span class="plate-text" :style="plateColor">黄</span>
        </el-col>
        <el-col :md="6">
          <i class="el-icon-sunrise icon color" />
          <span class="text color">超速报警 2级</span>
        </el-col>
        <el-col :md="6">
          <i class="el-icon-odometer icon" />
          <span class="text">69km/h</span>
        </el-col>
        <el-col :md="6">
          <i class="el-icon-time icon" />
          <span class="text">2021-11-18 00:01:56</span>
        </el-col>
        <el-col :md="6" class="col-spacing">
          <i class="el-icon-office-building icon" />
          <span class="text">巴中西慧物流有限公司</span>
        </el-col>
        <el-col :md="18" class="col-spacing">
          <i class="el-icon-s-grid icon" />
          <span class="text">起：31.925780,107.598943 止：32.3452780,107.386543</span>
        </el-col>
        <el-col :md="24" class="col-spacing">
          <i class="el-icon-map-location icon" />
          <span class="text">四川省乐山市峨眉山市S66隆汉高速乐山市公安局交警直属大队巡逻中队东288米</span>
        </el-col>
      </el-row>
      <div class="content">
        <div class="left">
          <el-tabs tab-position="bottom">
            <el-tab-pane label="报警视频">
              视频
            </el-tab-pane>
            <el-tab-pane label="报警图片">
              图片
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <div class="driver-info-card">
            <el-row>
              <el-col :md="12">
                <i class="el-icon-s-custom icon" />
                <span class="text">张三</span>
              </el-col>
              <el-col :md="12">
                <i class="el-icon-phone icon" />
                <span class="text">15982734564</span>
              </el-col>
              <el-col :md="24">
                <svg-icon icon-class="idcard" class="icon" />
                <span class="text">5125205464561325145</span>
              </el-col>
            </el-row>
          </div>
          <div id="mapContainer" class="map" />
          <div class="map-buttons">
            <el-button type="primary" plain size="mini">报警处理</el-button>
            <el-button type="primary" plain size="mini">证据导出</el-button>
            <el-button type="primary" plain size="mini">状态数据</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AlarmDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null, // 地图
      // 车牌颜色样式
      plateColor: { backgroundColor: '#FA8C16' }
    }
  },
  watch: {
    visible(n, o) {
      if (n) {
        this.$nextTick(() => {
          this.initialMap()
        })
      }
    }
  },
  mounted() {},
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$emit('close', false)
    },
    // 初始化地图
    initialMap() {
      this.map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12
      })
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
    color: #fff;
    display: inline-block;
    padding: 2px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-left: 5px;
    margin-bottom: -2px;
}
.color {
    color: red;
}
.col-spacing {
    margin-top: 10px;
}
.content {
    height: 500px;
    margin-top: 5px;

    .left {
        width: 50%;
        display: inline-block;
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
