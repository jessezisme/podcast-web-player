<template>
  <section class="py-12">
    <div class="container">
      <!-- sign in  -->
      <template v-if="!userStore.isLoggedIn">
        <h1 class="pt-2 pb-6 text-center">Sign In</h1>
        <div class="flex flex-col items-center max-w-full w-[600px] m-auto px-2 py-6 bg-slate-50 text-center rounded-xl">
          <div class="py-4">
            <button @click="login" class="w-[150px] max-w-full btn btn-primary">Demo User</button>
            <p class="my-2 font-bold">AUTO SIGN IN DEMO <br />(SHARED ACCOUNT)</p>
          </div>
          <div class="py-4">
            <button @click="loginGithub" class="w-[150px] max-w-full flex gap-[5px] btn bg-black text-white">
              <UIcon name="i-mdi-github" class="text-[1.5em] pr-[10px]" />
              <span>GitHub </span>
            </button>
            <p class="my-2">Sign in with GitHub</p>
          </div>
        </div>
      </template>
      <!-- currently signed in -->
      <template v-else>
        <h1 class="pt-2 pb-6 text-center">Currently Signed In</h1>
        <div class="text-center">
          <button @click="login" class="w-[150px] max-w-full btn btn-outline">Logout</button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userStore = useUserStore();

const login = async () => {
  await userStore.loginDemoUser();
};

const loginGithub = async () => {
  await userStore.loginGithub();
};

const logout = async () => {
  await userStore.logout();
};
</script>
