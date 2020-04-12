<template>
  <div>
    <!-- # audio player # -->
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div class="aud" v-if="player && player.playerHowl && player.episode" v-bind:class="{ 'is-active': player }">
        <!-- control popup toggle -->
        <div class="aud_tog">
          <button v-on:click="metModalToggle(true)" class="aud_tog-btn" title="control menu">
            <span class="b_sr-only">control menu</span>
            <i aria-hidden="true" class="fas fa-cog"></i>
          </button>
        </div>
        <!-- /end control popup toggle -->
        <!-- episode name -->
        <div class="aud_title">
          <span class="aud_title-text" v-if="player.episode.title">
            {{ player.episode.title }}
          </span>
        </div>
        <!-- flexbox wrapper -->
        <div class="aud_flexwrap">
          <!-- thumbnail -->
          <span v-if="(player.podcast && player.episode.image) || player.episode.thumbnail" class="aud_thumb-link">
            <router-link :to="metReturnURL(player.podcast)" class="car_it-link">
              <img
                class="aud_thumb-img"
                v-bind:src="player.episode.image || player.episode.thumbnail"
                v-bind:alt="player.podcast.title"
                v-bind:title="player.podcast.title"
                aria-hidden="true"
              />
            </router-link>
          </span>
          <!-- play/pause group -->
          <div class="aud_ctrl">
            <!-- skip back -->
            <button class="aud_ctrl-btn aud_ctrl-btn-skip" v-on:click="metControlSkip('back')">
              <span aria-label="back 15 seconds"><i aria-hidden="true" class="fas fa-backward"></i></span>
            </button>
            <!-- play/pause -->
            <button class="aud_ctrl-btn aud_ctrl-btn-play" v-on:click="metControlTogglePlay">
              <span v-show="!player.isPlaying" aria-label="play"><i aria-hidden="true" class="far fa-play-circle"></i></span>
              <span v-show="player.isPlaying" aria-label="pause"
                ><i aria-hidden="true" class="far fa-pause-circle"></i
              ></span>
            </button>
            <!-- skip ahead -->
            <button class="aud_ctrl-btn aud_ctrl-btn-skip" v-on:click="metControlSkip('ahead')">
              <span aria-label="forward 15 seconds"><i aria-hidden="true" class="fas fa-forward"></i></span>
            </button>
          </div>
          <!-- progress/seek -->
          <div class="aud_prog-wrap b_hide-xs b_hide-sm">
            <input
              class="aud_prog aud_range-styling "
              type="range"
              ref="BaseAudio-player-progress-slider-1"
              @touchstart="metPlayerProgressUserModifying"
              @mousedown="metPlayerProgressUserModifying"
              step="1"
              min="1"
              value="1"
              v-bind="{
                max: player.isLoaded && player.podcastDuration ? player.podcastDuration : 1
              }"
            />
          </div>
          <!-- volume control -->
          <!-- hide volume controls if ios or android -->
          <div class="aud_volume-wrap b_hide-xs b_hide-sm" v-if="!isIosOrAndroid">
            <span class="aud_volume-icon-wrap">
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
              class="aud_volume aud_range-styling"
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
    </transition>
    <!-- # /end audio player # -->
    <!-- # modal control menu # -->

    <BaseModal class="aud_modal" v-on:modal-close="isModalVisible = false" v-if="isModalVisible && player && player.episode">
      <template v-slot:slot-modal-header>
        <div class="aud_modal-heading">
          <span> Now Playing </span>
        </div>
      </template>
      <template v-slot:slot-modal-main>
        <div class="aud_modal-in-wrap">
          <!-- thumbnail -->
          <div class="aud_modal-img-wrap aud_modal-section ">
            <a v-if="player.episode.image || player.episode.thumbnail" class="aud_thumb-link">
              <img
                class="aud_modal-img"
                v-bind:src="player.episode.image || player.episode.thumbnail"
                v-bind:alt="player.episode.title"
                aria-hidden="true"
              />
            </a>
          </div>
          <!-- title & track -->
          <div class="aud_modal-section ">
            <div class="aud_modal-title" v-if="player.podcast.title">
              {{ player.podcast.title }}
            </div>
            <div class="aud_modal-section aud_modal-ep" v-if="player.episode.title">
              {{ player.episode.title }}
            </div>
          </div>
          <!-- play/pause group -->
          <div class="aud_modal-section aud_modal-bg">
            <div class="aud_ctrl">
              <!-- skip back -->
              <button class="aud_ctrl-btn aud_ctrl-btn-skip" v-on:click="metControlSkip('back')">
                <span aria-label="back 15 seconds"><i aria-hidden="true" class="fas fa-backward"></i></span>
              </button>
              <!-- play/pause -->
              <button class="aud_ctrl-btn aud_ctrl-btn-play" v-on:click="metControlTogglePlay">
                <span v-show="!player.isPlaying" aria-label="play"
                  ><i aria-hidden="true" class="far fa-play-circle"></i
                ></span>
                <span v-show="player.isPlaying" aria-label="pause"
                  ><i aria-hidden="true" class="far fa-pause-circle"></i
                ></span>
              </button>
              <!-- skip ahead -->
              <button class="aud_ctrl-btn aud_ctrl-btn-skip" v-on:click="metControlSkip('ahead')">
                <span aria-label="forward 15 seconds"><i aria-hidden="true" class="fas fa-forward"></i></span>
              </button>
            </div>
          </div>
          <!-- progress tracker -->
          <div class="aud_modal-section aud_modal-bg">
            <div class="aud_prog-wrap">
              <input
                class="aud_prog aud_range-styling"
                type="range"
                ref="BaseAudio-player-progress-slider-2"
                @touchstart="metPlayerProgressUserModifying"
                @mousedown="metPlayerProgressUserModifying"
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
          <!-- hide volume controls if ios or android -->
          <div class="aud_modal-section aud_modal-bg" v-if="!isIosOrAndroid">
            <div class="aud_modal-volume">
              <div class="aud_volume-wrap">
                <span class="aud_volume-icon-wrap">
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
                  class="aud_volume aud_range-styling"
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
          <div v-if="player.episode.description" class="aud_modal-section">
            <span class="b_sr-only"> Podcast Details </span>
            <p v-html="metHtmlCleanToText(player.episode.description)"></p>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- # /end modal control menu # -->
  </div>
</template>

<script>
// TODO: Convert modal to separate component

import Vue from 'vue/dist/vue.esm.js';
import { Howl, Howler } from 'howler';
import BaseModal from './BaseModal.vue';
import Util_main from '../../../utils/util-main.js';

export default {
  name: 'BaseAudio',
  // props: [""],
  components: {
    BaseModal: BaseModal
  },
  data: function() {
    return {
      isLoaded: false,
      isMounted: false,
      isPlayerProgressActive: false,
      // detect if IOS or Android
      isIosOrAndroid:
        window.navigator &&
        window.navigator.userAgent &&
        (/iPad|iPhone|iPod|iOS/g.test(window.navigator.userAgent) || /android/gi.test(window.navigator.userAgent)),
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
    this.$root.$on('player.play', (_episode, _podcast) => {
      self.metControlPlay.call(self, _episode, _podcast);
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
    metControlAdd: function(_episode, _podcast) {
      const self = this;
      const shouldAdd = !self.player || _episode.id !== self.player.podcast.id ? true : false;
      const getVolume = self.player && self.player.playerVolume ? parseFloat(self.player.playerVolume) : 1.0;

      function runAdd() {
        // Note: place this first; remove previous podcast before adding new one
        self.metControlRemove();
        // howler player
        let playerHowl = new Howl({
          src: [_episode.audio],
          html5: true,
          volume: getVolume,
          onload: self.metControlLoadCallback.bind(self),
          onplay: self.metControlPlayCallback.bind(self),
          onend: self.metControlPauseCallback.bind(self),
          onpause: self.metControlPauseCallback.bind(self),
          onvolume: self.metControlVolumeCallback.bind(self),
          onloaderror: self.metControlLoadError.bind(self)
        });
        // main player object
        let player = {
          // howler player
          playerHowl: playerHowl,
          playerID: null,
          episode: _episode,
          podcast: _podcast,
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
      // must include list of ALL $refs used on all progress trackers
      let $refsInput = ['BaseAudio-player-progress-slider-1', 'BaseAudio-player-progress-slider-2'];
      // avoid updating if user is modifying progress bar
      if (!self.isPlayerProgressActive) {
        // loop through each progress inpur, and update value with progress; using $refs references
        $refsInput.forEach(function(val) {
          if (self.$refs[val]) {
            self.$refs[val].value = getProgress;
          }
        });
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
     * @param {Object} event - event from mousedown event
     */
    metPlayerProgressUserModifying: function(event) {
      const self = this;
      // get input currently being modified
      const $inputProgress = event.target;
      // set flag, which defines user is modifying
      self.isPlayerProgressActive = true;

      /*
        When mouseup is completed, check new value of input;
        and update new seek progress in player

        @param {Object} $inputProgress - input target
       */
      function seekCheck($inputProgress) {
        let refProgress = $inputProgress;
        let refProgressVal = refProgress ? refProgress.value : 1;
        // get seek progress from howler
        let getSeek =
          self.player && self.player.playerHowl && self.player.playerHowl.seek()
            ? Math.floor(self.player.playerHowl.seek())
            : 1;
        // only run seek, if actually different than current input value
        if (refProgress && refProgressVal && refProgressVal !== getSeek) {
          self.player.playerHowl.seek(refProgressVal);
        }
        // clear mousedown flag
        self.isPlayerProgressActive = false;
        // clear listeners
        document.removeEventListener('mouseup', seekCheckBind);
        document.removeEventListener('touchend', seekCheckBind);
      }
      let seekCheckBind = seekCheck.bind(self, $inputProgress);
      /*
        listen for mouseup on document, rather than input;
        in case mouseup occurs outside of input
      */
      document.addEventListener('mouseup', seekCheckBind);
      // touchend for touch devices; ios won't fire mouseup for non-focusable elements
      document.addEventListener('touchend', seekCheckBind);
      /*
        set focus on input
      */
      try {
        event.currentTarget.focus();
      } catch (err) {
        console.info(err);
      }
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
     * Error handlers from Howler player:
     * @param {String} _id - id of failed load
     * @param {String} _code - error/message code of failure
     */
    metControlLoadError: function(_id, _code) {
      /*
      const errorObj = {
        status: 'Error loading audio file',
        id: _id,
        code: _code
      };
      try {
        console.error(JSON.stringify(errorObj));
      } catch {
        console.log(JSON.stringify(errorObj));
      }
      */
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
    },

    metReturnURL: function(podcast) {
      return Util_main.podcastURL({
        id: podcast.id,
        title: podcast.title
      });
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
    adjust-hue(lighten($color-accent-1, 10%), -4%),
    darken(adjust-hue($color-accent-2, 1%), 2%),
    adjust-hue(lighten($color-accent-1, 10%), -4%)
  );
}
/*=============================================
=            flexbox wrapper            =
=============================================*/
.aud_flexwrap {
  display: flex;
  align-items: center;
  // fallback
  justify-content: center;
  // justify-content: space-evenly;
}
.aud_prog-wrap {
  flex-grow: 1;
}

/*=====  End of flexbox wrapper  ======*/

/*=============================================
=            control menu toggle            =
=============================================*/
.aud_tog {
  position: relative;
  height: 25px;
  overflow: visible;
  text-align: center;
}
.aud_tog-btn {
  display: inline-block;
  width: 60px;
  height: 60px;
  position: absolute;
  margin: auto;
  top: -50%;
  left: 0;
  right: 0;
  background: repeating-linear-gradient(
    to right,
    adjust-hue(lighten($color-accent-1, 10%), -4%),
    darken(adjust-hue($color-accent-2, 1%), 2%),
    adjust-hue(lighten($color-accent-1, 10%), -4%)
  );
  background-size: 100vw;
  background-position: center;
  border-radius: 100%;
  transform: translateY(-50%);
  font-size: 1.5rem;
}
/*=====  End of control menu toggle  ======*/

/*=============================================
=            thumbnail image            =
=============================================*/
.aud_thumb-link {
  display: inline-block;
}
.aud_thumb-img {
  display: inline-block;
  max-width: 45px;
  max-height: 45px;

  @media all and (min-width: $break-md) {
    max-width: 55px;
    max-height: 55px;
  }
}
/*=====  End of thumbnail image  ======*/

/*=============================================
=            play/pause/skip group            =
=============================================*/
.aud_ctrl {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.aud_ctrl-btn {
  min-width: 50px;
  min-height: 50px;
  margin: 0 10px;
  font-size: 2.5rem;
}
.aud_ctrl-btn-play i {
  border-radius: 100%;
  box-shadow: 0 0 4px 0 $color-accent-3;
}
.aud_ctrl-btn-skip {
  opacity: 0.8;
  font-size: 1.75rem;
}
/*=====  End of play/pause/skip group  ======*/

/*=============================================
=            podcast name/episode display     =
=============================================*/
.aud_title {
  text-align: center;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 1em;
}
.aud_title,
.aud_title-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/*=====  End of podcast name display  ======*/

/*=============================================
=            Sliders             =
=============================================*/

/*----------  shared input progress styling  ----------*/
/**
 *
 * Built with http://danielstern.ca/range.css/#/
 *
 */
input[type='range'].aud_range-styling {
  -webkit-appearance: none;
  width: 100%;
  margin: 7px 0;
  border-radius: 4px;
}
input[type='range'].aud_range-styling:focus {
  outline: none;
}
input[type='range'].aud_range-styling::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  border: 0px solid #010101;
}
input[type='range'].aud_range-styling::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #706097, 0px 0px 0px #7d6ea3;
  border: 10px solid #706097;
  height: 20px;
  width: 21px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
input[type='range'].aud_range-styling:focus::-webkit-slider-runnable-track {
  background: rgba(0, 0, 0, 0.25);
}
input[type='range'].aud_range-styling::-moz-range-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  border: 0px solid #010101;
}
input[type='range'].aud_range-styling::-moz-range-thumb {
  box-shadow: 0px 0px 0px #706097, 0px 0px 0px #7d6ea3;
  border: 10px solid #706097;
  height: 20px;
  width: 21px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
}
input[type='range'].aud_range-styling::-ms-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type='range'].aud_range-styling::-ms-fill-lower {
  background: rgba(0, 0, 0, 0.25);
  border: 0px solid #010101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}
input[type='range'].aud_range-styling::-ms-fill-upper {
  background: rgba(0, 0, 0, 0.25);
  border: 0px solid #010101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}
input[type='range'].aud_range-styling::-ms-thumb {
  box-shadow: 0px 0px 0px #706097, 0px 0px 0px #7d6ea3;
  border: 10px solid #706097;
  height: 20px;
  width: 21px;
  border-radius: 50px;
  background: #706097;
  cursor: pointer;
  height: 6px;
}
input[type='range'].aud_range-styling:focus::-ms-fill-lower {
  background: rgba(0, 0, 0, 0.25);
}
input[type='range'].aud_range-styling:focus::-ms-fill-upper {
  background: rgba(0, 0, 0, 0.25);
}

/*----------  volume   ----------*/
.aud_volume-wrap {
  min-width: 150px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.aud_volume {
  max-width: 125px;
  margin-left: 8px !important;
}
.aud_volume-icon-wrap {
  width: 1.3em;
  overflow: visible;
  font-size: 1.25rem;
}

/*----------  progress   ----------*/
/* wrapper */
.aud_prog-wrap {
  width: 100%;
  max-width: 1088px;
  text-align: center;
  padding: 10px;
}

/* slider */
.aud_prog {
  display: inline-block;
  width: 100%;
}

/*=====  End of Sliders   ======*/
</style>

<style lang="scss">
@import '../../style/base/_variables.scss';
/*=============================================
=            modal popup            =
=============================================*/
$modal-bg: #0d0d0f;
$modal-bg-section: lighten($modal-bg, 4%);
.aud_modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  background: rgba(0, 0, 0, 0.92);

  .aud_modal-bg {
    background: $modal-bg-section;
  }
  .aud_modal-section {
    text-align: center;
    margin: 0 0 1rem 0;
    padding: 0.5rem 10px;
  }
  .aud_modal-in {
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
  .aud_modal-in-wrap {
    text-align: center;
  }
  /*----------  close  ----------*/
  .aud_modal-close {
    text-align: right;
  }
  .aud_modal-close-btn {
    margin: 15px;
  }
  /*----------  volume  ----------*/
  .aud_modal-volume {
    display: flex;
    justify-content: center;
  }
  .aud_volume-wrap {
    padding: 0;
  }
}

/*=====  End of modal popup  ======*/
</style>
