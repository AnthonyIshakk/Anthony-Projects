import { pool } from "../models/db.js";

export async function getAllPermissions() {
  const query = {
    text: `SELECT id, name FROM permissions ORDER BY id ASC;`,
  };
  const { rows } = await pool.query(query);
  return rows;
}
