const express = require("express");
const router = express.Router();
const axios = require("axios");
const pod_api = require("../controllers/podcast");

/**
 *
 * Podcast API: Typeahead
 *
 */
router.get("/api/typeahead", function(req, res, next) {
  pod_api
    .typeahead(req, res); 
});
/* /end Podcast API: Typeahead */

module.exports = router;
