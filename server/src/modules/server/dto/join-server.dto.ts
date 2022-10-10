import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinServerDto {
  @IsString()
  @ApiProperty()
  inviteCode: string;
}
