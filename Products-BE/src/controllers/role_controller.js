import { GetAllRolesService, CreateRoleService, UpdateRoleService, DeleteRoleService} from "../services/role_service.js";

export async function getAllRoles(req, res) {
  try {
    const { q } = req.query;
    const merchantId = req.user?.merchant_id || null; 
    const roles = await GetAllRolesService({ merchantId, q });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
}

export async function createRole(req, res) {
  try {
    const { name, description, permissions } = req.body;
    const merchantId = req.user?.merchant_id || null;
    const roles = await CreateRoleService({ name, description, merchantId, permissions });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to create role" });
  }
}

export async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
    const updated = await UpdateRoleService({ id, name, description, permissions });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
}

export async function deleteRole(req, res) {
  try {
    const { id } = req.params;
    const deleted = await DeleteRoleService(id);
    if (!deleted) return res.status(404).json({ error: "Role not found" });
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete role" });
  }
}
