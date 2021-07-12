<template>
  <div>
    <div id="container" class="map" :style="styleSize" />
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
      map: ''
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
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })
      this.map.setFitView()
    }
  }
}
</script>
