import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDmChannelDto {
  @IsString()
  @ApiProperty()
  recipient: string;
}
