import _ from "lodash";

export const permissionCheck = (permissions: number | string, checkedPermission: number) => {
  if (_.isString(permissions)) {
    permissions = parseInt(permissions);
  }

  return (permissions & checkedPermission) == checkedPermission;
};
