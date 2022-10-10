import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddRoleMembersDto {
  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  @ArrayMinSize(1)
  memberIds: string[];
}
