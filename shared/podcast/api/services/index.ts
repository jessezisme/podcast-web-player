import type { UseFetchOptions } from 'nuxt/app';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';
import * as GenresTypes from '~/shared/podcast/api/types/genres-get';
import * as SearchTypes from '~/shared/podcast/api/types/search-get';

type AppUseFetchOptions<T> = Parameters<typeof useFetch<T>>[1];

const defaultOptions = { lazy: true };

export class PodClientService {
  /**
   * Search: get full search details
   */
  getSearchPodcasts<ResponseData extends SearchTypes.ServerResponsePodcast>(
    fetchOptions: SearchTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    fetchOptions.query.type = 'podcast';
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/search', { ...options });
  }

  getSearchEpisodes<ResponseData extends SearchTypes.ServerResponseEpisode>(
    fetchOptions: SearchTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    fetchOptions.query.type = 'episode';
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/search', { ...options });
  }

  /**
   * Genres: get details for genres
   */
  getGenres<ResponseData extends GenresTypes.ServerResponse>(
    fetchOptions?: GenresTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...(fetchOptions || {}) };
    return useFetch<ResponseData>('/api/podcast/genres', { ...options });
  }

  /**
   * Podcast: get podcast details and episodes
   */
  getPodcast<ResponseData extends PodcastTypes.ServerResponse>(
    fetchOptions: PodcastTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/podcast-single', { ...options });
  }

  /**
   * Typeahead: get results for typeahead query
   */
  getTypeahead<ResponseData extends TypeaheadTypes.ServerResponse>(
    fetchOptions: TypeaheadTypes.RouteGetParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/typeahead', { ...options });
  }
}
