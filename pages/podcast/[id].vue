<template>
  <section v-if="!isLoading" class="pb-20">
    <!-- if: details -->
    <template v-if="podcastDetails">
      <!-- intro -->
      <div class="min-h-[325px] bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <div
            class="w-[1000px] max-w-full m-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-8"
          >
            <div class="w-[180px] min-w-[180px]">
              <img class="w-full max-w-full" :src="podcastDetails?.image" />
            </div>
            <div>
              <h1 class="h4 font-extrabold mb-4" v-if="podcastDetails.title">
                {{ Utils.stripHTML(podcastDetails.title) }}
              </h1>
              <p v-if="podcastDetails.description" class="mb-4">
                {{ Utils.stripHTML(podcastDetails.description) }}
              </p>
              <div>
                <a
                  v-if="podcastDetails.website"
                  :href="podcastDetails.website"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="text-link-inv text-sm"
                >
                  <UIcon name="i-heroicons-link" />
                  Website
                </a>
              </div>
              <SubscribeButton :id="podcastDetails.id" class="my-4" />
            </div>
          </div>
        </div>
      </div>
      <!-- episodes -->
      <div class="container">
        <div v-if="episodes?.length">
          <div class="flex flex-col items-center gap-8 pt-16">
            <EpisodeCard v-for="episode in episodes" :key="episode.id" :episode="episode" />
          </div>
          <!-- load more episodes -->
          <div v-if="nextEpisodePubDate" class="flex justify-center py-8">
            <button class="btn btn-primary btn--lg" :disabled="isLoadingMoreResults" @click="clickLoadMore()">
              Load More
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- else: no details found -->
    <template>
      <div class="min-h-[325px] bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
        <div class="container">
          <h1>Not Found</h1>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { PodClientService } from '~/shared/podcast/api/services';
import type * as PodcastTypes from '~/shared/podcast/api/types/podcast-get.d';
import * as Utils from '~/shared/utils';

const isLoading = computed(() => getPodcastData.status.value === 'pending');
const isLoadingMoreResults = computed(() => getMoreEpisodes.status.value === 'pending');
const route = useRoute();
const routeId = computed(() => route.params?.id?.toString() || '');
const podcastDetails = ref<PodcastTypes.ServerResponse | null>(null);
const episodes = ref<PodcastTypes.ServerResponse['episodes'][0][] | null>([]);
const nextEpisodePubDate = computed(() => {
  // The next publish date is always included in the podcast response, even if at end of episode listing.
  // Need to check if all episodes are already listed.
  const getTotalEpisodes = podcastDetails.value?.total_episodes;
  if (getTotalEpisodes && episodes?.value?.length && getTotalEpisodes <= episodes?.value?.length) {
    return;
  }
  return podcastDetails?.value?.next_episode_pub_date;
});

const resetDataPageChange = () => {
  podcastDetails.value = null;
  episodes.value = null;
};

const getPodcastData = await useAsyncData(
  `get-podcast-${routeId.value}`,
  () => new PodClientService().getPodcast({ query: { id: routeId.value } }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(getPodcastData.status, (status) => {
  const getData = toRaw(getPodcastData.data.value);
  if (status === 'pending') {
    return;
  }
  if (getData) {
    podcastDetails.value = getData;
    episodes.value = getData.episodes || [];
  }
});

const getMoreEpisodes = await useAsyncData(
  `get-podcast-more-episodes-${routeId.value}`,
  () =>
    new PodClientService().getPodcast({
      query: {
        id: routeId.value,
        next_episode_pub_date: nextEpisodePubDate.value,
      },
    }),
  {
    lazy: true,
    server: false,
    immediate: false,
  }
);

watch(getMoreEpisodes.status, (status) => {
  const getData = toRaw(getMoreEpisodes.data.value);
  if (status === 'pending') {
    return;
  }
  if (getData) {
    podcastDetails.value = getData;
    episodes.value?.push(...(getData.episodes?.length ? getData.episodes : []));
  }
});

const clickLoadMore = () => {
  !isLoadingMoreResults.value && nextEpisodePubDate.value && getMoreEpisodes.execute();
};

const watchPageChange = watch(
  routeId,
  (newVal) => {
    resetDataPageChange();
    newVal && getPodcastData.execute();
  },
  { immediate: true }
);
</script>
