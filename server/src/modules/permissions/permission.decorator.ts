import { SetMetadata } from '@nestjs/common';
import { Permissions as PermissionsEnum } from 'src/types/permissions.types';

export const Permission = (permissions: PermissionsEnum) =>
  SetMetadata('permissions', permissions);
