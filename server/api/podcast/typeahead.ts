import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import { appErrorHandler } from '~/server/utils/error-handler';

export default defineEventHandler(async (event) => {
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);

  let data;
  try {
    data = await $fetch<TypeaheadTypes.ServerResponseRaw>('https://listen-api.listennotes.com/api/v2/typeahead', {
      headers: {
        'X-ListenAPI-Key': ApiKeyListenNotes,
      },
      query: eventQuery || {},
    });
  } catch (error) {
    return appErrorHandler(event, { statusCode: 424, message: 'An error occurred while loading podcasts.' }, error);
  }

  return new PodcastDataModel().formatTypeaheadData(data as TypeaheadTypes.ServerResponseRaw);
});
