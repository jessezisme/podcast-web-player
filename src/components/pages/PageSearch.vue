<template>
  <div class="b_wrapper p-search">
    <!-- No Results -->
    <div v-if="compShowNoResults">
      <h1>No Results Found</h1>
      <p>Let's give another search a try.</p>
    </div>
    <!-- Results -->
    <div v-if="!compShowNoResults">
      <h1>Search Results</h1>
      <!-- Podcasts  -->
      <div v-if="compPodcastResults">
        <h2>Podcasts</h2>
        <div class="search_grid">
          <!-- component: card  -->
          <PodCard class="search_grid-item" v-for="podcast in compPodcastResults" v-bind:key="podcast.id">
            <!-- card hero image -->
            <template v-slot:slot-card-hero>
              <router-link
                :to="
                  metUtilUrl().podcastURL({
                    id: podcast.id,
                    title: podcast.title_original
                  })
                "
              >
                <img
                  class="lazyload"
                  v-bind:data-src="podcast.image"
                  v-bind:alt="podcast.podcast_title_original"
                  aria-hidden="true"
                />
              </router-link>
            </template>
            <!-- main text -->
            <template v-slot:slot-card-desc>
              <div v-if="podcast.id && podcast.description_original">
                <div
                  v-html="metUtilUrl().htmlToText(podcast.description_original, compScreenSize === 'xs' ? 50 : 100)"
                ></div>
              </div>
            </template>
            <!-- footer link/text -->
            <template v-slot:slot-card-footer>
              <router-link
                :to="
                  metUtilUrl().podcastURL({
                    id: podcast.id,
                    title: podcast.title_original
                  })
                "
              >
                See More
              </router-link>
            </template>
          </PodCard>
          <!-- end component: card -->
        </div>
        <div class="search_more" v-if="compPodcastRequestNextOffset">
          <button
            class="b_btn-large"
            v-bind:disabled="compPodcastRequestInProgress"
            v-on:click="metGetPodcast('podcast', 'next')"
          >
            Load More
          </button>
        </div>
      </div>
      <!-- Episodes -->
      <div v-if="compEpisodeResults">
        <h2>Episodes</h2>
        <PodCardEp v-for="ep in compEpisodeResults" v-bind:key="ep.id">
          <!-- title -->
          <template v-slot:slot-cardep-title>
            {{ ep.podcast_title_original }}
            <br />
            {{ ep.title_original }}
          </template>
          <!-- image -->
          <template v-slot:slot-cardep-thumb>
            <img class="lazyload" v-bind:data-src="ep.thumbnail" />
          </template>
          <!-- description -->
          <template v-slot:slot-cardep-desc>
            <span v-html="metUtilUrl().htmlToText(ep.description_original, 200)"></span>
          </template>
          <!-- date -->
          <template v-slot:slot-cardep-date>
            <span v-if="ep.pub_date_ms" v-html="metUtilUrl().datePrettyPrint(ep.pub_date_ms)"></span>
          </template>
          <!-- controls -->
          <template v-slot:slot-cardep-controls>
            <div class="ep_play">
              <button class="ep_play-btn" v-on:click="metPlayerPlayToggle($event, ep)">
                <span class="ep_play-btn-in">
                  <!-- pause: if -->
                  <span
                    aria-label="pause"
                    v-if="compPlayer.isPlaying && compPlayer.episode && compPlayer.episode.id == ep.id"
                  >
                    <i aria-hidden="true" class="far fa-pause-circle"></i>
                  </span>
                  <!-- play: else-->
                  <span aria-label="play" v-else>
                    <i aria-hidden="true" class="far fa-play-circle"></i>
                  </span>
                </span>
              </button>
            </div>
          </template>
        </PodCardEp>
        <div class="search_more" v-if="compEpisodeRequestNextOffset">
          <button
            class="b_btn-large"
            v-bind:disabled="compEpisodeRequestInProgress"
            v-on:click="metGetPodcast('episode', 'next')"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import PodCard from '../PodCard.vue';
import PodCardEp from '../PodCardEp.vue';
import Util_main from '../../../utils/util-main.js';

export default {
  name: 'PageSearch',
  props: ['routeSearch'],
  components: {
    PodCard: PodCard,
    PodCardEp: PodCardEp
  },
  data: function() {
    return {
      // flag for when created and destroyed; can be used to help computed props update on creation
      isLoaded: false,
      // podcast: results
      dataPodcast: [],
      // episode: results
      dataEpisodes: [],
      // log of all responses
      dataRequestLog: [],
      // request types in progress
      dataRequestsObj: {}
    };
  },
  computed: {
    /**
     * Player Audio from Vuex
     * necessary to know state of podcast audio
     */
    compPlayer() {
      return this.$store.state.podAudio.player || {};
    },
    compRouteSearchEncoded() {
      let getRouteSearch = this.routeSearch ? Util_main.encodeURL(this.routeSearch) : '';
      return getRouteSearch;
    },
    compShowNoResults() {
      let hasPodcasts = this.dataPodcast[0] && this.dataPodcast[0].results && this.dataPodcast[0].results.length;
      let hasEpisodes = this.dataEpisodes[0] && this.dataEpisodes[0].results && this.dataEpisodes[0].results.length;

      if (this.dataRequestLog >= 2 && !hasPodcasts && !hasEpisodes) {
        return true;
      } else {
        return false;
      }
    },
    compRoute() {
      return this.$route;
    },
    compPodcastResults() {
      const self = this;
      let podcastResults = [];

      self.dataPodcast.forEach((val) => {
        val.results &&
          val.results.length &&
          val.results.forEach((val) => {
            podcastResults.push(val);
          });
      });
      return podcastResults;
    },
    compPodcastRequestNextOffset() {
      let getLastResult = this.dataPodcast[this.dataPodcast.length - 1];
      let getNextOffset = getLastResult && getLastResult.next_offset ? getLastResult.next_offset : null;
      return getNextOffset;
    },
    compPodcastRequestInProgress() {
      return this.dataRequestsObj['podcast'] ? true : false;
    },
    compEpisodeResults() {
      const self = this;
      let episodeResults = [];

      self.dataEpisodes.forEach((val) => {
        val.results &&
          val.results.length &&
          val.results.forEach((val) => {
            episodeResults.push(val);
          });
      });
      return episodeResults;
    },
    compEpisodeRequestNextOffset() {
      let getLastResult = this.dataEpisodes[this.dataEpisodes.length - 1];
      let getNextOffset = getLastResult && getLastResult.next_offset ? getLastResult.next_offset : null;
      return getNextOffset;
    },
    compEpisodeRequestInProgress() {
      return this.dataRequestsObj['episode'] ? true : false;
    },
    compScreenSize() {
      let refreshHack = this.isLoaded;
      return this.$store.state.podUtil.screenWidth;
    }
  },
  watch: {
    /**
     * watch search query change
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
      // podcasts: clear
      this.dataPodcast = [];
      // episodes: clear
      this.dataEpisodes = [];
      // log of all responses
      this.dataRequestLog = [];
      // data request tracker
      this.dataRequestsObj = {};
      // get data
      this.metInitPage();
    },

    metUtilUrl: function() {
      return Util_main;
    },

    metInitPage: function() {
      const self = this;
      // get 2 podcast results
      self.metGetData().then(() => {
        self.metGetPodcast('next', 'podcast');
      });
      // get 2 episode results
      self.metGetData({ type: 'episode' }).then(() => {
        self.metGetPodcast('next', 'episode');
      });
    },

    metGetPodcast(_type, _action) {
      const self = this;
      // podcast
      _type === 'podcast' &&
        self.metGetData({
          type: 'podcast',
          offset: _action === 'next' && self.compPodcastRequestNextOffset ? self.compPodcastRequestNextOffset : 0
        });
      // episode
      _type === 'episode' &&
        self.metGetData({
          type: 'episode',
          offset: _action === 'next' && self.compEpisodeRequestNextOffset ? self.compEpisodeRequestNextOffset : 0
        });
    },
    /**
     * run data request
     */
    metGetData: function(_requestOverride) {
      const self = this;
      const getPath = this.compRoute.path;

      // build request params
      let requestParams = {
        q: self.compRouteSearchEncoded,
        type: 'podcast',
        // type: 'episode',
        language: 'English'
      };
      // override default params with any provided as arg
      if (_requestOverride) {
        requestParams = Object.assign(requestParams, _requestOverride);
      }
      /*
        Limit to 1 request at a time;
        check request object to see if request type is already in progress
      */
      if (self.dataRequestsObj[requestParams.type]) {
        return false;
      } else {
        // set property if not present
        self.$set(self.dataRequestsObj, requestParams.type, true);
      }

      // sucess cb
      function sucessCB(response) {
        let getData = response.data.success;
        // don't populate if page has changed sicne request was completed
        if (self.$route.path === self.compRoute.path) {
          // podcasts
          requestParams.type === 'podcast' && self.dataPodcast.push(getData);
          // episodes
          requestParams.type === 'episode' && self.dataEpisodes.push(getData);
          // push to log
          self.dataRequestLog.push({
            requestParams: requestParams,
            success: getData
          });
        }
      }
      // error cb
      function errorCB(error) {
        if (self.$route.path === self.compRoute.path) {
          self.dataRequestLog.push({
            requestParams: requestParams,
            error: error
          });
        }
      }
      // always run
      function alwaysCB() {
        if (self.$route.path === self.compRoute.path) {
          // delete request type once complete; property will be re-added on next request
          self.$delete(self.dataRequestsObj, requestParams.type);
        }
      }
      return Axios.get(Util_main.stringifyURL('/api/search/' + self.compRouteSearchEncoded, requestParams))
        .then(sucessCB)
        .catch(errorCB)
        .then(alwaysCB);
    },
    /**
     * Click play/pause button
     * dispatches to $store
     * -- toggles play state
     * -- if newly-played, adds podcast data to current podcast playing
     */
    metPlayerPlayToggle: function(event, _ep) {
      const self = this;
      let isPlaying = this.compPlayer && this.compPlayer.isPlaying && this.compPlayer.episode && this.compPlayer.episode.id == _ep.id;  

      let episode = Object.assign(_ep, {
        id: _ep.id,
        title: _ep.title_original,
        description: _ep.description_original,
        thumbnail: _ep.thumbnail,
        image: _ep.image,
        date: _ep.pub_date_ms,
        audio: _ep.audio,
        audio_length_sec: _ep.audio_length_sec
      });

      let podcast = Object.assign(
        {},
        {
          id: _ep.podcast_id,
          title: _ep.podcast_title_original,
          description: null,
          image: null,
          thumbnail: null
        }
      );
      isPlaying ? this.$root.$emit('player.pause', episode, podcast) : this.$root.$emit('player.play', episode, podcast);
    }
  },
  created: function() {
    this.isLoaded = true;
  },
  destroyed: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search_grid {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.search_grid-item {
  width: 50%;
  max-width: 195px;
}
.search_more {
  margin: 2rem auto;
  text-align: center;
}
</style>
