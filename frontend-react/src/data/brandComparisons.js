/**
 * Multi-Brand Comparison Catalog for Identical Item Types
 * Compares AeroStore Flagship models against top market brands
 * for the exact same item category.
 */

export const ITEM_CATEGORIES_FOR_COMPARISON = [
  {
    id: 'PROD-101',
    item_type: 'Wireless ANC Headphones',
    category: 'Audio',
    icon: '🎧',
    tagline: 'Active Noise-Cancelling Over-Ear Headphones Benchmark',
    accent_color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glow: 'rgba(99, 102, 241, 0.35)',
    trendy_badge: 'Acoustic Studio'
  },
  {
    id: 'PROD-102',
    item_type: 'Mechanical Gaming Keyboard',
    category: 'Keyboards',
    icon: '⌨️',
    tagline: 'Custom Mechanical & Esports Switches Benchmark',
    accent_color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    glow: 'rgba(6, 182, 212, 0.35)',
    trendy_badge: 'RGB Esports'
  },
  {
    id: 'PROD-103',
    item_type: 'Curved OLED Gaming Monitor',
    category: 'Monitors',
    icon: '🖥️',
    tagline: '34" Ultrawide High-Refresh OLED Displays Benchmark',
    accent_color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    glow: 'rgba(168, 85, 247, 0.35)',
    trendy_badge: 'Quantum OLED'
  },
  {
    id: 'PROD-104',
    item_type: 'Smart Health & GPS Watch',
    category: 'Wearables',
    icon: '⌚',
    tagline: 'Titanium & Sapphire Multisport Health Telemetry Benchmark',
    accent_color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glow: 'rgba(16, 185, 129, 0.35)',
    trendy_badge: 'Titanium Grade 5'
  },
  {
    id: 'PROD-106',
    item_type: 'Esports Gaming Mouse',
    category: 'Accessories',
    icon: '🖱️',
    tagline: 'Ultralight High-Precision Optical Sensors Benchmark',
    accent_color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    glow: 'rgba(244, 63, 94, 0.35)',
    trendy_badge: '58g Ultralight'
  },
  {
    id: 'PROD-105',
    item_type: 'Streetwear Heavyweight Hoodie',
    category: 'Apparel',
    icon: '🧥',
    tagline: 'Heavy French Terry Designer Apparel Benchmark',
    accent_color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glow: 'rgba(245, 158, 11, 0.35)',
    trendy_badge: '450 GSM Terry'
  }
];

export const BRAND_COMPARISONS = {
  'PROD-101': {
    id: 'PROD-101',
    item_type: 'Wireless ANC Headphones',
    category: 'Audio',
    icon: '🎧',
    description: 'Comparing 4 leading wireless noise-cancelling headphones on acoustics, battery, ANC depth, and value.',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Active Noise Cancellation',
      'Battery Playback (ANC On)',
      'Acoustic Drivers',
      'Wireless Codecs',
      'Weight & Build Comfort',
      'Manufacturer Warranty',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-hypersound',
        brand: 'AeroStore',
        model: 'HyperSound ANC Pro',
        name: 'AeroStore HyperSound ANC Pro',
        is_store_product: true,
        store_product_id: 'PROD-101',
        badge: 'Our Store Flagship 🌟',
        price: 199.99,
        rating: 4.8,
        image_url: '/assets/headphones.svg',
        stock: 25,
        specs: {
          'Brand & Manufacturer': 'AeroStore Acoustics',
          'Model Name': 'HyperSound ANC Pro (2026 Edition)',
          'MSRP / Retail Price': '$199.99 (Factory Direct)',
          'Active Noise Cancellation': 'Hybrid 42dB Multi-Mic Feedforward/Feedback',
          'Battery Playback (ANC On)': '40 Hours (Fast charge: 10m = 5h)',
          'Acoustic Drivers': '40mm Titanium Composite Diaphragms',
          'Wireless Codecs': 'LDAC, aptX Adaptive, AAC, SBC (BT 5.3)',
          'Weight & Build Comfort': '245g Ultralight Memory Foam Earcups',
          'Manufacturer Warranty': '2-Year Direct Replacement Warranty',
          'Value-to-Price Rating': '9.8 / 10 (Market Leader in Value)'
        },
        pros: [
          'Unmatched $199.99 price point with 40h ANC battery life',
          'Direct 2-Year instant hardware replacement warranty',
          'Studio-tuned titanium drivers with audiophile LDAC support'
        ],
        cons: [
          'Exclusive to AeroStore platform (not sold in retail chains)'
        ]
      },
      {
        id: 'sony-wh1000xm5',
        brand: 'Sony',
        model: 'WH-1000XM5',
        name: 'Sony WH-1000XM5 ANC',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 399.99,
        rating: 4.7,
        image_url: '/assets/headphones.svg',
        stock: 12,
        specs: {
          'Brand & Manufacturer': 'Sony Corporation',
          'Model Name': 'WH-1000XM5 Wireless Headphones',
          'MSRP / Retail Price': '$399.99 Retail',
          'Active Noise Cancellation': 'Dual Processor V1 + QN1 (Auto Optimizer)',
          'Battery Playback (ANC On)': '30 Hours (Fast charge: 3m = 3h)',
          'Acoustic Drivers': '30mm Carbon Fiber Soft-Edge Dome',
          'Wireless Codecs': 'LDAC, AAC, SBC (Bluetooth 5.2)',
          'Weight & Build Comfort': '250g Synthetic Leather',
          'Manufacturer Warranty': '1-Year Limited Manufacturer Warranty',
          'Value-to-Price Rating': '8.2 / 10'
        },
        pros: [
          'Industry-acclaimed ambient sound control algorithms',
          'Excellent call microphone wind-noise suppression'
        ],
        cons: [
          '2x higher cost ($399.99) with 10 fewer hours of battery life',
          'Non-folding headband takes more bag storage space'
        ]
      },
      {
        id: 'bose-qc-ultra',
        brand: 'Bose',
        model: 'QuietComfort Ultra',
        name: 'Bose QuietComfort Ultra',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 429.00,
        rating: 4.6,
        image_url: '/assets/headphones.svg',
        stock: 8,
        specs: {
          'Brand & Manufacturer': 'Bose Corporation',
          'Model Name': 'QuietComfort Ultra Headphones',
          'MSRP / Retail Price': '$429.00 Retail',
          'Active Noise Cancellation': 'CustomTune Technology Sound-Personalized ANC',
          'Battery Playback (ANC On)': '24 Hours (18 Hours with Immersive Audio)',
          'Acoustic Drivers': '35mm Proprietary Dynamic Transducers',
          'Wireless Codecs': 'aptX Adaptive, AAC, SBC (Bluetooth 5.3)',
          'Weight & Build Comfort': '253g Plush Protein Leather',
          'Manufacturer Warranty': '1-Year Limited Warranty',
          'Value-to-Price Rating': '7.8 / 10'
        },
        pros: [
          'Top-tier low-frequency airplane engine noise isolation',
          'Spatial Immersive Audio mode adds width to tracks'
        ],
        cons: [
          'Priced at $429.00 with only 24 hours of total battery playback',
          'Spatial audio mode drains battery significantly faster'
        ]
      },
      {
        id: 'sennheiser-momentum-4',
        brand: 'Sennheiser',
        model: 'Momentum 4 Wireless',
        name: 'Sennheiser Momentum 4',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 379.95,
        rating: 4.6,
        image_url: '/assets/headphones.svg',
        stock: 5,
        specs: {
          'Brand & Manufacturer': 'Sennheiser / Sonova',
          'Model Name': 'Momentum 4 Wireless',
          'MSRP / Retail Price': '$379.95 Retail',
          'Active Noise Cancellation': 'Adaptive Noise Cancellation',
          'Battery Playback (ANC On)': '60 Hours Endurance',
          'Acoustic Drivers': '42mm Audiophile-Inspired Transducers',
          'Wireless Codecs': 'aptX Adaptive, aptX, AAC, SBC (BT 5.2)',
          'Weight & Build Comfort': '293g Padded Fabric & Leatherette',
          'Manufacturer Warranty': '2-Year Manufacturer Warranty',
          'Value-to-Price Rating': '8.6 / 10'
        },
        pros: [
          'Impressive 60-hour marathon battery runtime',
          'Neutral, balanced audiophile sound tuning'
        ],
        cons: [
          'Heavier weight (293g) creates slight crown pressure on long flights',
          'ANC depth is noticeably weaker than AeroStore & Bose in vocal ranges'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-hypersound',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore HyperSound ANC Pro',
        summary: 'AeroStore HyperSound ANC Pro wins the comparison outright by offering flagship 40-hour playback, 42dB hybrid noise cancellation, and LDAC audiophile audio at $199.99—saving shoppers over $200 compared to Sony and Bose.',
        persona_fit: 'For balanced everyday use, AeroStore provides 95% of the performance of $400+ competitors at half the price, backed by an industry-leading 2-year warranty.',
        value_score: {
          'aerostore-hypersound': 9.8,
          'sennheiser-momentum-4': 8.6,
          'sony-wh1000xm5': 8.2,
          'bose-qc-ultra': 7.8
        },
        recommendation: 'Choose AeroStore HyperSound ANC Pro for the optimal combination of sound quality, battery life, and outstanding price-to-performance value.'
      },
      audiophile: {
        winner_id: 'aerostore-hypersound',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore HyperSound ANC Pro',
        summary: 'Features custom 40mm titanium composite drivers with high-res LDAC streaming up to 990kbps, delivering rich bass response and crystal-clear acoustic separation equal to boutique studio headphones.',
        persona_fit: 'Audiophiles will appreciate the zero-compression wired 3.5mm AUX mode and the uncolored mid-range clarity matching Sennheiser without the $380 price tag.',
        value_score: {
          'aerostore-hypersound': 9.6,
          'sennheiser-momentum-4': 9.2,
          'sony-wh1000xm5': 8.5,
          'bose-qc-ultra': 7.9
        },
        recommendation: 'The 40mm titanium composite diaphragms on the AeroStore HyperSound produce pristine transient response across the 20Hz - 40kHz spectrum.'
      },
      commuter: {
        winner_id: 'aerostore-hypersound',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore HyperSound ANC Pro',
        summary: 'At 245g with 40-hour continuous ANC playback, AeroStore easily outperforms Bose (24h) and Sony (30h), lasting through full round-trip transcontinental flights without recharging.',
        persona_fit: 'Commuters and frequent flyers benefit from 42dB hybrid active cancellation that effectively silences train rumbles and airplane cabin drone.',
        value_score: {
          'aerostore-hypersound': 9.7,
          'bose-qc-ultra': 8.7,
          'sony-wh1000xm5': 8.4,
          'sennheiser-momentum-4': 8.0
        },
        recommendation: 'AeroStore combines the featherlight 245g build needed for daily travel with fast USB-C top-ups (10 mins gives 5 hours).'
      },
      student_budget: {
        winner_id: 'aerostore-hypersound',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore HyperSound ANC Pro',
        summary: 'At $199.99 (or $159.99 with code SAVE20), AeroStore is more than $229 cheaper than the Bose QC Ultra, delivering an unbeatable value for college study sessions.',
        persona_fit: 'Ideal for library focus, campus commuting, and online lectures with multi-point Bluetooth device switching.',
        value_score: {
          'aerostore-hypersound': 9.9,
          'sennheiser-momentum-4': 8.1,
          'sony-wh1000xm5': 7.5,
          'bose-qc-ultra': 7.0
        },
        recommendation: 'Take advantage of our instant coupon SAVE20 at checkout for the ultimate student audio deal.'
      },
      gamer: {
        winner_id: 'aerostore-hypersound',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore HyperSound ANC Pro',
        summary: 'Offers ultra-low latency Bluetooth gaming mode (<45ms) plus direct analog 3.5mm low-impedance wired connection for zero lag in competitive matches.',
        persona_fit: 'Gamers get clear directional footsteps and crystal-clear Discord voice pickup without having to buy a bulky gaming headset.',
        value_score: {
          'aerostore-hypersound': 9.4,
          'sennheiser-momentum-4': 8.3,
          'sony-wh1000xm5': 8.1,
          'bose-qc-ultra': 7.6
        },
        recommendation: 'Plug into your PC, Xbox, or PS5 controller with the included braided cable for zero-latency spatial audio.'
      }
    }
  },

  'PROD-102': {
    id: 'PROD-102',
    item_type: 'Mechanical Gaming Keyboard',
    category: 'Keyboards',
    icon: '⌨️',
    description: 'Comparing 4 leading mechanical keyboards on switch responsiveness, polling rate, acoustics, and durability.',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Switch Architecture',
      'Polling Rate & Latency',
      'Chassis & Frame Build',
      'Keycap Construction',
      'RGB Lighting System',
      'Manufacturer Warranty',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-ergoflow',
        brand: 'AeroStore',
        model: 'ErgoFlow RGB Pro',
        name: 'AeroStore ErgoFlow RGB Mechanical',
        is_store_product: true,
        store_product_id: 'PROD-102',
        badge: 'Our Store Flagship 🌟',
        price: 129.50,
        rating: 4.9,
        image_url: '/assets/keyboard.svg',
        stock: 18,
        specs: {
          'Brand & Manufacturer': 'AeroStore Hardware Labs',
          'Model Name': 'ErgoFlow RGB Pro 75%',
          'MSRP / Retail Price': '$129.50 (Store Direct)',
          'Switch Architecture': 'Hot-Swappable Custom Red Linear (5-Pin PCB)',
          'Polling Rate & Latency': '1000Hz Ultra-Fast / 1ms Latency',
          'Chassis & Frame Build': 'CNC Anodized Aluminum Top + Acoustic Foam Dampening',
          'Keycap Construction': 'Double-Shot PBT OEM Profile (Fade-Resistant)',
          'RGB Lighting System': 'Per-Key 16.8M South-Facing LEDs + Underglow',
          'Manufacturer Warranty': '2-Year Direct Replacement Warranty',
          'Value-to-Price Rating': '9.9 / 10'
        },
        pros: [
          'Pre-lubed linear switches with factory dampening foam for a creamy sound profile',
          'Full hot-swap socket compatibility with Cherry, Gateron, and Kailh switches',
          'Premium aluminum top frame at an unbeatable $129.50 price point'
        ],
        cons: [
          'High demand occasionally causes temporary inventory sellouts'
        ]
      },
      {
        id: 'keychron-q1-pro',
        brand: 'Keychron',
        model: 'Q1 Pro Custom',
        name: 'Keychron Q1 Pro Wireless',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 199.00,
        rating: 4.7,
        image_url: '/assets/keyboard.svg',
        stock: 9,
        specs: {
          'Brand & Manufacturer': 'Keychron Inc.',
          'Model Name': 'Q1 Pro QMK/VIA Custom Keyboard',
          'MSRP / Retail Price': '$199.00 Retail',
          'Switch Architecture': 'Hot-Swappable Keychron K Pro Mechanical',
          'Polling Rate & Latency': '1000Hz (Wired) / 90Hz (Bluetooth)',
          'Chassis & Frame Build': 'Full CNC Machined 6063 Aluminum (1,724g)',
          'Keycap Construction': 'Double-Shot KSA Profile PBT',
          'RGB Lighting System': 'South-Facing RGB Backlight (14 presets)',
          'Manufacturer Warranty': '1-Year Limited Warranty',
          'Value-to-Price Rating': '8.5 / 10'
        },
        pros: [
          'Open-source QMK/VIA key remapping support',
          'Very heavy, premium solid aluminum chassis'
        ],
        cons: [
          '$70 higher price tag ($199.00)',
          'Extremely heavy (1.7kg) making it inconvenient for desktop mobility'
        ]
      },
      {
        id: 'logitech-g-pro-x-tkl',
        brand: 'Logitech G',
        model: 'PRO X TKL Lightspeed',
        name: 'Logitech G PRO X TKL',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 199.99,
        rating: 4.6,
        image_url: '/assets/keyboard.svg',
        stock: 14,
        specs: {
          'Brand & Manufacturer': 'Logitech Gaming',
          'Model Name': 'G PRO X TKL Lightspeed Wireless',
          'MSRP / Retail Price': '$199.99 Retail',
          'Switch Architecture': 'Fixed GX Red Linear Switches (Non Hot-Swap)',
          'Polling Rate & Latency': '1000Hz Lightspeed Wireless',
          'Chassis & Frame Build': 'Dual-Material Plastic Base + Steel Top Plate',
          'Keycap Construction': 'Dual-Shot PBT Keycaps',
          'RGB Lighting System': 'Lightsync RGB per-key illumination',
          'Manufacturer Warranty': '2-Year Limited Hardware Warranty',
          'Value-to-Price Rating': '8.1 / 10'
        },
        pros: [
          'Reliable Lightspeed wireless connectivity for esports tournaments',
          'Included hardshell travel case'
        ],
        cons: [
          'Non hot-swappable switches: cannot replace individual switch stems',
          'Hollow plastic underside resonance without acoustic dampening'
        ]
      },
      {
        id: 'corsair-k70-rgb-pro',
        brand: 'Corsair',
        model: 'K70 RGB PRO',
        name: 'Corsair K70 RGB PRO',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 179.99,
        rating: 4.5,
        image_url: '/assets/keyboard.svg',
        stock: 6,
        specs: {
          'Brand & Manufacturer': 'Corsair Gaming Inc.',
          'Model Name': 'K70 RGB PRO Mechanical Keyboard',
          'MSRP / Retail Price': '$179.99 Retail',
          'Switch Architecture': 'Cherry MX Red / Speed Silver (Soldered)',
          'Polling Rate & Latency': '8000Hz Axon Hyper-Processing / 0.25ms',
          'Chassis & Frame Build': 'Brushed Aircraft-Grade Aluminum Frame',
          'Keycap Construction': 'Precision Molded PBT Double-Shot (1.5mm)',
          'RGB Lighting System': 'Dynamic Per-Key RGB + iCUE Control',
          'Manufacturer Warranty': '2-Year Limited Warranty',
          'Value-to-Price Rating': '8.3 / 10'
        },
        pros: [
          'Dedicated media roller and tournament lockout switch',
          '8000Hz Axon hyper-polling rate'
        ],
        cons: [
          'Requires heavy, resource-intensive iCUE software running in background',
          'Switches are soldered directly to PCB with no hot-swap capability'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-ergoflow',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore ErgoFlow RGB Mechanical',
        summary: 'AeroStore ErgoFlow RGB delivers true custom-enthusiast features—hot-swappable switch sockets, pre-installed sound dampening foam, and double-shot PBT keycaps—at only $129.50 compared to $199 for Logitech and Keychron.',
        persona_fit: 'Ideal for programmers, typists, and gamers seeking a premium acoustic typing feel without spending $200+.',
        value_score: {
          'aerostore-ergoflow': 9.9,
          'keychron-q1-pro': 8.5,
          'corsair-k70-rgb-pro': 8.3,
          'logitech-g-pro-x-tkl': 8.1
        },
        recommendation: 'Get the AeroStore ErgoFlow RGB for enthusiast-grade keystrokes and hot-swappable customizability at an honest price.'
      },
      gamer: {
        winner_id: 'aerostore-ergoflow',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore ErgoFlow RGB Mechanical',
        summary: 'With 1000Hz polling, instant 1ms actuation, and smooth pre-lubed linear switches, the ErgoFlow provides instantaneous key registration for Counter-Strike, Valorant, and MOBA gaming.',
        persona_fit: 'Competitive gamers get the compact 75% desk footprint that leaves maximum mousepad room for low-DPI flick shots.',
        value_score: {
          'aerostore-ergoflow': 9.8,
          'corsair-k70-rgb-pro': 9.0,
          'logitech-g-pro-x-tkl': 8.7,
          'keychron-q1-pro': 8.0
        },
        recommendation: 'Save $70 over Logitech while gaining hot-swap freedom to customize your WASD switch tensions.'
      },
      audiophile: {
        winner_id: 'aerostore-ergoflow',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore ErgoFlow RGB Mechanical',
        summary: 'Dual layers of EVA acoustic dampening foam inside the ErgoFlow eliminate the metallic pinging heard on Corsair and Logitech keyboards.',
        persona_fit: 'Sound enthusiasts will love the deep, thocky acoustic resonance out of the box without needing to manually disassemble and lube switches.',
        value_score: {
          'aerostore-ergoflow': 9.7,
          'keychron-q1-pro': 9.1,
          'corsair-k70-rgb-pro': 7.6,
          'logitech-g-pro-x-tkl': 7.3
        },
        recommendation: 'Hear the difference of factory-tuned stabilizers and padded sound-absorber pads.'
      },
      student_budget: {
        winner_id: 'aerostore-ergoflow',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore ErgoFlow RGB Mechanical',
        summary: 'At $129.50, the ErgoFlow leaves money in your pocket while providing 5-pin hot-swap capability so you can upgrade switches years down the line.',
        persona_fit: 'Perfect for dorm room productivity, essay writing, and late-night study sessions with quiet linear switches.',
        value_score: {
          'aerostore-ergoflow': 9.9,
          'corsair-k70-rgb-pro': 8.0,
          'keychron-q1-pro': 7.9,
          'logitech-g-pro-x-tkl': 7.5
        },
        recommendation: 'Use code SAVE20 at checkout to secure the ErgoFlow for just $103.60.'
      },
      commuter: {
        winner_id: 'aerostore-ergoflow',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore ErgoFlow RGB Mechanical',
        summary: 'Weighing 820g with a detachable braided USB-C cable, the ErgoFlow is significantly more portable than Keychron’s 1.7kg heavyweight frame.',
        persona_fit: 'Great for hybrid workers transporting their keyboard between home and office.',
        value_score: {
          'aerostore-ergoflow': 9.5,
          'logitech-g-pro-x-tkl': 8.9,
          'corsair-k70-rgb-pro': 8.0,
          'keychron-q1-pro': 7.2
        },
        recommendation: 'Unplug the USB-C cable and slide the 75% ErgoFlow easily into standard 15-inch laptop sleeves.'
      }
    }
  },

  'PROD-103': {
    id: 'PROD-103',
    item_type: 'Curved OLED Gaming Monitor',
    category: 'Monitors',
    icon: '🖥️',
    tagline: '34" Ultrawide High-Refresh OLED Displays Benchmark',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Screen Size & Curvature',
      'Panel Tech & Color Gamut',
      'Refresh Rate & Response Time',
      'Display Connectivity & PD',
      'HDR Performance Standard',
      'Manufacturer Warranty',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-ultravision',
        brand: 'AeroStore',
        model: 'UltraVision 34" OLED',
        name: 'AeroStore UltraVision 34" Curved OLED',
        is_store_product: true,
        store_product_id: 'PROD-103',
        badge: 'Our Store Flagship 🌟',
        price: 599.00,
        rating: 4.9,
        image_url: '/assets/monitor.svg',
        stock: 7,
        specs: {
          'Brand & Manufacturer': 'AeroStore Displays',
          'Model Name': 'UltraVision OLED 34W (1800R)',
          'MSRP / Retail Price': '$599.00 Direct Pricing',
          'Screen Size & Curvature': '34" 21:9 WQHD (3440 x 1440) 1800R Curve',
          'Panel Tech & Color Gamut': 'Quantum OLED (99% DCI-P3, 10-Bit Color)',
          'Refresh Rate & Response Time': '175Hz / 0.03ms GtG Pixel Response',
          'Display Connectivity & PD': 'DP 1.4, HDMI 2.1 x2, USB-C (90W Power Delivery)',
          'HDR Performance Standard': 'VESA DisplayHDR True Black 400 (Infinite Contrast)',
          'Manufacturer Warranty': '3-Year Direct Burn-in Coverage & Advanced Replacement',
          'Value-to-Price Rating': '9.9 / 10 (Disruptive Value)'
        },
        pros: [
          '$599 price point disrupts $1,000+ OLED monitor market',
          'Single-cable USB-C with 90W fast charging for laptops',
          'Comprehensive 3-year OLED burn-in warranty included'
        ],
        cons: [
          'High demand limits orders to 2 units per customer'
        ]
      },
      {
        id: 'samsung-odyssey-oled-g8',
        brand: 'Samsung',
        model: 'Odyssey OLED G8',
        name: 'Samsung Odyssey OLED G8 (G85SB)',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 1199.99,
        rating: 4.7,
        image_url: '/assets/monitor.svg',
        stock: 4,
        specs: {
          'Brand & Manufacturer': 'Samsung Electronics',
          'Model Name': 'Odyssey OLED G8 34" Curved',
          'MSRP / Retail Price': '$1,199.99 Retail',
          'Screen Size & Curvature': '34" 21:9 WQHD (3440 x 1440) 1800R Curve',
          'Panel Tech & Color Gamut': 'QD-OLED (99.3% DCI-P3)',
          'Refresh Rate & Response Time': '175Hz / 0.03ms GtG',
          'Display Connectivity & PD': 'Micro HDMI 2.1, Mini DP 1.4, USB-C (65W)',
          'HDR Performance Standard': 'VESA DisplayHDR True Black 400',
          'Manufacturer Warranty': '3-Year Limited Warranty',
          'Value-to-Price Rating': '7.9 / 10'
        },
        pros: [
          'Integrated Samsung Smart TV Hub and Gaming Hub',
          'Sleek 3.9mm metal chassis thickness'
        ],
        cons: [
          'Double the price ($1,199.99 vs. $599.00) for identical OLED panel tech',
          'Uses non-standard Micro-HDMI and Mini-DisplayPort requiring adapter dongles'
        ]
      },
      {
        id: 'alienware-aw3423dwf',
        brand: 'Alienware',
        model: 'AW3423DWF QD-OLED',
        name: 'Alienware 34" Curved QD-OLED',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 799.99,
        rating: 4.7,
        image_url: '/assets/monitor.svg',
        stock: 8,
        specs: {
          'Brand & Manufacturer': 'Dell / Alienware',
          'Model Name': 'AW3423DWF Gaming Monitor',
          'MSRP / Retail Price': '$799.99 Retail',
          'Screen Size & Curvature': '34" 21:9 WQHD (3440 x 1440) 1800R Curve',
          'Panel Tech & Color Gamut': 'Quantum Dot OLED (99.3% DCI-P3)',
          'Refresh Rate & Response Time': '165Hz / 0.1ms GtG',
          'Display Connectivity & PD': 'DP 1.4 x2, HDMI 2.0 x1, USB 3.2 Hub (No USB-C PD)',
          'HDR Performance Standard': 'VESA DisplayHDR True Black 400',
          'Manufacturer Warranty': '3-Year Premium Panel Exchange with Burn-in',
          'Value-to-Price Rating': '8.7 / 10'
        },
        pros: [
          'Legend 2.0 industrial design with customizable AlienFX lighting',
          'Dedicated factory color calibration report included'
        ],
        cons: [
          '$200 higher than AeroStore without any USB-C laptop power delivery',
          'HDMI 2.0 port limits console 120Hz bandwidth compared to HDMI 2.1'
        ]
      },
      {
        id: 'lg-ultragear-34gs95qe',
        brand: 'LG Electronics',
        model: 'UltraGear 34GS95QE',
        name: 'LG UltraGear 34" OLED',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 999.99,
        rating: 4.6,
        image_url: '/assets/monitor.svg',
        stock: 3,
        specs: {
          'Brand & Manufacturer': 'LG Electronics',
          'Model Name': 'UltraGear 34GS95QE-B',
          'MSRP / Retail Price': '$999.99 Retail',
          'Screen Size & Curvature': '34" 21:9 WQHD (3440 x 1440) Aggressive 800R',
          'Panel Tech & Color Gamut': 'WOLED (98.5% DCI-P3 Anti-Glare)',
          'Refresh Rate & Response Time': '240Hz / 0.03ms GtG',
          'Display Connectivity & PD': 'HDMI 2.1 x2, DP 1.4 x1 (No USB-C)',
          'HDR Performance Standard': 'VESA DisplayHDR True Black 400',
          'Manufacturer Warranty': '2-Year Limited Warranty',
          'Value-to-Price Rating': '8.2 / 10'
        },
        pros: [
          'Higher 240Hz maximum refresh rate for pure esports enthusiasts',
          'Matte anti-glare coating reduces daytime window reflections'
        ],
        cons: [
          'Expensive $999.99 price tag ($400 more than AeroStore)',
          'Extreme 800R curve can distort straight lines in graphic design & spreadsheets'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-ultravision',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore UltraVision 34" Curved OLED',
        summary: 'AeroStore UltraVision delivers the exact same peerless Quantum OLED contrast and 175Hz 0.03ms speed as Samsung’s $1,200 Odyssey G8, but at an incredible $599.00 with full 90W USB-C charging.',
        persona_fit: 'The definitive choice for gamers, content creators, and professionals demanding infinite black levels and ultrawide multitasking.',
        value_score: {
          'aerostore-ultravision': 9.9,
          'alienware-aw3423dwf': 8.7,
          'lg-ultragear-34gs95qe': 8.2,
          'samsung-odyssey-oled-g8': 7.9
        },
        recommendation: 'Save $600 compared to Samsung without sacrificing OLED panel quality or warranty coverage.'
      },
      gamer: {
        winner_id: 'aerostore-ultravision',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore UltraVision 34" Curved OLED',
        summary: 'Near-instantaneous 0.03ms pixel transition eliminates all motion blur and ghosting in fast-paced racing and first-person shooters.',
        persona_fit: 'Full HDMI 2.1 support ensures high-refresh PC and console gaming with VRR (Variable Refresh Rate) and G-Sync compatibility.',
        value_score: {
          'aerostore-ultravision': 9.8,
          'lg-ultragear-34gs95qe': 9.3,
          'alienware-aw3423dwf': 8.9,
          'samsung-odyssey-oled-g8': 8.1
        },
        recommendation: 'Experience true immersion with 3440x1440p resolution and zero backlight bleed.'
      },
      audiophile: {
        winner_id: 'aerostore-ultravision',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore UltraVision 34" Curved OLED',
        summary: 'Silent fanless passive cooling architecture ensures zero ambient coil whine or fan hum in quiet music production studios.',
        persona_fit: 'Massive 21:9 aspect ratio fits up to 60 audio tracks and mixer panels side by side in Pro Tools or Ableton Live.',
        value_score: {
          'aerostore-ultravision': 9.7,
          'alienware-aw3423dwf': 8.8,
          'samsung-odyssey-oled-g8': 8.2,
          'lg-ultragear-34gs95qe': 7.9
        },
        recommendation: 'A studio centerpiece that charges your Mac or audio laptop directly over USB-C.'
      },
      student_budget: {
        winner_id: 'aerostore-ultravision',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore UltraVision 34" Curved OLED',
        summary: 'Brings true flagship OLED technology under $600 for the first time in consumer computing.',
        persona_fit: 'Eliminates the need for dual monitor setups with spacious 3-window side-by-side research multitasking.',
        value_score: {
          'aerostore-ultravision': 9.9,
          'alienware-aw3423dwf': 8.1,
          'lg-ultragear-34gs95qe': 7.4,
          'samsung-odyssey-oled-g8': 6.8
        },
        recommendation: 'The most value-dense display purchase on the market today.'
      },
      commuter: {
        winner_id: 'aerostore-ultravision',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore UltraVision 34" Curved OLED',
        summary: 'Single cable USB-C docking station allows work laptops to plug in with one cord for display, keyboard/mouse hub, and 90W charging.',
        persona_fit: 'Simplifies hybrid desk setups: dock your travel laptop immediately upon arriving home.',
        value_score: {
          'aerostore-ultravision': 9.8,
          'samsung-odyssey-oled-g8': 8.3,
          'alienware-aw3423dwf': 7.8,
          'lg-ultragear-34gs95qe': 7.3
        },
        recommendation: 'Clear clutter from your desk with built-in USB-C hub connectivity.'
      }
    }
  },

  'PROD-104': {
    id: 'PROD-104',
    item_type: 'Smart Health & GPS Watch',
    category: 'Wearables',
    icon: '⌚',
    tagline: 'Titanium & Sapphire Multisport Health Telemetry Benchmark',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Chassis & Glass Materials',
      'Battery Endurance (Days)',
      'GPS & Navigation System',
      'Biometric & Sensor Array',
      'Water Resistance Rating',
      'Manufacturer Warranty',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-titanium-x',
        brand: 'AeroStore',
        model: 'Titanium Series X',
        name: 'AeroStore Titanium Watch Series X',
        is_store_product: true,
        store_product_id: 'PROD-104',
        badge: 'Our Store Flagship 🌟',
        price: 249.99,
        rating: 4.9,
        image_url: '/assets/watch.svg',
        stock: 15,
        specs: {
          'Brand & Manufacturer': 'AeroStore Wearables',
          'Model Name': 'Titanium Series X Rugged Sport',
          'MSRP / Retail Price': '$249.99 Direct to Consumer',
          'Chassis & Glass Materials': 'Grade 5 Aerospace Titanium + Pure Sapphire Crystal',
          'Battery Endurance (Days)': '7 Days Regular Use (14 Days Power Saver)',
          'GPS & Navigation System': 'Dual-Frequency L1+L5 All-Constellation GNSS',
          'Biometric & Sensor Array': 'Optical Heart Rate, SpO2, ECG, Skin Temp, Sleep Stages',
          'Water Resistance Rating': '50m (5 ATM) Swimproof & Surf Rated',
          'Manufacturer Warranty': '2-Year Direct Replacement Warranty',
          'Value-to-Price Rating': '9.8 / 10'
        },
        pros: [
          'Full Grade 5 titanium chassis and scratchproof sapphire glass for $249.99',
          '7-day real-world battery life avoids nightly charging frustration',
          'Cross-platform support: works seamlessly with both iOS and Android'
        ],
        cons: [
          'Does not support cellular LTE standalone calls without paired phone'
        ]
      },
      {
        id: 'apple-watch-ultra-2',
        brand: 'Apple',
        model: 'Watch Ultra 2',
        name: 'Apple Watch Ultra 2 GPS + Cellular',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 799.00,
        rating: 4.8,
        image_url: '/assets/watch.svg',
        stock: 7,
        specs: {
          'Brand & Manufacturer': 'Apple Inc.',
          'Model Name': 'Apple Watch Ultra 2 (49mm)',
          'MSRP / Retail Price': '$799.00 Retail',
          'Chassis & Glass Materials': 'Aerospace Titanium Case + Sapphire Front Crystal',
          'Battery Endurance (Days)': '1.5 Days (36h Typical, 72h Low Power)',
          'GPS & Navigation System': 'Precision Dual-Frequency GPS (L1 and L5)',
          'Biometric & Sensor Array': 'Electrical Heart Sensor (ECG), Blood O2, Depth Gauge',
          'Water Resistance Rating': '100m Dive Rated (EN13319)',
          'Manufacturer Warranty': '1-Year Limited Apple Warranty',
          'Value-to-Price Rating': '8.0 / 10'
        },
        pros: [
          'Ultra-bright 3000-nit display and standalone LTE cellular calling',
          'Deep dive computer app integration with water temperature telemetry'
        ],
        cons: [
          'More than 3x the price ($799.00) of AeroStore',
          'Short 36-hour battery requires daily charging; incompatible with Android phones'
        ]
      },
      {
        id: 'garmin-fenix-7-pro',
        brand: 'Garmin',
        model: 'Fenix 7 Pro Sapphire Solar',
        name: 'Garmin Fenix 7 Pro Solar',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 799.99,
        rating: 4.8,
        image_url: '/assets/watch.svg',
        stock: 5,
        specs: {
          'Brand & Manufacturer': 'Garmin Ltd.',
          'Model Name': 'Fenix 7 Pro Sapphire Solar (47mm)',
          'MSRP / Retail Price': '$799.99 Retail',
          'Chassis & Glass Materials': 'Titanium Bezel + Power Sapphire Glass',
          'Battery Endurance (Days)': '18 - 22 Days with Solar Charging',
          'GPS & Navigation System': 'Multi-Band GNSS with SatIQ Technology',
          'Biometric & Sensor Array': 'Elevate Gen 5 Heart Rate, Pulse Ox, HRV Status',
          'Water Resistance Rating': '100m (10 ATM)',
          'Manufacturer Warranty': '1-Year Limited Garmin Warranty',
          'Value-to-Price Rating': '8.4 / 10'
        },
        pros: [
          'Industry benchmark battery endurance with solar charging',
          'Pre-loaded topographic trail maps and built-in LED flashlight'
        ],
        cons: [
          'High $799.99 price tag',
          'MIP display has duller indoor colors compared to vibrant AMOLED screens'
        ]
      },
      {
        id: 'samsung-galaxy-watch-ultra',
        brand: 'Samsung',
        model: 'Galaxy Watch Ultra',
        name: 'Samsung Galaxy Watch Ultra',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 649.99,
        rating: 4.6,
        image_url: '/assets/watch.svg',
        stock: 6,
        specs: {
          'Brand & Manufacturer': 'Samsung Electronics',
          'Model Name': 'Galaxy Watch Ultra (47mm)',
          'MSRP / Retail Price': '$649.99 Retail',
          'Chassis & Glass Materials': 'Grade 4 Titanium Frame + Sapphire Crystal',
          'Battery Endurance (Days)': '2.5 Days (60h Typical, 100h Power Saver)',
          'GPS & Navigation System': 'Dual-Frequency L1+L5 GPS',
          'Biometric & Sensor Array': 'BioActive Sensor (Optical HR, ECG, Body Composition)',
          'Water Resistance Rating': '100m (10 ATM)',
          'Manufacturer Warranty': '1-Year Limited Warranty',
          'Value-to-Price Rating': '8.1 / 10'
        },
        pros: [
          'Advanced body composition analysis (BIA) and sleep apnea detection',
          'Rugged cushion-frame design with emergency siren'
        ],
        cons: [
          '$400 more expensive than AeroStore',
          'Certain ECG features restricted unless paired to Samsung Galaxy phones'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-titanium-x',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Titanium Watch Series X',
        summary: 'AeroStore Titanium Series X brings genuine Grade 5 titanium and pure sapphire crystal to the $249.99 price point—offering full 7-day battery life and universal iOS & Android sync while saving shoppers over $500 compared to Apple and Garmin.',
        persona_fit: 'The smart choice for fitness tracking, sleep metrics, and rugged everyday wear without paying exorbitant luxury markups.',
        value_score: {
          'aerostore-titanium-x': 9.8,
          'garmin-fenix-7-pro': 8.4,
          'samsung-galaxy-watch-ultra': 8.1,
          'apple-watch-ultra-2': 8.0
        },
        recommendation: 'Enjoy top-grade titanium durability and week-long battery life for only $249.99.'
      },
      commuter: {
        winner_id: 'aerostore-titanium-x',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Titanium Watch Series X',
        summary: '7-day battery endurance means you can travel for a full week without packing an extra proprietary magnetic charging puck.',
        persona_fit: 'Reliable vibration alarms, boarding pass notifications, and automatic time-zone synchronization.',
        value_score: {
          'aerostore-titanium-x': 9.7,
          'garmin-fenix-7-pro': 9.0,
          'apple-watch-ultra-2': 7.6,
          'samsung-galaxy-watch-ultra': 7.8
        },
        recommendation: 'Leave the charging cable at home during your next business trip.'
      },
      gamer: {
        winner_id: 'aerostore-titanium-x',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Titanium Watch Series X',
        summary: 'Continuous HRV (Heart Rate Variability) and stress telemetry lets esports competitors track focus fatigue and heart spikes during high-stakes clutches.',
        persona_fit: 'Lightweight titanium casing sits comfortably on the wrist without interfering with mousepad wrist movements.',
        value_score: {
          'aerostore-titanium-x': 9.6,
          'apple-watch-ultra-2': 8.2,
          'samsung-galaxy-watch-ultra': 8.0,
          'garmin-fenix-7-pro': 7.9
        },
        recommendation: 'Monitor your cognitive recovery and heart rates during competitive sessions.'
      },
      student_budget: {
        winner_id: 'aerostore-titanium-x',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Titanium Watch Series X',
        summary: 'At $249.99 ($199.99 with coupon SAVE20), it costs less than a third of the Apple Watch Ultra 2 while delivering identical Grade 5 titanium protection.',
        persona_fit: 'Track workouts, track sleep cycles during exam weeks, and receive discreet lecture notifications.',
        value_score: {
          'aerostore-titanium-x': 9.9,
          'samsung-galaxy-watch-ultra': 7.5,
          'garmin-fenix-7-pro': 7.2,
          'apple-watch-ultra-2': 6.8
        },
        recommendation: 'Get the premium titanium aesthetic without taking on credit card debt.'
      },
      audiophile: {
        winner_id: 'aerostore-titanium-x',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Titanium Watch Series X',
        summary: 'Includes standalone onboard music storage with direct Bluetooth headphone pairing, enabling phone-free runs with your favorite high-bitrate tracks.',
        persona_fit: 'Seamless Bluetooth connectivity to the AeroStore HyperSound ANC headphones.',
        value_score: {
          'aerostore-titanium-x': 9.5,
          'garmin-fenix-7-pro': 8.8,
          'apple-watch-ultra-2': 8.5,
          'samsung-galaxy-watch-ultra': 8.0
        },
        recommendation: 'Pair directly with your wireless headphones for uninterrupted listening.'
      }
    }
  },

  'PROD-106': {
    id: 'PROD-106',
    item_type: 'Esports Gaming Mouse',
    category: 'Accessories',
    icon: '🖱️',
    tagline: 'Ultralight High-Precision Optical Sensors Benchmark',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Optical Sensor Precision',
      'Chassis Weight (Ultralight)',
      'Battery Runtime (Continuous)',
      'Primary Switch Technology',
      'Wireless Connectivity',
      'Manufacturer Warranty',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-aerogrip',
        brand: 'AeroStore',
        model: 'AeroGrip Precision',
        name: 'AeroStore AeroGrip Precision 58g',
        is_store_product: true,
        store_product_id: 'PROD-106',
        badge: 'Our Store Flagship 🌟',
        price: 49.99,
        rating: 4.8,
        image_url: '/assets/mouse.svg',
        stock: 30,
        specs: {
          'Brand & Manufacturer': 'AeroStore Esports Labs',
          'Model Name': 'AeroGrip Precision Ultralight',
          'MSRP / Retail Price': '$49.99 Factory Direct',
          'Optical Sensor Precision': '26,000 DPI PixArt Optical (650 IPS / 50G)',
          'Chassis Weight (Ultralight)': '58g Solid Shell (Zero-Honeycomb Dustproof)',
          'Battery Runtime (Continuous)': '80 Hours Nonstop Wireless Gaming',
          'Primary Switch Technology': 'Optical Gen-3 (100M Clicks, Zero Debounce Delay)',
          'Wireless Connectivity': '2.4GHz Ultra-Low Lag + Bluetooth 5.2 + Paracord Wired',
          'Manufacturer Warranty': '2-Year Direct Replacement Warranty',
          'Value-to-Price Rating': '9.9 / 10'
        },
        pros: [
          'Incredible $49.99 price point: $110 cheaper than Logitech and Razer flagships',
          'Solid 58g shell prevents sweat and dust buildup common with honeycomb mice',
          'Zero double-click optical switches rated for 100 million clicks'
        ],
        cons: [
          'Basic software utility compared to bloated cloud suites'
        ]
      },
      {
        id: 'logitech-g-pro-x-superlight-2',
        brand: 'Logitech G',
        model: 'PRO X Superlight 2',
        name: 'Logitech G PRO X Superlight 2',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 159.99,
        rating: 4.8,
        image_url: '/assets/mouse.svg',
        stock: 11,
        specs: {
          'Brand & Manufacturer': 'Logitech G',
          'Model Name': 'G PRO X Superlight 2 Lightspeed',
          'MSRP / Retail Price': '$159.99 Retail',
          'Optical Sensor Precision': '32,000 DPI HERO 2 Sensor (500 IPS / 40G)',
          'Chassis Weight (Ultralight)': '60g Lightweight Symmetrical Shell',
          'Battery Runtime (Continuous)': '95 Hours Continuous Motion',
          'Primary Switch Technology': 'Lightforce Hybrid Optical-Mechanical Switches',
          'Wireless Connectivity': 'Lightspeed 2.4GHz Wireless (2000Hz Polling)',
          'Manufacturer Warranty': '2-Year Limited Hardware Warranty',
          'Value-to-Price Rating': '8.3 / 10'
        },
        pros: [
          'Widely adopted shape in competitive CS2 and Valorant pro circuits',
          'Smooth large-format zero-additive PTFE mouse feet'
        ],
        cons: [
          '$110 more expensive ($159.99 vs. $49.99) for negligible real-world sensor difference',
          'Lacks Bluetooth connectivity for mobile laptop productivity'
        ]
      },
      {
        id: 'razer-viper-v3-pro',
        brand: 'Razer',
        model: 'Viper V3 Pro',
        name: 'Razer Viper V3 Pro',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 159.99,
        rating: 4.7,
        image_url: '/assets/mouse.svg',
        stock: 8,
        specs: {
          'Brand & Manufacturer': 'Razer Inc.',
          'Model Name': 'Viper V3 Pro Wireless',
          'MSRP / Retail Price': '$159.99 Retail',
          'Optical Sensor Precision': '35,000 DPI Focus Pro 35K Gen-2 Sensor',
          'Chassis Weight (Ultralight)': '54g Ultra-Lightweight Symmetrical',
          'Battery Runtime (Continuous)': '95 Hours (17h at 8000Hz HyperPolling)',
          'Primary Switch Technology': 'Razer Optical Gen-3 (90M Clicks)',
          'Wireless Connectivity': 'Razer HyperSpeed Wireless (Up to 8000Hz)',
          'Manufacturer Warranty': '2-Year Limited Warranty',
          'Value-to-Price Rating': '8.2 / 10'
        },
        pros: [
          'Extremely light 54g chassis with excellent coating grip',
          'True 8000Hz polling rate support out of the box'
        ],
        cons: [
          '$159.99 price is steep for everyday users',
          '8000Hz polling drains battery rapidly down to 17 hours'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-aerogrip',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore AeroGrip Precision 58g',
        summary: 'At $49.99, AeroStore AeroGrip provides 98% of the performance of $160 esports flagships with a top-tier PixArt 26K optical sensor, 58g ultralight solid shell, and 80-hour battery life.',
        persona_fit: 'Perfect for anyone wanting a high-precision, lag-free wireless mouse for work and high-level gaming without wasting money.',
        value_score: {
          'aerostore-aerogrip': 9.9,
          'logitech-g-pro-x-superlight-2': 8.3,
          'razer-viper-v3-pro': 8.2
        },
        recommendation: 'Get the AeroStore AeroGrip and put the remaining $110 toward other hardware upgrades.'
      },
      gamer: {
        winner_id: 'aerostore-aerogrip',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore AeroGrip Precision 58g',
        summary: 'Optical Gen-3 microswitches register clicks via infrared light beams, removing mechanical debounce delay and ensuring every sniper flick connects instantly.',
        persona_fit: 'Esports enthusiasts get the balanced 58g weight distribution with zero honeycomb holes that degrade hand grip.',
        value_score: {
          'aerostore-aerogrip': 9.8,
          'razer-viper-v3-pro': 9.1,
          'logitech-g-pro-x-superlight-2': 8.8
        },
        recommendation: 'Experience tournament-grade tracking with virgin PTFE glide skates.'
      },
      student_budget: {
        winner_id: 'aerostore-aerogrip',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore AeroGrip Precision 58g',
        summary: 'Priced at only $49.99 (or $39.99 with discount code SAVE20), it provides unmatched affordability for students needing one mouse for study and gaming.',
        persona_fit: 'Includes dual 2.4GHz dongle and Bluetooth 5.2 modes to easily switch between your desktop and classroom laptop.',
        value_score: {
          'aerostore-aerogrip': 9.9,
          'logitech-g-pro-x-superlight-2': 7.2,
          'razer-viper-v3-pro': 7.0
        },
        recommendation: 'An easy buying choice for student budgets.'
      },
      commuter: {
        winner_id: 'aerostore-aerogrip',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore AeroGrip Precision 58g',
        summary: 'Features integrated Bluetooth 5.2 in addition to the 2.4GHz receiver, so you can navigate laptop spreadsheets on trains without using a USB-A dongle.',
        persona_fit: 'Ultralight 58g build adds zero noticeable weight to your travel backpack.',
        value_score: {
          'aerostore-aerogrip': 9.7,
          'logitech-g-pro-x-superlight-2': 7.5,
          'razer-viper-v3-pro': 7.6
        },
        recommendation: 'Bluetooth versatility combined with 80 hours of battery life makes it an ideal travel companion.'
      },
      audiophile: {
        winner_id: 'aerostore-aerogrip',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore AeroGrip Precision 58g',
        summary: 'Silent optical switch dampening minimizes sharp click resonance in quiet recording studios and podcast booths.',
        persona_fit: 'Audio editors enjoy smooth timeline scrubbing and precise wave-level micro-adjustments.',
        value_score: {
          'aerostore-aerogrip': 9.5,
          'logitech-g-pro-x-superlight-2': 8.0,
          'razer-viper-v3-pro': 7.8
        },
        recommendation: 'Accurate pixel-by-pixel editing in audio DAW software.'
      }
    }
  },

  'PROD-105': {
    id: 'PROD-105',
    item_type: 'Streetwear Heavyweight Hoodie',
    category: 'Apparel',
    icon: '🧥',
    tagline: 'Heavy French Terry Designer Apparel Benchmark',
    spec_keys: [
      'Brand & Manufacturer',
      'Model Name',
      'MSRP / Retail Price',
      'Fabric Density (GSM)',
      'Material Composition',
      'Pocket & Hardware Engineering',
      'Fit & Silhouette Styling',
      'Durability & Shrink Resistance',
      'Manufacturer Guarantee',
      'Value-to-Price Rating'
    ],
    brands: [
      {
        id: 'aerostore-cyberpunk-hoodie',
        brand: 'AeroStore',
        model: 'Cyberpunk Heavyweight',
        name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        is_store_product: true,
        store_product_id: 'PROD-105',
        badge: 'Our Store Flagship 🌟',
        price: 79.99,
        rating: 4.8,
        image_url: '/assets/hoodie.svg',
        stock: 20,
        specs: {
          'Brand & Manufacturer': 'AeroStore Streetwear Studio',
          'Model Name': 'Cyberpunk Heavyweight French Terry',
          'MSRP / Retail Price': '$79.99 Store Direct',
          'Fabric Density (GSM)': '450 GSM Ultra-Dense French Terry',
          'Material Composition': '100% Organic Ring-Spun Combed Cotton',
          'Pocket & Hardware Engineering': 'Concealed YKK Zipper Kangaroo Pockets + Tech Hardware',
          'Fit & Silhouette Styling': 'Relaxed Boxy Drop-Shoulder Streetwear Silhouette',
          'Durability & Shrink Resistance': 'Pre-Shrunk Enzyme Washed (0% Additional Shrinkage)',
          'Manufacturer Guarantee': '30-Day Hassle-Free Quality Guarantee',
          'Value-to-Price Rating': '9.8 / 10'
        },
        pros: [
          'Substantial 450 GSM heavyweight cotton warmth for only $79.99',
          'Concealed zipper pockets keep smartphones and keys safe from falling out',
          'Double-lined structured hood holds its shape without collapsing'
        ],
        cons: [
          'Heavy fabric requires line-drying or low-heat tumble dry'
        ]
      },
      {
        id: 'supreme-box-logo',
        brand: 'Supreme',
        model: 'Box Logo Hooded Sweatshirt',
        name: 'Supreme Box Logo Fleece',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 168.00,
        rating: 4.6,
        image_url: '/assets/hoodie.svg',
        stock: 4,
        specs: {
          'Brand & Manufacturer': 'Supreme New York',
          'Model Name': 'Cross-Grain Box Logo Fleece',
          'MSRP / Retail Price': '$168.00 (Resale $350+)',
          'Fabric Density (GSM)': '400 GSM Heavyweight Crossgrain Fleece',
          'Material Composition': '84% Cotton / 16% Polyester Blend',
          'Pocket & Hardware Engineering': 'Traditional Open Kangaroo Pouch (No Zippers)',
          'Fit & Silhouette Styling': 'Standard Boxy Skater Fit with Ribbed Side Gussets',
          'Durability & Shrink Resistance': 'Crossgrain weave resists vertical shrinkage',
          'Manufacturer Guarantee': 'Final Sale / No Returns or Exchanges',
          'Value-to-Price Rating': '7.6 / 10'
        },
        pros: [
          'High streetwear brand cultural recognition and resale value',
          'Durable ribbed side gusset panels for flexible movement'
        ],
        cons: [
          'Over double the cost ($168 vs $79.99) with polyester synthetic blend',
          'Pockets lack zippers: phone easily slips out when seated'
        ]
      },
      {
        id: 'fog-essentials-hoodie',
        brand: 'Fear of God',
        model: 'Essentials Fleece Hoodie',
        name: 'Fear of God Essentials Fleece',
        is_store_product: false,
        badge: 'Market Competitor',
        price: 135.00,
        rating: 4.5,
        image_url: '/assets/hoodie.svg',
        stock: 6,
        specs: {
          'Brand & Manufacturer': 'Fear of God',
          'Model Name': 'Essentials Core Collection Fleece',
          'MSRP / Retail Price': '$135.00 Retail',
          'Fabric Density (GSM)': '380 GSM Mid-Heavy Fleece',
          'Material Composition': '80% Cotton / 20% Polyester',
          'Pocket & Hardware Engineering': 'Seam Kangaroo Pouch, Rubberized Logo Patch',
          'Fit & Silhouette Styling': 'Oversized Drape with Raglan Sleeves',
          'Durability & Shrink Resistance': 'Standard fleece: slight shrinkage if machine dried',
          'Manufacturer Guarantee': '14-Day Store Return Window',
          'Value-to-Price Rating': '7.9 / 10'
        },
        pros: [
          'Subtle earth-tone palette and minimalist tonal rubberized logos',
          'Comfortable relaxed loungewear drape'
        ],
        cons: [
          'Lower 380 GSM fabric weight despite $135 price tag',
          'Frequent streetwear counterfeits and inconsistent sizing'
        ]
      }
    ],
    ai_verdicts: {
      general: {
        winner_id: 'aerostore-cyberpunk-hoodie',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        summary: 'AeroStore Cyberpunk Heavyweight uses genuine 450 GSM 100% organic French Terry cotton with concealed zip pockets, beating 380-400 GSM designer competitors while costing half the price at $79.99.',
        persona_fit: 'Delivers the structured, luxury streetwear silhouette with practical everyday utility.',
        value_score: {
          'aerostore-cyberpunk-hoodie': 9.8,
          'fog-essentials-hoodie': 7.9,
          'supreme-box-logo': 7.6
        },
        recommendation: 'Experience real 450 GSM organic weight at an honest direct-to-consumer price.'
      },
      student_budget: {
        winner_id: 'aerostore-cyberpunk-hoodie',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        summary: 'Saves students over $88 compared to Supreme, leaving funds for books and tech while providing superior 100% organic cotton longevity.',
        persona_fit: 'Warm enough to wear across chilly college campuses without needing a bulky winter jacket.',
        value_score: {
          'aerostore-cyberpunk-hoodie': 9.9,
          'fog-essentials-hoodie': 7.8,
          'supreme-box-logo': 6.9
        },
        recommendation: 'Use code SAVE20 for an instant 20% discount down to $63.99.'
      },
      commuter: {
        winner_id: 'aerostore-cyberpunk-hoodie',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        summary: 'Concealed zipper closures on the kangaroo pocket ensure your phone, transit pass, and earbuds never slip out on crowded buses or subways.',
        persona_fit: 'Ideal for city transit and chilly morning commutes.',
        value_score: {
          'aerostore-cyberpunk-hoodie': 9.8,
          'fog-essentials-hoodie': 7.7,
          'supreme-box-logo': 7.2
        },
        recommendation: 'The zipper pockets make this the most commuter-friendly hoodie available.'
      },
      gamer: {
        winner_id: 'aerostore-cyberpunk-hoodie',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        summary: 'Cyberpunk neon accents and cozy drop-shoulder tailoring keep you warm during late-night gaming sessions in air-conditioned rooms.',
        persona_fit: 'Relaxed sleeve cuffs do not bind or pull against mouse pads.',
        value_score: {
          'aerostore-cyberpunk-hoodie': 9.6,
          'fog-essentials-hoodie': 8.0,
          'supreme-box-logo': 7.5
        },
        recommendation: 'Comfortable gaming streetwear designed for long sessions.'
      },
      audiophile: {
        winner_id: 'aerostore-cyberpunk-hoodie',
        winner_brand: 'AeroStore',
        winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        summary: 'Spacious double-lined hood easily accommodates over-ear headphones like the AeroStore HyperSound without pinching your earcups.',
        persona_fit: 'Listen to your playlist in full comfort on breezy outdoor walks.',
        value_score: {
          'aerostore-cyberpunk-hoodie': 9.5,
          'fog-essentials-hoodie': 8.0,
          'supreme-box-logo': 7.6
        },
        recommendation: 'Pairs perfectly with over-ear ANC headphones.'
      }
    }
  }
};

/**
 * Same Product Brand Lineup Comparisons
 * Enables side-by-side comparison of different tiers, editions, and models
 * from the EXACT SAME product brand (e.g. AeroStore, Sony, Logitech, Samsung, Apple).
 */
export const SAME_BRAND_LINEUPS = {
  'PROD-101': {
    brand: 'AeroStore Acoustics',
    category: 'Audio',
    item_type: 'Wireless ANC Headphones',
    tagline: 'AeroStore Sound Engineering: Flagship vs. Studio vs. Sport Editions',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Acoustic Drivers',
      'Noise Cancellation (ANC)',
      'Battery Playback',
      'Weight & Fit',
      'Water & Sweat Resistance',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-hypersound-pro',
        brand: 'AeroStore',
        model: 'HyperSound ANC Pro (Flagship)',
        name: 'AeroStore HyperSound ANC Pro',
        is_store_product: true,
        store_product_id: 'PROD-101',
        badge: 'Store Flagship 🌟',
        price: 199.99,
        rating: 4.9,
        image_url: '/assets/headphones.svg',
        specs: {
          'Model & Edition': 'HyperSound Pro (Current Flagship)',
          'Price': '₹199.99',
          'Acoustic Drivers': '40mm Titanium Composite Dual-Chamber',
          'Noise Cancellation (ANC)': 'Hybrid Active 42dB Multi-Mic',
          'Battery Playback': '40 Hours (Fast charge: 10m = 5h)',
          'Weight & Fit': '245g Memory Foam Over-Ear',
          'Water & Sweat Resistance': 'IPX4 Splashproof',
          'Best For': 'Daily Commute, Office Focus & Audiophile Listening'
        },
        pros: [
          'Best balance of price, studio sound, and 42dB active noise cancellation',
          'Fast USB-C charging gives 5 hours playback in 10 minutes',
          'Premium titanium composite drivers with high-res LDAC support'
        ],
        cons: [
          'Slightly heavier than the Sport edition'
        ]
      },
      {
        id: 'aerostore-hypersound-studio',
        brand: 'AeroStore',
        model: 'HyperSound Studio Edition',
        name: 'AeroStore HyperSound Studio Master',
        is_store_product: false,
        badge: 'Studio Reference Tier 🎵',
        price: 279.99,
        rating: 4.9,
        image_url: '/assets/headphones.svg',
        specs: {
          'Model & Edition': 'HyperSound Studio Master Reference',
          'Price': '₹279.99',
          'Acoustic Drivers': '50mm Beryllium Planar-Magnetic Drivers',
          'Noise Cancellation (ANC)': 'Passive Studio Acoustic Chamber (Zero DSP coloration)',
          'Battery Playback': '55 Hours Wired / Wireless Dual-DAC',
          'Weight & Fit': '280g Velour & Protein Leather Cushions',
          'Water & Sweat Resistance': 'Indoor Studio Use',
          'Best For': 'Music Production, Mastering & Pure Audiophiles'
        },
        pros: [
          'Ultra-wide 5Hz - 50kHz frequency response with zero distortion',
          'Massive 55-hour battery life with balanced dual DAC audio',
          'Replaceable velour magnetic earpads'
        ],
        cons: [
          'No active DSP noise cancellation (tuned for studio isolation)',
          'Higher price point ($279.99)'
        ]
      },
      {
        id: 'aerostore-hypersound-sport',
        brand: 'AeroStore',
        model: 'HyperSound Sport Lite',
        name: 'AeroStore HyperSound Sport Active',
        is_store_product: false,
        badge: 'Fitness & Workout Tier 🏃',
        price: 139.99,
        rating: 4.7,
        image_url: '/assets/headphones.svg',
        specs: {
          'Model & Edition': 'HyperSound Sport Active Grip',
          'Price': '₹139.99',
          'Acoustic Drivers': '36mm Graphene Dynamic Drivers',
          'Noise Cancellation (ANC)': 'Feedforward ANC 32dB + Wind Guard',
          'Battery Playback': '32 Hours Playback',
          'Weight & Fit': '195g Ultra-Secure Tension Band',
          'Water & Sweat Resistance': 'IPX7 Fully Waterproof & Sweatproof',
          'Best For': 'Gym Workouts, Running & Outdoor Fitness'
        },
        pros: [
          'IPX7 submersible waterproof rating for heavy gym workouts',
          'Ultra-light 195g chassis that never slips during sprints',
          'Accessible $139.99 price point'
        ],
        cons: [
          'Smaller 36mm drivers with slightly less sub-bass depth than Pro',
          'Smaller battery (32 hours vs 40 hours)'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-hypersound-pro',
      winner_name: 'AeroStore HyperSound ANC Pro (Flagship)',
      summary: 'Within the AeroStore headphone brand family, the HyperSound Pro Flagship remains the sweet spot for 90% of listeners—delivering top-tier 42dB Hybrid ANC and 40-hour playback at an optimal $199.99 price.',
      recommendation: 'Choose HyperSound Pro for everyday listening and travel; pick Studio Master for music mastering; choose Sport Lite for rigorous gym sessions.'
    }
  },

  'PROD-102': {
    brand: 'AeroStore Hardware Labs',
    category: 'Keyboards',
    item_type: 'Mechanical Gaming Keyboard',
    tagline: 'AeroStore ErgoFlow Family: Pro vs. Wireless Carbon vs. Compact 65%',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Form Factor & Layout',
      'Switch Architecture',
      'Connectivity',
      'Chassis Material',
      'Keycaps',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-ergoflow-pro',
        brand: 'AeroStore',
        model: 'ErgoFlow RGB Pro 75% (Flagship)',
        name: 'AeroStore ErgoFlow RGB Pro',
        is_store_product: true,
        store_product_id: 'PROD-102',
        badge: 'Store Flagship 🌟',
        price: 129.50,
        rating: 4.9,
        image_url: '/assets/keyboard.svg',
        specs: {
          'Model & Edition': 'ErgoFlow RGB Pro (Current Flagship)',
          'Price': '₹129.50',
          'Form Factor & Layout': '75% Compact (82 Keys with F-Row & Arrows)',
          'Switch Architecture': 'Hot-Swappable Custom Red Linear (Factory Pre-lubed)',
          'Connectivity': 'Detachable USB-C (1000Hz Ultra-Fast Polling)',
          'Chassis Material': 'CNC Anodized Aluminum Top + Poron Acoustic Dampener',
          'Keycaps': 'Double-Shot PBT OEM Profile (Oil-Resistant)',
          'Best For': 'Coding, Office Typing & Esports Gaming'
        },
        pros: [
          'Ideal 75% layout retains arrow keys and dedicated function row',
          'Acoustic Poron foam creates creamy, quiet keystrokes',
          'Direct $129.50 value with hot-swappable 5-pin PCB'
        ],
        cons: [
          'Requires cable connection (no Bluetooth in base Pro model)'
        ]
      },
      {
        id: 'aerostore-ergoflow-wireless',
        brand: 'AeroStore',
        model: 'ErgoFlow Tri-Mode Wireless',
        name: 'AeroStore ErgoFlow Wireless Max',
        is_store_product: false,
        badge: 'Tri-Mode Wireless Tier 📶',
        price: 169.99,
        rating: 4.8,
        image_url: '/assets/keyboard.svg',
        specs: {
          'Model & Edition': 'ErgoFlow Tri-Mode Wireless Max',
          'Price': '₹169.99',
          'Form Factor & Layout': '75% Compact (82 Keys)',
          'Switch Architecture': 'Hot-Swappable Custom Silent Peach / Red Switches',
          'Connectivity': '2.4GHz Lightspeed + Bluetooth 5.2 + USB-C',
          'Chassis Material': 'Full CNC Machined Aluminum (1.2kg)',
          'Keycaps': 'PBT Dye-Sub Cherry Profile',
          'Best For': 'Clean Wireless Desktops & Multi-Device Workers'
        },
        pros: [
          'Multi-device pairing across 3 PCs, Macs, and tablets seamlessly',
          '4000mAh long-lasting battery with up to 200 hours RGB-off runtime',
          'Silent switch option perfect for quiet open offices'
        ],
        cons: [
          'Priced $40 higher than the wired flagship ($169.99)',
          'Heavier chassis (1.2kg)'
        ]
      },
      {
        id: 'aerostore-ergoflow-65',
        brand: 'AeroStore',
        model: 'ErgoFlow 65% Minimalist',
        name: 'AeroStore ErgoFlow Mini 65%',
        is_store_product: false,
        badge: 'Ultra-Compact Esports Tier ⚡',
        price: 99.00,
        rating: 4.7,
        image_url: '/assets/keyboard.svg',
        specs: {
          'Model & Edition': 'ErgoFlow Mini 65% Esports Edition',
          'Price': '₹99.00',
          'Form Factor & Layout': '65% Ultra-Compact (68 Keys)',
          'Switch Architecture': 'Hot-Swappable Speed Silver Ultra-Fast Actuation',
          'Connectivity': 'Detachable Braided USB-C (8000Hz Hyper-Polling)',
          'Chassis Material': 'Polycarbonate Semi-Translucent Chassis',
          'Keycaps': 'Double-Shot PBT Pudding Keycaps',
          'Best For': 'Competitive FPS Gaming & Portable Travel'
        },
        pros: [
          'Extreme desk space optimization for aggressive low-DPI mouse flicks',
          'Lightning-fast 1.0mm pre-travel Speed Silver switches',
          'Very affordable under $100 price'
        ],
        cons: [
          'No dedicated function row (requires Fn key layer combos)'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-ergoflow-pro',
      winner_name: 'AeroStore ErgoFlow RGB Pro 75%',
      summary: 'In the AeroStore ErgoFlow lineup, the 75% RGB Pro offers the most balanced ergonomics for combined productivity, programming, and gaming without losing function keys.',
      recommendation: 'Select ErgoFlow Pro for universal desk setup; choose Tri-Mode Wireless for wire-free productivity; choose Mini 65% for competitive esports travel.'
    }
  },

  'PROD-103': {
    brand: 'AeroStore Displays',
    category: 'Monitors',
    item_type: 'Curved OLED Gaming Monitor',
    tagline: 'AeroStore UltraVision Family: 34" Ultrawide vs. 27" 240Hz vs. 42" 4K',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Screen Size & Aspect',
      'Refresh Rate & Response',
      'Resolution & Panel',
      'HDR Standard',
      'Ports & USB-C Power',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-ultravision-34',
        brand: 'AeroStore',
        model: 'UltraVision 34" Ultrawide OLED (Flagship)',
        name: 'AeroStore UltraVision 34" Curved OLED',
        is_store_product: true,
        store_product_id: 'PROD-103',
        badge: 'Store Flagship 🌟',
        price: 599.00,
        rating: 4.9,
        image_url: '/assets/monitor.svg',
        specs: {
          'Model & Edition': 'UltraVision OLED 34W (Current Flagship)',
          'Price': '₹599.00',
          'Screen Size & Aspect': '34" 21:9 WQHD (3440 x 1440) 1800R Curve',
          'Refresh Rate & Response': '175Hz / 0.03ms GtG Pixel Response',
          'Resolution & Panel': 'Quantum OLED (99% DCI-P3 10-Bit)',
          'HDR Standard': 'VESA DisplayHDR True Black 400',
          'Ports & USB-C Power': 'DP 1.4, Dual HDMI 2.1, USB-C 90W PD',
          'Best For': 'Cinematic Immersion, Video Editing & Ultrawide Gaming'
        },
        pros: [
          'Massive 21:9 cinematic aspect ratio replaces dual monitors',
          'USB-C 90W single-cable power charges laptops while streaming display',
          '3-Year direct OLED burn-in warranty included'
        ],
        cons: [
          'Requires a wide desk setup (minimum 48 inches width)'
        ]
      },
      {
        id: 'aerostore-ultravision-27',
        brand: 'AeroStore',
        model: 'UltraVision 27" Esports 240Hz OLED',
        name: 'AeroStore UltraVision 27" 240Hz Flat',
        is_store_product: false,
        badge: 'Esports 240Hz Tier 🏆',
        price: 549.00,
        rating: 4.8,
        image_url: '/assets/monitor.svg',
        specs: {
          'Model & Edition': 'UltraVision 27Q Esports 240Hz',
          'Price': '₹549.00',
          'Screen Size & Aspect': '27" 16:9 QHD (2560 x 1440) Flat Panel',
          'Refresh Rate & Response': '240Hz / 0.03ms GtG Instant Pixel',
          'Resolution & Panel': 'OLED 99.5% sRGB / 98.5% DCI-P3',
          'HDR Standard': 'VESA DisplayHDR True Black 400',
          'Ports & USB-C Power': 'DP 1.4 x2, HDMI 2.1 x2, USB-C 65W',
          'Best For': 'Esports FPS (CS2, Apex, Valorant) & Tournament Gaming'
        },
        pros: [
          'Blistering 240Hz esports refresh rate provides zero motion blur',
          'Standard 16:9 27-inch format trusted by professional tournament circuits',
          'Slightly lower price at $549'
        ],
        cons: [
          'Less horizontal screen real estate than 34-inch ultrawide for multitasking'
        ]
      },
      {
        id: 'aerostore-ultravision-42',
        brand: 'AeroStore',
        model: 'UltraVision 42" 4K OLED Master',
        name: 'AeroStore UltraVision 42" 4K Master',
        is_store_product: false,
        badge: 'Console & Workstation Tier 👑',
        price: 799.00,
        rating: 4.9,
        image_url: '/assets/monitor.svg',
        specs: {
          'Model & Edition': 'UltraVision 42K Master Station',
          'Price': '₹799.00',
          'Screen Size & Aspect': '42" 16:9 4K UHD (3840 x 2160) Flat',
          'Refresh Rate & Response': '144Hz / 0.1ms GtG',
          'Resolution & Panel': 'LG Display OLED 4K (DCI-P3 99%)',
          'HDR Standard': 'Dolby Vision + HDR10+ True Black 600',
          'Ports & USB-C Power': 'Quad HDMI 2.1 (48Gbps), DP 1.4, USB-C 90W',
          'Best For': 'PS5 / Xbox Series X 4K120Hz & 4K Creative Timeline Editing'
        },
        pros: [
          'Stunning full 4K 3840x2160 resolution with Dolby Vision gaming',
          'Four full-bandwidth HDMI 2.1 ports for multiple 4K consoles',
          'Huge workspace equivalent to four 1080p monitors'
        ],
        cons: [
          'Higher price ($799.00) and requires deep desk or wall mount'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-ultravision-34',
      winner_name: 'AeroStore UltraVision 34" Ultrawide OLED',
      summary: 'The 34" Ultrawide hits the ultimate harmony of cinematic gaming, productivity timeline space, and price-to-performance ($599 vs $799).',
      recommendation: 'Get the 34" Curved Ultrawide for all-around workstation and gaming bliss; choose 27" 240Hz for hardcore competitive FPS; choose 42" 4K for console setups.'
    }
  },

  'PROD-104': {
    brand: 'AeroStore Wearables',
    category: 'Wearables',
    item_type: 'Smart Health & GPS Watch',
    tagline: 'AeroStore Smartwatch Family: Series X Titanium vs. Pro Ultra vs. Slim Active',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Case Material',
      'Glass & Display',
      'Battery Life',
      'Sensors & Health',
      'Waterproof Rating',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-smartwatch-x',
        brand: 'AeroStore',
        model: 'Series X Titanium (Flagship)',
        name: 'AeroStore Titanium Smartwatch Series X',
        is_store_product: true,
        store_product_id: 'PROD-104',
        badge: 'Store Flagship 🌟',
        price: 249.99,
        rating: 4.8,
        image_url: '/assets/smartwatch.svg',
        specs: {
          'Model & Edition': 'Titanium Series X (Current Flagship)',
          'Price': '₹249.99',
          'Case Material': 'Aerospace Grade 5 Brushed Titanium',
          'Glass & Display': '1.43" Sapphire Crystal AMOLED (1,000 nits)',
          'Battery Life': '7 Days Typical (14 Days Battery Saver)',
          'Sensors & Health': 'Optical PPG Heart Rate, SpO2, ECG, Dual-Band GPS',
          'Waterproof Rating': '50m (5 ATM) Swimproof',
          'Best For': 'Executive Style, Daily Health Tracking & Multisport Fitness'
        },
        pros: [
          'Grade 5 titanium chassis and scratch-proof sapphire crystal at only $249.99',
          'Full 7-day battery life frees you from nightly charging docks',
          'Accurate dual-band multi-satellite GPS navigation'
        ],
        cons: [
          'Not suited for deep scuba diving (use Ultra Edition for scuba)'
        ]
      },
      {
        id: 'aerostore-smartwatch-ultra',
        brand: 'AeroStore',
        model: 'Series X Adventure Ultra',
        name: 'AeroStore Titanium Ultra Explorer',
        is_store_product: false,
        badge: 'Extreme Adventure Tier 🏔️',
        price: 349.99,
        rating: 4.9,
        image_url: '/assets/smartwatch.svg',
        specs: {
          'Model & Edition': 'Series X Adventure Ultra Explorer',
          'Price': '₹349.99',
          'Case Material': 'Titanium with Raised Bezel Armor',
          'Glass & Display': '1.5" Sapphire Crystal AMOLED (2,000 nits Peak)',
          'Battery Life': '14 Days Regular (30 Days Expedition Mode)',
          'Sensors & Health': 'Dual-Frequency GPS, Depth Gauge, Oceanic Dive Sensor',
          'Waterproof Rating': '100m (10 ATM) + EN13319 Scuba Certified',
          'Best For': 'Backcountry Hiking, Mountaineering & Ocean Diving'
        },
        pros: [
          'Submersible to 100m with dive computer telemetry and emergency siren',
          'Blinding 2,000 nits screen readable under direct Sahara sunlight',
          'Massive 14-day battery runtime'
        ],
        cons: [
          'Bulky 49mm case may feel too large on smaller wrists',
          'Priced $100 higher at $349.99'
        ]
      },
      {
        id: 'aerostore-smartwatch-slim',
        brand: 'AeroStore',
        model: 'Series X Slim Active',
        name: 'AeroStore Watch X Slim Active',
        is_store_product: false,
        badge: 'Minimalist & Sleep Tier 🌙',
        price: 179.99,
        rating: 4.7,
        image_url: '/assets/smartwatch.svg',
        specs: {
          'Model & Edition': 'Series X Slim Active Featherlight',
          'Price': '₹179.99',
          'Case Material': 'Anodized Aircraft Aluminum (9.8mm thin)',
          'Glass & Display': '1.36" Curved Gorilla Glass AMOLED',
          'Battery Life': '5 Days Typical Usage',
          'Sensors & Health': 'HRV Recovery, Sleep Stages, Step & Calorie Counter',
          'Waterproof Rating': '50m (5 ATM) Swimproof',
          'Best For': 'Sleep Tracking, Yoga, Pilates & Discreet Daily Wear'
        },
        pros: [
          'Ultra-thin 9.8mm profile comfortable to wear overnight while sleeping',
          'Featherweight 32g design feels nearly invisible on the arm',
          'Budget-friendly $179.99 entry point'
        ],
        cons: [
          'Uses Gorilla Glass rather than scratch-proof sapphire crystal',
          '5-day battery is shorter than Titanium model (7 days)'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-smartwatch-x',
      winner_name: 'AeroStore Titanium Smartwatch Series X',
      summary: 'The Titanium Series X Flagship provides the ideal balance of Grade 5 luxury titanium build, scratch-proof sapphire glass, and 7-day battery at an honest $249.99.',
      recommendation: 'Choose Series X Titanium for everyday professional and workout use; pick Adventure Ultra for mountaineering and scuba; pick Slim Active for light sleep tracking.'
    }
  },

  'PROD-106': {
    brand: 'AeroStore Precision Gaming',
    category: 'Accessories',
    item_type: 'Esports Gaming Mouse',
    tagline: 'AeroStore AeroGrip Family: Wireless Pro vs. Carbon Ultralight vs. Ergonomic MMO',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Weight',
      'Optical Sensor',
      'Polling Rate',
      'Switches',
      'Battery Life',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-aerogrip-pro',
        brand: 'AeroStore',
        model: 'AeroGrip Wireless (Flagship)',
        name: 'AeroStore AeroGrip Precision Wireless Mouse',
        is_store_product: true,
        store_product_id: 'PROD-106',
        badge: 'Store Flagship 🌟',
        price: 49.99,
        rating: 4.8,
        image_url: '/assets/mouse.svg',
        specs: {
          'Model & Edition': 'AeroGrip Wireless (Current Flagship)',
          'Price': '₹49.99',
          'Weight': '58g Ultralight Symmetrical Shell',
          'Optical Sensor': 'PAW3395 Precision 26,000 DPI (650 IPS)',
          'Polling Rate': '1000Hz (1ms wireless response)',
          'Switches': 'Optical Micro Switches (90M click lifespan)',
          'Battery Life': '80 Hours Continuous Gameplay',
          'Best For': 'Esports FPS, MOBA & Daily Office Precision'
        },
        pros: [
          'Disruptive $49.99 price beats $150 mice with identical PAW3395 sensor',
          'Solid 58g shell without holes keeps out dust and sweat',
          'Zero-debounce optical switches eliminate double-clicking permanently'
        ],
        cons: [
          'No Bluetooth mode (uses 2.4GHz wireless dongle & USB-C wired)'
        ]
      },
      {
        id: 'aerostore-aerogrip-carbon',
        brand: 'AeroStore',
        model: 'AeroGrip Carbon 4K Edition',
        name: 'AeroStore AeroGrip Carbon 4K',
        is_store_product: false,
        badge: 'Hyper-Polling 4K Tier ⚡',
        price: 79.99,
        rating: 4.9,
        image_url: '/assets/mouse.svg',
        specs: {
          'Model & Edition': 'AeroGrip Carbon Fiber 4K Hz',
          'Price': '₹79.99',
          'Weight': '42g Real Carbon Fiber Composite',
          'Optical Sensor': 'PAW3950 Ultra 30,000 DPI (750 IPS)',
          'Polling Rate': '4000Hz (0.25ms hyper-polling dongle included)',
          'Switches': 'TTC Gold Dustproof Optical Switches (100M Clicks)',
          'Battery Life': '55 Hours at 4000Hz',
          'Best For': 'High-Refresh 240Hz/360Hz Competitive FPS Gaming'
        },
        pros: [
          'Record-breaking 42g weight crafted from real woven carbon fiber',
          'Included 4K wireless receiver matches 240Hz+ monitors with 0.25ms latency',
          'Unrivaled flick agility for Valorant and CS2'
        ],
        cons: [
          'Higher $79.99 price and 4000Hz polling uses battery slightly faster'
        ]
      },
      {
        id: 'aerostore-aerogrip-ergo',
        brand: 'AeroStore',
        model: 'AeroGrip Ergo Palm MMO',
        name: 'AeroStore AeroGrip Ergo MMO & Productivity',
        is_store_product: false,
        badge: 'Ergonomic Palm Tier 💼',
        price: 59.99,
        rating: 4.7,
        image_url: '/assets/mouse.svg',
        specs: {
          'Model & Edition': 'AeroGrip Ergo Palm Multi-Button',
          'Price': '₹59.99',
          'Weight': '74g Sculpted Palm Contour with Thumb Rest',
          'Optical Sensor': 'PAW3395 26,000 DPI Sensor',
          'Polling Rate': '1000Hz 2.4GHz + Bluetooth 5.3 Dual-Mode',
          'Switches': 'Silent Optical Micro Switches',
          'Battery Life': '120 Hours Bluetooth / 75 Hours 2.4GHz',
          'Best For': 'Long 8-Hour Workdays, Excel, MMOs & Wrist Comfort'
        },
        pros: [
          'Thumb cradle and ergonomic tilt prevent carpal tunnel strain',
          'Six programmable side macros and dual Bluetooth/2.4G wireless',
          'Silent clicking ideal for shared offices'
        ],
        cons: [
          'Heavier at 74g, making it less specialized for rapid twitch FPS'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-aerogrip-pro',
      winner_name: 'AeroStore AeroGrip Precision Wireless',
      summary: 'At $49.99, the AeroGrip Wireless remains our top recommendation for the vast majority of players, giving top-grade PAW3395 tracking and 58g ergonomics at 1/3 the cost of competitor mice.',
      recommendation: 'Pick AeroGrip Wireless for the highest price-to-performance; pick Carbon 4K for tournament-grade esports; pick Ergo MMO for ergonomic workplace comfort.'
    }
  },

  'PROD-105': {
    brand: 'AeroStore Apparel Labs',
    category: 'Apparel',
    item_type: 'Streetwear Heavyweight Hoodie',
    tagline: 'AeroStore Streetwear Family: Cyberpunk 450 GSM vs. Minimalist Raw vs. Thermal Zip',
    spec_keys: [
      'Model & Edition',
      'Price',
      'Fabric Density (GSM)',
      'Material Composition',
      'Pockets & Hardware',
      'Fit & Silhouette',
      'Seasonality',
      'Best For'
    ],
    models: [
      {
        id: 'aerostore-cyberpunk-hoodie',
        brand: 'AeroStore',
        model: 'Cyberpunk Edition (Flagship)',
        name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
        is_store_product: true,
        store_product_id: 'PROD-105',
        badge: 'Store Flagship 🌟',
        price: 65.00,
        rating: 4.9,
        image_url: '/assets/hoodie.svg',
        specs: {
          'Model & Edition': 'Cyberpunk FlashSale Heavyweight (Current Flagship)',
          'Price': '₹65.00',
          'Fabric Density (GSM)': '450 GSM Ultra-Dense French Terry',
          'Material Composition': '100% Organic Combed Cotton (Zero Synthetic Blend)',
          'Pockets & Hardware': 'Concealed YKK Zipper Kangaroo Pocket',
          'Fit & Silhouette': 'Structured Boxy Drop-Shoulder Streetwear Cut',
          'Seasonality': 'Fall, Winter & Chilly Spring Evenings',
          'Best For': 'Urban Streetwear, Techwear Layering & Everyday Comfort'
        },
        pros: [
          'Authentic 450 GSM organic French Terry creates a luxury heavy drape',
          'Concealed zipper pocket prevents phones from falling out on subways',
          'Direct-to-consumer flash price of $65 beats $150 designer alternatives'
        ],
        cons: [
          'Flash-sale stock sells out rapidly due to limited batch weaving'
        ]
      },
      {
        id: 'aerostore-hoodie-minimalist',
        brand: 'AeroStore',
        model: 'Essentials Clean Raw Cut',
        name: 'AeroStore Essentials Monochrome 400 GSM',
        is_store_product: false,
        badge: 'Clean Minimalist Tier 🤍',
        price: 55.00,
        rating: 4.8,
        image_url: '/assets/hoodie.svg',
        specs: {
          'Model & Edition': 'Essentials Clean Raw Hoodie',
          'Price': '₹55.00',
          'Fabric Density (GSM)': '400 GSM Looped French Terry',
          'Material Composition': '100% Cotton with Pre-Shrunk Enzyme Wash',
          'Pockets & Hardware': 'Minimalist Hidden Seam Pockets',
          'Fit & Silhouette': 'Relaxed Athletic Silhouette',
          'Seasonality': 'All-Season Layering',
          'Best For': 'Clean Aesthetics, Minimalist Wardrobes & Casual Lounging'
        },
        pros: [
          'Enzyme pre-wash ensures zero vertical shrinkage after wash & dry cycles',
          'Completely unbranded clean look matches any trousers or sneakers',
          'Accessible $55 price'
        ],
        cons: [
          'Slightly lighter 400 GSM fabric compared to the 450 GSM Cyberpunk flagship'
        ]
      },
      {
        id: 'aerostore-hoodie-thermal-zip',
        brand: 'AeroStore',
        model: 'Full-Zip Thermal Heavyweight',
        name: 'AeroStore Thermal Heavyweight Full-Zip',
        is_store_product: false,
        badge: 'Winter Thermal Tier ❄️',
        price: 78.00,
        rating: 4.8,
        image_url: '/assets/hoodie.svg',
        specs: {
          'Model & Edition': 'Full-Zip Thermal Waffle-Lined Heavyweight',
          'Price': '₹78.00',
          'Fabric Density (GSM)': '500 GSM Total (400 GSM Outer + 100 GSM Waffle Thermal)',
          'Material Composition': '100% Cotton Outer + Micro-Waffle Heat Retention Lining',
          'Pockets & Hardware': 'Dual-Way YKK Metal Zip + Split Kangaroo Pockets',
          'Fit & Silhouette': 'Substantial Outerwear Fit (Can be worn as a light jacket)',
          'Seasonality': 'Deep Winter & Cold Winds',
          'Best For': 'Cold Commutes, Outdoor Events & Heavy Layering'
        },
        pros: [
          'Substantial 500 GSM total heft serves as an outerwear jacket in 40-50°F',
          'Dual two-way YKK front zipper for flexible ventilation',
          'Waffle-knit thermal interior locks in body warmth'
        ],
        cons: [
          'Too warm to wear comfortably indoors during summer or heated rooms'
        ]
      }
    ],
    ai_verdict: {
      winner_id: 'aerostore-cyberpunk-hoodie',
      winner_name: 'AeroStore Cyberpunk Heavyweight 450 GSM',
      summary: 'Our 450 GSM Cyberpunk Flagship hoodie offers the best silhouette, luxury fabric weight, and smartphone-safe zip pockets for $65.',
      recommendation: 'Get the Cyberpunk Edition for structured everyday streetwear; choose Essentials Clean for unbranded minimalism; choose Thermal Full-Zip for harsh winter chills.'
    }
  }
};

