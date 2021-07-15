<template>
  <div class="container">
    <div id="container" class="map" :style="styleSize" />
    <div class="left-box">
      <div class="static-box">
        <div class="statistics-num">
          <span class="number">16015</span>
          <span class="text">入网车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">15001</span>
          <span class="text">上线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">5641</span>
          <span class="text">在线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">8</span>
          <span class="text">报警车辆</span>
        </div>
      </div>
      <div class="divide" />
      <el-input size="small" placeholder="请输入车牌号" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageMonitor',
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
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.left-box {
  width: 350px;
  height: 100%;
  background-color: #1C2F41;
  position: absolute;
  left: 0;
  top: 0;

  .divide {
    height: 1px;
    width: 100%;
    background-color: #fff;
    transform:scaleY(0.5)
  }
}

::v-deep .amap-logo {
  display: none !important;
}

::v-deep .amap-copyright {
  display: none !important;
}

.static-box {
  width: 100%;
  height: 90px;
  padding: 10px 0 0 10px;

  div {
    display: inline-block;
  }
}

  .statistics-num {
    display: flex;
    flex-direction: column;
    margin: 10px;

    span {
      display: block;
      color: #ccc;
      text-align: center;
    }

    .number {
      font-size: 25px;
      margin-bottom: 3px;
    }

    .text {
      font-size: 12px;
    }
}

</style>
