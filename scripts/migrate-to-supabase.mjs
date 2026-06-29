// Migrate all local JSON data files to Supabase kv_store table
// Run: node scripts/migrate-to-supabase.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA = path.join(ROOT, 'data')
const PUBLIC = path.join(ROOT, 'public')

// Load env vars from .env.local
const envFile = path.join(ROOT, '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const k = trimmed.slice(0, eq).trim()
    const v = trimmed.slice(eq + 1).trim()
    if (k) process.env[k] = v
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

console.log(`\n📡 Connecting to: ${supabaseUrl}\n`)

function readJson(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

// Direct REST API call to Supabase PostgREST
async function upsert(key, data) {
  const url = `${supabaseUrl}/rest/v1/kv_store`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey,
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ key, data, updated_at: new Date().toISOString() }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`  ❌ ${key} (HTTP ${res.status}): ${text}`)
  } else {
    console.log(`  ✅ ${key}`)
  }
}

// First: verify the table exists
console.log('🔍 Checking kv_store table...')
const checkRes = await fetch(`${supabaseUrl}/rest/v1/kv_store?limit=1`, {
  headers: {
    'Authorization': `Bearer ${serviceKey}`,
    'apikey': serviceKey,
  },
})

if (!checkRes.ok) {
  const text = await checkRes.text()
  console.error(`\n❌ Cannot reach kv_store table (HTTP ${checkRes.status}):`)
  console.error(text)
  console.error('\n👉 Make sure you ran supabase/schema.sql in the Supabase SQL Editor first.')
  process.exit(1)
}
console.log('✅ Table found\n')

console.log('🚀 Migrating data...\n')

await upsert('reviews',           readJson(path.join(DATA, 'reviews.json')))
await upsert('faqs',              readJson(path.join(DATA, 'faqs.json')))
await upsert('settings',          readJson(path.join(DATA, 'settings.json'), { passwordHash: null }))
await upsert('shop_bikes',        readJson(path.join(DATA, 'shop-bikes.json')))
await upsert('reports',           readJson(path.join(DATA, 'reports.json')))
await upsert('weekly_pins',       readJson(path.join(DATA, 'weekly-pins.json')))
await upsert('predefined_routes', readJson(path.join(DATA, 'predefined-routes.json')))

const interestPinsFile = path.join(PUBLIC, 'interest-pins.json')
await upsert('interest_pins', fs.existsSync(interestPinsFile) ? readJson(interestPinsFile) : [])

const poisFile = path.join(PUBLIC, 'tour-pois.json')
await upsert('tour_pois', fs.existsSync(poisFile) ? readJson(poisFile) : [])

console.log('\n✅ Migration complete!')
