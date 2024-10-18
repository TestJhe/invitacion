// src/utils/imageCache.ts

const CACHE_VERSION = 'v1';
const IMAGE_CACHE_KEY = 'cached_images';

export async function cacheImage(src: string): Promise<void> {
  const cache = await caches.open(CACHE_VERSION);
  const response = await fetch(src);
  await cache.put(src, response);

  const cachedImages = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '[]');
  if (!cachedImages.includes(src)) {
    cachedImages.push(src);
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cachedImages));
  }
}

export async function getCachedImage(src: string): Promise<string | null> {
  const cache = await caches.open(CACHE_VERSION);
  const response = await cache.match(src);
  
  if (response) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  
  return null;
}

export function isCached(src: string): boolean {
  const cachedImages = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '[]');
  return cachedImages.includes(src);
}