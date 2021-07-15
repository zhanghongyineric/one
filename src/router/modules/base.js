import Layout from '@/layout'

const baseRouter = [
  {
    path: '/',
    component: Layout,
    redirect: '/InformationHome',
    children: [{
      path: 'InformationHome',
      name: 'InformationHome',
      component: () => import('@/views/information-manage/home'),
      meta: { title: '首页', icon: 'el-icon-s-home', roles: ['admin'] }
    }]
  },
  {
    path: '/redirect', // 用于刷新页面
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/nopermission',
    component: () => import('@/views/error-page/noPermission'),
    hidden: true
  },
  {
    path: '/HistoryVersions',
    component: () => import('@/views/system-manage/version-manage/history-versions'),
    hidden: true
  }
]

export default baseRouter
