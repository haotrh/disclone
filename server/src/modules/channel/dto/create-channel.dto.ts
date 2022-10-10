import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(ChannelType)
  @ApiProperty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  parentId: string;
}
