type ToastAdd = { id: string } & ReturnType<ReturnType<typeof useToast>['add']>;
type ToastType = 'success' | 'warn' | 'error';

export const useToastStore = defineStore('toast', () => {
  const toastArray = ref<ToastAdd[]>([]);

  const deleteAllToasts = () => {
    toastArray.value.forEach((val) => deleteToast(val.id));
  };

  const deleteToast = (id: string) => {
    toastArray.value = toastArray.value.filter((val) => val.id !== id);
    useToast().remove(id);
  };

  const addToast = (options: ToastAdd, type?: ToastType) => {
    options.id = options.id || Date.now().toString();

    switch (type) {
      case 'error':
        options.color = 'error';
        // options.icon = 'i-heroicons-exclamation-circle';
        break;
      case 'warn':
        options.color = 'warn';
        // options.icon = 'i-heroicons-exclamation-circle';
        break;
      case 'success':
        options.color = 'success';
      // options.icon = 'i-heroicons-check-circle';
    }

    options.callback = deleteToast.bind(this, options.id);
    const toast = useToast().add(options);
    toastArray.value.push(toast);

    return {
      toast: toast,
      remove: () => deleteToast(toast.id),
    };
  };

  return {
    toastArray,
    deleteAllToasts,
    deleteToast,
    addToast,
  };
});
