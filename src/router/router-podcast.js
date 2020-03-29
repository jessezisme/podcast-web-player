/**
 *
 * Podcast Landing Page:
 * the page for dedicated for individual podcast display
 *
 */

// import PagePodcast from '../components/pages/PagePodcast.vue';
const PagePodcast = () => import(/* webpackChunkName: "page-podcast" */ '../components/pages/PagePodcast.vue');

const RoutePodcast = {
  name: 'RoutePodcast',
  path: '/podcast/:routeName/:routeID',
  components: {
    default: PagePodcast
  },
  // when props is set to true, the route.params will be set as the component props.
  props: {
    default: true
  },
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

export default RoutePodcast;
