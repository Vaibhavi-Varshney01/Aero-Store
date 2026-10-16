/**
 * AeroStore Product Image Resolver
 * Provides reliable, high-resolution distinct product imagery for all products across the catalog,
 * cart views, checkout summaries, and drawer previews.
 */

export const CATALOG_PRODUCT_IMAGES = {
  'PROD-101': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', // HyperSound ANC Wireless Headphones
  'PROD-102': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', // ErgoFlow RGB Mechanical Keyboard
  'PROD-103': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', // UltraVision 34-Inch Curved 4K OLED Monitor
  'PROD-104': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', // Titanium Smartwatch Series X
  'PROD-105': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', // FlashSale Cyberpunk Edition Hoodie
  'PROD-106': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', // AeroGrip Precision Wireless Mouse
  'PROD-107': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'  // StudioPro Acoustic Desktop Stands
};

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

/**
 * Resolves the real, distinct image for a product or cart item.
 * Checks product_id, item.image_url, and catalog mapping.
 *
 * @param {Object|string} itemOrId - Either the cart item / product object or a productId string
 * @returns {string} Fully qualified image URL
 */
export function getProductImage(itemOrId) {
  if (!itemOrId) return DEFAULT_FALLBACK_IMAGE;

  // If passed just an ID string
  if (typeof itemOrId === 'string') {
    return CATALOG_PRODUCT_IMAGES[itemOrId] || DEFAULT_FALLBACK_IMAGE;
  }

  const productId = itemOrId.product_id || itemOrId.id;

  // 1. If we have a direct mapping for this known product ID, use its high-res catalog photo
  if (productId && CATALOG_PRODUCT_IMAGES[productId]) {
    return CATALOG_PRODUCT_IMAGES[productId];
  }

  // 2. If the item has an image_url that isn't empty or a placeholder
  if (itemOrId.image_url && typeof itemOrId.image_url === 'string') {
    if (itemOrId.image_url.startsWith('http')) {
      return itemOrId.image_url;
    }
    return itemOrId.image_url.replace('/static/assets/', '/assets/');
  }

  // 3. Fallback
  return DEFAULT_FALLBACK_IMAGE;
}
