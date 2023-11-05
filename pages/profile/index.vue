<template>
  Podcasts
  {{ userStore.podcasts }}
  <br />

  {{ data }}

  <div v-if="userStore.podcasts?.length">
    <button @click="deleteSub(userStore.podcasts[0].id)">Delete Podcast</button>
  </div>

  <button @click="getData">Get Data</button>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

definePageMeta({
  middleware: ['auth'],
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userStore = useUserStore();
const data = ref<any>();

const deleteSub = (id: string) => {
  userStore.deleteSubscription(id);
};

const getData = async () => {
  const { data: subData, error } = await supabase.from('subscriptions').select('podcast_id, podcast_image, podcast_title');
  data.value = subData;
};
</script>
