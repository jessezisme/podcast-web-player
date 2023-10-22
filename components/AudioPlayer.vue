<template>
  <section class="py-4" v-if="AudioStore.player">
    {{ progressSecondsUser }}
    <URange
      :min="1"
      :max="AudioStore.player.duration || 1"
      :step="1"
      :value="progressSecondsUser || 0"
      @mousedown="isUserSeeking = true"
      @touchstart="isUserSeeking = true"
      @mouseup="isUserSeeking = false"
      @touchend="isUserSeeking = false"
      @change="seek"
      size="sm"
      name="progress"
    />
    <br />
    <URange :min="0" :max="1" :step="0.01" :value="AudioStore.player.volume" size="sm" name="volume" />
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
</script>
