import Vue from 'vue/dist/vue.esm.js';
import VueRouter from 'vue-router';
import '../style/style.scss';

import PageHome from '../components/pages/PageHome.vue';

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

Vue.use(VueRouter);

/**
 *
 * Routing
 *
 */
const routes = [
  {
    path: '/',
    component: PageHome
  }
];
const router = new VueRouter({
  routes: routes
});
/* end routing */

const app = new Vue({
  el: '#app',
  router: router,
  data: {
    test: 'testing'
  }
});
