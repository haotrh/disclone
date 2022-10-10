import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Embed } from '../entities/message.entity';

class Attachment {
  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  id: number;

  @IsString()
  @ApiProperty()
  fileName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  spoiler?: boolean;
}

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nonce?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  @ApiPropertyOptional()
  attachments?: Attachment[];

  @IsArray()
  @IsOptional()
  @Type(() => Embed)
  @ApiPropertyOptional()
  embeds?: Embed[];
}
