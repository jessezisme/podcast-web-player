<template>
  <UCommandPalette v-model="selected" :groups="groups" />

  {{ groups }}
</template>

<script setup lang="ts">
import PodClientService from '~/shared/podcast/services';

const selected = ref([]);
const groups = computed(() => {
  return [
    {
      key: 'podcasts',
      search: async (q: string) => {
        return [];
        // const { data } = await PodClientService.getTypeahead({
        //   params: { q: 'foo' },
        // });
        // return data.value?.podcasts.map((val) => ({
        //   ...val,
        //   label: val?._appLink,
        // }));
      },
    },
  ];
});
</script>
