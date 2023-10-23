/**
 * Query params for request
 */
export interface RouteParams {
  query: {
    top_level_only?: 0 | 1;
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
export interface GenreRaw {
  id: number;
  name: string;
  parent_id: number;
}

export interface ServerResponseRaw {
  genres: GenreRaw[];
}

/**
 * Final response after modifications
 */
export interface ServerResponse extends ServerResponseRaw {
  genres: Array<GenreRaw & ExtendData>;
}
