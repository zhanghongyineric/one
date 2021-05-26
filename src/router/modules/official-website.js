// 官网相关配置路由

import Layout from '@/layout'

const officialWebsite = {
  path: '/official-website',
  component: Layout,
  redirect: 'noRedirect',
  hidden: false,
  alwaysShow: true,
  meta: {
    title: '官网管理',
    icon: 'el-icon-menu',
    roles: ['admin']
  },

  children: [
    {
      path: 'carousel-images',
      name: 'CarouselImages',
      component: () => import('@/views/official-website/carousel-images'),
      meta: { title: '轮播图管理' }
    },
    {
      path: 'home-images',
      name: 'HomeImages',
      component: () => import('@/views/official-website/home-images'),
      meta: { title: '首页小图管理' }
    },
    {
      path: 'news',
      name: 'News',
      component: () => import('@/views/official-website/news'),
      meta: { title: '新闻中心管理' }
    },
    {
      path: 'industry-application',
      name: 'IndustryApplication',
      component: () => import('@/views/official-website/industry-application'),
      meta: { title: '行业应用管理' }
    },
    {
      path: 'partner',
      name: 'Partner',
      component: () => import('@/views/official-website/partner'),
      meta: { title: '合作伙伴管理' }
    },
    {
      path: 'about',
      name: 'About',
      component: () => import('@/views/official-website/about'),
      meta: { title: '产品服务及关于' }
    }
  ]
}

export default officialWebsite
