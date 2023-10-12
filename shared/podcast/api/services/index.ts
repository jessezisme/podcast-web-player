import { AsyncDataOptions, UseFetchOptions } from 'nuxt/app';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';
import { FetchOptions } from 'ofetch';
import { type NitroFetchOptions } from 'nitropack';

class PodClientService {
  async getTypeahead(
    fetchOptions: TypeaheadTypes.RouteGetParams & UseFetchOptions<'json'>
  ) {
    if (fetchOptions?.query?.q) {
      return useFetch<TypeaheadTypes.RouteGetParams>('/typeahead');
    }
  }
}

export default new PodClientService();
