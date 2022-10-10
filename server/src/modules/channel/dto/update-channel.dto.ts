import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Overwrite } from '../entities/channel.entity';

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  topic?: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  @ApiProperty()
  parent?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Overwrite)
  permissionOverwrites?: Overwrite[];
}
