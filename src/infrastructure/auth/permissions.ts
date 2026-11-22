export const PERMISSIONS = {
  CAN_MANAGE_PACKAGES: "can_manage_packages",
  CAN_APPROVE_BOOKINGS: "can_approve_bookings",
  CAN_UPLOAD_PHOTOS: "can_upload_photos",
  CAN_VIEW_CALLSHEET: "can_view_callsheet",
  CAN_MANAGE_STUDIOS: "can_manage_studios",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface UserWithPermissions {
  id: string;
  email: string;
  permissions: string[];
}

export function hasPermission(
  userPermissions: string[] | UserWithPermissions | undefined | null,
  requiredPermission: PermissionKey,
): boolean {
  if (!userPermissions) return false;
  const list = Array.isArray(userPermissions) ? userPermissions : userPermissions.permissions;
  return list.includes(requiredPermission);
}

export function hasAllPermissions(
  userPermissions: string[] | UserWithPermissions | undefined | null,
  requiredPermissions: PermissionKey[],
): boolean {
  return requiredPermissions.every((perm) => hasPermission(userPermissions, perm));
}

export function hasAnyPermission(
  userPermissions: string[] | UserWithPermissions | undefined | null,
  requiredPermissions: PermissionKey[],
): boolean {
  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}
