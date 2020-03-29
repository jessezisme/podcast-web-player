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
    title: '404. You done did it.',
    metaTags: []
  }
};

export default Route404;
