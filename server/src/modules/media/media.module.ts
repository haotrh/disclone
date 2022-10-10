import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TokenService } from '../auth/token.service';
import { MediaGateway } from './media.gateway';

@Module({
  imports: [AuthModule],
  providers: [MediaGateway],
  exports: [MediaGateway],
})
export class MediaModule {}
