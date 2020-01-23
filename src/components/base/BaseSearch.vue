<template>
  <div class="wrap" v-bind:class="{ active: isFocused }">
    <form class="form">
      <div class="search">
        <label for="search-l" class="p-sr-only">Search Podcasts</label>
        <i class="icon icon-search" aria-hidden="true"></i>
        <input
          id="app-search-input"
          class="search-input"
          placeholder="Search Podcasts"
          type="search"
          autocomplete="off"
          v-model="query"
          v-on:input="queryUpdate"
          v-on:focus="onFocus"
          v-on:blur="onBlur"
        />
      </div>
      <div class="drop" v-show="isFocused">
        <span class="pod-sr-only">Results</span>
        <div class="drop-in" role="listbox" v-if="compDataPod">
          <!-- podcasts -->
          <div class="drop-group" v-if="compDataPod.podcasts && compDataPod.podcasts.length">
            <div class="drop-label dropdown-item">Podcasts</div>
            <router-link
              class="drop-item"
              role="option"
              tabindex="0"
              v-for="podcast in compDataPod.podcasts"
              v-bind:key="podcast.id"
              v-on:focus.native="onFocus"
              v-on:blur.native="onBlur"
              :to="{
                name: 'podcast',
                params: { name: podcast.publisher_original, id: podcast.id }
              }"
            >
              <span>{{ podcast.publisher_original }}</span>
            </router-link>
          </div>
          <!-- genres -->
          <div class="drop-group" v-if="dataPod.genres && dataPod.genres.length">
            <div class="drop-label drop-item">Genres</div>
            <router-link
              class="drop-item"
              role="option"
              tabindex="0"
              v-for="genre in compDataPod.genres"
              v-bind:key="genre.id"
              v-on:focus.native="onFocus"
              v-on:blur.native="onBlur"
              :to="{
                name: 'search',
                query: { q: genre.name, genre_id: genre.id }
              }"
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
      // used to display dropdown
      isFocused: false,
      // class set on elements to check if any element in dropdown is focused
      focusClass: 'is-focus'
    };
  },
  computed: {
    // api typeahead response, formatted
    compDataPod() {
      var getData = this.dataPod;
      var getDataGenre = getData && getData.genres ? getData.genres.slice(0, 5) : null;
      var getDataPodcasts = getData && getData.podcasts ? getData.podcasts.slice(0, 10) : null;
      var formatData = {
        genres: getDataGenre,
        podcasts: getDataPodcasts
      };
      if (getData) {
        return formatData;
      } else {
        return null;
      }
    }
  },
  components: {},
  created: function() {
    /*
      setup debouncing for query
    */
    function getQuery() {
      this.queryDebounced = this.query;
    }
    this.runQueryDebounced = Debounce(getQuery, 400);
  },
  watch: {
    /*
      setup debouncing for query
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
     *
     * Handle opening and closing dropdown:
     * reacts to focus and blur events
     *
     */
    /*
      Focus: 
      add focus class to focused element; 
      used to check if any element has focus on-blur
    */
    onFocus: function(event) {
      this.isFocused = true;
      event.target && event.target.classList.add(this.focusClass);
    },
    /*
      Blur:
      check if any elements have focus class to determined if dropdown can be closed
    */
    onBlur: function(event) {
      var $getEl = this.$el;
      var self = this;
      var formatClassQuery = '.' + self.focusClass;
      // run on timeout to handle focus shifting between elements
      window.setTimeout(function() {
        event.target && event.target.classList.remove(self.focusClass);
        if ($getEl && $getEl.querySelector(formatClassQuery)) {
          self.isFocused = true;
        } else {
          self.isFocused = false;
        }
      }, 80);
    },
    /**
     *
     * Query Update:
     * updates query value on search inputs
     *
     */
    queryUpdate: function(event) {
      this.query = event.target.value;
    },
    /**
     *
     * Get API typeahead data
     *
     */
    getPodcasts: function() {
      let self = this;
      let getQuery = this.queryDebounced;
      // set request params
      let requestParams = {
        q: getQuery,
        show_podcasts: 1,
        show_genres: 1,
        safe_mode: 1
      };
      // run axios request
      Axios.get('/api/typeahead', {
        params: requestParams,
        responseType: 'json',
        validateStatus: function(status) {
          return status == 200;
        }
      })
        .then(function(response) {
          self.dataPod = response.data.success;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.form {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
}
.search-input {
  width: 100%;
  border-radius: 1em;
  padding: 0.75rem 15px;
  font-size: 1.25rem;
}
.drop {
  width: 100%;
  position: absolute;
  top: 100%;
  top: calc(100% + 10px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.drop-in {
  padding: 0.5rem 15px;
  background: #fff;
  color: #000;
}
.drop-item,
.drop-label {
  display: block;
  padding: 0.5rem 0;
}
.drop-label {
  padding-top: 0.75rem;
}
.drop-label {
  font-size: 1.25em;
  font-weight: bold;
}
.drop-item {
  display: block;
}
</style>
