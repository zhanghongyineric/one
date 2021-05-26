/*
 * FileName: 大屏路由
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:20
 */

import Empty from '@/layout/empty'

const bigScreen = {
  path: '/big-screen',
  alwaysShow: true, // 一直显示根路由
  redirect: 'noRedirect', // 让面包屑不可点击
  component: Empty,
  meta: {
    title: '安全可视化大屏',
    icon: 'windows',
    roles: ['admin']
  },
  children: [
    {
      path: 'city',
      name: 'City',
      component: () => import('@/views/big-screen/city'),
      meta: {
        title: '省市安全可视化大屏'
      }
    },
    {
      path: 'company',
      name: 'Company',
      component: () => import('@/views/big-screen/company'),
      meta: {
        title: '  企业安全可视化大屏'
      }
    }
  ]
}
export default bigScreen
