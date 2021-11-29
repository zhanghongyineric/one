<template>
  <div :style="{height,width}">
    <div ref="map" :class="className" style="width:100%;height:100%;" @click.right="mounseRightClick" />
    <img v-show="showReturn" src="../../assets/return.png" class="return" @click="mounseRightClick">
  </div>

</template>
<script>
import * as echarts from 'echarts'
import chartResize from './chart-resize'
import sichuan from '@/utils/mapJson/sichuan.json'
import citysCode from '@/utils/mapJson/citysCode.js'
import { cityVehicle, platformName } from '@/api/home'

export default {
  mixins: [chartResize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '70%'
    },
    mapData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      mapDataMap: new Map(),
      timer: null,
      showReturn: false
    }
  },
  computed: {
    // 账号所属地区 id
    unitId() {
      return this.$store.state.user.unitId
    },
    // 账号角色
    roleName() {
      return this.$store.state.user.roleName
    }
  },
  watch: {
    mapData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
        clearInterval(this.timer)
        this.timer = null
        let index = 0
        if (this.mapData) {
          const { length } = this.mapData
          this.timer = setInterval(() => {
            if (this.chart) {
              this.chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: index
              })
              this.chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: index
              })
            }
            setTimeout(() => {
              for (let i = 0; i < length + 1; i++) {
                if (i !== index) {
                  if (this.chart) {
                    this.chart.dispatchAction({
                      type: 'downplay',
                      seriesIndex: 0,
                      dataIndex: i
                    })
                  }
                }
              }
            }, 2700)
            index++
            if (index > length) index = 0
          }, 3000)
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.roleName !== '平台管理员') this.initChart(sichuan)
      else this.getCityName()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(dataJson) {
      echarts.registerMap('四川', dataJson)
      this.chart = echarts.init(this.$refs.map)
      this.setOptions(this.chartData)
      // 移除点击事件
      this.chart.off('click')
      // 添加点击事件
      this.chart.on('click', params => {
        console.log(params)
        const code = citysCode[params.name]
        if (code) {
          if (params.data) {
            this.getCityData(params.data.deptId)
            this.getMapJson(code)
            this.showReturn = true
          } else {
            this.$message({
              type: 'warning',
              message: '该地区暂无数据'
            })
          }
        }
      })
    },
    returnUpper() {

    },
    setOptions() {
      this.chart.setOption({
        series: [{
          type: 'map',
          mapType: '四川',
          selectedMode: false,
          label: {
            show: true,
            normal: {
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              textStyle: {
                color: '#24292e'
              }
            }
          },
          itemStyle: {
            normal: {
              label: {
                show: true
              },
              borderWidth: 1,
              borderColor: '#17CCDA',
              areaColor: '#17808F'
            },
            emphasis: {
              label: {
                show: true
              },
              areaStyle: {
                color: '#17808F'
              },
              areaColor: '#19F1FF'
            }
          },
          data: this.mapData
        }],
        tooltip: {
          trigger: 'item',
          formatter: (val) => {
            if (val.value) {
              return val.name + '：' + '<br/>' +
              '当前在线：' + val.value + '辆' + '<br/>' +
              '累计在线：' + val.data.count + '辆'
            } else return val.name + '：暂无数据'
          },
          textStyle: {
            align: 'left',
            color: '#fff'
          },
          backgroundColor: '#151D2C'
        }
      })
    },
    getMapJson(code) {
      const cityJson = require(`../../utils/mapJson/${code}.json`)
      this.initChart(cityJson)
    },
    mounseRightClick() {
      if (this.roleName !== '平台管理员') {
        this.showReturn = false
        this.initChart(sichuan)
        this.$emit('right-click')
      }
      document.oncontextmenu = function() {
        return false
      }
    },
    getCityData(id) {
      cityVehicle({ cityId: id })
        .then(({ data }) => {
          this.$emit('city-data', data)
        })
        .catch(err => {
          throw err
        })
    },
    getCityName() {
      platformName({ plarformId: this.unitId })
        .then(({ data }) => {
          // 展示账号所在地区地图
          this.getMapJson(citysCode[data])
        })
        .catch(err => {
          throw err
        })
    }
  }
}
</script>

<style scoped>
.return {
  position:absolute;
  top: 20px;
  left: 50px;
  cursor: pointer;
  height: 16px;
  width: 16px;
}
</style>
