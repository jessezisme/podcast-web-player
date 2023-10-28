import * as SearchTypes from '~/shared/podcast/api/types/search-get';
import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';

export default defineEventHandler(async (event) => {
  const { ApiKeyListenNotes } = useRuntimeConfig();
  const eventQuery = getQuery(event);
  let apiError;

  const handleError = (err: any) => {
    apiError = {
      statusCode: err.statusCode || 500,
      statusMessage: 'An error occurred while retrieving data.',
      data: err.data,
    };
    setResponseStatus(event, apiError.statusCode);
  };

  const apiResponse = await $fetch('https://listen-api.listennotes.com/api/v2/search', {
    headers: {
      'X-ListenAPI-Key': ApiKeyListenNotes,
    },
    query: eventQuery || {},
  }).catch(handleError);

  if (apiError) {
    return apiError;
  }
  if (eventQuery.type === 'podcast') {
    return new PodcastDataModel().formatSearchPodcastData(apiResponse as SearchTypes.ServerResponsePodcastRaw);
  }
  if (eventQuery.type === 'episode') {
    return new PodcastDataModel().formatSearchEpisodeData(apiResponse as SearchTypes.ServerResponseEpisodeRaw);
  }
  setResponseStatus(event, 400);
  return {
    statusCode: 400,
    statusMessage: 'An error occurred while retrieving data.',
  };

  /*
    const getQuery = event.context.query?.type;

  if (getQuery === 'podcast') {
    return new PodcastDataModel().formatSearchPodcastData({ ...mockSearchPodcast });
  } else {
    return new PodcastDataModel().formatSearchEpisodeData({ ...mockSearchEpisode });
  }
  */
});

const mockSearchPodcast: SearchTypes.ServerResponsePodcastRaw = {
  count: 10,
  next_offset: 10,
  total: 91,
  took: 0.13,
  results: [
    {
      rss: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      description_highlighted:
        '...This Week in <span class="ln-search-highlight">Star…n class="ln-search-highlight">Wars</span> Universe....',
      description_original:
        "This Week in Star Wars is the web's only weekly podcast …WISW archive, and many can be found on our YouTube page.",
      title_highlighted:
        'This Week in <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      title_original: 'This Week in Star Wars',
      publisher_highlighted: 'Matthew Fox',
      publisher_original: 'Matthew Fox',
      image: 'https://production.listennotes.com/podcasts/this-week-in-star-wars-matthew-fox-u4Xd3g78vUw.300x300.jpg',
      thumbnail: 'https://production.listennotes.com/podcasts/this-week-in-star-wars-matthew-fox-u4Xd3g78vUw.300x300.jpg',
      itunes_id: 356323969,
      latest_episode_id:
        'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      latest_pub_date_ms: 1564367972000,
      earliest_pub_date_ms: 1416343945000,
      id: '04a1e66862f9456b8c59f34080fe3964',
      genre_ids: [68],
      listennotes_url: 'https://www.listennotes.com/c/04a1e66862f9456b8c59f34080fe3964/',
      total_episodes: 84,
      audio_length_sec: 1132,
      update_frequency_hours: 749,
      email: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      explicit_content: false,
      website:
        'http://www.thisweekinstarwars.com/TWISW/Episodes/Episode…ennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      listen_score: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      listen_score_global_rank:
        'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
    },
    {
      rss: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      description_highlighted:
        '...This Week in <span class="ln-search-highlight">Star…n class="ln-search-highlight">Wars</span> Universe....',
      description_original:
        "This Week in Star Wars is the web's only weekly podcast …WISW archive, and many can be found on our YouTube page.",
      title_highlighted:
        'This Week in <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      title_original: 'This Week in Star Wars',
      publisher_highlighted: 'Matthew Fox',
      publisher_original: 'Matthew Fox',
      image: 'https://production.listennotes.com/podcasts/this-week-in-star-wars-matthew-fox-u4Xd3g78vUw.300x300.jpg',
      thumbnail: 'https://production.listennotes.com/podcasts/this-week-in-star-wars-matthew-fox-u4Xd3g78vUw.300x300.jpg',
      itunes_id: 356323969,
      latest_episode_id:
        'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      latest_pub_date_ms: 1564367972000,
      earliest_pub_date_ms: 1416343945000,
      id: '04a1e66862f9456b8c59f34080fe3964',
      genre_ids: [68],
      listennotes_url: 'https://www.listennotes.com/c/04a1e66862f9456b8c59f34080fe3964/',
      total_episodes: 84,
      audio_length_sec: 1132,
      update_frequency_hours: 749,
      email: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      explicit_content: false,
      website:
        'http://www.thisweekinstarwars.com/TWISW/Episodes/Episode…ennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      listen_score: 'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
      listen_score_global_rank:
        'Please upgrade to PRO or ENTERPRISE plan to see this field. Learn more: listennotes.com/api/pricing',
    },
  ],
};

const mockSearchEpisode: SearchTypes.ServerResponseEpisodeRaw = {
  took: 0.415,
  count: 10,
  total: 8986,
  results: [
    {
      id: 'a5ae21acf75a43538b635cf6b089f0b3',
      rss: 'http://feeds.feedburner.com/FramesPerSecondPodcast',
      link: 'https://megaphone.link/STU5698215144?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/a5ae21acf75a43538b635cf6b089f0b3/',
      image: 'https://production.listennotes.com/podcasts/frames-per-second-studio71-Tk47uwatlcN-J_3zM-VyFvj.1400x1400.jpg',
      podcast: {
        id: '88c28bd52e32422c8f3a71fab45aa77f',
        image:
          'https://production.listennotes.com/podcasts/frames-per-second-studio71-Tk47uwatlcN-J_3zM-VyFvj.1400x1400.jpg',
        genre_ids: [68],
        thumbnail:
          'https://production.listennotes.com/podcasts/frames-per-second-studio71-nFjw84GgN7c-J_3zM-VyFvj.300x300.jpg',
        listen_score: 49,
        title_original: 'Frames Per Second',
        listennotes_url: 'https://www.listennotes.com/c/88c28bd52e32422c8f3a71fab45aa77f/',
        title_highlighted: 'Frames Per Second',
        publisher_original: 'Studio71',
        publisher_highlighted: 'Studio71',
        listen_score_global_rank: '0.5%',
      },
      itunes_id: 1453571424,
      thumbnail:
        'https://production.listennotes.com/podcasts/frames-per-second-studio71-nFjw84GgN7c-J_3zM-VyFvj.300x300.jpg',
      pub_date_ms: 1576544400542,
      guid_from_rss: '90b15eb4-1fae-11ea-9f65-17cad885ccc2',
      title_original: 'Is Star Wars Overrated?',
      listennotes_url: 'https://www.listennotes.com/e/a5ae21acf75a43538b635cf6b089f0b3/',
      audio_length_sec: 778,
      explicit_content: true,
      title_highlighted:
        'Is <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Overrated?',
      description_original:
        '<p>In this episode, we discuss whether or not Star Wars is overrated. Let us know your thoughts. </p><p> </p><p>Learn more about your ad choices. Visit <a href="https://megaphone.fm/adchoices">megaphone.fm/adchoices</a></p>',
      description_highlighted:
        '...In this episode, we discuss whether or not <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> is overrated. Let us know your thoughts. \n \nLearn more about your ad choices. Visit megaphone.fm/adchoices...',
      transcripts_highlighted: [],
    },
    {
      id: '42b1898db6a84973b41879618002937b',
      rss: 'https://feeds.libsyn.com/125567/rss',
      link: 'https://www.vintagerpg.com/2019/12/star-wars-galaxy-guides/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/42b1898db6a84973b41879618002937b/',
      image:
        'https://production.listennotes.com/podcasts/the-vintage-rpg-podcast-vintage-rpg-aPsHYKgykCR-eq8uGUY6vXN.1400x1400.jpg',
      podcast: {
        id: 'f3094a0b14684300a3d6b69a1063e708',
        image:
          'https://production.listennotes.com/podcasts/the-vintage-rpg-podcast-vintage-rpg-aPsHYKgykCR-eq8uGUY6vXN.1400x1400.jpg',
        genre_ids: [83, 85, 82],
        thumbnail:
          'https://production.listennotes.com/podcasts/the-vintage-rpg-podcast-vintage-rpg-03VBIC7U68Y-eq8uGUY6vXN.300x300.jpg',
        listen_score: 47,
        title_original: 'The Vintage RPG Podcast',
        listennotes_url: 'https://www.listennotes.com/c/f3094a0b14684300a3d6b69a1063e708/',
        title_highlighted: 'The Vintage RPG Podcast',
        publisher_original: 'Vintage RPG',
        publisher_highlighted: 'Vintage RPG',
        listen_score_global_rank: '1%',
      },
      itunes_id: 1409477830,
      thumbnail:
        'https://production.listennotes.com/podcasts/the-vintage-rpg-podcast-vintage-rpg-03VBIC7U68Y-eq8uGUY6vXN.300x300.jpg',
      pub_date_ms: 1575867600184,
      guid_from_rss: '9861105d-bf98-4684-871a-5cbe11484159',
      title_original: 'Star Wars Galaxy Guides',
      listennotes_url: 'https://www.listennotes.com/e/42b1898db6a84973b41879618002937b/',
      audio_length_sec: 1519,
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Galaxy Guides',
      description_original:
        '<p>Because Star Wars is hitting the critical mass point for 2019, we figured we’d add to the fun with an episode that looks at the Galaxy Guides series of sourcebooks for the West End Games Star Wars Role Playing Game. We take a quick tour through each of the twelve volumes and chat about what they added to the RPG experience and how they formed the backbone of the greater Star Wars Expanded Universe.</p>',
      description_highlighted:
        '...Because <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> is hitting the critical mass point for 2019, we figured we’d add to the fun with an episode that looks at the Galaxy Guides series of sourcebooks for the West End Games <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Role...',
      transcripts_highlighted: [],
    },
    {
      id: 'ea09b575d07341599d8d5b71f205517b',
      rss: 'https://theroughcut.libsyn.com/rss',
      link: 'http://theroughcutpod.com/?p=786&utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/ea09b575d07341599d8d5b71f205517b/',
      image: 'https://production.listennotes.com/podcasts/the-rough-cut-matt-feury-YMha8DxnUbc-53MLh7NpAwm.1400x1400.jpg',
      podcast: {
        id: '8758da9be6c8452884a8cab6373b007c',
        image: 'https://production.listennotes.com/podcasts/the-rough-cut-matt-feury-YMha8DxnUbc-53MLh7NpAwm.1400x1400.jpg',
        genre_ids: [264, 68],
        thumbnail:
          'https://production.listennotes.com/podcasts/the-rough-cut-matt-feury-DEkF_8ybj6A-53MLh7NpAwm.300x300.jpg',
        listen_score: 40,
        title_original: 'The Rough Cut',
        listennotes_url: 'https://www.listennotes.com/c/8758da9be6c8452884a8cab6373b007c/',
        title_highlighted: 'The Rough Cut',
        publisher_original: 'Matt Feury',
        publisher_highlighted: 'Matt Feury',
        listen_score_global_rank: '2%',
      },
      itunes_id: 1471556007,
      thumbnail: 'https://production.listennotes.com/podcasts/the-rough-cut-matt-feury-DEkF_8ybj6A-53MLh7NpAwm.300x300.jpg',
      pub_date_ms: 1579507216188,
      guid_from_rss: '004f03c8-cdf9-4ff5-9d89-b2147f8d55cf',
      title_original: 'Star Wars - The Force Awakens',
      listennotes_url: 'https://www.listennotes.com/e/ea09b575d07341599d8d5b71f205517b/',
      audio_length_sec: 1694,
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> - The Force Awakens',
      description_original:
        '<p>In this episode of The Rough Cut we close out our study of the final Skywalker trilogy with a look back on the film that helped the dormant franchise make the jump to lightspeed, <a href="https://www.imdb.com/title/tt2488496/">Episode VII - The Force Awakens</a>.  Recorded in Amsterdam in front of a festival audience in 2018, editor <a href="https://www.imdb.com/name/nm0104783/?ref_=nv_sr_srsg_0">Maryann Brandon ACE</a> recounts her work on <em>The Force Awakens</em> just as she was about to begin editing what would come to be known as <a href="https://www.imdb.com/title/tt2527338/?ref_=nm_flmg_edt_1">Episode IX - The Rise of Skywalker</a>.</p> <p> </p> <p>Go back to the beginning and listen to our <a href="http://theroughcutpod.com/paul-hirsch/">podcast with Star Wars and \'Empire\' editor, Paul Hirsch</a>.</p> <p>Hear editor Bob Ducsay talk about cutting <a href="http://theroughcutpod.com/last-jedi/">The Last Jedi</a>.</p> <p>Listen to Maryann Brandon talk about her work on <a href="http://theroughcutpod.com/star-wars/">The Rise of Skywalker</a>.</p> <p>Get your hands on the non-linear editor behind the latest Skywalker trilogy,  <a href="https://www.avid.com/video-editor-right-for-you">Avid Media Composer!</a></p> <p><a href="http://theroughcutpod.com/subscribe/">Subscribe to The Rough Cut</a> for more great interviews with the heroes of the editing room!</p> <p> </p> <p> </p>',
      description_highlighted:
        '...Go back to the beginning and listen to our podcast with <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> and \'Empire\' editor, Paul Hirsch. \nHear editor Bob Ducsay talk about cutting The Last Jedi....',
      transcripts_highlighted: [],
    },
    {
      id: 'c877bf360bda4c74adea2ba066df6929',
      rss: 'https://feeds.megaphone.fm/ROOSTER7199250968',
      link: 'https://supercarlinbrothers.libsyn.com/star-wars-theory-the-great-star-wars-ice-cream-conspiracy?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/c877bf360bda4c74adea2ba066df6929/',
      image:
        'https://production.listennotes.com/podcasts/super-carlin-brothers-j-and-ben-carlin-biwhM2N35Rj-BodDr7iIAR3.1400x1400.jpg',
      podcast: {
        id: '8bdbb906eef04e5d8b391e947998e9af',
        image:
          'https://production.listennotes.com/podcasts/super-carlin-brothers-j-and-ben-carlin-biwhM2N35Rj-BodDr7iIAR3.1400x1400.jpg',
        genre_ids: [99, 265, 214, 68],
        thumbnail:
          'https://production.listennotes.com/podcasts/super-carlin-brothers-j-and-ben-carlin-EtH8D7G3Qyq-BodDr7iIAR3.300x300.jpg',
        listen_score: 53,
        title_original: 'Super Carlin Brothers',
        listennotes_url: 'https://www.listennotes.com/c/8bdbb906eef04e5d8b391e947998e9af/',
        title_highlighted: 'Super Carlin Brothers',
        publisher_original: 'J and Ben Carlin',
        publisher_highlighted: 'J and Ben Carlin',
        listen_score_global_rank: '0.5%',
      },
      itunes_id: 1479112798,
      thumbnail:
        'https://production.listennotes.com/podcasts/super-carlin-brothers-j-and-ben-carlin-EtH8D7G3Qyq-BodDr7iIAR3.300x300.jpg',
      pub_date_ms: 1574355600377,
      guid_from_rss: 'd6549e8f-3718-4cbc-8fa0-6a5ce7c021b7',
      title_original: 'Star Wars Theory: The Great Star Wars Ice Cream Conspiracy',
      listennotes_url: 'https://www.listennotes.com/e/c877bf360bda4c74adea2ba066df6929/',
      audio_length_sec: 638,
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Theory: The Great <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Ice Cream Conspiracy',
      description_original:
        '<p>Hurry to <a href="https://www.youtube.com/redirect?q=http%3A%2F%2Fupstart.com%2FSCB&redir_token=7amGNOaR8D8jg7lSuoxwd30QvaB8MTU3OTExMTA1MkAxNTc5MDI0NjUy&v=qmB4icIp8JM&event=video_description">http://upstart.com/SCB</a> to find out HOW LOW your Upstart rate is.</p> <p> </p> <p>The Mandalorian has introduced to us some brand new Star Wars Jargon. In the very first episode we learn about a special metal called Beskar that can be melted down and reinforce the Mandalorian’s armor. We also know that if he can complete his mission he has an ENTIRE CAMONTO of the stuff waiting for him upon delivery of the Young Orphan Darling Asset, aka LIL YODA. But how much is a camtono? And how on TATOOINE could it have anything to do with ICE CREAM!?</p>',
      description_highlighted:
        '...The Mandalorian has introduced to us some brand new <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Jargon....',
      transcripts_highlighted: [],
    },
    {
      id: 'a47ed9e517ed4767a679ac8499f27565',
      rss: 'https://filmthreat.libsyn.com/rss',
      link: 'https://filmthreat.libsyn.com/the-star-wars-saga-ranked?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/a47ed9e517ed4767a679ac8499f27565/',
      image:
        'https://production.listennotes.com/podcasts/film-threat-film-threat-podcast-network-qh2IVg58zR6-cBuD3xXjTAG.1400x1400.jpg',
      podcast: {
        id: 'f0a8fa8df3d04ec08fba8d317dafdeb0',
        image:
          'https://production.listennotes.com/podcasts/film-threat-film-threat-podcast-network-qh2IVg58zR6-cBuD3xXjTAG.1400x1400.jpg',
        genre_ids: [68],
        thumbnail:
          'https://production.listennotes.com/podcasts/film-threat-film-threat-podcast-network-Awkm8hri9Sg-cBuD3xXjTAG.300x300.jpg',
        listen_score: 39,
        title_original: 'Film Threat',
        listennotes_url: 'https://www.listennotes.com/c/f0a8fa8df3d04ec08fba8d317dafdeb0/',
        title_highlighted: 'Film Threat',
        publisher_original: 'Film Threat Podcast Network',
        publisher_highlighted: 'Film Threat Podcast Network',
        listen_score_global_rank: '2%',
      },
      itunes_id: 1202134377,
      thumbnail:
        'https://production.listennotes.com/podcasts/film-threat-film-threat-podcast-network-Awkm8hri9Sg-cBuD3xXjTAG.300x300.jpg',
      pub_date_ms: 1577019600037,
      guid_from_rss: '7bbf8fdc-22cb-4e9b-b3cb-edc9cd59a71f',
      title_original: 'The Star Wars Saga Ranked',
      listennotes_url: 'https://www.listennotes.com/e/a47ed9e517ed4767a679ac8499f27565/',
      audio_length_sec: 1512,
      explicit_content: true,
      title_highlighted:
        'The <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Saga Ranked',
      description_original:
        "The circle is now complete. The Film Threat staff discusses all nine episodes of the Star Wars saga and ranks the best films, characters and now that we've seen them all, debates which is the best trilogy.",
      description_highlighted:
        '...The Film Threat staff discusses all nine episodes of the <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> saga and ranks the best films, characters and now that we\'ve seen them all, debates which is the best trilogy....',
      transcripts_highlighted: [],
    },
    {
      id: '6280a11466dd407e99c66130f203167a',
      rss: 'https://snlafterparty.libsyn.com/rss',
      link: 'https://snlpodcast.com/episodes/2019/12/24/sample-star-wars-tv-talk-podcast?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/6280a11466dd407e99c66130f203167a/',
      image:
        'https://production.listennotes.com/podcasts/saturday-night-live-snl-afterparty-john-sEoTraLnKPB-_iOE4lLZ2pD.1400x1400.jpg',
      podcast: {
        id: '09b986e503d4448ab0b625f6233bdd65',
        image:
          'https://production.listennotes.com/podcasts/saturday-night-live-snl-afterparty-john-sEoTraLnKPB-_iOE4lLZ2pD.1400x1400.jpg',
        genre_ids: [68, 133, 134],
        thumbnail:
          'https://production.listennotes.com/podcasts/saturday-night-live-snl-afterparty-john-wm1CtQVkRfy-_iOE4lLZ2pD.300x300.jpg',
        listen_score: 43,
        title_original: 'Saturday Night Live (SNL) Afterparty',
        listennotes_url: 'https://www.listennotes.com/c/09b986e503d4448ab0b625f6233bdd65/',
        title_highlighted: 'Saturday Night Live (SNL) Afterparty',
        publisher_original: 'John Murray / Spry FM',
        publisher_highlighted: 'John Murray / Spry FM',
        listen_score_global_rank: '1%',
      },
      itunes_id: 1133381225,
      thumbnail:
        'https://production.listennotes.com/podcasts/saturday-night-live-snl-afterparty-john-wm1CtQVkRfy-_iOE4lLZ2pD.300x300.jpg',
      pub_date_ms: 1576989000072,
      guid_from_rss: '98206b6e-fc6e-45a5-85a6-e54eb4657299',
      title_original: 'Sample: Star Wars TV Talk Podcast',
      listennotes_url: 'https://www.listennotes.com/e/6280a11466dd407e99c66130f203167a/',
      audio_length_sec: 1690,
      explicit_content: false,
      title_highlighted:
        'Sample: <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> TV Talk Podcast',
      description_original:
        '<p>While John is hard at work editing our coverage of Eddie Murphy\'s triumphant return to Studio 8H, please enjoy this excerpt from the Star Wars TV Talk podcast—on which John is regularly featured.</p> <p>This excerpt is from their discussion of the Disney+ streaming series The Mandalorian chapter 3: "The Sin", and contains heavy spoilers.</p> <p>John\'s take on all things Star Wars TV, can be heard weekly at <a href="https://starwarstvtalk.com" rel="noopener" target="_blank">starwarstvtalk.com</a> or by subscribing to "Star Wars TV Talk" wherever better podcasts can be found.</p> Get Our Full-Length Episodes on Patreon <ul> <li><a href="https://www.patreon.com/snlpodcast" rel="noopener" target="_blank">Patreon</a>: Become a patron to access our full-length, ad-free episodes and other exclusive member rewards.</li> </ul> Notes <ul> <li><a href="https://darylsbars.com/ref/john/" rel="noopener" target="_blank">Daryl\'s All Natural Protein Bars</a>: Wholesome, nutritious, great tasting, gluten free, low-carb protein bars.</li> </ul> <ul> <li>Connect with us at: <ul> <li><a href="http://snlpodcast.com" rel="noopener" target="_blank">snlpodcast.com</a></li> <li>Patreon: <a href="https://www.patreon.com/snlpodcast" rel="noopener" target="_blank">snlpodcast</a></li> <li>Twitter: <a href="https://twitter.com/snlpodcast" rel="noopener" target="_blank">@snlpodcast</a></li> <li>Instagram: <a href="https://www.instagram.com/snlpodcast/" rel="noopener" target="_blank">snlpodcast</a></li> <li>Facebook: <a href="https://www.facebook.com/snlpodcast/" rel="noopener" target="_blank">@snlpodcast</a></li> <li><a href="mailto:feedback@snlpodcast.com">feedback@snlpodcast.com</a></li> </ul> </li> </ul>',
      description_highlighted:
        '...John\'s take on all things <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> TV, can be heard weekly at starwarstvtalk.com or by subscribing to "<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> TV Talk" wherever better podcasts can be found....',
      transcripts_highlighted: [],
    },
    {
      id: 'd1b5ed56fdd34e7596fe9cc7aac63c00',
      rss: 'http://feeds.feedburner.com/FramesPerSecondPodcast',
      link: 'https://megaphone.link/STU5698215144?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/d1b5ed56fdd34e7596fe9cc7aac63c00/',
      image: 'https://production.listennotes.com/podcasts/frames-per-second-studio71-Tk47uwatlcN-J_3zM-VyFvj.1400x1400.jpg',
      podcast: {
        id: '88c28bd52e32422c8f3a71fab45aa77f',
        image:
          'https://production.listennotes.com/podcasts/frames-per-second-studio71-Tk47uwatlcN-J_3zM-VyFvj.1400x1400.jpg',
        genre_ids: [68],
        thumbnail:
          'https://production.listennotes.com/podcasts/frames-per-second-studio71-nFjw84GgN7c-J_3zM-VyFvj.300x300.jpg',
        listen_score: 49,
        title_original: 'Frames Per Second',
        listennotes_url: 'https://www.listennotes.com/c/88c28bd52e32422c8f3a71fab45aa77f/',
        title_highlighted: 'Frames Per Second',
        publisher_original: 'Studio71',
        publisher_highlighted: 'Studio71',
        listen_score_global_rank: '0.5%',
      },
      itunes_id: 1453571424,
      thumbnail:
        'https://production.listennotes.com/podcasts/frames-per-second-studio71-nFjw84GgN7c-J_3zM-VyFvj.300x300.jpg',
      pub_date_ms: 1576645200539,
      guid_from_rss: '7606301c-1fae-11ea-8cf6-6f9a6838594d',
      title_original: 'Do Black People Watch Star Wars?',
      listennotes_url: 'https://www.listennotes.com/e/d1b5ed56fdd34e7596fe9cc7aac63c00/',
      audio_length_sec: 976,
      explicit_content: true,
      title_highlighted:
        'Do Black People Watch <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>?',
      description_original:
        '<p>Star Wars is one of the most popular franchises in history. But is it something black folks watch? We debate. </p><p> </p><p>Learn more about your ad choices. Visit <a href="https://megaphone.fm/adchoices">megaphone.fm/adchoices</a></p>',
      description_highlighted:
        '...<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> is one of the most popular franchises in history. But is it something black folks watch? We debate. \n \nLearn more about your ad choices. Visit megaphone.fm/adchoices...',
      transcripts_highlighted: [],
    },
    {
      id: '428fc8c5d1dc4ea4bfa7197f50dfcbef',
      rss: 'https://anchor.fm/s/2e7b510/podcast/rss',
      link: 'https://podcasters.spotify.com/pod/show/drzeuspodcast/episodes/Star-Wars-on-Saturday-Night-e9skm5?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/428fc8c5d1dc4ea4bfa7197f50dfcbef/',
      image: 'https://production.listennotes.com/podcasts/dr-zeus-podcast-dr-zeus-ietJoCgElyS-uG3iyp0tI89.1400x1400.jpg',
      podcast: {
        id: '2c48295d6e2643ee837896a03920255a',
        image: 'https://production.listennotes.com/podcasts/dr-zeus-podcast-dr-zeus-ietJoCgElyS-uG3iyp0tI89.1400x1400.jpg',
        genre_ids: [133, 68, 263, 86, 82],
        thumbnail: 'https://production.listennotes.com/podcasts/dr-zeus-podcast-dr-zeus-EgmZh68AS2r-uG3iyp0tI89.300x300.jpg',
        listen_score: 24,
        title_original: 'Dr Zeus Podcast',
        listennotes_url: 'https://www.listennotes.com/c/2c48295d6e2643ee837896a03920255a/',
        title_highlighted: 'Dr Zeus Podcast',
        publisher_original: 'Dr Zeus',
        publisher_highlighted: 'Dr Zeus',
        listen_score_global_rank: '10%',
      },
      itunes_id: 1360921520,
      thumbnail: 'https://production.listennotes.com/podcasts/dr-zeus-podcast-dr-zeus-EgmZh68AS2r-uG3iyp0tI89.300x300.jpg',
      pub_date_ms: 1577587068379,
      guid_from_rss: '9298b06d-5ebe-4b87-bccb-39b6b2377962',
      title_original: 'Star Wars on Saturday Night.',
      listennotes_url: 'https://www.listennotes.com/e/428fc8c5d1dc4ea4bfa7197f50dfcbef/',
      audio_length_sec: 638,
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> on Saturday Night.',
      description_original:
        'Snl wars. \n\n--- \n\nSend in a voice message: https://podcasters.spotify.com/pod/show/drzeuspodcast/message',
      description_highlighted:
        '...Snl <span class="ln-search-highlight">wars</span>. \n\n--- \n\nSend in a voice message: https://podcasters.spotify.com/pod/show/drzeuspodcast/message...',
      transcripts_highlighted: [],
    },
    {
      id: '39746ccfc0d64f62aea8e96641366109',
      rss: 'https://feeds.megaphone.fm/QCD5465390493',
      link: 'https://www.spreaker.com/user/mcucast/star-wars-is-better-than-star-trek?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/39746ccfc0d64f62aea8e96641366109/',
      image:
        'https://production.listennotes.com/podcasts/marvel-cinematic-universe-podcast-stranded-sNYFUAiyMCD-aXR7VuG2z4p.1400x1400.jpg',
      podcast: {
        id: '593c42e343ba44e7b6f8634a946f0b52',
        image:
          'https://production.listennotes.com/podcasts/marvel-cinematic-universe-podcast-stranded-sNYFUAiyMCD-aXR7VuG2z4p.1400x1400.jpg',
        genre_ids: [68, 99, 122],
        thumbnail:
          'https://production.listennotes.com/podcasts/marvel-cinematic-universe-podcast-stranded-0qV5D16_N2s-aXR7VuG2z4p.300x300.jpg',
        listen_score: 59,
        title_original: 'Marvel Cinematic Universe Podcast',
        listennotes_url: 'https://www.listennotes.com/c/593c42e343ba44e7b6f8634a946f0b52/',
        title_highlighted: 'Marvel Cinematic Universe Podcast',
        publisher_original: 'Stranded Panda | QCODE',
        publisher_highlighted: 'Stranded Panda | QCODE',
        listen_score_global_rank: '0.5%',
      },
      itunes_id: 907175322,
      thumbnail:
        'https://production.listennotes.com/podcasts/marvel-cinematic-universe-podcast-stranded-0qV5D16_N2s-aXR7VuG2z4p.300x300.jpg',
      pub_date_ms: 1575521386434,
      guid_from_rss: 'https://api.spreaker.com/episode/20495415',
      title_original: 'Star Wars is better than Star Trek',
      listennotes_url: 'https://www.listennotes.com/e/39746ccfc0d64f62aea8e96641366109/',
      audio_length_sec: 733,
      explicit_content: true,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> is better than <span class="ln-search-highlight">Star</span> Trek',
      description_original:
        'A just for fun episode.  Time to punish Matt for his sins against baby yoda<br /><br />This show is part of the Spreaker Prime Network, if you are interested in advertising on this podcast, contact us at <a href="https://www.spreaker.com/show/3200822/advertisement">https://www.spreaker.com/show/3200822/advertisement</a>',
      description_highlighted:
        '...A just for fun episode.  Time to punish Matt for his sins against baby yodaThis show is part of the Spreaker Prime Network, if you are interested in advertising on this podcast, contact us at https://www.spreaker.com/show/3200822/advertisement...',
      transcripts_highlighted: [],
    },
    {
      id: 'abdc7a70194c4d6daaa429b7fc2ec5c6',
      rss: 'https://triviawithbudds.libsyn.com/rss',
      link: 'https://triviawithbudds.libsyn.com/11-trivia-questions-on-modern-star-wars?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      audio: 'https://www.listennotes.com/e/p/abdc7a70194c4d6daaa429b7fc2ec5c6/',
      image:
        'https://production.listennotes.com/podcasts/trivia-with-budds-ryan-budds--K74E8aYCBr-odHDeJf8O5Y.1400x1400.jpg',
      podcast: {
        id: '9229022e1b7e46578d8793b1601f983d',
        image:
          'https://production.listennotes.com/podcasts/trivia-with-budds-ryan-budds--K74E8aYCBr-odHDeJf8O5Y.1400x1400.jpg',
        genre_ids: [68, 82, 133],
        thumbnail:
          'https://production.listennotes.com/podcasts/trivia-with-budds-ryan-budds-YlFUN1Qs_68-odHDeJf8O5Y.300x300.jpg',
        listen_score: 49,
        title_original: 'Trivia With Budds',
        listennotes_url: 'https://www.listennotes.com/c/9229022e1b7e46578d8793b1601f983d/',
        title_highlighted: 'Trivia With Budds',
        publisher_original: 'Ryan Budds',
        publisher_highlighted: 'Ryan Budds',
        listen_score_global_rank: '0.5%',
      },
      itunes_id: 1139115219,
      thumbnail:
        'https://production.listennotes.com/podcasts/trivia-with-budds-ryan-budds-YlFUN1Qs_68-odHDeJf8O5Y.300x300.jpg',
      pub_date_ms: 1577226086879,
      guid_from_rss: '6ab99079-61c0-4fa3-91f0-28cca5d918b0',
      title_original: '11 Trivia Questions on Modern Star Wars',
      listennotes_url: 'https://www.listennotes.com/e/abdc7a70194c4d6daaa429b7fc2ec5c6/',
      audio_length_sec: 646,
      explicit_content: false,
      title_highlighted:
        '11 Trivia Questions on Modern <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      description_original:
        '<p>With the release of Rise of Skywalker, I just had to include a round on the most recent Star Wars movies at my live events last week, and now, on the podcast! Grab a wookie and play!</p> <p>Question of the Day brought to you by Funky Monkey Design of San Dimas, CA:  What network originally aired Eureka\'s castle? Tweet me your answer @ryanbudds or email <a href="mailto:ryanbudds@gmail.com">ryanbudds@gmail.com</a> to be eligible for a prize! </p> <p>Yesterday\'s QotD answer:  Terry Trivia Team Name of the Day:  Bob\'s Wahlburgers  Funky Monkey Designs:  <a href="http://fmdesignsinc.com/">http://fmdesignsinc.com/</a></p> <p>Save 25% site wide when using the code BUDDS25 on <a href="http://www.DrewBlank.com!">www.DrewBlank.com!</a> This guy makes the best pop culture art around. Grab some Office, Parks and Rec, Big Lebowski, Bill Murray, and Horror Icon coloring books for the ones you love, along with hundreds of other great creations, all for 1/4th off! </p> <p>THE FIRST TRIVIA QUESTION STARTS AT 03:53 Theme song by <a href="http://www.soundcloud.com/Frawsty">www.soundcloud.com/Frawsty</a></p> <p>Bed Music:  "Misuse" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/</p> <p><a href="http://TriviaWithBudds.com">http://TriviaWithBudds.com</a><a href="http://facebook.com/TriviaWithBudds">http://Facebook.com/TriviaWithBudds </a> <a href="http://twitter.com/ryanbudds">http://Twitter.com/ryanbudds</a>  <a href="http://instagram.com/ryanbudds">http://Instagram.com/ryanbudds</a></p> <p>Book a party, corporate event, or fundraiser anytime by emailing <a href="mailto:ryanbudds@gmail.com">ryanbudds@gmail.com</a> or use the contact form here: <a href="https://www.triviawithbudds.com/contact">https://www.triviawithbudds.com/contact</a></p> <p>SUPPORT THE SHOW: <a href="http://www.Patreon.com/TriviaWithBudds">www.Patreon.com/TriviaWithBudds</a></p> <p>Send me your questions and I\'ll read them/answer them on the show. Also send me any topics you\'d like me to cover on future episodes, anytime! Cheers. </p> <p><em>SPECIAL THANKS TO ALL MY PATREON SUBSCRIBERS INCLUDING:</em>  Chris Adams, Christopher Callahan, Veronica Baker, Manny Majarian, Greg Bristow, Brenda Martinez, Alex DeSmet, Joe Finnie, Manny Cortez, Sarah McKavetz, Simon Time, Mo Martinez, Randy Tatum, Joan Bryce, Katie Christofferson, Denise Leonard, Jen Wojnar, Sarah Guest, Jess Whitener, Kyle Bonnin, Dan Papallo, Robert Casey, Ian Schulze, Casey O\'Connor, Marissa Cuthbertson, Kyle Aumer, Taryn Napolitano, Matthew Frost, Katie Smith, Brian Salyer, Megan Acuna, Anna Evans, Jim Fields, Lauren Ward, Greg Heinz, Wreck My Podcast, Douglas French, Erika Cooper, Mark Haas, Sarah Haas, Katelyn Reik, Casey Becker, Paul McLaughlin, Amy Jeppesen, Melissa Chesser, Shaun Delacruz, Feana Nevel, Cody Welter, Paul Doronila, Kathryn Mott, Luke McKay, Ricky Carney, Kyle Hendrickson, Willy Powell, Myke Edwards, Joe Jermolowicz, Joey Mucha, Mona Bray, and Russ Friedewald! YOU GUYS ROCK! </p>',
      description_highlighted:
        '...With the release of Rise of Skywalker, I just had to include a round on the most recent <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> movies at my live events last week, and now, on the podcast! Grab a wookie and play!...',
      transcripts_highlighted: [],
    },
  ],
  next_offset: 10,
};
