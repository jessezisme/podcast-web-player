/**
 * Query params for request
 */
export interface RouteGetParams {
  query: {
    q: string;
    safe_mode?: 0 | 1;
  };
}

/**
 * Data transform modifications
 */
interface ExtendData {
  _app: {
    link: string;
  };
}

/**
 * Responses from external Podcast API
 */
interface PodcastsResponseRaw {
  id: string;
  image: string;
  thumbnail: string;
  title_original: string;
  publisher_original: string;
  explicit_content: Boolean;
}

interface GenresResponseRaw {
  id: number;
  name: string;
  parent_id: number;
}

export interface ServerResponseRaw {
  terms: string[] | [];
  genres: GenresResponseRaw[];
  podcasts: PodcastsResponseRaw[];
}

/**
 * Final response after modifications
 */
export interface ServerResponse {
  terms: string[] | [];
  genres: Array<GenresResponseRaw & ExtendData> | [];
  podcasts: Array<PodcastsResponseRaw & ExtendData> | [];
}
