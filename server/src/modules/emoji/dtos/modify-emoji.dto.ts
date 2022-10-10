import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ModifyEmojiDto {
  @IsString()
  @ApiProperty()
  name: string;
}
