import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Logger } from '@nestjs/common';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = new Logger('MikroORM');
const config = {
  type: 'mongo',
  clientUrl: process.env.MONGODB_CLIENT_URL,
  dbName: 'disclone',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  logger: logger.log.bind(logger),
  highlighter: new MongoHighlighter(),
  debug: true,
  ensureIndexes: true,
  metadataProvider: TsMorphMetadataProvider,
  registerRequestContext: false,
} as MikroOrmModuleSyncOptions;

export default config;
