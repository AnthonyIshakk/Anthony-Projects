import {pool} from "../models/db.js"; 

export async function findUserByEmail({email}) {
    const {rows} = await pool.query({
        text: `SELECT id, name, email, password_hash, merchant_id
               FROM users WHERE email = $1 LIMIT 1`,
        values: [email],
    });
    return rows[0] || null;
}

export async function createUser({name, email, passwordHash, merchantId }){
    const {rows} = await pool.query({
        text: `INSERT INTO users(name, email, password_hash, merchant_id)
              VALUES ($1, $2, $3, $4)
              RETURNING id, name, email, merchant_id`,
        values: [name, email, passwordHash, merchantId],      
    })
    return rows[0]; 
}

export async function findUserById({ id }) {
  const query = {
    text: `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.merchant_id,
        r.name AS role_name,
        COALESCE(json_agg(p.name) FILTER (WHERE p.id IS NOT NULL), '[]') AS permissions
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN rolesToPermissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1
      GROUP BY u.id, r.name;
    `,
    values: [id],
  };

  const { rows } = await pool.query(query);
  return rows[0] || null;
}

