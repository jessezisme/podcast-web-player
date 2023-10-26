import search from '~/server/api/podcast/search';
import { PodClientService } from '~/shared/podcast/api/services';
import * as SearchTypes from '~/shared/podcast/api/types/search-get';

export const useSearchStore = defineStore('podcast', () => {
  /**
   * Data
   */
  const isLoadingEpisodes = ref(false);
  const isLoadingPodcasts = ref(false);
  const searchQuery = ref('');
  const episodeResponse = ref<SearchTypes.ServerResponseEpisode | null>();
  const podcastResponse = ref<SearchTypes.ServerResponsePodcast | null>();
  const episodes = ref<SearchTypes.ServerResponseEpisode['results'][0][] | null>([]);
  const podcasts = ref<SearchTypes.ServerResponsePodcast['results'][0][] | null>([]);

  const episodeNextOffset = computed(() => {
    return episodeResponse.value?.next_offset;
  });
  const podcastNextOffset = computed(() => {
    return podcastResponse.value?.next_offset;
  });

  /**
   * Actions
   */
  const resetDataPageChange = () => {
    isLoadingEpisodes.value = false;
    isLoadingPodcasts.value = false;
    searchQuery.value = '';
    episodeResponse.value = null;
    podcastResponse.value = null;
    episodes.value = [];
    podcasts.value = [];
  };

  const getSearchEpisodes = async (fetchOptions: Parameters<PodClientService['getSearchEpisodes']>[0]) => {
    isLoadingEpisodes.value = true;
    searchQuery.value = fetchOptions.query.q;
    const response = await new PodClientService().getSearchEpisodes(fetchOptions);

    watch(response.pending, (pendingNewVal) => {
      if (pendingNewVal && searchQuery.value === fetchOptions.query.q) {
        isLoadingEpisodes.value = false;
        episodeResponse.value = response.data.value;
      }
    });

    return response;
  };

  return {};
});
