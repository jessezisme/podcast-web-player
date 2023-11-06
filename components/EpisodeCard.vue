<template>
  <div
    v-if="props.episode"
    class="w-[900px] max-w-full p-4 text-sm border-[1px] border-blue-100 rounded-lg shadow hover:shadow-md transition-fast-out bg-y-gradient-white-grey-200 flex gap-6"
  >
    <div class="w-[110px] min-w-[110px] hidden sm:inline-block">
      <img
        v-if="episode.thumbnail || episode.image"
        :src="episode.thumbnail || episode.image"
        alt="episode.title"
        lazy
        class="max-w-full"
      />
    </div>
    <div class="grow">
      <p class="font-semibold text-md">{{ episode.title }}</p>
      <p v-if="episode.description">{{ Utils.truncateText(Utils.stripHTML(episode.description), 250) }}</p>
      <div class="text-body-v2 text-sm mt-2">
        <span>{{ Utils.convertToMinutes(episode.audio_length_sec) }} minutes</span>
        <span> | {{ Utils.formatDate(episode.pub_date_ms) }}</span>
      </div>
    </div>
    <div>
      <button
        @click="clickAudio"
        class="inline-flex items-center justify-center w-[50px] aspect-[1/1] rounded-full bg-brand1-800 hover:bg-brand1-700 text-body-inv"
      >
        <!-- pause -->
        <template v-if="isPlaying">
          <UIcon name="i-heroicons-pause" class="text-[1.5em]" />
          <span class="sr-only">Pause</span>
        </template>
        <!-- play -->
        <template v-else>
          <UIcon name="i-heroicons-play" class="text-[1.5em]" />
          <span class="sr-only">Play</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServerResponse } from '~/shared/podcast/api/types/podcast-get';
import { useAudioPlayerStore } from '~/stores/audio-player';
import * as Utils from '~/shared/utils';

const props = defineProps<{
  episode: Pick<
    ServerResponse['episodes'][0],
    'id' | 'title' | 'image' | 'thumbnail' | 'description' | 'pub_date_ms' | 'audio_length_sec' | 'audio'
  >;
}>();

const playerStore = useAudioPlayerStore();
const isPlaying = computed(() => {
  return playerStore.player?.episode.id === props.episode?.id && playerStore.player.isPlaying;
});

const clickAudio = () => {
  if (isPlaying.value) {
    playerStore.pause();
  } else {
    playerStore.loadAndPlay(props.episode);
  }
};
</script>
