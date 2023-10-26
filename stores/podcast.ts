import { PodClientService } from '~/shared/podcast/api/services';

type PodClientGetParams = Parameters<PodClientService['getPodcast']>;
type PodResponseData = Awaited<ReturnType<PodClientService['getPodcast']>>['data']['value'];
type PodcastEpisodes = NonNullable<PodResponseData>['episodes'];

export const usePodcastStore = defineStore('podcast', () => {
  /**
   * Data
   */
  const isLoading = ref(true);
  const podId = ref('');
  const podcastDetails = ref<PodResponseData | null>(null);
  const podcastEpisodes = ref<PodcastEpisodes>([]);
  const nextEpisodePubDate = computed(() => {
    return podcastDetails?.value?.next_episode_pub_date;
  });

  /**
   * Actions
   */
  const resetDataPageChange = () => {
    isLoading.value = true;
    podId.value = '';
    podcastDetails.value = null;
    podcastEpisodes.value = [];
  };

  const setPodcastData = (data: PodResponseData) => {
    const podcast = data;
    if (podcast) {
      podcastDetails.value = podcast;
    }
  };

  const setEpisodesData = (data: PodResponseData) => {
    console.log(data); 
    const episodes = data?.episodes || [];
    if (podcastEpisodes.value) {
      console.log(episodes); 
      podcastEpisodes.value.push(...episodes);
    }
  };

  const getPodcastRequest = async (fetchOptions: PodClientGetParams[0], callbackFunction: Function) => {
    const getId = unref(fetchOptions).query.id;
    podId.value = getId;

    isLoading.value = true;
    const response = await new PodClientService().getPodcast(fetchOptions);

    watch(
      response.pending,
      (res) => {
        if (!response.pending.value && response.data.value && getId === podId.value) {
          isLoading.value = false;
          callbackFunction(response.data.value);
        }
      },
      { immediate: true }
    );

    return response;
  };

  const getPodcastData = (fetchOptions: PodClientGetParams[0]) => {
    resetDataPageChange();
    return getPodcastRequest(fetchOptions, setPodcastData);
  };
  const getEpisodesData = (fetchOptions: PodClientGetParams[0]) => {
    return getPodcastRequest(fetchOptions, setEpisodesData);
  };

  return {
    resetDataPageChange,
    isLoading,
    podcastDetails,
    podcastEpisodes,
    nextEpisodePubDate,
    getPodcastData,
    getEpisodesData,
  };
});
