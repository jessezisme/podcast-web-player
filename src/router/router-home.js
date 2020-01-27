/**
 *
 * Homepage:
 * welcome home
 *
 */

// import PageHome from '../components/pages/PageHome.vue';
const PageHome = () => import(/* webpackChunkName: "page-home" */ '../components/pages/PageHome.vue');

const RouteHome = {
  name: 'home',
  path: '/',
  component: PageHome
};

export default RouteHome;
