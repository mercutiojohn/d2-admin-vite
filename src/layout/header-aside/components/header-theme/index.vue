<template>
  <div>
    <el-tooltip
      effect="dark"
      content="样式配置"
      placement="bottom">
      <el-button
        class="d2-ml-0 d2-mr btn-text can-hover"
        type="text"
        @click="dialogVisible = true">
        <d2-icon
          name="i-ri:brush-line"
          class="font-size-20px" />
      </el-button>
    </el-tooltip>
    <el-drawer
      title="样式配置"
      :visible.sync="dialogVisible"
      direction="rtl"
      :append-to-body="true">
      <el-divider content-position="left">主题</el-divider>
      <d2-theme-list/>
      <el-divider content-position="left">组件尺寸</el-divider>
      <d2-size/>
      <el-divider content-position="left">菜单模式</el-divider>
      <d2-menu-mode/>
    </el-drawer>
  </div>
</template>

<script>
import themeList from './components/d2-theme-list/index.vue'
import size from './components/d2-size/index.vue'
import menuMode from './components/d2-menu-mode/index.vue'
export default {
  components: {
    'd2-theme-list': themeList,
    'd2-size': size,
    'd2-menu-mode': menuMode,
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
