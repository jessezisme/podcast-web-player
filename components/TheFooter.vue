<template>
  <footer class="pt-[4rem] pb-[10rem] bg-blue-950 text-body-inv">
    <div class="flex flex-wrap justify-center gap-8 text-center text-lg">
      <div class="font-light">{{ runtimeConfig.public.appName }}</div>
      <div class="inline-flex items-center">
        <a
          href="https://github.com/jessezisme/podcast-web-player"
          rel="noopener"
          target="_blank"
          class="inline-flex gap-2 underline text-link-inv font-light"
          ><UIcon name="i-mdi-github" class="text-[1.5em]" /><span>Code on GitHub</span></a
        >
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
