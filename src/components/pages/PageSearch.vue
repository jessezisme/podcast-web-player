<template>
  <div class="b_wrapper p-search" v-if="dataIsFirstRequestComplete">
    <!-- no results -->
    <div v-if="!dataResponseSearch">
      <h1>No Results Found</h1>
      <p>Let's give another search a try.</p>
    </div>
    <!-- results success -->
    <div v-if="dataResponseSearch"></div>
  </div>
</template>

<script>
import Axios from 'axios';
// import PodCarousel from '../PodCarousel.vue';
import Util_url from '../../../utils/util-url.js';

export default {
  name: 'PageSearch',
  props: ['routeSearch'],
  // components: {
  //   PodCarousel: PodCarousel
  // },
  data: function() {
    return {
      dataIsFirstRequestComplete: false,
      dataResponsePodcasts: [],
      dataResponseEpisodes: []
    };
  },
  computed: {
    compRouteSearchEncoded() {
      let getRouteSearch = this.routeSearch ? Util_url.encodeURL(this.routeSearch) : '';
      return getRouteSearch;
    },
    compHasNoResults() {
      const hasNoResults = this.dataResponsePodcasts.length;
    }
  },
  watch: {
    /**
     * watch search query change (i.e. url change)
     */
    compRouteSearchEncoded: {
      // if page has change, run page change updates
      handler: function(newVal, oldVal) {
        if (!newVal || (newVal && newVal != oldVal)) {
          this.metPageChange();
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * page change handler
     */
    metPageChange: function() {
      // clear results
      this.dataResponseSearch = null;
      // clear flag used to show no results
      this.dataIsFirstRequestComplete = false;
      // get data
      this.metGetData();
    },
    /**
     * run data request
     */
    metGetData: function() {
      const self = this;
      const getSearchRequest = self.dataResponseSearch;
      let requestParams = {
        type: 'podcast'
      };

      function sucessCB(response) {
        console.log(response);
        // don't populate if page is has changed since request has completed
        if (getSearchRequest === self.dataResponseSearch) {
          self.dataResponseSearch = response.data.success;
        }
      }
      function errorCB(err) {
        console.log(err);
      }
      function alwaysCB() {
        self.dataIsFirstRequestComplete = true;
      }
      Axios.get(Util_url.stringifyURL('/api/search/' + self.compRouteSearchEncoded, requestParams))
        .then(sucessCB)
        .catch(errorCB)
        .then(alwaysCB);
    }
  },
  created: function() {},
  destroyed: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
