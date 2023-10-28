import * as PodcastTypes from './podcast-get';

/**
 * Query params for request
 */
export interface RouteParams {
  query: {
    genre_id?: string;
    page?: number;
    sort?:
      | 'recent_added_first'
      | 'oldest_added_first'
      | 'recent_published_first'
      | 'oldest_published_first'
      | 'listen_score';
    safe_mode?: 0 | 1;
    language?: string;
  };
}

/**
 * Data transform modifications
 */
interface ExtendData {
  _app: {
    linkPodcast: string;
  };
}

/**
 * Responses from external Podcast API
 */

interface PodcastItemRaw {
  id: string;
  image: string;
  title: string;
  website: string;
  publisher: string;
  thumbnail: string;
  description: string;
  explicit_content: boolean;
}

export interface ServerResponseRaw {
  id: number;
  name: string;
  total: number;
  has_next: boolean;
  podcasts: PodcastItemRaw[];
  parent_id: number;
  page_number: number;
  has_previous: boolean;
  next_page_number: number;
  previous_page_number: number;
}

/**
 * Final response after modifications
 */
export interface ServerResponse extends ServerResponseRaw {
  podcasts: (ExtendData & PodcastResponseRaw)[];
}
