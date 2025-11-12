import mysql, { PoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'accounterp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getConnection(): Promise<PoolConnection> {
  return pool.getConnection();
}

export async function testConnection(): Promise<void> {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log('✓ تم الاتصال بقاعدة البيانات بنجاح');
  } catch (error) {
    console.error('✗ فشل الاتصال بقاعدة البيانات:', error);
    process.exit(1);
  }
}

export default pool;
