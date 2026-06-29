import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bqtyoujkaycqejoqahjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdHlvdWprYXljcWVqb3FhaGpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NjgwOCwiZXhwIjoyMDk0NTQyODA4fQ.YO0Gyc9qQfgNca4gKB-uGd8H9q5_pBVJvUlORg-Luog'
)

const { data } = await supabase.from('kv_store').select('data').eq('key', 'shop_bikes').single()
const bikes = data.data

for (const bike of bikes) {
  console.log(`\n=== ${bike.name} ===`)
  console.log('triptychImage:', bike.triptychImage)
  console.log('benefits:')
  bike.benefits.forEach((b, i) => {
    console.log(`  [${i}] n=${b.n} imgSrc=${b.imgSrc ?? 'none'} imgPosition=${b.imgPosition ?? 'none'} imgPositionX=${b.imgPositionX ?? 'none'}`)
  })
}
