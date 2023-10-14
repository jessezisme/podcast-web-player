import { AsyncDataOptions, UseFetchOptions } from 'nuxt/app';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import { FetchOptions } from 'ofetch';
import { type NitroFetchOptions } from 'nitropack';

export class PodClientService {
  getTypeahead(
    fetchOptions: TypeaheadTypes.RouteGetParams & UseFetchOptions<'json'>
  ) {
    return useFetch<TypeaheadTypes.ServerResponse>('/api/podcast/typeahead');
    // if (fetchOptions?.query?.q) {
    //   return useFetch<TypeaheadTypes.RouteGetParams>('/typeahead');
    // }
  }
}
