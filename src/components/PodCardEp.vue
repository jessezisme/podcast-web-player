<template>
  <div class="ep zzz">
    <div class="ep_sum">
      <!-- title -->
      <div class="ep_title">
        <slot name="slot-cardep-title"> </slot>
      </div>
      <!-- image -->
      <span class="ep_thumb-wrap">
        <slot name="slot-cardep-thumb"> </slot>
      </span>
      <!-- description -->
      <p class="ep_desc">
        <slot name="slot-cardep-desc"> </slot>
      </p>
    </div>
    <!-- date-->
    <div class="ep_date">
      <slot name="slot-cardep-date"> </slot>
    </div>
    <!-- play/pause controls -->
    <slot name="slot-cardep-controls"> </slot>
  </div>
</template>

<script>
export default {
  name: 'PodCardEp',
  components: {},
  props: [''],
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

.ep {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 30px 0;
  padding: 30px;
  background: $color-grey-95;
}
.ep_sum {
  width: 100%;
}
.ep_title,
.ep_desc {
  padding-top: 0;
  padding-bottom: 5px;
}
.ep_title {
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 5px;
}
.ep_thumb-wrap {
  max-width: 65px;
  float: left;
  padding: 0 10px 10px 0;

  img {
    max-width: 100%;
  }
}
.ep_desc {
  font-size: 0.85rem;
}
.ep_play {
  display: inline-flex;
}
.ep_play-btn {
  position: relative;
  width: 60px;
  height: 60px;
  padding: 0;
  font-size: 2.65rem;
  background: transparent;
  /* reset button styles */
  appearance: none;
  border: none;
}
.ep_date {
  font-size: 0.85rem;
}
.ep_play-btn-in {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media all and (min-width: 650px) {
  .ep_sum {
    width: 60%;
  }
}
</style>
