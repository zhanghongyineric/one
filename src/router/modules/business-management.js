import Layout from '@/layout'

const businessManagementRouter = {
  path: '/business-management',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  alwaysShow: true,
  meta: {
    title: '业务管理',
    icon: 'el-icon-s-management',
    roles: ['admin']
  },

  children: [
    {
      path: 'rules-manage',
      name: 'RulesManage',
      component: () => import('@/views/business-management/rules-manage'),
      meta: { title: '规则管理' }
    },
    {
      path: 'process-manage',
      name: 'ProcessManage',
      component: () => import('@/views/business-management/process-manage'),
      meta: { title: '处置流程管理' }
    },
    {
      path: 'alarm-detail',
      name: 'AlarmDetail',
      component: () => import('@/views/business-management/alarm-detail'),
      meta: { title: '报警明细管理' }
    },
    {
      path: 'push-rules',
      name: 'PushRules',
      component: () => import('@/views/business-management/push-rules'),
      meta: { title: '推送规则管理' }
    },
    {
      path: 'monitor-report',
      name: 'MonitorReport',
      component: () => import('@/views/business-management/monitor-report'),
      meta: { title: '监测报告管理' }
    }
  ]
}

export default businessManagementRouter
