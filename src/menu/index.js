import { uniqueId } from 'lodash'

// 插件
import demoPlugins from './modules/demo-plugins'
// 组件
import demoComponents from './modules/demo-components'
// 功能
import demoPlayground from './modules/demo-playground'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}
/**
 * @description 过滤掉 path 中包含 'index' 的项
 * @param {Object} menu 原始的菜单数据
 */
function filterOutIndexPath(menu) {
  console.log(menu)
  return menu.children ? menu.children.filter(item => item.path && !item.path.includes('index')) : []
}
/**
 * @description 返回菜单中的 'index' 项
 * @param {Object} menu 原始的菜单数据
 */
function filterIndexPath(menu) {
  console.log(menu)
  let result = JSON.parse(JSON.stringify(menu))
  let pathObjList = menu.children ? menu.children.filter(item => item.path && item.path.includes('index')) : []
  if (pathObjList.length) {
    result.path = pathObjList[0].path
  }
  delete result.children
  return result
}


// 菜单 侧边栏模式
export const menuAside = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'i-ri:home-line',
  },
  demoComponents,
  demoPlugins,
  demoPlayground
])

// 菜单 顶栏模式
export const menuHeader = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'i-ri:home-line'
  },
  demoPlayground,
  demoComponents,
  demoPlugins
])

// 菜单 联动模式
export const menuSeparate = {
  aside: supplementPath([
    demoComponents,
    demoPlugins,
    demoPlayground
  ]),
  header: supplementPath([
    {
      path: '/index',
      title: '首页',
      icon: 'i-ri:home-line'
    },
    filterIndexPath(demoPlayground),
    filterIndexPath(demoComponents),
    filterIndexPath(demoPlugins)
  ])
}

// 菜单 搜索专用
export const menuSearch = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'i-ri:home-line'
  },
  demoPlayground,
  demoComponents,
  demoPlugins
])

