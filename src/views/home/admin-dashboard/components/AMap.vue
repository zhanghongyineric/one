<!--
  - FileName: AMap.vue
  - @author: ZhouJiaXing
  - @date: 2021/4/19 下午1:49
  -->

<template>
  <div style="height: 100%;width: 100%;">
    <div id="container" class="content" />
    <div ref="infoWindow" class="point-info">
      <p><b>企业性质：</b>{{ currInfo.unitCategory ? currInfo.unitCategory : '-' }}</p>
      <p><b>企业名称：</b>{{ currInfo.unitName ? currInfo.unitName : '-' }}</p>
      <p><b>车辆数量：</b>{{ currInfo.vehicleAll ? currInfo.vehicleAll : 0 }}辆</p>
      <p><b>联系电话：</b>{{ currInfo.unitTel ? currInfo.unitTel : '无' }}</p>
      <div v-if="currInfo.safeLevelWeightId === 4">
        <span class="type red">高风险</span>
        <div class="code-con">
          <svg-icon class="info-code" icon-class="code" :style="{color: colors.red}" />
        </div>
      </div>
      <div v-if="currInfo.safeLevelWeightId === 3">
        <span class="type yellow">较高风险</span>
        <div class="code-con">
          <svg-icon class="info-code" icon-class="code" :style="{color: colors.yellow}" />
        </div>
      </div>
      <div v-if="currInfo.safeLevelWeightId === 2">
        <span class="type blue">一般风险</span>
        <div class="code-con">
          <svg-icon class="info-code" icon-class="code" :style="{color: colors.blue}" />
        </div>
      </div>
      <div v-if="currInfo.safeLevelWeightId === 1">
        <span class="type green">低风险</span>
        <div class="code-con">
          <svg-icon class="info-code" icon-class="code" :style="{color: colors.green}" />
        </div>
      </div>
      <div class="more">
        <span @click="showDetails(currInfo.unitId)">更多</span>
      </div>
    </div>
  </div>

</template>
<script>
import MapLoader from '../../../../utils/amap.js'
import { colors } from '@/options'
export default {
  name: 'GaodeMap',
  props: {
    mapInfos: {
      type: Array
    }
  },
  data() {
    return {
      AMap: null,
      map: null,
      infoWindow: null,
      markers: [],
      currInfo: {},
      colors: colors,
      center: [103.99996, 30.497646]
    }
  },
  watch: {
    mapInfos: function(newV) {
      this.setMarkers(newV)
    }
  },
  mounted() {
    MapLoader().then(AMap => {
      this.AMap = AMap
      // console.log('地图加载成功')
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 11, // 级别
        viewMode: '3D', // 使用3D视图
        mapStyle: 'amap://styles/whitesmoke',
        center: this.center
      })
      this.map.on('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close()
        }
      })
      this.setMarkers(this.mapInfos)
    }, e => {
      // console.log('地图加载失败', e)
    })
  },
  methods: {
    setMarkers(infos) {
      // console.log(infos)
      if (this.markers && this.markers.length) {
        this.map.remove(this.markers)
      }
      const markers = []
      // const basePosition = [103.99996, 30.497646]
      // content添加相应的内容**********

      if (infos.length > 0) {
        try {
          this.map.setCenter([infos[0].longitude, infos[0].latitude])
        } catch (e) {
          console.log('设置中心点失败（无坐标）')
        }
      }
      for (let i = 0; i < infos.length; i++) {
        if (infos[i].latitude && infos[i].longitude) {
          let icon = './icon/green.png'
          const status = infos[i].safeLevelWeightId
          // 判断图标icon
          if (status === 2) {
            icon = './icon/blue.png'
          } else if (status === 3) {
            icon = './icon/yellow.png'
          } else if (status === 4) {
            icon = './icon/red.png'
          }
          const position = [infos[i].longitude, infos[i].latitude]
          infos[i].position = position
          var marker = new this.AMap.Marker({
            position: new this.AMap.LngLat(...position),
            icon,
            extData: infos[i]
          })
          markers.push(marker)
          // console.log('添加图标成功')
        }
      }

      // for (let i = 0, len = markers.length; i < len; i++) {
      //   markers[i].on('click', e => {
      //     this.showInfoWindow(markers[i].getExtData())
      //     this.currInfo = markers[i].getExtData()
      //   })
      // }
      this.markers = markers
      this.$nextTick(() => {
        this.map.add(markers)
      })
    },
    showInfoWindow(info) {
      const content = this.$refs.infoWindow
      // 创建 infoWindow 实例
      this.infoWindow = new this.AMap.InfoWindow({
        content: content,
        anchor: 'bottom-center',
        offset: new this.AMap.Pixel(0, -50)
      })

      // 打开信息窗体
      this.infoWindow.open(this.map, info.position)
    },
    showDetails(id) {
      // 跳转页面
      this.$router.push({
        // path: '/safe-code/apply',
        path: `company-manage/detail/company/${id}`
        // params: { id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
}
</style>
<style lang="scss">
@import "../../../../styles/variables";
.content {
  .amap-info-sharp {
    display: none;
  }
  .amap-info-contentContainer.bottom-center {
    border-radius: 5px;
    overflow: hidden;
    padding-bottom: 0;

    .point-info {
      font-size: 13px;
      p {
        margin: 3px 0;
      }
      .type {
        display: inline-block;
        color: #8b0000;
        transform: rotate(-30deg);
        height: 30px;
        width: 110px;
        font-size: 25px;
        vertical-align: 30px;
        text-shadow: #999 1px 0 10px;
      }
      .red {
        color: $red;
      }
      .yellow {
        color: $yellow;
      }
      .blue {
        color: $blue;
      }
      .green {
        color: $green;
      }

      .code-con {
        color: red;
        display: inline-block;
        text-align: center;
      }

      .info-code {
        width: 80px;
        height: 80px;
        color: red;
      }
      .more {
        color: #0A93F2;
        font-size: 14px;
        text-align: right;
        padding-top: 10px;
        span {
          cursor: pointer;
          padding: 10px 0 10px 10px;
        }
      }
    }

    .amap-info-close {
      background-color: #5a5e66;
      color: #fff;
      border-radius: 50%;
      right: 5px !important;
      text-align: center;
      height: 15px;
      width: 15px;
    }
  }

  .amap-logo, .amap-copyright {
    display: none !important;
  }
}
</style>
