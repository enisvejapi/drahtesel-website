import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqtyoujkaycqejoqahjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdHlvdWprYXljcWVqb3FhaGpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NjgwOCwiZXhwIjoyMDk0NTQyODA4fQ.YO0Gyc9qQfgNca4gKB-uGd8H9q5_pBVJvUlORg-Luog'
)

const { data } = await supabase.from('kv_store').select('data').eq('key', 'shop_bikes').single()
const bikes = data.data

// Remove imgSrc from all benefit cards, fix PakYak positions to be distinct
const updatedBikes = bikes.map(bike => {
  const updatedBenefits = bike.benefits.map((b, i) => {
    const cleaned = { ...b }
    delete cleaned.imgSrc  // remove imgSrc from all cards

    // Fix PakYak: spread 4 cards across image (was 0,100,0,100 — now 0,33,66,100)
    if (bike.name.includes('PakYak') || bike.name.includes('Pak Yak')) {
      const positions = [0, 33, 66, 100]
      cleaned.imgPositionX = positions[i] ?? cleaned.imgPositionX
      cleaned.imgPositionY = 50
    }
    return cleaned
  })

  console.log(`\n=== ${bike.name} ===`)
  updatedBenefits.forEach((b, i) =>
    console.log(`  [${i}] imgSrc=${b.imgSrc ?? 'none'} posX=${b.imgPositionX ?? 'n/a'} posY=${b.imgPositionY ?? 'n/a'} pos=${b.imgPosition ?? 'n/a'}`)
  )

  return { ...bike, benefits: updatedBenefits }
})

const { error } = await supabase
  .from('kv_store')
  .upsert({ key: 'shop_bikes', data: updatedBikes, updated_at: new Date().toISOString() })

if (error) { console.error('Failed:', error); process.exit(1) }
console.log('\n✓ Reverted — benefit cards use triptych image again, PakYak positions fixed')
