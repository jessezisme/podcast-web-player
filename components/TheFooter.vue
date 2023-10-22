<template>
  <footer class="py-8 bg-blue-950 text-body-invert">
    <div>
      <p>{{ runtimeConfig.public.appName }}</p>
    </div>
    <div></div>
    | Th
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

console.log(runtimeConfig);
</script>
