import { createPool } from 'mysql2/promise';

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: 10
      });
      console.log('Database pool established.');
    } catch (error) {
      console.error('Error creating database pool:', error);
      throw error;
    }
  }
  return pool;
}

async function query(sql, values) {
  try {
    console.log("values", values);
    const connection = await (await getPool()).getConnection(); 
    const [rows] = await connection.execute(sql, values);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default { query };