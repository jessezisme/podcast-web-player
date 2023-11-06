import type * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';
import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);

  let data;
  try {
    data = await $fetch<PodcastTypes.ServerResponseRaw>(
      `https://listen-api.listennotes.com/api/v2/podcasts/${eventQuery.id}`,
      {
        headers: {
          'X-ListenAPI-Key': ApiKeyListenNotes,
        },
        query: eventQuery || {},
      }
    );
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' }, error);
  }

  return new PodcastDataModel().formatPodcastData(data as PodcastTypes.ServerResponseRaw);
});
