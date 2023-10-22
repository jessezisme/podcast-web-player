<template>
  <section>
    <template v-if="podStore?.podcastDetails">
      <!-- details -->
      <div>
        <div class="bg-slate-50">
          <div class="container">
            <div class="grid grid-cols-12 gap-8">
              <div class="col-span-3">
                <img class="" :src="podStore.podcastDetails?.image" />
              </div>
              <div class="col-span-9">
                <h1 class="h5 font-extrabold" v-if="podStore.podcastDetails.title">
                  {{ $appRemoveHtml(podStore.podcastDetails.title) }}
                </h1>
                <p v-if="podStore.podcastDetails.description">{{ $appRemoveHtml(podStore.podcastDetails.description) }}</p>
                <a
                  v-if="podStore.podcastDetails.website"
                  :href="podStore.podcastDetails.website"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>
                  </span>
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <!-- episodes -->
        <div v-if="podStore.podcastDetails?.episodes">
          <div class="flex flex-col items-center gap-8 pt-16">
            <div
              v-for="episode in podStore.podcastDetails.episodes"
              :key="episode.id || episode.title"
              class="w-[900px] max-w-full p-4 text-sm border-[1px] border-blue-100 rounded-lg shadow hover:shadow-md transition-fast-out bg-y-gradient-white-grey-200 flex gap-6"
            >
              <div class="w-[110px] min-w-[110px]">
                <img :src="episode.thumbnail" alt="" aria-hidden="true" class="max-w-full" />
              </div>
              <div class="grow">
                <p class="font-semibold text-md">{{ episode.title }}</p>
                <p v-if="episode.description">{{ $appRemoveHtml(episode.description) }}</p>
                <p>{{ convertToMinutes(episode.audio_length_sec) }} minutes</p>
                {{ $appFormatDate(episode.pub_date_ms) }}
              </div>
              <div>
                <button
                  @click="playerStore.loadAndPlay(episode)"
                  class="inline-flex items-center justify-center w-[50px] aspect-[1/1] rounded-full bg-brand1-800 hover:bg-brand1-700 text-body-invert"
                >
                  <template v-if="playerStore.player?.episode.id === episode.id && playerStore.player.isPlaying">
                    <!-- pause -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    <span class="sr-only">Pause</span>
                  </template>
                  <template v-else>
                    <!-- play -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                    <span class="sr-only">Play</span>
                  </template>
                </button>
              </div>
            </div>
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
    </template>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePodcastStore } from '~/stores/podcast';
import { useAudioPlayerStore } from '~/stores/audio-player';

const route = useRoute();
const routeId = computed(() => route.params?.id.toString() || '');
const podStore = usePodcastStore();
const playerStore = useAudioPlayerStore();

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
  podStore.getPodcastData({ query: { id: routeId.value } });
};
const loadMoreEpisodes = () => {
  podStore.getEpisodesData({ query: { id: routeId.value, next_episode_pub_date: podStore.nextEpisodePubDate } });
};

const convertToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60);
};
</script>
