<template>
  <div>
    <div v-if="dataPod && dataPod.podcasts">
      <h3 class="car_genre">
        <slot></slot>
      </h3>
      <div class="car_wrap">
        <div class="car" v-on:scroll="scrollArrow">
          <div class="car_it" v-for="podcast in limitPodcasts(dataPod.podcasts, 20)" v-bind:key="podcast.id">
            <div class="car_it-in">
              <router-link :to="returnURL(podcast)" class="car_it-link">
                <div class="car_it-img-wrap">
                  <img
                    class="lazyload car_it-img"
                    v-bind:data-src="podcast.image"
                    v-bind:alt="podcast.title"
                    aria-hidden="true"
                  />
                </div>
                <div class="car_it-desc" v-if="podcast.id && podcast.description">
                  <div v-html="metHtmlToText(podcast.description, compScreenSize === 'xs' ? 50 : 100)"></div>
                </div>
                <span class="car_it-desc-link"> See More </span>
              </router-link>
            </div>
          </div>
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
//
import Util_url from '../../utils/util-url.js';

// https://github.com/werk85/node-html-to-text
import HtmlToText from 'html-to-text';
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
    /**
     *
     * convert html to text
     *
     */

    metHtmlToText: function(getHTML, _length) {
      let getText = HtmlToText.fromString(getHTML) || '';
      let getLength = _length ? _length : 100;
      getText = getText.length > getLength ? getText.slice(0, getLength) + '...' : getText;
      return getText;
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

    returnURL: function(podcast) {
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
  margin: 8px;
  padding: 15px;
  background: $color-grey-95;
  scroll-snap-align: start;
  border-radius: 8px;
  box-shadow: inset 0 0 4px 0px $color-accent-3;

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
    width: 16.666%;
    min-width: 16.666%;
  }
}
.car_it-in {
  width: 100%;
  height: 100%;
}
.car_it-img-wrap {
  position: relative;
  width: 100%;
  height: auto;
  margin: auto;
  max-width: 150px;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
}
.car_it-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  max-width: 150px;
  margin: auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.car_it-link {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.car_it-desc {
  flex-grow: 1;
  font-size: 0.85rem;
  padding: 8px;
}
.car_it-desc-link {
  padding: 8px;
  text-decoration: underline;
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
  color: $text_light;
}
</style>
