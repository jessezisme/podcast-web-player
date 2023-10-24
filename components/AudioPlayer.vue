<template>
  <section v-if="AudioStore.player" class="w-full fixed bottom-0 left-0 right-0 py-4 bg-slate-950 text-body-invert">
    <div class="container">
      <div class="whitespace-nowrap text-ellipsis overflow-hidden text-center text-sm">
        <span>{{ AudioStore.player.episode.title }}</span>
      </div>
      <div class="flex gap-4 items-center">
        <div v-if="AudioStore.player.episode.thumbnail" class="w-[65px] aspect-[1/1] items-center hidden sm:flex">
          <img :src="AudioStore.player.episode.thumbnail" alt="" lazy class="max-w-full max-h-full object-contain" />
        </div>
        <div class="flex items-center gap-4">
          <button @click="AudioStore.skipSeek(-15)" class="hidden sm:inline-block">
            <UIcon name="i-heroicons-backward-solid" class="text-[1.5em]" />
          </button>
          <button @click="AudioStore.player.isPlaying ? AudioStore.pause() : AudioStore.play()">
            <span v-if="AudioStore.player.isPlaying">
              <UIcon name="i-heroicons-pause-solid" class="text-[1.5em]" />
            </span>
            <span v-else>
              <UIcon name="i-heroicons-play-solid" class="text-[1.5em]" />
            </span>
          </button>
          <button @click="AudioStore.skipSeek(15)" class="hidden sm:inline-block">
            <UIcon name="i-heroicons-forward-solid" class="text-[1.5em]" />
          </button>
        </div>
        <div class="grow">
          <URange
            :min="1"
            :max="AudioStore.player.duration || 1"
            :step="1"
            v-model="progressSecondsUser"
            @mousedown="isUserSeeking = true"
            @touchstart="isUserSeeking = true"
            @mouseup="isUserSeeking = false"
            @touchend="isUserSeeking = false"
            @change="seek"
            size="sm"
            name="progress"
          />
        </div>
        <div class="w-[100px] flex items-center gap-2">
          <UIcon name="i-heroicons-speaker-wave-20-solid" class="text-[1.5em]" />
          <URange
            :min="0"
            :max="1"
            :step="0.01"
            v-model="AudioStore.player.volume"
            size="sm"
            name="volume"
            @input="volume"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAudioPlayerStore } from '~/stores/audio-player';

const AudioStore = useAudioPlayerStore();
const isUserSeeking = ref(false);
const progressSecondsUser = ref<number>();
const progressSecondsWatcher = watch(
  () => AudioStore?.player?.progressSeconds,
  (newVal) => {
    if (newVal && !isUserSeeking.value) {
      progressSecondsUser.value = newVal;
    }
  },
  { immediate: true }
);

const seek = (event: Event) => {
  const getSeconds = (event.target as HTMLInputElement).value;
  AudioStore.seek(parseInt(getSeconds));
};

const volume = (event: InputEvent) => {
  AudioStore?.updateVolume(parseFloat((event.target as HTMLInputElement).value));
};
</script>
