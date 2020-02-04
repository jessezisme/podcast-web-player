<template>
  <div class="aud" v-show="comPodcast" v-bind:class="{ 'is-active': comPodcast }">
    <div class="aud-prog-wrap"></div>
    <div class="aud-title"></div>
  </div>
</template>

<script>
// Amplitude audio player: https://521dimensions.com/open-source/amplitudejs
import Amplitude from 'amplitudejs';
import { Howl, Howler } from 'howler';

// window.Amplitude = Amplitude;

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
      playerIsPlaying: false,
      playerProgressSeconds: null,
      playerIntervalChecks: []
    };
  },
  computed: {
    /**
     *
     * Returns current active podcast to be played from vuex
     *
     */
    comPodcast() {
      // force recalc on init page load
      let isLoaded = this.isLoaded;
      let isMounted = this.isMounted;
      let storePod = this.$store.state.podAudio.podcast;
      // break if podcast data is not defined
      if (!storePod || !storePod.id || !storePod.audio) {
        return null;
      }
      // break if not loaded or mounted
      if (!isLoaded && !isMounted) {
        return null;
      }
      return storePod;
    }
  },
  watch: {
    /**
     *
     * Watches current active podcast
     *
     *
     */
    comPodcast: function(newVal, oldVal) {
      // only run if new podcast to be played
      if (newVal && (!oldVal || newVal.id !== oldVal.id)) {
        this.metControlRun(newVal);
      }
    }
  },
  created: function() {
    // set loading flag
    this.isLoaded = true;
  },
  beforeDestroy: function() {
    // clear flags before removed
    this.isLoaded = false;
    this.isMounted = false;
  },
  mounted: function() {
    var self = this;
    this.isMounted = true;
    // this.$nextTick(() => {
    // });
  },
  methods: {
    /**
     *
     * Removes current podcast
     * this should always be called before adding new one
     */
    metControlRemove: function() {
      this.player && this.player.playerHowl.unload();
    },
    /**
     *
     * Adds new podcast
     *
     */
    metControlAdd: function(_player) {
      let _playerObj = {
        playerHowl: _player,
        playerID: null
      };
      // Remove Previous Before Redefining/Adding New
      this.metControlRemove();
      // Add new
      this.player = _playerObj;
    },
    metControlPlay: function() {
      this.player.playerID = this.player.playerHowl.play();
    },
    metControlIntervalAdd: function(_interval) {
      console.log(_interval);
      this.playerIntervalChecks.push(_interval);
    },
    metControlIntervalClear: function() {
      this.playerIntervalChecks.forEach((val, index, arr) => {
        val && clearInterval(val);
      });
      this.playerIntervalChecks = [];
    },
    metControlPlayCallback: function() {
      const self = this;

      this.metControlIntervalClear();
      function checkProgress() {
        if (self.player && self.player.playerHowl) {
          self.playerProgressSeconds = self.player.playerHowl.seek();
          console.log(self.playerProgressSeconds);
        }
      }
      let checkProgressInterval = setInterval(checkProgress, 800);
      self.metControlIntervalAdd(checkProgressInterval);
      this.playerIsPlaying = true;
    },
    metControlPauseCallback: function() {
      this.playerIsPlaying = false;
    },
    metControlRun: function(_podcast) {
      const self = this;
      const player = new Howl({
        src: [_podcast.audio],
        html5: true,
        onplay: self.metControlPlayCallback.bind(self),
        onend: self.metControlPauseCallback.bind(self),
        onpause: self.metControlPauseCallback.bind(self)
      });
      this.metControlAdd(player);
      this.metControlPlay();
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
