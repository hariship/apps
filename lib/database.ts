import { Pool, PoolClient } from 'pg';

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('Database pool created with URL:', databaseUrl.replace(/password=[^&]+/, 'password=****'));
  }
  return pool;
};

export const getClient = async (): Promise<PoolClient> => {
  const pool = getPool();
  return await pool.connect();
};