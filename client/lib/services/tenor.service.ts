import axios from "axios";
import { GifFormat, GifObject } from "types/gif.type";

axios.defaults.timeout = 60000;

export class TenorService {
  private key = process.env.TENOR_KEY;
  private clientKey = process.env.TENOR_CLIENT_KEY;

  private createQuery(otherQueries?: Object) {
    return {
      key: this.key,
      client_key: this.clientKey,
      ...otherQueries,
    };
  }

  private createMediaFilter(media_filter: GifFormat): string {
    return `gif,preview,${media_filter}`;
  }

  private parseGifResult(result: any, media_filter: GifFormat): GifObject {
    return {
      id: result.id,
      title: result.title,
      gif_src: result.media_formats["gif"].url,
      height: result.media_formats[media_filter].dims[1],
      preview: result.media_formats["preview"].url,
      src: result.media_formats[media_filter].url,
      url: result.itemurl,
      width: result.media_formats[media_filter].dims[0],
    };
  }

  async category() {
    return axios
      .get("https://tenor.googleapis.com/v2/categories", {
        params: this.createQuery(),
      })
      .then((res) => {
        return res;
      })
      .then(({ data }) => data.tags)
      .then((tags) => tags.map((tag: any) => ({ name: tag.searchterm, src: tag.image })))
      .catch((e) => console.log(e));
  }

  async search(search: string, media_filter: GifFormat, limit: number) {
    return axios
      .get("https://tenor.googleapis.com/v2/search", {
        params: this.createQuery({
          q: search,
          limit,
          media_filter: this.createMediaFilter(media_filter),
        }),
      })
      .then(({ data }) => data.results)
      .then((results) =>
        results.map((result: any): GifObject => this.parseGifResult(result, media_filter))
      );
  }

  async suggest(search: string, limit: number) {
    return axios
      .get("https://tenor.googleapis.com/v2/search_suggestions", {
        params: this.createQuery({ q: search, limit }),
      })
      .then(({ data }) => data.results);
  }

  async trending(media_filter: GifFormat, limit: number) {
    return axios
      .get("https://tenor.googleapis.com/v2/featured", {
        params: this.createQuery({
          media_filter: this.createMediaFilter(media_filter),
          limit,
        }),
      })
      .then(({ data }) => data.results)
      .then((results) =>
        results.map((result: any): GifObject => this.parseGifResult(result, media_filter))
      );
  }
}
