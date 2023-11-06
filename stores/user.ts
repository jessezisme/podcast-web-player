import type * as PodcastTypes from '~/shared/podcast/api/types/podcast-get.d';
import { UserClientService } from '~/shared/user/services';
import { useToastStore } from '~/stores/toast';

type SubscriptionsType = Awaited<ReturnType<UserClientService['getSubscriptions']>>;

export const useUserStore = defineStore('user', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toastStore = useToastStore();
  const isLoading = ref(false);
  const isLoggedIn = computed(() => {
    return !!(user && user?.value);
  });
  const podcasts = ref<SubscriptionsType>([]);
  const podcastIds = computed(() => {
    return podcasts.value?.map((val) => val.id) || [];
  });

  const clearUserData = () => {
    podcasts.value = [];
  };

  const logout = async () => {
    try {
      const response = await supabase.auth.signOut();
      if (response.error) {
        toastStore.addToast({ id: 'logout', title: 'Error occurred while logging out. Please try again.' }, 'error');
      }
    } catch (error) {
      toastStore.addToast({ id: 'logout', title: 'Error occurred while logging out. Please try again.' }, 'error');
    }
    navigateTo('/');
  };

  const login = async (loginData: { email: string; password: string }) => {
    let error;
    isLoading.value = true;

    try {
      const response = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (response.error) {
        error = createError({ message: 'Could not sign in. Please try again.', data: response.error });
      }
    } catch (error) {
      error = createError({ message: 'Could not sign in. Please try again.', data: error });
    }

    isLoading.value = false;

    return { error };
  };

  const loginGithub = async () => {
    let error;
    isLoading.value = true;

    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (response.error) {
        error = createError({ message: 'Error occurred while signing in. Please try again.', data: response.error });
      }
    } catch (error) {
      error = createError({ message: 'An error occurred with the sign in service.', data: error });
    }

    isLoading.value = false;

    return { error };
  };

  const loginDemoUser = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'podnexus@mailinator.com',
      password: 'password',
    });
    return { error };
  };

  const deleteUser = async () => {
    try {
      const response = await new UserClientService().deleteUser();
      if (!response.error) {
        toastStore.addToast({ id: 'delete-account', title: 'An error occurred while deleting your account.' }, 'error');
        isLoggedIn && logout();
      } else {
        toastStore.addToast({ id: 'delete-account', title: 'Account deleted.' }, 'success');
      }
    } catch (error) {
      toastStore.addToast({ id: 'delete-account', title: 'An error occurred while deleting your account.' }, 'error');
    }
  };

  const getSubscriptions = async () => {
    let error;

    const getData = async () => {
      const response = await new UserClientService().getSubscriptions();
      if (response?.length) {
        podcasts.value = [...response];
      }
    };

    const handleError = (error: any) => {
      error = createError({ message: 'An error occurred while getting subscriptions.', data: error });
      toastStore.addToast({ id: 'get-subscriptions', title: 'An error occurred while getting subscriptions.' }, 'error');
    };

    try {
      isLoading.value = true;
      await getData();
    } catch (error) {
      handleError(error);
    }

    isLoading.value = false;

    return { error };
  };

  const addSubscription = async (id: string) => {
    const isSaved = podcastIds.value.includes(id);
    let error;

    if (isSaved) {
      return;
    }

    const getData = async () => {
      const response = await new UserClientService().addSubscription(id);
      if (response?.length) {
        podcasts.value.push(...response);
        toastStore.addToast({ id: 'add-subscription', title: 'Added to library.' }, 'success');
      }
    };

    const handleError = (error: any) => {
      error = createError({
        message: 'An error occurred while adding subscription.',
        data: error,
      });
      toastStore.addToast({ id: 'add-subscription-error', title: 'Could not add to library. Please try again.' }, 'error');
    };

    try {
      isLoading.value = true;
      await getData();
    } catch (error) {
      handleError(error);
    }

    isLoading.value = false;

    return { error };
  };

  const deleteSubscription = async (id: string) => {
    const isSaved = podcastIds.value.includes(id);
    let error;

    if (!isSaved) {
      return;
    }

    const getData = async () => {
      const response = await new UserClientService().deleteSubscription(id);
      if (response?.length) {
        podcasts.value = [...podcasts.value].filter((val) => val.id !== id);
      }
    };

    const handleError = (error: any) => {
      error = createError({
        message: 'An error occurred while deleting subscription.',
        data: error,
      });
    };

    try {
      isLoading.value = true;
      await getData();
    } catch (error) {
      handleError(error);
    }

    isLoading.value = false;

    return { error };
  };

  const watchLogin = watch(
    isLoggedIn,
    (newVal, oldVal) => {
      // logged out
      if (!newVal) {
        clearUserData();
      }
      // logged in
      setTimeout(() => {
        if (isLoggedIn.value) {
          getSubscriptions();
        }
      }, 100);
    },
    { immediate: true }
  );

  return {
    isLoading,
    user,
    deleteUser,
    isLoggedIn,
    login,
    logout,
    loginGithub,
    loginDemoUser,
    podcasts,
    podcastIds,
    deleteSubscription,
    addSubscription,
  };
});
