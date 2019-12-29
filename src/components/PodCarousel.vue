<template>
  <div>
    <div class="car-genre">
      <p>
        <slot></slot>
      </p>
    </div>
    <div class="car" v-on:scroll="scrollArrow">
      <div class="car-it">
        <div class="car-it-in">1</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">2</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">3</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">4</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">5</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">6</div>
      </div>
      <div class="car-it">
        <div class="car-it-in">7</div>
      </div>
    </div>
    <button class="car-ctr-btn is-left" v-on:click="slide($event, 'left')" v-show="showLeftArrow">
      <svg class="car-ctr-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm43.4 289.1c7.5 7.5 7.5 19.8 0 27.3-3.8 3.8-8.7 5.6-13.6 5.6s-9.9-1.9-13.7-5.7l-94-94.3c-6.9-7.6-6.7-19.3.6-26.6l95.4-95.7c7.5-7.5 19.7-7.6 27.3 0 7.5 7.5 7.6 19.7 0 27.3l-81.9 81 79.9 81.1z"
        />
      </svg>
    </button>
    <button class="car-ctr-btn is-right" v-on:click="slide($event, 'right')" v-show="showRightArrow">
      <svg class="car-ctr-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M48 256c0 114.9 93.1 208 208 208s208-93.1 208-208S370.9 48 256 48 48 141.1 48 256zm244.5 0l-81.9-81.1c-7.5-7.5-7.5-19.8 0-27.3s19.8-7.5 27.3 0l95.4 95.7c7.3 7.3 7.5 19.1.6 26.6l-94 94.3c-3.8 3.8-8.7 5.7-13.7 5.7-4.9 0-9.9-1.9-13.6-5.6-7.5-7.5-7.6-19.7 0-27.3l79.9-81z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
// https://github.com/wessberg/scroll-behavior-polyfill
// css scroll-behavior polyfill; needed to implement scroll-behavior smooth for unsupporting browsers
import "scroll-behavior-polyfill";

export default {
  name: "PodCarousel",
  components: {},
  props: ["prop_genre_id"],
  data: function() {
    return {
      // genre_id: unique category identifier; copy from prop directly to data
      genre_id: this.prop_genre_id,
      // arrows: display toggles
      showRightArrow: false,
      showLeftArrow: false
    };
  },
  computed: {
    /*
      Vuex best podcast data store: 
      return data from vuex best-podcast store 
    */
    compStorePodcastData() {

      
      console.log("COMPUTING");
      var z = this.$store.state; 
      var y = this.$store.state.podAPI;
      var x = this.$store.state.podAPI.bestPodcasts;
      var getGenreID = this.genre_id ? this.genre_id + "" : null;
      // bestPodcasts object properties are namespaced by "genre_[genre-id]" (i.e. "genre_22")
      var getStoreData = 
      console.log(x);
      console.log(getStoreData);
      console.log(this.$store.state.podAPI.bestPodcasts);
      console.log(this.$store.state.podAPI.bestPodcasts["genre_85"])
      return this.$store.state.podAPI.bestPodcasts["genre_85"];
    }
  },
  mounted: function() {
    var self = this;
    // API Get Podcasts
    this.apiGetPodcasts();
    // Arrows: run of nextTick to check if arrows should be shown;
    this.$nextTick().then(self.scrollArrow);
  },
  methods: {
    /**
     *
     * API Get Podcasts:
     * dispatch event to Vuex to retrieve best-podcasts
     * @param {string} vuex module action
     * @param {obj} vuex context object - pass in genre_id
     *
     */
    apiGetPodcasts: function() {
      function runAPI() {
        this.$store.dispatch("podAPI/bestPodcastsAction", {
          genre_id: this.genre_id
        });
      }
      this.genre_id && !this.compStorePodcastData ? runAPI.call(this) : false;
    },

    /**
     *
     * Arrows: next/previous
     * runs check to determine if left/right arrows should be shown
     *
     */
    scrollArrow: function(event) {
      var self = this;

      function scrollCallback() {
        var $getCar = this.$el.querySelector(".car");
        var $getLastCarItem = $getCar.querySelector("div.car-it:last-of-type");
        // left arrow: don't show if carousel is scrolled completely to left
        this.showLeftArrow = $getCar && $getCar.scrollLeft != 0 ? true : false;
        // right arrow: don't show if last carousel item is within bounds of carousel
        this.showRightArrow = $getCar && $getLastCarItem && $getLastCarItem.getBoundingClientRect().right >= $getCar.getBoundingClientRect().right ? true : false;
      }
      this.$el.querySelector(".car") && scrollCallback.call(self);
    },
    /**
     *
     * Carousel Sliding:
     * handles moving the carousel
     *
     */
    slide: function(event, direction) {
      var $getCar = this.$el.querySelector(".car");
      var getCarBounding = $getCar ? $getCar.getBoundingClientRect() : null;
      var $getCarItems = $getCar.querySelectorAll(".car-it");

      // exit if no carousel container
      if (!$getCar) {
        return false;
      }
      /*
        scroll to element:
        get carousel left bounding; compares against el item left bounding;
        the difference is used to set scroll position
      */
      function scrollToElement($carItem) {
        var carLeftPos = parseInt(getCarBounding.left);
        var itemLeftPos = parseInt($carItem.getBoundingClientRect().left);
        var scrollPos = itemLeftPos - carLeftPos;
        $getCar.scrollLeft = scrollPos;
      }
      /*
        slide right:
        check right-bounding of carousel; and find first element outside of bounds to right
      */
      function slideRight() {
        for (let $carItem of $getCarItems) {
          if ($carItem.getBoundingClientRect().right > getCarBounding.right) {
            scrollToElement($carItem);
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
            scrollToElement($carItem);
          }
        }
      }
      direction == "right" ? slideRight() : slideLeft();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}
.car-it {
  width: 25%;
  min-width: 25%;
  height: 200px;
  padding: 15px;
  scroll-snap-align: start;
}
.car-it-in {
  width: 100%;
  height: 100%;
  background: gray;
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
}
.car-ctr-ic {
  width: 50px;
  height: 50px;
  fill: #fff;
}
</style>
