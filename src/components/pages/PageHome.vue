<template>
  <div class="home">
    <div class="b_wrapper">
      <div class="home-ft">
        <h1>Podcast Web Player Demo</h1>
        <h2>Discover your next favorite podcast</h2>
      </div>

      <div class="recs">
        <PodCarousel v-bind:prop_genre_id="67">Comedy</PodCarousel>
        <PodCarousel v-bind:prop_genre_id="68">Video Games</PodCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import PodCarousel from '../PodCarousel.vue';

export default {
  name: 'PageHome',
  // props: ["genre_id"],
  components: {
    PodCarousel: PodCarousel
  },
  data: function() {
    return {
      isLiving: false
    };
  },
  computed: {
    compScreenSize() {
      let refreshHack = this.isLiving;
      this.screenSize = this.$store.state.podUtil.screenWidth;
      return this.$store.state.podUtil.screenWidth;
    }
  },
  created: function() {
    this.isLiving = true;
  },
  destroyed: function() {
    this.isLiving = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.intro {
  padding-top: 150px;
}
.home {
  padding: 2rem 0;
}
.home-ft {
  text-align: center;
  padding: 8rem 0;
}
</style>
