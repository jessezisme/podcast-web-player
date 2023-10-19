import { PodClientService } from '~/shared/podcast/api/services';

type PodClientGetParams = Parameters<PodClientService['getPodcast']>;
type PodResponseData = Awaited<ReturnType<PodClientService['getPodcast']>>['data']['value'];
type PodcastEpisodes = NonNullable<PodResponseData>['episodes'];

export const usePodcastStore = defineStore('podcast', () => {
  /**
   * Data
   */
  const isLoading = ref(false);
  const podId = ref('');
  const podcastDetails = ref<PodResponseData | null>(null);
  const podcastEpisodes = ref<PodResponseData['episodes'] | []>([]);

  const nextEpisodePubDate = computed(() => {
    return podcastDetails?.value?.next_episode_pub_date;
  });

  /**
   * Actions
   */
  const resetData = () => {
    isLoading.value = false;
    podId.value = '';
    podcastDetails.value = null;
    podcastEpisodes.value = [];
  };

  const setPodcastData = (data: PodResponseData) => {
    const podcast = data;
    podcast && (podcastDetails.value = podcast);
  };

  const setEpisodesData = (data: PodResponseData) => {
    const episodes = data.episodes || [];
    podcastEpisodes.value && podcastEpisodes.value.push(...episodes);
  };

  const getPodcastRequest = async (fetchOptions: PodClientGetParams[0], callbackFunction: Function) => {
    isLoading.value = true;
    const getId = unref(fetchOptions).query.id;
    podId.value = getId;
    console.log('running getpodcaststore');
    const response = await new PodClientService().getPodcast(fetchOptions);

    if (response.data.value && getId === podId.value) {
      callbackFunction(response.data.value);
    }
    isLoading.value = false;

    return response;
  };

  const getPodcastData = async (fetchOptions: PodClientGetParams[0]) => {
    resetData();
    return await getPodcastRequest(fetchOptions, setPodcastData);
  };
  const getEpisodesData = async (fetchOptions: PodClientGetParams[0]) => {
    return await getPodcastRequest(fetchOptions, setEpisodesData);
  };

  return { isLoading, podcastDetails, podcastEpisodes, nextEpisodePubDate, getPodcastData, getEpisodesData };
});
