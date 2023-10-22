export default defineNuxtPlugin(() => {
  return {
    provide: {
      appFormatDate: (timestamp: number) => {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const dateObj = new Date(timestamp);
        let dateText = '';

        if (timestamp) {
          dateText += monthNames[dateObj.getMonth()];
          dateText += ' ' + dateObj.getDate() + ',' + ' ';
          dateText += dateObj.getFullYear();
        }
        return dateText;
      },
    },
  };
});
