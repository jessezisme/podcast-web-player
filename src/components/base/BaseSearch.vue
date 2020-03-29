<template>
  <div class="search" v-on:focusin="metFormFocusIn" v-on:focusout="metFormFocusOut">
    <form class="form">
      <!-- search input -->
      <div class="search-cont">
        <label for="search-l" class="b_sr-only">Search Podcasts</label>
        <i class="icon icon-search" aria-hidden="true"></i>
        <form class="search-input-cont" v-on:submit="metFormPreventSubmit">
          <input
            id="app-search-input"
            class="search-input"
            placeholder="Search Podcasts"
            type="search"
            autocomplete="off"
            v-model="query"
            v-on:input="queryUpdate"
            v-on:keyup="metFormKeySubmit"
          />
          <button type="reset" class="search-clear" v-show="query" v-on:click.prevent="metSearchClear">
            <span>
              <i class="fas fa-times" aria-hidden="true"></i>
            </span>
          </button>
          <button
            class="search-submit"
            type="submit"
            aria-label="submit"
            v-on:click.prevent="metFormSubmit"
            v-bind:disabled="!queryDebounced || !queryDebounced.length"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>
        </form>
      </div>
      <!-- results dropdown -->
      <div class="search-drop" v-show="compShowDropdown">
        <span class="b_sr-only">Results</span>
        <div class="search-drop-in" role="listbox" v-if="compShowDropdown">
          <!-- podcasts -->
          <div class="search-drop-group" v-if="compDataPod.podcasts && compDataPod.podcasts.length">
            <div class="search-drop-label search-drop-item">Podcasts</div>
            <div class="search-drop-item" v-for="podcast in compDataPod.podcasts" v-bind:key="podcast.id">
              <router-link
                role="option"
                tabindex="0"
                :to="{
                  name: 'RoutePodcast',
                  params: { routeName: metUtilUrl().prettyString(podcast.publisher_original), routeID: podcast.id }
                }"
              >
                <span>{{ podcast.publisher_original }}</span>
              </router-link>
            </div>
          </div>
          <!-- genres -->
          <div class="search-drop-group" v-if="compDataPod.genres && compDataPod.genres.length">
            <div class="search-drop-label search-drop-item">Genres</div>
            <router-link
              class="search-drop-item"
              role="option"
              tabindex="0"
              v-for="genre in compDataPod.genres"
              v-bind:key="genre.id"
              :to="metUtilUrl().encodeURL('/search/' + genre.name)"
            >
              <span>{{ genre.name }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Axios from 'axios';
import Debounce from 'debounce';
import Util_main from '../../../utils/util-main.js';

export default {
  name: 'BaseSearch',
  data: function() {
    return {
      // api typeahead response, unformatted; used by computed
      dataPod: null,
      // query term, raw and undebounced;
      query: '',
      // query term, debounced to reduced excessive api requests
      queryDebounced: '',
      // show dropdown toggle
      dataShowDropdown: false,
      //
      dataFormHasFocus: false
    };
  },
  computed: {
    /**
     * used to toggle dropdown
     */
    compShowDropdown() {
      return this.compDataPod && this.dataFormHasFocus ? true : false;
    },
    /**
     * api typeahead response, formatted
     */
    compDataPod() {
      var getData = this.dataPod;
      var getGenre = getData && getData.genres && Array.isArray(getData.genres) ? getData.genres.slice(0, 15) : [];
      var getPodcasts = getData && getData.podcasts && Array.isArray(getData.podcasts) ? getData.podcasts.slice(0, 15) : [];
      var formatData = {
        genres: getGenre,
        podcasts: getPodcasts
      };
      if (getGenre.length || getPodcasts.length) {
        return formatData;
      } else {
        return null;
      }
    }
  },
  components: {},
  created: function() {
    /**
     * setup debouncing for query
     */
    function getQuery() {
      this.queryDebounced = this.query;
    }
    this.runQueryDebounced = Debounce(getQuery, 400);
  },
  watch: {
    $route: function(to, from) {
      this.metSearchClear();
    },
    /**
     * setup debouncing for query
     */
    query: function(newValue, oldValue) {
      this.runQueryDebounced();
    },
    queryDebounced: function(newValue, oldValue) {
      this.getPodcasts();
    }
  },
  methods: {
    /**
     * query update:
     * updates query value on search input
     */
    queryUpdate: function(event) {
      this.query = event.target.value;
    },
    /**
     * used to check if any element inside form has focus
     */
    metFormFocusIn: function(event) {
      this.dataFormHasFocus = true;
    },
    /**
     * every time a form element runs focus-out, check if any element inside form still has focus;
     * used to control dropdown visibility
     */
    metFormFocusOut: function(event) {
      const self = this;
      window.setTimeout(function() {
        if (document.activeElement && self.$el.contains(document.activeElement)) {
          self.dataFormHasFocus = true;
        } else {
          self.dataFormHasFocus = false;
        }
      }, 200);
    },

    /**
     * clear search:
     */
    metSearchClear: function() {
      this.query = '';
      this.queryDebounced = '';
    },
    /**
     * return imported utility module for use
     */
    metUtilUrl: function() {
      return Util_main;
    },
    /**
     * handle search submit
     */
    metFormSubmit: function() {
      let searchURL = Util_main.encodeURL('/search/' + this.query);
      // query should not be empty
      if (!this.query || !this.query.length) {
        return false;
      }
      // prevent trigger router change when on same page
      if (this.$route.path === searchURL) {
        return false;
      }
      this.$router.push({ path: searchURL });
    },
    /**
     * prevent search form default submit
     */
    metFormPreventSubmit: function(event) {
      event.preventDefault();
      return false;
    },
    /**
     * handle key events, such as enter for submit
     */
    metFormKeySubmit: function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.metFormSubmit();
      }
    },
    /**
     * get API typeahead data
     */
    getPodcasts: function() {
      let self = this;
      let getQuery = this.queryDebounced;
      // set request params
      let requestParams = {
        q: getQuery,
        show_podcasts: 1,
        show_genres: 1,
        safe_mode: 0
      };

      function successCB(response) {
        self.dataPod = response.data.success;
      }
      function errorCB(error) {
        console.log(error);
      }
      // run axios request
      Axios.get(Util_main.stringifyURL('/api/typeahead', requestParams), {
        responseType: 'json',
        validateStatus: function(status) {
          return status == 200;
        }
      })
        .then(successCB)
        .catch(errorCB);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';

.search {
  display: block;
  width: 100%;
  position: relative;
  font-size: $font-size-sm;

  &-input-cont {
    position: relative;
  }
  &-input {
    display: inline-block;
    width: 100%;
    height: 2rem;
    padding-left: 10px;
    border-radius: 15px;
    padding-right: 80px;
  }
  &-submit,
  &-clear {
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
    bottom: 0;
    top: 0;
    display: inline-block;
    height: 100%;
    border-radius: 0 10px 10px 0;
    box-shadow: none;
    border-color: transparent;
    font-size: 1rem;
    text-align: center;
    color: $color-black;
  }
  &-clear {
    right: 40px;
    background: none;
    opacity: 0.4;

    > span {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  }
}
.search-drop {
  width: 100%;
  max-width: 650px;
  max-height: 75vh;
  overflow-y: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: $color-white;
  color: $color-black;
  margin-top: 5px;
  border-radius: 10px;

  a {
    display: block;
    width: 100%;
    padding: 5px;

    &:hover {
      background: $color-grey-10;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-in {
    padding: 15px;
    border-radius: 5px;
  }
  &-label {
    font-weight: bold;
    padding-top: 0.25em;
  }
  &-item {
    display: block;
    padding: 0.25em 0;
    font-size: $font-size-sm;
  }
}
</style>
