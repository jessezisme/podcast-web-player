<template>
  <section>
    <!-- intro -->
    <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
      <div class="container">
        <h1 class="text-center">Following</h1>
      </div>
    </div>
    <!-- results -->
    <template v-if="podcasts?.length && !userStore.isLoading">
      <div class="container">
        <div
          class="w-full grid gap-[2rem] grid-cols-[repeat(auto-fit,_minmax(160px,_200px))] justify-center justify-items-center"
        >
          <div v-for="pod in podcasts" :key="pod.id" class="text-center">
            <PodcastCard :podcast="{ id: pod.id, title: pod.title, link: pod.link, image: pod.image }"> </PodcastCard>
            <SubscribeButton :id="pod.id" :class="`my-2 text-xs`" />
          </div>
        </div>
      </div>
    </template>
    <!-- no results -->
    <template v-else-if="!podcasts.length && !userStore.isLoading">
      <div class="container text-center">
        <p class="h4">Not following any podcasts yet.</p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

definePageMeta({
  middleware: ['auth'],
});

const userStore = useUserStore();
const podcasts = computed(() => userStore.podcasts);
</script>
