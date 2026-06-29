/**
 * Converts a Supabase Storage URL to use the image transform endpoint,
 * which serves WebP at the requested width/quality — dramatically smaller files.
 *
 * Non-Supabase URLs (e.g. /hero/hero-1.jpg) are returned unchanged.
 */
export function optimizeImageUrl(
  url: string,
  options: { width?: number; quality?: number } = {}
): string {
  if (!url) return url

  const SUPABASE_OBJECT = '/storage/v1/object/public/'
  const SUPABASE_RENDER = '/storage/v1/render/image/public/'

  if (!url.includes(SUPABASE_OBJECT)) return url

  const { width = 1920, quality = 85 } = options

  const renderUrl = url.replace(SUPABASE_OBJECT, SUPABASE_RENDER)
  return `${renderUrl}?width=${width}&quality=${quality}&format=webp`
}
