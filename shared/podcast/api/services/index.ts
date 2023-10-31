import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';
import * as GenresTypes from '~/shared/podcast/api/types/genres-get';
import * as SearchTypes from '~/shared/podcast/api/types/search-get';
import * as BestPodcastsTypes from '~/shared/podcast/api/types/best-podcasts-get';

// type AppUseFetchOptions<T> = Parameters<typeof useFetch<T>>[1];

export class PodClientService {
  /**
   * Best Podcasts: get best podcasts details
   */
  getBestPodcasts<ResponseData extends BestPodcastsTypes.ServerResponse>(
    fetchOptions: BestPodcastsTypes.RouteParams & Parameters<typeof $fetch>[1]
  ) {
    return $fetch<ResponseData>('/api/podcast/best-podcasts', fetchOptions);
  }

  /**
   * Search: get full search details
   */
  getSearchPodcasts<ResponseData extends SearchTypes.ServerResponsePodcast>(
    fetchOptions: SearchTypes.RouteParams & Parameters<typeof $fetch>[1]
  ) {
    fetchOptions.query.type = 'podcast';
    return $fetch<ResponseData>('/api/podcast/search', fetchOptions);
  }

  getSearchEpisodes<ResponseData extends SearchTypes.ServerResponseEpisode>(
    fetchOptions: SearchTypes.RouteParams & Parameters<typeof $fetch>[1]
  ) {
    fetchOptions.query.type = 'episode';
    return $fetch<ResponseData>('/api/podcast/search', fetchOptions);
  }

  /**
   * Genres: get details for genres
   */
  getGenres<ResponseData extends GenresTypes.ServerResponse>(
    fetchOptions?: GenresTypes.RouteParams & Parameters<typeof $fetch>[1]
  ) {
    return $fetch<ResponseData>('/api/podcast/genres', fetchOptions);
  }

  /**
   * Podcast: get podcast details and episodes
   */
  getPodcast<ResponseData extends PodcastTypes.ServerResponse>(
    fetchOptions: PodcastTypes.RouteParams & Parameters<typeof $fetch>[1]
  ) {
    return $fetch<ResponseData>('/api/podcast/podcast-single', fetchOptions);
  }

  /**
   * Typeahead: get results for typeahead query
   */
  getTypeahead<ResponseData extends TypeaheadTypes.ServerResponse>(
    fetchOptions: TypeaheadTypes.RouteGetParams & Parameters<typeof $fetch>[1]
  ) {
    return $fetch<ResponseData>('/api/podcast/typeahead', fetchOptions);
  }
}
