<template>
  <NuxtLink v-if="podcast" :href="podcast.link" class="flex flex-col p-2 shadow-md rounded-sm max-w-full">
    <div class="aspect-[1/1] flex items-center">
      <img :src="podcast.image" class="object-contain max-w-full" lazy alt="" />
    </div>
    <div v-if="podcast" class="text-center text-ellipsis w-full py-2 text-sm font-semibold">
      {{ Utils.truncateText(Utils.stripHTML(podcast.title), 200) }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import * as Utils from '~/shared/utils';

const props = defineProps<{
  podcast: {
    id: string;
    title: string;
    link: string;
    image: string;
  };
}>();
</script>
