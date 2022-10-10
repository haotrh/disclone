import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CrawlService } from './crawl.service';

@Controller('crawl')
export class CrawlController {
  constructor(private crawlService: CrawlService) {}

  @Post()
  @Public()
  async getCrawlData(@Body() body: { url: string }) {
    return this.crawlService.getSiteMetadata(body.url);
  }
}
