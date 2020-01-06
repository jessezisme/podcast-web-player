<template>
  <div v-cloak>
    <!-- header -->
    <!-- page -->
    <router-view></router-view>
    <!-- audio player -->
    <router-view name="BaseAudio"></router-view>
    <!-- footer -->
  </div>
</template>

<script>
import BaseAudio from "./components/base/BaseAudio.vue";

export default {
  name: "App",
  // props: [""],
  components: {
    BaseAudio: BaseAudio
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
