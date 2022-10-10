import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ServerModule } from '../server/server.module';
import { UserModule } from '../user/user.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ServerModule),
  ],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway],
})
export class EventsModule {}
