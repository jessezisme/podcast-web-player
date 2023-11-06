<template>
  <section>
    <div class="min-h-[150px] mb-8 bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-body-inv">
      <div class="container">
        <h1 class="text-center">Account</h1>
      </div>
    </div>
    <div class="pt-8 pb-16 text-center">
      <h2 class="text-error-800">Delete Account Information</h2>
      <button @click="userStore.deleteUser" class="my-4 btn bg-error-900 text-white">Delete Account</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

definePageMeta({
  middleware: ['auth'],
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userStore = useUserStore();
</script>
