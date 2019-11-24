import Vue from 'vue/dist/vue.esm.js';
import Home from '../components/pages/PageHome.vue'; 
import VueRouter from 'vue-router'; 
import '../style/style.scss';

Vue.use(VueRouter); 

/**
 *
 * Routing 
 *
 */
const routes = [
  {
    path: '/', component: Home
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
  // ,
  // components: {
  //   'hello-world': HelloWorld
  // }

})
