/**
 *
 * Homepage:
 * welcome home
 *
 */
// import PageHome from '../components/pages/PageHome.vue';
const Page404 = () => import(/* webpackChunkName: "page-404" */ '../components/pages/Page404.vue');

const Route404 = {
  name: 'Route404',
  path: '*',
  component: Page404,
  meta: {
    metaTags: [
      /**
       * no index
       */
      {
        name: 'robots',
        content: 'noindex'
      }
    ]
  }
};

export default Route404;
