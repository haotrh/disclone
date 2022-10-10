import { PickType, PartialType } from '@nestjs/swagger';
import { Member } from '../entities/member.entity';

export class UpdateMemberDto extends PartialType(
  PickType(Member, [
    'deaf',
    'mute',
    'nick',
    'bio',
    'banner',
    'avatar',
  ] as const),
) {}
