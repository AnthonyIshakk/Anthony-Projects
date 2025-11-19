import { pool } from "../models/db.js";

export async function createMerchant({ merchantName }) {
  const { rows } = await pool.query({
    text: `INSERT INTO merchants (name) VALUES ($1) RETURNING id, name`,
    values: [merchantName],
  });
  return rows[0];
}

export async function findMerchantByName(merchantName) {
  const { rows } = await pool.query({
    text: `SELECT * FROM merchants WHERE name = $1 LIMIT 1`,
    values: [merchantName],
  });
  return rows[0] || null;
}

export async function findMerchantById(id) {
  const { rows } = await pool.query({
    text: `SELECT * FROM merchants WHERE id = $1`,
    values: [id],
  });
  return rows[0] || null;
}

export async function getAllMerchants() {
  const { rows } = await pool.query(
    "SELECT id, name FROM merchants ORDER BY name ASC"
  );
  return rows;
}