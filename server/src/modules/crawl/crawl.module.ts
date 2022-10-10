import { Module } from '@nestjs/common';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';

@Module({
  providers: [CrawlService],
  controllers: [CrawlController],
  exports: [CrawlService],
})
export class CrawlModule {}
