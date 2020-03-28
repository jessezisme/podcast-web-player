// https://www.npmjs.com/package/query-string
import QueryString from 'query-string';
// https://github.com/werk85/node-html-to-text
import HtmlToText from 'html-to-text';

const Util_main = {};

/**
 *
 * Convert object into url parameter string
 * uses npm library
 *
 * @param {Object} object with parameter key/values - {b: 1, c: 2, a: 3}
 * -- returns 'b=1&c=2&a=3'
 *
 *
 */
Util_main.stringifyURL = function(_URL, _paramObj) {
  return QueryString.stringifyUrl({ url: _URL, query: _paramObj });
};
/**
 *
 * Encodes URL:
 * returns encoded URL; checks if already encoded before encoding
 *
 * @param {string} getURL - url
 */
Util_main.encodeURL = function(getURL) {
  let getEncodedURL = encodeURI(getURL);
  let getDecodedURL = decodeURI(getURL);
  // compare encoded against decoded to check if already encoded
  if (getEncodedURL === getDecodedURL) {
    return getURL;
  } else {
    return getEncodedURL;
  }
};

/**
 *
 * Convert string to seo-friendly string:
 * used for handling podcast titles, etc...
 *
 * @param {string} uglyString - raw url string to be formatted
 */
Util_main.prettyString = function(uglyString) {
  let formatString = uglyString;
  formatString = formatString
    // lowercase
    .toLowerCase()
    // trim leading/trailing spaces
    .trim()
    // replace all non-numbers and characters
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // replace duplicate spaces with single space
    .replace(/\s\s+/g, ' ')
    // re-trim leading/trailing spaces to avoid trailing hypens
    .trim()
    // replace space with hypen
    .replace(/\s/g, '-');

  return formatString;
};

/**
 *
 * Podcast URL:
 * returns podcast URL
 *
 * @param {obj} urlObj - contains podcast url strings
 * {string} urlObj.id - podcast id
 * {string} urlObj.title - podcast title
 *
 */
Util_main.podcastURL = function(urlObj) {
  // podcast unique ID
  let getID = urlObj.id + '' || '';
  getID = getID.trim();
  // podcast raw name to be formatted
  let getTitle = urlObj.title + '' || '';
  getTitle = Util_main.prettyString(getTitle);
  // final URL
  return '/podcast/' + getTitle + '/' + getID;
};

/**
 *
 * convert html to text
 *
 * @param {string} getHTML - html string
 * @param {number} _length - length to limit string
 *
 */
Util_main.htmlToText = function(getHTML, _length) {
  let getText = HtmlToText.fromString(getHTML) || '';
  let getLength = _length ? _length : 888;
  getText = getText.length > getLength ? getText.slice(0, getLength) + '...' : getText;
  return getText;
};

/**
 * Converts timestamp to readable data
 * @param {number} timestamp
 */
Util_main.datePrettyPrint = function(_getTime) {
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
    'December'
  ];
  const dateObj = new Date(_getTime);
  let dateText = '';
  if (_getTime) {
    dateText += monthNames[dateObj.getMonth()];
    dateText += ' ' + dateObj.getDate() + ',' + ' ';
    dateText += dateObj.getFullYear();
  }
  return dateText;
};

export default Util_main;
