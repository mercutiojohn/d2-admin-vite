export default {
  namespaced: true,
  state: {
    // 顶栏隐藏
    active: false
  },
  mutations: {
    /**
     * @description 切换顶栏隐藏状态
     * @param {Object} state state
     */
    toggle (state) {
      state.active = !state.active
    },
    /**
     * @description 设置顶栏隐藏
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}
