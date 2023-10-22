<template>
  <section class="bg-slate-50">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 container xl:max-w-7xl mx-auto px-4 py-10 lg:px-8 lg:py-16">
      <div class="flex items-center text-center lg:text-left">
        <div class="space-y-6">
          <div>
            <h1 class="text-sm uppercase font-bold tracking-wider mb-4 text-brand1-600">Podcast Demo Project</h1>
            <h2 class="text-4xl font-black mb-4">
              Discover your next favorite <span class="text-brand1-600">podcast</span>.
            </h2>
            <p class="text-xl font-medium">Lorem Ipsum....</p>
          </div>
          <button class="btn btn-primary btn--lg gap-[5px]" @click="openModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-auto h-[1em]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span>Search for Podcasts</span>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center text-brand1-500">
        <img
          src="https://images.unsplash.com/photo-1594703276852-68829b071330?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2744"
          alt=""
        />
      </div>
    </div>
  </section>

  <UModal v-if="isModalOpen" v-model="isModalOpen">
    <PodSearch></PodSearch>
  </UModal>
</template>

<script setup lang="ts">
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
</script>
