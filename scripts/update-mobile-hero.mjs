// Script: upload mobile hero images to Supabase and update shop_bikes data
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const SUPABASE_URL = 'https://bqtyoujkaycqejoqahjj.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdHlvdWprYXljcWVqb3FhaGpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NjgwOCwiZXhwIjoyMDk0NTQyODA4fQ.YO0Gyc9qQfgNca4gKB-uGd8H9q5_pBVJvUlORg-Luog'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const STORMGUARD_PATH = resolve('C:/Users/enisv/Downloads/Convert_the_uploaded_image_from_202605171130.jpeg')
const PAKYAK_PATH     = resolve('C:/Users/enisv/Downloads/Convert_the_uploaded_image_from_202605171130 (1).jpeg')

async function uploadImage(filePath, fileName) {
  const bytes = readFileSync(filePath)
  const storagePath = `bikes/${fileName}`

  // Delete existing if present
  await supabase.storage.from('uploads').remove([storagePath])

  const { error } = await supabase.storage
    .from('uploads')
    .upload(storagePath, bytes, { contentType: 'image/jpeg', upsert: true })

  if (error) throw new Error(`Upload failed for ${fileName}: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(storagePath)

  console.log(`✓ Uploaded ${fileName} → ${publicUrl}`)
  return publicUrl
}

async function main() {
  console.log('Uploading mobile hero images...')

  const stormguardUrl = await uploadImage(STORMGUARD_PATH, 'stormguard-e1-hero-mobile.jpg')
  const pakyakUrl     = await uploadImage(PAKYAK_PATH,     'momentum-pakyak-hero-mobile.jpg')

  // Read current bike data
  const { data, error } = await supabase
    .from('kv_store')
    .select('data')
    .eq('key', 'shop_bikes')
    .single()

  if (error || !data) {
    console.error('Failed to read shop_bikes:', error)
    return
  }

  const bikes = data.data
  console.log(`\nFound ${bikes.length} bike(s):`)
  bikes.forEach((b, i) => console.log(`  [${i}] ${b.name}`))

  let updated = 0
  const updatedBikes = bikes.map(bike => {
    const nameLower = bike.name.toLowerCase()
    if (nameLower.includes('stormguard')) {
      console.log(`\n→ Setting mobile hero for: ${bike.name}`)
      updated++
      return { ...bike, heroImageMobile: stormguardUrl }
    }
    if (nameLower.includes('pakyak') || nameLower.includes('pak yak')) {
      console.log(`\n→ Setting mobile hero for: ${bike.name}`)
      updated++
      return { ...bike, heroImageMobile: pakyakUrl }
    }
    return bike
  })

  if (updated === 0) {
    console.log('\n⚠ No matching bikes found. Bike names in DB:')
    bikes.forEach(b => console.log(`  "${b.name}"`))
    console.log('\nMobile hero URLs for manual update:')
    console.log('  Stormguard:', stormguardUrl)
    console.log('  PakYak:', pakyakUrl)
    return
  }

  // Save updated bikes
  const { error: writeError } = await supabase
    .from('kv_store')
    .upsert({ key: 'shop_bikes', data: updatedBikes, updated_at: new Date().toISOString() })

  if (writeError) {
    console.error('Failed to save bikes:', writeError)
    return
  }

  console.log(`\n✓ Updated ${updated} bike(s) with mobile hero images`)
  console.log('\nMobile hero URLs:')
  console.log('  Stormguard:', stormguardUrl)
  console.log('  PakYak:', pakyakUrl)
}

main().catch(console.error)
