/*
 * FileName: 企业专属路由表，存放企业需要显示的菜单,如果该页面又能被政府访问，则需要到company-manage再建个路由
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:07
 */

import Layout from '@/layout'

const companyRouter = {
  path: '/company',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  alwaysShow: true,
  meta: { title: '企业管理', icon: 'el-icon-office-building', roles: ['unit'] },
  children: [
    {
      path: 'company-car/',
      name: 'CompanyCar',
      component: () => import('@/views/company-manage/company-car'),
      hidden: false,
      meta: { title: '企业车辆', roles: ['unit'] }
    }
    // {
    //   path: 'safety-production',
    //   name: 'SafetyProduction',
    //   components: () => import('@/views/error-page/401'),
    //   meta: { title: '安全生产' }
    // },
    // {
    //   path: 'work-card',
    //   name: 'WorkCard',
    //   components: () => import('@/views/company-manage/work-card'),
    //   meta: { title: '作业打卡' }
    // }
  ]
}

export default companyRouter
