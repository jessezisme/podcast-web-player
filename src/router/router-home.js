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
    title: 'PodNexus: Podcast Web Player Demo',
    metaTags: [
      {
        name: 'description',
        content: 'Find your next favorite podcast.'
      }
    ]
  }
};

export default RouteHome;
