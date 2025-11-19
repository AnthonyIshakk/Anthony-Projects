import 'dotenv/config';
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

pool.connect()
  .then(c => { c.release(); console.log(" Connected to PostgreSQL"); })
  .catch(err => console.error("❌ Connection error:", err.message));
