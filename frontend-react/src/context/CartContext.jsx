import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children, onNotify }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    concurrency_version: 1
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Failed to fetch cart:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = async (productId) => {
    if (user?.role === 'admin' || user?.role === 'shipper' || user?.role === 'delivery_partner' || user?.role === 'delivery') {
      if (onNotify) {
        onNotify(
          '🛡️ Purchasing Restricted: Direct purchasing is disabled for staff/partner accounts. Please switch to or create a personal/business Customer account to purchase.',
          'warning'
        );
      }
      return { success: false, error: 'Purchasing restricted for non-customer accounts' };
    }
    try {
      setLoading(true);
      const updated = await api.addItemToCart(productId, 1, cart.concurrency_version);
      setCart(updated);
      setIsCartOpen(true);
      if (onNotify) onNotify('Item added to cart! 🛍️', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Failed to add item';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      // On concurrency conflict or out of sync version, refetch latest cart
      if (err.status === 409 || err.status === 412) {
        await fetchCart();
      }
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      setLoading(true);
      const updated = await api.updateCartItem(productId, newQuantity, cart.concurrency_version);
      setCart(updated);
      if (onNotify) onNotify('Cart updated', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Failed to update item';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      if (err.status === 409 || err.status === 412) {
        await fetchCart();
      }
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      const updated = await api.removeItemFromCart(productId, cart.concurrency_version);
      setCart(updated);
      if (onNotify) onNotify('Item removed from cart', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Failed to remove item';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      if (err.status === 409 || err.status === 412) {
        await fetchCart();
      }
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    try {
      setLoading(true);
      const updated = await api.applyCoupon(code.trim().toUpperCase());
      setCart(updated);
      const discount = updated.discount_amount.toFixed(2);
      if (onNotify) onNotify(`🎉 Coupon ${code} applied! Saved $${discount}`, 'success');
      return { success: true };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Invalid coupon';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    try {
      setLoading(true);
      const updated = await api.removeCoupon();
      setCart(updated);
      if (onNotify) onNotify('Coupon removed', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Failed to remove coupon';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      for (const item of cart.items || []) {
        await api.removeItemFromCart(item.product_id);
      }
      await fetchCart();
      if (onNotify) onNotify('Cart cleared', 'info');
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        refreshCart: fetchCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
