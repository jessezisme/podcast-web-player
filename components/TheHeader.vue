<template>
  <header>
    <UButton label="Open" @click="isOpen = true" />
    <UModal v-model="isOpen">
      <PodSearch></PodSearch>
    </UModal>
  </header>
</template>

<script setup>
const isOpen = ref(false);
</script>
