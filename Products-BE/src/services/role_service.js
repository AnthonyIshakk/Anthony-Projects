import { getAllRoles, createRole, updateRole, deleteRole } from "../repositories/role_repo.js";

export async function GetAllRolesService({ merchantId, q }) {
  try {
    const roles = await getAllRoles({ merchantId, q });
    return roles;
  } catch (err) {
    throw new Error("Failed to fetch roles");
  }
}

export async function CreateRoleService({ name, description, merchantId, permissions = [] }) {
  try {
    const role = await createRole({ name, description, merchantId, permissions });
    return role;
  } catch (err) {
    throw new Error("Failed to create role");
  }
}

export async function UpdateRoleService({ id, name, description, permissions }) {
  try {
    const role = await updateRole({ id, name, description, permissions });
    return role;
  } catch (err) {
    throw new Error("Failed to update role");
  }
}

export async function DeleteRoleService(id) {
  try {
    const role = await deleteRole(id);
    return role;
  } catch (err) {
    throw new Error("Failed to delete role");
  }
}