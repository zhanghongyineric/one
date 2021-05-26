/*
 * FileName: 安全码管理路由
 * @author: ZhouJiaXing
 * @date: 2021/4/15 下午2:11
 */
import Layout from '@/layout'

const safeCodeRouter = {
  path: '/safe-code',
  component: Layout,
  redirect: 'noRedirect', // 让面包屑不可点击
  meta: { title: '安全码管理', icon: 'code', roles: ['admin'] },
  children: [
    // {
    //   path: 'violation-level',
    //   name: 'ViolationLevel',
    //   components: () => import('@/views/code-manage/violation-level'),
    //   meta: { title: '违章程度' }
    // },
    // {
    //   path: 'score-rule',
    //   name: 'ScoreRule',
    //   components: () => import('@/views/code-manage/score-rule'),
    //   meta: { title: '扣分规则' }
    // },
    {
      path: 'level',
      name: 'Level',
      component: () => import('@/views/code-manage/level'),
      meta: { title: '安全码等级' }
    },
    {
      path: 'rule-divide',
      name: 'RuleDivide',
      component: () => import('@/views/code-manage/rule-divide'),
      meta: { title: '规则划分' }
    },
    {
      path: 'apply',
      name: 'Apply',
      component: () => import('@/views/code-manage/apply'),
      meta: { title: '安全码申请记录' }
    },
    {
      path: 'code-ratio',
      name: 'CodeRatio',
      component: () => import('@/views/code-manage/code-ratio'),
      meta: { title: '企业安全码规则' }
    },
    {
      path: 'penalty-appeal',
      name: 'PenaltyAppeal',
      component: () => import('@/views/code-manage/penalty-appeal/penalty-appeal'),
      meta: { title: '驾驶员扣分申诉' }
    }
    // {
    //   path: 'history-code',
    //   name: 'HistoryCode',
    //   components: () => import('@/views/safe-code/history-code/index'),
    //   meta: { title: '历史安全码' }
    // }
  ]
}

export default safeCodeRouter
