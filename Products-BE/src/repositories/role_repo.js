import { pool } from "../models/db.js";

export async function getAllRoles({ merchantId, q }) {
  let query;

  /*
    roles r LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id : 
      Hayde ye3ne for each role, 3tine all the rows from roles table
      ma3 the matching rows from the rolesToPermissions table. 
      In case, ma fi match bet 7ott null bel right side.

      LEFT JOIN permission p ON p.id = rp.permission_id :
      Hon for each result we got abel, give me the row where permission id matches rp.permission_id
  */

  if (!merchantId) { //hayde kermel l admin to show all roles
    if (q) {
      query = {
        text: `
          SELECT 
            r.id AS role_id,
            r.name AS role_name,
            r.merchant_id AS role_merchant_id,
            m.name AS merchant_name,
            p.id AS permission_id,
            p.name AS permission_name
          FROM roles r
          LEFT JOIN merchants m ON r.merchant_id = m.id
          LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON p.id = rp.permission_id
          WHERE r.name ILIKE $1
          ORDER BY r.id ASC
        `,
        values: [`%${q}%`],
      };
    } else {
      query = {
        text: `
          SELECT 
            r.id AS role_id,
            r.name AS role_name,
            r.merchant_id AS role_merchant_id,
            m.name AS merchant_name,
            p.id AS permission_id,
            p.name AS permission_name
          FROM roles r
          LEFT JOIN merchants m ON r.merchant_id = m.id
          LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON p.id = rp.permission_id
          ORDER BY r.id ASC
        `,
        values: [],
      };
    }
  } else {      //hon jermel l merchant ta yshuf only the roles created for the merchant itself
    if (q) {
      query = {
        text: `
          SELECT 
            r.id AS role_id,
            r.name AS role_name,
            r.merchant_id AS role_merchant_id,
            m.name AS merchant_name,
            p.id AS permission_id,
            p.name AS permission_name
          FROM roles r
          LEFT JOIN merchants m ON r.merchant_id = m.id
          LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON p.id = rp.permission_id
          WHERE r.merchant_id = $1 AND r.name ILIKE $2
          ORDER BY r.id ASC
        `,
        values: [merchantId, `%${q}%`],
      };
    } else {
      query = {
        text: `
          SELECT 
            r.id AS role_id,
            r.name AS role_name,
            r.merchant_id AS role_merchant_id,
            m.name AS merchant_name,
            p.id AS permission_id,
            p.name AS permission_name
          FROM roles r
          LEFT JOIN merchants m ON r.merchant_id = m.id
          LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON p.id = rp.permission_id
          WHERE r.merchant_id = $1
          ORDER BY r.id ASC
        `,
        values: [merchantId],
      };
    }
  }

  const { rows } = await pool.query(query);

  const rolesMap = new Map();

  for (const row of rows) { // aam na3mol loop over each row fom the results
    let role = rolesMap.get(row.role_id);  //if this returns undefined then it is new so we add it
    if (!role) {
      role = {
        id: row.role_id,
        name: row.role_name,
        merchant_id: row.role_merchant_id,
        merchant_name: row.merchant_name || null,
        permissions: [],
      };
      rolesMap.set(row.role_id, role);
    }

    if (row.permission_id) {
      role.permissions.push({
        id: row.permission_id,
        name: row.permission_name,
      });
    }
  }

  const roles = []; 
  for(const role of rolesMap.values()){
    roles.push(role);
  }
  return roles;
}

export async function createRole({ name, description, merchantId, permissions = [] }) {
  const RoleQuery = {
    text: `
      INSERT INTO roles (name, description, merchant_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, merchant_id;
    `,
    values: [name, description, merchantId],
  };

  const { rows } = await pool.query(RoleQuery);
  const role = rows[0];

  if (permissions.length > 0) {
  for (const permId of permissions) {
    await pool.query(
      `INSERT INTO rolesToPermissions (role_id, permission_id) VALUES ($1, $2);`,
      [role.id, permId]
    );
  }
}
return role;

}

export async function updateRole({ id, name, description, permissions }) {
  const updateQuery = `
    UPDATE roles
    SET name = $1, description = $2
    WHERE id = $3
    RETURNING id, name, description, merchant_id;
  `;
  const { rows } = await pool.query(updateQuery, [name, description, id]);
  const updatedRole = rows[0];

  if (permissions && permissions.length) {
    await pool.query(`DELETE FROM rolesToPermissions WHERE role_id = $1`, [id]);

    for (const permId of permissions) {
      await pool.query(
        `INSERT INTO rolesToPermissions (role_id, permission_id) VALUES ($1, $2)`,
        [id, permId]
      );
    }
  }
  return updatedRole;
}


export async function deleteRole(id) {
  await pool.query(`DELETE FROM rolesToPermissions WHERE role_id = $1`, [id]);
  const { rows } = await pool.query(
    `DELETE FROM roles WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}


