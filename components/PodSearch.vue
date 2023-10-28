<template>
  <UCommandPalette
    @update:model-value="selectNavigate"
    @keyup.enter="submitSearch"
    v-model="selected"
    :groups="groups"
    :fuse="{
      fuseOptions: {
        threshold: 1.0,
      },
    }"
    :debounce="0"
    :loading="isLoading"
    :nullable="false"
    :autoclear="false"
  />
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import { PodClientService } from '~/shared/podcast/api/services';

type DataResponseType = Awaited<ReturnType<PodClientService['getTypeahead']>>['data']['value'];
type DataResultItem = DataResponseType['genres'][0] | DataResponseType['podcasts'][0];

const serviceTypeahead = new PodClientService();

const isLoading = ref(false);
const selected = ref([]);
const query = ref('');
const queryDebounce = refDebounced(query, 600);

const results = ref<DataResponseType>();
const resultsGenres = computed(() => {
  const genres = results.value?.genres || [];
  return genres.map((val) => ({ ...val, label: `${val.name}` }));
});
const resultsPodcasts = computed(() => {
  const podcasts = results.value?.podcasts || [];
  return podcasts.map((val) => ({ ...val, label: `${val.title_original}` }));
});

const getResultsRequest = async () => {
  isLoading.value = true;
  const response = await serviceTypeahead.getTypeahead({
    key: queryDebounce.value,
    query: { q: queryDebounce.value, show_podcasts: 1, show_genres: 1 },
  });
  isLoading.value = false;
  return response;
};
const getResultsWatcher = watch(queryDebounce, async (newVal, oldVal) => {
  const isMatch = () => query.value === newVal;

  if (isMatch() && newVal?.length) {
    let { data } = await getResultsRequest();
    if (isMatch() && data.value) {
      results.value = data.value;
    }
  } else {
    isLoading.value = false;
  }
});

const groups = computed(() => {
  return [
    {
      key: 'Podcasts',
      label: 'Podcasts',
      search: async (q: string) => {
        query.value = q.trim();
        return query.value ? resultsPodcasts || [] : [];
      },
    },
    {
      key: 'Genres',
      label: 'Genres',
      search: async (q: string) => {
        query.value = q.trim();
        return query.value ? resultsGenres || [] : [];
      },
    },
  ];
});

const submitSearch = async () => {
  await nextTick();
  if (!selected.value[0]) {
    navigateTo({
      path: `/search/${encodeURIComponent(query.value)}`,
    });
  }
};

const selectNavigate = (option: DataResultItem) => {
  navigateTo(`${option._app.link}`);
};
</script>
