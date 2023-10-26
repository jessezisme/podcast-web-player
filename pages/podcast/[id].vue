<template>
  <section v-if="podStore?.podcastDetails" class="pb-20">
    <!-- Intro -->
    <div class="min-h-[325px] bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
      <div class="container">
        <div class="w-[1000px] max-w-full m-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
          <div class="w-[180px] min-w-[180px]">
            <img class="w-full max-w-full" :src="podStore.podcastDetails?.image" />
          </div>
          <div>
            <h1 class="h4 font-extrabold mb-4" v-if="podStore.podcastDetails.title">
              {{ Utils.stripHTML(podStore.podcastDetails.title) }}
            </h1>
            <p v-if="podStore.podcastDetails.description" class="mb-4">
              {{ Utils.stripHTML(podStore.podcastDetails.description) }}
            </p>
            <a
              v-if="podStore.podcastDetails.website"
              :href="podStore.podcastDetails.website"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <UIcon name="i-heroicons-link" />
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- episodes -->
    <div class="container">
      <div v-if="podStore.podcastDetails?.episodes">
        <div class="flex flex-col items-center gap-8 pt-16">
          <EpisodeCard v-for="episode in podStore.podcastDetails.episodes" :key="episode.id" :episode="episode" />
        </div>
      </div>
      <!-- load more episodes -->
      <div v-if="podStore.podcastDetails?.next_episode_pub_date" class="flex justify-center py-8">
        <button
          class="btn btn-primary btn--lg"
          :disabled="podStore.isLoading"
          @click="!podStore.isLoading && loadMoreEpisodes()"
        >
          Load More
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePodcastStore } from '~/stores/podcast';
import * as Utils from '~/shared/utils';

const route = useRoute();
const routeId = computed(() => route.params?.id?.toString() || '');
const podStore = usePodcastStore();

const loadPodcastData = () => {
  podStore.getPodcastData({ query: { id: routeId.value } });
};
const loadMoreEpisodes = () => {
  console.log(routeId.value);
  podStore.getEpisodesData({ query: { id: routeId.value, next_episode_pub_date: podStore.nextEpisodePubDate } });
};
const watchPageChange = watch(
  routeId,
  () => {
    if (routeId) {
      podStore.resetDataPageChange();
      loadPodcastData();
    }
  },
  { immediate: true }
);
</script>
