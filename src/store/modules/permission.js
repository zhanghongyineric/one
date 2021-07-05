import { constantRoutes } from '@/router'
import { getMenuByAccount } from '@/api/system-manage/menu-manage'
import Layout from '@/layout/index'
import Empty from '@/layout/empty'

/**
 * 路由懒加载
 * @param path
 * @returns {function(*=): any}
 */
export const loadView = (path) => {
  // '@/'必须作为字符串放到require里面，不然组件加载不出来,路径后面必须加/
  return resolve => require([`@/${path.slice(2)}/`], resolve)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes(routes) {
  return routes.map(route => {
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRoutes(route.children)
    } else {
      delete route['children']
    }
    // 加载组件
    if (route.component) {
      // Layout Empty 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'Empty') {
        route.component = Empty
      } else {
        route.component = loadView(route.component)
      }
    }
    // 设置显示隐藏
    route.hidden = route.hidden !== '1' // 0隐藏，1显示

    // 配置meta
    route.meta = {
      title: route.title,
      icon: route.icon
    }

    if (route.type === '0') { // 菜单
      route.props = true
      route.meta.noCache = route.noCache !== '1' // 0不缓存，1缓存
    } else { // 目录
      route.redirect = 'noRedirect'
      route.alwaysShow = true
      delete route['name']
    }

    delete route['noCache']
    delete route['parentId']
    delete route['sort']
    delete route['type']
    delete route['permission']
    delete route['title']
    delete route['icon']

    return route
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, role) {
    return new Promise(resolve => {
      getMenuByAccount({ system: process.env.VUE_APP_SYSTEM_TAG }).then(res => {
        const accessedRoutes = filterAsyncRoutes(res.data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
