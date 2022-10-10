import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import _ from 'lodash';
import ogs from 'open-graph-scraper';
import probe from 'probe-image-size';
import seedrandom from 'seedrandom';
import { Embed } from '../channel/entities/message.entity';

const METADATA_CACHE = 'METADATA_CACHE_';
const UA =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

type OGS = ogs.OpenGraphProperties & {
  ogImage?: ogs.OpenGraphImage | ogs.OpenGraphImage[];
  success: true;
};

@Injectable()
export class CrawlService {
  // private browserlessFactory: any;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // this.browserlessFactory = createBrowserless();
  }

  // private getHTMLContent = async (url: string) => {
  //   // create a browser context inside Chromium process
  //   const browserContext = this.browserlessFactory.createContext();
  //   const getBrowserless = () => browserContext;
  //   const result = await getHTML(url, { getBrowserless, headers: { ua: UA } });
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //@ts-ignore
  //   await getBrowserless((browser) => browser.destroyContext());
  //   return result.html;
  // };

  async getSiteMetadata(url: string) {
    const cacheData = await this.cacheManager.get(METADATA_CACHE + url);
    if (cacheData) {
      return cacheData as OGS;
    }
    // const html: string = await this.getHTMLContent(url);
    const { result, error } = await ogs({
      url,
      ogImageFallback: false,
      headers: {
        'User-Agent': UA,
      },
    });
    if (error) {
      throw new Error();
    }
    await this.cacheManager.set(METADATA_CACHE + url, result);
    return result as OGS;
  }

  private async toEmbed(metaData: OGS): Promise<Embed> {
    const embed: Embed = {
      url: metaData.ogUrl,
      description: metaData.ogDescription,
      title: metaData.ogTitle,
    };

    if (metaData.ogImage) {
      if (_.isObject(metaData.ogImage)) {
        const ogImage = metaData.ogImage as ogs.OpenGraphImage;
        embed.thumbnail = {
          url: ogImage.url,
          width: 0,
          height: 0,
        };
        if (ogImage.width && ogImage.height) {
          embed.thumbnail.width = parseInt(ogImage.width.toString());
          embed.thumbnail.height = parseInt(ogImage.height.toString());
        } else {
          const result = await probe(ogImage.url, {
            rejectUnauthorized: false,
          });
          embed.thumbnail.width = result.width;
          embed.thumbnail.height = result.height;
        }
      }
    }

    if (metaData.ogVideo) {
      const ogVideo = metaData.ogVideo as any as {
        url: string;
        width: string | null;
        height: string | null;
      };
      embed.video = {
        url: ogVideo.url,
      };
      if (ogVideo.width && ogVideo.height) {
        embed.thumbnail.width = parseInt(ogVideo.width.toString());
        embed.thumbnail.height = parseInt(ogVideo.height.toString());
      }
    }

    if (metaData.ogDate) {
      embed.timestamp = new Date(metaData.ogDate);
    }

    if (metaData.ogSiteName) {
      const rng = seedrandom(metaData.ogSiteName ?? '');
      const color = Math.floor(rng() * 16777215);
      embed.color = color;
    } else {
      embed.color = 0;
    }

    if (metaData.ogType === '') {
    }

    if (metaData.ogSiteName) {
      embed.provider = {
        name: metaData.ogSiteName,
      };
    }

    return embed;
  }

  async getEmbedFromSite(url: string): Promise<Embed> {
    const metadata = await this.getSiteMetadata(url);
    return this.toEmbed(metadata);
  }
}
