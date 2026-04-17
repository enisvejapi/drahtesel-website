export type PinCategory = 'history' | 'beach' | 'nature' | 'food' | 'viewpoint' | 'landmark'

export interface InterestPin {
  id: string
  title: { de: string; en: string }
  description: { de: string; en: string }
  tip: { de: string; en: string }
  category: PinCategory
  lat: number
  lng: number
  image?: string       // main hero image URL
  images?: string[]    // gallery sub-images
}

export const PIN_CATEGORIES: Record<PinCategory, {
  emoji: string
  color: string
  label: { de: string; en: string }
}> = {
  history:   { emoji: '🏛️', color: '#8B5CF6', label: { de: 'Geschichte',        en: 'History'    } },
  beach:     { emoji: '🏖️', color: '#0EA5E9', label: { de: 'Strand',            en: 'Beach'      } },
  nature:    { emoji: '🌿', color: '#16A34A', label: { de: 'Natur',             en: 'Nature'     } },
  food:      { emoji: '🍽️', color: '#F59E0B', label: { de: 'Essen & Trinken',   en: 'Food'       } },
  viewpoint: { emoji: '👁️', color: '#EC4899', label: { de: 'Aussichtspunkt',    en: 'Viewpoint'  } },
  landmark:  { emoji: '📍', color: '#C8102E', label: { de: 'Sehenswürdigkeit',  en: 'Landmark'   } },
}

export const DEFAULT_PINS: InterestPin[] = [
  {
    id: 'leuchtturm',
    title: { de: 'Leuchtturm Norderney', en: 'Norderney Lighthouse' },
    description: {
      de: 'Der ikonische Leuchtturm aus dem Jahr 1874 im Osten der Insel. Mit 55 Metern Höhe bietet er einen atemberaubenden Blick über die gesamte Insel und das Wattenmeer.',
      en: 'The iconic 1874 lighthouse at the eastern tip of the island. At 55 meters tall it offers a breathtaking view over the entire island and the Wadden Sea.',
    },
    tip: {
      de: 'Früh morgens fahren — kaum Touristen, goldenes Licht. Perfekt mit dem E-Bike.',
      en: 'Go early morning — barely any tourists, golden light. Perfect by e-bike.',
    },
    category: 'landmark',
    lat: 53.7121, lng: 7.2292,
  },
  {
    id: 'weststrand',
    title: { de: 'Weststrand', en: 'West Beach' },
    description: {
      de: 'Der wildeste und einsamste Strand der Insel — kein Strandbetrieb, nur endloser weißer Sand und die offene Nordsee.',
      en: 'The wildest and most secluded beach on the island — no facilities, just endless white sand and the open North Sea.',
    },
    tip: {
      de: 'Kite-Surfer und Seehunde sieht man hier oft. Nur mit Fahrrad gut erreichbar.',
      en: 'Kite surfers and seals are often spotted here. Best reached by bike.',
    },
    category: 'beach',
    lat: 53.7082, lng: 7.1381,
  },
  {
    id: 'nordstrand',
    title: { de: 'Nordstrand', en: 'North Beach' },
    description: {
      de: 'Der beliebteste Strandabschnitt — breiter Sandstrand mit Strandkörben und Strandcafés. Perfekt für Familien mit Kindern.',
      en: 'The most popular beach stretch — wide sandy beach with beach chairs and cafés. Perfect for families with kids.',
    },
    tip: {
      de: 'Ein Strandkorb lohnt sich — Windschutz und trotzdem volle Sonne.',
      en: 'A beach chair is worth it — wind protection while still getting full sun.',
    },
    category: 'beach',
    lat: 53.7198, lng: 7.1650,
  },
  {
    id: 'conversationshaus',
    title: { de: 'Conversationshaus', en: 'Conversationshaus' },
    description: {
      de: 'Das historische Herzstück von Norderney. Erbaut 1840 als gesellschaftliches Zentrum des Seebades — heute Veranstaltungsort und Kulturzentrum.',
      en: 'The historic heart of Norderney. Built in 1840 as the social hub of the seaside resort — today an event and cultural center.',
    },
    tip: {
      de: 'Schau auf die Veranstaltungen — Konzerte und Ausstellungen finden hier regelmäßig statt.',
      en: 'Check the events calendar — concerts and exhibitions are held here regularly.',
    },
    category: 'history',
    lat: 53.7090, lng: 7.1510,
  },
  {
    id: 'duenen',
    title: { de: 'Große Dünen', en: 'Great Dunes' },
    description: {
      de: 'Die größten Wanderdünen der deutschen Nordseeküste. Einige Dünen erreichen 20 Meter Höhe — ein Naturspektakel mitten auf der Insel.',
      en: 'The largest shifting dunes on the German North Sea coast. Some reach 20 meters high — a natural spectacle in the middle of the island.',
    },
    tip: {
      de: 'Mit dem Fahrrad bis zum Rand, dann zu Fuß auf die Düne. Sonnenuntergang hier ist magisch.',
      en: 'Bike to the edge, then walk up on foot. Sunset here is absolutely magical.',
    },
    category: 'nature',
    lat: 53.7150, lng: 7.1900,
  },
  {
    id: 'hafen',
    title: { de: 'Hafen Norderney', en: 'Norderney Harbor' },
    description: {
      de: 'Der lebendige Hafen — Fähren, Fischerboote und Segelschiffe. Hier kommen die Tagesgäste an und die Fischer bringen ihren Fang.',
      en: 'The lively harbor — ferries, fishing boats and sailboats. Day visitors arrive here and fishermen bring in the fresh catch.',
    },
    tip: {
      de: 'Frischen Fisch direkt vom Boot kaufen — morgens zwischen 7 und 9 Uhr.',
      en: 'Buy fresh fish straight from the boat — mornings between 7 and 9 AM.',
    },
    category: 'food',
    lat: 53.7040, lng: 7.1620,
  },
  {
    id: 'wattenmeer',
    title: { de: 'Wattenmeer Südküste', en: 'Wadden Sea South Coast' },
    description: {
      de: 'UNESCO-Weltnaturerbe direkt vor der Tür. Bei Ebbe wird das Watt freigelegt — ein einzigartiges Ökosystem voller Vögel, Krabben und Wattwürmer.',
      en: 'UNESCO World Natural Heritage right on your doorstep. At low tide the mudflats are exposed — a unique ecosystem full of birds, crabs and lugworms.',
    },
    tip: {
      de: 'Wattwanderung nur mit geführter Tour! Gezeiten beachten. Mit Fahrrad zur Südküste.',
      en: 'Mudflat walks with a guide only! Watch the tides. Bike down to the south coast.',
    },
    category: 'nature',
    lat: 53.7005, lng: 7.1700,
  },
  {
    id: 'kurpromenade',
    title: { de: 'Kurpromenade', en: 'Kurpromenade' },
    description: {
      de: 'Die elegante Strandpromenade — historische Bädervillen, Boutiquen und das Café-Leben der Insel. Das gesellschaftliche Zentrum von Norderney.',
      en: 'The elegant promenade — historic seaside villas, boutiques and the island\'s café life. The social center of Norderney.',
    },
    tip: {
      de: 'Eis beim Café Pudding — ein Norderney-Klassiker seit Jahrzehnten.',
      en: 'Ice cream at Café Pudding — a Norderney classic for decades.',
    },
    category: 'viewpoint',
    lat: 53.7105, lng: 7.1560,
  },
]
