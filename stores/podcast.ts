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
  const podDetails = ref<Omit<PodResponseData, 'episodes'> | null>(null);
  const podEpisodes = ref<PodResponseData['episodes']>([]);
  /**
   * Computed
   */
  const nextEpisodeDate = computed(() => {
    return podDetails?.value?.next_episode_pub_date;
  });
  /**
   * Actions
   */
  const resetBeforeRequest = () => {
    isLoading.value = true;
    podId.value = '';
    podDetails.value = null;
    podEpisodes.value = [];
  };

  const getPodcastData = async (fetchOptions: PodClientGetParams[0]) => {
    resetBeforeRequest();
    const getId = unref(fetchOptions).query.id;
    podId.value = getId;
    const { data, error } = await new PodClientService().getPodcast({
      ...fetchOptions,
    });
    if (data.value && podId.value === getId) {
      podDetails.value = data.value;
    }
  };

  return { podDetails, getPodcastData };
});
