<template>
  <div class="d2-layout-header-aside-group" :style="styleLayoutMainGroup" :class="{grayMode: grayActive}">
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div class="d2-theme-header" :class="{ 'd2-theme-header-transition': asideTransition }" :style="{ height: headerHide ? 0 : '60px', opacity: headerHide ? 0 : 1, pointerEvents: headerHide ? 'none' : 'unset' }" flex-box="0" flex>
        <div :class="`window-controls-area ${currPlatform}`" v-if="isElectron && currPlatform === 'mac'"></div>
        <router-link
          to="/index"
          :class="{'logo-group': true, 'logo-transition': asideTransition}"
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          flex-box="0">
          <img v-if="asideCollapse" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">
          <img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">
        </router-link>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="i-ri:menu-fill"/>
        </div>
        <d2-menu-header flex-box="1" v-if="['separate', 'header'].includes(menuMode)"/>
        <!-- <div class="d2-theme-header-name" v-else>{{currentPage === '/index' ? 'D2Admin' : openedPages.filter((item) => item.fullPath === currentPage)[0].meta.title}}</div> -->
        <div class="d2-theme-header-name" v-else>{{openedPages.filter((item) => item.fullPath === currentPage)[0].meta.title}}</div>
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <d2-header-search @click="handleSearchClick"/>
          <d2-header-log v-if="$env === 'development'"/>
          <!-- <d2-header-fullscreen/> -->
          <!-- <d2-header-hide/> -->
          <d2-header-theme/>
          <!-- <d2-header-size/> -->
          <!-- <d2-header-menu-mode/> -->
          <!-- <d2-header-locales/> -->
          <!-- <d2-header-color/> -->
          <d2-header-user/>
          <div :class="`window-controls-area ${currPlatform}`" v-if="isElectron && currPlatform === 'windows'"></div>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          :class="{'d2-theme-container-aside': true, 'd2-theme-container-transition': asideTransition}"
          :style="{
            width: asideLength && ['separate', 'aside'].includes(menuMode) ? (asideCollapse ? asideWidthCollapse : asideWidth) : 0,
            // opacity: this.searchActive ? 0.5 : 1
          }">
          <d2-menu-side v-if="['separate', 'aside'].includes(menuMode)"/>
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 内容 -->
          <div class="d2-theme-container-main-layer" flex="dir:top">
            <!-- tab -->
            <div class="d2-theme-container-main-header" flex-box="0">
              <d2-tabs/>
            </div>
            <!-- 页面 -->
            <div class="d2-theme-container-main-body" flex-box="1">
              <transition :name="transitionActive ? 'fade-popup' : ''">
                <keep-alive :include="keepAlive">
                  <router-view :key="routerViewKey" />
                </keep-alive>
              </transition>
            </div>
          </div>
      </div>
      </div>
    </div>
    <!-- 搜索 -->
    <transition name="fade-mask">
      <div v-if="searchActive" class="d2-theme-container-search-layer" flex  @click.self="searchPanelClose">
        <d2-panel-search ref="panelSearch"/>
      </div>
    </transition>
  </div>
</template>

<script>
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs/index.vue'
import d2HeaderFullscreen from './components/header-fullscreen/index.vue'
import d2HeaderHide from './components/header-hide/index.vue'
import d2HeaderLocales from './components/header-locales/index.vue'
import d2HeaderSearch from './components/header-search/index.vue'
// import d2HeaderSize from './components/header-size/index.vue'
// import d2HeaderMenuMode from './components/header-menu-mode/index.vue'
import d2HeaderTheme from './components/header-theme/index.vue'
import d2HeaderUser from './components/header-user/index.vue'
import d2HeaderLog from './components/header-log/index.vue'
import d2HeaderColor from './components/header-color/index.vue'
import d2HeaderWindowControls from './components/header-window-controls/index.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'd2-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderFullscreen,
    d2HeaderHide,
    d2HeaderLocales,
    d2HeaderSearch,
    // d2HeaderSize,
    // d2HeaderMenuMode,
    d2HeaderTheme,
    d2HeaderUser,
    d2HeaderLog,
    d2HeaderColor,
    d2HeaderWindowControls
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse,
      asideLength: state => state.menu.aside.length,
      asideTransition: state => state.menu.asideTransition,
      menuMode: state => state.menu.menuMode,
      openedPages: state => state.page.opened,
      currentPage: state => state.page.current,
      headerHide: state => state.headerhide.active,
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    ...mapState('d2admin/ua', {
      uaData: 'data'
    }),
    /**
     * @description 用来实现带参路由的缓存
     */
    routerViewKey () {
      // 默认情况下 key 类似 __transition-n-/foo
      // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.path}`] || ''
      return `${stamp ? `__stamp-${stamp}-` : ''}${this.$route.path}`
    },
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return this.themeActiveSetting.backgroundImage
        ? { backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')` }
        : {}
    },
    isElectron () {
      return window.require && window.require('electron') ? true : false
    },
    currPlatform() {
      if (this.uaData && this.uaData.os) {
        switch(this.uaData.os.name) {
          case 'Windows':
            return 'windows'
          case 'Linux':
            return 'linux'
          case 'Mac OS X':
            return 'mac'
          case 'Mac OS':
            return 'mac'
          default:
            return 'windows'
        }
      }
    }
  },
  methods: {
    ...mapActions('d2admin/menu', [
      'asideCollapseToggle'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    }
  }
}
</script>

<style lang="scss">
// 注册主题
/* @import '@/assets/style/theme/register.scss'; */
</style>
