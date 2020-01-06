const express = require("express");
const router = express.Router();
const PodApi = require("../controllers/podcast");

/**
 *
 * Podcast Typeahead:
 * fetch podcasts, genres, and terms for query
 *
 */
router.get("/api/typeahead", function(req, res, next) {
  PodApi.typeahead(req, res);
});

/**
 *
 * Podcast by ID:
 * fetch detailed meta and episodes for a podcast by ID
 *
 */
router.get("/api/podcast/:id", function(req, res, next) {
  PodApi.getPodcastID(req, res);
});

/**
 *
 * Podcast Best Podcasts by Genre:
 * fetch podcast recommendations for a single genre
 *
 */
router.get("/api/best-podcasts", function(req, res, next) {
  PodApi.bestPodcasts(req, res);
});

/**
 *
 * Podcast Genres:
 * fetch full list of categories and assigned ID's by API
 *
 */
router.get("/api/genres", function(req, res, next) {
  PodApi.genres(req, res);
});

module.exports = router;
