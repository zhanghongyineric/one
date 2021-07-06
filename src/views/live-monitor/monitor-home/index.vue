<template>
  <div class="container">
    <el-amap :vid="'amap-vue'" :map-style="mapStyle" />
  </div>
</template>

<script>
import VueAMap from 'vue-amap'

export default {
  name: 'MonitorHome',
  data() {
    return {
      msg: 'vue-amap',
      mapStyle: 'amap://styles/grey'
    }
  },
  created() {
    // 初始化地图
    VueAMap.initAMapApiLoader({
      key: 'amap_key',
      plugin: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.ToolBar',
        'AMap.MapType',
        'AMap.PolyEditor',
        'AMap.CircleEditor'
      ],
      v: '1.4.4'
    })
  }
}
</script>

<style lang="scss" scoped>
.el-vue-amap-container {
  height: calc(100vh - 85px) !important;
}

::v-deep .amap-logo{
  display: none !important;
}

::v-deep  .amap-copyright {
  display: none !important;
}
</style>>
