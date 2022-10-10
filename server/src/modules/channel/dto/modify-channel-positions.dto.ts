import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ModifyChannelPositionsDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  parentId?: string;

  @IsNumber()
  @Type(() => Number)
  position: number;
}
