import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import * as TypeaheadTypes from '~/shared/podcast/api/types/typeahead-get';

export default defineEventHandler((event) => {
  return new PodcastDataModel().formatTypeaheadData(mockTypeahead);
});

const mockTypeahead: TypeaheadTypes.ServerResponseRaw = {
  terms: ['star wars'],
  genres: [
    {
      id: 160,
      name: 'Star Wars',
      parent_id: 68,
    },
  ],
  podcasts: [
    {
      id: 'ca3b35271db04291ba56fab8a4f731e4',
      image:
        'https://production.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-GSQTPOZCqAx-4v5pRaEg1Ub.1400x1400.jpg',
      thumbnail:
        'https://production.listennotes.com/podcasts/rebel-force-radio-star-wars-podcast-star-wars-Na1ogntxKO_-4v5pRaEg1Ub.300x300.jpg',
      title_original: 'Rebel Force Radio: Star Wars Podcast',
      explicit_content: false,
      title_highlighted:
        'Rebel Force Radio: <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Podcast',
      publisher_original: 'Star Wars',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
    },
    {
      id: '8e90b8f0c9eb4c11b13f9dc331ed747c',
      image: 'https://production.listennotes.com/podcasts/inside-star-wars-wondery-F8ZBEqObITM-e8ydUYnAOJv.1400x1400.jpg',
      thumbnail: 'https://production.listennotes.com/podcasts/inside-star-wars-wondery-2Ep_n06B8ad-e8ydUYnAOJv.300x300.jpg',
      title_original: 'Inside Star Wars',
      explicit_content: false,
      title_highlighted:
        'Inside <span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
      publisher_original: 'Wondery',
      publisher_highlighted: 'Wondery',
    },
    {
      id: 'e8bdeb557c194bb9a97f8e1835a405b0',
      image:
        'https://production.listennotes.com/podcasts/star-wars-stuff-podcast-star-wars-N2eYaLJWtk8-4-E8Ab7PQ_B.1400x1400.jpg',
      thumbnail:
        'https://production.listennotes.com/podcasts/star-wars-stuff-podcast-star-wars-TOvDUaL7l3m-4-E8Ab7PQ_B.300x300.jpg',
      title_original: 'Star Wars STUFF Podcast',
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> STUFF Podcast',
      publisher_original: 'Star Wars',
      publisher_highlighted: '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span>',
    },
    {
      id: '9af8a811286b4fffa82e4c083cf5e711',
      image:
        'https://production.listennotes.com/podcasts/star-wars-minute-star-wars-minute-soG-b0dgOD3-GJRN7_nAPOM.1400x1400.jpg',
      thumbnail:
        'https://production.listennotes.com/podcasts/star-wars-minute-star-wars-minute-PZxXgGbh0SN-GJRN7_nAPOM.300x300.jpg',
      title_original: 'Star Wars Minute',
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Minute',
      publisher_original: 'Star Wars Minute',
      publisher_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Minute',
    },
    {
      id: '699701ca2479411f9c0bbf8dd85323e8',
      image:
        'https://production.listennotes.com/podcasts/star-wars-explained-alex-mollie-MKIbl7dwVTC-zuwl0R2DOjf.1400x1400.jpg',
      thumbnail:
        'https://production.listennotes.com/podcasts/star-wars-explained-alex-mollie-2_yoeSVtXOM-zuwl0R2DOjf.300x300.jpg',
      title_original: 'Star Wars Explained',
      explicit_content: false,
      title_highlighted:
        '<span class="ln-search-highlight">Star</span> <span class="ln-search-highlight">Wars</span> Explained',
      publisher_original: 'Alex & Mollie',
      publisher_highlighted: 'Alex & Mollie',
    },
  ],
};
