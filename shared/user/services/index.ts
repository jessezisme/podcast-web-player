type FetchOptions = Parameters<typeof $fetch>[1];

export class UserClientService {
  deleteUser(fetchOptions?: FetchOptions) {
    const options: FetchOptions = {
      credentials: 'include',
      method: 'DELETE',
    };
    return $fetch<any>('/api/user/user-delete', {
      ...(fetchOptions || {}),
      ...options,
    } as FetchOptions);
  }

  getSubscriptions(fetchOptions?: FetchOptions) {
    const options: FetchOptions = {
      credentials: 'include',
      method: 'GET',
    };
    return $fetch<{ id: string; title: string; image: string; link: string }[]>('/api/user/subscriptions', {
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
    return $fetch<{ id: string; title: string; image: string; link: string }[]>('/api/user/subscriptions', {
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

    return $fetch<{ id: string; title: string; image: string; link: string }[]>('/api/user/subscriptions', {
      ...(fetchOptions || {}),
      ...options,
    } as FetchOptions);
  }
}
