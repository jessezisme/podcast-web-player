<template>
  <div v-if="id && userStore.isLoggedIn">
    <button
      :disabled="userStore.isLoading"
      :class="[{ disabled: userStore.isLoading }, isFollowing ? 'btn btn-outline' : 'btn btn-primary']"
      @click="followHandler"
    >
      <span v-if="isFollowing">Unfollow</span>
      <span v-else>Follow</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ServerResponse } from '~/shared/podcast/api/types/podcast-get.d';
import { useUserStore } from '~/stores/user';

const props = defineProps<{
  id: string;
}>();

const user = useSupabaseUser();
const userStore = useUserStore();
const isFollowing = computed(() => {
  return userStore.podcastIds.includes(props.id);
});

const followHandler = () => {
  if (userStore.isLoading || !props.id) {
    return;
  }
  if (isFollowing.value) {
    return userStore.deleteSubscription(props.id);
  }
  return userStore.addSubscription(props.id);
};
</script>
