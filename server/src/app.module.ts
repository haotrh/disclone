import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  CacheModule,
  forwardRef,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroORMConfig from './mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ChannelModule } from './modules/channel/channel.module';
import { EventsModule } from './modules/ws/events.module';
import { ServerModule } from './modules/server/server.module';
import { UserModule } from './modules/user/user.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './modules/permissions/permissions.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { EmojiModule } from './modules/emoji/emoji.module';
import { CrawlModule } from './modules/crawl/crawl.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    CacheModule.register({
      isGlobal: true,
      ttl: 10000,
    }),
    CrawlModule,
    ServerModule,
    ChannelModule,
    EventsModule,
    EmojiModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
