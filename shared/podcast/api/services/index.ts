import { UseFetchOptions } from 'nuxt/app';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import * as PodcastTypes from '~/shared/podcast/api/types/podcast-get';

type AppUseFetchOptions<T> = Parameters<typeof useFetch<T>>[1];

const defaultOptions = { lazy: true };

export class PodClientService {
  getPodcast<ResponseData extends PodcastTypes.ServerResponse>(
    fetchOptions: PodcastTypes.RouteParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/podcast-single', { ...options });
  }

  getTypeahead<ResponseData extends TypeaheadTypes.ServerResponse>(
    fetchOptions: TypeaheadTypes.RouteGetParams & AppUseFetchOptions<ResponseData>
  ) {
    const options = { ...defaultOptions, ...fetchOptions };
    return useFetch<ResponseData>('/api/podcast/typeahead', {
      ...options,
    });
  }
}
