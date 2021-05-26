import Layout from '@/layout'

const informationManageRouter = {
  path: '/information-manage',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  alwaysShow: true,
  meta: {
    title: '信息管理',
    icon: 'el-icon-message-solid',
    roles: ['admin']
  },

  children: [
    {
      path: 'company-base-information',
      name: 'CompanyBaseInformation',
      component: () => import('@/views/information-manage/company-base-information'),
      meta: { title: '企业基础信息' }
    },
    {
      path: 'service-provider-information',
      name: 'ServiceProviderInformation',
      component: () => import('@/views/information-manage/service-provider-information'),
      meta: { title: '服务商基础信息' }
    },
    {
      path: 'access-platform-information',
      name: 'AccessPlatformInformation',
      component: () => import('@/views/information-manage/access-platform-information'),
      meta: { title: '接入平台信息' }
    },
    {
      path: 'car-base-information',
      name: 'CarBaseInformation',
      component: () => import('@/views/information-manage/car-base-information'),
      meta: { title: '车辆基础信息' }
    },
    {
      path: 'driver-base-information',
      name: 'DriverBaseInformation',
      component: () => import('@/views/information-manage/driver-base-information'),
      meta: { title: '驾驶员基础信息' }
    }
  ]
}

export default informationManageRouter
