import type * as Typeahead from '~/shared/podcast/api/types/typeahead-get';
import type * as Podcast from '~/shared/podcast/api/types/podcast-get';
import type * as Genres from '~/shared/podcast/api/types/genres-get';
import type * as Search from '~/shared/podcast/api/types/search-get';
import type * as BestTypes from '~/shared/podcast/api/types/best-podcasts-get';
import { RoutingModel } from '~/shared/routing';

export class PodcastDataModel {
  formatBestPodcastsData(rawData: BestTypes.ServerResponseRaw): BestTypes.ServerResponse {
    const data = { ...rawData };
    const podcasts = [...(data.podcasts || [])].map((val) => ({
      ...val,
      _app: { linkPodcast: new RoutingModel().getPodcastLink(val.id) },
    }));
    return {
      ...data,
      podcasts: [...podcasts],
    };
  }

  formatSearchEpisodeData(rawData: Search.ServerResponseEpisodeRaw): Search.ServerResponseEpisode {
    const data = { ...rawData };
    const results = [...(data.results || [])].map((val) => ({
      ...val,
      _app: { linkPodcast: new RoutingModel().getPodcastLink(val.podcast.id) },
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
      _app: { linkPodcast: new RoutingModel().getPodcastLink(val.id), link: new RoutingModel().getPodcastLink(val.id) },
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
      _app: { link: new RoutingModel().getGenreLink(val.id.toString()) },
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
        link: new RoutingModel().getPodcastLink(data.id),
      },
    };
  }

  formatTypeaheadData(rawData: Typeahead.ServerResponseRaw): Typeahead.ServerResponse {
    const { genres = [], podcasts = [] } = rawData;
    const genresModified = [...genres].map((val) => ({
      ...val,
      ...{ _app: { link: new RoutingModel().getGenreLink(val.id.toString()) } },
    }));
    const podcastsModified = [...podcasts].map((val) => ({
      ...val,
      ...{ _app: { link: new RoutingModel().getPodcastLink(val.id) } },
    }));

    return {
      ...rawData,
      genres: [...genresModified],
      podcasts: [...podcastsModified],
    };
  }
}
