import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFriendDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  discrimination: string;
}
