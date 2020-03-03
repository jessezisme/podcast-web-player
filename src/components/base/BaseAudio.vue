<template>
  <div>
    <!-- # audio player # -->
    <div class="aud" v-if="player && player.playerHowl && player.podcast" v-bind:class="{ 'is-active': player }">
      <!-- control popup toggle -->
      <div class="aud-tog">
        <button v-on:click="metModalToggle(true)" class="aud-tog-btn" title="control menu">
          <span class="b_sr-only">control menu</span>
          <i aria-hidden="true" class="fas fa-cog"></i>
        </button>
      </div>
      <!-- /end control popup toggle -->
      <!-- episode name -->
      <div class="aud-title">
        <span class="aud-title-text" v-if="player.podcast.title">
          {{ player.podcast.title }}
        </span>
      </div>
      <!-- flexbox wrapper -->
      <div class="aud-flexwrap">
        <!-- thumbnail -->
        <a v-if="player.podcast.image || player.podcast.thumbnail" class="aud-thumb-link">
          <img
            class="aud-thumb-img"
            v-bind:src="player.podcast.image || player.podcast.thumbnail"
            v-bind:alt="player.podcast.title"
            aria-hidden="true"
          />
        </a>
        <!-- play/pause group -->
        <div class="aud-ctrl">
          <!-- skip back -->
          <button class="aud-ctrl-btn aud-ctrl-btn-skip" v-on:click="metControlSkip('back')">
            <span aria-label="back 15 seconds"><i aria-hidden="true" class="fas fa-backward"></i></span>
          </button>
          <!-- play/pause -->
          <button class="aud-ctrl-btn aud-ctrl-btn-play" v-on:click="metControlTogglePlay">
            <span v-show="!player.isPlaying" aria-label="play"><i aria-hidden="true" class="far fa-play-circle"></i></span>
            <span v-show="player.isPlaying" aria-label="pause"><i aria-hidden="true" class="far fa-pause-circle"></i></span>
          </button>
          <!-- skip ahead -->
          <button class="aud-ctrl-btn aud-ctrl-btn-skip" v-on:click="metControlSkip('ahead')">
            <span aria-label="forward 15 seconds"><i aria-hidden="true" class="fas fa-forward"></i></span>
          </button>
        </div>
        <!-- progress/seek -->
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
        <!-- volume control -->
        <div class="aud-volume-wrap">
          <span class="aud-volume-icon-wrap">
            <i
              class="fas"
              v-bind:class="{
                'fa-volume-off': parseFloat(player.volume) == 0 ? true : false,
                'fa-volume-down': parseFloat(player.volume) < 0.5 ? true : false,
                'fa-volume-up': parseFloat(player.volume) >= 0.5 ? true : false
              }"
              aria-hidden="true"
            ></i>
          </span>
          <input
            class="aud-volume aud-range-styling "
            type="range"
            min="0"
            max="1"
            step=".01"
            v-bind="{ value: player.volume }"
            v-on:input="metControlVolume"
          />
        </div>
      </div>
    </div>
    <!-- # /end audio player # -->
    <!-- # modal control menu # -->
    <div v-if="isModalVisible && player && player.podcastDetails && player.playerHowl && player.podcast" class="aud-modal">
      <div class="aud-modal-in">
        <div class="aud-modal-close">
          <button v-on:click="metModalToggle(false)" class="b_btn aud-modal-close-btn">Close Menu</button>
        </div>
        <div class="aud-modal-heading">
          <span> Now Playing </span>
        </div>
        <div class="aud-modal-in-wrap">
          <!-- thumbnail -->
          <div class="aud-modal-img-wrap aud-modal-section ">
            <a v-if="player.podcast.image || player.podcast.thumbnail" class="aud-thumb-link">
              <img
                class="aud-modal-img"
                v-bind:src="player.podcast.image || player.podcast.thumbnail"
                v-bind:alt="player.podcast.title"
                aria-hidden="true"
              />
            </a>
          </div>
          <!-- title & track -->
          <div class="aud-modal-section ">
            <div class="aud-modal-title" v-if="player.podcastDetails.title">
              {{ player.podcastDetails.title }}
            </div>
            <div class="aud-modal-section aud-modal-ep" v-if="player.podcast.title">
              {{ player.podcast.title }}
            </div>
          </div>
          <!-- play/pause group -->
          <div class="aud-modal-section aud-modal-bg">
            <div class="aud-ctrl">
              <!-- skip back -->
              <button class="aud-ctrl-btn aud-ctrl-btn-skip" v-on:click="metControlSkip('back')">
                <span aria-label="back 15 seconds"><i aria-hidden="true" class="fas fa-backward"></i></span>
              </button>
              <!-- play/pause -->
              <button class="aud-ctrl-btn aud-ctrl-btn-play" v-on:click="metControlTogglePlay">
                <span v-show="!player.isPlaying" aria-label="play"
                  ><i aria-hidden="true" class="far fa-play-circle"></i
                ></span>
                <span v-show="player.isPlaying" aria-label="pause"
                  ><i aria-hidden="true" class="far fa-pause-circle"></i
                ></span>
              </button>
              <!-- skip ahead -->
              <button class="aud-ctrl-btn aud-ctrl-btn-skip" v-on:click="metControlSkip('ahead')">
                <span aria-label="forward 15 seconds"><i aria-hidden="true" class="fas fa-forward"></i></span>
              </button>
            </div>
          </div>
          <!-- progress tracker -->
          <div class="aud-modal-section aud-modal-bg">
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
          </div>
          <!-- volume -->
          <div class="aud-modal-section aud-modal-bg">
            <div class="aud-modal-volume">
              <div class="aud-volume-wrap">
                <span class="aud-volume-icon-wrap">
                  <i
                    class="fas"
                    v-bind:class="{
                      'fa-volume-off': parseFloat(player.volume) == 0 ? true : false,
                      'fa-volume-down': parseFloat(player.volume) < 0.5 ? true : false,
                      'fa-volume-up': parseFloat(player.volume) >= 0.5 ? true : false
                    }"
                    aria-hidden="true"
                  ></i>
                </span>
                <input
                  class="aud-volume aud-range-styling "
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  v-bind="{ value: player.volume }"
                  v-on:input="metControlVolume"
                />
              </div>
            </div>
          </div>
          <!-- episode description -->
          <div v-if="player.podcast.description" class="aud-modal-section">
            <span class="b_sr-only"> Podcast Details </span>
            <p v-html="metHtmlCleanToText(player.podcast.description)"></p>
          </div>
        </div>
      </div>
    </div>
    <!-- # /end modal control menu # -->
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
      playerIntervalChecks: [],
      /*
        modal for control menu
      */
      isModalVisible: false
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
    this.$root.$on('player.play', (_podcast, _podcastDetails) => {
      self.metControlPlay.call(self, _podcast, _podcastDetails);
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
    metControlAdd: function(_podcast, _podcastDetails) {
      const self = this;
      const shouldAdd = !self.player || _podcast.id !== self.player.podcast.id ? true : false;
      const getVolume = self.player && self.player.playerVolume ? parseFloat(self.player.playerVolume) : 1.0;

      function runAdd() {
        // Note: place this first; remove previous podcast before adding new one
        self.metControlRemove();
        // howler player
        let playerHowl = new Howl({
          src: [_podcast.audio],
          html5: true,
          volume: getVolume,
          onload: self.metControlLoadCallback.bind(self),
          onplay: self.metControlPlayCallback.bind(self),
          onend: self.metControlPauseCallback.bind(self),
          onpause: self.metControlPauseCallback.bind(self),
          onvolume: self.metControlVolumeCallback.bind(self)
        });
        // main player object
        let player = {
          // howler player
          playerHowl: playerHowl,
          playerID: null,
          podcast: _podcast,
          podcastDetails: _podcastDetails,
          volume: getVolume,
          playerProgressSeconds: 0,
          podcastDuration: 0,
          pauseOnLoad: false,
          isPlaying: false,
          isLoading: true,
          isLoaded: false
        };
        // entire player is reactive
        Vue.set(self, 'player', player);
      }

      if (shouldAdd) {
        runAdd();
      }
      return shouldAdd;
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
      // set player duration
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
     * Toggle play-pause;
     * handles logic to either play or pause here;
     * helps to avoid including play/pause logic in template bindinds
     *
     */
    metControlTogglePlay: function() {
      const self = this;
      if (self.player && self.player.playerHowl) {
        self.player.isPlaying ? self.player.playerHowl.pause() : self.player.playerHowl.play();
      }
    },

    /**
     *
     * Play it:
     *
     */
    metControlPlay: function(_episode, _podcastDetails) {
      const self = this;
      /*
        every time play is called; attempt to add new podcast in case not yet initialized;
        return boolean of newly-added status;
      */
      const isPodcastNew = self.metControlAdd.call(self, _episode, _podcastDetails);
      const shouldPlay = isPodcastNew && self.player.pauseOnLoad ? false : true;

      function runPlay() {
        // Howler only returns unique player-id when play() is called
        const getPlayerID = self.player.playerHowl.play();
        Vue.set(self.player, 'playerID', getPlayerID);
      }
      shouldPlay && runPlay();
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
     * Skip ahead/backward
     * @param {string} _action - 'back' or 'ahead'
     *
     */
    metControlSkip: function(_action) {
      const self = this;
      // run duration update to ensure accuracy
      self.metControlGetDuration();
      // skip ahead 15 seconds; set to end if this will exceed duration
      const timeGoAhead =
        self.player.playerProgressSeconds + 15 >= self.player.podcastDuration
          ? self.player.podcastDuration
          : self.player.playerProgressSeconds + 15;
      // go back 15 seconds; lowest value is 1 second, the beginning
      const timeGoBack = self.player.playerProgressSeconds - 15 < 1 ? 1 : self.player.playerProgressSeconds - 15;

      _action === 'ahead' && self.player.playerHowl.seek(timeGoAhead);
      _action === 'back' && self.player.playerHowl.seek(timeGoBack, self.player.playerID);
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
     * while in mousedown state, the slider should NOT be updated with current progress; add disabled flag, until mouseup release
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
    },

    /**
     *
     * Volume UI event:
     * handles setting volume based on UI events;
     * updates player volume property, which is bound in UI
     * @param {object} event - from input on volume slider
     *
     */
    metControlVolume: function(event) {
      const self = this;
      let getVolume = parseFloat(event.target.value);
      // set player reference to volume
      Vue.set(self.player, 'volume', getVolume);
      // call howler volume change
      self.player.playerHowl && self.player.playerHowl.volume(getVolume);
    },

    /**
     *
     * Volume callback from Howler player:
     * to be sure UI reflects actual volume set in Howler player,
     * this callback runs and, if necessary, updates player volume setting bound in UI;
     * this is not necessary, but just serves as additional check
     *
     */
    metControlVolumeCallback: function(event) {
      const self = this;
      let getHowlerVolume;
      let getPlayerVolume;

      if (this.player && this.player.playerHowl) {
        getHowlerVolume = parseFloat(self.player.playerHowl.volume());
        getPlayerVolume = parseFloat(self.player.volume);
        // set player volume if it doesn't match volume returned from howler
        getHowlerVolume !== getPlayerVolume ? Vue.set(self.player, 'volume', getVolume) : false;
      }
    },
    /**
     *
     * Toggle control modal
     *
     */
    metModalToggle: function(_shouldShow) {
      const self = this;
      if (_shouldShow) {
        self.isModalVisible = true;
      } else {
        self.isModalVisible = false;
      }
    },
    metHtmlCleanToText: function(getHtmlStr) {
      var temp = new DOMParser().parseFromString(getHtmlStr, 'text/html');
      return temp.body.textContent || '';
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
  padding: 5px 15px;
  background: repeating-linear-gradient(
    to right,
    lighten($color-accent-1, 1%),
    darken(adjust-hue($color-accent-2, 8%), 10%),
    lighten($color-accent-1, 1%)
  );
  box-shadow: 0 1px 4px 0 lighten($color-accent-2, 25%);
  /* hide and reveal based on active state */
  transform: translateY(1000%);
  transition: 0.4s transform;
  &.is-active {
    transform: translateY(0);
  }
}

/*=============================================
=            modal popup            =
=============================================*/
$modal-bg: #0d0d0f;
$modal-bg-section: lighten($modal-bg, 4%);
.aud-modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  background: rgba(0, 0, 0, 0.92);

  .aud-modal-bg {
    background: $modal-bg-section;
  }
  .aud-modal-section {
    text-align: center;
    margin: 0 0 1rem 0;
    padding: 0.5rem 10px;
  }
  .aud-modal-in {
    width: 950px;
    height: 950px;
    max-height: 90vh;
    max-width: calc(100% - 30px);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 10px 15px;
    margin: auto;
    overflow: auto;
    background: $modal-bg;
    border: $color-accent-3;
  }
  .aud-modal-in-wrap {
    text-align: center;
  }
  /*----------  close  ----------*/
  .aud-modal-close {
    text-align: right;
  }
  .aud-modal-close-btn {
    margin: 15px;
  }
  /*----------  volume  ----------*/
  .aud-modal-volume {
    display: flex;
    justify-content: center;
  }
  .aud-volume-wrap {
    padding: 0;
  }
}

/*=====  End of modal popup  ======*/

/*=============================================
=            flexbox wrapper            =
=============================================*/
.aud-flexwrap {
  display: flex;
  align-items: center;
  // fallback
  justify-content: center;
  // justify-content: space-evenly;
}
.aud-prog-wrap {
  flex-grow: 1;
}
/*=====  End of flexbox wrapper  ======*/

/*=============================================
=            control menu toggle            =
=============================================*/
.aud-tog {
  position: relative;
  height: 25px;
  overflow: visible;
  text-align: center;
}
.aud-tog-btn {
  display: inline-block;
  width: 80px;
  height: 60px;
  position: absolute;
  margin: auto;
  top: -50%;
  left: 0;
  right: 0;
  background: darken(adjust-hue($color-accent-2, 8%), 10%);
  border-radius: 100%;
  transform: translateY(-50%);
  font-size: 1.75rem;
}
/*=====  End of control menu toggle  ======*/

/*=============================================
=            thumbnail image            =
=============================================*/
.aud-thumb-link {
  display: inline-block;
}
.aud-thumb-img {
  display: inline-block;
  max-width: 45px;
  max-height: 45px;
}
/*=====  End of thumbnail image  ======*/

/*=============================================
=            play/pause/skip group            =
=============================================*/
.aud-ctrl {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.aud-ctrl-btn {
  min-width: 50px;
  min-height: 50px;
  margin: 0 10px;
  font-size: 2.5rem;
}
.aud-ctrl-btn-play i {
  border-radius: 100%;
  box-shadow: 0 0 4px 0 $color-accent-3;
}
.aud-ctrl-btn-skip {
  opacity: 0.8;
  font-size: 1.75rem;
}
/*=====  End of play/pause/skip group  ======*/

/*=============================================
=            podcast name/episode display     =
=============================================*/
.aud-title {
  text-align: center;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: bold;
}
.aud-title-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/*=====  End of podcast name display  ======*/

/*=============================================
=            Volume            =
=============================================*/
.aud-volume-wrap {
  min-width: 150px;
  display: flex;
  align-items: center;
  padding-left: 30px;
}
.aud-volume {
  @extend .aud-range-styling;

  max-width: 125px;
  margin-left: 8px !important;
}
.aud-volume-icon-wrap {
  width: 1.3em;
  overflow: visible;
  font-size: 1.25rem;
}
/*=====  End of Volume  ======*/

/*=============================================
=            input range slider            =
=============================================*/
/* wrapper */
.aud-prog-wrap {
  width: 100%;
  max-width: 1088px;
  text-align: center;
  margin: 10px;
}

/* slider */
.aud-prog {
  display: inline-block;
  width: 100%;

  @extend .aud-range-styling;
}

/**
 *
 * Built with http://danielstern.ca/range.css/#/
 *
 */
.aud-range-styling {
  & {
    -webkit-appearance: none;
    width: 100%;
    height: 5px;
    margin: 5px 0;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
    background: rgba(239, 239, 239, 0.8);
    border-radius: 0px;
    border: 0.2px solid rgba(239, 239, 239, 0.25);
  }
  &::-webkit-slider-thumb {
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
  &:focus::-webkit-slider-runnable-track {
    background: rgba(239, 239, 239, 0.8);
  }
  &::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
    // background: rgba(239, 239, 239, 0.8);
    border-radius: 0px;
    border: 0.2px solid rgba(239, 239, 239, 0.25);
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 1px solid #706097;
    height: 15px;
    width: 15px;
    border-radius: 50px;
    background: #706097;
    cursor: pointer;
  }
  &::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: rgba(239, 239, 239, 0.8);
    border: 0.2px solid rgba(239, 239, 239, 0.25);
    border-radius: 0px;
    box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
  }
  &::-ms-fill-upper {
    background: rgba(239, 239, 239, 0.8);
    border: 0.2px solid rgba(239, 239, 239, 0.25);
    border-radius: 0px;
    box-shadow: 0px 0px 0.4px rgba(239, 239, 239, 0.08), 0px 0px 0px rgba(252, 252, 252, 0.08);
  }
  &::-ms-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 1px solid #706097;
    height: 15px;
    width: 15px;
    border-radius: 50px;
    background: #706097;
    cursor: pointer;
    height: 5px;
  }
  &:focus::-ms-fill-lower {
    background: rgba(239, 239, 239, 0.8);
  }
  &:focus::-ms-fill-upper {
    background: rgba(239, 239, 239, 0.8);
  }
}

/*=====  End of input range slider  ======*/
</style>
