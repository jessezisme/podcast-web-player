/*
  Polyfill: ES6 Promises
  for Vuex, babel will not recognize the need for Promises and automatically include based on usage; 
 */
import 'es6-promise/auto';
// Vue
import Vue from 'vue/dist/vue.esm.js';
// Vue app component
import App from '../App.vue';
// Vue Router
import Router from '../router/router';
// Vuex Store
import Store from '../store/store';
// Axios: ajax calls
import Axios from 'axios';
// lazysizes: lazyloads images
import LazySizes from 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

/**
 *
 * Register Global Components:
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

  requireComponent.keys().forEach((fileName) => {
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
 * Vue initialize:
 *
 */
const app = new Vue({
  // el: "#app",
  render: (h) => h(App),
  store: Store,
  router: Router,
  data: {
    test: 'testing'
  }
}).$mount('#app');
