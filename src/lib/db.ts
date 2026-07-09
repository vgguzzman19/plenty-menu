import { Pool } from "pg";

// Prueba de auto-deploy VPS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
