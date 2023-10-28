/**
 * Query params for request
 */
export interface RouteParams {
  query: {
    q: string;
    type: 'episode' | 'podcast';
    sort_by_date?: 0 | 1;
    offset?: number;
    genre_ids?: string;
    safe_mode?: number;
    page_size?: number;
    language?: 'English';
  };
}

/**
 * Data transform modifications
 */
interface ExtendData {
  _app?: {
    link?: string;
    linkPodcast?: string;
    linkEpisode?: string;
  };
}

/**
 * Responses from external Podcast API
 */
interface EpisodeResultRaw {
  id: string;
  audio: string;
  audio_length_sec: number;
  description_original: string;
  title_original: string;
  image: string;
  thumbnail: string;
  pub_date_ms: number;
  explicit_content: boolean;
  podcast: {
    id: string;
    image: string;
    genre_ids: number[];
    thumbnail: string;
    title_original: string;
    publisher_original: string;
    genre_ids: number[];
  };
  podcast_id: string;
  podcast_title_original: string;
  publisher_original: string;
  genre_ids: number[];
}

interface PodcastResultRaw {
  id: string;
  description_original: string;
  title_original: string;
  publisher_original: string;
  image: string;
  thumbnail: string;
  latest_pub_date_ms: number;
  earliest_pub_date_ms: number;
  genre_ids: number[];
  total_episodes: number;
  explicit_content: boolean;
  website: string;
}

export interface ServerResponsePodcastRaw {
  took: number;
  count: number;
  total: number;
  next_offset: number;
  results: PodcastResultRaw[];
}

export interface ServerResponseEpisodeRaw {
  took: number;
  count: number;
  total: number;
  next_offset: number;
  results: EpisodeResultRaw[];
}

/**
 * Final response after modifications
 */
export interface ServerResponseEpisode extends ServerResponseEpisodeRaw {
  results: (ExtendData & EpisodeResultRaw)[];
}

export interface ServerResponsePodcast extends ServerResponsePodcastRaw {
  results: (ExtendData & PodcastResultRaw)[];
}
