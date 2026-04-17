export type Difficulty = 'easy' | 'moderate' | 'hard'
export type BikeType = 'city' | 'ebike' | 'family' | 'trekking'

export interface TourStop {
  id: string
  title: { de: string; en: string }
  description: { de: string; en: string }
  coords: [number, number]
  label: { de: string; en: string }   // short catchy descriptor shown in carousel
}

export interface Tour {
  id: string
  slug: string
  title: { de: string; en: string }
  description: { de: string; en: string }
  longDescription: { de: string; en: string }
  distance: number // km
  duration: number // minutes
  difficulty: Difficulty
  terrain: { de: string; en: string }
  recommendedBike: { de: string; en: string }
  recommendedBikeType: BikeType
  highlights: { de: string[]; en: string[] }
  polyline: [number, number][] // [lat, lng]
  startPoint: [number, number]
  endPoint: [number, number]
  stops: TourStop[]
  color: string
  tags: string[]
  isFamilyFriendly: boolean
  isScenic: boolean
  hasBeach: boolean
  isPopular: boolean
}

// ─── Confirmed coordinates via OpenStreetMap / OSRM ──────────────────────────
// Norderney island geography (island runs WEST→EAST, shop is at the WESTERN end):
//   • Shop / Town:       ~7.145–7.165°E  (western end of island)
//   • Island W coast:    ~7.137°E        (only ~450m west of shop — OSRM-confirmed)
//   • Harbor / Hafen:    ~7.162°E        (south of town)
//   • Lighthouse:        ~7.230°E        (eastern section — real OSRM route)
//   • N coast / Dunes:   ~53.720–53.724°N, 7.155–7.220°E  (northern side, east-central)
//   • S coast (Watt):    ~53.700–53.704°N (Wattenmeer side, south of town)
//   • NOTHING west of 7.137°E is on the island — those coords are open sea

// Nominatim-verified: Herrenpfad, 26548 Norderney (53.7075312 N, 7.1452623 E)
export const SHOP_LOCATION: [number, number] = [53.7075, 7.1453]
export const SHOP_ADDRESS = 'Herrenpfad 21-22, 26548 Norderney'
export const SHOP_HOURS = {
  de: 'Täglich 09:00 – 18:00 Uhr',
  en: 'Daily 09:00 – 18:00',
}

export const TOURS: Tour[] = [
  // ── 1. Weststrand Tour ────────────────────────────────────────────────────
  {
    id: 'weststrand',
    slug: 'weststrand-tour',
    title: { de: 'Weststrand-Tour', en: 'West Beach Tour' },
    description: {
      de: 'Entdecke die wilden Dünen und den unberührten Weststrand — das Herzstück der Insel Norderney.',
      en: 'Discover the wild dunes and pristine west beach — the untouched heart of Norderney island.',
    },
    longDescription: {
      de: 'Diese Tour führt dich vom Stadtzentrum nordwärts über die Kaiserstraße zum Januskopf und weiter zur westlichen Dünenspitze Norderneys. Du erreichst den Weststrand mit seinen weitläufigen Sandflächen und kehrst über den südlichen Küstenweg zurück. Ein Muss für jeden Naturliebhaber.',
      en: 'This tour takes you north from the town center via Kaiserstraße to Januskopf, then on to the western dune tip of Norderney. You reach the west beach with its vast sandy stretches and return via the southern coastal path. A must for every nature lover.',
    },
    distance: 8,
    duration: 45,
    difficulty: 'moderate',
    terrain: { de: 'Befestigte Wege, Dünenpromenade, Sandpfade', en: 'Paved roads, dune promenade, sand paths' },
    recommendedBike: { de: 'E-Bike', en: 'E-Bike' },
    recommendedBikeType: 'ebike',
    highlights: {
      de: ['Westliche Dünenspitze', 'Naturschutzgebiet Weststrand', 'Januskopf Aussicht', 'Kaiserstraße'],
      en: ['Western dune tip', 'West beach nature reserve', 'Januskopf viewpoint', 'Kaiserstraße'],
    },
    polyline: [
      [53.7075, 7.1452], [53.7092, 7.1452], [53.7112, 7.1452],
      [53.7122, 7.1505], [53.7140, 7.1490], [53.7155, 7.1465],
      [53.7168, 7.1445], [53.7178, 7.1418], [53.7185, 7.1395],
      [53.7188, 7.1375], [53.7178, 7.1370], [53.7158, 7.1375],
      [53.7138, 7.1385], [53.7112, 7.1400], [53.7090, 7.1415],
      [53.7075, 7.1452],
    ],
    startPoint: [53.7075, 7.1452],
    endPoint: [53.7075, 7.1452],
    stops: [
      {
        id: 'weststrand-1',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Starte deine Tour hier — Helm, Schloss und Reparatur-Kit inklusive.', en: 'Start your tour here — helmet, lock and repair kit included.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Startpunkt', en: 'Starting point' },
      },
      {
        id: 'weststrand-2',
        title: { de: 'Am Januskopf', en: 'Januskopf' },
        description: { de: 'Aussichtspunkt mit Blick auf die Nordsee und das Wattenmeer — atemberaubend bei Sonnenuntergang.', en: 'Viewpoint overlooking the North Sea and Wadden Sea — breathtaking at sunset.' },
        coords: [53.7122, 7.1505],
        label: { de: 'Panoramablick', en: 'Panoramic view' },
      },
      {
        id: 'weststrand-3',
        title: { de: 'Nordküstenweg', en: 'North Coast Path' },
        description: { de: 'Entlang der Nordküste — Salzluft, Möwen und endlose Sandstrände.', en: 'Along the north coast — sea air, seagulls and endless sandy beaches.' },
        coords: [53.7155, 7.1465],
        label: { de: 'Salzluft & Meer', en: 'Sea breeze & coast' },
      },
      {
        id: 'weststrand-4',
        title: { de: 'Westspitze', en: 'Western Tip' },
        description: { de: 'Der wildeste Punkt der Insel — unberührte Dünen, weißer Sand und das offene Meer.', en: 'The wildest point of the island — untouched dunes, white sand and the open sea.' },
        coords: [53.7188, 7.1375],
        label: { de: 'Wilder Strand', en: 'Wild beach' },
      },
    ],
    color: '#C8102E',
    tags: ['nature', 'beach', 'dunes'],
    isFamilyFriendly: false,
    isScenic: true,
    hasBeach: true,
    isPopular: true,
  },

  // ── 2. Lighthouse Tour ────────────────────────────────────────────────────
  {
    id: 'lighthouse',
    slug: 'lighthouse-tour',
    title: { de: 'Leuchtturm-Tour', en: 'Lighthouse Tour' },
    description: {
      de: 'Radle zum historischen Leuchtturm Norderney — mit atemberaubendem Ausblick über die Nordsee.',
      en: 'Cycle to the historic Norderney lighthouse — with breathtaking views over the North Sea.',
    },
    longDescription: {
      de: 'Der Leuchtturm von Norderney steht an der östlichen Spitze der Insel und ist eines der bekanntesten Wahrzeichen. Diese Tour führt dich vom Stadtzentrum entlang der Hauptstraßen Richtung Osten, vorbei am Hafen und durch die Dünenlandschaft bis zum Leuchtturm.',
      en: 'The Norderney lighthouse stands at the eastern tip of the island and is one of its most famous landmarks. This tour takes you from the town center eastward, past the harbor and through the dune landscape to the lighthouse.',
    },
    distance: 16,
    duration: 90,
    difficulty: 'moderate',
    terrain: { de: 'Küstenradweg, Befestigt, leichte Steigungen', en: 'Coastal cycle path, paved, slight inclines' },
    recommendedBike: { de: 'E-Bike', en: 'E-Bike' },
    recommendedBikeType: 'ebike',
    highlights: {
      de: ['Historischer Leuchtturm', 'Ostküste Panorama', 'Wattenmeer UNESCO-Welterbe', 'Hafen Norderney'],
      en: ['Historic lighthouse', 'East coast panorama', 'Wadden Sea UNESCO World Heritage', 'Norderney harbor'],
    },
    polyline: [
      [53.7075, 7.1452], [53.7065, 7.1455], [53.7062, 7.1460],
      [53.7064, 7.1478], [53.7068, 7.1503], [53.7073, 7.1536],
      [53.7078, 7.1557], [53.7077, 7.1590], [53.7088, 7.1622],
      [53.7092, 7.1637], [53.7098, 7.1676], [53.7102, 7.1685],
      [53.7107, 7.1695], [53.7122, 7.1726], [53.7130, 7.1743],
      [53.7136, 7.1763], [53.7139, 7.1799], [53.7137, 7.1829],
      [53.7141, 7.1887], [53.7143, 7.1970], [53.7135, 7.2080],
      [53.7118, 7.2170], [53.7100, 7.2240], [53.7092, 7.2296],
    ],
    startPoint: [53.7075, 7.1452],
    endPoint: [53.7092, 7.2296],
    stops: [
      {
        id: 'lighthouse-1',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Starte die längste Tour — am besten mit einem E-Bike für die 16 km.', en: 'Starting the longest tour — best with an e-bike for the 16 km.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Startpunkt', en: 'Starting point' },
      },
      {
        id: 'lighthouse-2',
        title: { de: 'Hafen Norderney', en: 'Norderney Harbor' },
        description: { de: 'Der Fährhafen — Fischerboote, Segelschiffe und der Geruch von Salzwasser.', en: 'The ferry harbor — fishing boats, sailboats and the smell of salt water.' },
        coords: [53.7092, 7.1637],
        label: { de: 'Fischerboote & Fähren', en: 'Boats & Ferries' },
      },
      {
        id: 'lighthouse-3',
        title: { de: 'Ostdünen', en: 'East Dunes' },
        description: { de: 'Die Dünenlandschaft im Osten — schützt die Insel seit Jahrhunderten.', en: 'The eastern dune landscape — protecting the island for centuries.' },
        coords: [53.7141, 7.1887],
        label: { de: 'Weites Dünenland', en: 'Vast Dune Lands' },
      },
      {
        id: 'lighthouse-4',
        title: { de: 'Leuchtturm Norderney', en: 'Norderney Lighthouse' },
        description: { de: 'Das Wahrzeichen der Insel. 1874 erbaut, 54 Meter hoch. Fantastischer Blick über das Wattenmeer.', en: 'The landmark of the island. Built in 1874, 54 metres tall. Fantastic view over the Wadden Sea.' },
        coords: [53.7092, 7.2296],
        label: { de: 'Wahrzeichen der Insel', en: 'Island icon' },
      },
    ],
    color: '#2563eb',
    tags: ['landmark', 'scenic', 'coast'],
    isFamilyFriendly: false,
    isScenic: true,
    hasBeach: true,
    isPopular: true,
  },

  // ── 3. Family Easy Ride ───────────────────────────────────────────────────
  {
    id: 'family',
    slug: 'family-easy-ride',
    title: { de: 'Familien-Radtour', en: 'Family Easy Ride' },
    description: {
      de: 'Ein gemütlicher Rundkurs für die ganze Familie — flach, sicher und voller Erlebnisse im Inselkern.',
      en: "A leisurely loop for the whole family — flat, safe, and full of experiences in the island's core.",
    },
    longDescription: {
      de: 'Diese familienfreundliche Tour ist ideal für Eltern mit Kindern jeden Alters. Der Rundkurs führt durch die malerische Altstadt, vorbei am Hafen und der Strandpromenade am Nordstrand.',
      en: "This family-friendly tour is ideal for parents with children of all ages. The loop leads through the picturesque old town, past the harbor and along the promenade at the north beach.",
    },
    distance: 6,
    duration: 35,
    difficulty: 'easy',
    terrain: { de: 'Asphalt, Promenade, flach', en: 'Asphalt, promenade, flat' },
    recommendedBike: { de: 'Cityrad / Familienrad', en: 'City Bike / Family Bike' },
    recommendedBikeType: 'family',
    highlights: {
      de: ['Hafen Norderney', 'Nordstrand Promenade', 'Historische Altstadt', 'Familienfreundlich'],
      en: ['Norderney Harbor', 'North beach promenade', 'Historic old town', 'Family friendly'],
    },
    polyline: [
      [53.7075, 7.1452], [53.7065, 7.1455], [53.7062, 7.1462],
      [53.7063, 7.1472], [53.7059, 7.1492], [53.7042, 7.1505],
      [53.7038, 7.1514], [53.7037, 7.1533], [53.7027, 7.1554],
      [53.7003, 7.1589], [53.7022, 7.1610], [53.7027, 7.1621],
      [53.7032, 7.1619], [53.7051, 7.1629], [53.7071, 7.1643],
      [53.7074, 7.1647], [53.7080, 7.1648], [53.7091, 7.1637],
      [53.7104, 7.1635], [53.7129, 7.1635], [53.7155, 7.1583],
      [53.7140, 7.1560], [53.7110, 7.1530], [53.7090, 7.1490],
      [53.7075, 7.1452],
    ],
    startPoint: [53.7075, 7.1452],
    endPoint: [53.7075, 7.1452],
    stops: [
      {
        id: 'family-1',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Perfekter Startpunkt für die ganze Familie — Kinderräder und Anhänger verfügbar.', en: 'Perfect starting point for the whole family — kids bikes and trailers available.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Startpunkt', en: 'Starting point' },
      },
      {
        id: 'family-2',
        title: { de: 'Hafen Norderney', en: 'Norderney Harbor' },
        description: { de: 'Kinder lieben die bunten Fischerboote und die geschäftige Hafenpromenade.', en: 'Kids love the colorful fishing boats and the bustling harbor promenade.' },
        coords: [53.7027, 7.1621],
        label: { de: 'Fährankunft & Boote', en: 'Ferry & Boats' },
      },
      {
        id: 'family-3',
        title: { de: 'Nordstrand Promenade', en: 'North Beach Promenade' },
        description: { de: 'Die beliebteste Strandpromenade — Eis essen, spielen und Wellen gucken.', en: 'The most popular beach promenade — ice cream, games and wave watching.' },
        coords: [53.7129, 7.1635],
        label: { de: 'Strandspiele & Eis', en: 'Beach fun & ice cream' },
      },
    ],
    color: '#16a34a',
    tags: ['family', 'easy', 'town'],
    isFamilyFriendly: true,
    isScenic: false,
    hasBeach: false,
    isPopular: true,
  },

  // ── 4. Dunes Panorama Route ───────────────────────────────────────────────
  {
    id: 'dunes',
    slug: 'dunes-panorama-route',
    title: { de: 'Dünen-Panorama-Route', en: 'Dunes Panorama Route' },
    description: {
      de: 'Erlebe die einzigartigen Dünenlandschaften Norderneys von ihrer schönsten Seite — mit Panoramablick.',
      en: 'Experience the unique dune landscapes of Norderney at their finest — with panoramic views.',
    },
    longDescription: {
      de: 'Die Dünen Norderneys gehören zu den beeindruckendsten Naturdenkmälern der deutschen Nordseeküste. Diese Route führt dich nordwärts in das nördliche Dünengebiet der Insel.',
      en: 'The dunes of Norderney are among the most impressive natural monuments on the German North Sea coast. This route takes you north into the northern dune area.',
    },
    distance: 10,
    duration: 55,
    difficulty: 'moderate',
    terrain: { de: 'Sandpfade, Holzstege, Heidewege', en: 'Sand paths, wooden boardwalks, heathland tracks' },
    recommendedBike: { de: 'Trekkingrad', en: 'Trekking Bike' },
    recommendedBikeType: 'trekking',
    highlights: {
      de: ['Panoramadünen', 'Dünenseen', 'Heidefelder', 'Naturschutzgebiet'],
      en: ['Panorama dunes', 'Dune lakes', 'Heathland fields', 'Nature reserve'],
    },
    polyline: [
      [53.7075, 7.1452], [53.7092, 7.1452], [53.7112, 7.1452],
      [53.7128, 7.1470], [53.7142, 7.1500], [53.7155, 7.1540],
      [53.7168, 7.1580], [53.7178, 7.1620], [53.7188, 7.1665],
      [53.7198, 7.1710], [53.7208, 7.1758], [53.7215, 7.1808],
      [53.7218, 7.1860],
    ],
    startPoint: [53.7075, 7.1452],
    endPoint: [53.7218, 7.1860],
    stops: [
      {
        id: 'dunes-1',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Für diese Route empfehlen wir ein Trekkingrad — die Sandwege brauchen breite Reifen.', en: 'For this route we recommend a trekking bike — the sand paths need wide tyres.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Startpunkt', en: 'Starting point' },
      },
      {
        id: 'dunes-2',
        title: { de: 'Nordküstenweg', en: 'North Coastal Road' },
        description: { de: 'Nordküste in Sicht — hier öffnet sich die Insel zu einem weiten Horizont.', en: 'North coast in sight — here the island opens up to a wide horizon.' },
        coords: [53.7155, 7.1540],
        label: { de: 'Wind & Weite', en: 'Wind & Openness' },
      },
      {
        id: 'dunes-3',
        title: { de: 'Dünenreservat Eingang', en: 'Dune Reserve Entrance' },
        description: { de: 'Das UNESCO-Naturschutzgebiet beginnt hier — Heimat seltener Pflanzen und Vögel.', en: 'The UNESCO nature reserve begins here — home to rare plants and birds.' },
        coords: [53.7198, 7.1710],
        label: { de: 'Naturschutzgebiet', en: 'Nature Reserve' },
      },
      {
        id: 'dunes-4',
        title: { de: 'Panoramapunkt', en: 'Panorama Point' },
        description: { de: '360° Ausblick über die Inseldünen — Nordsee und Wattenmeer gleichzeitig sichtbar.', en: '360° views over the island dunes — North Sea and Wadden Sea visible at the same time.' },
        coords: [53.7215, 7.1808],
        label: { de: '360° Aussicht', en: '360° Views' },
      },
    ],
    color: '#d97706',
    tags: ['nature', 'dunes', 'panorama'],
    isFamilyFriendly: false,
    isScenic: true,
    hasBeach: false,
    isPopular: false,
  },

  // ── 5. Harbor to Town Route ───────────────────────────────────────────────
  {
    id: 'harbor',
    slug: 'harbor-to-town',
    title: { de: 'Hafen zur Stadt', en: 'Harbor to Town Route' },
    description: {
      de: 'Kurze, entspannte Tour vom Hafen durch die lebhafte Inselstadt direkt zu unserem Verleih.',
      en: 'Short, relaxed ride from the harbor through the lively island town straight to our rental shop.',
    },
    longDescription: {
      de: 'Perfekt für Tagesbesucher: Fähre anlegen, Fahrrad mieten, losradeln! Diese kurze Strecke vom Hafen durch die Altstadt zeigt dir die wichtigsten Sehenswürdigkeiten Norderneys.',
      en: "Perfect for day visitors: ferry arrives, rent a bike, cycle off! This short route from the harbor through the old town shows you Norderney's most important sights.",
    },
    distance: 4,
    duration: 20,
    difficulty: 'easy',
    terrain: { de: 'Asphalt, Hafenpromenade, flach', en: 'Asphalt, harbor promenade, flat' },
    recommendedBike: { de: 'Cityrad', en: 'City Bike' },
    recommendedBikeType: 'city',
    highlights: {
      de: ['Fährhafen', 'Strandpromenade', 'Historische Altstadt', 'Kurpark'],
      en: ['Ferry harbor', 'Beach promenade', 'Historic old town', 'Spa garden'],
    },
    polyline: [
      [53.7025, 7.1620], [53.7023, 7.1620], [53.7021, 7.1620],
      [53.7011, 7.1602], [53.7004, 7.1598], [53.7003, 7.1589],
      [53.7013, 7.1575], [53.7021, 7.1562], [53.7030, 7.1548],
      [53.7036, 7.1537], [53.7039, 7.1521], [53.7039, 7.1507],
      [53.7042, 7.1505], [53.7048, 7.1497], [53.7059, 7.1492],
      [53.7065, 7.1488], [53.7062, 7.1462], [53.7075, 7.1452],
    ],
    startPoint: [53.7025, 7.1620],
    endPoint: [53.7075, 7.1452],
    stops: [
      {
        id: 'harbor-1',
        title: { de: 'Fähranleger', en: 'Ferry Terminal' },
        description: { de: 'Norderney begrüßt dich! Fähren aus Norddeich legen hier an — nur wenige Minuten zum Verleih.', en: 'Norderney welcomes you! Ferries from Norddeich dock here — just minutes to the rental shop.' },
        coords: [53.7025, 7.1620],
        label: { de: 'Ankunft Norderney', en: 'Arriving Norderney' },
      },
      {
        id: 'harbor-2',
        title: { de: 'Strandpromenade', en: 'Beach Promenade' },
        description: { de: 'Die beliebteste Promenade der Insel — Cafés, Eisläden und direkter Blick aufs Meer.', en: 'The island\'s most popular promenade — cafés, ice cream shops and direct sea views.' },
        coords: [53.7051, 7.1629],
        label: { de: 'Am Meer entlang', en: 'Along the Sea' },
      },
      {
        id: 'harbor-3',
        title: { de: 'Historische Altstadt', en: 'Historic Old Town' },
        description: { de: 'Das Herz Norderneys — Reetgedeckte Häuser, Gassen und lokale Läden.', en: "Norderney's heart — thatched houses, alleyways and local shops." },
        coords: [53.7062, 7.1462],
        label: { de: 'Historischer Kern', en: 'Historic Core' },
      },
      {
        id: 'harbor-4',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Ziel erreicht! Gib dein Rad ab und erkunde den Rest der Insel zu Fuß.', en: 'Destination reached! Return your bike and explore the rest of the island on foot.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Ziel erreicht!', en: 'Destination reached!' },
      },
    ],
    color: '#7c3aed',
    tags: ['town', 'easy', 'short'],
    isFamilyFriendly: true,
    isScenic: false,
    hasBeach: false,
    isPopular: false,
  },

  // ── 6. Sunset Ride ────────────────────────────────────────────────────────
  {
    id: 'sunset',
    slug: 'sunset-ride',
    title: { de: 'Sonnenuntergangs-Tour', en: 'Sunset Ride' },
    description: {
      de: 'Die romantischste Tour Norderneys — radle in den Sonnenuntergang an der Westspitze der Insel.',
      en: 'The most romantic tour on Norderney — cycle into the sunset at the western tip of the island.',
    },
    longDescription: {
      de: 'Nichts ist schöner als ein Sonnenuntergang über der Nordsee. Diese Tour führt dich an die Südküste und entlang des Wattenmeers zur Westspitze, wo du die letzten Sonnenstrahlen genießen kannst.',
      en: 'Nothing is more beautiful than a sunset over the North Sea. This tour takes you to the south coast and along the Wadden Sea to the western tip, where you can enjoy the last rays of sun.',
    },
    distance: 14,
    duration: 80,
    difficulty: 'moderate',
    terrain: { de: 'Küstenweg, leichte Sandflächen, Wattenmeer-Blick', en: 'Coastal path, gentle sand sections, Wadden Sea views' },
    recommendedBike: { de: 'E-Bike', en: 'E-Bike' },
    recommendedBikeType: 'ebike',
    highlights: {
      de: ['Sonnenuntergang über der Nordsee', 'Südküste & Wattenmeer', 'Naturlandschaft Westspitze', 'Romantische Abendstimmung'],
      en: ['North Sea sunset', 'South coast & Wadden Sea', 'West tip nature landscape', 'Romantic evening atmosphere'],
    },
    polyline: [
      [53.7075, 7.1452], [53.7062, 7.1445], [53.7050, 7.1435],
      [53.7038, 7.1428], [53.7025, 7.1430], [53.7015, 7.1428],
      [53.7008, 7.1420], [53.7005, 7.1405], [53.7004, 7.1392],
      [53.7005, 7.1378], [53.7012, 7.1375], [53.7025, 7.1378],
      [53.7040, 7.1388], [53.7055, 7.1400], [53.7065, 7.1420],
      [53.7075, 7.1452],
    ],
    startPoint: [53.7075, 7.1452],
    endPoint: [53.7075, 7.1452],
    stops: [
      {
        id: 'sunset-1',
        title: { de: 'Drahtesel Verleih', en: 'Drahtesel Rental' },
        description: { de: 'Starte 2 Stunden vor Sonnenuntergang für das perfekte Timing.', en: 'Start 2 hours before sunset for perfect timing.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Startpunkt', en: 'Starting point' },
      },
      {
        id: 'sunset-2',
        title: { de: 'Wattenmeer Küste', en: 'Wadden Sea Coast' },
        description: { de: 'Die Südküste Norderneys — das UNESCO-Wattenmeer erstreckt sich bis zum Horizont.', en: "Norderney's south coast — the UNESCO Wadden Sea stretches to the horizon." },
        coords: [53.7025, 7.1430],
        label: { de: 'Gezeiten & Stille', en: 'Tides & Silence' },
      },
      {
        id: 'sunset-3',
        title: { de: 'Sonnenuntergangs-Punkt', en: 'Sunset Spot' },
        description: { de: 'Der beste Platz auf Norderney für den Sonnenuntergang — goldenes Licht, kein Lärm, pure Natur.', en: 'The best spot on Norderney for the sunset — golden light, no noise, pure nature.' },
        coords: [53.7005, 7.1378],
        label: { de: 'Goldenes Licht', en: 'Golden Light' },
      },
      {
        id: 'sunset-4',
        title: { de: 'Heimkehr durch die Stadt', en: 'Return through Town' },
        description: { de: 'Abends zurück durch die beleuchtete Inselstadt — ein unvergessliches Erlebnis.', en: 'Back in the evening through the illuminated island town — an unforgettable experience.' },
        coords: [53.7075, 7.1452],
        label: { de: 'Stadt im Abendlicht', en: 'Town at Dusk' },
      },
    ],
    color: '#ea580c',
    tags: ['scenic', 'sunset', 'romantic'],
    isFamilyFriendly: false,
    isScenic: true,
    hasBeach: true,
    isPopular: true,
  },
]

// Named pickup points used in the route planner
export const NORDERNEY_LOCATIONS = [
  {
    id: 'shop',
    label: { de: 'Drahtesel Verleih (Herrenpfad)', en: 'Drahtesel Rental (Herrenpfad)' },
    coords: [53.7075, 7.1452] as [number, number],
  },
  {
    id: 'harbor',
    label: { de: 'Fährhafen', en: 'Ferry Harbor' },
    coords: [53.7025, 7.1620] as [number, number],
  },
  {
    id: 'town',
    label: { de: 'Stadtmitte / Marktplatz', en: 'Town Center / Market' },
    coords: [53.7065, 7.1520] as [number, number],
  },
  {
    id: 'nordstrand',
    label: { de: 'Nordstrand', en: 'North Beach' },
    coords: [53.7155, 7.1583] as [number, number],
  },
  {
    id: 'lighthouse',
    label: { de: 'Leuchtturm (Ostspitze)', en: 'Lighthouse (East Tip)' },
    coords: [53.7092, 7.2296] as [number, number],
  },
  {
    id: 'weststrand',
    label: { de: 'Weststrand / Westspitze', en: 'West Beach / West Tip' },
    coords: [53.7008, 7.1378] as [number, number],
  },
  {
    id: 'dunes',
    label: { de: 'Dünen-Panorama (Nord)', en: 'Dunes Panorama (North)' },
    coords: [53.7215, 7.1808] as [number, number],
  },
  {
    id: 'bismarck',
    label: { de: 'Bismarckstraße', en: 'Bismarck Street' },
    coords: [53.7092, 7.1436] as [number, number],
  },
]
