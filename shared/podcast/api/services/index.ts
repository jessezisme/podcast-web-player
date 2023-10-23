import { UseFetchOptions } from 'nuxt/app';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';
import * as GenresTypes from '~/shared/podcast/api/types/genres-get';

type AppUseFetchOptions<T> = Parameters<typeof useFetch<T>>[1];

const defaultOptions = { lazy: true };

export class PodClientService {
  /**
   * Genres: get details for genres
   */
  getGenres<ResponseData extends GenresTypes.ServerResponse>(
    fetchOptions?: GenresTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...(fetchOptions || {}) };
    return useFetch<ResponseData>('/api/podcast/genres');
  }

  /**
   * Podcast: get podcast details and episodes
   */
  getPodcast<ResponseData extends PodcastTypes.ServerResponse>(
    fetchOptions: PodcastTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/podcast-single', { query: { id: 'dsdfsdfdf' } });
  }
  /**
   * Typeahead: get results for typeahead query
   */
  getTypeahead<ResponseData extends TypeaheadTypes.ServerResponse>(
    fetchOptions: TypeaheadTypes.RouteGetParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/typeahead', {
      ...options,
    });
  }
}
