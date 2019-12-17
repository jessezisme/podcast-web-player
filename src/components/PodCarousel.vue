<template>
  <div>
    <div class="car">
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
    <button v-on:click="slide($event, 'left')">slide left</button>
    <button v-on:click="slide($event, 'right')">slide right</button>
  </div>
</template>

<script>
// https://www.npmjs.com/package/animated-scroll-to
import animateScrollTo from "animated-scroll-to";

export default {
  name: "PodCarousel",
  props: [],
  components: {
    // BaseHeader: BaseHeader
  },
  methods: {
    /**
     * handles carousel sliding
     */
    slide: function(event, direction) {
      var $getCar = this.$el.querySelector(".car");
      var getCarBounding = $getCar ? $getCar.getBoundingClientRect() : null;
      var $getCarItems = document.querySelectorAll(".car-it");

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
        // uses scroll-to module
        animateScrollTo([scrollPos, null], {
          elementToScroll: $getCar,
          minDuration: 125,
          speed: 80,
          easing: t => {
            return t * t;
          }
        }).then(hasScrolledToPosition => {
          // scroll animation is finished
          // "hasScrolledToPosition" indicates if page/element
          // was scrolled to a desired position
          // or if animation got interrupted
          if (hasScrolledToPosition) {
            // page is scrolled to a desired position
          } else {
            // scroll animation was interrupted by user
            // or by another call of "animateScrollTo"
          }
        });

        // $getCar.scrollLeft = scrollPos;
      }
      /*
        sliding right: 
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
<style lang="scss">
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
</style>
