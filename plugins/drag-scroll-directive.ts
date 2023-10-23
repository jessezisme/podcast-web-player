import type { UseMouseEventExtractor } from '@vueuse/core';
import { useMousePressed, useMouse } from '@vueuse/core';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('drag', {
    mounted(el) {
      let startX: number = 0;
      let scrollLeft: number = 0;
      const { pressed } = useMousePressed({ target: el, touch: false });
      const { x, sourceType } = useMouse({
        target: el,
      });

      watch(x, (newVal) => {
        if (pressed.value) {
          const x = newVal - el.offsetLeft;
          const walk = x - startX;
          const prevScrollLeft = el.scrollLeft;
          el.scrollLeft = scrollLeft - walk;
        }
      });

      watch(pressed, (newVal) => {
        if (newVal === true) {
          // console.log(x.value);
          startX = x.value - el.offsetLeft;
          scrollLeft = el.scrollLeft;
        }
      });
    },
  });
});
