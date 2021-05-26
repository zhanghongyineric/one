import Layout from '@/layout'

const governmentReport = {
  path: '/government-report',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  // hidden: true,
  alwaysShow: true,
  meta: { title: '行业监管', icon: 'el-icon-office-building', roles: ['gov'] },
  children: [
    {
      path: 'not-reported',
      name: 'NotReported',
      component: () => import('@/views/government-report/not-reported'),
      meta: { title: '未报备企业', roles: ['gov'] }
    },
    {
      path: 'not-reported/:companyId',
      name: 'NotReportedCompany',
      component: () => import('@/views/government-report/not-reported/not-reported-company'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '未报备企业详情' },
      props: true
    },
    {
      path: 'miss-reported',
      name: 'MissReported',
      component: () => import('@/views/government-report/miss-reported'),
      meta: { title: '漏报备企业', roles: ['gov'] }
    },
    {
      path: 'miss-reported/:companyId',
      name: 'MissReportedCompany',
      component: () => import('@/views/government-report/miss-reported/miss-reported-company'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '漏报备企业详情' },
      props: true
    },
    {
      path: 'reporting',
      name: 'Reporting',
      component: () => import('@/views/government-report/reporting'),
      meta: { title: '未完结企业', roles: ['gov'] }
    },
    {
      path: 'reporting/:companyId',
      name: 'ReportingCompany',
      component: () => import('@/views/government-report/reporting/reporting-company'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '未完结企业详情' },
      props: true
    },
    {
      path: 'finish-report',
      name: 'FinishReport',
      component: () => import('@/views/government-report/finish-report'),
      meta: { title: '已完结企业', roles: ['gov'] }
    },
    {
      path: 'finish-report/:companyId',
      name: 'FinishReportCompany',
      component: () => import('@/views/government-report/finish-report/finish-report-company'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '已完结企业详情' },
      props: true
    },
    {
      path: 'marker-manage',
      name: 'MarkersManage',
      component: () => import('@/views/government-report/markers-manage'),
      meta: { title: '标签管理', roles: ['gov'] }
    }
  ]
}

export default governmentReport
