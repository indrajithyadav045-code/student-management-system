import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MySQL Connection Pool Configuration
 * Uses environment variables with safe defaults.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campusflow_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

/**
 * Tests database connectivity on application startup.
 * @returns {Promise<boolean>}
 */
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'campusflow_db'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('[Database Connection Error] Could not connect to MySQL:');
    console.error(`- Code: ${error.code || 'UNKNOWN'}`);
    console.error(`- Message: ${error.message || 'Check database credentials in .env and verify MySQL service is running'}`);
    console.error('- Hint: Run the commands in database/schema.sql to create campusflow_db');
    return false;
  }
};

export default pool;
