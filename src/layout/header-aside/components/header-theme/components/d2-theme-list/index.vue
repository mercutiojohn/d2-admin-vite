<template>
  <div class="theme-list">
    <div v-for="(item, index) in list" :key="index" class="theme-item" :class="{ 'active': activeName === item.name }" @click="handleSelectTheme(item.name)">
      <div class="theme-preview" :style="{ backgroundImage: `url(${$baseUrl}${item.preview})` }"/>
      <div class="theme-info">
        <div>{{item.title}}</div>
        <div>
          <el-button v-if="activeName === item.name" type="success" icon="el-icon-check" round>已激活</el-button>
          <el-button v-else round @click="handleSelectTheme(item.name)">使用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'd2-theme-list',
  data () {
    return {
      table: {
        showHeader: false,
        border: true
      }
    }
  },
  computed: {
    ...mapState('d2admin/theme', [
      'list',
      'activeName'
    ])
  },
  methods: {
    ...mapActions('d2admin/theme', [
      'set'
    ]),
    handleSelectTheme (name) {
      this.set(name)
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
