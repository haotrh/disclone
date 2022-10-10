import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ChannelModule } from '../channel/channel.module';
import { FileModule } from '../file/file.module';
import { EventsModule } from '../events/events.module';
import { Invite } from './entities/invite.entity';
import { Member } from './entities/member.entity';
import { Role } from './entities/role.entity';
import { Server } from './entities/server.entity';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Server, Role, Member, Invite]),
    forwardRef(() => ChannelModule),
    forwardRef(() => EventsModule),
    FileModule,
  ],
  controllers: [ServerController, InviteController],
  providers: [ServerService, InviteService],
  exports: [ServerService],
})
export class ServerModule {}
