import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import * as GenresTypes from '~/shared/podcast/api/types/genres-get';

export default defineEventHandler(async (event) => {
  /*
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);
  let apiError;

  const apiResponse = await $fetch('https://listen-api.listennotes.com/api/v2/genres', {
    headers: {
      'X-ListenAPI-Key': ApiKeyListenNotes,
    },
    query: eventQuery || {},
  }).catch((err: any) => {
    apiError = {
      statusCode: err.statusCode || 500,
      statusMessage: 'An error occurred while retrieving data.',
      data: err.data,
    };
    setResponseStatus(event, apiError.statusCode);
  });

  if (apiError) {
    return apiError;
  }
  return new PodcastDataModel().formatGenresData(apiResponse as GenresTypes.ServerResponseRaw);
  */

  const finalData = new PodcastDataModel().formatGenresData({ ...mockGenresData });
  return finalData;
});

const mockGenresData: GenresTypes.ServerResponseRaw = {
  genres: [
    {
      id: 144,
      name: 'Personal Finance',
      parent_id: 67,
    },
    {
      id: 151,
      name: 'Locally Focused',
      parent_id: 67,
    },
    {
      id: 93,
      name: 'Business',
      parent_id: 67,
    },
    {
      id: 77,
      name: 'Sports',
      parent_id: 67,
    },
    {
      id: 125,
      name: 'History',
      parent_id: 67,
    },
    {
      id: 122,
      name: 'Society & Culture',
      parent_id: 67,
    },
    {
      id: 127,
      name: 'Technology',
      parent_id: 67,
    },
    {
      id: 132,
      name: 'Kids & Family',
      parent_id: 67,
    },
    {
      id: 168,
      name: 'Fiction',
      parent_id: 67,
    },
    {
      id: 88,
      name: 'Health & Fitness',
      parent_id: 67,
    },
    {
      id: 134,
      name: 'Music',
      parent_id: 67,
    },
    {
      id: 99,
      name: 'News',
      parent_id: 67,
    },
    {
      id: 133,
      name: 'Comedy',
      parent_id: 67,
    },
    {
      id: 100,
      name: 'Arts',
      parent_id: 67,
    },
    {
      id: 69,
      name: 'Religion & Spirituality',
      parent_id: 67,
    },
    {
      id: 117,
      name: 'Government',
      parent_id: 67,
    },
    {
      id: 68,
      name: 'TV & Film',
      parent_id: 67,
    },
    {
      id: 82,
      name: 'Leisure',
      parent_id: 67,
    },
    {
      id: 111,
      name: 'Education',
      parent_id: 67,
    },
    {
      id: 107,
      name: 'Science',
      parent_id: 67,
    },
    {
      id: 135,
      name: 'True Crime',
      parent_id: 67,
    },
  ],
};
