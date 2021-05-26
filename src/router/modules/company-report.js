/*
 * FileName: 企业报备
 * @author: ZhouJiaXing
 * @date: 2021/5/6 下午1:53
 */

import Layout from '@/layout'

const companyReportRouter = {
  path: '/company-report',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  alwaysShow: true,
  meta: { title: '报备管理', icon: 'el-icon-document', roles: ['unit'] },
  children: [
    {
      path: 'report-log',
      name: 'ReportLog',
      component: () => import('@/views/company-report/report-log'),
      hidden: false,
      meta: { title: '报备日志' }
    },
    {
      path: 'handle-log',
      name: 'HandleLog',
      component: () => import('@/views/company-report/handle-log'),
      hidden: false,
      meta: {
        title: '处理日志',
        noCache: true // 不缓存
      }
    },
    {
      path: 'detail',
      name: 'HandleLogDetail',
      component: () => import('@/views/company-report/handle-log/detail'),
      hidden: true,
      meta: {
        title: '详情',
        noCache: true
      }
    },
    {
      path: 'finish-log',
      name: 'FinishLog',
      component: () => import('@/views/company-report/finish-log'),
      hidden: false,
      meta: {
        title: '完结日志',
        noCache: true// 不缓存
      }
    }
  ]
}

export default companyReportRouter
