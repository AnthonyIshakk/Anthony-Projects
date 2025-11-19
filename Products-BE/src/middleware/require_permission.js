import { pool } from "../models/db.js";

export function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "No user " });
      }

      const query = {
        text: `
          SELECT p.name AS permission_name
          FROM roles r
          JOIN rolesToPermissions rp ON r.id = rp.role_id
          JOIN permissions p ON rp.permission_id = p.id
          WHERE r.id = (
            SELECT role_id FROM users WHERE id = $1
          )
        `,
        values: [user.sub],
      };

      const { rows } = await pool.query(query);
      const userPermissions = rows.map((row) => row.permission_name);

      if (!userPermissions.includes(permissionName)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  };
}
