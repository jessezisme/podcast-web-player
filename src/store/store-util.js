import Vue from 'vue/dist/vue.esm.js';

/**
 *
 * Utility Helpers:
 * for various sitewide helpers such as screen width, scroll position, etc..
 * anything that would be useful and reduce individual event handlers in components
 * -----------------------
 * Updated by App.vue
 * -----------------------
 */
const moduleUtil = {
  namespaced: true,
  state: {
    screenWidth: '',
    screenWidthPixels: 0,
    scrollPosY: 0
  },
  getters: {},
  mutations: {
    mutScreenWidth(state, _screen) {
      state.screenWidth = _screen.widthViewport;
      state.screenWidthPixels = _screen.widthPixels;
    },
    mutScrollPos(state, _scroll) {
      state.scrollPosY = _scroll;
    }
  },
  actions: {
    actScreenWidth(context, _screen) {
      context.commit('mutScreenWidth', _screen);
    },
    actScrollPos(context, _scroll) {
      context.commit('mutScrollPos', _scroll);
    }
  }
};

export default moduleUtil;
