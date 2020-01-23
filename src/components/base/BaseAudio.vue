<template>
  <div class="aud">
    <div class="aud-title"></div>
  </div>
</template>

<script>
import Amplitude from 'amplitudejs';

export default {
  name: 'BaseAudio',
  // props: [""],
  components: {},
  data: function() {
    return {
      podcast: null,
      podcastRaw: {},
      playlist: {},
      // flag to check if amplitude player was initialized
      isPlayerInit: false
    };
  },
  computed: {
    comPodcastRaw() {
      const getPodcast = this.$store.state.podAudio.podcast;
      const playerPod = {};

      



      this.podcastRaw = getPodcast;
      return getPodcast;
    },
    comPodcast() {
      const getPodcast = this.podcast;
      const getPodcastRaw = this.podcastRaw;
      const playerPod = {};
    }
  },
  watch: {
    // podcastRaw: function(newVal, oldVal) {}
  },
  mounted: function() {
    // check store podcast data
    this.metInitCheckData();
  },
  methods: {
    /*
      Check store podcast data; 
      run this on init; computed handles data updates thereafter; 
     */
    metInitCheckData: function() {
      this.podcastRaw = this.$store.state.podAudio.podcast || null;
    },
    /**
     *
     * Player Controls:
     *
     */
    // Play
    metPlay: function() {
      Amplitude.play();
    },
    // Pause
    metPause: function() {
      Amplitude.pause();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
