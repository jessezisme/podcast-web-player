import * as Typeahead from '~/shared/podcast/api/types/typeahead-get';
import * as Podcast from '~/shared/podcast/api/types/podcast-get';
import * as Genres from '~/shared/podcast/api/types/genres-get';
import * as Search from '~/shared/podcast/api/types/search-get';

export class PodcastDataModel {
  formatSearchEpisodeData(rawData: Search.ServerResponseEpisodeRaw): Search.ServerResponseEpisode {
    const data = { ...rawData };
    const results = [...(data.results || [])].map((val) => ({
      ...val,
      _app: { linkPodcast: encodeURI(`/podcast/${val.podcast.id}`) },
    }));
    return {
      ...data,
      results: [...results],
    };
  }

  formatSearchPodcastData(rawData: Search.ServerResponsePodcastRaw): Search.ServerResponsePodcast {
    const data = { ...rawData };
    const results = [...(data.results || [])].map((val) => ({
      ...val,
      _app: { linkPodcast: encodeURI(`/podcast/${val.id}`), link: encodeURI(`/podcast/${val.id}`) },
    }));
    return {
      ...data,
      results: [...results],
    };
  }

  formatGenresData(rawData: Genres.ServerResponseRaw): Genres.ServerResponse {
    const data = { ...rawData };
    const genres = [...data.genres].map((val) => ({
      ...val,
      _app: { link: encodeURI(`/genre/${val.id}`) },
    }));

    return {
      ...data,
      genres: [...genres] || [],
    };
  }

  formatPodcastData(rawData: Podcast.ServerResponseRaw): Podcast.ServerResponse {
    const data = { ...rawData };

    return {
      ...data,
      _app: {
        link: encodeURI(`/podcast/${data.id}`),
      },
    };
  }

  formatTypeaheadData(rawData: Typeahead.ServerResponseRaw): Typeahead.ServerResponse {
    const { genres = [], podcasts = [] } = rawData;
    const genresModified = [...genres].map((val) => ({
      ...val,
      ...{ _app: { link: encodeURI(`/genre/${val.id}`) } },
    }));
    const podcastsModified = [...podcasts].map((val) => ({
      ...val,
      ...{ _app: { link: encodeURI(`/podcast/${val.id}`) } },
    }));

    return {
      ...rawData,
      genres: [...genresModified],
      podcasts: [...podcastsModified],
    };
  }
}
