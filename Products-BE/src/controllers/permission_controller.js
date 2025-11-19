import { GetAllPermissionsService } from "../services/permission_service.js";

export async function getAllPermissions(req, res) {
  try {
    const permissions = await GetAllPermissionsService();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
}
