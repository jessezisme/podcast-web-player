<template>
  <div>
    <div v-if="dataPod && dataPod.podcasts">
      <h3 class="car_genre">
        <slot></slot>
      </h3>
      <div class="car_wrap">
        <div class="car" v-on:scroll="scrollArrow">
          <!-- component: card  -->
          <PodCard class="car_it" v-for="podcast in limitPodcasts(dataPod.podcasts, 20)" v-bind:key="podcast.id">
            <!-- card hero image -->
            <template v-slot:slot-card-hero>
              <router-link :to="metReturnURL(podcast)">
                <img
                  class="lazyload car_it-img"
                  v-bind:data-src="podcast.image"
                  v-bind:alt="podcast.title"
                  aria-hidden="true"
                />
              </router-link>
            </template>
            <!-- main text -->
            <template v-slot:slot-card-desc>
              <div v-if="podcast.id && podcast.description">
                <div v-html="metUtilMain().htmlToText(podcast.description, compScreenSize === 'xs' ? 50 : 100)"></div>
              </div>
            </template>
            <!-- footer link/text -->
            <template v-slot:slot-card-footer>
              <router-link :to="metReturnURL(podcast)">
                See More
              </router-link>
            </template>
          </PodCard>
          <!-- end component: card -->
        </div>
        <div class="car_ctr-btn-wrap">
          <button
            class="car_ctr-btn is-left"
            aria-label="Previous"
            v-on:click="slide($event, 'left')"
            v-bind:class="{ 'not-visible': !showLeftArrow }"
          >
            <i aria-hidden="true" class="fas fa-chevron-left"></i>
          </button>
          <button
            aria-label="Next"
            class="car_ctr-btn is-right"
            v-on:click="slide($event, 'right')"
            v-bind:class="{ 'not-visible': !showRightArrow }"
          >
            <i aria-hidden="true" class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- Card Display -->
  </div>
</template>

<script>
/*
  modules:
*/
// Axios
import Axios from 'axios';
// css scroll-behavior polyfill; needed to implement scroll-behavior smooth for unsupporting browsers
// https://github.com/wessberg/scroll-behavior-polyfill
import 'scroll-behavior-polyfill';
/*
  components:
*/
import PodCard from './PodCard.vue';
/*
  utilities:
*/
import Util_main from '../../utils/util-main.js';

export default {
  name: 'PodCarousel',
  components: {
    PodCard: PodCard
  },
  props: ['prop_genre_id'],
  data: function() {
    return {
      // flag for when created and destroyed; can be used to help computed props update on creation
      isLoaded: false,
      dataPod: null,
      // genre_id: unique category identifier; copy from prop directly to data
      genre_id: this.prop_genre_id,
      // arrows: display toggles
      showRightArrow: true,
      showLeftArrow: false
    };
  },
  computed: {
    compScreenSize() {
      let refreshHack = this.isLoaded;
      return this.$store.state.podUtil.screenWidth;
    }
  },
  created: function() {
    this.isLoaded = true;
  },
  destroyed: function() {
    this.isLoaded = false;
  },
  mounted: function() {
    var self = this;
    // API Get Podcasts
    this.apiGetPodcasts();
  },
  methods: {
    metUtilMain: function() {
      return Util_main;
    },

    metReturnURL: function(podcast) {
      return this.metUtilMain().podcastURL({
        id: podcast.id,
        title: podcast.title
      });
    },
    /**
     *
     * Limit podcast size
     * @param {array} _podcasts - podcast data
     * @param {number} _length - max length
     *
     */
    limitPodcasts: function(_podcasts, _length) {
      return _podcasts.slice(0, _length);
    },
    /**
     *
     * API Get Podcasts
     *
     */
    apiGetPodcasts: function() {
      var self = this;
      let requestParams = {
        genre_id: self.genre_id,
        page: 1,
        safe_mode: 1,
        region: 'us'
      };
      function setData(response) {
        self.dataPod = response.data.success;
      }
      function runAPI() {
        Axios.get('/api/best-podcasts', {
          params: requestParams
        }).then(setData);
      }
      if (this.genre_id && !this.dataPod) {
        runAPI();
      }
    },

    /**
     *
     * Arrows: next/previous
     * runs check to determine if left/right arrows should be shown
     *
     */
    scrollArrow: function(event) {
      var self = this;
      var $getCar = this.$el.querySelector('.car');
      var $getFirstCarItem = $getCar.querySelector('.car > div:first-of-type');
      var $getLastCarItem = $getCar.querySelector('.car > div:last-of-type');
      /*
        left arrow:
        compare first item's left position against carousel's left position
      */
      this.showLeftArrow =
        $getCar &&
        $getFirstCarItem &&
        parseInt($getFirstCarItem.getBoundingClientRect().left) < parseInt($getCar.getBoundingClientRect().left)
          ? true
          : false;
      /*
        right arrow:
        compare last item's right position against carousel's right position
      */
      this.showRightArrow =
        $getCar &&
        $getLastCarItem &&
        parseInt($getLastCarItem.getBoundingClientRect().right) > parseInt($getCar.getBoundingClientRect().right)
          ? true
          : false;
    },
    /**
     *
     * Carousel Sliding:
     * handles moving the carousel
     *
     */
    slide: function(event, direction) {
      var $getCar = this.$el.querySelector('.car');
      var getCarBounding = $getCar ? $getCar.getBoundingClientRect() : null;
      var $getCarItems = $getCar.querySelectorAll('.car_it');

      /*
        slide right:
        check right-bounding of carousel; find first element outside of bounds to right
      */
      function slideRight() {
        for (let $carItem of $getCarItems) {
          if ($carItem.getBoundingClientRect().right > getCarBounding.right) {
            $getCar.scrollLeft = $carItem.offsetLeft - $getCar.offsetLeft;
            break;
          }
        }
      }
      /*
        slide left:
        check left-bounding of carousel; find first element, of node list in REVERSE, outside of bounds to left;
      */
      function slideLeft() {
        // reverse node list; necessary when going left
        var $getCarItemsReverseOrder = [];
        for (let $carItem of $getCarItems) {
          $getCarItemsReverseOrder.unshift($carItem);
        }
        // use reversed node list
        for (let $carItem of $getCarItemsReverseOrder) {
          if ($carItem.getBoundingClientRect().left < getCarBounding.left) {
            $getCar.scrollLeft =
              $carItem.offsetLeft -
              $getCar.offsetLeft -
              ($getCar.getBoundingClientRect().width - $carItem.getBoundingClientRect().width);
            break;
          }
        }
      }
      /*
        run sliding:
        check if carousel is defined before
      */
      if ($getCar) {
        direction && direction.toLowerCase() === 'right' && slideRight();
        direction && direction.toLowerCase() === 'left' && slideLeft();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../style/base/_variables.scss';

.hidden {
  display: none;
}
.not-visible {
  visibility: hidden;
}
.car a {
  text-decoration: none;
}
.car,
.car-item {
  scroll-behavior: smooth;
}
.car {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
  align-items: stretch;
  // reveal additional items
  padding-right: 30px;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}
.car_genre {
  padding: 0.5rem 0;
  font-size: 1.25rem;
}
.car_it {
  scroll-snap-align: start;
  /*
    set carousel items per row
  */
  width: 50%;
  min-width: 50%;

  @media all and (min-width: 768px) {
    min-width: 33.3333333%;
    width: 33.3333333%;
  }
  @media all and (min-width: 992px) {
    min-width: 20%;
    width: 20%;
  }
  @media all and (min-width: 1337px) {
    width: 185px;
    min-width: 185px;
  }
}
.car_ctr-btn-wrap {
  display: flex;
  justify-content: center;
}
.car_ctr-btn {
  display: inline-block;
  -webkit-appearance: none;
  margin: 0;
  padding: 5px 25px;
  border: none;
  background: transparent;
  line-height: 1em;
  overflow: hidden;
  font-size: 2rem;
  color: $text-light;
}
</style>
