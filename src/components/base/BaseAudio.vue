<template>
  <div class="aud" v-show="comPodcast" v-bind:class="{ 'is-active': comPodcast }">
    <div class="aud-prog-wrap"></div>
    <div class="aud-title"></div>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js';
import { Howl, Howler } from 'howler';

export default {
  name: 'BaseAudio',
  // props: [""],
  components: {},
  data: function() {
    return {
      isLoaded: false,
      isMounted: false,
      /*
        player controls
      */
      player: null,
      playerIntervalChecks: []
    };
  },
  computed: {
    /*
      returns currently requested podcast from vuex
    */
    comPodcast() {
      // force recalc on init page load
      let isLoaded = this.isLoaded;
      let isMounted = this.isMounted;
      let storePod = this.$store.state.podAudio.podcastRequest;
      return storePod;
    }
  },
  watch: {
    comPodcast: function(newVal, oldVal) {
      // only run if new podcast to be played
      if (!this.player || newVal.id !== this.player.podcast.id) {
        this.metControlAdd(newVal);
      }
    },
    player: {
      // immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.$store.dispatch('podAudio/actPlayer', newVal);
      }
    }
  },
  created: function() {
    // set loading flag
    // this is used to help force computed properties to recalc on initialization
    this.isLoaded = true;
  },
  beforeDestroy: function() {
    // clear flags before removed
    // this is used to help force computed properties to recalc on initialization
    this.isLoaded = false;
    this.isMounted = false;
  },
  mounted: function() {
    const self = this;
    // this is used to help force computed properties to recalc on initialization
    this.isMounted = true;
    // this.$nextTick(() => {
    // });
  },
  methods: {
    /*
      adds new podcast
    */
    metControlAdd: function(_podcast) {
      const self = this;
      // Note: place this first; remove previous podcast before adding new one
      this.metControlRemove();

      let playerHowl = new Howl({
        src: [_podcast.audio],
        html5: true,
        onplay: self.metControlPlayCallback.bind(self),
        onend: self.metControlPauseCallback.bind(self),
        onpause: self.metControlPauseCallback.bind(self)
      });
      let player = {
        playerHowl: playerHowl,
        playerID: null,
        podcast: _podcast,
        playerProgressSeconds: 0,
        isPlaying: false
      };
      Vue.set(self, 'player', player);
      this.metControlPlay();
    },
    /*
      removes current podcast
      this should always be called before adding new one
    */
    metControlRemove: function() {
      if (this.player && this.player.playerHowl) {
        // pause, unbind, destroy howl
        this.player.playerHowl.pause();
        this.player.playerHowl.off();
        this.player.playerHowl.unload();
        // clear player object after removal
        Vue.set(self, 'player', null);
      }
    },
    /*
      play podcast
    */
    metControlPlay: function() {
      const self = this;
      // Howler only returns unique player-id when play() is called
      const getPlayerID = this.player.playerHowl.play();
      Vue.set(self.player, 'playerID', getPlayerID);
    },
    /*
      play podcast callback from Howler onPlay event
    */
    metControlPlayCallback: function() {
      const self = this;
      let getProgress;
      this.metControlInterval();

      function checkProgress() {
        if (self.player && self.player.playerHowl) {
          getProgress = self.player.playerHowl.seek();
          Vue.set(self.player, 'playerProgressSeconds', getProgress);
        }
      }
      let checkProgressInterval = window.setInterval(checkProgress, 800);
      self.metControlInterval(checkProgressInterval);
      Vue.set(self.player, 'isPlaying', true);
    },
    /*
      pause podcast
    */
    metControlPause: function() {
      const self = this;
      this.player.playerHowl.pause();
    },
    /*
      pause podcast callback from Howler pause event
    */
    metControlPauseCallback: function() {
      const self = this;
      Vue.set(self.player.playerHowl, 'isPlaying', false);
    },
    /*
      a window.interval is used to continously check podcast time/progress;
      these interval refs are stored for later removal;
      this can add the interval ref or remove all;

      @param {object} _interval - window.setInterval reference
    */
    metControlInterval: function(_interval) {
      // sets interval
      if (_interval) {
        this.playerIntervalChecks.push(_interval);
      }
      // clears all intervals
      else {
        this.playerIntervalChecks.forEach((val, index, arr) => {
          val && clearInterval(val);
        });
        this.playerIntervalChecks = [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.aud {
  position: fixed;
  z-index: 3;
  bottom: 0;
  width: 100%;
  background: grey;

  /* hide and reveal based on active state */
  transform: translateY(1000%);
  transition: 0.4s transform;
  &.is-active {
    transform: translateY(0);
  }
}
/* progress slider */
.aud-prog-wrap {
  text-align: center;
  padding: 15px;
}
.aud-prog {
  display: inline-block;
  width: 100%;
  max-width: 1000px;
}
/* podcast name display */
.aud-title {
  text-align: center;
  padding: 5px;
  font-size: 0.8rem;
}
</style>
