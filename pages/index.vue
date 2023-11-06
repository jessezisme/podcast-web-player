<template>
  <!-- intro -->
  <section class="bg-slate-50 py-[8rem]">
    <div class="container">
      <div class="flex flex-col gap-4 items-center text-center">
        <div class="w-[65rem] max-w-full">
          <h1 class="text-sm uppercase font-bold tracking-wider mb-4 text-brand1-600">Podcast Demo Project</h1>
          <h2 class="text-4xl font-black mb-4">Discover your next favorite <span class="text-brand1-600">podcast</span>.</h2>
        </div>
        <div class="mb-4">
          <button class="btn btn-primary btn--lg gap-[5px]" @click="openModal">
            <UIcon name="i-heroicons-magnifying-glass" class="text-[1.25em]" />
            <span>Search Podcasts</span>
          </button>
        </div>
        <div class="text-center">
          <a
            href="https://github.com/jessezisme/podcast-web-player"
            rel="noopener"
            target="_blank"
            class="inline-flex gap-2 underline text-inv"
            ><UIcon name="i-mdi-github" class="text-[1.5em]" />Code on GitHub</a
          >
        </div>
      </div>
    </div>
  </section>
  <!-- browse by genres -->
  <section class="bg-brand1-50">
    <div class="container">
      <div class="py-12">
        <h2 class="h2 font-bold text-center pb-4">Browse Podcasts by Genre</h2>
        <BaseCarousel v-if="genresData?.genres?.length" class="rounded-md border-brand1-50 border-2">
          <a
            class="inline-flex px-[.5rem] py-[.5rem] text-link items-center bg-white border-brand1-500 border-2 rounded min-w-min whitespace-nowrap cursor-pointer select-none text-sm btn-outline btn"
            v-for="genre in genresData.genres"
            :key="genre.id"
            :href="genre._app.link"
          >
            {{ genre.name }}
          </a>
        </BaseCarousel>
      </div>
    </div>
  </section>
  <!-- about -->
  <section class="bg-brand2-50">
    <div class="container">
      <div class="py-12">
        <h2 class="h2 font-bold text-center mb-8">About</h2>
        <div class="w-[30em] max-w-full m-auto text-center">
          <p class="mb-4 font-bold text-center text-lg"><span>&#128075;</span> Thanks for stopping by.</p>
          <p class="mb-4">
            If you're interested, feel free to check out the code on
            <a
              href="https://github.com/jessezisme/podcast-web-player"
              rel="noopener"
              target="_blank"
              class="inline-flex gap-2 underline text-link"
              ><span>GitHub</span> </a
            >.
          </p>
          <p class="mb-4">This project's tech stack primarily consists of:</p>
        </div>
        <div class="flex justify-center">
          <BaseCarousel v-if="genresData?.genres?.length" class="rounded-md border-brand1-50 border-2">
            <a
              v-for="item in techStack"
              :key="item.text"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex px-[.5rem] py-[.5rem] text-link items-center bg-white border-brand1-500 border-2 rounded min-w-min whitespace-nowrap cursor-pointer select-none text-sm btn-outline btn"
            >
              {{ item.text }}
            </a>
          </BaseCarousel>
        </div>
      </div>
    </div>
  </section>
  <!-- search modal -->
  <UModal v-if="isModalOpen" v-model="isModalOpen">
    <PodSearch />
  </UModal>
</template>

<script setup lang="ts">
import { PodClientService } from '~/shared/podcast/api/services';

const podClientService = new PodClientService();
const genresData = await podClientService.getGenres().catch();
const techStack: { text: string; link: string }[] = [
  { text: 'TypeScript', link: 'https://www.typescriptlang.org' },
  { text: 'Nuxt', link: 'https://nuxt.com' },
  { text: 'Vue.js (V3)', link: 'https://vuejs.org' },
  { text: 'Tailwind CSS', link: 'https://tailwindcss.com' },
  { text: 'Listen Notes API', link: 'https://www.listennotes.com' },
  { text: 'Howler.js', link: 'https://github.com/goldfire/howler.js' },
];
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
</script>
