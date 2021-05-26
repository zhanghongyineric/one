/*
 * FileName: 企业管理路由存放企业，政府，管理员都能访问的页面，但是没有菜单
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:07
 */

import Layout from '@/layout'

const companyManageRouter = {
  path: '/company-manage',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  hidden: true,
  alwaysShow: true,
  meta: { title: '企业管理', icon: 'el-icon-office-building', roles: ['gov', 'admin', 'unit'] },
  children: [
    {
      path: 'company-code',
      name: 'CompanyCode',
      component: () => import('@/views/company-manage/company-code'),
      meta: { title: '企业安全码', roles: ['admin', 'gov'] }
    },
    {
      path: 'driver-code/:companyId/:codeId',
      name: 'DriverCode',
      component: () => import('@/views/company-manage/driver-code'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '驾驶员安全码' },
      props: true
    },
    {
      path: 'detail/company/:companyId',
      name: 'CompanyDetail',
      component: () => import('@/views/company-manage/company-code/company-detail'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '企业详情' },
      props: true
    },
    {
      path: 'detail/company/category',
      name: 'CompanyCategory',
      component: () => import('@/views/company-manage/company-code/company-category'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '企业分类' }
    },
    {
      path: 'detail/driver/:driverId',
      name: 'DriverDetail',
      component: () => import('@/views/company-manage/driver-code/detail'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '驾驶员详情' },
      props: true
    },
    {
      path: 'driver-violation/:driverId',
      name: 'DriverViolation',
      component: () => import('@/views/company-manage/driver-violation'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '驾驶员违规' },
      props: true
    }
  ]
}

export default companyManageRouter
