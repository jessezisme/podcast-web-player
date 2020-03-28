<template>
  <div class="null">
    <div class="b_wrapper">
      <div class="null_intro">
        <h1>404. You've made a huge mistake.</h1>
        <img class="null_img" src="/img/404-mistake.gif" alt="arrested developer, you've made a huge mistake gif." />
      </div>
    </div>
  </div>
</template>

<script>
import PodCarousel from '../PodCarousel.vue';

export default {
  name: 'Page404',
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
.null_intro {
  margin: 100px auto;
  text-align: center;
}
.null_img {
  display: inline-block;
  max-width: 100%;
}
</style>
