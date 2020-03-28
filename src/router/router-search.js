/**
 *
 * Search Results:
 * for full search results
 *
 */
const PageSearch = () => import(/* webpackChunkName: "page-search" */ '../components/pages/PageSearch.vue');

const RouteSearch = {
  name: 'RouteSearch',
  path: '/search/:routeSearch',
  components: {
    default: PageSearch
  },
  // when props is set to true, the route.params will be set as the component props.
  props: {
    default: true
  },
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

export default RouteSearch;
