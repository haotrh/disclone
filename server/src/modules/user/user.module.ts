import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { EventsModule } from '../events/events.module';
import { FileModule } from '../file/file.module';
import { ReadState } from '../channel/entities/readState.entity';
import { RelationshipService } from './relationship.service';
import { Channel } from '../channel/entities/channel.entity';
import { DmChannelService } from './dm-channel.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, UserSettings, ReadState, Channel]),
    forwardRef(() => EventsModule),
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService, RelationshipService, DmChannelService],
  exports: [UserService],
})
export class UserModule {}
