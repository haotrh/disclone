import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { Channel } from '../channel/entities/channel.entity';
import { Member } from '../server/entities/member.entity';
import { Server } from '../server/entities/server.entity';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([Server, Channel, Member])],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
