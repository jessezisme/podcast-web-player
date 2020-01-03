const Util_url = {};

/**
 *
 * Encodes URL: *
 * returns encoded URL; checks if already encoded before encoding
 *
 * @param {string} getURL - url
 */
Util_url.encodeURL = function(getURL) {
  var getEncodedURL = encodeURI(getURL);
  var getDecodedURL = decodeURI(getURL);

  // compare encoded against decoded to check if already encoded
  if (getEncodedURL === getDecodedURL) {
    return getEncodedURL;
  } else {
    return getDecodedURL;
  }
};

/**
 *
 * Convert string to seo-friendly string;
 * necessary for handling podcast titles, etc...
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
    .replace(/[^a-zA-Z0-9]/g, " ")
    // replace duplicate spaces with single space
    .replace(/\s\s+/g, " ")
    // re-trim leading/trailing spaces to avoid trailing hypens
    .trim()
    // replace space with hypen
    .replace(/\s/g, "-");

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
  let getID = urlObj.id + "" || "";
  getID = getID.trim();
  // podcast raw name to be formatted
  let getTitle = urlObj.title + "" || "";
  getTitle = Util_url.prettyString(getTitle);
  // final URL
  return "/podcast/" + getTitle + "/" + getID;
};

module.exports = Util_url;