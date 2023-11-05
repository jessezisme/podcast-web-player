import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import * as BestPodcastTypes from '~/shared/podcast/api/types/best-podcasts-get';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);

  let data;
  try {
    data = await $fetch<BestPodcastTypes.ServerResponseRaw>('https://listen-api.listennotes.com/api/v2/best_podcasts', {
      headers: {
        'X-ListenAPI-Key': ApiKeyListenNotes,
      },
      query: eventQuery || {},
    });
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' }, error);
  }

  return new PodcastDataModel().formatBestPodcastsData(data as BestPodcastTypes.ServerResponseRaw);
});
