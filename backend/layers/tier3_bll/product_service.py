"""
Business Logic Tier (BLL) - Product Catalog Service
Coordinates domain rules, stock reservations, catalog searches, and AI comparison matrices.
Delegates persistence and query operations to Data Access Layer (ProductRepository).
"""
from typing import List, Optional, Dict, Any
import threading
from ...core.models import Product
from ...core.error_model import ProductNotFoundException, OutOfStockException
from ..tier4_dal.product_repository import product_repo, ProductRepository

PRODUCT_CATALOG_SPECS = {
    "PROD-101": {
        "specs": {
            "Battery Life": "40 Hours ANC On",
            "Connectivity": "Bluetooth 5.3 & 3.5mm AUX",
            "Noise Cancellation": "Hybrid ANC (42dB reduction)",
            "Weight": "245g",
            "Drivers": "40mm Titanium Composite",
            "Warranty": "2-Year Hardware Replacement"
        },
        "highlights": ["Studio-grade acoustics", "40h playback", "Memory foam earcups"]
    },
    "PROD-102": {
        "specs": {
            "Switch Type": "Hot-swappable Red Linear",
            "Connectivity": "USB-C Detachable (1000Hz Polling)",
            "Lighting": "Per-Key 16.8M RGB",
            "Weight": "820g Anodized Aluminum",
            "Keycaps": "Double-shot PBT OEM Profile",
            "Warranty": "2-Year Hardware Replacement"
        },
        "highlights": ["Zero input lag", "Hot-swap switches", "Custom acoustic foam dampening"]
    },
    "PROD-103": {
        "specs": {
            "Display Size": "34\" Ultrawide Curved (1800R)",
            "Panel & Color": "Quantum 4K OLED 99% DCI-P3",
            "Refresh Rate": "175Hz (0.03ms GtG)",
            "Ports": "DP 1.4, HDMI 2.1, USB-C 90W PD",
            "HDR Rating": "VESA DisplayHDR True Black 400",
            "Warranty": "3-Year Burn-in Protection"
        },
        "highlights": ["Infinite contrast OLED", "175Hz esports speed", "USB-C single cable dock"]
    },
    "PROD-104": {
        "specs": {
            "Battery Life": "7 Days Typical (14d Saver)",
            "Chassis": "Aerospace Grade 5 Titanium",
            "Sensors": "Optical Heart Rate, SpO2, ECG, GPS",
            "Water Resistance": "50m (5 ATM) Swimproof",
            "Display": "1.4\" Sapphire Crystal AMOLED",
            "Warranty": "2-Year Hardware Replacement"
        },
        "highlights": ["Titanium & Sapphire build", "Dual-band GPS", "Comprehensive health telemetry"]
    },
    "PROD-105": {
        "specs": {
            "Material": "450 GSM Heavyweight French Terry",
            "Fit": "Relaxed Streetwear Silhouette",
            "Pockets": "Concealed Zip Kangaroo Pocket",
            "Colorway": "Cyberpunk Neon & Matte Black",
            "Origin": "Ethically Sourced Organic Cotton",
            "Warranty": "30-Day Quality Guarantee"
        },
        "highlights": ["Limited flash run", "Ultra-dense cotton weave", "Streetwear aesthetic"]
    },
    "PROD-106": {
        "specs": {
            "Sensor": "26,000 DPI PixArt Optical",
            "Weight": "58g Ultralight Honeycomb Free",
            "Battery Life": "80 Hours Continuous Gaming",
            "Connectivity": "2.4GHz Wireless, Bluetooth & Paracord",
            "Switches": "Optical Gen-3 (100M Clicks)",
            "Warranty": "2-Year Hardware Replacement"
        },
        "highlights": ["58g featherweight", "26k DPI PixArt", "Zero double-click optical switches"]
    },
    "PROD-107": {
        "specs": {
            "Material": "Solid Anodized Aluminum",
            "Tilt Range": "16-degree Acoustic Isolation",
            "Compatibility": "Up to 5\" Studio Monitors",
            "Base": "High-density Anti-vibration Silicone",
            "Color": "Matte Charcoal Black",
            "Warranty": "5-Year Structural Guarantee"
        },
        "highlights": ["Eliminates desk resonance", "Precision ear-level angling", "Solid CNC construction"]
    },
    "PROD-108": {
        "specs": {
            "Plate": "Full-length Carbon Fiber",
            "Drop": "8mm Heel-to-Toe",
            "Weight": "198g (Men's Size 9)",
            "Upper": "Engineered Recycled Monomesh",
            "Cushioning": "Supercritical Nitrogen-infused Foam",
            "Warranty": "500-Mile Performance Guarantee"
        },
        "highlights": ["Carbon-fiber propulsion", "Ultralight breathable mesh", "Energy return foam"]
    },
    "PROD-109": {
        "specs": {
            "Capacity": "800ml (4-6 Cups)",
            "Material": "Handcrafted Matte Ceramic & Borosilicate",
            "Filter": "Laser-etched Micro-mesh 304 Stainless",
            "Heat Retention": "Dual-wall Insulation",
            "Dishwasher Safe": "Yes (Top Rack)",
            "Warranty": "Lifetime Craftsmanship Warranty"
        },
        "highlights": ["No paper filter waste", "Optimal extraction temperature", "Drip-free spout"]
    },
    "PROD-110": {
        "specs": {
            "Capacity": "750ml (25 oz)",
            "Insulation": "TempShield Triple Vacuum Wall",
            "Material": "18/8 Pro-grade Stainless Steel",
            "Lid": "Leakproof Magnetic Chug Cap",
            "Cold/Hot Duration": "24 Hours Cold / 12 Hours Hot",
            "Warranty": "Lifetime Warranty"
        },
        "highlights": ["BPA-free & toxin-free", "Condensation-free exterior", "Fits standard car cup holders"]
    },
    "PROD-111": {
        "specs": {
            "Waterproofing": "20,000mm Hydrostatic Head Rating",
            "Breathability": "15,000g/m²/24h",
            "Zippers": "YKK AquaGuard Weatherproof",
            "Hood": "3-way Adjustable Storm Hood",
            "Pockets": "7 Functional Storage Pockets with RFID Shielding",
            "Warranty": "3-Year Weatherproof Guarantee"
        },
        "highlights": ["Windproof storm barrier", "Magnetic snap closures", "Reflective safety accents"]
    },
    "PROD-112": {
        "specs": {
            "Tank Capacity": "400ml",
            "Coverage Area": "Up to 450 sq ft",
            "Sound Level": "< 20dB Ultra-quiet",
            "Timer Modes": "1H / 3H / 6H / Continuous",
            "LED Lighting": "7 Ambient Color Glow Cycle",
            "Warranty": "2-Year Replacement Warranty"
        },
        "highlights": ["Auto shut-off when dry", "BPA-free materials", "Soothing therapeutic mist"]
    },
    "PROD-113": {
        "specs": {
            "Origin": "Huila, Colombia (1,750m elevation)",
            "Roast Level": "Dark French Roast",
            "Certifications": "USDA Organic, Fair Trade Certified",
            "Weight": "1.0 kg (2.2 lbs)",
            "Notes": "Bittersweet dark chocolate, toasted pecan, brown sugar",
            "Freshness Guarantee": "Roasted within 14 days"
        },
        "highlights": ["100% Arabica", "Fair-trade sourced", "Resealable nitrogen-flushed valve bag"]
    },
    "PROD-114": {
        "specs": {
            "Extraction": "First Cold Pressed (< 24°C)",
            "Olive Variety": "Koroneiki (Crete, Greece)",
            "Acidity": "< 0.25% Ultra-low Acidity",
            "Polyphenols": "520 mg/kg High Antioxidant",
            "Volume": "750 ml (25.4 fl oz) UV-protected Dark Glass",
            "Shelf Life": "24 Months"
        },
        "highlights": ["Single-estate harvest", "Rich peppery finish", "Heart-healthy polyphenols"]
    },
    "PROD-115": {
        "specs": {
            "Ingredients": "Whole Almonds, Celtic Sea Salt",
            "Dietary": "Keto, Paleo, Vegan, Non-GMO, Gluten-Free",
            "Roast Method": "Slow Oven Roasted without added oils",
            "Net Weight": "500g (17.6 oz)",
            "Protein": "6g per 28g serving",
            "Packaging": "Recyclable foil-lined ziplock pouch"
        },
        "highlights": ["Zero added oils", "High plant protein", "Natural mineral sea salt"]
    },
    "PROD-116": {
        "specs": {
            "Grade": "Grade A Amber, Rich Taste",
            "Origin": "Green Mountains, Vermont, USA",
            "Ingredients": "100% Pure Vermont Maple Sap",
            "Sugars": "No added cane sugar or corn syrup",
            "Volume": "500 ml Glass Jug",
            "Certifications": "Certified Kosher, All-Natural"
        },
        "highlights": ["Wood-fired kettle boiling", "100% single-ingredient", "Glass keepsake jug"]
    },
    "PROD-117": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Beans": "Single-Origin Ethiopian Yirgacheffe",
            "Steep Method": "18-Hour Slow Cold Immersion",
            "Milk Option": "Barista-grade Oat Milk",
            "Temperature": "3°C Chilled Nitrogen Tap",
            "Volume": "350 ml (12 oz)"
        },
        "highlights": ["Nitrogen-infused cascade foam", "10-minute instant delivery", "Ultra-low acidity"]
    },
    "PROD-118": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Butter": "82% Normandy Cultured Butter",
            "Texture": "Laminated 24 Flaky Honeycomb Layers",
            "Bake Status": "Freshly Oven-Warmed upon dispatch",
            "Preservatives": "Zero Artificial Preservatives"
        },
        "highlights": ["Melt-in-your-mouth flakiness", "Pure French butter", "Thermal insulated packaging"]
    },
    "PROD-119": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Matcha Grade": "First-Harvest Uji Ceremonial Grade (Kyoto)",
            "Whisk Technique": "Traditional Bamboo Chasen Froth",
            "Sweetener": "Madagascar Bourbon Vanilla & Organic Agave",
            "Volume": "400 ml (14 oz)"
        },
        "highlights": ["Vibrant emerald antioxidant green", "Zero bitter astringency", "Energy-balancing L-Theanine"]
    },
    "PROD-120": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Chocolate": "70% Single-Origin Callebaut Belgian Dark Chocolate",
            "Espresso": "Fresh Ristretto Double Shot Infusion",
            "Salt Finish": "Maldon Flaky Sea Salt Crystals",
            "Portion": "140g Dense Fudge Square"
        },
        "highlights": ["Decadent fudgy center", "Espresso chocolate synergy", "Satisfies sweet cravings fast"]
    },
    "PROD-121": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Bread": "Fermented Country Sourdough Batard",
            "Avocado": "Freshly Smashed Haas Avocado & Lemon Zest",
            "Topping": "Organic Soft Poached Egg & Chili Hemp Seeds",
            "Serving": "Hot & Fresh in eco-friendly container"
        },
        "highlights": ["Cafe-grade brunch at home", "Runny yolk perfection", "High healthy monounsaturated fats"]
    },
    "PROD-122": {
        "specs": {
            "Delivery Time": "⚡ Under 10 Minutes Guaranteed",
            "Citrus": "Wild Japanese Kochi Yuzu Puree",
            "Base": "Micro-carbonated Mineral Artesian Water",
            "Botanicals": "Fresh Crushed Garden Spearmint",
            "Volume": "450 ml (15.2 oz)"
        },
        "highlights": ["Crisp citrus revitalization", "Low-calorie all natural", "Delivered ice-chilled"]
    }
}


class ProductService:
    """Domain service managing product business rules and stock integrity."""

    def __init__(self, repository: Optional[ProductRepository] = None):
        self._repo = repository or product_repo
        self._lock = threading.Lock()

    def get_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Product]:
        """Returns catalog products applying category and search filters."""
        return self._repo.get_all(category=category, search=search)

    def get_by_id(self, product_id: str) -> Product:
        """Finds product or raises ProductNotFoundException."""
        prod = self._repo.get_by_id(product_id)
        if not prod:
            raise ProductNotFoundException(product_id)
        return prod

    def add_product(self, product: Product) -> Product:
        """Validates and persists a new product into the catalog."""
        return self._repo.save(product)

    def deduct_stock(self, product_id: str, quantity: int) -> Product:
        """Validates availability and reserves inventory."""
        with self._lock:
            prod = self.get_by_id(product_id)
            if prod.stock < quantity:
                raise OutOfStockException(product_id, requested=quantity, available=prod.stock)
            return self._repo.update_stock(product_id, prod.stock - quantity)

    def restore_stock(self, product_id: str, quantity: int) -> Product:
        """Restores reserved inventory upon order cancellation or payment failure."""
        with self._lock:
            prod = self.get_by_id(product_id)
            return self._repo.update_stock(product_id, prod.stock + quantity)

    def set_stock(self, product_id: str, stock: int) -> Product:
        """Administrative override for inventory stock counts."""
        with self._lock:
            self.get_by_id(product_id)  # verifies existence
            return self._repo.update_stock(product_id, stock)

    def set_price(self, product_id: str, price: float) -> Product:
        """Administrative override for product price."""
        with self._lock:
            self.get_by_id(product_id)  # verifies existence
            return self._repo.update_price(product_id, price)

    def delete_product(self, product_id: str) -> bool:
        """Deletes a product from the catalog."""
        with self._lock:
            self.get_by_id(product_id)  # verifies existence
            return self._repo.delete(product_id)

    def compare_products(self, product_ids: List[str], persona: str = "general") -> Dict[str, Any]:
        """Generates multi-attribute comparison matrix with AI verdict."""
        items = []
        all_spec_keys = set()
        for pid in product_ids:
            try:
                prod = self.get_by_id(pid)
                meta = PRODUCT_CATALOG_SPECS.get(pid, {
                    "specs": {
                        "Price": f"${prod.price:.2f}",
                        "Category": prod.category,
                        "Rating": f"{prod.rating} / 5.0",
                        "Stock Status": f"{prod.stock} in stock" if prod.stock > 0 else "Out of Stock",
                        "Warranty": "2-Year Limited Hardware"
                    },
                    "highlights": [f"Official {prod.category} flagship", "Authentic warranty included"]
                })
                item_data = {
                    "id": prod.id,
                    "name": prod.name,
                    "price": prod.price,
                    "category": prod.category,
                    "rating": prod.rating,
                    "stock": prod.stock,
                    "image_url": prod.image_url,
                    "specs": meta["specs"],
                    "highlights": meta["highlights"]
                }
                items.append(item_data)
                all_spec_keys.update(meta["specs"].keys())
            except ProductNotFoundException:
                pass

        if not items:
            raise ProductNotFoundException(", ".join(product_ids))

        ordered_keys = sorted(list(all_spec_keys))
        from .ai_service import ai_service
        verdict = ai_service.generate_comparison_verdict(items, persona=persona)

        return {
            "persona": persona,
            "products": items,
            "spec_keys": ordered_keys,
            "verdict": verdict
        }


# Singleton service instance
product_service = ProductService()
