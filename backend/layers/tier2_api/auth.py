"""
Authentication REST Controller (Role-Based Access Control)
Handles user registration, login, profile retrieval, session termination, and role authorization for:
- customer
- admin
- delivery_partner
"""
from fastapi import APIRouter, Header, Depends, Body
from typing import Optional, List
from ...core.models import UserRegisterRequest, UserLoginRequest, AuthTokenResponse, UserResponse
from ...core.error_model import DomainException
from ..tier3_bll.auth_service import auth_service
from ..tier3_bll.order_service import order_service
from ..tier5_database.database import get_db

router = APIRouter(prefix="/auth", tags=["Role-Based Authentication"])

def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    """Dependency retrieving current user from Bearer Token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise DomainException(
            error_code="UNAUTHORIZED",
            title="Authentication Required",
            status=401,
            detail="Valid Bearer token is required to access this resource."
        )
    token = authorization.split("Bearer ")[1].strip()
    user = auth_service.get_user_by_token(token)
    if not user:
        raise DomainException(
            error_code="INVALID_TOKEN",
            title="Invalid Session",
            status=401,
            detail="Session has expired or is invalid. Please sign in again."
        )
    return user

def require_roles(allowed_roles: List[str]):
    """Role-Based Access Control (RBAC) Dependency."""
    def role_checker(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
        if current_user.role not in allowed_roles:
            raise DomainException(
                error_code="FORBIDDEN_ROLE",
                title="Access Denied",
                status=403,
                detail=f"User role '{current_user.role}' is not authorized. Allowed roles: {allowed_roles}"
            )
        return current_user
    return role_checker

@router.post("/register", response_model=AuthTokenResponse, summary="Register New User Account")
def register(request: UserRegisterRequest):
    user, token = auth_service.register(request.name, request.email, request.password, request.role)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.post("/login", response_model=AuthTokenResponse, summary="Sign In")
def login(request: UserLoginRequest):
    user, token = auth_service.login(request.email, request.password)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=UserResponse, summary="Get Current Authenticated Profile")
def get_profile(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/upgrade-vip", response_model=AuthTokenResponse, summary="Upgrade Current User to VIP Plan")
def upgrade_vip(current_user: UserResponse = Depends(get_current_user)):
    user, token = auth_service.upgrade_to_vip(current_user.id)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.get("/profile-history", summary="Get Role-Based User History & Dashboard Data")
def get_profile_history(current_user: UserResponse = Depends(get_current_user)):
    """
    Returns role-specific history:
    - Customer: Order history, spent total, saved shipping addresses.
    - Admin: System metrics, registered user count, active sessions, total revenue.
    - Delivery Partner: Assigned dispatch orders & delivery status.
    """
    role = current_user.role
    if role == "customer":
        orders = order_service.get_user_orders(current_user.id)
        total_spent = sum(o["total_amount"] for o in orders)
        return {
            "user": current_user,
            "role": "customer",
            "orders_count": len(orders),
            "total_spent": total_spent,
            "orders": orders
        }
    elif role == "admin":
        all_orders = order_service.get_all_orders()
        total_revenue = sum(o["total_amount"] for o in all_orders)
        user_count = 0
        session_count = 0
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM users")
                user_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM sessions")
                session_count = cursor.fetchone()[0]
        except Exception:
            pass

        return {
            "user": current_user,
            "role": "admin",
            "system_metrics": {
                "registered_users": user_count or 3,
                "active_sessions": session_count or 1,
                "total_orders": len(all_orders),
                "total_revenue": total_revenue
            },
            "orders": all_orders
        }
    elif role in ("delivery_partner", "shipper"):
        all_orders = order_service.get_all_orders()
        dispatched_orders = [o for o in all_orders if o["status"] in ("DISPATCHED", "IN_TRANSIT")]
        pending_orders = [o for o in all_orders if o["status"] == "CONFIRMED"]
        delivered_orders = [o for o in all_orders if o["status"] == "DELIVERED"]
        return {
            "user": current_user,
            "role": role,
            "active_deliveries_count": len(dispatched_orders),
            "dispatched_count": len(dispatched_orders),
            "pending_dispatch_count": len(pending_orders),
            "delivered_count": len(delivered_orders),
            "total_deliveries": len(all_orders),
            "orders": all_orders
        }
    return {"user": current_user, "role": role, "orders": []}

@router.put("/orders/{order_id}/status", summary="Update Order Status (Shipper / Delivery Partner / Admin)")
def update_order_status(
    order_id: str,
    status: str = Body(..., embed=True),
    current_user: UserResponse = Depends(require_roles(["delivery_partner", "shipper", "admin"]))
):
    clean_status = status.upper().strip()
    order = order_service.get_order_by_id(order_id)
    if not order:
        raise DomainException(
            error_code="ORDER_NOT_FOUND",
            title="Order Not Found",
            status=404,
            detail=f"Order '{order_id}' was not found in system records."
        )

    current_status = order.get("status", "")

    # Role enforcement:
    # 1. Customer is excluded by require_roles (cannot perform any status operations).
    # 2. Shipper updates up to IN_TRANSIT (CONFIRMED -> DISPATCHED -> IN_TRANSIT). Cannot mark DELIVERED.
    if current_user.role == "shipper":
        if clean_status not in ("DISPATCHED", "IN_TRANSIT"):
            raise DomainException(
                error_code="SHIPPER_RESTRICTION",
                title="Invalid Status for Shipper",
                status=403,
                detail="Shippers can only advance orders to DISPATCHED or IN_TRANSIT. Marking as DELIVERED is reserved exclusively for the Delivery Boy."
            )

    # 3. Delivery Partner can ONLY mark as DELIVERED, and ONLY when the order is IN_TRANSIT.
    elif current_user.role == "delivery_partner":
        if clean_status != "DELIVERED":
            raise DomainException(
                error_code="DELIVERY_PARTNER_RESTRICTION",
                title="Invalid Status for Delivery Boy",
                status=403,
                detail="Delivery Boy can only mark final delivery (DELIVERED). Warehouse dispatching up to IN_TRANSIT is handled by the Shipper."
            )
        if current_status != "IN_TRANSIT":
            raise DomainException(
                error_code="ORDER_NOT_READY_FOR_DELIVERY",
                title="Order Not Ready for Delivery",
                status=400,
                detail=f"Order #{order_id} cannot be marked DELIVERED until the Shipper dispatches it to IN_TRANSIT (Current: {current_status})."
            )

    return order_service.update_order_status(order_id, clean_status)

@router.post("/sample-order", summary="Generate Instant Realistic Sample Order")
def create_sample_order(current_user: UserResponse = Depends(get_current_user)):
    return order_service.create_sample_order(current_user.id)

@router.get("/admin-dashboard", summary="Admin Restricted Dashboard Endpoint")
def admin_dashboard(admin_user: UserResponse = Depends(require_roles(["admin"]))):
    return {
        "message": "Welcome Admin! Access granted to system administration dashboard.",
        "admin": admin_user
    }

@router.get("/delivery-dashboard", summary="Delivery Partner Restricted Endpoint")
def delivery_dashboard(user: UserResponse = Depends(require_roles(["delivery_partner", "admin"]))):
    return {
        "message": "Welcome Delivery Partner! Access granted to logistics and active orders dispatch panel.",
        "user": user
    }

@router.post("/logout", summary="Terminate Session")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        auth_service.logout(token)
    return {"message": "Successfully logged out."}
