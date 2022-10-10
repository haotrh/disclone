import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateInviteDto {
  @IsNumber()
  @ApiProperty()
  maxAge: number;

  @IsNumber()
  @ApiProperty()
  maxUses: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  unique?: boolean;
}
