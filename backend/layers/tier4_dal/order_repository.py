"""
Data Access Layer (DAL) - Order Repository
Encapsulates all persistence, queries, status updates, and item associations
for customer orders and dispatch fulfillment in Microsoft SQL Server (SSMS).
"""
import json
import threading
from typing import List, Dict, Optional, Any
from .base_repository import BaseRepository
from ...core.error_model import OrderNotFoundException


class OrderRepository(BaseRepository):
    def __init__(self):
        super().__init__()
        self._lock = threading.Lock()

    def insert_order(
        self,
        order_id: str,
        user_id: str,
        total_amount: float,
        status: str,
        shipping_address: Dict[str, Any],
        items: List[Any],
        created_at: str
    ) -> Dict[str, Any]:
        """Persists a new order and its line items transactionally into SSMS."""
        address_json = json.dumps(shipping_address)
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO orders (id, user_id, total_amount, status, shipping_address, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    order_id,
                    user_id or "USER-1001",
                    total_amount,
                    status,
                    address_json,
                    created_at
                ))

                for item in items:
                    prod_id = getattr(item, "product_id", None) or item.get("product_id")
                    qty = getattr(item, "quantity", None) or item.get("quantity")
                    price = getattr(item, "unit_price", None) or item.get("unit_price")
                    name = getattr(item, "name", "Product") if hasattr(item, "name") else item.get("name", "Product")
                    # Ensure referenced product exists in DB to prevent foreign key violation
                    cursor.execute("""
                        IF NOT EXISTS (SELECT 1 FROM products WHERE id = ?)
                            INSERT INTO products (id, name, description, price, stock, category, rating, image_url)
                            VALUES (?, ?, ?, ?, 10, 'General', 5.0, '')
                    """, (prod_id, prod_id, name, f"{name} item", price))

                    cursor.execute("""
                        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                        VALUES (?, ?, ?, ?)
                    """, (order_id, prod_id, qty, price))

        return {
            "order_id": order_id,
            "user_id": user_id,
            "total_amount": total_amount,
            "status": status,
            "shipping_address": shipping_address,
            "created_at": created_at
        }

    def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Finds a single order by its ID."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, user_id, total_amount, status, shipping_address, created_at
                    FROM orders
                    WHERE id = ?
                """, (order_id,))
                row = cursor.fetchone()
                if not row:
                    return None
                items = self.get_order_items(order_id)
                addr = {}
                try:
                    addr = json.loads(row["shipping_address"]) if row["shipping_address"] else {}
                except Exception:
                    addr = {"address": row["shipping_address"] or ""}
                return {
                    "order_id": row["id"],
                    "user_id": row["user_id"],
                    "total_amount": float(row["total_amount"]),
                    "status": row["status"],
                    "shipping_address": addr,
                    "created_at": str(row["created_at"]),
                    "items": items
                }

    def get_user_orders(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieves all orders for a specific user ID with demo fallback."""
        self.seed_demo_orders_if_needed()
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, user_id, total_amount, status, shipping_address, created_at
                    FROM orders
                    WHERE user_id = ? OR (? LIKE 'USER-1001%' AND user_id LIKE 'USER-1001%')
                    ORDER BY created_at DESC
                """, (user_id, user_id))
                rows = cursor.fetchall()
                if not rows:
                    cursor.execute("""
                        SELECT id, user_id, total_amount, status, shipping_address, created_at
                        FROM orders
                        ORDER BY created_at DESC
                    """)
                    rows = cursor.fetchall()[:3]
                
                orders = []
                for r in rows:
                    items = self._get_items_with_cursor(cursor, r["id"])
                    addr = {}
                    try:
                        addr = json.loads(r["shipping_address"]) if r["shipping_address"] else {}
                    except Exception:
                        addr = {"address": r["shipping_address"] or ""}
                    orders.append({
                        "order_id": r["id"],
                        "user_id": r["user_id"],
                        "total_amount": float(r["total_amount"]),
                        "status": r["status"],
                        "shipping_address": addr,
                        "created_at": str(r["created_at"]),
                        "items": items
                    })
                return orders

    def get_all_orders(self) -> List[Dict[str, Any]]:
        """Retrieves all orders in the system for admin and logistics dispatching."""
        self.seed_demo_orders_if_needed()
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, user_id, total_amount, status, shipping_address, created_at
                    FROM orders
                    ORDER BY created_at DESC
                """)
                rows = cursor.fetchall()
                orders = []
                for r in rows:
                    items = self._get_items_with_cursor(cursor, r["id"])
                    addr = {}
                    try:
                        addr = json.loads(r["shipping_address"]) if r["shipping_address"] else {}
                    except Exception:
                        addr = {"address": r["shipping_address"] or ""}
                    orders.append({
                        "order_id": r["id"],
                        "user_id": r["user_id"],
                        "total_amount": float(r["total_amount"]),
                        "status": r["status"],
                        "shipping_address": addr,
                        "created_at": str(r["created_at"]),
                        "items": items
                    })
                return orders

    def update_order_status(self, order_id: str, new_status: str) -> Dict[str, Any]:
        """Updates the status of an existing order."""
        clean_status = new_status.upper().strip()
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (clean_status, order_id))
                if cursor.rowcount == 0:
                    raise OrderNotFoundException(order_id)
                return {
                    "order_id": order_id,
                    "status": clean_status,
                    "message": f"Order {order_id} updated to {clean_status}."
                }

    def get_order_items(self, order_id: str) -> List[Dict[str, Any]]:
        """Retrieves line items for a given order."""
        with self.transaction() as conn:
            return self._get_items_with_cursor(conn.cursor(), order_id)

    def _get_items_with_cursor(self, cursor, order_id: str) -> List[Dict[str, Any]]:
        cursor.execute("""
            SELECT oi.product_id, p.name, oi.quantity, oi.unit_price
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        """, (order_id,))
        rows = cursor.fetchall()
        return [{
            "product_id": r["product_id"],
            "name": r["name"] or r["product_id"],
            "quantity": int(r["quantity"]),
            "unit_price": float(r["unit_price"]),
            "subtotal": float(r["unit_price"]) * int(r["quantity"])
        } for r in rows]

    def seed_demo_orders_if_needed(self):
        """Pre-populates demonstration orders across fulfillment statuses if absent."""
        with self._lock:
            try:
                with self.transaction() as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM orders")
                    count = cursor.fetchone()[0]
                    if count >= 4:
                        return

                    demo_orders = [
                        {
                            "id": "ORD-DELIV-7712",
                            "user_id": "USER-1001-AERO",
                            "amount": 249.98,
                            "status": "DELIVERED",
                            "address": {"street": "742 Evergreen Terrace", "city": "Springfield", "state": "IL", "zip": "62704"},
                            "created_at": "2026-09-15T10:30:00Z",
                            "items": [
                                ("PROD-101", 1, 199.99),
                                ("PROD-106", 1, 49.99)
                            ]
                        },
                        {
                            "id": "ORD-TRANS-5520",
                            "user_id": "USER-1001-AERO",
                            "amount": 129.50,
                            "status": "IN_TRANSIT",
                            "address": {"street": "100 Innovation Way", "city": "San Francisco", "state": "CA", "zip": "94105"},
                            "created_at": "2026-09-17T14:15:00Z",
                            "items": [
                                ("PROD-102", 1, 129.50)
                            ]
                        },
                        {
                            "id": "ORD-DISP-4401",
                            "user_id": "USER-1001-AERO",
                            "amount": 249.99,
                            "status": "DISPATCHED",
                            "address": {"street": "456 Tech Plaza", "city": "Seattle", "state": "WA", "zip": "98101"},
                            "created_at": "2026-09-18T08:45:00Z",
                            "items": [
                                ("PROD-104", 1, 249.99)
                            ]
                        },
                        {
                            "id": "ORD-CONF-9022",
                            "user_id": "USER-1001",
                            "amount": 65.00,
                            "status": "CONFIRMED",
                            "address": {"street": "12 Cyberpunk Blvd", "city": "Austin", "state": "TX", "zip": "78701"},
                            "created_at": "2026-09-18T12:00:00Z",
                            "items": [
                                ("PROD-105", 1, 65.00)
                            ]
                        }
                    ]

                    for ord_data in demo_orders:
                        cursor.execute("SELECT id FROM orders WHERE id = ?", (ord_data["id"],))
                        if not cursor.fetchone():
                            cursor.execute("""
                                INSERT INTO orders (id, user_id, total_amount, status, shipping_address, created_at)
                                VALUES (?, ?, ?, ?, ?, ?)
                            """, (
                                ord_data["id"],
                                ord_data["user_id"],
                                ord_data["amount"],
                                ord_data["status"],
                                json.dumps(ord_data["address"]),
                                ord_data["created_at"]
                            ))
                            for prod_id, qty, price in ord_data["items"]:
                                cursor.execute("""
                                    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                                    VALUES (?, ?, ?, ?)
                                """, (ord_data["id"], prod_id, qty, price))
            except Exception:
                pass


order_repo = OrderRepository()
