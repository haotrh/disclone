import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { Server } from '../server/entities/server.entity';
import { EventsModule } from '../events/events.module';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';
import { Emoji } from './entities/emoji.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Server, Emoji]),
    EventsModule,
    FileModule,
  ],
  controllers: [EmojiController],
  providers: [EmojiService],
  exports: [EmojiService],
})
export class EmojiModule {}
