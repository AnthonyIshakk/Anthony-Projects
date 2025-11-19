import { getAllPermissions } from "../repositories/permission_repo.js";

export async function GetAllPermissionsService() {
  try {
    const permissions = await getAllPermissions();
    return permissions;
  } catch (err) {
    throw new Error("Failed to fetch permissions");
  }
}
