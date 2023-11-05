import * as GenresTypes from '~/shared/podcast/api/types/genres-get';
import { PodcastDataModel } from '~/shared/podcast/api/models/podcast.model';
import { mockGenresData } from '~/test/mock-data/server/api/podcast/genres';

export default defineEventHandler(async (event) => {
  return new PodcastDataModel().formatGenresData({ ...(mockGenresData as GenresTypes.ServerResponseRaw) });
});
