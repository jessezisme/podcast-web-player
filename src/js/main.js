import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import '../style/style.scss';

import axios from 'axios';

import PageHome from '../components/pages/PageHome.vue';

Vue.use(VueRouter);
Vue.use(Vuex);

/**
 *
 * Register GLobal Components
 *
 */
function vueRegisterGlobals() {
  const requireComponent = require.context(
    // The relative path of the components folder
    '../components',
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base component filenames
    /(base|pages).*\.(vue|js)$/
  );

  requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName);
    // Register component globally
    Vue.component(
      componentConfig.default.name,
      /*
        Look for the component options on `.default`, which will
        exist if the component was exported with `export default`,
        otherwise fall back to module's root.
      */
      componentConfig.default || componentConfig
    );
  });
}
vueRegisterGlobals();
/* /end global components */

/**
 *
 * Routing
 *
 */
const routes = [
  {
    path: '/',
    component: PageHome,
    meta: {
      title: 'Home Page - Example App'
    }
  }
];
const router = new VueRouter({
  routes: routes,
  mode: 'history'
});
/* end routing */

var mock = {
  terms: ['star wars episode i the phantom menace', 'star wars'],
  genres: [
    {
      id: 160,
      name: 'Star Wars',
      parent_id: 68
    }
  ],
  podcasts: [
    {
      title_highlighted: 'Rebel Force Radio: <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Podcast',
      title_original: 'Rebel Force Radio: Star Wars Podcast',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: 'Star Wars',
      image: 'https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg',
      id: 'ca3b35271db04291ba56fab8a4f731e4',
      explicit_content: false
    },
    {
      title_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Explained',
      title_original: 'Star Wars Explained',
      publisher_highlighted: 'Alex & Mollie',
      publisher_original: 'Alex & Mollie',
      image: 'https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg',
      id: '699701ca2479411f9c0bbf8dd85323e8',
      explicit_content: false
    },
    {
      title_highlighted: 'Inside <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      title_original: 'Inside Star Wars',
      publisher_highlighted: 'Wondery',
      publisher_original: 'Wondery',
      image: 'https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg',
      id: '8e90b8f0c9eb4c11b13f9dc331ed747c',
      explicit_content: false
    },
    {
      title_highlighted: 'Skytalkers',
      title_original: 'Skytalkers',
      publisher_highlighted: 'Charlotte Errity & Caitlin Plesher - <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: 'Charlotte Errity & Caitlin Plesher - Star Wars',
      image: 'https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg',
      id: '46c50b17a1c6474fb77e21f438ccd78d',
      explicit_content: false
    },
    {
      title_highlighted: 'The Mindalorian',
      title_original: 'The Mindalorian',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Minute',
      publisher_original: 'Star Wars Minute',
      image: 'https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg',
      id: 'cc1fd08a83084c06b6040748aa50a285',
      explicit_content: false
    }
  ]
};

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  modules: {
    podAPI: {
      namespaced: true,
      state: {
        typeahead: null
      },
      getters: {},
      mutations: {
        typeaheadUpdate(state, apiData) {
          console.log("RUNNING")
          state.typeahead = apiData;
        }
      },
      actions: {
        typeaheadAction(context, queryObj) {
          var getSearch = queryObj.searchTerm;
          var requestParams = '?q=' + getSearch + '&show_podcasts=1&show_genres=1&safe_mode=1';
          var requestParamsEncoded = encodeURI(requestParams);

          // @TODO: temporary mock data
          context.commit('typeaheadUpdate', mock);
          // axios.get("/api/typeahead/" + requestParamsEncoded).then(function(response) {
          //   console.log(response.data);
          // });
        }
      }
    }
  }
});

const app = new Vue({
  el: '#app',
  store,
  router: router,
  data: {
    test: 'testing'
  }
});
