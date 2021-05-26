import Layout from '@/layout'

const notDetected = {
  path: '',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  alwaysShow: true,
  meta: { title: '行业监管', icon: 'el-icon-office-building', roles: ['admin'] },
  children: [
    {
      path: 'not-detected',
      name: 'NotDetected',
      component: () => import('@/views/not-detected'),
      meta: { title: '未检测到', roles: ['admin'] }
    },
    {
      path: 'not-detected/:companyId',
      name: 'NotDetectedCompany',
      component: () => import('@/views/not-detected/not-detected-company'),
      hidden: true, // 不在侧边栏显示
      meta: { title: '未检测到详情', roles: ['admin'] },
      props: true
    }
  ]
}

export default notDetected
