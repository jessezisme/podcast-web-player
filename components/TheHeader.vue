<template>
  <header
    class="placeholder-height bg-slate-50 font-semibold fixed top-0 left-0 right-0 w-full border-slate-200 border-b-[1px]"
  >
    <div class="container">
      <nav class="placeholder-height flex justify-center items-center gap-[100px]">
        <div>
          <button class="btn btn-primary" @click="openModal">Search</button>
        </div>
        <NuxtLink to="/" class="text-inherit no-underline">{{ runtimeConfig.public.appName }}</NuxtLink>
      </nav>
    </div>
  </header>
  <div class="placeholder-height"></div>
  <UModal v-if="isModalOpen" v-model="isModalOpen">
    <PodSearch></PodSearch>
  </UModal>
</template>

<style scoped>
.placeholder-height {
  height: 60px;
}
</style>

<script setup lang="ts">
import { PodClientService } from '~/shared/podcast/api/services';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const watchRoute = watch(
  () => route.path,
  (val) => {
    isModalOpen.value = false;
  }
);
</script>
