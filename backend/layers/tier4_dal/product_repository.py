"""
Data Access Layer (DAL) - Product Repository
Encapsulates all persistence, querying, and stock modifications for the catalog.
Coordinates between Microsoft SQL Server (SSMS) persistence and thread-safe memory state.
"""
import threading
from typing import List, Optional, Dict
from .base_repository import BaseRepository
from ...core.models import Product
from ...core.error_model import ProductNotFoundException

class ProductRepository(BaseRepository):
    def __init__(self):
        super().__init__()
        self._lock = threading.Lock()
        self._cache: Dict[str, Product] = {}
        self._seed_default_catalog()

    def _seed_default_catalog(self):
        """Initializes default products into repository cache."""
        seed_data = [
            Product(
                id="PROD-101",
                name="HyperSound ANC Wireless Headphones",
                description="Studio-grade active noise cancellation with 40-hour battery life and spatial audio.",
                price=199.99,
                stock=15,
                category="Electronics",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-102",
                name="ErgoFlow RGB Mechanical Keyboard",
                description="Hot-swappable linear mechanical switches with customizable per-key RGB backlighting.",
                price=129.50,
                stock=8,
                category="Accessories",
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-103",
                name="UltraVision 34-Inch Curved 4K OLED Monitor",
                description="👑 [VIP SUBSCRIBER EXCLUSIVE] Ultra-wide 175Hz curved display with 99% DCI-P3 color gamut, HDR1000, and 3-Year Zero Burn-In Guarantee.",
                price=599.00,
                stock=5,
                category="Electronics",
                rating=4.95,
                image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
                is_vip=True
            ),
            Product(
                id="PROD-104",
                name="Titanium Smartwatch Series X (VIP Edition)",
                description="👑 [VIP SUBSCRIBER EXCLUSIVE] Aerospace grade-5 titanium casing with sapphire glass, cellular LTE, ECG sensor, and concierge concierge support.",
                price=249.99,
                stock=20,
                category="Wearables",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                is_vip=True
            ),
            Product(
                id="PROD-105",
                name="FlashSale Cyberpunk Edition Carbon Commuter Hoodie",
                description="👑 [VIP SUBSCRIBER EXCLUSIVE] Limited collector release: 500GSM heavyweight Japanese combed cotton with magnetic storm collar and RFID-shielded pockets.",
                price=89.00,
                stock=12,
                category="Apparel",
                rating=4.92,
                image_url="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                is_vip=True
            ),
            Product(
                id="PROD-106",
                name="AeroGrip Precision Wireless Mouse",
                description="Ergonomic ultralight 58g chassis with 26,000 DPI optical sensor and PTFE feet.",
                price=49.99,
                stock=30,
                category="Accessories",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-107",
                name="StudioPro Acoustic Desktop Stands",
                description="Precision vibration-dampening desktop monitor stands with 16-degree tilt.",
                price=79.99,
                stock=14,
                category="Accessories",
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-108",
                name="AeroFit Pro Ergonomic Running Shoes",
                description="Breathable carbon-fiber plate running shoes with high-rebound responsive foam soles.",
                price=119.99,
                stock=22,
                category="Fitness",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-109",
                name="Nordic Minimalist Ceramic Coffee Maker",
                description="Artisanal pour-over ceramic carafe with reusable precision stainless steel mesh filter.",
                price=42.00,
                stock=18,
                category="Home & Living",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-110",
                name="EcoThermal Stainless Water Bottle",
                description="Double-wall vacuum insulated flask keeping beverages 24h ice-cold or 12h steaming-hot.",
                price=28.50,
                stock=40,
                category="Fitness",
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-111",
                name="All-Weather Tech Commuter Jacket",
                description="Waterproof, wind-resistant breathable shell jacket with magnetic storm closures.",
                price=145.00,
                stock=16,
                category="Apparel",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-112",
                name="AromaPure Ultrasonic Wood Grain Diffuser",
                description="Whisper-quiet ambient aromatherapy essential oil diffuser with soothing warm LED glow.",
                price=34.99,
                stock=25,
                category="Home & Living",
                rating=4.6,
                image_url="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-113",
                name="Organic Colombian Dark Roast Whole Bean Coffee (1kg)",
                description="Fair-trade single-origin Arabica beans roasted with hints of dark cocoa and toasted caramel.",
                price=18.99,
                stock=50,
                category="Grocery",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-114",
                name="Cold-Pressed Organic Mediterranean Extra Virgin Olive Oil (750ml)",
                description="First cold-pressed Koroneiki olives harvested for high polyphenol antioxidants and peppery finish.",
                price=22.50,
                stock=35,
                category="Grocery",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-115",
                name="Artisanal Roasted Almonds & Sea Salt Snack Pack (500g)",
                description="Keto-friendly, slow dry-roasted California whole almonds tossed with natural Celtic sea salt.",
                price=12.99,
                stock=60,
                category="Grocery",
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-116",
                name="Grade-A 100% Pure Vermont Amber Maple Syrup (500ml)",
                description="Traditional wood-fired pure maple sap harvest with rich butterscotch flavor notes.",
                price=16.50,
                stock=45,
                category="Grocery",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-117",
                name="Nitro Cold Brew Iced Latte (Freshly Poured 350ml)",
                description="⚡ 10-Minute Instant Delivery: Velvety smooth cold brew steeped 18 hours with creamy oat milk and nitrogen cascade foam.",
                price=5.49,
                stock=40,
                category="Cafe & Beverages",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-118",
                name="Artisanal French Butter Croissant (Warm & Flaky)",
                description="⚡ 10-Minute Instant Delivery: Freshly baked golden croissant with 82% Normandy cultured butter layers.",
                price=4.25,
                stock=30,
                category="Cafe & Beverages",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-119",
                name="Japanese Ceremonial Grade Matcha Latte (Iced/Hot 400ml)",
                description="⚡ 10-Minute Instant Delivery: First-harvest Uji ceremonial matcha whisked with Madagascar vanilla and almond milk.",
                price=6.20,
                stock=35,
                category="Cafe & Beverages",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-120",
                name="Signature Double Espresso Chocolate Fudge Brownie",
                description="⚡ 10-Minute Instant Delivery: Decadent Belgian dark chocolate fudge brownie with espresso infusion and sea salt crust.",
                price=4.95,
                stock=25,
                category="Cafe & Beverages",
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-121",
                name="Avocado Toast with Poached Egg & Microgreens",
                description="⚡ 10-Minute Instant Delivery: Sourdough toast loaded with crushed Hass avocado, poached organic egg, chili flakes and hemp seeds.",
                price=8.50,
                stock=20,
                category="Cafe & Beverages",
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
            ),
            Product(
                id="PROD-122",
                name="Sparkling Yuzu Citrus Infusion Cooler (450ml)",
                description="⚡ 10-Minute Instant Delivery: Effervescent Japanese yuzu juice with fresh crushed mint and wild blossom honey.",
                price=5.75,
                stock=30,
                category="Cafe & Beverages",
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
            )
        ]
        for p in seed_data:
            self._cache[p.id] = p
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        IF NOT EXISTS (SELECT 1 FROM products WHERE id = ?)
                            INSERT INTO products (id, name, description, price, stock, category, rating, image_url)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (p.id, p.id, p.name, p.description, p.price, p.stock, p.category, p.rating, p.image_url))
            except Exception:
                pass

    def get_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Product]:
        """Retrieves all products from data access layer with optional filtering."""
        with self._lock:
            items = list(self._cache.values())
            if category:
                cat_lower = category.lower().strip()
                if cat_lower in ("vip_exclusive", "vip", "vip exclusive"):
                    # VIP members and VIP lounge see the entire catalog with VIP exclusive pricing and gifts!
                    pass
                else:
                    items = [p for p in items if p.category.lower() == cat_lower]
            if search:
                q = search.lower()
                items = [p for p in items if q in p.name.lower() or q in p.description.lower()]
            return items

    def get_by_id(self, product_id: str) -> Optional[Product]:
        """Finds a product by its unique product identifier."""
        with self._lock:
            return self._cache.get(product_id)

    def save(self, product: Product) -> Product:
        """Inserts or updates a product in the repository and database."""
        with self._lock:
            self._cache[product.id] = product
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        IF EXISTS (SELECT 1 FROM products WHERE id = ?)
                            UPDATE products SET name=?, description=?, price=?, stock=?, category=?, rating=?, image_url=? WHERE id=?
                        ELSE
                            INSERT INTO products (id, name, description, price, stock, category, rating, image_url)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        product.id,
                        product.name, product.description, product.price, product.stock, product.category, product.rating, product.image_url, product.id,
                        product.id, product.name, product.description, product.price, product.stock, product.category, product.rating, product.image_url
                    ))
            except Exception:
                # Fall back gracefully to cache if database connection is offline
                pass
            return product

    def update_stock(self, product_id: str, new_stock: int) -> Product:
        """Updates product stock in repository and persistence store."""
        with self._lock:
            if product_id not in self._cache:
                raise ProductNotFoundException(product_id)
            self._cache[product_id].stock = new_stock
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
            except Exception:
                pass
            return self._cache[product_id]

    def update_price(self, product_id: str, new_price: float) -> Product:
        """Updates product price in repository and persistence store."""
        with self._lock:
            if product_id not in self._cache:
                raise ProductNotFoundException(product_id)
            self._cache[product_id].price = round(new_price, 2)
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("UPDATE products SET price = ? WHERE id = ?", (round(new_price, 2), product_id))
            except Exception:
                pass
            return self._cache[product_id]

    def delete(self, product_id: str) -> bool:
        """Removes a product from the repository cache and database."""
        with self._lock:
            if product_id not in self._cache:
                raise ProductNotFoundException(product_id)
            del self._cache[product_id]
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
            except Exception:
                pass
            return True


product_repo = ProductRepository()
