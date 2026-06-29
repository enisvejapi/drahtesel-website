import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabase = createClient(
  'https://bqtyoujkaycqejoqahjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdHlvdWprYXljcWVqb3FhaGpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NjgwOCwiZXhwIjoyMDk0NTQyODA4fQ.YO0Gyc9qQfgNca4gKB-uGd8H9q5_pBVJvUlORg-Luog'
)

const src = 'C:/Users/enisv/Desktop/New folder/drahtesel-website/public/stormguard-triptych-v2.png'

// Get image dimensions
const meta = await sharp(src).metadata()
const { width, height } = meta
console.log(`Image size: ${width}x${height}`)

const panelW = Math.floor(width / 3)

// Crop each of the 3 panels
const panels = [
  { left: 0,           name: 'stormguard-card-1.jpg' },
  { left: panelW,      name: 'stormguard-card-2.jpg' },
  { left: panelW * 2,  name: 'stormguard-card-3.jpg' },
]

const publicDir = 'C:/Users/enisv/Desktop/New folder/drahtesel-website/public'
const uploadedUrls = []

for (const panel of panels) {
  const outPath = `${publicDir}/${panel.name}`

  await sharp(src)
    .extract({ left: panel.left, top: 0, width: panelW, height })
    .jpeg({ quality: 92 })
    .toFile(outPath)

  console.log(`✓ Cropped ${panel.name}`)

  // Upload to Supabase storage
  const bytes = readFileSync(outPath)
  const storagePath = `bikes/${panel.name}`
  await supabase.storage.from('uploads').remove([storagePath])
  const { error } = await supabase.storage.from('uploads').upload(storagePath, bytes, {
    contentType: 'image/jpeg', upsert: true
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(storagePath)
  uploadedUrls.push(publicUrl)
  console.log(`✓ Uploaded → ${publicUrl}`)
}

// Update Stormguard benefit cards in Supabase
const { data } = await supabase.from('kv_store').select('data').eq('key', 'shop_bikes').single()
const bikes = data.data

const updatedBikes = bikes.map(bike => {
  if (!bike.name.includes('Stormguard')) return bike

  const updatedBenefits = bike.benefits.map((b, i) => ({
    ...b,
    imgSrc: uploadedUrls[i] ?? b.imgSrc,
  }))

  console.log(`\nUpdated ${bike.name} benefit cards:`)
  updatedBenefits.forEach((b, i) => console.log(`  Card ${b.n}: ${b.imgSrc}`))

  return { ...bike, benefits: updatedBenefits }
})

const { error: saveErr } = await supabase
  .from('kv_store')
  .upsert({ key: 'shop_bikes', data: updatedBikes, updated_at: new Date().toISOString() })

if (saveErr) throw saveErr
console.log('\n✓ Stormguard benefit cards updated with individual panel images')
