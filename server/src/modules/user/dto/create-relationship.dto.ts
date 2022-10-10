import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RelationshipType } from '../entities/user.entity';

export class CreateRelationshipDto {
  @IsEnum(RelationshipType)
  @IsOptional()
  @ApiProperty()
  type?: RelationshipType;
}
