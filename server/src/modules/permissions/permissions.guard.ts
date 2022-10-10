import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/types/permissions.types';
import { User } from '../user/entities/user.entity';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const permissions = this.reflector.get<Permissions>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const params: { serverId?: string; channelId?: string } = request.params;
    const user: User = request.user;

    if (params.channelId) {
      return this.permissionsService.hasChannelPermission(
        permissions,
        user,
        params.channelId,
      );
    }

    if (params.serverId) {
      return this.permissionsService.hasServerPermission(
        permissions,
        user,
        params.serverId,
      );
    }
    return true;
  }
}
