import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const meta = { auth: true }

export default {
  path: '/user',
  meta,
  redirect: 'noredirect',
  component: layoutHeaderAside,
  hidden: true,
  children: [
    {
      path: 'profile',
      component: () => import('@/views/system/user/profile/index.vue'),
      name: 'Profile',
      meta: { ...meta, title: '个人中心' }
    }
  ]
}