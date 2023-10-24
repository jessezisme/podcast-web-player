import striptags from 'striptags';

export const stripHTML = (str: string) => {
  const getString = typeof str === 'string' ? str : '';
  return striptags(getString);
};

export const formatDate = (timestamp: number) => {
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
};

export const truncateText = (str: string = '', length: number = 1000) => {
  let cleanStr = stripHTML(str);
  cleanStr = cleanStr.length > length ? `${cleanStr.slice(0, length)}...` : cleanStr;
  return cleanStr;
};

export const convertToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60);
};
