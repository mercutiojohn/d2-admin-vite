<template>
  <el-dropdown size="small" class="d2-mr flex align-center">
    <span class="btn-text">
      <el-avatar shape="square" size="small" :src="info.avatar"></el-avatar>
    </span>
    <!-- <el-avatar shape="square" size="small" :src="info.avatar"></el-avatar> -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="() => {}">
        <el-avatar shape="square" size="small" :src="info.avatar"></el-avatar>
        {{info.name ? `${info.name}` : '未登录'}}
      </el-dropdown-item>
      <el-dropdown-item divided @click.native="logOff">
        <d2-icon name="i-fa-power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
