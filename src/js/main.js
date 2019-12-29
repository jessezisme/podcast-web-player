import Vue from "vue/dist/vue.esm.js";
import Vuex from "vuex";
import VueRouter from "vue-router";
import "../style/style.scss";

import Axios from "axios";
import "lazysizes";

import PageHome from "../components/pages/PageHome.vue";

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
    "../components",
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
    name: "home",
    path: "/",
    component: PageHome,
    meta: {
      title: "Home Page - Example App"
    }
  },
  {
    name: "podcast",
    path: "/podcast/:name/:id",
    component: PageHome
  },
  {
    name: "search",
    path: "/search",
    component: PageHome
  }
];
const router = new VueRouter({
  routes: routes,
  mode: "history"
});
/* end routing */

/**
 *
 * Vuex
 *
 */

/*
  Podcast API Modules:
  for handling API calls to listenotes
 */
const modulePodAPI = {
  namespaced: true,
  state: {
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
      Vue.set(state, "typeahead", apiData);
    },
    bestPodcastsUpdate(state, apiData) {
      // Vue.set(state.bestPodcasts, "genre_" + apiData.id, apiData);
      Vue.set(state.bestPodcasts, "genre_85", apiData);
      console.log("SETTING VUEX");
    }
  },
  actions: {
    /*
      Typeahead: 
      for search field
    */
    typeaheadAction(context, queryObj) {
      let requestParams = {
        q: queryObj.searchTerm || "",
        show_podcasts: queryObj.show_podcasts || 1,
        show_genres: queryObj.show_genres || 1,
        safe_mode: queryObj.safe_mode || 1
      };

      Axios.get("/api/typeahead", {
        params: requestParams,
        responseType: "json",
        validateStatus: function(status) {
          return status == 200;
        }
      })
        .then(function(response) {
          context.commit("typeaheadUpdate", response.data.success);
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
        region: queryObj.region || "us"
      };

      let isDataExisting = context.state.bestPodcasts["genre_" + requestParams.genre_id];
      function successUpdate(response) {
        console.log(response);
        context.commit("bestPodcastsUpdate", response.data.success);
      }
      function runAPI() {
        Axios.get("/api/best-podcasts", {
          params: requestParams
        }).then(successUpdate);
      }
      !isDataExisting && runAPI();
    }
  }
};

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
    podAPI: modulePodAPI
  }
});

const app = new Vue({
  el: "#app",
  store,
  router: router,
  data: {
    test: "testing"
  }
});
