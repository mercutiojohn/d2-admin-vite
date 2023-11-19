<template>
  <el-tooltip effect="dark" :content="active ? '退出顶栏隐藏' : '顶栏隐藏'" placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <d2-icon v-if="active" name="i-ri:arrow-down-s-line" class="font-size-20px"/>
      <d2-icon v-else name="i-ri:arrow-up-s-line" class="font-size-20px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/headerhide', [
      'active'
    ])
  },
  methods: {
    ...mapMutations('d2admin/headerhide',  [
      'toggle',
      'set'
    ])
  }
}
</script>
