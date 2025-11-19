import { pool } from "../models/db.js";

//3mol query marra wehde
export async function productsList({ sort, order, limit, offset, merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `SELECT * FROM products 
             WHERE merchant_id = $1 
             ORDER BY ${sort} ${order} 
             LIMIT $2 OFFSET $3`,
      values: [merchantId, limit, offset],
    };
  } else {
    query = {
      text: `SELECT * FROM products
             ORDER BY ${sort} ${order}
             LIMIT $1 OFFSET $2`,
      values: [limit, offset],
    };
  }
  const { rows } = await pool.query(query);
  return rows;
}


export async function CountProducts({ merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `SELECT COUNT(*)::int AS count 
             FROM products 
             WHERE merchant_id = $1`,
      values: [merchantId],
    };
  } else {
    query = {
      text: `SELECT COUNT(*)::int AS count 
             FROM products`,
      values: [],
    };
  }
  const { rows } = await pool.query(query);
  return rows[0].count;
}

export async function SearchProducts({ q, sort, order, limit, offset, merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `SELECT * FROM products 
             WHERE merchant_id = $1 
             AND (title ILIKE $2 OR description ILIKE $2)
             ORDER BY ${sort} ${order} 
             LIMIT $3 OFFSET $4`,
      values: [merchantId, `%${q}%`, limit, offset],
    };
  } else {
    query = {
      text: `SELECT * FROM products 
             WHERE title ILIKE $1 OR description ILIKE $1
             ORDER BY ${sort} ${order} 
             LIMIT $2 OFFSET $3`,
      values: [`%${q}%`, limit, offset],
    };
  }
  const { rows } = await pool.query(query);
  return rows;
}

export async function CountSearch({ q, merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `SELECT COUNT(*)::int AS count 
             FROM products 
             WHERE merchant_id = $1 
             AND (title ILIKE $2 OR description ILIKE $2)`,
      values: [merchantId, `%${q}%`],
    };
  } else {
    query = {
      text: `SELECT COUNT(*)::int AS count 
             FROM products 
             WHERE title ILIKE $1 OR description ILIKE $1`,
      values: [`%${q}%`],
    };
  }
  const { rows } = await pool.query(query);
  return rows[0].count;
}

export async function createProduct({ title, price, description, image_url, merchantId }) {
  const query = {
    text: `INSERT INTO products (title, price, description, image_url, merchant_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
    values: [title, price, description, image_url, merchantId],
  };
  const { rows } = await pool.query(query);
  return rows[0];
}

// make the update only takes what was updated (all updates)
export async function updateProduct({ id, title, price, description, image_url, merchantId, overrideMerchantId }) {
  let query;

  if (overrideMerchantId !== undefined) {
    query = {
      text: `UPDATE products
             SET title = $2, price = $3, description = $4, image_url = COALESCE($5, image_url), merchant_id = $6
             WHERE id = $1
             RETURNING *`,
      values: [id, title, price, description, image_url, overrideMerchantId],
    };
  } else if (merchantId) {
    query = {
      text: `UPDATE products
             SET title = $3, price = $4, description = $5, image_url = COALESCE($6, image_url)
             WHERE id = $1 AND merchant_id = $2
             RETURNING *`,
      values: [id, merchantId, title, price, description, image_url],
    };
  }

  const { rows } = await pool.query(query);
  return rows[0];
}


export async function deleteProduct({ id, merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `DELETE FROM products
             WHERE id = $1 AND merchant_id = $2
             RETURNING *`,
      values: [id, merchantId],
    };
  } else {
    query = {
      text: `DELETE FROM products
             WHERE id = $1
             RETURNING *`,
      values: [id],
    };
  }
  const { rows } = await pool.query(query);
  return rows[0];
}

export async function findProductById({ id, merchantId }) {
  let query;
  if (merchantId) {
    query = {
      text: `SELECT * FROM products 
             WHERE id = $1 AND merchant_id = $2`,
      values: [id, merchantId],
    };
  } else {
    query = {
      text: `SELECT * FROM products 
             WHERE id = $1`,
      values: [id],
    };
  }
  const { rows } = await pool.query(query);
  return rows[0];
}
