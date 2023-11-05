import * as SearchTypes from '~/shared/podcast/api/types/search-get';
import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);

  let data;
  try {
    data = await $fetch<SearchTypes.ServerResponsePodcastRaw | SearchTypes.ServerResponseEpisodeRaw>(
      'https://listen-api.listennotes.com/api/v2/search',
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

  if (eventQuery.type === 'podcast') {
    return new PodcastDataModel().formatSearchPodcastData(data as SearchTypes.ServerResponsePodcastRaw);
  } else if (eventQuery.type === 'episode') {
    return new PodcastDataModel().formatSearchEpisodeData(data as SearchTypes.ServerResponseEpisodeRaw);
  } else {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' });
  }
});
