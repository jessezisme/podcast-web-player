import Vue from 'vue/dist/vue.esm.js';

/**
 *
 * Audio Player:
 * used to store the
 *
 */
const moduleAudio = {
  namespaced: true,
  state: {
    player: null,
    playlist: []
  },
  getters: {},
  mutations: {
    mutPlayer(state, _player) {
      Vue.set(state, 'player', _player);
    }
  },
  actions: {
    actPlayer(context, _player) {
      context.commit('mutPlayer', _player);
    }
  }
};

export default moduleAudio;
