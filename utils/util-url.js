// https://www.npmjs.com/package/query-string
import QueryString from 'query-string';

const Util_url = {};

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
Util_url.stringifyURL = function(_URL, _paramObj) {
  return QueryString.stringifyUrl({ url: _URL, query: _paramObj });
};
/**
 *
 * Encodes URL:
 * returns encoded URL; checks if already encoded before encoding
 *
 * @param {string} getURL - url
 */
Util_url.encodeURL = function(getURL) {
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
Util_url.prettyString = function(uglyString) {
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
Util_url.podcastURL = function(urlObj) {
  // podcast unique ID
  let getID = urlObj.id + '' || '';
  getID = getID.trim();
  // podcast raw name to be formatted
  let getTitle = urlObj.title + '' || '';
  getTitle = Util_url.prettyString(getTitle);
  // final URL
  return '/podcast/' + getTitle + '/' + getID;
};

export default Util_url;
