import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import VueAMap from 'vue-amap'
Vue.use(VueAMap)
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

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import * as filters from './filters' // global filters

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI)

import * as Echarts from 'echarts'
Vue.prototype.$echarts = Echarts

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
