<template>
  <div class="theme-list">
    <div v-for="(item, index) in options" :key="index" class="theme-item" :class="{ 'active': menuMode === item.value }" @click="handleChange(item.value)">
      <!-- <div class="theme-preview" :style="{ backgroundImage: `url(${$baseUrl}${item.preview})` }"/> -->
      <div class="theme-info">
        <div>{{item.label}}</div>
        <div>
          <el-button v-if="menuMode === item.value" type="success" icon="el-icon-check" round>已激活</el-button>
          <el-button v-else round @click="handleChange(item.value)">使用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      return name === this.value ? 'dot-circle-o' : 'circle-o'
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-preview {
  flex-shrink: 0;
  height: 50px;
  width: 100px;
  border-radius: 4px;
  background-size: cover;
  border: 1px solid $color-border-1;
}
.theme-list {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  .theme-item {
    overflow: hidden;
    /* min-width: 300px; */
    display: flex;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    /* background: #000; */
    transition: background .2s ease;
    cursor: pointer;
    &:hover, &.active{
      background: #00000013;
    }
    .theme-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
