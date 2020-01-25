<template>
  <div>
    <div v-if="dataPod && dataPod.podcasts">
      <h3 class="car-genre">
        <slot></slot>
      </h3>
      <div class="car-wrap">
        <div class="car" v-on:scroll="scrollArrow">
          <div
            class="car-it"
            v-for="podcast in limitPodcasts(dataPod.podcasts, 20)"
            v-bind:key="podcast.id"
          >
            <div class="car-it-in">
              <router-link :to="returnURL(podcast)">
                <div class="car-it-img">
                  <img
                    class="lazyload"
                    v-bind:data-src="podcast.image"
                    v-bind:alt="podcast.title"
                    aria-hidden="true"
                  />
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="car-ctr-btn-wrap">
          <button
            class="car-ctr-btn is-left"
            v-on:click="slide($event, 'left')"
            v-bind:class="{ hidden: !showLeftArrow }"
          >
            <svg class="car-ctr-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm43.4 289.1c7.5 7.5 7.5 19.8 0 27.3-3.8 3.8-8.7 5.6-13.6 5.6s-9.9-1.9-13.7-5.7l-94-94.3c-6.9-7.6-6.7-19.3.6-26.6l95.4-95.7c7.5-7.5 19.7-7.6 27.3 0 7.5 7.5 7.6 19.7 0 27.3l-81.9 81 79.9 81.1z"
              />
            </svg>
          </button>
          <button
            class="car-ctr-btn is-right"
            v-on:click="slide($event, 'right')"
            v-bind:class="{ hidden: !showRightArrow }"
          >
            <svg class="car-ctr-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M48 256c0 114.9 93.1 208 208 208s208-93.1 208-208S370.9 48 256 48 48 141.1 48 256zm244.5 0l-81.9-81.1c-7.5-7.5-7.5-19.8 0-27.3s19.8-7.5 27.3 0l95.4 95.7c7.3 7.3 7.5 19.1.6 26.6l-94 94.3c-3.8 3.8-8.7 5.7-13.7 5.7-4.9 0-9.9-1.9-13.6-5.6-7.5-7.5-7.6-19.7 0-27.3l79.9-81z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
import Util_url from '../../utils/util-url.js';

// Axios
import Axios from 'axios';
// css scroll-behavior polyfill; needed to implement scroll-behavior smooth for unsupporting browsers
// https://github.com/wessberg/scroll-behavior-polyfill
import 'scroll-behavior-polyfill';

export default {
  name: 'PodCarousel',
  components: {},
  props: ['prop_genre_id'],
  data: function() {
    return {
      dataPod: null,
      // genre_id: unique category identifier; copy from prop directly to data
      genre_id: this.prop_genre_id,
      // arrows: display toggles
      showRightArrow: true,
      showLeftArrow: false
    };
  },
  computed: {},
  watch: {},
  mounted: function() {
    var self = this;
    // API Get Podcasts
    this.apiGetPodcasts();
  },
  methods: {
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

    returnURL: function(podcast) {
      console.log(podcast);
      return Util_url.podcastURL({
        id: podcast.id,
        title: podcast.title
      });
      return '/podcast';
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
      this.showLeftArrow = $getCar && $getFirstCarItem && parseInt($getFirstCarItem.getBoundingClientRect().left) < parseInt($getCar.getBoundingClientRect().left) ? true : false;
      /*
        right arrow:
        compare last item's right position against carousel's right position
      */
      this.showRightArrow = $getCar && $getLastCarItem && parseInt($getLastCarItem.getBoundingClientRect().right) > parseInt($getCar.getBoundingClientRect().right) ? true : false;
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
      var $getCarItems = $getCar.querySelectorAll('.car-it');

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
            $getCar.scrollLeft = $carItem.offsetLeft - $getCar.offsetLeft - ($getCar.getBoundingClientRect().width - $carItem.getBoundingClientRect().width);
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
.hidden {
  visibility: hidden;
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
.car-genre {
  padding: 0.5rem 0;
  font-size: 1.25rem;
}

.car-it {
  padding: 15px;
  scroll-snap-align: start;

  /*
    set carousel items per row
  */
  width: 50%;
  min-width: 50%;
  @media all and (min-width: 550px) {
    min-width: 33.3333333%;
    width: 33.3333333%;
  }
  @media all and (min-width: 768px) {
    width: 16.666%;
    min-width: 16.666%;
  }
}
.car-it-in {
  width: 100%;
  height: 100%;
  background: #000;
}
.car-it-img {
  padding-bottom: 100%;
  position: relative;

  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
}
.car-ctr-btn-wrap {
  display: flex;
  justify-content: center;
}
.car-ctr-btn {
  display: inline-block;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  line-height: 1em;
  overflow: hidden;

  padding: 5px;
}
.car-ctr-ic {
  width: 50px;
  height: 50px;
  fill: #fff;
}
</style>
