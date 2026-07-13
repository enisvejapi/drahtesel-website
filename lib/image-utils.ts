/**
 * Returns the image URL unchanged.
 * All images are now served locally from /uploads/ (Docker volume).
 */
export function optimizeImageUrl(url: string, _options?: { width?: number; quality?: number }): string {
  return url
}
