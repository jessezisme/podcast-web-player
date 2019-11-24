<template>
  <div class="hello">
    <BaseHeader></BaseHeader>
    <h1>Homepage</h1>
  </div>
</template>

<script>
import BaseHeader from "../base/BaseHeader.vue";

export default {
  name: "VuePageHome",
  props: ["msg"],
  components: {
    BaseHeader: BaseHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
