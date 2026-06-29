// Run: node scripts/set-password.mjs
// Sets the admin password hash in data/settings.json

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

const PASSWORD = process.argv[2] || 'drahtesel-admin-2026'

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      if (err) reject(err)
      else resolve(`${salt}:${key.toString('hex')}`)
    })
  })
}

const hash = await hashPassword(PASSWORD)

let settings = {}
try {
  settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'))
} catch {}

settings.passwordHash = hash
fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8')

console.log('Password hash saved to data/settings.json')
console.log('Password set to:', PASSWORD)
