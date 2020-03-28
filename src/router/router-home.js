/**
 *
 * Homepage:
 * welcome home
 *
 */
// import PageHome from '../components/pages/PageHome.vue';
const PageHome = () => import(/* webpackChunkName: "page-home" */ '../components/pages/PageHome.vue');

const RouteHome = {
  name: 'RouteHome',
  path: '/',
  component: PageHome,
  meta: {
    metaTags: [
      {
        name: 'description',
        content: 'Search and listen to all your favorite podcasts.'
      }
    ]
  }
};

export default RouteHome;
