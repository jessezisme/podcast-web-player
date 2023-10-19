<template>
  <template v-if="podcastDetails">
    <section>
      <div class="bg-slate-50">
        <div class="container">
          <div class="grid grid-cols-12 gap-8">
            <div class="col-span-3">
              <img class="" :src="podcastDetails?.image" />
            </div>
            <div class="col-span-9">
              <h1 class="h5 font-extrabold">{{ $appRemoveHtml(podcastDetails.title) }}</h1>
              <p>

              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>

  {{ routeId }}

  {{ podcastDetails?.description }}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePodcastStore } from '~/stores/podcast';

const route = useRoute();
const routeId = computed(() => route.params?.id.toString() || '');
const podcastStore = usePodcastStore();
const podcastDetails = computed(() => podcastStore.podcastDetails);

onMounted(() => {
  const watchStuff = watch(
    routeId,
    () => {
      loadPodcastData();
    },
    { immediate: true }
  );
});

const loadPodcastData = () => {
  podcastStore.getPodcastData({ query: { id: routeId.value } });
};
const loadMoreEpisodes = () => {
  podcastStore.getEpisodesData({ query: { id: routeId.value, next_episode_pub_date: podcastStore.nextEpisodePubDate } });
};
</script>
