<template>
  <transition enter-class="animated fadeInUp" leave-class="animated fadeOutDown">
    <div class="modal" role="dialog" tabindex="-1">
      <div class="modal_in">
        <!-- header -->
        <div class="modal_header">
          <div class="modal_close">
            <button v-on:click="$emit('modal-close')" class="b_btn aud_modal-close-btn">Close Menu</button>
          </div>
          <slot name="slot-modal-header"> </slot>
        </div>
        <!-- main -->
        <div class="modal_main">
          <slot name="slot-modal-main"> </slot>
        </div>
        <!-- footer -->
        <div class="modal_footer">
          <slot name="slot-modal-footer"> </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',
  components: {},
  props: [''],
  data: function() {
    return {
      scrollY: null
    };
  },
  computed: {
    compSlots() {
      return this.$slots;
    }
  },
  created: function() {
    const self = this;
    self.$root.$on('modal.close', () => {
      self.$emit('modal-close');
    });
  },
  mounted: function() {
    document.body.classList.add('modal-open');
  },
  beforeDestroy: function() {
    document.body.classList.remove('modal-open');
  },
  destroyed: function() {},

  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';

/*=============================================
=            modal popup            =
=============================================*/
$modal-bg: #0d0d0f;
$modal-bg-section: lighten($modal-bg, 4%);
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  background: rgba(0, 0, 0, 0.92);

  .modal_in {
    width: 950px;
    height: 950px;
    max-height: 90vh;
    max-width: calc(100% - 30px);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 10px 15px;
    margin: auto;
    overflow: auto;
    background: $modal-bg;
    border: $color-accent-3;
  }
  /*----------  close  ----------*/
  .modal_close {
    text-align: right;
  }
  .modal_close-btn {
    margin: 15px;
  }
}

/*=====  End of modal popup  ======*/
</style>
