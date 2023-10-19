/**
 * Query params for request
 */
export interface RouteParams {
  query: {
    id: string;
    next_episode_pub_date?: number;
    sort?: 'recent_first' | 'oldest_first';
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
interface EpisodeResponseRaw {
  id: string;
  audio: string;
  image: string;
  title: string;
  thumbnail: string;
  description: string;
  pub_date_ms: number;
  audio_length_sec: number;
  explicit_content: boolean;
  maybe_audio_invalid: boolean;
}

export interface ServerResponseRaw {
  id: string;
  image: string;
  title: string;
  website: string;
  episodes: EpisodeResponseRaw[];
  genre_ids: number[];
  publisher: string;
  thumbnail: string;
  description: string;
  total_episodes: number;
  explicit_content: boolean;
  latest_episode_id: string;
  latest_pub_date_ms: number;
  earliest_pub_date_ms: number;
  next_episode_pub_date: number;
}

/**
 * Final response after modifications
 */
export interface ServerResponse extends ExtendData, ServerResponseRaw {}
