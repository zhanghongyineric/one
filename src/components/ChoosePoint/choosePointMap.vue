<template>
  <!--弹窗中的地图，使用时直接引用choosePoint组件-->
  <div class="choose-point-map">
    <div id="choose-point-container" class="content" />
    <div class="search-box-account">
      <div class="disabled-con">
        <AreaSelect
          v-model="infos.areaCode"
          size="small"
          :area-text.sync="infos.areaText"
        />
        <div class="disabled" />
      </div>
      <el-input
        id="search"
        v-model="searchKey"
        type="search"
        class="address"
      />
      <el-button type="primary" @click="choosePoint">确定</el-button>
    </div>
  </div>
</template>

<script>
import MapLoader from '@/utils/amap'
import AreaSelect from '@/components/AreaSelect'
export default {
  name: 'ChoosePointMap',
  components: { AreaSelect },
  props: {
    infos: {
      type: Object
    }
  },
  data: function() {
    return {
      map: null, // 实例化的地图
      AMap: null, // AMap构造函数
      poiPicker: null, // 地址自动补全组件
      searchKey: '',
      address: '',
      lng: '',
      lnt: '',
      center: [103.9, 30.4],
      city: '',
      infoWindow: null,
      marker: null
    }
  },
  watch: {
    // 监听区域变化
    'infos.areaCode': function(code) {
      this.map.clearMap()
      this.city = this.getCityCode(code)
      this.poiPicker.setCity(this.city)
    },
    // 监听地址、经纬度变化
    infos: function(infos, old) {
      if (infos.address !== old.address) {
        this.searchKey = this.address = infos.address
        this.lng = infos.longitude
        this.lat = infos.latitude
        this.setCenter()
      }
    },
    searchKey: function() {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
    }
  },
  created() {
    // 设置接收到的基础数据
    const code = this.infos.areaCode
    this.city = this.getCityCode(code)
    this.searchKey = this.address = this.infos.address
    this.lng = this.infos.longitude
    this.lat = this.infos.latitude
  },
  mounted() {
    MapLoader().then(AMap => {
      this.AMap = AMap
      // console.log('地图加载成功')
      this.map = new AMap.Map('choose-point-container', {
        resizeEnable: true,
        zoom: 15, // 级别
        center: this.center
      })
      AMapUI.loadUI(['misc/PoiPicker'], PoiPicker => {
        this.poiPicker = new PoiPicker({
          input: 'search',
          autocompleteOptions: {
            city: '北京',
            citylimit: true,
            datatype: 'poi'
          },
          placeSearchOptions: {
            map: this.map,
            pageSize: 10,
            city: '北京',
            citylimit: true
          }
        })
        // 点击自动补全的点
        this.poiPicker.on('poiPicked', poiResult => {
          const source = poiResult.source
          const poi = poiResult.item
          if (source === 'suggest') {
            const lng = poi.location.lng
            const lat = poi.location.lat
            const address = poi.district + poi.name
            this.center = [lng, lat]
            this.lng = lng
            this.lat = lat
            this.address = address
            this.searchKey = address
            this.marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
              offset: new AMap.Pixel(-10, -10),
              title: address
            })
            this.map.clearMap()
            this.map.add(this.marker)
            this.map.setCenter(this.center)
            this.map.setZoom(17)

            // 信息窗体的内容
            const content = `<div style="border-bottom: 1px solid #ddd">${poi.name}</div>
                           <div>地址 : ${poi.district}${poi.address}</div>`
            // 创建 infoWindow 实例
            this.infoWindow = new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -15),
              content: content
            })
            // 打开信息窗体
            this.infoWindow.open(this.map, [lng, lat])
          } else if (source === 'search') {
            if (this.marker) {
              this.map.remove(this.marker)
            }
            const lng = poi.location.lng
            const lat = poi.location.lat
            const address = poi.cityname + poi.adname + poi.name
            this.center = [lng, lat]
            this.lng = lng
            this.lat = lat
            this.address = address
            this.searchKey = address
          }
        })
        // 设置限定区域
        const timer = setInterval(() => {
          if (this.poiPicker) {
            this.poiPicker.setCity(this.city)
            this.setCenter()
            clearInterval(timer)
          }
        }, 500)
      })
    }, e => {
      // console.log('地图加载失败', e)
    })
  },
  methods: {
    // 手动搜索
    // searchByHand() {
    //   this.poiPicker.searchByKeyword(this.searchKey)
    // },
    // 点击确定
    choosePoint() {
      // 新建时，未选择地址
      if (!this.address) {
        this.$message({
          message: '请选择地址',
          type: 'warning'
        })
        return
      }
      // 修改时未选择地址
      if (this.address === this.infos.address) {
        this.$confirm('未选择地址，确定使用原地址吗？')
          .then(_ => {
            this.$emit('closeMap')
          })
          .catch(_ => {})
        return
      }
      // 选择地址，将数据传会组件
      const infos = this.infos
      infos.address = this.address
      infos.longitude = this.lng
      infos.latitude = this.lat
      this.$emit('choosePoint', infos)
      this.$emit('closeMap')
    },
    // 根据接收到的行政区域，返回要限定的行政区域
    getCityCode(code) {
      let city = ''
      if (!code) return
      if (code.length === 1) {
        city = code[0]
      } else if (code.length > 1 && code[1] === '') {
        city = code[0]
      } else if (code.length > 1 && code[1] !== '') {
        city = code[1]
      }
      return city
    },
    // 设置中心点、放缩、当前选中的点
    setCenter() {
      if (this.lng && this.lat) {
        this.marker = new this.AMap.Marker({
          position: [this.lng, this.lat], // 基点位置
          offset: new this.AMap.Pixel(0, 0), // 设置点标记偏移量
          anchor: 'bottom-left', // 设置锚点方位
          title: this.infos.address
        })
        this.map.setCenter([this.lng, this.lat])
        this.map.add(this.marker)
      }
      this.map.setZoom(17)
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-point-map {
  height: 100%;
  width: 100%;
  position: relative;
  .content {
    height: 100vh;
    width: 100%;
  }
  .search-box-account {
    position: absolute;
    z-index: 5;
    width: 70%;
    left: 13%;
    top: 10px;
    height: 30px;
    display: flex;
    .disabled-con {
      position: relative;
      .disabled {
        position: absolute;
        top: 0;
        right: 0;
        bottom: -10px;
        left: 0;
        background-color: rgba(0,0,0,.1);
        border-radius: 5px;
      }
    }
    .el-cascader--small {
      max-width: 300px;
      flex: 1;
    }

    .el-button {
      margin-top: 2px;
      height: 36px;
    }

    .address {
      margin: 0 10px;
      flex: 1;
      min-width: 100px;
    }

    .tip-box {
      width: 100%;
      max-height: 260px;
      position: absolute;
      top: 40px;
      overflow-y: auto;
      background-color: #fff;
    }

    ::v-deep.el-input--small .el-input__inner {
      line-height: 40px;
      height: 40px;
      width: 300px !important;
    }
  }
}
</style>
