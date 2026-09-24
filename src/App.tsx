/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, LuxuryService, Order, OrderItem, OrderStatus, User, Currency, ActiveView } from './types';
import { initialOrders, initialServices, demoUsers } from './data/mockData';
import { ALL_CURRENCIES } from './utils/currency';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PillarsBanner } from './components/PillarsBanner';
import { CatalogSection } from './components/CatalogSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ContractModal } from './components/ContractModal';
import { ManualOrderModal } from './components/ManualOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ClientPortal } from './components/ClientPortal';
import { AdminSecurityModal } from './components/AdminSecurityModal';
import { HRHealthCheckSection } from './components/HRHealthCheckSection';
import { ShareModal } from './components/ShareModal';
import { DigitalResourcesSection } from './components/DigitalResourcesSection';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { MagazinePageView } from './components/MagazinePageView';
import { MagazineModal } from './components/MagazineModal';
import { DigitalResource, SocialPost } from './types';
import { initialDigitalResources, initialSocialPosts } from './data/resourcesData';
import { CloudService } from './lib/cloudService';
import { navigateToMagazine } from './utils/navigation';

export default function App() {
  // Language state (persisted)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('hrn_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  // Currency state (persisted - defaults to EGP for Egypt)
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('hrn_currency');
    if (saved === 'SAR') {
      localStorage.setItem('hrn_currency', 'EGP');
      return 'EGP';
    }
    return (saved && ALL_CURRENCIES.includes(saved as Currency)) ? (saved as Currency) : 'EGP';
  });

  // Owner Authentication state (PIN protected for owners)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('hrn_admin_unlocked') === 'true';
  });

  // Active View ('store' | 'client_portal' | 'admin')
  // Check URL parameter: ?view=portal or ?view=admin or ?portal=client
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'portal' || viewParam === 'client') return 'client_portal';
      if (viewParam === 'admin' && sessionStorage.getItem('hrn_admin_unlocked') === 'true') return 'admin';
    } catch (e) {}
    return 'store';
  });

  // Modals state
  const [adminSecurityModalOpen, setAdminSecurityModalOpen] = useState(false);

  // User state (persisted)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hrn_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hrn_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  // Digital Resources state (persisted and synchronized with newly added resources)
  const [digitalResources, setDigitalResources] = useState<DigitalResource[]>(() => {
    const saved = localStorage.getItem('hrn_resources');
    if (saved) {
      try {
        const parsed: DigitalResource[] = JSON.parse(saved);
        const missing = initialDigitalResources.filter(init => !parsed.some(p => p.id === init.id));
        if (missing.length > 0) {
          const merged = [
            ...initialDigitalResources.filter(init => !parsed.some(p => p.id === init.id)),
            ...parsed
          ];
          localStorage.setItem('hrn_resources', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        return initialDigitalResources;
      }
    }
    return initialDigitalResources;
  });

  // Social Posts & Videos state (persisted)
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('hrn_social_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialSocialPosts;
      }
    }
    return initialSocialPosts;
  });

  const handleAddResource = (newRes: DigitalResource) => {
    setDigitalResources(prev => {
      const updated = [newRes, ...prev];
      localStorage.setItem('hrn_resources', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteResource = (id: string) => {
    setDigitalResources(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('hrn_resources', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddSocialPost = (newPost: SocialPost) => {
    setSocialPosts(prev => {
      const updated = [newPost, ...prev];
      localStorage.setItem('hrn_social_posts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteSocialPost = (id: string) => {
    setSocialPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('hrn_social_posts', JSON.stringify(updated));
      return updated;
    });
  };

  // Services
  const [services] = useState<LuxuryService[]>(initialServices);

  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([
    {
      serviceId: initialServices[0].id,
      titleAr: initialServices[0].titleAr,
      titleEn: initialServices[0].titleEn,
      price: initialServices[0].price,
      quantity: 1
    }
  ]);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [manualOrderModalOpen, setManualOrderModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [googleDriveModalOpen, setGoogleDriveModalOpen] = useState(false);
  const [magazineModalOpen, setMagazineModalOpen] = useState(false);

  // Sync HTML tag direction & lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('hrn_lang', lang);
  }, [lang]);

  // Persist currency
  useEffect(() => {
    localStorage.setItem('hrn_currency', currency);
  }, [currency]);

  // Persist orders to local storage & active cloud
  useEffect(() => {
    localStorage.setItem('hrn_orders', JSON.stringify(orders));
    // Asynchronously push to active cloud connection
    CloudService.syncDoc('system_data', 'orders_archive', { orders }).catch(() => {});
  }, [orders]);

  // Listen to cloud updates when switching connections
  useEffect(() => {
    const unsub = CloudService.subscribe(async () => {
      const remote = await CloudService.readDoc('system_data', 'orders_archive');
      if (remote && Array.isArray(remote.orders) && remote.orders.length > 0) {
        setOrders(remote.orders);
      }
    });
    return () => unsub();
  }, []);

  // Persist user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hrn_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hrn_user');
    }
  }, [currentUser]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Cart Handlers
  const handleAddToCart = (service: LuxuryService) => {
    setCart(prev => {
      const existing = prev.find(i => i.serviceId === service.id);
      if (existing) {
        return prev.map(i => i.serviceId === service.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          titleAr: service.titleAr,
          titleEn: service.titleEn,
          price: service.price,
          originalPrice: service.originalPrice,
          exactPrices: service.exactPrices,
          exactOriginalPrices: service.exactOriginalPrices,
          sku: service.sku,
          quantity: 1
        }
      ];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.serviceId === serviceId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(i => i.serviceId !== serviceId));
  };

  // Instant Checkout for a single item
  const handleInstantBuy = (service: LuxuryService) => {
    const singleItem: OrderItem = {
      serviceId: service.id,
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      price: service.price,
      originalPrice: service.originalPrice,
      exactPrices: service.exactPrices,
      exactOriginalPrices: service.exactOriginalPrices,
      sku: service.sku,
      quantity: 1
    };
    setCheckoutItems([singleItem]);
    setCheckoutModalOpen(true);
  };

  // Instant Checkout for a paid digital resource/toolkit
  const handleBuyResource = (resource: DigitalResource) => {
    const resourceItem: OrderItem = {
      serviceId: resource.id,
      titleAr: `حقيبة رقمية: ${resource.titleAr}`,
      titleEn: `Digital Toolkit: ${resource.titleEn}`,
      price: resource.price,
      exactPrices: resource.exactPrices,
      quantity: 1
    };
    setCheckoutItems([resourceItem]);
    setCheckoutModalOpen(true);
  };

  const scrollToResources = () => {
    const el = document.getElementById('digital-resources');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Pay from Navbar
  const handleQuickCheckout = () => {
    if (cart.length > 0) {
      setCheckoutItems(cart);
    } else {
      setCheckoutItems([
        {
          serviceId: services[0].id,
          titleAr: services[0].titleAr,
          titleEn: services[0].titleEn,
          price: services[0].price,
          exactPrices: services[0].exactPrices,
          quantity: 1
        }
      ]);
    }
    setCheckoutModalOpen(true);
  };

  // Order completed
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Clear cart if matching
    setCart([]);
  };

  // Status Updater in Admin
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Invoice view trigger
  const handleViewInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setInvoiceModalOpen(true);
  };

  // Preview sample official tax invoice for visitors
  const handleViewSampleInvoice = () => {
    const sampleOrder: Order = {
      id: 'sample-inv-001',
      orderNumber: 'HRN-2026-INV-1001',
      customerName: currentUser?.name || (lang === 'ar' ? 'شركة الرواد للاستثمار والتقنية' : 'Al-Ruwad Tech & Investment Group'),
      customerEmail: currentUser?.email || 'finance@alruwad-group.com',
      customerPhone: currentUser?.phone || '+966 50 123 4567',
      customerAddress: lang === 'ar' ? 'الرياض - حي العليا، المملكة العربية السعودية' : 'Olaya District, Riyadh, Saudi Arabia',
      items: [
        {
          serviceId: services[0].id,
          titleAr: services[0].titleAr,
          titleEn: services[0].titleEn,
          price: services[0].price,
          quantity: 1
        }
      ],
      subtotal: services[0].price,
      tax: Math.round(services[0].price * 0.15),
      total: Math.round(services[0].price * 1.15),
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      paymentMethod: 'card',
      currency: currency
    };
    setSelectedInvoiceOrder(sampleOrder);
    setInvoiceModalOpen(true);
  };

  // Add manual order in admin
  const handleAddManualOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e2e4ea] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#ffd700]">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onSignOut={() => setCurrentUser(null)}
        activeView={activeView}
        onToggleView={(view) => {
          if (view === 'admin' && !isAdminUnlocked) {
            setAdminSecurityModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenQuickCheckout={handleQuickCheckout}
        onRequestAdminAccess={() => setAdminSecurityModalOpen(true)}
        isAdminAuthenticated={isAdminUnlocked || currentUser?.role === 'admin'}
        onOpenShare={() => setShareModalOpen(true)}
        onNavigateResources={scrollToResources}
        onOpenMagazineModal={() => navigateToMagazine(setActiveView)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'store' ? (
          <>
            {/* Hero Banner with HR Navigator Consultations branding */}
            <Hero
              lang={lang}
              onExplore={scrollToCatalog}
              onJoin={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              onQuickPay={handleQuickCheckout}
              onShare={() => setShareModalOpen(true)}
              onOpenMagazine={() => navigateToMagazine(setActiveView)}
              setActiveView={setActiveView}
            />

            {/* 6 Specialization Pillars Strip */}
            <PillarsBanner
              lang={lang}
              onSelectPillar={() => scrollToCatalog()}
            />

            {/* Interactive HR Health Check & Readiness Tool */}
            <HRHealthCheckSection
              lang={lang}
              onBookConsultation={scrollToCatalog}
            />

            {/* Catalog Section with Consultation Packages */}
            <CatalogSection
              lang={lang}
              currentCurrency={currency}
              onSelectCurrency={setCurrency}
              services={services}
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
            />

            {/* Digital Library, PDF Resources (Free & Paid) & LinkedIn Articles */}
            <DigitalResourcesSection
              lang={lang}
              currentCurrency={currency}
              onBuyResource={handleBuyResource}
              resources={digitalResources}
              socialPosts={socialPosts}
              onOpenMagazinePage={() => navigateToMagazine(setActiveView)}
            />
          </>
        ) : activeView === 'magazine' ? (
          /* Dedicated Executive Magazine Full Page View */
          <MagazinePageView
            lang={lang}
            onBackToStore={() => {
              setActiveView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onConsultationBook={() => {
              setActiveView('store');
              scrollToCatalog();
            }}
          />
        ) : activeView === 'client_portal' ? (
          /* Client & Subscriber Dedicated Area */
          <ClientPortal
            lang={lang}
            currentUser={currentUser}
            orders={orders}
            onExplore={() => {
              setActiveView('store');
              scrollToCatalog();
            }}
            onViewInvoice={handleViewInvoice}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
            onSignOut={() => setCurrentUser(null)}
          />
        ) : (
          /* Owner & Admin Confidential Console */
          (isAdminUnlocked || currentUser?.role === 'admin') ? (
            <AdminDashboard
              lang={lang}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewInvoice={handleViewInvoice}
              onAddManualOrder={() => setManualOrderModalOpen(true)}
              resources={digitalResources}
              onAddResource={handleAddResource}
              onDeleteResource={handleDeleteResource}
              socialPosts={socialPosts}
              onAddSocialPost={handleAddSocialPost}
              onDeleteSocialPost={handleDeleteSocialPost}
              onOpenContractModal={() => setContractModalOpen(true)}
              onViewSampleInvoice={handleViewSampleInvoice}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {lang === 'ar' 
                  ? 'هذه المنطقة مخصصة لملاك وإدارة HR Navigator فقط. تم حجب الوصول.' 
                  : 'Restricted area. Confidential to HR Navigator owners only.'}
              </div>
              <button
                type="button"
                onClick={() => setAdminSecurityModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs"
              >
                {lang === 'ar' ? 'إدخال رمز أمان الملاك' : 'Enter Owner PIN'}
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onExplore={scrollToCatalog}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onRequestAdminAccess={() => setAdminSecurityModalOpen(true)}
        onOpenMagazine={() => navigateToMagazine(setActiveView)}
      />

      {/* Owner Security PIN Modal */}
      <AdminSecurityModal
        isOpen={adminSecurityModalOpen}
        lang={lang}
        onClose={() => setAdminSecurityModalOpen(false)}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          sessionStorage.setItem('hrn_admin_unlocked', 'true');
          setActiveView('admin');
        }}
      />

      {/* Auth Modal (Register & Login) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        lang={lang}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        lang={lang}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
        items={checkoutItems}
        currentUser={currentUser}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderCompleted={handleOrderCompleted}
        onViewInvoice={handleViewInvoice}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        lang={lang}
        currentCurrency={currency}
        items={cart}
        onClose={() => setCartDrawerOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={() => {
          setCheckoutItems(cart);
          setCheckoutModalOpen(true);
        }}
      />

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        lang={lang}
        onClose={() => setInvoiceModalOpen(false)}
      />

      {/* Official Consulting Contract Modal */}
      <ContractModal
        isOpen={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        lang={lang}
        clientName={currentUser?.name}
      />

      {/* Admin Manual Order Modal */}
      <ManualOrderModal
        isOpen={manualOrderModalOpen}
        lang={lang}
        services={services}
        onClose={() => setManualOrderModalOpen(false)}
        onAddOrder={handleAddManualOrder}
      />

      {/* Direct Share & Publish Client Link Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        lang={lang}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Google Workspace Drive Storage Modal */}
      <GoogleDriveModal
        isOpen={googleDriveModalOpen}
        onClose={() => setGoogleDriveModalOpen(false)}
        lang={lang}
      />

      {/* Executive Magazine Interactive Modal (All Issues & AI Studio Live Applet) */}
      <MagazineModal
        isOpen={magazineModalOpen}
        onClose={() => setMagazineModalOpen(false)}
        lang={lang}
        onOpenFullPageView={() => navigateToMagazine(setActiveView)}
        onConsultationBook={() => {
          setActiveView('store');
          scrollToCatalog();
        }}
      />

      {/* Floating WhatsApp Contact Button for Instant Customer Service (hidden during checkout) */}
      {!checkoutModalOpen && <FloatingWhatsApp lang={lang} />}

      {/* Floating Back to Top Button (hidden during checkout) */}
      {!checkoutModalOpen && <ScrollToTopButton lang={lang} />}
    </div>
  );
}
