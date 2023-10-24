<template>
  <!-- Intro -->
  <section class="bg-slate-50 py-[8rem]">
    <div class="container">
      <div class="flex flex-col gap-4 items-center text-center">
        <div class="w-[65rem] max-w-full">
          <h1 class="text-sm uppercase font-bold tracking-wider mb-4 text-brand1-600">Podcast Demo Project</h1>
          <h2 class="text-4xl font-black mb-4">Discover your next favorite <span class="text-brand1-600">podcast</span>.</h2>
        </div>
        <div>
          <button class="btn btn-primary btn--lg gap-[5px]" @click="openModal">
            <UIcon name="i-heroicons-play" class="text-[1.25em]" />
            <span>Search Podcasts</span>
          </button>
        </div>
      </div>
    </div>
  </section>
  <!-- Browse by genres -->
  <section class="bg-brand1-50">
    <div class="container">
      <div class="py-12">
        <h2 class="h2 font-bold text-center pb-4">Browse by Genre</h2>
        <BaseCarousel v-if="genresData?.genres?.length" class="rounded-md border-brand1-50 border-2">
          <a
            class="inline-flex px-[.5rem] py-[.5rem] items-center bg-white border-brand1-500 border-2 rounded min-w-min whitespace-nowrap cursor-pointer select-none text-sm btn-outline btn"
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
  <!-- Search Modal -->
  <UModal v-if="isModalOpen" v-model="isModalOpen">
    <PodSearch />
  </UModal>
</template>

<script setup lang="ts">
import { PodClientService } from '~/shared/podcast/api/services';

const podClientService = new PodClientService();
const { data: genresData } = await podClientService.getGenres();
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
</script>
