type FetchOptions = Parameters<typeof $fetch>[1];

export class UserClientService {
  getSubscriptions(fetchOptions?: FetchOptions) {
    const options: FetchOptions = {
      credentials: 'include',
      method: 'GET',
    };
    return $fetch<{ id: string; title: string; image: string }[]>('/api/user/subscriptions', {
      ...(fetchOptions || {}),
      ...options,
    } as FetchOptions);
  }

  addSubscription(id: string, fetchOptions?: FetchOptions) {
    const options: FetchOptions = {
      credentials: 'include',
      method: 'POST',
      query: {
        id: id,
      },
    };
    return $fetch<{ id: string; title: string; image: string }[]>('/api/user/subscriptions', {
      ...(fetchOptions || {}),
      ...options,
    } as FetchOptions);
  }

  deleteSubscription(id: string, fetchOptions?: FetchOptions) {
    const options: FetchOptions = {
      credentials: 'include',
      method: 'DELETE',
      query: {
        id: id,
      },
    };

    return $fetch<{ id: string; title: string; image: string }[]>('/api/user/subscriptions', {
      ...(fetchOptions || {}),
      ...options,
    } as FetchOptions);
  }
}
