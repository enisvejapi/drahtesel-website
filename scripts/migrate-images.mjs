#!/usr/bin/env node
/**
 * One-time migration: downloads all Supabase Storage images into
 * /app/public/uploads/migrated/ and rewrites the DB URLs to local paths.
 * Run inside the container: node scripts/migrate-images.mjs
 */
import { Pool } from 'pg'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const LOCAL_DIR = '/app/public/uploads/migrated'
const LOCAL_URL_PREFIX = '/uploads/migrated'

function findSupabaseUrls(obj, found = new Set()) {
  if (typeof obj === 'string') {
    if (obj.includes('supabase.co/storage')) found.add(obj)
    return found
  }
  if (Array.isArray(obj)) obj.forEach(v => findSupabaseUrls(v, found))
  else if (obj && typeof obj === 'object') Object.values(obj).forEach(v => findSupabaseUrls(v, found))
  return found
}

function replaceUrls(obj, urlMap) {
  if (typeof obj === 'string') return urlMap.get(obj) ?? obj
  if (Array.isArray(obj)) return obj.map(v => replaceUrls(v, urlMap))
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = replaceUrls(v, urlMap)
    return out
  }
  return obj
}

async function download(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const ext = extname(new URL(url).pathname).split('?')[0] || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  await writeFile(join(LOCAL_DIR, filename), buf)
  return `${LOCAL_URL_PREFIX}/${filename}`
}

async function main() {
  await mkdir(LOCAL_DIR, { recursive: true })
  const { rows } = await pool.query('SELECT key, data FROM kv_store ORDER BY key')
  let total = 0

  for (const row of rows) {
    const urls = findSupabaseUrls(row.data)
    if (urls.size === 0) continue

    console.log(`\n[${row.key}] — ${urls.size} Supabase URL(s) found`)
    const urlMap = new Map()

    for (const url of urls) {
      try {
        const local = await download(url)
        urlMap.set(url, local)
        console.log(`  ✓  ...${url.slice(-55)}`)
        console.log(`     → ${local}`)
        total++
      } catch (e) {
        console.error(`  ✗  Failed (${e.message}): ${url.slice(-60)}`)
      }
    }

    if (urlMap.size > 0) {
      const updated = replaceUrls(row.data, urlMap)
      await pool.query(
        `UPDATE kv_store SET data = $1::jsonb, updated_at = now() WHERE key = $2`,
        [JSON.stringify(updated), row.key]
      )
      console.log(`  → DB updated for [${row.key}]`)
    }
  }

  console.log(`\n✅ Done — ${total} image(s) migrated to ${LOCAL_URL_PREFIX}/`)
  await pool.end()
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
