<template>
  <div>
    <header></header>
    <main class="p-container">
      <div class="intro">
        <BaseSearch></BaseSearch>
      </div>

      <div class="recs">
        <PodCarousel v-bind:prop_genre_id="68">
          Video Games
        </PodCarousel>
      </div>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import PodCarousel from "../PodCarousel.vue";

export default {
  name: "PageHome",
  props: ["genre_id"],
  components: {
    PodCarousel: PodCarousel
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.intro {
  padding-top: 150px;
}
</style>
