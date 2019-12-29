const express = require("express");
const router = express.Router();
const axios = require("axios");
const pod_api = require("../controllers/podcast");


/**
 *
 * Podcast Typeahead
 *
 */
router.get("/api/typeahead", function(req, res, next) {
  pod_api.typeahead(req, res);
});


/**
 *
 * Podcast Best Podcasts by Genre
 *
 */
router.get("/api/best-podcasts", function(req, res, next) {
  pod_api.bestPodcasts(req, res);
});


/**
 *
 * Podcast Genres
 *
 */
router.get("/api/genres", function(req, res, next) {
  pod_api.genres(req, res);
});

module.exports = router;
