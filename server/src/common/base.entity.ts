import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ApiHideProperty } from '@nestjs/swagger';
import ObjectId from 'bson-objectid';

export abstract class BaseEntity {
  @PrimaryKey()
  @ApiHideProperty()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  @ApiHideProperty()
  createdAt? = new Date();

  @Property()
  @ApiHideProperty()
  updatedAt? = new Date();
}
