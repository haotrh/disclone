import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectServerPermissions } from "@store/selectors";
import { permissionCheck } from "@utils/permissions";
import _ from "lodash";
import React, { ReactNode, useMemo } from "react";
import { Permissions } from "types/permissions";

interface PermissionWrapperProps {
  permissions?: Permissions | Permissions[];
  children?: ReactNode | ((hasPermission: boolean) => ReactNode);
  some?: boolean;
  owner?: boolean;
  fallback?: ReactNode;
  show?: boolean;
}

const PermissionsGuard: React.FC<PermissionWrapperProps> = ({
  children,
  permissions,
  some = _.isFunction(children),
  owner,
  fallback,
}) => {
  const me = useAppSelector((state) => state.me.user);
  const { server } = useChannel();
  const allPermissions = useAppSelector((state) => selectServerPermissions(state, server?.id));
  const hasPermission: boolean = useMemo(() => {
    if (!server || server.ownerId === me?.id) {
      return true;
    } else if (owner) {
      return server.ownerId === me?.id;
    } else {
      return Boolean(
        permissions &&
          (permissionCheck(allPermissions, Permissions.ADMINISTRATOR) ||
            (_.isArray(permissions)
              ? some
                ? permissions.some((permission) => permissionCheck(allPermissions, permission))
                : permissions.every((permission) => permissionCheck(allPermissions, permission))
              : permissionCheck(allPermissions, permissions)))
      );
    }
  }, [server, me?.id, owner, permissions, allPermissions, some]);

  if (!hasPermission && !_.isFunction(children)) return <>{fallback}</> ?? null;
  return <>{_.isFunction(children) ? children(hasPermission) : children}</>;
};

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  permissions,
  children,
  owner,
  show,
  ...props
}) => {
  if (show || (!permissions && !owner))
    return <>{_.isFunction(children) ? children(true) : children}</>;
  if (permissions && _.isArray(permissions) && permissions.length === 0)
    return <>{_.isFunction(children) ? children(true) : children}</>;
  return (
    <PermissionsGuard permissions={permissions} owner={owner} {...props}>
      {children}
    </PermissionsGuard>
  );
};

export default PermissionWrapper;
