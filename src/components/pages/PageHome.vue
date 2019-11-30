<template>
  <div>
    <header>

    </header>
    <main class="p-container">
      <div class="intro"> 
        <BaseSearch></BaseSearch>
      </div>
    </main>
    <footer>
    </footer>
  </div>
</template>

<script>
// import BaseHeader from '../base/BaseHeader.vue';

export default {
  name: 'PageHome',
  props: ['msg'],
  components: {
    // BaseHeader: BaseHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .intro {
    padding-top: 150px; 
  }
  input {
    display: block; 
    width: 100%; 
    max-width: 800px; 
    font-size: 2rem; 
    margin: auto; 
  }
</style>
