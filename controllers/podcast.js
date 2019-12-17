// require("dotenv").config();

const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const pod_api = {};

var mockData = {
  terms: ["star wars episode i the phantom menace", "star wars"],
  genres: [
    {
      id: 160,
      name: "Star Wars",
      parent_id: 68
    }
  ],
  podcasts: [
    {
      title_highlighted:
        'Rebel Force Radio: <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Podcast',
      title_original: "Rebel Force Radio: Star Wars Podcast",
      publisher_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: "Star Wars",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-4v5pRaEg1Ub.300x300.jpg",
      id: "ca3b35271db04291ba56fab8a4f731e4",
      explicit_content: false
    },
    {
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Explained',
      title_original: "Star Wars Explained",
      publisher_highlighted: "Alex & Mollie",
      publisher_original: "Alex & Mollie",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/star-wars-explained-alex-mollie-SMhNZbDY7Il-zuwl0R2DOjf.300x300.jpg",
      id: "699701ca2479411f9c0bbf8dd85323e8",
      explicit_content: false
    },
    {
      title_highlighted:
        'Inside <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      title_original: "Inside Star Wars",
      publisher_highlighted: "Wondery",
      publisher_original: "Wondery",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/inside-star-wars-wondery-e8ydUYnAOJv.300x300.jpg",
      id: "8e90b8f0c9eb4c11b13f9dc331ed747c",
      explicit_content: false
    },
    {
      title_highlighted: "Skytalkers",
      title_original: "Skytalkers",
      publisher_highlighted:
        'Charlotte Errity & Caitlin Plesher - <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: "Charlotte Errity & Caitlin Plesher - Star Wars",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/skytalkers-charlotte-errity-caitlin-plesher--hNC10LzS4A.300x290.jpg",
      id: "46c50b17a1c6474fb77e21f438ccd78d",
      explicit_content: false
    },
    {
      title_highlighted: "The Mindalorian",
      title_original: "The Mindalorian",
      publisher_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Minute',
      publisher_original: "Star Wars Minute",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/the-mindalorian-star-wars-minute-ioQ-swnS2Vu-yntWxcMS0YD.300x300.jpg",
      id: "cc1fd08a83084c06b6040748aa50a285",
      explicit_content: false
    }
  ]
};

/**
 * Typeahead
 *
 */
pod_api.typeahead = function(req, res) {
  const getKey = process.env.POD_ENV_API_LISTEN_TOKEN;
  const buildParams = {
    q: req.query.q,
    show_podcasts: req.query.show_podcasts || "0",
    show_genres: req.query.show_genres || "0",
    safe_mode: req.query.safe_mode || "0"
  };

  const apiResponse = {};
  mock
    .onGet("https://listen-api.listennotes.com/api/v2/typeahead")
    .reply(200, {
      message: "Successful request to Listennotes API",
      data: mockData
    });

  console.log(buildParams);

  axios
    .get("https://listen-api.listennotes.com/api/v2/typeaheadzzzz", {
      headers: {
        "X-ListenAPI-Key": getKey
      },
      responseType: "json",
      params: buildParams,
      timeout: 8000,
      validateStatus: function(status) {
        return status == 200;
      }
    })
    .then(function(_response) {
      res.status(200);
      res.json({
        message: "Successful request to Listennotes API",
        data: _response.data
      }); 
    })
    .catch(function(_error) {
      res.status(error.response.status); 
      res.json({
        message: "Failed request to Listennotes API",
        error: error.response.data
      }) 
    });
};

module.exports = pod_api;
