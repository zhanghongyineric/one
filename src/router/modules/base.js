/*
 * FileName: 基础路由
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:07
 */

import Layout from '@/layout'

const baseRouter = [
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
  }
]

export default baseRouter
