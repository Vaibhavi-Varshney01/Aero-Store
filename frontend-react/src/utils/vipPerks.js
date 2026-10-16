/**
 * VIP Perks, Product Mappings, Free Bundled Gifts & Special Pricing Logic
 *
 * Requirements:
 * "see normal catalogue m b same item rkho or vip m bhi same rakho bs frk sirf itna rkho ki vip m discount acha mile or sath m related item free mile"
 *
 * Rules:
 * - Normal users & VIP users both see the full catalog.
 * - In VIP Mode / for VIP users:
 *   1. Massive VIP Exclusive Discount (e.g. 20% to 35% OFF on each product).
 *   2. Curated related item FREE GIFT with the product.
 */

export const VIP_PERKS_MAP = {
  // Electronics
  'PROD-101': {
    vipDiscountPercent: 25,
    giftName: 'Hard-Shell ANC Travel Case & Gold Audio Jack Adapter',
    giftIcon: '🎁',
    giftValue: 29.99
  },
  'PROD-102': {
    vipDiscountPercent: 20,
    giftName: 'Memory Foam Ergonomic Wrist Rest & Keycap Puller Kit',
    giftIcon: '🎁',
    giftValue: 24.50
  },
  'PROD-103': {
    vipDiscountPercent: 30,
    giftName: 'Premium 8K Braided DisplayPort Cable & Screen Cleaning Kit',
    giftIcon: '🎁',
    giftValue: 39.00
  },
  'PROD-104': {
    vipDiscountPercent: 25,
    giftName: 'Magnetic Fast Wireless Charging Dock & Extra Silicone Sport Band',
    giftIcon: '🎁',
    giftValue: 34.99
  },
  'PROD-105': {
    vipDiscountPercent: 30,
    giftName: 'Waterproof Tech Organizer Pouch & Cyberpunk Enamel Pin Set',
    giftIcon: '🎁',
    giftValue: 22.00
  },
  'PROD-106': {
    vipDiscountPercent: 25,
    giftName: 'Speed-Glide Extended Desk Mat & Spare PTFE Glides',
    giftIcon: '🎁',
    giftValue: 18.50
  },
  'PROD-107': {
    vipDiscountPercent: 25,
    giftName: 'Acoustic Isolation Foam Pads & Cable Management Clips',
    giftIcon: '🎁',
    giftValue: 19.99
  },
  'PROD-108': {
    vipDiscountPercent: 25,
    giftName: 'High-Performance Moisture-Wicking Sports Socks (Pack of 3)',
    giftIcon: '🎁',
    giftValue: 15.00
  },
  'PROD-109': {
    vipDiscountPercent: 20,
    giftName: 'Sample Pack (100g) Ethiopian Single-Origin Whole Beans',
    giftIcon: '🎁',
    giftValue: 12.00
  },
  'PROD-110': {
    vipDiscountPercent: 20,
    giftName: 'Silicone Protective Boot & Carabiner Clip',
    giftIcon: '🎁',
    giftValue: 9.99
  },
  'PROD-111': {
    vipDiscountPercent: 30,
    giftName: 'Microfiber Waterproof Maintenance Spray & Compact Travel Pouch',
    giftIcon: '🎁',
    giftValue: 24.00
  },
  'PROD-112': {
    vipDiscountPercent: 25,
    giftName: 'Organic Lavender & Eucalyptus Essential Oils Duo (15ml x 2)',
    giftIcon: '🎁',
    giftValue: 16.50
  },
  // Grocery & Pantry
  'PROD-113': {
    vipDiscountPercent: 20,
    giftName: 'Stainless Steel Measuring Coffee Scoop with Bag Sealing Clip',
    giftIcon: '🎁',
    giftValue: 8.50
  },
  'PROD-114': {
    vipDiscountPercent: 20,
    giftName: 'AeroStore Artisanal Dipping Spice Blend (50g)',
    giftIcon: '🎁',
    giftValue: 7.99
  },
  'PROD-115': {
    vipDiscountPercent: 20,
    giftName: 'Organic Chia & Flax Seed Topper Shaker (100g)',
    giftIcon: '🎁',
    giftValue: 5.50
  },
  'PROD-116': {
    vipDiscountPercent: 20,
    giftName: 'Handcrafted Wooden Pancake Drizzler Spoon',
    giftIcon: '🎁',
    giftValue: 6.99
  },
  // Cafe & Beverages (AeroMinutes)
  'PROD-117': {
    vipDiscountPercent: 25,
    giftName: 'Fresh Baked Mini Cinnamon Swirl Cookie',
    giftIcon: '🍪',
    giftValue: 2.50
  },
  'PROD-118': {
    vipDiscountPercent: 25,
    giftName: 'French Gourmet Strawberry Jam Dip (30g)',
    giftIcon: '🍓',
    giftValue: 1.75
  },
  'PROD-119': {
    vipDiscountPercent: 25,
    giftName: 'Crispy Organic Matcha Coconut Wafers',
    giftIcon: '🍵',
    giftValue: 2.25
  },
  'PROD-120': {
    vipDiscountPercent: 25,
    giftName: 'Single Shot Colombian Espresso Shot Add-on',
    giftIcon: '☕',
    giftValue: 2.00
  },
  'PROD-121': {
    vipDiscountPercent: 20,
    giftName: 'Organic Sliced Lemon & Infused Extra Virgin Olive Oil Drizzle',
    giftIcon: '🥑',
    giftValue: 2.50
  },
  'PROD-122': {
    vipDiscountPercent: 25,
    giftName: 'Chilled Reusable Stainless Steel Straw & Cleaning Brush',
    giftIcon: '🥤',
    giftValue: 3.00
  }
};

/**
 * Returns the VIP perks configuration for any product.
 * Provides fallback discount (20%) and generic complimentary item if product is new/unmapped.
 */
export function getProductVipPerks(product) {
  if (!product) return null;
  const id = product.id;
  const specific = VIP_PERKS_MAP[id];
  if (specific) {
    const discountedPrice = Number((product.price * (1 - specific.vipDiscountPercent / 100)).toFixed(2));
    const savings = Number((product.price - discountedPrice).toFixed(2));
    return {
      discountPercent: specific.vipDiscountPercent,
      vipPrice: discountedPrice,
      savings,
      giftName: specific.giftName,
      giftIcon: specific.giftIcon || '🎁',
      giftValue: specific.giftValue || 15.00
    };
  }

  // General fallback for any other items
  const discountPercent = 20;
  const discountedPrice = Number((product.price * 0.8).toFixed(2));
  const savings = Number((product.price - discountedPrice).toFixed(2));
  return {
    discountPercent,
    vipPrice: discountedPrice,
    savings,
    giftName: `VIP Member Complimentary Accessory for ${product.name}`,
    giftIcon: '🎁',
    giftValue: 12.00
  };
}
