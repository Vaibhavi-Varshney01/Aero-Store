import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ItemsPage } from './pages/ItemsPage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AppInfoModal } from './components/AppInfoModal';
import { UseCaseModal } from './components/UseCaseModal';
import { ProfileDashboard } from './components/ProfileDashboard';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CompareDock } from './components/CompareDock';
import { CompareModal } from './components/CompareModal';
import { api } from './services/api';

function StorefrontInner({ notify, toast, setToast, announcement }) {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { refreshCart } = useCart();

  // Dark & Light Mode Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aerostore_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aerostore_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      notify(`🌓 Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
      return next;
    });
  }, [notify]);

  // Navigation State: 'home' | 'items' | 'cart' | 'auth' | 'dashboard'
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'items', 'cart', 'auth', 'dashboard'].includes(hash) ? hash : 'home';
  });
  const [authInitialTab, setAuthInitialTab] = useState('login');

  // Products & Filter State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false);
  const [activeUseCaseId, setActiveUseCaseId] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('driver_details');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProfile = useCallback((tab = 'driver_details') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  }, []);

  // Multi-Brand Product Comparison
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedCompareItemId, setSelectedCompareItemId] = useState('PROD-101');

  // Navigation helper with authentication guard
  const navigate = useCallback((page, params = {}) => {
    // If not authenticated and attempting to access products or cart or dashboard
    if (!isAuthenticated && ['items', 'cart', 'dashboard'].includes(page)) {
      setActivePage('auth');
      window.location.hash = 'auth';
      if (params.tab) setAuthInitialTab(params.tab);
      else setAuthInitialTab('login');
      notify('🔒 Member access required. Please sign in or register to access products.', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage(page);
    window.location.hash = page;
    if (params.category) setCategory(params.category);
    if (params.search !== undefined) setSearchQuery(params.search);
    if (params.tab) setAuthInitialTab(params.tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthenticated, notify]);

  // Hash change synchronization with authentication guard
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'items', 'cart', 'auth', 'dashboard'].includes(hash)) {
        if (!isAuthenticated && ['items', 'cart', 'dashboard'].includes(hash)) {
          setActivePage('auth');
          window.location.hash = 'auth';
          notify('🔒 Member access required. Please sign in or register to browse products.', 'info');
          return;
        }
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, notify]);

  // If user is unauthenticated on protected pages, redirect to auth
  useEffect(() => {
    if (!isAuthenticated && ['items', 'cart', 'dashboard'].includes(activePage)) {
      setActivePage('auth');
      window.location.hash = 'auth';
    }
  }, [isAuthenticated, activePage]);

  // Product select / quick-view access guard
  const handleSelectProduct = useCallback((prod) => {
    if (!isAuthenticated) {
      notify('🔒 Please sign in or register to view product specifications and details.', 'info');
      navigate('auth', { tab: 'login' });
      return;
    }
    setSelectedProduct(prod);
  }, [isAuthenticated, navigate, notify]);

  // Multi-Brand Product Comparison
  const handleToggleCompare = useCallback((product) => {
    if (!isAuthenticated) {
      notify('🔒 Please sign in or register to compare product brands.', 'info');
      navigate('auth', { tab: 'login' });
      return;
    }
    setSelectedCompareItemId(product.id);
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
    setIsCompareOpen(true);
    notify(`⚖️ Comparing leading brands for ${product.name}`, 'info');
  }, [isAuthenticated, navigate, notify]);

  const handleRemoveCompared = useCallback((productId) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const handleClearCompared = useCallback(() => {
    setComparedProducts([]);
  }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch catalog products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts(category, debouncedSearch);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Network error fetching products');
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch]);

  useEffect(() => {
    loadProducts();
    // Auto-refresh products periodically so stock updates reflect globally across all sessions/roles
    const interval = setInterval(() => {
      loadProducts();
    }, 4000);
    return () => clearInterval(interval);
  }, [loadProducts]);

  const handleOrderCompleted = (order) => {
    notify(`🎉 Order ${order.order_id} confirmed!`, 'success');
    loadProducts(); // refresh inventory stocks
  };

  return (
    <div className="app-container">
      {/* Screen Reader Live Announcer */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Global Navigation Header */}
      <Header
        activePage={activePage}
        onNavigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products}
        onSelectCategory={(cat) => {
          setCategory(cat);
          navigate('items', { category: cat });
        }}
        onOpenProfile={handleOpenProfile}
        onOpenUseCases={(ucId = 1) => {
          setActiveUseCaseId(ucId);
          setIsUseCaseOpen(true);
        }}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Dedicated Page Views */}
      <main className="main-content-area" role="main">
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigate}
            onOpenAppInfo={() => {
              setActiveUseCaseId(1);
              setIsUseCaseOpen(true);
            }}
            onSelectProduct={handleSelectProduct}
            products={products}
            onToggleCompare={handleToggleCompare}
            comparedProductIds={comparedProducts.map((p) => p.id)}
            onStockUpdated={loadProducts}
          />
        )}

        {(activePage === 'items' || activePage === 'restocker') && (
          <ItemsPage
            initialMode={activePage === 'restocker' ? 'restocker' : 'catalog'}
            products={products}
            loading={loading}
            error={error}
            category={category}
            onSelectCategory={setCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onRetry={loadProducts}
            onNavigate={navigate}
            onToggleCompare={handleToggleCompare}
            comparedProductIds={comparedProducts.map((p) => p.id)}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            onNavigate={navigate}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {activePage === 'auth' && (
          <AuthPage
            onNavigate={navigate}
            initialTab={authInitialTab}
            onLoginSuccess={() => {
              notify('✅ Welcome back! Secure session active.', 'success');
              navigate('home');
            }}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            onNavigate={navigate}
            onOpenProfile={handleOpenProfile}
          />
        )}
      </main>

      {/* Product Quick View Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Off-Canvas Cart Drawer (Available for quick peek) */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Customer Authentication Modal (Fallback if triggered directly) */}
      <AuthModal />

      {/* App Architecture & Info Modal */}
      <AppInfoModal
        isOpen={isAppInfoOpen}
        onClose={() => setIsAppInfoOpen(false)}
      />

      {/* AI Engineering 5 Use Cases & Mentor Tour Inspector Modal */}
      <UseCaseModal
        isOpen={isUseCaseOpen}
        initialUcId={activeUseCaseId}
        onClose={() => setIsUseCaseOpen(false)}
      />

      {/* Role-Based Profile Dashboard */}
      <ProfileDashboard
        isOpen={isProfileOpen}
        initialTab={profileInitialTab}
        onClose={() => setIsProfileOpen(false)}
        onNavigate={navigate}
      />

      {/* SmartMatch Product Comparison Floating Dock */}
      <CompareDock
        comparedProducts={comparedProducts}
        onRemoveProduct={handleRemoveCompared}
        onClearAll={handleClearCompared}
        onOpenCompareModal={() => setIsCompareOpen(true)}
      />

      {/* Multi-Brand Same-Item Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        selectedItemId={selectedCompareItemId}
        comparedProductIds={comparedProducts.map((p) => p.id)}
        onClose={() => setIsCompareOpen(false)}
        onSelectItem={(itemId) => setSelectedCompareItemId(itemId)}
      />

      {/* Floating AI Shopping Concierge with Interactive CRUD & Theme Switching */}
      <ChatbotWidget
        onCartUpdated={() => refreshCart()}
        onProductsUpdated={() => loadProducts()}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Slide-out Options Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={navigate}
        onOpenProfile={handleOpenProfile}
        onSelectCategory={(cat) => {
          setCategory(cat);
          navigate('items', { category: cat });
        }}
      />

      {/* E-Commerce Footer */}
      <Footer
        onCategoryClick={(cat) => {
          setCategory(cat);
          navigate('items', { category: cat });
        }}
        onAskAi={() => {
          const launcher = document.getElementById('chatbot-launcher');
          if (launcher) launcher.click();
        }}
        onNavigate={navigate}
      />

      {/* Toast Alerts */}
      <Toast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function StorefrontApp() {
  const [toast, setToast] = useState(null);
  const [announcement, setAnnouncement] = useState('');

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setAnnouncement(message);
  }, []);

  return (
    <AuthProvider onNotify={notify}>
      <CartProvider onNotify={notify}>
        <StorefrontInner
          notify={notify}
          toast={toast}
          setToast={setToast}
          announcement={announcement}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default StorefrontApp;
