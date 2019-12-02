<template>
  <div class="wrap" v-bind:class="{ active: isFocused }">
    <form>
      <div class="bar form-group">
        <label for="app-search-input" class="p-sr-only"> Search Podcasts </label>
        <i class="icon icon-search" aria-hidden="true"></i>
        <input id="app-search-input" class="form-input" placeholder="Search Podcasts" type="search" autocomplete="off" v-model="query" v-on:keyup="queryUpdate" v-on:focus="onFocus" v-on:blur="onBlur" />
      </div>
      <div class="res" v-show="isFocused">
        <span class="pod-sr-only"> Results </span>
        <ul class="res-list" role="listbox" v-if="storePodcastData && storePodcastData.podcasts && podcasts && storePodcastData.podcasts.length">
          <li class="res-item" role="option" tabindex="0" v-for="podcast in storePodcastData.podcasts" v-on:focus="onFocus" v-on:blur="onBlur"></li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'debounce';

var mock = {
  terms: ['star wars episode i the phantom menace', 'star wars'],
  genres: [
    {
      id: 160,
      name: 'Star Wars',
      parent_id: 68
    }
  ],
  podcasts: [
    {
      title_highlighted: 'Rebel Force Radio: <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Podcast',
      title_original: 'Rebel Force Radio: Star Wars Podcast',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: 'Star Wars',
      image: 'https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg',
      id: 'ca3b35271db04291ba56fab8a4f731e4',
      explicit_content: false
    },
    {
      title_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Explained',
      title_original: 'Star Wars Explained',
      publisher_highlighted: 'Alex & Mollie',
      publisher_original: 'Alex & Mollie',
      image: 'https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg',
      id: '699701ca2479411f9c0bbf8dd85323e8',
      explicit_content: false
    },
    {
      title_highlighted: 'Inside <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      title_original: 'Inside Star Wars',
      publisher_highlighted: 'Wondery',
      publisher_original: 'Wondery',
      image: 'https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg',
      id: '8e90b8f0c9eb4c11b13f9dc331ed747c',
      explicit_content: false
    },
    {
      title_highlighted: 'Skytalkers',
      title_original: 'Skytalkers',
      publisher_highlighted: 'Charlotte Errity & Caitlin Plesher - <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: 'Charlotte Errity & Caitlin Plesher - Star Wars',
      image: 'https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg',
      id: '46c50b17a1c6474fb77e21f438ccd78d',
      explicit_content: false
    },
    {
      title_highlighted: 'The Mindalorian',
      title_original: 'The Mindalorian',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Minute',
      publisher_original: 'Star Wars Minute',
      image: 'https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg',
      thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg',
      id: 'cc1fd08a83084c06b6040748aa50a285',
      explicit_content: false
    }
  ]
};

export default {
  name: 'BaseSearch',
  data: function() {
    return {
      query: '',
      queryDebounced: '',
      queryDebouncedURI: '',
      isFocused: false,
      focusClass: 'is-focus',
    };
  },
  computed: {
    storePodcastData() {
      console.log(this.$store);
      console.log(this.$store.state.podAPI);
      var getData = this.$store.state.podAPI.typeahead; ,
      if (getData && getData.length) {
        return getData; 
      }
      return null;
    }
  },
  components: {},
  created: function() {
    function getQuery() {
      this.queryDebounced = this.query;
    }
    this.runQueryDebounced = debounce(getQuery, 400);
  },
  watch: {
    query: function(newValue, oldValue) {
      this.runQueryDebounced();
    },
    queryDebounced: function(newValue, oldValue) {
      this.getPodcasts();
    }
  },

  methods: {
    onFocus: function(event) {
      this.isFocused = true;
      event.target && event.target.classList.add(this.focusClass);
    },
    onBlur: function(event) {
      var $getEl = this.$el;
      var self = this;
      event.target && event.target.classList.remove(self.focusClass);
      window.setTimeout(function() {
        if ($getEl && $getEl.querySelector(self.focusClass)) {
          self.isFocused = true;
        } else {
          self.isFocused = false;
        }
      }, 40);
    },
    queryUpdate: function(event) {
      this.query = event.target.value;
    },
    getPodcasts: function() {
      var getQuery = this.queryDebounced;
      this.$store.dispatch('podAPI/typeaheadAction', {
        searchTerm: getQuery
      });
      // console.log("typing")
      // var queryEncoded = encodeURI(this.queryDebounced);
      // var requestParams = "?q=" + this.queryDebounced + "&show_podcasts=1&show_genres=1&safe_mode=1";
      // var requestParamsEncoded = encodeURI(requestParams);
      // axios.get("/api/typeahead/" + requestParamsEncoded).then(function(response) {
      //   console.log(response.data);
      // });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
  list-style-type: none;
}
</style>
