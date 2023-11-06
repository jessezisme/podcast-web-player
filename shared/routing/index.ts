export class RoutingModel {
  getPodcastLink(id: string): string {
    return encodeURI(`/podcast/${id}`);
  }

  getGenreLink(id: string): string {
    return encodeURI(`/genre/${id}`);
  }
}
