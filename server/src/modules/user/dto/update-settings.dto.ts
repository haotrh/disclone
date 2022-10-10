import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { Theme } from '../entities/user-settings.entity';
import { UserStatus } from '../entities/user.entity';

export class UpdateSettingsDto {
  @IsIn(['dark', 'light'])
  @IsOptional()
  @ApiPropertyOptional()
  theme?: Theme;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Boolean)
  animateEmoji: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Boolean)
  gifAutoPlay: boolean;

  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional()
  serversPositions: string[];

  @IsIn(['online', 'offline', 'idle', 'dnd'])
  @IsOptional()
  @ApiPropertyOptional()
  status: UserStatus;
}
