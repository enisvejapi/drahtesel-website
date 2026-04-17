export type POICategory = 'history' | 'viewpoint' | 'food' | 'nature' | 'photo' | 'parking'

export interface POI {
  id: string
  tourId: string
  lat: number
  lng: number
  title: { de: string; en: string }
  description: { de: string; en: string }
  category: POICategory
}

export const POI_CATEGORIES: Record<
  POICategory,
  { emoji: string; color: string; label: { de: string; en: string } }
> = {
  history:   { emoji: '🏛',  color: '#8B4513', label: { de: 'Geschichte',      en: 'History'      } },
  viewpoint: { emoji: '🔭',  color: '#4169E1', label: { de: 'Aussichtspunkt',   en: 'Viewpoint'    } },
  food:      { emoji: '☕',  color: '#E07B39', label: { de: 'Essen & Trinken',  en: 'Food & Drink' } },
  nature:    { emoji: '🌿',  color: '#228B22', label: { de: 'Natur',            en: 'Nature'       } },
  photo:     { emoji: '📷',  color: '#9B59B6', label: { de: 'Foto-Spot',        en: 'Photo Spot'   } },
  parking:   { emoji: '🅿',  color: '#1E88E5', label: { de: 'Fahrrad-Parken',   en: 'Bike Parking' } },
}
