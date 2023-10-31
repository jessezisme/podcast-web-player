<template>
  <section v-if="!isLoading">
    <!-- If: Details -->
    <template v-if="genreDetails">
      <!-- Intro -->
      <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <h1 class="text-center">
            Popular Podcasts for Genre: <br />
            <span class="italic underline">{{ genreDetails.name }}</span>
          </h1>
        </div>
      </div>
      <!-- Podcasts Results -->
      <div v-if="podcasts?.length">
        <div class="container">
          <div
            class="w-full grid gap-[2rem] grid-cols-[repeat(auto-fit,_minmax(160px,_200px))] justify-center justify-items-center"
          >
            <template v-for="pod in podcasts" :key="pod.id">
              <NuxtLink
                v-if="pod._app?.linkPodcast"
                :href="pod._app?.linkPodcast"
                class="p-2 shadow-md rounded-sm max-w-full"
              >
                <div class="aspect-[1/1] flex items-center">
                  <img :src="pod.image" class="object-contain max-w-full" lazy alt="" />
                </div>
                <div v-if="pod.title" class="text-center text-ellipsis w-full py-2 text-sm font-semibold">
                  {{ Utils.truncateText(Utils.stripHTML(pod.title), 200) }}
                </div>
              </NuxtLink>
            </template>
          </div>
          <div class="flex justify-center items-center min-h-[10rem]">
            <button
              v-if="NextPageNumber"
              @click="clickLoadMore"
              :disabled="isLoadingMoreResults"
              class="btn btn-primary btn--lg my-8"
            >
              Load More Podcasts
            </button>
          </div>
        </div>
      </div>
      <!-- No Podcast Results -->
      <div v-else>
        <div class="container">
          <h2>No Results Found</h2>
        </div>
      </div>
    </template>

    <!-- Else: No Details Found -->
    <template v-else>
      <!-- Intro -->
      <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <h1 class="text-center">Not Found</h1>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import * as BestPodcastsTypes from '~/shared/podcast/api/types/best-podcasts-get.d';
import { useRoute } from 'vue-router';
import { PodClientService } from '~/shared/podcast/api/services';
import * as Utils from '~/shared/utils';

const route = useRoute();
const routeId = computed(() => route.params?.id?.toString() || '');
const isLoading = computed(() => getGenreData.status.value === 'pending');
const isLoadingMoreResults = computed(() => isLoading.value || loadMorePodcastsReq.status.value === 'pending');
const genreDetails = ref<BestPodcastsTypes.ServerResponse | null>(null);
const podcasts = ref<BestPodcastsTypes.ServerResponse['podcasts'][0][] | null>([]);
const NextPageNumber = computed(() => {
  return genreDetails.value?.next_page_number;
});

const resetDataPageChange = () => {
  genreDetails.value = null;
  podcasts.value = [];
};

const getGenreData = await useAsyncData(
  `get-best-podcasts-${routeId.value}`,
  () =>
    new PodClientService().getBestPodcasts({
      query: { genre_id: routeId.value },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(getGenreData.status, (status) => {
  const getData = toRaw(getGenreData.data.value);

  if (status === 'pending') {
    return;
  }
  if (getData) {
    genreDetails.value = getData;
    podcasts.value?.push(...(getData.podcasts?.length ? getData.podcasts : []));
  }
});

const loadMorePodcastsReq = await useAsyncData(
  `get-best-podcasts-load-more-${routeId.value}-${NextPageNumber.value}`,
  () =>
    new PodClientService().getBestPodcasts({
      query: {
        genre_id: routeId.value,
        page: NextPageNumber.value,
      },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(loadMorePodcastsReq.status, (status) => {
  const getData = toRaw(loadMorePodcastsReq.data.value);

  if (status === 'pending') {
    return;
  }
  if (getData) {
    genreDetails.value = getData;
    podcasts.value?.push(...(getData.podcasts?.length ? getData.podcasts : []));
  }
});

const clickLoadMore = () => {
  if (isLoadingMoreResults.value) {
    return;
  }
  if (NextPageNumber.value) {
    loadMorePodcastsReq.execute();
  }
};

const watchPageChange = watch(
  routeId,
  (newVal) => {
    resetDataPageChange();
    newVal && getGenreData.execute();
  },
  { immediate: true }
);
</script>
