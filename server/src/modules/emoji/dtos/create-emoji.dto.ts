import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { base64Matcher } from 'src/utils/regex.util';

export class CreateEmojiDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @Matches(base64Matcher)
  image: string;
}
