const express = require("express");
const router = express.Router();
const axios = require("axios");
const pod_api = require("../controllers/podcast");

/**
 *
 * Podcast Typeahead:
 * fetch podcasts, genres, and terms for query
 *
 */
router.get("/api/typeahead", function(req, res, next) {
  pod_api.typeahead(req, res);
});

/**
 *
 * Podcast by ID:
 * fetch detailed meta and episodes for a podcast by ID
 *
 */
router.get("/api/podcast/:id", function(req, res, next) {
  pod_api.getPodcastID(req, res);
});

/**
 *
 * Podcast Best Podcasts by Genre:
 * fetch podcast recommendations for a single genre
 *
 */
router.get("/api/best-podcasts", function(req, res, next) {
  pod_api.bestPodcasts(req, res);
});

/**
 *
 * Podcast Genres:
 * fetch full list of categories and assigned ID's by API
 *
 */
router.get("/api/genres", function(req, res, next) {
  pod_api.genres(req, res);
});

module.exports = router;
