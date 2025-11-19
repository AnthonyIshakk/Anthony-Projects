import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Search, Plus, X, Pencil, Trash2 } from "lucide-react";

export default function RolesPermissionsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    id: null,
    name: "",
    description: "",
    permissions: [],
  });

  const { data: userData } = useApi("/user/profile", "GET", []);
  const user = userData?.user;

  const {
    data,
    loading,
    error,
    makeRequest: fetchRoles,
  } = useApi(`/roles${query ? `?q=${query}` : ""}`, "GET", [query]);

  const { makeRequest: createRole } = useApi("/roles", "POST", null);
  const { makeRequest: updateRole } = useApi("/roles", "PUT", null);
  const { makeRequest: deleteRole } = useApi("/roles", "DELETE", null);

  const { data: permissions } = useApi("/permissions", "GET", []);

  const isAdmin = user?.merchant_id === null;
  const roles = data || [];

  function openModal(role = null) {
    //eza fi role it will work as it is updating it
    if (role) {
      setNewRole({
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.permissions?.map((p) => p.id) || [],
      });
      //here it will work as it is creating a new role
    } else {
      setNewRole({ id: null, name: "", description: "", permissions: [] });
    }
    setIsModalOpen(true);
  }

  function handlePermissionToggle(permId) {
    setNewRole((prev) => {
      const currentPermissions = prev.permissions || []; //current list of selected permissiosn
      const exists = currentPermissions.includes(permId); // eza clicked already aw lae

      return {
        ...prev,
        permissions: exists
          ? currentPermissions.filter((id) => id !== permId)
          : // eza it exists ( pressed already ) remove it
            // .filter btekhla2 new array and it only adds the element that are different that the permId
            [...currentPermissions, permId], //else we add it
      };
    });
  }

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    if (!newRole.name.trim()) {
      alert("Role name is required");
      return;
    }

    const roleData = {
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
    };

    //eza newRole.id exists ye3ne it is edit mode else it is create
    const result = newRole.id
      ? await updateRole(roleData, `/roles/${newRole.id}`)
      : await createRole(roleData);

    //reset on success w fetch the roles aan jdid
    if (result) {
      alert(newRole.id ? "Role updated successfully!" : "Role created!");
      setNewRole({ id: null, name: "", description: "", permissions: [] });
      setIsModalOpen(false);
      fetchRoles();
    } else {
      alert("Failed to save role.");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    const res = await deleteRole(null, `/roles/${id}`);
    if (res) {
      alert("Role deleted successfully!");
      fetchRoles();
    } else {
      alert("Failed to delete role.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading roles...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load roles.</p>;

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500">
            Manage roles and their assigned permissions
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
        >
          <Plus size={16} /> New Role
        </button>
      </div>

      <div className="relative mb-6 max-w-xs">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setQuery(search);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-gray-300 focus:outline-none bg-gray-50"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-gray-700 font-semibold">Role</th>
              {isAdmin && (
                <th className="p-3 text-gray-700 font-semibold">Merchant</th>
              )}
              <th className="p-3 text-gray-700 font-semibold">Permissions</th>
              <th className="p-3 text-gray-700 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">{role.name}</td>
                  {isAdmin && (
                    <td className="p-3 text-gray-600 text-sm">
                      {role.merchant_name || (
                        <span className="italic text-gray-400">Admin</span>
                      )}
                    </td>
                  )}
                  <td className="p-3 flex flex-wrap gap-2">
                    {role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200"
                        >
                          {perm.name.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        No permissions
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => openModal(role)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? "4" : "3"}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {newRole.id ? "Edit Role" : "Add New Role"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Manager"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description..."
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {permissions?.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          //eza l permission already added it will checked otherwise unchecked
                          newRole?.permissions?.includes(perm.id) || false
                        }
                        onChange={() => handlePermissionToggle(perm.id)}
                        className="accent-gray-800"
                      />
                      <span className="text-sm text-gray-700">
                        {perm.name.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  {newRole.id ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
