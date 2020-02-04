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
    isPlay: false,
    podcast: null,
    playlist: []
  },
  getters: {},
  mutations: {
    mutPlayPodcast(state, _ep) {
      Vue.set(state, 'podcast', _ep);
    },
    mutPlayToggle(state, _isPlaying) {
      Vue.set(state, 'isPlay', _isPlaying);
    }
  },
  actions: {
    actPlayPodcast(context, _ep) {
      context.commit('mutPlayPodcast', _ep);
    },
    actPlayToggle(context, _isPlaying) {
      const setPlaying = _isPlaying ? true : false;
      context.commit('mutPlayToggle', setPlaying);
    }
  }
};

export default moduleAudio;
