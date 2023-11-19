import Vue from 'vue'
import App from './App.vue'

// Style
import '@/style.scss'
import 'virtual:uno.css'

// i18n support
import i18n from './plugin/i18n'

// Vuex
import store from "@/store"

// VueRouter
import router from '@/router'
import { menuHeader, menuAside, menuSeparate, menuSearch } from '@/menu'
import { frameInRoutes } from '@/router/routes'

import { mapState } from 'vuex'

// plugins
import '@/plugin'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
  computed: {
    ...mapState('d2admin/menu', [
      'menuMode',
    ])
  },
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏和侧栏菜单
    if (this.menuMode === 'header') {
      this.$store.commit('d2admin/menu/headerSet', menuHeader)
    } else if (this.menuMode === 'aside') {
      this.$store.commit('d2admin/menu/asideSet', menuAside)
    } else if (this.menuMode === 'separate') {
      this.$store.commit('d2admin/menu/headerSet', menuSeparate.header)
    }
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuSearch)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (this.menuMode === 'separate' && matched.length > 0) {
          const _side = menuSeparate.aside.filter(menu => menu.path === matched[0].path)
          this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
        }
      },
      immediate: true
    }
  }
}).$mount('#app')

