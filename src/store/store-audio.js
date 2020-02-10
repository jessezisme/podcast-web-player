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
    podcastRequest: null,
    player: null,
    playlist: []
  },
  getters: {},
  mutations: {
    mutPlayPodcast(state, _ep) {
      Vue.set(state, 'podcastRequest', _ep);
    },
    mutPlayer(state, _player) {
      Vue.set(state, 'player', _player);
    }
  },
  actions: {
    actPlayPodcast(context, _ep) {
      context.commit('mutPlayPodcast', _ep);
    },
    actPlayer(context, _player) {
      context.commit('mutPlayer', _player);
    }
  }
};

export default moduleAudio;
