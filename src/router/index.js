import Vue from 'vue'
import Router from 'vue-router'
// import Layout from '@/layout'

/*
  引入路由模块
*/
import baseRouter from './modules/base'
// import companyManageRouter from './modules/company-manage'
// import companyRouter from './modules/company'
// import safeCodeRouter from './modules/safe-code'
import systemManageRouter from './modules/system-manage'
// import companyReportRouter from './modules/company-report'
// import bigScreen from '@/router/modules/big-screen'
// import governmentReportRouter from '@/router/modules/government-report'
// import notDetectedRouter from '@/router/modules/not-detected'
import informationManageRouter from '@/router/modules/information-manage'
import officialWebsite from '@/router/modules/official-website'
import liveMonitorRouter from '@/router/modules/live-monitor'
import statisticsInquireRouter from '@/router/modules/statistics-inquire'
import businessManagementRouter from '@/router/modules/business-management'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  ...baseRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [{
  //     path: 'home',
  //     name: 'Home',
  //     component: () => import('@/views/home/'),
  //     meta: { title: '首页', icon: 'el-icon-s-home', roles: ['admin', 'gov', 'unit'] }
  //   }]
  // },
  // companyManageRouter, // 企业管理路由
  // companyRouter, // 企业路由
  // safeCodeRouter, // 安全码管理路由
  // companyReportRouter, // 企业报备路由
  // bigScreen, // 大屏路由
  // governmentReportRouter, // 政府端（日志报备）
  // notDetectedRouter, // 未检测到（日志报备）
  officialWebsite, // 官网管理
  informationManageRouter, // 信息管理
  liveMonitorRouter, // 实时监控
  statisticsInquireRouter, // 统计查询
  businessManagementRouter, // 业务管理
  systemManageRouter, // 系统管理路由 <<<<<<<这个放最下面，新增的放上面>>>>>>>
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
/* {
path: '/enforce-manage',
components: Layout,
alwaysShow: true, // 一直显示根路由
redirect: 'noRedirect', // 让面包屑不可点击
meta: {
  title: '执法管理',
  icon: 'tianPing',
  roles: ['admin', 'gov']
},
children: [
  {
    path: 'peoples',
    name: 'EnforceManage',
    components: () => import('@/views/enforce-manage/peoples'),
    meta: {
      title: '执法人员'
    }
  }
]
},*/
