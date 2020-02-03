<template>
  <main class="b_wrapper">
    <!-- # podcast intro # -->
    <div class="intro" v-if="compPodDetails">
      <div class="intro_img-wrap">
        <div class="intro_img-in">
          <img class="intro_img" v-bind:src="compPodDetails.image" alt="Featured image of podcast" aria-hidden="true" />
        </div>
      </div>
      <div class="intro_det">
        <h1 class="intro_title" v-if="compPodDetails.publisher">{{ compPodDetails.publisher }}</h1>
        <p class="intro_sum" v-if="compPodDetails.description">{{ compPodDetails.description }}</p>
        <p class="intro_more">
          <a
            class="intro_more-link"
            title="Link to external podcast site"
            target="_blank"
            v-if="compPodDetails.website"
            v-bind:href="compPodDetails.website"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M280 341.1l-1.2.1c-3.6.4-7 2-9.6 4.5l-64.6 64.6c-13.7 13.7-32 21.2-51.5 21.2s-37.8-7.5-51.5-21.2c-13.7-13.7-21.2-32-21.2-51.5s7.5-37.8 21.2-51.5l68.6-68.6c3.5-3.5 7.3-6.6 11.4-9.3 4.6-3 9.6-5.6 14.8-7.5 4.8-1.8 9.9-3 15-3.7 3.4-.5 6.9-.7 10.2-.7 1.4 0 2.8.1 4.6.2 17.7 1.1 34.4 8.6 46.8 21 7.7 7.7 13.6 17.1 17.1 27.3 2.8 8 11.2 12.5 19.3 10.1.1 0 .2-.1.3-.1.1 0 .2 0 .2-.1 8.1-2.5 12.8-11 10.5-19.1-4.4-15.6-12.2-28.7-24.6-41-15.6-15.6-35.9-25.8-57.6-29.3-1.9-.3-3.8-.6-5.7-.8-3.7-.4-7.4-.6-11.1-.6-2.6 0-5.2.1-7.7.3-5.4.4-10.8 1.2-16.2 2.5-1.1.2-2.1.5-3.2.8-6.7 1.8-13.3 4.2-19.5 7.3-10.3 5.1-19.6 11.7-27.7 19.9l-68.6 68.6C58.9 304.4 48 330.8 48 359c0 28.2 10.9 54.6 30.7 74.4C98.5 453.1 124.9 464 153 464c28.2 0 54.6-10.9 74.4-30.7l65.3-65.3c10.4-10.5 2-28.3-12.7-26.9z"
              />
              <path
                d="M433.3 78.7C413.5 58.9 387.1 48 359 48s-54.6 10.9-74.4 30.7l-63.7 63.7c-9.7 9.7-3.6 26.3 10.1 27.4 4.7.4 9.3-1.3 12.7-4.6l63.8-63.6c13.7-13.7 32-21.2 51.5-21.2s37.8 7.5 51.5 21.2c13.7 13.7 21.2 32 21.2 51.5s-7.5 37.8-21.2 51.5l-68.6 68.6c-3.5 3.5-7.3 6.6-11.4 9.3-4.6 3-9.6 5.6-14.8 7.5-4.8 1.8-9.9 3-15 3.7-3.4.5-6.9.7-10.2.7-1.4 0-2.9-.1-4.6-.2-17.7-1.1-34.4-8.6-46.8-21-7.3-7.3-12.8-16-16.4-25.5-2.9-7.7-11.1-11.9-19.1-9.8-8.9 2.3-14.1 11.7-11.3 20.5 4.5 14 12.1 25.9 23.7 37.5l.2.2c16.9 16.9 39.4 27.6 63.3 30.1 3.7.4 7.4.6 11.1.6 2.6 0 5.2-.1 7.8-.3 6.5-.5 13-1.6 19.3-3.2 6.7-1.8 13.3-4.2 19.5-7.3 10.3-5.1 19.6-11.7 27.7-19.9l68.6-68.6c19.8-19.8 30.7-46.2 30.7-74.4s-11.1-54.6-30.9-74.4z"
              />
            </svg>
            <span class="intro_more-link-label">Web</span>
          </a>
        </p>
      </div>
    </div>
    <!-- /end # podcast intro # -->
    <!-- # podcast episodes # -->
    <div class="eps" v-if="compPodResults && compPodResults.length">
      <div v-for="result in compPodResults" v-bind:key="result._customRequestTime">
        <div v-if="result.episodes && result.episodes.length">
          <!-- episode -->
          <div class="ep" v-for="ep in result.episodes" v-bind:key="ep.id" tabindex="0">
            <div class="ep_sum">
              <h3 class="ep_title">{{ ep.title || '' }}</h3>
              <p class="ep_desc" v-if="ep.description">
                <span v-html="methLimitStringLength(metHtmlCleanToText(ep.description), 200)"></span>
              </p>
            </div>
            <div class="ep_date">
              <span v-if="ep.pub_date_ms" v-html="methDatePrettyPrint(ep.pub_date_ms)"></span>
            </div>
            <div class="ep_play">
              <button
                class="ep_play-btn"
                v-on:click="metToggleAudio($event, ep, true)"
                v-bind:style="{ 'background-image': ep.thumbnail ? 'url(' + ep.thumbnail + ')' : '' }"
              >
                <span class="ep_play-btn-in">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm83.8 211.9l-137.2 83c-2.9 1.8-6.7-.4-6.7-3.9V173c0-3.5 3.7-5.7 6.7-3.9l137.2 83c2.9 1.7 2.9 6.1 0 7.8z"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <!-- /end episode -->
        </div>
      </div>
    </div>
    <!-- # /end podcast episodes # -->
  </main>
</template>

<script>
import PodCarousel from '../PodCarousel.vue';
import BaseAudio from '../base/BaseAudio.vue';
import Axios from 'axios';

var mockData = {
  id: 'ecdf29d1d03c48e693189e220947587e',
  title: 'Best Of Friends Podcast',
  publisher: 'Best Of Friends Podcast',
  image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
  thumbnail: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
  listennotes_url: 'https://www.listennotes.com/c/ecdf29d1d03c48e693189e220947587e/',
  total_episodes: 190,
  explicit_content: false,
  description:
    'Best Of Friends is a weekly podcast in which Erin Mallory Long and Jamie Woodham hilariously guide you through every episode of Friends from beginning to end.',
  itunes_id: 952471642,
  rss: 'https://www.listennotes.com/c/r/ecdf29d1d03c48e693189e220947587e',
  latest_pub_date_ms: 1575170539000,
  earliest_pub_date_ms: 1419397200186,
  language: 'English',
  country: 'United States',
  website:
    'https://www.spreaker.com/show/best-of-friends?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
  extra: {
    twitter_handle: '',
    facebook_handle: '',
    instagram_handle: '',
    wechat_handle: '',
    patreon_handle: '',
    youtube_url: '',
    linkedin_url: '',
    spotify_url: '',
    google_url: '',
    url1: '',
    url2: '',
    url3: ''
  },
  is_claimed: false,
  email: 'feeds@spreaker.com',
  looking_for: {
    sponsors: false,
    guests: false,
    cohosts: false,
    cross_promotion: false
  },
  genre_ids: [68, 67, 133],
  episodes: [
    {
      id: '894576e2f8d54ddbadd831fb3eff8ff3',
      title: 'Episode 189: The One With Friendsgiving Past',
      description:
        'The one where Erin and Jamie are both on a much-needed Thanksgiving vacation, so we\'re throwing it back to yet another BOF classic! Check out the original episode description below:<br /><br />The one where Erin and Jamie discuss all 10 (or only 9, depending who you ask) Thanksgiving episodes of Friends. You\'ll find out which Britney Spears music videos have aged the best, you\'ll hear our definitive ranking of this week\'s titular episodes, and you\'ll join us in taking a well-deserved break from the twisted and tiresome world of Joey! Does everyone have whatever kind of potatoes they want? Good. Now kick back, relax, and put a turkey on your head -- it\'s Friendsgiving, y\'all!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />Support us on Patreon at <a href="http://www.patreon.com/bofpodcast">www.patreon.com/bofpodcast</a><br /><br />And if you love Riverdale as much as BOF does, you can use the code "ERIN15" for 15% off at <a href="http://www.bettyandveronica.com">www.bettyandveronica.com</a>',
      pub_date_ms: 1575170539000,
      audio: 'https://www.listennotes.com/e/p/894576e2f8d54ddbadd831fb3eff8ff3/',
      audio_length_sec: 5297,
      listennotes_url: 'https://www.listennotes.com/e/894576e2f8d54ddbadd831fb3eff8ff3/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/894576e2f8d54ddbadd831fb3eff8ff3/#edit',
      explicit_content: false
    },
    {
      id: '53280be9d84b4b01ad1690f05b3d4669',
      title: 'Episode 188: The One With Friends+ Max',
      description:
        'The one where Erin and Jamie discuss episode 02x05 (TOW Five Steaks & An Eggplant) of Friends. You’ll learn what we think of all the hottest new streaming services, you\'ll find out the most painful way to destroy the Central Perk LEGO set, and you\'ll join us in stressing over the social politics that come into play as soon as the check arrives! There\'s only one week left until Friendsgiving, so pop those multiple kinds of potatoes cooking and pop those raw turkeys on your head. Let\'s get floopy, y\'all!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1574366523000,
      audio: 'https://www.listennotes.com/e/p/53280be9d84b4b01ad1690f05b3d4669/',
      audio_length_sec: 2830,
      listennotes_url: 'https://www.listennotes.com/e/53280be9d84b4b01ad1690f05b3d4669/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/53280be9d84b4b01ad1690f05b3d4669/#edit',
      explicit_content: false
    },
    {
      id: '43bfb5a53f7440bda015d54d1809e0d7',
      title: 'Episode 187: The One With The Pregnancy Brain',
      description:
        'The one where Erin and Jamie discuss episode 02x04 (TOW Phoebe\'s Husband) of Friends. You’ll find out which piece of brick-based merchandise we finally got our hands on, you\'ll hear why we\'re both running a little slow these days, and you\'ll join us in continuing onward through the golden age of everyone\'s favorite sitcom! Daylight Savings Time is officially over, so enjoy the early darkness and kick back with a relaxing podcast. This one, preferably. Let\'s get floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1572912740000,
      audio: 'https://www.listennotes.com/e/p/43bfb5a53f7440bda015d54d1809e0d7/',
      audio_length_sec: 2952,
      listennotes_url: 'https://www.listennotes.com/e/43bfb5a53f7440bda015d54d1809e0d7/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/43bfb5a53f7440bda015d54d1809e0d7/#edit',
      explicit_content: false
    },
    {
      id: '149a3efb9e214e37a04980a28219a8a1',
      title: 'Episode 186: The One With Mr. Heckles... Again!',
      description:
        'The one where Erin and Jamie throw it back to a BOF classic! Whether you caught this one the first time around or not, you\'re in for a treat. Check out the original episode description below:<br /><br />Krista, Erin, and Jamie don\'t discuss any episodes and instead interview a fan favorite from the Friends universe: LARRY HANKIN, a.k.a. MR. HECKLES! You\'ll hear about Larry\'s experience working on the first three seasons of Friends and you\'ll be mesmerized by his fantastic stories that touch on everything from Seinfeld to Breaking Bad to Clint Eastwood. If you\'re making too much noise right now, you better quiet down and press play, because Mr. Heckles has arrived!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1571971848000,
      audio: 'https://www.listennotes.com/e/p/149a3efb9e214e37a04980a28219a8a1/',
      audio_length_sec: 4874,
      listennotes_url: 'https://www.listennotes.com/e/149a3efb9e214e37a04980a28219a8a1/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/149a3efb9e214e37a04980a28219a8a1/#edit',
      explicit_content: false
    },
    {
      id: 'fe364ae89c504321a2de98462a80e00b',
      title: "Episode 185: The One Where We're All Over The Place",
      description:
        'The one where Erin and Jamie discuss episode 02x03 (TOW Heckles Dies) of Friends. You’ll hear the official pitch for the film adaptation of the BOF story, you\'ll find out just how cranky we are now that we\'re olds, and you\'ll join us in trying something a little different this week! Does everyone have their dial-in codes? Good, because the conference call is about to commence. Let\'s do this, Friendlings. Let\'s get floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1571352058001,
      audio: 'https://www.listennotes.com/e/p/fe364ae89c504321a2de98462a80e00b/',
      audio_length_sec: 3391,
      listennotes_url: 'https://www.listennotes.com/e/fe364ae89c504321a2de98462a80e00b/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/fe364ae89c504321a2de98462a80e00b/#edit',
      explicit_content: false
    },
    {
      id: 'd594edaa48be4159925cc29667510ea2',
      title: 'Episode 184: The One With All The Baby Talk',
      description:
        'The one where Erin and Jamie discuss episode 02x02 (TOW The Breast Milk) of Friends. You’ll hear all about Erin\'s exciting new announcement, you\'ll find out why Jamie\'s wedding is going to be even more on-brand than expected, and you\'ll join us in not thinking about pregnancy *too* too much lest we all get freaked out! Strap in, Friendlings — it\'s about to get floopy.<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1570662276002,
      audio: 'https://www.listennotes.com/e/p/d594edaa48be4159925cc29667510ea2/',
      audio_length_sec: 3128,
      listennotes_url: 'https://www.listennotes.com/e/d594edaa48be4159925cc29667510ea2/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/d594edaa48be4159925cc29667510ea2/#edit',
      explicit_content: false
    },
    {
      id: 'ee362f7b30294442bb033aab018f90e6',
      title: "Episode 183: The One With Erin's New Old Boyfriend",
      description:
        'The one where Erin and Jamie discuss episode 02x01 (TOW Ross\' New Girlfriend) of Friends. You’ll find out which pieces of pop culture we\'re both currently obsessed with, you\'ll hear our A+ better-than-anyone-else\'s pitch for a hypothetical Friequel series, and you\'ll join us in embarking on our latest and greatest collective adventure — season two... again! But enough of the small talk, Friendlings. What do you say we get this show on the road? Let\'s! Get! Floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1570061841003,
      audio: 'https://www.listennotes.com/e/p/ee362f7b30294442bb033aab018f90e6/',
      audio_length_sec: 3143,
      listennotes_url: 'https://www.listennotes.com/e/ee362f7b30294442bb033aab018f90e6/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/ee362f7b30294442bb033aab018f90e6/#edit',
      explicit_content: false
    },
    {
      id: '51ab98c3fbe84c40aa164c14ffdc5b34',
      title: 'Episode 182: The One Where Jamie Takes The Fall',
      description:
        'The one where Erin and Jamie discuss episode 01x24 (TOW Rachel Finds Out) of Friends. You’ll hear about all the finest pumpkin-flavored things that the autumn season has to offer, you\'ll find out exactly how to find the person you should be with (according to us, at least), and you\'ll join us in bidding the fondest of farewells to season one of everyone\'s favorite sitcom! Do you feel that, Friendlings? The temperature is dropping... the leaves are changing... the season is falling... you know, because it\'s fall now. Wrap yourself up in your coziest blanket and press that play button, y\'all. It\'s time to get floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1569434897004,
      audio: 'https://www.listennotes.com/e/p/51ab98c3fbe84c40aa164c14ffdc5b34/',
      audio_length_sec: 3375,
      listennotes_url: 'https://www.listennotes.com/e/51ab98c3fbe84c40aa164c14ffdc5b34/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/51ab98c3fbe84c40aa164c14ffdc5b34/#edit',
      explicit_content: false
    },
    {
      id: '74d452838d7344818a76aab8bbbc9d8c',
      title: 'Episode 181: The One With The Friendliest Place On Earth',
      description:
        'The one where Erin and Jamie discuss episode 01x23 (TOW The Birth) of Friends. You’ll learn which theme park provides you with the best odds of spotting us in the wild, you\'ll find out what show we\'re each currently binging, and you\'ll hear the latest developments in the Greenwich Ripper case — particularly as they pertain to the killer\'s own son! In the immortal words of the Jock Jams pump-up classic... y\'all ready for this? Good, that\'s what I thought. Let\'s get floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1568845810005,
      audio: 'https://www.listennotes.com/e/p/74d452838d7344818a76aab8bbbc9d8c/',
      audio_length_sec: 2671,
      listennotes_url: 'https://www.listennotes.com/e/74d452838d7344818a76aab8bbbc9d8c/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/74d452838d7344818a76aab8bbbc9d8c/#edit',
      explicit_content: false
    },
    {
      id: '5adc1528202e4b0eb7e99fd4871e94da',
      title: 'Episode 180: The One With Scotland Yard',
      description:
        'The one where Erin and Jamie discuss episode 01x22 (TOW The Ick Factor) of Friends. You’ll learn how to properly name your future children, you\'ll hear why everyone deserves their own pseudonym, and you\'ll find out how the biggest conspiracy in the history of situational comedy has now gone international! Time is of the essence, Friendlings. Let\'s do this. Let\'s get floopy!<br /><br />Best Of Friends Podcast<br />P.O. Box 421605<br />Los Angeles, CA 90042<br /><br />PATREON: <a href="http://patreon.com/bofpodcast">http://patreon.com/bofpodcast</a><br /><br />BOF MERCH: <a href="http://shrsl.com/?hcgd">http://shrsl.com/?hcgd</a><br /><br />SPONSOR INFO: Use our #FabFitFunPartner code "BOF" at <a href="http://fabfitfun.com">http://fabfitfun.com</a>',
      pub_date_ms: 1567821394006,
      audio: 'https://www.listennotes.com/e/p/5adc1528202e4b0eb7e99fd4871e94da/',
      audio_length_sec: 3032,
      listennotes_url: 'https://www.listennotes.com/e/5adc1528202e4b0eb7e99fd4871e94da/',
      image: 'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      thumbnail:
        'https://cdn-images-1.listennotes.com/podcasts/best-of-friends-podcast-best-of-friends-IcZVnRyoX2B.300x300.jpg',
      maybe_audio_invalid: false,
      listennotes_edit_url: 'https://www.listennotes.com/e/5adc1528202e4b0eb7e99fd4871e94da/#edit',
      explicit_content: false
    }
  ],
  next_episode_pub_date: 1567821394006
};

export default {
  name: 'PagePodcast',
  props: ['routeID'],
  components: {
    PodCarousel: PodCarousel
  },
  data: function() {
    return {
      /*
        Request Options:
        used as params in request,
        to not include in request, if no value, set null as default value
      */
      dataRequestOpt: {
        next_episode_pub_date: { val: null, default: null },
        sort: { val: 'recent_first', default: 'recent_first' }
      },
      /*
        Podcast Details:
        populated and returned by computed based on result data
      */
      dataPodDetails: {},
      /*
        Podcast data results:
        raw, unformatted; used by computed for formatting, filtering, etc...
      */
      dataPodResults: []
    };
  },
  computed: {
    /*
        ID:
        unique for each podcast; passed from router;
      */
    dataPodID() {
      return this.routeID;
    },
    /*
      Podcast Details:
      used by computed for lead feature display of podcast info;
      any podcast result contains all the information necessary to display intro podcast details section
    */
    compPodDetails() {
      var dataPodID = this.dataPodID;
      var dataPodDetails = this.dataPodDetails;
      var dataPodResults = this.dataPodResults;
      var dataPodResultsItem = this.dataPodResults.find((val) => val.id == dataPodID) || {};

      if (dataPodResultsItem.id && dataPodResultsItem.id == dataPodID) {
        this.dataPodDetails = dataPodResultsItem;
      } else {
        this.dataPodDetails = {};
      }
      return this.dataPodDetails;
    },
    compPodResults() {
      // const self = this;
      // const finalData = [];
      // const filterData = [];
      // const dataPodID = this.dataPodID;
      const dataPodResults = this.dataPodResults;
      // const dataPodOptions = this.dataPodOptions;
      return dataPodResults || [];
    }
  },
  watch: {
    dataPodID: {
      handler: function(newVal, oldVal) {
        if (!newVal || (newVal && newVal != oldVal)) {
          this.metPageChange();
        }
      },
      immediate: true
    }
  },
  methods: {
    metPageChange: function() {
      this.metClearDataResults();
      this.metPodGetData();
    },
    metClearDataResults: function() {
      this.dataPodResults = [];
    },
    /*
      Sort podcasts by newest or oldest:
      note: due to the api data structure, need to clear data completely and run new request
      @param {string} - sortValue
        "recent_first"; or "oldest_first"
    */
    metPodSort: function(sortValue) {
      if (sortValue) {
        this.$set(this.dataPodDetails.sort, 'val', sortValue);
      }
      this.metClearDataResults();
      this.metPodGetData();
    },
    metFilterPodData: function(val, index, arr) {
      if (val.id && val.id == this.dataPodID) {
        return true;
      }
      return false;
    },
    metHtmlCleanToText: function(getHtmlStr) {
      var temp = new DOMParser().parseFromString(getHtmlStr, 'text/html');
      return temp.body.textContent || '';
    },
    methLimitStringLength: function(_getString, _length) {
      let getString = _getString || '';
      return getString.slice(0, _length + 1) + '...';
    },
    methDatePrettyPrint: function(_getTime) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const dateObj = new Date(_getTime);
      let dateText = '';
      if (_getTime) {
        dateText += monthNames[dateObj.getMonth()];
        dateText += ' ' + dateObj.getDate() + ',' + ' ';
        dateText += dateObj.getFullYear();
      }
      return dateText;
    },
    /**
     *
     * Click play/pause button:
     * dispatches to $store:
     * - toggles play state
     * - if newly-played, adds podcast data to current podcast playing
     *
     */
    metToggleAudio: function(event, _ep, _setPlayState) {
      this.$store.dispatch('podAudio/actPlayToggle', _setPlayState);
      this.$store.dispatch('podAudio/actPlayPodcast', _ep);
    },
    metPodGetData: function() {
      var self = this;
      let requestParams = {};

      Object.keys(self.dataRequestOpt).forEach((_val, _index, _arr) => {
        if (self.dataRequestOpt[_val].val != null) {
          requestParams[_val] = self.dataRequestOpt[_val].val;
        } else if (self.dataRequestOpt[_val].default != null) {
          requestParams[_val] = self.dataRequestOpt[_val].val;
        }
      });

      let customProps = {
        _customRequestTime: new Date().getTime()
      };

      function runRequest() {
        // Axios.get("/api/podcast/" + self.dataPodID, {
        //   params: requestParams
        // })
        //   .then(function(response) {
        //     console.log(response);
        //     let finalData = Object.assign(response.data.success, customProps);
        //     self.dataPodResults.push(finalData);
        //   })
        //   .catch(function(err) {
        //     console.log(err);
        //   });

        var x = Object.assign(mockData, customProps);
        self.dataPodResults.push(mockData);
      }
      runRequest();
    }
  },

  // compPodDetails() {
  //   // const detailImage = ;

  //   return {};
  // },
  // compPodResults() {
  //   const self = this;
  //   const finalData = [];
  //   const filterData = [];
  //   const dataPodID = this.dataPodID;
  //   const dataPodResults = this.dataPodResults;
  //   const dataPodOptions = this.dataPodOptions;
  //   /*
  //     Filters
  //   */
  //   function filterPodDiffID(val, index, array) {
  //     if (val.id && val.id == dataPodID) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   function filterPodDiffOptions(val, index, array) {
  //     var isValid = true;
  //     Object.keys(dataPodOptions).forEach(optionProp => {
  //       var hasPassed = val.hasOwnProperty(optionProp) && val[optionProp] == dataPodOptions[optionProp];
  //       if (!hasPassed) {
  //         isValid = false;
  //       }
  //     });
  //     return isValid;
  //   }
  //   filterData = dataPodResults.filter((val, index, array) => {
  //     return filterPodDiffID(val, index, array) && filterPodDiffOptions(val, index, array);
  //   });
  //   /*
  //     Sorting
  //   */
  //   function sortRecentFirst(valA, valB) {
  //     // if (valA.latest_pub_date_ms)
  //   }
  //   filterData = filterData.sort(sortRecentFirst);
  //   // filterData = filterData.sort((val, index, arr) => {});
  // }

  created: function() {},
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
svg {
  fill: #fff;
}

/**
 *
 * Intro section
 *
 */
/*
  intro image and description
 */
.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.intro_img-wrap {
  padding: 15px;
  width: 100%;
  max-width: 300px;
}
.intro_img-in {
  position: relative;
  width: 100%;
  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
}
.intro_img {
  position: absolute;
  width: 100%;
  max-width: 100%;
  display: block;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.intro_det {
  padding: 15px;
  flex: 1;

  @media all and (max-width: 767px) {
    width: 100%;
    flex-basis: 100%;
  }
}
.intro_title {
  padding-top: 0;
  font-size: 1.5rem;
  font-weight: normal;
}
.intro_sum {
  max-width: 60em;
}
/* 
  additional links section 
*/
.intro_more {
  display: flex;
}
.intro_more-link {
  display: inline-flex;
  align-items: center;
  padding-right: 10px;
}
.intro_more-link-label {
  display: inline-block;
  padding-left: 5px;
  font-size: 0.8rem;
}
.intro_more svg {
  width: 25px;
  height: 25px;
}
/**
 *
 * Episode Cards
 *
 */
.ep {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 30px 0;
  padding: 30px;
  background: darken(#111523, 2%);
}

.ep_sum {
  width: 100%;
}

.ep_title,
.ep_desc {
  padding-top: 0;
  padding-bottom: 5px;
}
.ep_title {
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 5px;
}
.ep_desc {
  font-size: 0.85rem;
}
.ep_play {
  display: inline-flex;
}
.ep_play-btn {
  position: relative;
  width: 60px;
  height: 60px;
  padding: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  /* reset button styles */
  appearance: none;
  border: none;

  svg {
    fill: #fff;
    width: 45px;
    height: auto;
  }
}
.ep_date {
  font-size: 0.85rem;
}
.ep_play-btn-in {
  display: flex;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  align-items: stretch;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media all and (min-width: 650px) {
  .ep_sum {
    width: 60%;
  }
}
</style>
