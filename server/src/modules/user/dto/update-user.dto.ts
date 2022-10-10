import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { IsNullable } from 'src/utils/is-nullable.decorator';
import { UserStatus } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsNullable()
  @IsOptional()
  @ApiPropertyOptional()
  avatar?: string | null;

  @IsString()
  @IsNullable()
  @IsOptional()
  @ApiPropertyOptional()
  banner?: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsIn(['online', 'offline', 'idle', 'dnd'])
  @IsOptional()
  @ApiPropertyOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  newPassword?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;
}
