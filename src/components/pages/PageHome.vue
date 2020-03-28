<template>
  <div class="home">
    <div class="b_wrapper">
      <div class="home-ft">
        <h1>Podcast Web Player Demo</h1>
        <h2>Discover your next favorite podcast</h2>
      </div>

      <div class="recs">
        <PodCarousel v-bind:prop_genre_id="138"> Movies </PodCarousel>
        <PodCarousel v-bind:prop_genre_id="133"> Comedy </PodCarousel>
        <PodCarousel v-bind:prop_genre_id="99"> News </PodCarousel>
        <PodCarousel v-bind:prop_genre_id="77"> Sports </PodCarousel>
        <PodCarousel v-bind:prop_genre_id="85"> Video Games </PodCarousel>
        <PodCarousel v-bind:prop_genre_id="131"> Tech News </PodCarousel>
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
    return {};
  },
  computed: {},
  created: function() {},
  destroyed: function() {}
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
