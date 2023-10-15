import * as Typeahead from '~/shared/podcast/api/types/typeahead-get';
import * as Podcast from '~/shared/podcast/api/types/podcast-get';

export class PodcastDataModel {
  formatPodcastData(rawData: Podcast.ServerResponseRaw): Podcast.ServerResponse {
    const data = { ...rawData };

    return {
      ...data,
      _app: {
        link: `/podcast/${data.id}`,
      },
    };
  }

  formatTypeaheadData(rawData: Typeahead.ServerResponseRaw): Typeahead.ServerResponse {
    const { genres = [], podcasts = [] } = rawData;
    const genresModified = [...genres].map((val) => ({
      ...val,
      ...{ _app: { link: `/genre/${val.id}` } },
    }));
    const podcastsModified = [...podcasts].map((val) => ({
      ...val,
      ...{ _app: { link: `/podcast/${val.id}` } },
    }));

    return {
      ...rawData,
      genres: [...genresModified],
      podcasts: [...podcastsModified],
    };
  }
}
