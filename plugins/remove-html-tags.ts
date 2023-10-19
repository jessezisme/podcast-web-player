import striptags from 'striptags';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      appRemoveHtml: (str: string) => {
        const getString = str.toString() || '';
        return striptags(getString);
      },
    },
  };
});
