import striptags from 'striptags';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      appRemoveHtml: (str: string) => {
        const getString = typeof str === 'string' ? str : '';
        return striptags(getString);
      },
    },
  };
});
