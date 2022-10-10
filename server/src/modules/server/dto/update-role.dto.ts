import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  color?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Boolean)
  hoist?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  permissions?: string;
}
