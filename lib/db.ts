import 'server-only'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function readKV<T>(key: string, fallback: T): Promise<T> {
  try {
    const res = await pool.query('SELECT data FROM kv_store WHERE key = $1', [key])
    if (res.rows.length === 0) return fallback
    return res.rows[0].data as T
  } catch {
    return fallback
  }
}

export async function writeKV<T>(key: string, value: T): Promise<void> {
  await pool.query(
    `INSERT INTO kv_store (key, data, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, JSON.stringify(value)]
  )
}
