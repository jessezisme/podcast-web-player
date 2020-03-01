<template>
  <main class="b_wrapper">
    <!-- # podcast intro # -->
    <div class="intro" v-if="compPodDetails">
      <div class="intro_img-wrap">
        <div class="intro_img-in">
          <img
            class="intro_img lazyload"
            v-bind:data-src="compPodDetails.image"
            alt="Featured image of podcast"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="intro_det">
        <h1 class="intro_title" v-if="compPodDetails.publisher">{{ compPodDetails.publisher }}</h1>
        <p class="intro_sum" v-if="compPodDetails.description" v-html="metHtmlCleanToText(compPodDetails.description)"></p>
        <p class="intro_more">
          <a
            class="intro_more-link"
            title="Link to external podcast site"
            target="_blank"
            v-if="compPodDetails.website"
            v-bind:href="compPodDetails.website"
          >
            <i aria-hidden="true" class="fas fa-link"></i>
            <span class="intro_more-link-label">Web</span>
          </a>
        </p>
      </div>
    </div>
    <!-- /end # podcast intro # -->
    <!-- # podcast episodes # -->
    <div class="eps" v-if="compPodResults && compPodResults.length">
      <div v-for="result in compPodResults" v-bind:key="result._customRequestTime">
        <div v-if="result.episodes && result.episodes.length">
          <!-- episode -->
          <div class="ep" v-for="ep in result.episodes" v-bind:key="ep.id">
            <div class="ep_sum">
              <h3 tabindex="0" class="ep_title">{{ ep.title || '' }}</h3>
              <p class="ep_desc" v-if="ep.description">
                <span class="ep_thumb-wrap">
                  <img class="ep_thumb lazyload" v-bind:data-src="ep.thumbnail" />
                </span>
                <span v-html="methLimitStringLength(metHtmlCleanToText(ep.description), 200)"></span>
              </p>
            </div>
            <div class="ep_date">
              <span v-if="ep.pub_date_ms" v-html="methDatePrettyPrint(ep.pub_date_ms)"></span>
            </div>
            <div class="ep_play">
              <button class="ep_play-btn" v-on:click="metPlayerPlayToggle($event, ep)">
                <span class="ep_play-btn-in">
                  <!-- pause: if -->
                  <span
                    aria-label="play"
                    v-if="compPlayer.isPlaying && compPlayer.podcast && compPlayer.podcast.id == ep.id"
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
          </div>
          <!-- /end episode -->
        </div>
      </div>
    </div>
    <!-- # /end podcast episodes # -->
    <!-- # next/load more # -->
    <div class="eps_more" v-if="compNextResult">
      <button class="eps_more-btn" v-on:click="metGetMoreEps">
        Load More
      </button>
    </div>
    <!-- /end next/load more -->
  </main>
</template>

<script>
import BaseAudio from '../base/BaseAudio.vue';
import Axios from 'axios';

import PodCarousel from '../PodCarousel.vue';
import Util_url from '../../../utils/util-url.js';

export default {
  name: 'PagePodcast',
  props: ['routeID'],
  components: {
    PodCarousel: PodCarousel
  },
  data: function() {
    return {
      /**
       * Request in progress check
       * flag to check if request is in progress
       */
      dataRequestInProgress: false,
      /**
       * Request Options
       * used as params in request
       */
      dataRequestOpt: {
        // used for pagination; each request returns this, if more eps available
        next_episode_pub_date: null,
        // sort options
        sort: 'recent_first'
      },
      /**
       * Podcast details
       * populated and returned by computed based on result data
       */
      dataPodDetails: {},
      /**
       * Podcast data results
       * raw, unformatted; used by computed for formatting, filtering, etc...
       */
      dataPodResults: []
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
    /**
     * ID, unique for each podcast; passed from router;
     */
    dataPodID() {
      return this.routeID;
    },
    /**
     * Podcast Details
     * used by computed for lead feature display of podcast info;
     * any podcast result contains all the information necessary to display intro podcast details section
     */
    compPodDetails() {
      var dataPodID = this.dataPodID;
      var dataPodDetails = this.dataPodDetails;
      var dataPodResults = this.dataPodResults;
      var dataPodResultsItem = this.dataPodResults.find((val) => val.id == dataPodID) || {};

      if (dataPodResultsItem.id && dataPodResultsItem.id == dataPodID) {
        this.dataPodDetails = dataPodResultsItem;
      } else {
        this.dataPodDetails = {};
      }
      return this.dataPodDetails;
    },
    compPodResults() {
      // TODO: NEED TO ADD FILTERS HERE
      const dataPodResults = this.dataPodResults || [];
      return dataPodResults || [];
    },
    /*
      Pagination next result:
      listennotes includes a 'next_episode_pub_date' prop if more results are available;
      get from last request result
    */
    compNextResult() {
      const getLastResult =
        this.compPodResults && this.compPodResults[this.compPodResults.length - 1]
          ? this.compPodResults[this.compPodResults.length - 1]
          : null;
      const getNextResult =
        getLastResult && getLastResult.next_episode_pub_date ? getLastResult.next_episode_pub_date : null;
      return getNextResult;
    }
  },
  watch: {
    dataPodID: {
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
     * Page changes
     * run on every page change
     */
    metPageChange: function() {
      // clear podcast results
      this.metClearDataResults();
      // get new podcast data
      this.metPodGetData();
    },
    /**
     * Clear results
     */
    metClearDataResults: function() {
      this.dataPodResults = [];
    },
    /**
     * Parses html to text string
     */
    metHtmlCleanToText: function(getHtmlStr) {
      var temp = new DOMParser().parseFromString(getHtmlStr, 'text/html');
      return temp.body.textContent || '';
    },
    /**
     * Helper to limit string length
     */
    methLimitStringLength: function(_getString, _length) {
      let getString = _getString || '';
      return getString.slice(0, _length + 1) + '...';
    },
    /**
     * Converts timestamp to readable data
     * @param {number} timestamp
     */
    methDatePrettyPrint: function(_getTime) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const dateObj = new Date(_getTime);
      let dateText = '';
      if (_getTime) {
        dateText += monthNames[dateObj.getMonth()];
        dateText += ' ' + dateObj.getDate() + ',' + ' ';
        dateText += dateObj.getFullYear();
      }
      return dateText;
    },
    /**
     * Click play/pause button
     * dispatches to $store
     * -- toggles play state
     * -- if newly-played, adds podcast data to current podcast playing
     */
    metPlayerPlayToggle: function(event, _ep) {
      var isPlaying = this.compPlayer && this.compPlayer.isPlaying;
      isPlaying ? this.$root.$emit('player.pause', _ep) : this.$root.$emit('player.play', _ep);
    },
    /**
     * load more paginated episodes
     */
    metGetMoreEps: function() {
      const self = this;
      // only run request in next-result exists
      if (self.compNextResult) {
        // run request
        this.metPodGetData({
          next_episode_pub_date: self.compNextResult
        });
      }
    },
    /**
     * Gets podcast data
     * @param {Object} _requestParamsOverride - request options, which will override saved/default request options
     *  -- used by next/load-more feature
     */
    metPodGetData: function(_requestParamsOverride) {
      const self = this;
      let requestParams = {};
      // builds request options based on current request option data
      Object.keys(self.dataRequestOpt).forEach((_val) => {
        // remove any options which are null
        if (self.dataRequestOpt[_val] != null) {
          requestParams[_val] = self.dataRequestOpt[_val];
        }
      });
      // add any custom data to be added to final data, after response
      let customProps = {
        _customRequestTime: new Date().getTime()
      };
      /*
        a param can be provided;
        it will override any of the default config options
      */
      if (_requestParamsOverride) {
        requestParams = Object.assign(requestParams, _requestParamsOverride);
      }
      // run podcast request
      function runRequest() {
        return Axios.get(Util_url.stringifyURL('/api/podcast/' + self.dataPodID, requestParams))
          .then((response) => {
            let finalData = Object.assign(response.data.success, customProps);
            self.dataPodResults.push(finalData);
            // turn off flag
            self.dataRequestInProgress = false;
          })
          .catch((err) => {
            // turn off flag
            self.dataRequestInProgress = false;
            console.log(err);
          });
      }
      // run request; flip boolean flags to check if in-progress
      if (!self.dataRequestInProgress) {
        // turn on flag
        self.dataRequestInProgress = true;
        runRequest();
      }
    }
  },
  created: function() {},
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';

svg {
  fill: #fff;
}

/*=============================================
=            intro             =
=============================================*/
/*----------  image and description  ----------*/
.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.intro_img-wrap {
  padding: 15px;
  width: 100%;
  max-width: 300px;
}
.intro_img-in {
  position: relative;
  width: 100%;
  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
}
.intro_img {
  position: absolute;
  width: 100%;
  max-width: 100%;
  display: block;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.intro_det {
  padding: 15px;
  flex: 1;

  @media all and (max-width: 767px) {
    width: 100%;
    flex-basis: 100%;
  }
}
.intro_title {
  padding-top: 0;
  font-size: 1.5rem;
  font-weight: normal;
}
.intro_sum {
  max-width: 60em;
}
/*----------  additional links section  ----------*/
.intro_more {
  display: flex;
}
.intro_more-link {
  display: inline-flex;
  align-items: center;
  padding-right: 10px;
}
.intro_more-link-label {
  display: inline-block;
  padding-left: 5px;
  font-size: 0.8rem;
}
.intro_more svg {
  width: 25px;
  height: 25px;
}
/*=====  End of intro image and description  ======*/

/*=============================================
=            Episode cards            =
=============================================*/
.ep {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 30px 0;
  padding: 30px;
  background: $color-grey-95;
}
.ep_sum {
  width: 100%;
}
.ep_title,
.ep_desc {
  padding-top: 0;
  padding-bottom: 5px;
}
.ep_title {
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 5px;
}
.ep_thumb-wrap {
  max-width: 65px;
  float: left;
  padding: 0 10px 10px 0;
}
.ep_thumb {
  max-width: 100%;
}
.ep_desc {
  font-size: 0.85rem;
}
.ep_play {
  display: inline-flex;
}
.ep_play-btn {
  position: relative;
  width: 60px;
  height: 60px;
  padding: 0;
  font-size: 2.65rem;
  background: transparent;
  /* reset button styles */
  appearance: none;
  border: none;
}
.ep_date {
  font-size: 0.85rem;
}
.ep_play-btn-in {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media all and (min-width: 650px) {
  .ep_sum {
    width: 60%;
  }
}
/*=====  End of Episode cards  ======*/
</style>
