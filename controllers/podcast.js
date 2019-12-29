const axios = require("axios");
const fs = require("fs");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const pod_api = {};
const getKey = process.env.POD_ENV_API_LISTEN_TOKEN;

var mockDataTypeahead = {
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
 *
 * Typeahead
 *
 */
pod_api.typeahead = function(req, res) {
  const buildParams = {
    q: req.query.q,
    show_podcasts: req.query.show_podcasts || "0",
    show_genres: req.query.show_genres || "0",
    safe_mode: req.query.safe_mode || "0"
  };

  mock
    .onGet("https://listen-api.listennotes.com/api/v2/typeahead")
    .reply(200, mockDataTypeahead);

  axios
    .get("https://listen-api.listennotes.com/api/v2/typeahead", {
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
      // console.log(_response);
      res.json({
        success: _response.data
      });
    })
    .catch(function(_error) {
      res.status(_error.response.status);
      res.json({
        error: _error
      });
    });
};

/**
 *
 * Podcast Best Podcasts by Genre
 *
 */
var mockDataBest = {
  id: 85,
  name: "Video Games",
  parent_id: 82,
  podcasts: [
    {
      id: "9b88b3a9c3a444ba9117de8600b748f4",
      title: "Play, Watch, Listen",
      publisher: "Alanah Pearce",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/play-watch-listen-LyMYpO50UBJ-JnKDUFOo35p.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/play-watch-listen-LyMYpO50UBJ-JnKDUFOo35p.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/9b88b3a9c3a444ba9117de8600b748f4/",
      total_episodes: 1,
      explicit_content: false,
      description:
        "Join Alanah Pearce (games media), Troy Baker (voice actor), Mike Bithell (game director), and Austin Wintory (game composer) as they talk about all the games, movies, TV and 'whatever else' they've experienced that month, from four unique perspectives in the games industry.",
      itunes_id: 1492391341,
      rss: "https://www.listennotes.com/c/r/9b88b3a9c3a444ba9117de8600b748f4",
      latest_pub_date_ms: 1576805757000,
      earliest_pub_date_ms: 1576805757000,
      language: "English",
      country: "United States",
      website:
        "http://playwatchlisten.libsyn.com/website?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "playwatchlistenpodcast@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [82, 67, 85, 122, 68]
    },
    {
      id: "4ae1e15cbd1f48308a9fcf1a12530c5c",
      title: "Arcade Perfect Podcast",
      publisher: "Darren Borg/Sean Tagg",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/arcade-perfect-podcast-darren-borgsean-tagg-Vp7CAJU2T1W.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/arcade-perfect-podcast-darren-borgsean-tagg-Vp7CAJU2T1W.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/4ae1e15cbd1f48308a9fcf1a12530c5c/",
      total_episodes: 41,
      explicit_content: false,
      description:
        "Join Taggsta and Daz as they sort after the best Arcade Perfect home ports on Console and Vintage computer's.",
      itunes_id: 1257337417,
      rss: "https://www.listennotes.com/c/r/4ae1e15cbd1f48308a9fcf1a12530c5c",
      latest_pub_date_ms: 1576060230000,
      earliest_pub_date_ms: 1499485363038,
      language: "English",
      country: "United States",
      website:
        "https://arcadeperfectau.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "darren.borg78@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 127, 129]
    },
    {
      id: "8fdb403b9f244d5c96b35a8b166b3199",
      title: "The Hyper Voice",
      publisher: "The Hyper Voice",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/the-hyper-voice-the-hyper-voice-QTjkAwdDLbv-JwH59koicuC.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/the-hyper-voice-the-hyper-voice-QTjkAwdDLbv-JwH59koicuC.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/8fdb403b9f244d5c96b35a8b166b3199/",
      total_episodes: 73,
      explicit_content: false,
      description:
        "Pokemon experts discuss anything and everything about the official competitive scene, the Video Game Championship Series. Welcome to the world of competitive Pokemon!",
      itunes_id: 1463265834,
      rss: "https://www.listennotes.com/c/r/8fdb403b9f244d5c96b35a8b166b3199",
      latest_pub_date_ms: 1576926000000,
      earliest_pub_date_ms: 1557378300065,
      language: "English",
      country: "United States",
      website:
        "https://thehypervoice.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "stephenmorioka@sbcglobal.net",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [82, 67, 85]
    },
    {
      id: "6e7787a1d2384dc092f2f760484ec8c2",
      title: "Indie Incursion: An Indie Games Podcast",
      publisher: "The HP Video Game Podcast Network",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/indie-incursion-an-indie-games-podcast-the-icbV9-AxFSr-oRdLDqvX0FK.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/indie-incursion-an-indie-games-podcast-the-icbV9-AxFSr-oRdLDqvX0FK.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/6e7787a1d2384dc092f2f760484ec8c2/",
      total_episodes: 65,
      explicit_content: false,
      description:
        "<p>Indie Incursion is a podcast about indie games and their creators. Showcasing indie games news, indie games on Kickstarter and anything indie game related you might want to know.</p>",
      itunes_id: 1459327958,
      rss: "https://www.listennotes.com/c/r/6e7787a1d2384dc092f2f760484ec8c2",
      latest_pub_date_ms: 1577444400000,
      earliest_pub_date_ms: 1541902140058,
      language: "English",
      country: "United States",
      website:
        "https://indieincursionpodcast.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "fanboytalks@yahoo.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [82, 67, 85]
    },
    {
      id: "2894e3337a17463fa9a5e8f3f01eb311",
      title: "Quest Log",
      publisher: "John-Luke Pollock",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/quest-log-john-luke-pollock-YUE9OcudaQC-AOY9B-SxbsD.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/quest-log-john-luke-pollock-YUE9OcudaQC-AOY9B-SxbsD.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/2894e3337a17463fa9a5e8f3f01eb311/",
      total_episodes: 1,
      explicit_content: false,
      description:
        "The first and only monthly podcast dedicated to the Oculus Quest!",
      itunes_id: 1490355817,
      rss: "https://www.listennotes.com/c/r/2894e3337a17463fa9a5e8f3f01eb311",
      latest_pub_date_ms: 1575489600000,
      earliest_pub_date_ms: 1575489600000,
      language: "English",
      country: "United States",
      website:
        "https://podcast.rss.com/questlog/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "wishfulthinkingchannel@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [85, 127, 67, 82]
    },
    {
      id: "67a0c4c9b09c41e2afd289ffe2cadb7e",
      title: "WoW Killer: A World of Warcraft Podcast",
      publisher: "Garrett Weinzierl & Taliesin",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/wow-killer-a-world-of-warcraft-podcast-qis0NTz9IWF-1fcYHLu2bVn.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/wow-killer-a-world-of-warcraft-podcast-qis0NTz9IWF-1fcYHLu2bVn.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/67a0c4c9b09c41e2afd289ffe2cadb7e/",
      total_episodes: 2,
      explicit_content: false,
      description:
        "Every week Garrett and Taliesin tackle a single topic surrounding World of Warcraft.",
      itunes_id: 1490275048,
      rss: "https://www.listennotes.com/c/r/67a0c4c9b09c41e2afd289ffe2cadb7e",
      latest_pub_date_ms: 1576250065000,
      earliest_pub_date_ms: 1575475018000,
      language: "English",
      country: "United States",
      website:
        "http://amove.tv/wowkiller/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "amovetv@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [85, 67, 82]
    },
    {
      id: "434d41ff41e240bfac3da44bb497e7d7",
      title: "Unlocked: The Nancy Drew Podcast",
      publisher: "Her Interactive",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/unlocked-the-nancy-drew-podcast-her-iVlFj9nEgfp-KPpTalDnxL9.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/unlocked-the-nancy-drew-podcast-her-iVlFj9nEgfp-KPpTalDnxL9.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/434d41ff41e240bfac3da44bb497e7d7/",
      total_episodes: 71,
      explicit_content: false,
      description:
        "The official Nancy Drew Podcast by Her Interactive with your host Tammy Tuckey.",
      itunes_id: 1173041433,
      rss: "https://www.listennotes.com/c/r/434d41ff41e240bfac3da44bb497e7d7",
      latest_pub_date_ms: 1576884277000,
      earliest_pub_date_ms: 1478292359066,
      language: "English",
      country: "United States",
      website:
        "https://nancydrew.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "feedback@herinteractive.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [85, 67, 82]
    },
    {
      id: "b8a1e2a6f5cc4e5287d07f51dc9d6594",
      title: "Inside Gaming Daily",
      publisher: "Inside Gaming",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/inside-gaming-daily-b87n2_U9ML1-Ig4zYB9fSHo.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/inside-gaming-daily-b87n2_U9ML1-Ig4zYB9fSHo.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/b8a1e2a6f5cc4e5287d07f51dc9d6594/",
      total_episodes: 40,
      explicit_content: false,
      description: "<p>A daily look at the biggest stories in gaming!</p>",
      itunes_id: 1486186806,
      rss: "https://www.listennotes.com/c/r/b8a1e2a6f5cc4e5287d07f51dc9d6594",
      latest_pub_date_ms: 1577368800000,
      earliest_pub_date_ms: 1572657409024,
      language: "English",
      country: "United States",
      website:
        "https://roosterteeth.com/series/inside-gaming-daily?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "RTBroadcast@roosterteeth.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [82, 85, 86, 67, 204]
    },
    {
      id: "02a04671fcc44b47b7952c7935d5aafb",
      title: "The Diablo Show",
      publisher: "Scott Johnson",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/the-diablo-show-scott-johnson-5VXukGFvpJQ.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/the-diablo-show-scott-johnson-5VXukGFvpJQ.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/02a04671fcc44b47b7952c7935d5aafb/",
      total_episodes: 26,
      explicit_content: false,
      description:
        "It's the Diablo Show, with Scott Johnson, creator and host of the top rated WoW show, The Instance.  If you love Diablo, then you're home.  Enjoy this look at the game and culture surounding everyone's favorite Prime Evil!",
      itunes_id: 867757714,
      rss: "https://www.listennotes.com/c/r/02a04671fcc44b47b7952c7935d5aafb",
      latest_pub_date_ms: 1572743152000,
      earliest_pub_date_ms: 1398546500025,
      language: "English",
      country: "United States",
      website:
        "http://frogpants.com/diablo?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "myextralife@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [85, 67, 82]
    },
    {
      id: "9d40e2a2df684e30aefb876e02d06132",
      title: "Side Pull",
      publisher: "Blink Entertainment",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/side-pull-blink-entertainment-1vJ-rcoZePH-NshWHR2toPl.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/side-pull-blink-entertainment-1vJ-rcoZePH-NshWHR2toPl.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/9d40e2a2df684e30aefb876e02d06132/",
      total_episodes: 10,
      explicit_content: false,
      description:
        'Side Pull podcast is a DotA 2 show that\'s about the community, culture, stories, and news that makes DotA so great. We don\'t want to bog you down with the meta, theory crafting, or all the granular confusing crap. Hosted by Austin "Cap" Walsh, acclaimed "Tier 1 talent," TI broadcaster, and voice actor; and Joey "Leafeator" Thimian, who is none of those things.\n\nJoin us every Sunday(ish) to talk about the wacky world of DotA, or just our own personal wacky worlds.\n\nThanks for putting us in your ear holes.',
      itunes_id: 1476575435,
      rss: "https://www.listennotes.com/c/r/9d40e2a2df684e30aefb876e02d06132",
      latest_pub_date_ms: 1577227131000,
      earliest_pub_date_ms: 1565803411008,
      language: "English",
      country: "United States",
      website:
        "https://sidepull.simplecast.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "ace@blinked.gg",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 127, 85, 82, 175, 133]
    },
    {
      id: "60a9a415dc144e2c8c25cd1d82aeeb02",
      title: "The Outer Worlds Show",
      publisher: "Richard & Gio ",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/the-outer-worlds-show-richard-gio-EKknJLPS0U2-MOnyKiCkjlG.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/the-outer-worlds-show-richard-gio-EKknJLPS0U2-MOnyKiCkjlG.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/60a9a415dc144e2c8c25cd1d82aeeb02/",
      total_episodes: 27,
      explicit_content: false,
      description:
        "A show bringing you all the information you'll ever need about Obsidian's first-person RPG The Outer Worlds. We're here to review the lore, gameplay, and news in the weeks leading up to the game's upcoming DLC.  Support this podcast: <a href=\"https://anchor.fm/theouterworlds/support\" rel=\"payment\">https://anchor.fm/theouterworlds/support</a>",
      itunes_id: 1477002668,
      rss: "https://www.listennotes.com/c/r/60a9a415dc144e2c8c25cd1d82aeeb02",
      latest_pub_date_ms: 1577199034000,
      earliest_pub_date_ms: 1565877600024,
      language: "English",
      country: "United States",
      website:
        "https://anchor.fm/theouterworlds?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "podcasts14+d5f05c0@anchor.fm",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 85, 82]
    },
    {
      id: "9fe0077322d941ccb67be44fb9595332",
      title: "The MinnMax Show",
      publisher: "MinnMax",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/the-minnmax-show-minnmax-MBhsGpqv-WJ-tfpoFdQD3Ym.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/the-minnmax-show-minnmax-MBhsGpqv-WJ-tfpoFdQD3Ym.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/9fe0077322d941ccb67be44fb9595332/",
      total_episodes: 10,
      explicit_content: false,
      description:
        "Released every Thursday, The MinnMax Show features former Game Informer employees and beyond talking about the week's most exciting games or game industry news before reading feedback from the Patreon community found at patreon.com/minnmax.",
      itunes_id: 1484599827,
      rss: "https://www.listennotes.com/c/r/9fe0077322d941ccb67be44fb9595332",
      latest_pub_date_ms: 1577368800000,
      earliest_pub_date_ms: 1571809800006,
      language: "English",
      country: "United States",
      website:
        "https://minnmax.com/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "hanson@minnmax.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 85, 82, 204]
    },
    {
      id: "1274e17639e94cf2b18ae5c27ddc1b59",
      title: "PlayStation Experience",
      publisher: "PSVG Podcast Network",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/playstation-experience-doi7XhV4ycT-0NZaK7UFeIB.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/playstation-experience-doi7XhV4ycT-0NZaK7UFeIB.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/1274e17639e94cf2b18ae5c27ddc1b59/",
      total_episodes: 13,
      explicit_content: false,
      description:
        "The PlayStation Experience (PlayStationXP) is a weekly show from the PSVG Podcast Network about all things PlayStation. If it involves PS4, PSVR, Vita, Devin and crew have you covered each week as they breakdown the latest news and releases. Please follow along with the hosts of the PlayStation Experience @PlayStationXP on Twitter. The PlayStation Experience is made possible by the patrons of the PSVG, if you enjoy the show consider supporting the creators at patreon.com/psvg and gain access to many more patron exclusive podcasts and benefits.",
      itunes_id: 1482522526,
      rss: "https://www.listennotes.com/c/r/1274e17639e94cf2b18ae5c27ddc1b59",
      latest_pub_date_ms: 1577271660000,
      earliest_pub_date_ms: 1570292279008,
      language: "English",
      country: "United States",
      website:
        "https://psvg.blog/psxp/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "PSVGNetwork@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 127, 85, 204, 82]
    },
    {
      id: "e09e622559b6495d95947005e79172f0",
      title: "Twofivesix: Gaming and Marketing",
      publisher: "Twofivesix",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/twofivesix-gaming-and-marketing-HMB8UnuDoxX-ZNU_kwOnuRh.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/twofivesix-gaming-and-marketing-HMB8UnuDoxX-ZNU_kwOnuRh.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/e09e622559b6495d95947005e79172f0/",
      total_episodes: 8,
      explicit_content: false,
      description:
        "Twofivesix is a marketing agency with a focus on gaming and interactivity. Founder and CEO Jamin Warren speaks to experts at the intersection of games and marketing about how video games and other forms of interactive entertainment are more relevant than ever—in culture but also in business. We cover how marketers, agencies, and brands can dive into the world of virtual reality, esports, and video games. \n\nFollow us on Twitter: @twofivesix",
      itunes_id: 1480851484,
      rss: "https://www.listennotes.com/c/r/e09e622559b6495d95947005e79172f0",
      latest_pub_date_ms: 1576779745000,
      earliest_pub_date_ms: 1567630025007,
      language: "English",
      country: "United States",
      website:
        "https://twofivesix.co?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "podcasts18+9ae42c4@anchor.fm",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 85, 82]
    },
    {
      id: "1e05a76b8c9a4d7388fa86d448ea57b6",
      title: "Barrens Chat | World of Warcraft Classic & Retail",
      publisher: "Barrens Chat Podcast",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/barrens-chat-world-of-warcraft-classic-retail-ZN_tAiemhWz-7BpH-sKOr1z.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/barrens-chat-world-of-warcraft-classic-retail-ZN_tAiemhWz-7BpH-sKOr1z.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/1e05a76b8c9a4d7388fa86d448ea57b6/",
      total_episodes: 28,
      explicit_content: false,
      description:
        "Barrens Chat | A Classic & Retail World of Warcraft Podcast",
      itunes_id: 1477392192,
      rss: "https://www.listennotes.com/c/r/1e05a76b8c9a4d7388fa86d448ea57b6",
      latest_pub_date_ms: 1577179200000,
      earliest_pub_date_ms: 1566270443027,
      language: "English",
      country: "United States",
      website:
        "https://barrenschat.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "barrenschatpod@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 85, 204, 82]
    },
    {
      id: "698f7bf530574173aeb657a0461b285c",
      title: "Vendor Trash",
      publisher: "Daniel Hosford",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/vendor-trash-6fOHEazAI8B-z9JC7XOIEPD.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/vendor-trash-6fOHEazAI8B-z9JC7XOIEPD.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/698f7bf530574173aeb657a0461b285c/",
      total_episodes: 2,
      explicit_content: false,
      description:
        "Join Slanik as he discusses World of Warcraft, interacts with the thing that made WoW the most successful MMO of all time, the Community, and most of all tries to have as much fun as possible while doing it.",
      itunes_id: 1479059936,
      rss: "https://www.listennotes.com/c/r/698f7bf530574173aeb657a0461b285c",
      latest_pub_date_ms: 1567733813000,
      earliest_pub_date_ms: 1566848693001,
      language: "English",
      country: "United States",
      website:
        "https://anchor.fm/slanik?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "podcasts16+dbdf15c@anchor.fm",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 85, 82]
    },
    {
      id: "85fb53abdc3e43d79e7c8269fae574b5",
      title: "Unrelated At Birth",
      publisher: "Dave Adams and Adam Russell",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/unrelated-at-birth-dave-adams-and-adam-hm31AZ_PLix-3tIXRog4xdU.300x282.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/unrelated-at-birth-dave-adams-and-adam-hm31AZ_PLix-3tIXRog4xdU.300x282.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/85fb53abdc3e43d79e7c8269fae574b5/",
      total_episodes: 107,
      explicit_content: false,
      description:
        "Life has so much to enjoy, so why talk only about one thing?  Each week we take you on a podcast journey through topics that are unrelated, but are things we can all get passionate about!",
      itunes_id: 1304051170,
      rss: "https://www.listennotes.com/c/r/85fb53abdc3e43d79e7c8269fae574b5",
      latest_pub_date_ms: 1577160170000,
      earliest_pub_date_ms: 1509413580076,
      language: "English",
      country: "United States",
      website:
        "https://sidelinewarning.podbean.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "daadams419@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 77, 80, 81]
    },
    {
      id: "dc30677d81d44ccab51ac39d1732e54c",
      title: "PC Gamer UK",
      publisher: "PC Gamer UK",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/pc-gamer-uk-pc-gamer-uk-8Xd5cofNz4t-WpQi6NeXIZb.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/pc-gamer-uk-pc-gamer-uk-8Xd5cofNz4t-WpQi6NeXIZb.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/dc30677d81d44ccab51ac39d1732e54c/",
      total_episodes: 72,
      explicit_content: true,
      description:
        "The PC Gamer UK podcast is a weekly discussion show about PC gaming. Each week, the PC Gamer UK team chat about new releases, old classics and whatever else they've been playing.",
      itunes_id: 1092726736,
      rss: "https://www.listennotes.com/c/r/dc30677d81d44ccab51ac39d1732e54c",
      latest_pub_date_ms: 1565360228000,
      earliest_pub_date_ms: 1457701340071,
      language: "English",
      country: "United States",
      website:
        "https://audioboom.com/channels/4999138?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "phil.savage@futurenet.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [85, 67, 82]
    },
    {
      id: "8f3094f560ee4b729a4324e79e6997d9",
      title:
        "ExtremePCUK - A weekly show about PC Gaming, Building, Modding and Reviews.",
      publisher: "Contact@ExtremePCUK.co.uk",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/extremepcuk-a-monthly-show-about-pc-gaming-nbKC8GU7oQO-4Sucmy-6O9z.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/extremepcuk-a-monthly-show-about-pc-gaming-nbKC8GU7oQO-4Sucmy-6O9z.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/8f3094f560ee4b729a4324e79e6997d9/",
      total_episodes: 79,
      explicit_content: false,
      description:
        "\n       This podcast is brought to you from the owner of ExtremePCUK.co.uk. A custom PC buildings business specialising Show builds. In this podcast we are a group of everyday gamers who don't take life to seriously, we like to have a laugh and talk about the games and tech that we love. We all have our own individual areas from building to streaming and we will cover News, Reviews, Games, Custom builds and our own general views. We also run a free Discord server and community servers for all to get involved and play together, our aim is to grow and build a great community. Have a listen and give us your feedback we hope you enjoy!!!! \n    ",
      itunes_id: 1016123118,
      rss: "https://www.listennotes.com/c/r/8f3094f560ee4b729a4324e79e6997d9",
      latest_pub_date_ms: 1576802753000,
      earliest_pub_date_ms: 1435972758078,
      language: "English",
      country: "United States",
      website:
        "https://extreme-pc-uk.zencast.website?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "ExtremePCUK@gmail.com",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [83, 85, 67, 82, 127, 131]
    },
    {
      id: "b7bfacb9a26a4993b16f53a88f1fb824",
      title: "Waddle On!",
      publisher: "Monorail News",
      image:
        "https://cdn-images-1.listennotes.com/podcasts/waddle-on-n59dhfLCZgv-qTYC5ApGli0.300x300.jpg",
      thumbnail:
        "https://cdn-images-1.listennotes.com/podcasts/waddle-on-n59dhfLCZgv-qTYC5ApGli0.300x300.jpg",
      listennotes_url:
        "https://www.listennotes.com/c/b7bfacb9a26a4993b16f53a88f1fb824/",
      total_episodes: 3,
      explicit_content: false,
      description:
        "Waddle On! is your unofficial backstage look at Club Penguin. Once a week, we'll dive into the world of Club Penguin with the people that made the game! We'll talk about the development, life at the studio, in-game rumors, and more! So come on, waddle with us!",
      itunes_id: 1477279232,
      rss: "https://www.listennotes.com/c/r/b7bfacb9a26a4993b16f53a88f1fb824",
      latest_pub_date_ms: 1568253593000,
      earliest_pub_date_ms: 1567054883002,
      language: "English",
      country: "United States",
      website:
        "http://monorailnews.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
      extra: {
        twitter_handle: "",
        facebook_handle: "",
        instagram_handle: "",
        wechat_handle: "",
        patreon_handle: "",
        youtube_url: "",
        linkedin_url: "",
        spotify_url: "",
        google_url: "",
        url1: "",
        url2: "",
        url3: ""
      },
      is_claimed: false,
      email: "info+5d5c7593766f9f4d723ffcd6@mg.pippa.io",
      looking_for: {
        sponsors: false,
        guests: false,
        cohosts: false,
        cross_promotion: false
      },
      genre_ids: [67, 127, 85, 82]
    }
  ],
  total: 213,
  has_next: true,
  has_previous: false,
  page_number: 1,
  previous_page_number: 0,
  next_page_number: 2,
  listennotes_url: "https://www.listennotes.com/best-video-games-podcasts-85/"
};

// var mockObj = {
//   data: mockData
// };

mock
  .onGet("https://listen-api.listennotes.com/api/v2/best_podcasts")
  .reply(200, mockDataBest);

pod_api.bestPodcasts = function(req, res) {
  console.log("BEST PODCAST");
  const buildParams = {
    genre_id: req.query.genre_id,
    page: req.query.page || 1,
    safe_mode: req.query.safe_mode || 0
  };
  axios
    .get("https://listen-api.listennotes.com/api/v2/best_podcasts", {
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
      console.log(_response.data);
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
 * Podcast Genres Response
 *
 */

var mockGenres = [
  { id: 139, name: "VR & AR", parent_id: 127 },
  { id: 140, name: "Web Design", parent_id: 127 },
  { id: 142, name: "English Learning", parent_id: 116 },
  { id: 143, name: "Programming", parent_id: 127 },
  { id: 144, name: "Personal Finance", parent_id: 67 },
  { id: 115, name: "Training", parent_id: 111 },
  { id: 146, name: "LGBTQ", parent_id: 122 },
  { id: 149, name: "Venture Capital", parent_id: 93 },
  { id: 138, name: "Movie", parent_id: 68 },
  { id: 150, name: "Chinese History", parent_id: 125 },
  { id: 151, name: "Locally Focused", parent_id: 67 },
  { id: 154, name: "San Francisco Bay Area", parent_id: 152 },
  { id: 155, name: "Denver", parent_id: 152 },
  { id: 157, name: "Startup", parent_id: 93 },
  { id: 158, name: "NFL", parent_id: 78 },
  { id: 159, name: "Harry Potter", parent_id: 68 },
  { id: 131, name: "Tech News", parent_id: 99 },
  { id: 165, name: "Storytelling", parent_id: 122 },
  { id: 116, name: "Language Learning", parent_id: 111 },
  { id: 166, name: "YouTube", parent_id: 68 },
  { id: 83, name: "Other Games", parent_id: 82 },
  { id: 152, name: "United States", parent_id: 151 },
  { id: 160, name: "Star Wars", parent_id: 68 },
  { id: 163, name: "AI & Data Science", parent_id: 127 },
  { id: 78, name: "Professional", parent_id: 77 },
  { id: 79, name: "Outdoor", parent_id: 77 },
  { id: 80, name: "College & High School", parent_id: 77 },
  { id: 81, name: "Amateur", parent_id: 77 },
  { id: 90, name: "Self-Help", parent_id: 88 },
  { id: 109, name: "Medicine", parent_id: 107 },
  { id: 118, name: "Local", parent_id: 117 },
  { id: 136, name: "Crypto & Blockchain", parent_id: 127 },
  { id: 148, name: "American History", parent_id: 125 },
  { id: 162, name: "Game of Thrones", parent_id: 68 },
  { id: 156, name: "China", parent_id: 151 },
  { id: 147, name: "SEO", parent_id: 173 },
  { id: 215, name: "News Commentary", parent_id: 99 },
  { id: 120, name: "Regional", parent_id: 117 },
  { id: 121, name: "National", parent_id: 117 },
  { id: 217, name: "Sports News", parent_id: 99 },
  { id: 69, name: "Religion & Spirituality", parent_id: 67 },
  { id: 153, name: "New York", parent_id: 152 },
  { id: 137, name: "NBA", parent_id: 78 },
  { id: 167, name: "Audio Drama", parent_id: 122 },
  { id: 169, name: "Sales", parent_id: 93 },
  { id: 164, name: "Apple", parent_id: 127 },
  { id: 161, name: "Star Trek", parent_id: 68 },
  { id: 244, name: "Documentary", parent_id: 122 },
  { id: 124, name: "Personal Journals", parent_id: 122 },
  { id: 265, name: "Film Reviews", parent_id: 68 },
  { id: 175, name: "Comedy Interviews", parent_id: 133 },
  { id: 185, name: "Science Fiction", parent_id: 168 },
  { id: 74, name: "Other", parent_id: 69 },
  { id: 254, name: "Rugby", parent_id: 77 },
  { id: 181, name: "Self-Improvement", parent_id: 111 },
  { id: 88, name: "Health & Fitness", parent_id: 67 },
  { id: 195, name: "Education for Kids", parent_id: 132 },
  { id: 264, name: "Film Interviews", parent_id: 68 },
  { id: 105, name: "Design", parent_id: 100 },
  { id: 106, name: "Fashion & Beauty", parent_id: 100 },
  { id: 171, name: "Entrepreneurship", parent_id: 93 },
  { id: 97, name: "Management", parent_id: 93 },
  { id: 119, name: "Non-Profit", parent_id: 93 },
  { id: 133, name: "Comedy", parent_id: 67 },
  { id: 247, name: "Baseball", parent_id: 77 },
  { id: 256, name: "Soccer", parent_id: 77 },
  { id: 257, name: "Swimming", parent_id: 77 },
  { id: 178, name: "Courses", parent_id: 111 },
  { id: 128, name: "How To", parent_id: 111 },
  { id: 253, name: "Hockey", parent_id: 77 },
  { id: 259, name: "Volleyball", parent_id: 77 },
  { id: 260, name: "Wilderness", parent_id: 77 },
  { id: 117, name: "Government", parent_id: 67 },
  { id: 77, name: "Sports", parent_id: 67 },
  { id: 255, name: "Running", parent_id: 77 },
  { id: 91, name: "Alternative Health", parent_id: 88 },
  { id: 112, name: "Educational Technology", parent_id: 111 },
  { id: 213, name: "Daily News", parent_id: 99 },
  { id: 237, name: "Earth Sciences", parent_id: 107 },
  { id: 262, name: "After Shows", parent_id: 68 },
  { id: 263, name: "Film History", parent_id: 68 },
  { id: 132, name: "Kids & Family", parent_id: 67 },
  { id: 72, name: "Buddhism", parent_id: 69 },
  { id: 107, name: "Science", parent_id: 67 },
  { id: 248, name: "Basketball", parent_id: 77 },
  { id: 198, name: "Stories for Kids", parent_id: 132 },
  { id: 101, name: "Performing Arts", parent_id: 100 },
  { id: 94, name: "Careers", parent_id: 93 },
  { id: 200, name: "Animation & Manga", parent_id: 82 },
  { id: 221, name: "Astronomy", parent_id: 107 },
  { id: 242, name: "Physics", parent_id: 107 },
  { id: 108, name: "Social Sciences", parent_id: 107 },
  { id: 103, name: "Visual Arts", parent_id: 100 },
  { id: 208, name: "Music Commentary", parent_id: 134 },
  { id: 209, name: "Music History", parent_id: 134 },
  { id: 210, name: "Music Interviews", parent_id: 134 },
  { id: 95, name: "Business News", parent_id: 99 },
  { id: 122, name: "Society & Culture", parent_id: 67 },
  { id: 102, name: "Food", parent_id: 100 },
  { id: 93, name: "Business", parent_id: 67 },
  { id: 98, name: "Investing", parent_id: 93 },
  { id: 173, name: "Marketing", parent_id: 93 },
  { id: 125, name: "History", parent_id: 67 },
  { id: 204, name: "Games", parent_id: 82 },
  { id: 86, name: "Hobbies", parent_id: 82 },
  { id: 134, name: "Music", parent_id: 67 },
  { id: 214, name: "Entertainment News", parent_id: 99 },
  { id: 219, name: "Religion", parent_id: 69 },
  { id: 70, name: "Spirituality", parent_id: 69 },
  { id: 113, name: "Higher Education", parent_id: 111 },
  { id: 114, name: "K-12", parent_id: 111 },
  { id: 192, name: "Nutrition", parent_id: 88 },
  { id: 92, name: "Sexuality", parent_id: 88 },
  { id: 145, name: "Parenting", parent_id: 132 },
  { id: 82, name: "Leisure", parent_id: 67 },
  { id: 84, name: "Automotive", parent_id: 82 },
  { id: 203, name: "Crafts", parent_id: 82 },
  { id: 67, name: "Podcasts", parent_id: null },
  { id: 100, name: "Arts", parent_id: 67 },
  { id: 104, name: "Books", parent_id: 100 },
  { id: 176, name: "Improv", parent_id: 133 },
  { id: 177, name: "Stand-Up", parent_id: 133 },
  { id: 111, name: "Education", parent_id: 67 },
  { id: 168, name: "Fiction", parent_id: 67 },
  { id: 183, name: "Comedy Fiction", parent_id: 168 },
  { id: 184, name: "Drama", parent_id: 168 },
  { id: 258, name: "Tennis", parent_id: 77 },
  { id: 250, name: "Fantasy Sports", parent_id: 77 },
  { id: 251, name: "Football", parent_id: 77 },
  { id: 261, name: "Wrestling", parent_id: 77 },
  { id: 68, name: "TV & Film", parent_id: 67 },
  { id: 266, name: "TV Reviews", parent_id: 68 },
  { id: 127, name: "Technology", parent_id: 67 },
  { id: 135, name: "True Crime", parent_id: 67 },
  { id: 216, name: "Politics", parent_id: 99 },
  { id: 241, name: "Nature", parent_id: 107 },
  { id: 75, name: "Christianity", parent_id: 69 },
  { id: 76, name: "Hinduism", parent_id: 69 },
  { id: 73, name: "Judaism", parent_id: 69 },
  { id: 222, name: "Chemistry", parent_id: 107 },
  { id: 238, name: "Life Sciences", parent_id: 107 },
  { id: 239, name: "Mathematics", parent_id: 107 },
  { id: 110, name: "Natural Sciences", parent_id: 107 },
  { id: 123, name: "Places & Travel", parent_id: 122 },
  { id: 245, name: "Relationships", parent_id: 122 },
  { id: 249, name: "Cricket", parent_id: 77 },
  { id: 89, name: "Fitness", parent_id: 88 },
  { id: 190, name: "Medicine", parent_id: 88 },
  { id: 191, name: "Mental Health", parent_id: 88 },
  { id: 197, name: "Pets & Animals", parent_id: 132 },
  { id: 87, name: "Aviation", parent_id: 82 },
  { id: 206, name: "Home & Garden", parent_id: 82 },
  { id: 85, name: "Video Games", parent_id: 82 },
  { id: 99, name: "News", parent_id: 67 },
  { id: 126, name: "Philosophy", parent_id: 122 },
  { id: 71, name: "Islam", parent_id: 69 },
  { id: 141, name: "Golf", parent_id: 77 },
  { id: 130, name: "Gadgets", parent_id: 127 },
  { id: 129, name: "Podcasting", parent_id: 127 },
  { id: 96, name: "Shopping", parent_id: 93 }
];
var mockObj = {
  genres: mockGenres
};

mock
  .onGet("https://listen-api.listennotes.com/api/v2/genres")
  .reply(200, mockObj);

pod_api.genres = function(req, res) {
  axios
    .get("https://listen-api.listennotes.com/api/v2/genres", {
      headers: {
        "X-ListenAPI-Key": getKey
      },
      responseType: "json",
      timeout: 8000,
      validateStatus: function(status) {
        return status == 200;
      }
    })
    .then(function(_response) {
      res.status(200);
      res.json({
        success: _response.data.genres
      });
    })
    .catch(function(_error) {
      res.status(503);
      res.json({
        error: _error
      });
    });
};

module.exports = pod_api;
