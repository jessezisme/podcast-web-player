/**
 *
 * Vuex:
 * for global state
 *
 */
import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';
// store modules
import ModPodApi from './store-pod-api';
import ModPodAudio from './store-audio';
import ModUtil from './store-util';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: function() {
    count: 0;
  },
  mutations: {},
  modules: {
    podAPI: ModPodApi,
    podAudio: ModPodAudio,
    podUtil: ModUtil
  }
});

export default store;
