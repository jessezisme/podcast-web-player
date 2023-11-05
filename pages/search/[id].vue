<template>
  <section v-if="!isLoading">
    <!-- If: Search Results -->
    <template v-if="!isNoResults">
      <!-- Intro -->
      <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <h1 class="text-center">Search Results</h1>
        </div>
      </div>
      <!-- Podcasts -->
      <section v-if="podcasts?.length">
        <div class="container">
          <div
            class="w-full grid gap-[2rem] grid-cols-[repeat(auto-fit,_minmax(160px,_200px))] justify-center justify-items-center"
          >
            <template v-for="pod in podcasts" :key="pod.id">
              <PodcastCard
                v-if="pod._app?.linkPodcast"
                :podcast="{
                  id: pod.id,
                  title: pod.title_original,
                  link: pod._app.linkPodcast,
                  image: pod.image || pod.thumbnail,
                }"
              />
            </template>
          </div>
          <div class="flex justify-center items-center min-h-[10rem]">
            <button
              v-if="podcastNextOffset"
              @click="clickLoadMore('podcast')"
              :disabled="isLoadingMoreResults"
              class="btn btn-primary btn--lg my-8"
            >
              Load More Podcasts
            </button>
          </div>
        </div>
      </section>

      <!-- Episodes -->
      <section v-if="episodes?.length">
        <div class="container">
          <div class="flex flex-col gap-[2rem] items-center">
            <template v-for="ep in episodes" :key="ep.id">
              <EpisodeCard
                :episode="{ ...ep, description: ep.description_original, title: ep.title_original }"
              ></EpisodeCard>
            </template>
          </div>
          <div class="flex justify-center items-center min-h-[10rem]">
            <button
              v-if="episodeNextOffset"
              @click="clickLoadMore('episode')"
              :disabled="isLoadingMoreResults"
              class="btn btn-primary btn--lg my-8"
            >
              Load More Episodes
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- Else: No Search Results -->
    <template v-if="isNoResults">
      <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <h1 class="text-center">No Search Results Found</h1>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import type * as SearchTypes from '~/shared/podcast/api/types/search-get';
import { useRoute } from 'vue-router';
import { PodClientService } from '~/shared/podcast/api/services';
import * as Utils from '~/shared/utils';

const route = useRoute();
const routeId = computed(() => route.params?.id?.toString() || '');
const isLoading = computed(() => episodeReq.status.value === 'pending' || podcastReq.status.value === 'pending');
const isLoadingMoreResults = computed(
  () => isLoading.value || loadMorePodcastsReq.status.value === 'pending' || loadMoreEpisodesReq.status.value === 'pending'
);
const isNoResults = computed(() => !isLoading.value && !podcasts?.value?.length && !episodes?.value?.length);
const episodeResponse = ref<SearchTypes.ServerResponseEpisode | null>();
const podcastResponse = ref<SearchTypes.ServerResponsePodcast | null>();
const episodes = ref<SearchTypes.ServerResponseEpisode['results'][0][] | null>([]);
const podcasts = ref<SearchTypes.ServerResponsePodcast['results'][0][] | null>([]);

const episodeNextOffset = computed(() => {
  return episodeResponse.value?.next_offset;
});
const podcastNextOffset = computed(() => {
  return podcastResponse.value?.next_offset;
});

const resetPageChange = () => {
  episodeResponse.value = null;
  podcastResponse.value = null;
  episodes.value = [];
  podcasts.value = [];
};

const loadMorePodcastsReq = await useAsyncData(
  `get-search-podcasts-more-podcasts-${routeId.value}-${podcastNextOffset.value}`,
  () =>
    new PodClientService().getSearchPodcasts({
      query: { q: routeId.value, type: 'podcast', offset: podcastNextOffset.value },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(loadMorePodcastsReq.status, (status) => {
  const loadMoreData = toRaw(loadMorePodcastsReq.data.value);

  if (status === 'pending') {
    return;
  }
  if (loadMoreData) {
    podcastResponse.value = loadMoreData;
    podcasts.value?.push(...(loadMoreData?.results?.length ? loadMoreData.results : []));
  }
});

const loadMoreEpisodesReq = await useAsyncData(
  `get-search-episodes-more-episodes-${routeId.value}-${episodeNextOffset.value}`,
  () =>
    new PodClientService().getSearchEpisodes({
      query: { q: routeId.value, type: 'episode', offset: episodeNextOffset.value },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(loadMoreEpisodesReq.status, (status) => {
  const loadMoreData = toRaw(loadMoreEpisodesReq.data.value);

  if (status === 'pending') {
    return;
  }
  if (loadMoreData) {
    episodeResponse.value = loadMoreData;
    episodes.value?.push(...(loadMoreData?.results || []));
  }
});

const episodeReq = await useAsyncData(
  `get-search-episodes-${routeId.value}`,
  () =>
    new PodClientService().getSearchEpisodes({
      query: { q: routeId.value, type: 'episode' },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

const podcastReq = await useAsyncData(
  `get-search-podcasts-${routeId.value}`,
  () =>
    new PodClientService().getSearchPodcasts({
      query: { q: routeId.value, type: 'podcast' },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch([episodeReq.status, podcastReq.status], () => {
  if (episodeReq.status.value === 'pending' || podcastReq.status.value === 'pending') {
    return;
  }

  episodeReq.data.value?.results && episodes.value?.push(...episodeReq.data.value.results);
  podcastReq.data.value?.results && podcasts.value?.push(...podcastReq.data.value.results);
  episodeResponse.value = unref(episodeReq.data);
  podcastResponse.value = unref(podcastReq.data);
});

const getAllSearchData = () => {
  episodeReq.execute();
  podcastReq.execute();
};

const clickLoadMore = (type: 'episode' | 'podcast') => {
  if (isLoadingMoreResults.value) {
    return;
  }
  if (type === 'episode' && episodeNextOffset.value) {
    loadMoreEpisodesReq.execute();
  }
  if (type === 'podcast' && podcastNextOffset.value) {
    loadMorePodcastsReq.execute();
  }
};

watch(
  routeId,
  (newVal) => {
    resetPageChange();
    newVal && getAllSearchData();
  },
  { immediate: true }
);
</script>
