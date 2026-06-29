// Generates a seed SQL file to paste into Supabase SQL Editor
// Run: node scripts/generate-seed-sql.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA = path.join(ROOT, 'data')
const PUBLIC = path.join(ROOT, 'public')

function readJson(filePath, fallback = []) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')) }
  catch { return fallback }
}

const entries = [
  ['reviews',           readJson(path.join(DATA, 'reviews.json'))],
  ['faqs',              readJson(path.join(DATA, 'faqs.json'))],
  ['settings',          readJson(path.join(DATA, 'settings.json'), { passwordHash: null })],
  ['shop_bikes',        readJson(path.join(DATA, 'shop-bikes.json'))],
  ['reports',           readJson(path.join(DATA, 'reports.json'))],
  ['weekly_pins',       readJson(path.join(DATA, 'weekly-pins.json'))],
  ['predefined_routes', readJson(path.join(DATA, 'predefined-routes.json'))],
  ['interest_pins',     fs.existsSync(path.join(PUBLIC, 'interest-pins.json')) ? readJson(path.join(PUBLIC, 'interest-pins.json')) : []],
  ['tour_pois',         fs.existsSync(path.join(PUBLIC, 'tour-pois.json')) ? readJson(path.join(PUBLIC, 'tour-pois.json')) : []],
]

let sql = '-- Drahtesel Website — Data Seed\n-- Paste this in Supabase SQL Editor and click Run\n\n'

for (const [key, data] of entries) {
  const json = JSON.stringify(data).replace(/'/g, "''")
  sql += `INSERT INTO kv_store (key, data, updated_at)\n`
  sql += `VALUES ('${key}', '${json}'::jsonb, now())\n`
  sql += `ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now();\n\n`
}

const outPath = path.join(ROOT, 'supabase', 'seed.sql')
fs.writeFileSync(outPath, sql, 'utf-8')
console.log(`✅ Generated: supabase/seed.sql`)
console.log(`   Paste that file into Supabase → SQL Editor → Run`)
