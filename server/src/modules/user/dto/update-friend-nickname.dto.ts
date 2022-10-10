import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from 'src/utils/is-nullable.decorator';

export class UpdateFriendNicknameDto {
  @IsString()
  @ApiProperty()
  @IsNullable()
  nickname: string | null;
}
