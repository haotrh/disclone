import { PickType, PartialType } from '@nestjs/swagger';
import { Server } from '../entities/server.entity';

export class UpdateServerDto extends PartialType(
  PickType(Server, [
    'description',
    'icon',
    'name',
    'permissions',
    'systemChannel',
    'splash',
  ] as const),
) {}
