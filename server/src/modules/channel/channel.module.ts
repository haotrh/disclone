import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { CrawlModule } from '../crawl/crawl.module';
import { Emoji } from '../emoji/entities/emoji.entity';
import { FileModule } from '../file/file.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { Member } from '../server/entities/member.entity';
import { EventsModule } from '../events/events.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Message } from './entities/message.entity';
import { ReadState } from './entities/readState.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PinController } from './pin.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Channel, Message, ReadState, Emoji, Member]),
    FileModule,
    forwardRef(() => EventsModule),
    PermissionsModule,
    CrawlModule,
  ],
  controllers: [ChannelController, MessageController, PinController],
  providers: [ChannelService, MessageService],
  exports: [ChannelService, MessageService],
})
export class ChannelModule {}
