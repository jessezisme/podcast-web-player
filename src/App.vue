<template>
  <div v-cloak>
    <!-- header -->
    <BaseHeader></BaseHeader>
    <!-- page -->
    <router-view></router-view>
    <!-- audio player -->
    <BaseAudio></BaseAudio>
    <!-- footer -->
  </div>
</template>

<script>
// Vue
import Vue from 'vue/dist/vue.esm.js';
import BaseHeader from './components/base/BaseHeader.vue';
import BaseAudio from './components/base/BaseAudio.vue';

export default {
  name: 'App',
  // props: [""],
  data: function() {
  },
  components: {
    BaseAudio: BaseAudio
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
