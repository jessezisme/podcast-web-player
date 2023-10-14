<template>
  <header class="" style="min-height: 100px">
    <nav class="container flex-row justify-between">
      <NuxtLink to="/">Pod Nexus</NuxtLink>
      <div>
        <button @click="openModal">Search</button>
      </div>
    </nav>
    <div class="container">
      <UModal v-if="isModalOpen" v-model="isModalOpen">
        <PodSearch></PodSearch>
      </UModal>
    </div>
  </header>
</template>

<script setup lang="ts">
import { PodClientService } from '~/shared/podcast/api/services';

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped></style>
