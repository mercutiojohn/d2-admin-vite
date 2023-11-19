<template>
  <el-dropdown placement="bottom" size="small" @command="handleChange">
    <el-button class="d2-mr btn-text can-hover" type="text">
      <d2-icon name="i-ri:font-size-2" class="font-size-20px"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
        <d2-icon-fa :name="iconName(item.value)" class="d2-mr-5"/>{{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'd2-menu-mode',
  data () {
    return {
      options: [
        { label: '顶栏与侧栏联动', value: 'separate' },
        { label: '顶栏模式', value: 'header' },
        { label: '侧栏模式', value: 'aside' },
      ]
    }
  },
  computed: {
    ...mapState('d2admin/menu', [
      'menuMode'
    ])
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'd2admin/page/keepAliveClean'
    }),
    ...mapActions({
      sizeSet: 'd2admin/menu/menuModeSet'
    }),
    handleChange (value) {
      this.sizeSet(value)
    },
    iconName (name) {
      return name === this.menuMode ? 'dot-circle-o' : 'circle-o'
    }
  }
}
</script>