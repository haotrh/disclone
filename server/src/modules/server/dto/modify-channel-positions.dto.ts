import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ModifyRolePositionsDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsNumber()
  @Type(() => Number)
  position: number;
}
