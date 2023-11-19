export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 'ctrl+k',
      close: 'esc'
    }
  },
  // 侧边栏默认配置
  menu: {
    asideCollapse: false,
    asideTransition: true,
    menuMode: 'aside' // separate 顶栏和侧栏联动; aside 仅侧栏; header 仅顶栏
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: '首页',
          auth: false
        }
      }
    ]
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: 'd2admin 经典',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: 'Chester',
        name: 'chester',
        preview: 'image/theme/chester/preview@2x.png'
      },
      {
        title: 'Element',
        name: 'element',
        preview: 'image/theme/element/preview@2x.png'
      },
      {
        title: '紫罗兰',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.png'
      },
      {
        title: '简约线条',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.png'
      },
      {
        title: '流星',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.png'
      },
      {
        title: 'Tik',
        name: 'tik',
        backgroundImage: 'image/theme/tik/bg.png',
        preview: 'image/theme/tik/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
