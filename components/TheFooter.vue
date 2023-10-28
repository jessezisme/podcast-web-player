<template>
  <footer class="py-8 bg-blue-950 text-body-inv">
    <div>
      <p>{{ runtimeConfig.public.appName }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
