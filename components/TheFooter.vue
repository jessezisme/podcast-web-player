<template>
  <footer class="py-8 bg-blue-950 text-body-inv">
    <div class="text-center">
      <div class="mb-4">{{ runtimeConfig.public.appName }}</div>
      <div>
        <a
          href="https://github.com/jessezisme/podcast-web-player"
          rel="noopener"
          target="_blank"
          class="inline-flex gap-2 underline text-link-inv"
          ><UIcon name="i-mdi-github" class="text-[1.5em]" />Code on GitHub</a
        >
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
