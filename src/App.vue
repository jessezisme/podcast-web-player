<template>
  <div v-cloak>
    <!-- header -->
    <BaseHeader></BaseHeader>
    <!-- page -->
    <main class="b_main">
      <router-view></router-view>
    </main>
    <!-- footer -->
    <BaseFooter></BaseFooter>
    <!-- audio player -->
    <BaseAudio></BaseAudio>
  </div>
</template>

<script>
// Vue
import Vue from 'vue/dist/vue.esm.js';
import BaseHeader from './components/base/BaseHeader.vue';
import BaseAudio from './components/base/BaseAudio.vue';

export default {
  name: 'App',
  // props: [""],
  data: function() {
    return {};
  },
  components: {
    // BaseAudio: BaseAudio
  },
  created: function() {
    this.metStoreEvents();
  },
  destroyed: function() {
    this.metStoreEvents(true);
  },
  methods: {
    metStoreEvents(_shouldRemove) {
      var self = this;
      /**
       *
       * Screen Width on Resize
       *
       */
      function screenSizeCallback(event) {
        var getScreenSize;
        var getScreenSizePixels = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (window.matchMedia('(min-width: 1200px)').matches) {
          getScreenSize = 'xl';
        } else if (window.matchMedia('(min-width: 992px)').matches) {
          getScreenSize = 'lg';
        } else if (window.matchMedia('(min-width: 768px)').matches) {
          getScreenSize = 'md';
        } else if (window.matchMedia('(min-width: 576px)').matches) {
          getScreenSize = 'sm';
        } else {
          getScreenSize = 'xs';
        }
        self.$store.dispatch('podUtil/actScreenWidth', {
          widthViewport: getScreenSize,
          widthPixels: getScreenSizePixels
        });
      }
      let setScreenWidth = _shouldRemove
        ? window.removeEventListener('resize', screenSizeCallback)
        : window.addEventListener('resize', screenSizeCallback);
      screenSizeCallback();

      /**
       *
       * Vertical Scroll Position
       *
       */
      /*
        Passive feature detection
      */
      // Test via a getter in the options object to see if the passive property is accessed
      var supportsPassive = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      // Use our detect's results. passive applied if supported, capture will be false either way.
      // elem.addEventListener('touchstart', fn, supportsPassive ? { passive: true } : false);
      /*
        /end passive feature detection
       */
      function scrollCallback(event) {
        self.$store.dispatch('podUtil/actScrollPos', window.scrollY);
      }
      let setScrollPos = _shouldRemove
        ? window.removeEventListener('scroll', scrollCallback, supportsPassive ? { passive: true } : false)
        : window.addEventListener('scroll', scrollCallback, supportsPassive ? { passive: true } : false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
