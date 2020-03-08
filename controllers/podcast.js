const Axios = require('axios');
const Pod_api = {};
const GetKey = process.env.POD_ENV_API_LISTEN_TOKEN;


const IsMocking = true;
const MockAdapter = require('axios-mock-adapter');
const Mock = new MockAdapter(Axios);
const MockData = {
  typeahead: require('./podcast-mock-data/podcast-mock-typeahead'),
  best_podcast: require('./podcast-mock-data/podcast-mock-best-podcasts.js'),
  genres: require('./podcast-mock-data/podcast-mock-genres.js'),
  podcasts: require('./podcast-mock-data/podcast-mock-podcasts.js')
};

/**
 *
 * Helpers:
 *
 */
Pod_api.helpGetRequest = function(req, res, _requestURL, _params) {
  debugger;

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
      res.status(503);
      res.json({
        error: _error
      });
    });
};

/**
 *
 * Typeahead
 *
 */
if (IsMocking) {
  Mock.onGet('https://listen-api.listennotes.com/api/v2/typeahead').reply(200, MockData.typeahead);
}
Pod_api.typeahead = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/typeahead';
  let requestParams = {
    q: req.query.q,
    show_podcasts: req.query.show_podcasts || '0',
    show_genres: req.query.show_genres || '0',
    safe_mode: req.query.safe_mode || '0'
  };

  if (!req.query || !req.query.q) {
    res.json({
      error: 'No query provided'
    });
  }
  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

/**
 *
 * Podcast Best Podcasts by Genre
 *
 */
if (IsMocking) {
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
if (IsMocking) {
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
if (IsMocking) {
  Mock.onGet(/.\/podcasts\/./).reply(200, MockData.podcasts);
}
Pod_api.getPodcastID = function(req, res) {
  let requestURL = 'https://listen-api.listennotes.com/api/v2/podcasts/' + req.params.id;
  let requestParams = req.query || {};
  debugger;
  Pod_api.helpGetRequest(req, res, requestURL, requestParams);
};

module.exports = Pod_api;
