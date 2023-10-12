import { Typeahead } from '~/shared/podcast/api/types';

export class PodcastDataModel {
  formatTypeaheadData(
    rawData: Typeahead.ServerResponseRaw
  ): Typeahead.ServerResponse {
    const { genres = [], podcasts = [] } = rawData;
    const genresModified = [...genres].map((val) => ({
      ...val,
      ...{ _app: { link: `/genres/${val.id}` } },
    }));
    const podcastsModified = [...podcasts].map((val) => ({
      ...val,
      ...{ _app: { link: `/podcasts/${val.id}` } },
    }));

    return { ...rawData, genres: genresModified, podcasts: podcastsModified };
  }
}
