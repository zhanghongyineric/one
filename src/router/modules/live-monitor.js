import Layout from '@/layout'

const liveMonitorRouter = {
  path: '/live-monitor',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  alwaysShow: true,
  meta: {
    title: '实时监控',
    icon: 'el-icon-video-camera-solid',
    roles: ['admin']
  },

  children: [
    {
      path: 'monitor-home',
      name: 'MonitorHome',
      component: () => import('@/views/live-monitor/monitor-home'),
      meta: { title: '监控首页' }
    },
    {
      path: 'message-monitor',
      name: 'MessageMonitor',
      component: () => import('@/views/live-monitor/message-monitor'),
      meta: { title: '消息监控' }
    },
    {
      path: 'historical-trajectory',
      name: 'HistoricalTrajectory',
      component: () => import('@/views/live-monitor/historical-trajectory'),
      meta: { title: '历史轨迹' }
    }
  ]
}

export default liveMonitorRouter
