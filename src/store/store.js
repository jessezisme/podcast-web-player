/**
 *
 * Vuex:
 * for global state
 *
 */
import Vue from "vue/dist/vue.esm.js";
import Vuex from "vuex";
/*
  import store modules 
*/
import ModPodApi from "./store-pod-api";
import ModPodAudio from "./store-audio";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  modules: {
    podAPI: ModPodApi,
    podAudio: ModPodAudio
  }
});

export default store;
