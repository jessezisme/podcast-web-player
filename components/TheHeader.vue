<template>
  <header
    class="text-sm fixed z-10 placeholder-height bg-slate-50 font-semibold top-0 left-0 right-0 w-full border-slate-200 border-b-[1px]"
  >
    <div class="container">
      <nav class="placeholder-height flex justify-center items-center gap-[2rem]">
        <NuxtLink to="/" class="text-inherit no-underline">{{ runtimeConfig.public.appName }}</NuxtLink>
        <button class="btn btn-outline min-w-[50px]" @click="openModal">
          <UIcon name="i-heroicons-magnifying-glass" class="text-[1.5em]" />
          <span class="sr-only">Search</span>
        </button>
        <!-- Full menu -->
        <div class="hidden sm:flex flex-row gap-[inherit] justify-center items-center">
          <template v-if="userStore.isLoggedIn">
            <NuxtLink v-if="userStore.isLoggedIn" class="btn btn-outline" href="/profile/library" title="Library">
              <UIcon name="i-mdi-play-box-multiple" class="text-[1.5em]" />
              <span class="sr-only">Library</span>
            </NuxtLink>
            <button class="btn btn-outline" @click="userStore.logout">
              <span v-if="userStore.isLoggedIn">Logout</span>
            </button>
            <NuxtLink class="btn btn-outline" href="/profile" title="Profile">
              <UIcon name="i-heroicons-user-circle" class="text-[1.5em]" />
              <span class="sr-only">Profile</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink href="/login" class="btn btn-outline no-underline">
              <span>Login</span>
            </NuxtLink>
          </template>
        </div>
        <!-- Mobile menu -->
        <div class="sm:hidden">
          <button ref="header-mobile-menu-open" class="sm:hidden btn btn-outline min-w-[50px]" @click="setMobileMenu(true)">
            <UIcon name="i-heroicons-bars-3" class="text-[1.5em]" />
            <span class="sr-only">Open Menu</span>
          </button>
          <div v-if="isMobileMenuOpen" class="fixed bottom-0 right-0 top-0 left-0" @click="setMobileMenu(false)"></div>
          <div
            v-if="isMobileMenuOpen"
            ref="header-mobile-menu"
            class="z-30 fixed bottom-0 right-0 top-0 w-[250px] flex flex-col p-4 gap-4 max-w-full bg-white shadow-xl"
          >
            <button
              class="sm:hidden btn btn-outline min-w-[50px] self-center btn btn-primary text-body-inv p-1"
              @click="setMobileMenu(false)"
            >
              <UIcon name="i-heroicons-x-mark" class="text-[1.5em]" />
              <span class="sr-only">Close Menu</span>
            </button>

            <template v-if="userStore.isLoggedIn">
              <NuxtLink v-if="userStore.isLoggedIn" class="btn btn-outline" href="/profile/library" title="Library">
                <UIcon name="i-mdi-play-box-multiple" class="text-[1.5em]" />
                <span class="sr-only">Library</span>
              </NuxtLink>
              <button class="btn btn-outline" @click="userStore.logout">
                <span v-if="userStore.isLoggedIn">Logout</span>
              </button>
              <NuxtLink class="btn btn-outline" href="/profile" title="Profile">
                <UIcon name="i-heroicons-user-circle" class="text-[1.5em]" />
                <span class="sr-only">Profile</span>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink href="/login" class="btn btn-outline no-underline">
                <span>Login</span>
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <div class="placeholder-height"></div>
  <UModal v-if="isModalOpen" v-model="isModalOpen">
    <PodSearch></PodSearch>
  </UModal>
</template>

<style scoped>
.placeholder-height {
  height: 60px;
}
</style>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const userStore = useUserStore();
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const isMobileMenuOpen = ref(false);
const setMobileMenu = (action: boolean) => {
  isMobileMenuOpen.value = action;
};
const watchRoute = watch(
  () => route.path,
  (val) => {
    isModalOpen.value = false;
    isMobileMenuOpen.value = false;
  }
);
</script>
