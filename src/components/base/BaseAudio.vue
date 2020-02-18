<template>
  <div class="aud" v-if="player && player.playerHowl && player.podcast" v-bind:class="{ 'is-active': player }">
    <!-- podcast image -->

    <!-- progress control -->
    <div class="aud-prog-wrap">
      <input
        class="aud-prog"
        type="range"
        ref="BaseAudio-player-progress-slider"
        v-on:mousedown="metPlayerProgressUserModifying"
        step="1"
        min="1"
        value="1"
        v-bind="{
          max: player.isLoaded && player.podcastDuration ? player.podcastDuration : 1
        }"
      />
    </div>
    <!-- episode name -->
    <div class="aud-title">
      <span class="aud-title-text" v-if="player.podcast.title">
        {{ player.podcast.title }}
      </span>
    </div>
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

      isPlayerProgressActive: false,
      /*
        player controls
      */
      player: null,
      playerIntervalChecks: []
    };
  },
  computed: {},
  watch: {
    /*
      watch for various changes to player object
    */
    player: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // continously update vuex reference to player on any change
        this.$store.dispatch('podAudio/actPlayer', newVal);
      }
    }
  },
  created: function() {
    const self = this;
    // set loading flag; used to help force computed properties to recalc on initialization
    this.isLoaded = true;
    /**
     *
     * Player Control Listeners:
     * passed via emit on $root instances from various components;
     *
     */
    /*
      Play
    */
    this.$root.$on('player.play', (_podcast) => {
      self.metControlAdd(_podcast);
      // self.metControlPlay();
    });
    /*
      Pause
    */
    this.$root.$on('player.pause', self.metControlPause);
  },
  beforeDestroy: function() {
    // clear flags before removed; used to help force computed properties to recalc on initialization
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
    /**
     *
     * Adds new podcast:
     * includes player object, and howler-player
     *
     */
    metControlAdd: function(_podcast) {
      const self = this;
      let shouldAdd = !this.player || _podcast.id !== this.player.podcast.id;
      if (!shouldAdd) {
        return false;
      }
      // Note: place this first; remove previous podcast before adding new one
      this.metControlRemove();
      // howler player
      let playerHowl = new Howl({
        src: [_podcast.audio],
        html5: true,
        onload: self.metControlLoadCallback.bind(self),
        onplay: self.metControlPlayCallback.bind(self),
        onend: self.metControlPauseCallback.bind(self),
        onpause: self.metControlPauseCallback.bind(self)
      });
      // main player object
      let player = {
        // howler player
        playerHowl: playerHowl,
        playerID: null,
        podcast: _podcast,
        playerProgressSeconds: 0,
        podcastDuration: 0,
        pauseOnLoad: false,
        isPlaying: false,
        isLoading: true,
        isLoaded: false
      };
      // entire player is reactive
      Vue.set(self, 'player', player);
      // play, unless paused before loading has finished
      if (!self.player.pauseOnLoad) {
        this.metControlPlay();
      }
    },
    /**
     *
     * Loading Callback:
     * fires after podcast has entirely loaded
     *
     */
    metControlLoadCallback: function() {
      const self = this;
      if (this.player && this.player.playerHowl) {
        // set loading flags
        Vue.set(self.player, 'isLoaded', true);
        Vue.set(self.player, 'isLoading', false);
        // set podcast duration
        self.metControlGetDuration();
      }
    },
    /**
     *
     * Duration of Podcast:
     * set podcast duration in seconds
     *
     */
    metControlGetDuration: function() {
      const self = this;
      // calls howler method to get duration
      let getDurationFromPlayer =
        self.player && self.player.playerID && self.player.playerHowl
          ? self.player.playerHowl.duration(self.player.playerID)
          : 0;
      let getDuration = Math.floor(getDurationFromPlayer);
      Vue.set(self.player, 'podcastDuration', getDuration);
    },
    /**
     *
     * Removes current podcast:
     * this should always be called before adding a new one
     *
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
    /**
     *
     * Play it
     *
     */
    metControlPlay: function() {
      const self = this;
      // Howler only returns unique player-id when play() is called
      const getPlayerID = this.player.playerHowl.play();
      Vue.set(self.player, 'playerID', getPlayerID);
    },
    /**
     *
     * Play Callback:
     * play podcast callback from Howler onPlay event
     *
     */
    metControlPlayCallback: function() {
      const self = this;
      let getProgress;
      // clear previous intervals
      this.metControlInterval();
      // run progress check on interval; howler doesn't provide this as a callback
      function checkProgress() {
        // get progress from howler
        if (self.player && self.player.playerHowl) {
          getProgress = self.player.playerHowl.seek() ? Math.floor(self.player.playerHowl.seek()) : 1;
        }
        // only update if changed
        if (getProgress && (!self.player.playerProgressSeconds || self.player.playerProgressSeconds !== getProgress)) {
          self.metPlayerProgressUpdate(getProgress);
        }
      }
      let checkProgressInterval = window.setInterval(checkProgress, 250);
      // add interval ref for later removal
      self.metControlInterval(checkProgressInterval);
      // set play state
      Vue.set(self.player, 'isPlaying', true);
    },
    /**
     *
     * Pause podcast:
     *
     */
    metControlPause: function() {
      const self = this;
      // set pause-on-load flag just in case loading hasn't finished;
      Vue.set(self.player, 'pauseOnLoad', true);
      self.player.playerHowl.pause();
    },
    /**
     *
     * Pause callback:
     * callback from howler on-pause event
     *
     */
    metControlPauseCallback: function() {
      const self = this;
      Vue.set(self.player, 'isPlaying', false);
    },
    /**
     *
     * a window.interval is used to continously check podcast time/progress;
     * these interval refs are stored for later removal;
     * this can add the interval ref or remove all;
     *
     * @param {object} _interval - window.setInterval reference
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
    },
    /**
     *
     * Progress Bar:
     * @param {number} _getProgress - podcast length in seconds
     *
     */
    metPlayerProgressUpdate: function(_getProgress) {
      const self = this;
      let getProgress = Math.floor(_getProgress) ? Math.floor(_getProgress) : 1;
      let refInput = this.$refs['BaseAudio-player-progress-slider'];
      // avoid updating if: user is sliding progress bar; and input isn't defined
      if (!this.isPlayerProgressActive && refInput) {
        refInput.value = getProgress;
        Vue.set(self.player, 'playerProgressSeconds', getProgress);
      }
    },
    /**
     *
     * Event handler for user mousedown on input progress slider;
     * on mousedown, a seek may occur;
     * while in mousedown state, the slider should NOT be updated current progress; add disabled flag, until mouseup release
     * at that point, check if input value doesn't match current seek progress returned from howler player;
     * then check if player should be seeked;
     * finally, clear disabled boolean flag
     *
     */
    metPlayerProgressUserModifying: function() {
      const self = this;
      self.isPlayerProgressActive = true;

      function seekCheck() {
        let refProgress = self.$refs['BaseAudio-player-progress-slider'];
        let refProgressVal = refProgress ? refProgress.value : 1;
        // get seek progress from howler
        let getSeek =
          self.player && self.player.playerHowl && self.player.playerHowl.seek()
            ? Math.floor(self.player.playerHowl.seek())
            : 1;
        // only run seek, if actually different than current input value
        if (refProgress && refProgressVal && refProgressVal !== getSeek) {
          self.player.playerHowl.seek(refProgressVal);
          // not needed since update will run on next interval progress check
          // refProgress.value = getSeek;
        }
        // clear mousedown flag
        self.isPlayerProgressActive = false;
        // clear listener
        document.removeEventListener('mouseup', seekCheck);
      }
      /*
        listen for mouseup event on entire document; 
        so this will always conclude the mousedown on input progress slider
      */
      document.addEventListener('mouseup', seekCheck);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';

.aud {
  position: fixed;
  z-index: 3;
  bottom: 0;
  width: 100%;
  background: repeating-linear-gradient(
    to right,
    darken($color-accent-1, 2%),
    darken($color-accent-2, 15%),
    darken($color-accent-1, 2%)
  );
  box-shadow: 0 1px 4px 1px lighten($color-accent-2, 40%);
  /* hide and reveal based on active state */
  transform: translateY(1000%);
  transition: 0.4s transform;
  &.is-active {
    transform: translateY(0);
  }
}

/* podcast name display */
.aud-title {
  text-align: center;
  padding: 5px;
  font-size: 0.8rem;
  background: rgba($color-black, 0.25);
}
.aud-title-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/**/

/*=============================================
=            input range slider            =
=============================================*/
/* wrapper */
.aud-prog-wrap {
  text-align: center;
  padding: 15px;
}
/* slider */
.aud-prog {
  display: inline-block;
  width: 100%;
  max-width: 1000px;
}
/**
 *
 * Built with http://danielstern.ca/range.css/#/
 *
 */
input[type='range'].aud-prog {
  -webkit-appearance: none;
  width: 100%;
  margin: 5px 0;
}
input[type='range'].aud-prog:focus {
  outline: none;
}
input[type='range'].aud-prog::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
  background: rgba(239, 239, 239, 0.8);
  border-radius: 0px;
  border: 0.2px solid rgba(239, 239, 239, 0.25);
}
input[type='range'].aud-prog::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  border: 1px solid #706097;
  height: 15px;
  width: 15px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5.2px;
}
input[type='range'].aud-prog:focus::-webkit-slider-runnable-track {
  background: rgba(239, 239, 239, 0.8);
}
input[type='range'].aud-prog::-moz-range-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
  background: rgba(239, 239, 239, 0.8);
  border-radius: 0px;
  border: 0.2px solid rgba(239, 239, 239, 0.25);
}
input[type='range'].aud-prog::-moz-range-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  border: 1px solid #706097;
  height: 15px;
  width: 15px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
}
input[type='range'].aud-prog::-ms-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type='range'].aud-prog::-ms-fill-lower {
  background: rgba(239, 239, 239, 0.8);
  border: 0.2px solid rgba(239, 239, 239, 0.25);
  border-radius: 0px;
  box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
}
input[type='range'].aud-prog::-ms-fill-upper {
  background: rgba(239, 239, 239, 0.8);
  border: 0.2px solid rgba(239, 239, 239, 0.25);
  border-radius: 0px;
  box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
}
input[type='range'].aud-prog::-ms-thumb {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  border: 1px solid #706097;
  height: 15px;
  width: 15px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
  height: 5px;
}
input[type='range'].aud-prog:focus::-ms-fill-lower {
  background: rgba(239, 239, 239, 0.8);
}
input[type='range'].aud-prog:focus::-ms-fill-upper {
  background: rgba(239, 239, 239, 0.8);
}
/*=====  End of input range slider  ======*/
</style>
