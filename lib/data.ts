export type Bike = {
  id: string
  slug: string
  name: string
  category: string
  tagline: string
  tagline_en?: string
  description: string
  description_en?: string
  image: string
  images: string[]
  specs: {
    frame: string
    gears: string
    wheels: string
    weight: string
    suitableFor: string
  }
  included: string[]
  pricing: {
    fullDay: number
    threeDays: number
    week: number
  }
  rating: number
  reviews: number
  popular: boolean
  badge?: string
  lastServiced: string
}

export const bikes: Bike[] = [
  {
    id: '1',
    slug: 'city-cruiser-7',
    name: 'City Cruiser 7',
    category: 'City Bike',
    tagline: 'Perfect for exploring the city comfortably',
    description: 'The City Cruiser 7 is our most popular bike for urban explorers. With its upright riding position, 7-speed gear system, and comfortable saddle, it is ideal for sightseeing, daily commutes, or leisurely rides through the city. Lightweight and easy to handle, even for occasional riders.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
    ],
    specs: {
      frame: '45cm / 50cm / 55cm',
      gears: '7-speed Shimano',
      wheels: '28 inch',
      weight: '13 kg',
      suitableFor: 'City, light touring',
    },
    included: ['Helmet', 'Lock', 'Basket', 'Repair kit', 'City map'],
    pricing: { fullDay: 28, threeDays: 72, week: 140 },
    rating: 4.9,
    reviews: 48,
    popular: true,
    badge: 'Most Popular',
    lastServiced: 'March 2026',
  },
  {
    id: '2',
    slug: 'trekking-pro-21',
    name: 'Trekking Pro 21',
    category: 'Trekking',
    tagline: 'Built for longer distances and mixed terrain',
    description: 'The Trekking Pro 21 is built for those who want to go further. With 21 gears, front suspension, and a robust frame, it handles both city streets and light gravel paths with ease. Ideal for day trips, longer tours, and riders who want more control on varied terrain.',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
    ],
    specs: {
      frame: '48cm / 52cm / 56cm',
      gears: '21-speed Shimano',
      wheels: '28 inch',
      weight: '14.5 kg',
      suitableFor: 'City, touring, light gravel',
    },
    included: ['Helmet', 'Lock', 'Saddlebag', 'Repair kit', 'Route map'],
    pricing: { fullDay: 34, threeDays: 89, week: 169 },
    rating: 4.8,
    reviews: 31,
    popular: false,
    lastServiced: 'February 2026',
  },
  {
    id: '3',
    slug: 'ebike-comfort-plus',
    name: 'E-Bike Comfort Plus',
    category: 'E-Bike',
    tagline: 'Electric assist for effortless, longer rides',
    description: 'The E-Bike Comfort Plus gives you the freedom to go further without breaking a sweat. The Bosch motor provides smooth pedal assist up to 25 km/h with a range of up to 80 km on a single charge. Perfect for hills, longer distances, or anyone who wants to arrive fresh.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
    ],
    specs: {
      frame: '46cm / 50cm / 54cm',
      gears: '8-speed Shimano',
      wheels: '28 inch',
      weight: '22 kg',
      suitableFor: 'City, touring, hills',
    },
    included: ['Helmet', 'Lock', 'Charger', 'Basket', 'Repair kit'],
    pricing: { fullDay: 55, threeDays: 145, week: 269 },
    rating: 4.9,
    reviews: 62,
    popular: true,
    badge: 'Best Seller',
    lastServiced: 'March 2026',
  },
  {
    id: '4',
    slug: 'kids-bike-20',
    name: 'Kids Bike 20"',
    category: 'Kids',
    tagline: 'Safe and fun for children aged 6–10',
    description: 'Our Kids Bike is designed with safety first. With reliable brakes, a lightweight aluminum frame, and a fun design, it is perfect for younger riders aged 6–10. Great for family rides through the park or exploring the city together.',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
    ],
    specs: {
      frame: '20 inch wheel (one size)',
      gears: '6-speed',
      wheels: '20 inch',
      weight: '9 kg',
      suitableFor: 'Ages 6–10, city, park',
    },
    included: ['Helmet (required)', 'Lock'],
    pricing: { fullDay: 16, threeDays: 42, week: 79 },
    rating: 4.8,
    reviews: 27,
    popular: false,
    badge: 'Family Pick',
    lastServiced: 'March 2026',
  },
  {
    id: '5',
    slug: 'cargo-family',
    name: 'Cargo Family Bike',
    category: 'Cargo',
    tagline: 'Carry kids or cargo — built for family adventures',
    description: 'The Cargo Family Bike is the ultimate family hauler. With a spacious front cargo box that holds up to 2 children or 100 kg of cargo, it makes family outings easy and fun. Electric assist available. Perfect for families with young children.',
    image: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80',
    ],
    specs: {
      frame: 'One size (adjustable)',
      gears: '8-speed Shimano',
      wheels: '26/20 inch',
      weight: '35 kg',
      suitableFor: 'Families, cargo, city',
    },
    included: ['Helmet (adult)', '2x Child helmet', 'Lock', 'Rain cover'],
    pricing: { fullDay: 65, threeDays: 170, week: 310 },
    rating: 4.7,
    reviews: 19,
    popular: false,
    badge: 'Family Friendly',
    lastServiced: 'February 2026',
  },
  {
    id: '6',
    slug: 'mountain-hardtail',
    name: 'Mountain Hardtail',
    category: 'Mountain Bike',
    tagline: 'Tackle trails and hills with confidence',
    description: 'The Mountain Hardtail is built for those who want to go off-road. With front suspension, 21 speeds, and knobby tires, it handles gravel, forest trails, and mountain paths. For experienced riders looking for adventure beyond the city.',
    image: 'https://images.unsplash.com/photo-1544191696-102dbeb4abaa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544191696-102dbeb4abaa?w=800&q=80',
    ],
    specs: {
      frame: '17" / 19" / 21"',
      gears: '21-speed Shimano',
      wheels: '29 inch',
      weight: '13.5 kg',
      suitableFor: 'Trails, gravel, off-road',
    },
    included: ['Helmet', 'Lock', 'Gloves', 'Repair kit'],
    pricing: { fullDay: 44, threeDays: 115, week: 210 },
    rating: 4.7,
    reviews: 22,
    popular: false,
    lastServiced: 'January 2026',
  },
]

export const categories = [
  { name: 'E-Bike', icon: '⚡', description: 'Electric assist, go further', slug: 'e-bike' },
  { name: 'City Bike', icon: '🚲', description: 'Comfortable urban riding', slug: 'city-bike' },
  { name: 'Kinderrad', icon: '👶', description: 'Safe fun for children', slug: 'kinderrad' },
  { name: 'Anhänger', icon: '🐕', description: 'For family and cargo', slug: 'anhaenger' },
  { name: 'E-Lastenrad', icon: '📦', description: 'Electric cargo bike', slug: 'e-lastenrad' },
  { name: 'E-Mobil', icon: '🛵', description: 'Electric mobility', slug: 'e-mobil' },
]

export const reviews = [
  {
    name: 'Sarah M.',
    date: 'March 2026',
    rating: 5,
    text: 'Absolutely brilliant! The bikes were in perfect condition, pickup was super easy, and the staff were incredibly helpful. We explored the whole city in one day. Will definitely book again!',
    source: 'Google',
  },
  {
    name: 'Thomas K.',
    date: 'February 2026',
    rating: 5,
    text: 'Rented the e-bike for a full day and it was the best decision. The range was excellent — we covered 60+ km without any issues. The booking process was straightforward and the bike was ready when we arrived.',
    source: 'Google',
  },
  {
    name: 'Familie Bauer',
    date: 'February 2026',
    rating: 5,
    text: 'Took the cargo bike with our two kids. Everything was perfectly prepared — helmets for the children, rain cover, clear instructions. The kids loved it. Great local business!',
    source: 'Google',
  },
]

export const faqs = [
  {
    question: "What's included with every rental?",
    answer: 'Every rental includes a helmet, a quality lock, and a repair kit. Depending on the bike, you may also get a basket, saddlebag, city map, or child helmets. Check the individual bike page for what\'s included.'
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes. You can cancel free of charge up to 24 hours before your scheduled pickup. Cancellations made less than 24 hours before are non-refundable. See our full cancellation policy in the FAQ page.'
  },
  {
    question: 'Is there a deposit required?',
    answer: 'A deposit may be required at pickup depending on the bike type. For standard city bikes, no deposit is required. For e-bikes and cargo bikes, a refundable deposit of €50–€100 applies.'
  },
  {
    question: 'What happens if I return late?',
    answer: 'If you\'re running late, please call or message us as soon as possible. Late returns are charged at a prorated hourly rate. We are flexible — just communicate with us in advance.'
  },
  {
    question: 'Do I need to bring ID?',
    answer: 'Yes, please bring a valid government-issued ID or passport at pickup. This is required for all rentals.'
  },
  {
    question: 'What if the bike breaks down?',
    answer: 'In the unlikely event of a mechanical issue, call our support line. We will do our best to assist you or arrange a replacement. All our bikes are professionally maintained before each rental.'
  },
]
