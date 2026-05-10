import { Landmark, Waves, Leaf, Utensils, Eye, MapPin, Flag, LucideProps } from 'lucide-react'
import type { PinCategory } from '@/lib/interest-pins'
import { PIN_CATEGORIES } from '@/lib/interest-pins'

const ICON_MAP: Partial<Record<PinCategory, React.FC<LucideProps>>> = {
  history:   Landmark,
  beach:     Waves,
  nature:    Leaf,
  food:      Utensils,
  viewpoint: Eye,
  landmark:  MapPin,
}

interface Props {
  category: PinCategory
  size?: number
  color?: string
  isFinish?: boolean
}

export default function CategoryIcon({ category, size = 20, color, isFinish }: Props) {
  if (isFinish) return <Flag size={size} color={color} />

  // Custom image icon
  const cat = PIN_CATEGORIES[category]
  if (cat?.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cat.image}
        alt={cat.label.de}
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    )
  }

  // Lucide icon fallback
  const Icon = ICON_MAP[category] ?? MapPin
  return <Icon size={size} color={color} strokeWidth={2} />
}
