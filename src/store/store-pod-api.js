/*
  Podcast API Modules:
  for handling API calls to listenotes
 */
const modulePodAPI = {
  namespaced: true,
  state: {
    audioPlay: {},
    typeahead: {},
    bestPodcasts: {}
    /*
      genre_22: []
    */
  },
  getters: {},
  mutations: {
    typeaheadUpdate(state, apiData) {
      // state.typeahead = apiData;
      Vue.set(state, 'typeahead', apiData);
    },
    bestPodcastsUpdate(state, apiData) {
      // Vue.set(state.bestPodcasts, "genre_" + apiData.id, apiData);
      Vue.set(state.bestPodcasts, 'genre_85', apiData);
      console.log('SETTING VUEX');
    }
  },
  actions: {
    /*
      Typeahead: 
      for search field
    */
    typeaheadAction(context, queryObj) {
      let requestParams = {
        q: queryObj.searchTerm || '',
        show_podcasts: queryObj.show_podcasts || 1,
        show_genres: queryObj.show_genres || 1,
        safe_mode: queryObj.safe_mode || 1
      };

      Axios.get('/api/typeahead', {
        params: requestParams,
        responseType: 'json',
        validateStatus: function(status) {
          return status == 200;
        }
      })
        .then(function(response) {
          context.commit('typeaheadUpdate', response.data.success);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /*
      Best podcasts by genre      
    */
    bestPodcastsAction(context, queryObj) {
      let requestParams = {
        genre_id: queryObj.genre_id,
        page: queryObj.page || 1,
        safe_mode: queryObj.safe_mode || 1,
        region: queryObj.region || 'us'
      };

      let isDataExisting = context.state.bestPodcasts['genre_' + requestParams.genre_id];
      function successUpdate(response) {
        console.log(response);
        context.commit('bestPodcastsUpdate', response.data.success);
      }
      function runAPI() {
        Axios.get('/api/best-podcasts', {
          params: requestParams
        }).then(successUpdate);
      }
      !isDataExisting && runAPI();
    }
  }
};

export default modulePodAPI;
