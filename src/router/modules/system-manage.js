/*
 * FileName: 系统管理路由
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:11
 */
import Layout from '@/layout'

const systemManageRouter = {
  path: '/system-manage',
  component: Layout,
  alwaysShow: true, // 一直显示根路由
  redirect: 'noRedirect', // 让面包屑不可点击
  meta: {
    title: '系统管理',
    icon: 'windows',
    roles: ['admin']
  },
  children: [
    {
      path: 'account',
      name: 'Account',
      component: () => import('@/views/system-manage/account-manage'),
      meta: {
        title: '账号管理'
      }
    },
    {
      path: 'dictionary',
      name: 'Dictionary',
      component: () => import('@/views/system-manage/dictionary'),
      meta: {
        title: '字典管理'
      }
    },
    {
      path: 'system-log',
      name: 'SystemLog',
      component: () => import('@/views/system-manage/system-log'),
      meta: {
        title: '系统日志'
      }
    }
  ]
}

export default systemManageRouter
