<template>
  <div class="p-container">
    <h1>Header</h1>
    <BaseSearch> </BaseSearch>
  </div>
</template>

<script>
// import BaseSearch from './BaseSearch.vue';

export default {
  name: 'BaseHeader',
  props: ['msg'],
  components: {
  },
  data: function() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
