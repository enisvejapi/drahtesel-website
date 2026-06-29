import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqtyoujkaycqejoqahjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdHlvdWprYXljcWVqb3FhaGpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NjgwOCwiZXhwIjoyMDk0NTQyODA4fQ.YO0Gyc9qQfgNca4gKB-uGd8H9q5_pBVJvUlORg-Luog'
)

const { data } = await supabase.from('kv_store').select('data').eq('key', 'shop_bikes').single()
const bikes = data.data

// Distinct images per bike — each card gets its own image
const BENEFIT_IMAGES = {
  'Giant Stormguard E+ 1': [
    '/stormguard-side.png',       // card 01
    '/stormguard-detail.jpg',     // card 02
    '/hero/bikes/stormguard-hinten.png', // card 03
  ],
  'Momentum PakYak E+': [
    '/pakyak-details.png',                // card 01
    '/hero/bikes/pak-yak-ebike.jpg',      // card 02
    '/pakyak-hero.png',                   // card 03
    // card 04 — use the mobile hero we uploaded
    'https://bqtyoujkaycqejoqahjj.supabase.co/storage/v1/object/public/uploads/bikes/momentum-pakyak-hero-mobile.jpg',
  ],
}

const updatedBikes = bikes.map(bike => {
  const images = BENEFIT_IMAGES[bike.name]
  if (!images) return bike

  const updatedBenefits = bike.benefits.map((b, i) => ({
    ...b,
    imgSrc: images[i] ?? b.imgSrc ?? undefined,
  }))

  console.log(`\n=== ${bike.name} ===`)
  updatedBenefits.forEach((b, i) => console.log(`  [${i}] card ${b.n} → ${b.imgSrc}`))

  return { ...bike, benefits: updatedBenefits }
})

const { error } = await supabase
  .from('kv_store')
  .upsert({ key: 'shop_bikes', data: updatedBikes, updated_at: new Date().toISOString() })

if (error) { console.error('Save failed:', error); process.exit(1) }
console.log('\n✓ Benefit images updated successfully')
