<template>
  <header class="he">
    <div id="pod-fixed-nav-placeholder" class="visibility-none" v-bind:style="{ height: fixedNavHeight }"></div>
    <nav id="pod-fixed-nav" class="he-in">
      <div class="b_wrapper">
        <div class="he-flex">
          <!-- search -->
          <button
            class="he-search-btn"
            v-on:click="metSearchToggle"
            v-bind="{ 'aria-label': isSearchVisible ? 'Close Search' : 'Open Search' }"
          >
            <i class="fas" aria-hidden="true" v-bind:class="[isSearchVisible ? 'fa-arrow-circle-left' : 'fa-search']"></i>
          </button>
          <BaseSearch v-show="isSearchVisible" class="he-search" data-comp="basesearch"></BaseSearch>
          <!-- non-search group -->
          <div class="he-nav-group" v-bind:class="{ 'hidden-xs': isSearchVisible }">
            <span>
              <router-link
                class="he-logo"
                :to="{
                  name: 'RouteHome'
                }"
              >
                PodNexus
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'BaseHeader',
  props: ['msg'],
  components: {},
  data: function() {
    return {
      isLoaded: false,
      isSearchVisible: false,
      fixedNavHeight: '0px'
    };
  },
  computed: {
    compScreenWidth() {
      let refreshHack = this.isLoaded;
      let getScreenWidth = this.$store.state.podUtil.screenWidthPixels;
      return this.$store.state.podUtil.screenWidthPixels;
    },
    compHeaderHeight() {
      let refreshHack = this.isLoaded;
      let getScreenWidth = this.compScreenWidth;
      this.metHeaderHeight();
    }
  },
  mounted: function() {
    this.$nextTick().then(() => {
      this.metHeaderHeight();
    });
  },
  created: function() {
    this.isLoaded = true;
  },
  destroyed: function() {
    this.isLoaded = false;
  },
  methods: {
    metSearchToggle: function() {
      this.isSearchVisible = this.isSearchVisible ? false : true;
    },
    metHeaderHeight: function() {
      let elFixedNav = document.getElementById('pod-fixed-nav');
      if (elFixedNav) {
        this.fixedNavHeight = elFixedNav.offsetHeight + 'px';
      }
    }
  }
};
</script>

scrollPosY

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';
/*=============================================
=            helper classes             =
=============================================*/
.hidden-xs {
  @media all and (max-width: $break-sm - 1) {
    display: none;
  }
}
.visibility-none {
  visibility: hidden;
}
/*=====  End of helper classes   ======*/
.he {
  &-in {
    width: 100%;
    padding: 10px 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 4;
    background: $color-black;
    display: flex;
  }
  &-flex {
    width: 100%;
    min-height: 33px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }

  /*=============================================
  =            Search            =
  =============================================*/
  [data-comp='basesearch'] {
    // width: 100%;
    max-width: 600px;
    flex-grow: 1;
  }
  /*----------  search button  ----------*/
  &-search-btn {
    margin-right: 5px;
    border: none;
    background: transparent;
    -webkit-appearance: none;
    color: $color-white;
    font-size: 1.5rem;

    /* show search button only on mobile */
    display: inline-block;
    @media all and (min-width: $break-md) {
      display: none;
    }
  }
  /*----------  Search COMPONENT  ----------*/
  /* target the child search component */
  &-search {
    @media all and (min-width: $break-md) {
      display: block !important;
    }
  }
  /*=====  End of Search  ======*/
  /*=============================================
  =            nav group (except for seach)            =
  =============================================*/
  &-nav-group {
    padding-left: 15px;
  }
  /*=====  End of nav group (except for seach)  ======*/
  &-logo {
    text-decoration: none;
    font-weight: bold;
    word-break: keep-all;
  }
}
</style>
