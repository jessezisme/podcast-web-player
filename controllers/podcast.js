const Axios = require('axios');
const Pod_api = {};
const GetKey = process.env.POD_ENV_API_LISTEN_TOKEN;

var IS_MOCKING = false;
// var IS_MOCKING = true;

var MockAdapter;
var Mock;
var MockData;
if (IS_MOCKING) {
  MockAdapter = require('axios-mock-adapter');
  Mock = new MockAdapter(Axios);
  MockData = {
    typeahead: require('./podcast-mock-data/podcast-mock-typeahead'),
    search: require('./podcast-mock-data/podcast-mock-search.js'),
    best_podcast: require('./podcast-mock-data/podcast-mock-best-podcasts.js'),
    genres: require('./podcast-mock-data/podcast-mock-genres.js'),
    podcasts: require('./podcast-mock-data/podcast-mock-podcasts.js')
  };
}

/**
 *
 * Helpers:
 *
 */
Pod_api.helpGetRequest = function(req, res, _requestURL, _params) {
  Axios.get(_requestURL, {
    headers: {
      'X-ListenAPI-Key': GetKey
    },
    params: _params ? _params : {},
    responseType: 'json',
    timeout: 8000,
    validateStatus: function(status) {
      return status == 200;
    }
  })
    .then(function(_response) {
      res.status(200);
      res.json({
        success: _response.data
      });
    })
    .catch(function(_error) {
      console.log(_error);
      res.status(503);
      res.json({
        error: _error
      });
    });
};

/**
 *
 * Typeahead:
 * for typeahead feature in search bar
 *
 */
if (IS_MOCKING) {
  Mock.onGet('https://listen-api.listennotes.com/api/v2/typeahead').reply(200, MockData.typeahead);
}
Pod_api.typeahead = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/typeahead';
  let optionalParams = ['show_podcasts', 'show_genres', 'safe_mode'];
  let requestParams = {
    q: req.query.q
  };

  optionalParams.forEach((val) => {
    if (req.query[val]) {
      requestParams[val] = req.query[val];
    }
  });

  if (!req.query || !req.query.q) {
    res.json({
      error: 'No query provided'
    });
  }
  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

/**
 *
 * Search:
 * full search
 *
 */
if (IS_MOCKING) {
  Mock.onGet('https://listen-api.listennotes.com/api/v2/search').reply(200, MockData.search);
}

Pod_api.search = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/search';
  let optionalParams = [
    'sort_by_date',
    'type',
    'offset',
    'genre_ids',
    'published_before',
    'published_after',
    'only_in',
    'language',
    'ocid',
    'ncid',
    'safe_mode'
  ];
  let requestParams = {
    q: req.params.searchterm
  };

  optionalParams.forEach((val) => {
    if (req.query[val]) {
      requestParams[val] = req.query[val];
    }
  });

  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

/**
 *
 * Podcast Best Podcasts by Genre
 *
 */
if (IS_MOCKING) {
  Mock.onGet('https://listen-api.listennotes.com/api/v2/best_podcasts').reply(200, MockData.best_podcast);
}
Pod_api.bestPodcasts = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/best_podcasts';
  let requestParams = {
    genre_id: req.query.genre_id,
    page: req.query.page || 1,
    safe_mode: req.query.safe_mode || 0
  };
  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

/**
 *
 * Podcast Genres Response
 *
 */
if (IS_MOCKING) {
  Mock.onGet('https://listen-api.listennotes.com/api/v2/genres').reply(200, MockData.genres);
}
Pod_api.genres = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/genres';
  Pod_api.helpGetRequest(req, res, requestURL);
};

/**
 *
 * Get podcast episodes and meta data by ID
 *
 */
if (IS_MOCKING) {
  Mock.onGet(/.\/podcasts\/./).reply(200, MockData.podcasts);
}
Pod_api.getPodcastID = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/podcasts/' + req.params.id;
  let requestParams = req.query || {};

  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

module.exports = Pod_api;
