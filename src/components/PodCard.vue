<template>
  <div class="card">
    <div class="card_in">
      <!-- image-->
      <div class="card_img-wrap" v-show="compSlots['slot-card-hero']">
        <slot name="slot-card-hero"> </slot>
      </div>
      <!-- description -->
      <div class="card_desc" v-show="compSlots['slot-card-desc']">
        <slot name="slot-card-desc"> </slot>
      </div>
      <!-- bottom link -->
      <div class="card_desc-link" v-show="compSlots['slot-card-footer']">
        <slot name="slot-card-footer"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PodCard',
  components: {},
  // props: [''],
  data: function() {
    return {};
  },
  computed: {
    compSlots() {
      return this.$slots;
    }
  },
  created: function() {},
  destroyed: function() {},
  mounted: function() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../style/base/_variables.scss';

.card {
  max-width: 225px;
  padding: 8px;

  a {
    text-decoration: none;
  }
}
.card_in {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: $color-grey-95;
  border-radius: 8px;
  box-shadow: inset 0 0 2px 0px $color-accent-3;
}
.card_img-wrap {
  position: relative;
  width: 100%;
  height: auto;
  margin: auto;
  max-width: 150px;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    max-width: 150px;
    margin: auto;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.card_it-link {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.card_desc {
  flex-grow: 2;
  font-size: 0.85rem;
  padding: 8px;
  word-break: break-word;
  hyphens: auto;
}
.card_desc-link {
  padding: 8px;
  text-decoration: underline;
}
</style>
