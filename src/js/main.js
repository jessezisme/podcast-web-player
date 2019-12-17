import Vue from "vue/dist/vue.esm.js";
import Vuex from "vuex";
import VueRouter from "vue-router";
import "../style/style.scss";

import axios from "axios";
import "lazysizes";

import PageHome from "../components/pages/PageHome.vue";
import { homedir } from "os";

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
    podAPI: {
      namespaced: true,
      state: {
        typeahead: null
      },
      getters: {},
      mutations: {
        typeaheadUpdate(state, apiData) {
          console.log(apiData);
          state.typeahead = apiData;
        }
      },
      actions: {
        typeaheadAction(context, queryObj) {
          var getSearch = queryObj.searchTerm;
          var requestParams =
            "?q=" + getSearch + "&show_podcasts=1&show_genres=1&safe_mode=1";
          var requestParamsEncoded = encodeURI(requestParams);
          var requestOptions = {
            responseType: "json",
            validateStatus: function(status) {
              return status == 200;
            }
          };
          // TODO: clean up this response handler due to nested axios response data
          axios
            .get("/api/typeahead/" + requestParamsEncoded, requestOptions)
            .then(function(response) {
              if (response && response.data && response.data.data) {
                console.log(response);
                context.commit("typeaheadUpdate", response.data.data);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        }
      }
    }
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
