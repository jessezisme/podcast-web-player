<template>
  <div class="wrap" v-bind:class="{ active: isFocused }">
    <form class="form">
      <div class="bar form-group">
        <label for="app-search-input" class="p-sr-only">Search Podcasts</label>
        <i class="icon icon-search" aria-hidden="true"></i>
        <input
          id="app-search-input"
          class="form-input input is-rounded is-medium"
          placeholder="Search Podcasts"
          type="search"
          autocomplete="off"
          v-model="query"
          v-on:keyup="queryUpdate"
          v-on:focus="onFocus"
          v-on:blur="onBlur"
        />
      </div>
      <div class="dropdown-wrap" v-show="isFocused">
        <span class="pod-sr-only">Results</span>
        <div
          class="dropdown-content"
          role="listbox"
          v-if="
            storePodcastData &&
              ((storePodcastData.podcasts &&
                storePodcastData.podcasts.length) ||
                (storePodcastData.terms && storePodcastData.terms.length) ||
                (storePodcastData.genres && storePodcastData.length))
          "
        >
          <!-- podcasts -->
          <div
            class="dropdown-group"
            v-if="storePodcastData.podcasts && storePodcastData.podcasts.length"
          >
            <div class="dropdown-label dropdown-item">Podcasts</div>
            <router-link
              class="dropdown-item"
              role="option"
              tabindex="0"
              v-for="podcast in storePodcastData.podcasts"
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
          <div
            class="dropdown-group"
            v-if="storePodcastData.genres && storePodcastData.genres.length"
          >
            <div class="dropdown-label dropdown-item">Genres</div>
            <router-link
              class="dropdown-item"
              role="option"
              tabindex="0"
              v-for="genre in storePodcastData.genres"
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
import axios from "axios";
import debounce from "debounce";

export default {
  name: "BaseSearch",
  data: function() {
    return {
      query: "",
      queryDebounced: "",
      queryDebouncedURI: "",
      isFocused: false,
      focusClass: "is-focus"
    };
  },
  computed: {
    storePodcastData() {
      var getData = this.$store.state.podAPI.typeahead;
      var formatData = {
        genres: [],
        podcasts: []
      };
      // genres: limit to 5
      if (getData && getData.genres && getData.genres.length) {
        getData.genres.slice(0, 5).forEach(function(val, index, array) {
          val && val.id && val.name && formatData.genres.push(val);
        });
      }
      // podcasts: limit to 10
      if (getData && getData.podcasts && getData.podcasts.length) {
        getData.podcasts.slice(0, 10).forEach(function(val, index, array) {
          val &&
            val.id &&
            val.publisher_original &&
            formatData.podcasts.push(val);
        });
      }
      return formatData;
    }
  },
  components: {},
  created: function() {
    function getQuery() {
      this.queryDebounced = this.query;
    }
    this.runQueryDebounced = debounce(getQuery, 400);
  },
  watch: {
    query: function(newValue, oldValue) {
      this.runQueryDebounced();
    },
    queryDebounced: function(newValue, oldValue) {
      this.getPodcasts();
    }
  },
  methods: {
    onFocus: function(event) {
      this.isFocused = true;
      event.target && event.target.classList.add(this.focusClass);
    },
    onBlur: function(event) {
      var $getEl = this.$el;
      var self = this;
      var formatClassQuery = "." + self.focusClass;
      window.setTimeout(function() {
        event.target && event.target.classList.remove(self.focusClass);
        if ($getEl && $getEl.querySelector(formatClassQuery)) {
          console.log("IS FOCUSED");
          self.isFocused = true;
        } else {
          console.log("NOT FOCUSED");
          self.isFocused = false;
        }
      }, 400);
    },
    queryUpdate: function(event) {
      this.query = event.target.value;
    },
    getPodcasts: function() {
      var getQuery = this.queryDebounced;
      this.$store.dispatch("podAPI/typeaheadAction", {
        searchTerm: getQuery
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
.dropdown-wrap {
  width: 100%;
  position: absolute;
  top: 100%;
  top: calc(100% + 10px);
}
.dropdown-label {
  font-size: 1.25em;
  font-weight: bold;
}
</style>
