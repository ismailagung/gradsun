import { describe, expect, it } from "vitest";
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  PERMISSIONS,
  type UserWithPermissions,
} from "@/infrastructure/auth/permissions";

describe("Granular Permission RBAC (TDD)", () => {
  const mockStaffUser: UserWithPermissions = {
    id: "usr-staff-1",
    email: "photographer@gradsun.com",
    permissions: [PERMISSIONS.CAN_UPLOAD_PHOTOS, PERMISSIONS.CAN_VIEW_CALLSHEET],
  };

  const mockAdminUser: UserWithPermissions = {
    id: "usr-admin-1",
    email: "manager@gradsun.com",
    permissions: [
      PERMISSIONS.CAN_MANAGE_PACKAGES,
      PERMISSIONS.CAN_APPROVE_BOOKINGS,
      PERMISSIONS.CAN_UPLOAD_PHOTOS,
      PERMISSIONS.CAN_VIEW_CALLSHEET,
      PERMISSIONS.CAN_MANAGE_STUDIOS,
    ],
  };

  it("verifies single permission correctly with hasPermission", () => {
    expect(hasPermission(mockStaffUser, PERMISSIONS.CAN_UPLOAD_PHOTOS)).toBe(true);
    expect(hasPermission(mockStaffUser, PERMISSIONS.CAN_MANAGE_PACKAGES)).toBe(false);

    expect(hasPermission(mockAdminUser, PERMISSIONS.CAN_MANAGE_PACKAGES)).toBe(true);
    expect(hasPermission(mockAdminUser, PERMISSIONS.CAN_APPROVE_BOOKINGS)).toBe(true);

    // Array of string permissions overload
    expect(hasPermission(["can_upload_photos"], PERMISSIONS.CAN_UPLOAD_PHOTOS)).toBe(true);
    expect(hasPermission([], PERMISSIONS.CAN_UPLOAD_PHOTOS)).toBe(false);
    expect(hasPermission(null, PERMISSIONS.CAN_UPLOAD_PHOTOS)).toBe(false);
  });

  it("verifies all required permissions with hasAllPermissions", () => {
    const required = [PERMISSIONS.CAN_UPLOAD_PHOTOS, PERMISSIONS.CAN_VIEW_CALLSHEET];
    expect(hasAllPermissions(mockStaffUser, required)).toBe(true);

    const fullSuite = [PERMISSIONS.CAN_UPLOAD_PHOTOS, PERMISSIONS.CAN_MANAGE_PACKAGES];
    expect(hasAllPermissions(mockStaffUser, fullSuite)).toBe(false);
    expect(hasAllPermissions(mockAdminUser, fullSuite)).toBe(true);
  });

  it("verifies any matching permission with hasAnyPermission", () => {
    const permissionsToCheck = [PERMISSIONS.CAN_MANAGE_STUDIOS, PERMISSIONS.CAN_UPLOAD_PHOTOS];

    expect(hasAnyPermission(mockStaffUser, permissionsToCheck)).toBe(true);
    expect(hasAnyPermission(mockStaffUser, [PERMISSIONS.CAN_MANAGE_STUDIOS])).toBe(false);
  });
});
