import Layout from '@/layout'

const statisticsInquireRouter = {
  path: '/statistics-inquire',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  alwaysShow: true,
  meta: {
    title: '统计查询',
    icon: 'el-icon-s-data',
    roles: ['admin']
  },

  children: [
    {
      path: 'vehicle-status',
      name: 'VehicleStatus',
      component: () => import('@/views/statistics-inquire/vehicle-status'),
      meta: { title: '车辆状态情况统计' }
    },
    {
      path: 'gps-alarm',
      name: 'GpsAlarm',
      component: () => import('@/views/statistics-inquire/gps-alarm'),
      meta: { title: '卫星定位报警统计' }
    },
    {
      path: 'prevention-alarm',
      name: 'PreventionAlarm',
      component: () => import('@/views/statistics-inquire/prevention-alarm'),
      meta: { title: '智能防控报警统计' }
    },
    {
      path: 'illegal',
      name: 'Illegal',
      component: () => import('@/views/statistics-inquire/illegal'),
      meta: { title: '各类违法违章统计' }
    },
    {
      path: 'daily-monitoring-operation',
      name: 'DailyMonitoringOperation',
      component: () => import('@/views/statistics-inquire/daily-monitoring-operation'),
      meta: { title: '日常监测操作统计' }
    }
  ]
}

export default statisticsInquireRouter
