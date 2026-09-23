import React, { useState } from 'react';
import { 
  Globe, 
  User as UserIcon, 
  ShoppingBag, 
  LayoutDashboard, 
  Store, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  ShieldCheck,
  Building,
  Lock,
  Share2,
  FileText,
  HardDrive,
  BookOpen
} from 'lucide-react';
import { Language, User, Currency, ActiveView } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { CurrencySelector } from './CurrencySelector';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentCurrency: Currency;
  onSelectCurrency: (c: Currency) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
  activeView: ActiveView;
  onToggleView: (view: ActiveView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuickCheckout: () => void;
  onRequestAdminAccess: () => void;
  isAdminAuthenticated: boolean;
  onOpenShare: () => void;
  onNavigateResources?: () => void;
  onOpenMagazineModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentCurrency,
  onSelectCurrency,
  currentUser,
  onOpenAuth,
  onSignOut,
  activeView,
  onToggleView,
  cartCount,
  onOpenCart,
  onOpenQuickCheckout,
  onRequestAdminAccess,
  isAdminAuthenticated,
  onOpenShare,
  onNavigateResources,
  onOpenMagazineModal
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isArabic = lang === 'ar';

  return (
    <header
      id="main-navigation-bar"
      className="sticky top-0 z-40 w-full border-b border-[#d4af37]/20 bg-[#0c0d12]/90 backdrop-blur-xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <BrandLogo
          lang={lang}
          size="md"
          onClick={() => onToggleView('store')}
        />

        {/* Center Desktop Navigation / View Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-[#14151e]/80 p-1.5 rounded-xl border border-[#d4af37]/20">
          {/* 1. Main Advisory Store */}
          <button
            id="nav-btn-store"
            type="button"
            onClick={() => onToggleView('store')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'store'
                ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#c59b27]/25 text-[#ffd700] border border-[#d4af37]/50 shadow-sm'
                : 'text-[#9ea3b5] hover:text-[#e5e5e5] hover:bg-[#1f212d]/40'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.clientStore}</span>
          </button>

          {/* 2. Executive Magazine Modal Trigger */}
          <button
            id="nav-btn-magazine"
            type="button"
            onClick={() => {
              if (onOpenMagazineModal) {
                onOpenMagazineModal();
              } else {
                onToggleView('magazine');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'magazine'
                ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#c59b27]/25 text-[#ffd700] border border-[#d4af37]/50 shadow-sm'
                : 'text-[#9ea3b5] hover:text-[#ffd700] hover:bg-[#1f212d]/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabic ? 'مجلة HR Navigator التنفيذية' : 'HR Magazine'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40">
              {isArabic ? 'جديد' : 'New'}
            </span>
          </button>

          {/* 3. Client & Subscriber Portal */}
          <button
            id="nav-btn-client-portal"
            type="button"
            onClick={() => onToggleView('client_portal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'client_portal'
                ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#c59b27]/25 text-[#ffd700] border border-[#d4af37]/50 shadow-sm'
                : 'text-[#9ea3b5] hover:text-[#e5e5e5] hover:bg-[#1f212d]/40'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabic ? 'بوابة المشتركين والعملاء' : 'Client Portal'}</span>
          </button>

          {/* 3. Owner & Admin Dashboard (Visible ONLY if authenticated as admin or on request) */}
          {isAdminAuthenticated && (
            <button
              id="nav-btn-admin"
              type="button"
              onClick={() => onToggleView('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'admin'
                  ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#c59b27]/25 text-[#ffd700] border border-[#d4af37]/50 shadow-sm'
                  : 'text-[#9ea3b5] hover:text-[#e5e5e5] hover:bg-[#1f212d]/40'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t.adminPortal}</span>
            </button>
          )}
        </div>

        {/* Right Desktop Utilities */}
        <div className="hidden md:flex items-center gap-3">
          {/* Currency Switcher */}
          <CurrencySelector
            currentCurrency={currentCurrency}
            onSelectCurrency={onSelectCurrency}
            lang={lang}
          />

          {/* Language Switcher */}
          <button
            id="btn-language-switcher"
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d4af37]/25 bg-[#14151e]/60 hover:bg-[#1c1e2a] hover:border-[#d4af37]/50 text-xs font-semibold text-[#d4af37] transition-all"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Cart / Bag Button */}
          <button
            id="btn-cart-toggle"
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl border border-[#d4af37]/20 bg-[#14151e]/60 hover:bg-[#1d1f2b] text-[#e5e5e5] hover:text-[#ffd700] transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-full bg-[#d4af37] text-[#0c0d12] shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14151e] border border-[#d4af37]/30">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#886411] flex items-center justify-center text-[#0b0c10] font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#e5e5e5] max-w-[110px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#d4af37] flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3 inline" />
                    <span>{currentUser.tier}</span>
                  </div>
                </div>
              </div>
              <button
                id="btn-signout"
                type="button"
                onClick={onSignOut}
                className="p-2 rounded-lg text-[#8a8d9a] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-signin-modal"
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 text-xs font-semibold text-[#d4af37] hover:text-[#ffe484] hover:bg-[#d4af37]/10 rounded-lg transition-all"
              >
                {t.signIn}
              </button>
              <button
                id="btn-register-modal"
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-bold text-[#0c0d12] bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] hover:brightness-110 rounded-lg shadow-[0_2px_14px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.register}</span>
              </button>
            </div>
          )}

          {/* Share Client Link Button */}
          <button
            id="btn-navbar-share"
            type="button"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            title={isArabic ? 'مشاركة ونشر رابط المشتركين' : 'Share Subscriber Link'}
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{isArabic ? 'نشر الرابط' : 'Share Link'}</span>
          </button>

          {/* Quick Pay Button */}
          <button
            id="btn-quick-checkout"
            type="button"
            onClick={onOpenQuickCheckout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d4af37] bg-[#1a1b24] hover:bg-[#252735] text-[#ffd700] text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.quickPay}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="btn-mobile-lang"
            type="button"
            onClick={onToggleLang}
            className="px-2 py-1 rounded border border-[#d4af37]/30 text-xs text-[#d4af37]"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            id="btn-mobile-cart"
            type="button"
            onClick={onOpenCart}
            className="p-2 text-[#e5e5e5] relative"
          >
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#d4af37] text-[#0c0d12] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="btn-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#d4af37] hover:bg-[#1f212d] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d4af37]/20 bg-[#0e0f16] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onToggleView('store');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold ${
                  activeView === 'store' ? 'bg-[#d4af37] text-[#0c0d12]' : 'bg-[#151620] text-[#a0a3b0]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{t.clientStore}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleView('client_portal');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold ${
                  activeView === 'client_portal' ? 'bg-[#d4af37] text-[#0c0d12]' : 'bg-[#151620] text-[#a0a3b0]'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{isArabic ? 'بوابة المشتركين' : 'Client Portal'}</span>
              </button>
            </div>

            {/* Mobile Magazine Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenMagazineModal) {
                  onOpenMagazineModal();
                } else {
                  onToggleView('magazine');
                }
              }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                activeView === 'magazine'
                  ? 'bg-[#d4af37] text-black border-[#d4af37]'
                  : 'bg-[#181a28] text-[#ffd700] border-[#d4af37]/30'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>{isArabic ? 'مجلة HR Navigator التنفيذية' : 'HR Magazine'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30 font-mono">
                {isArabic ? 'كامل الأعداد' : 'All Issues'}
              </span>
            </button>

            {/* Mobile Share Link Button */}
            <button
              id="btn-mobile-share"
              type="button"
              onClick={() => {
                onOpenShare();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/40"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>{isArabic ? 'مشاركة ونشر رابط المشتركين' : 'Share Subscriber Link'}</span>
            </button>

            {isAdminAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  onToggleView('admin');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold ${
                  activeView === 'admin' ? 'bg-[#d4af37] text-[#0c0d12]' : 'bg-[#151620] text-[#ffd700] border border-[#d4af37]/30'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.adminPortal}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onRequestAdminAccess();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium text-[#7a7e92] hover:text-[#ffd700] border border-white/5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isArabic ? 'دخول الملاك (مشفر)' : 'Owner Login (Secure)'}</span>
              </button>
            )}
          </div>

          {/* Mobile Currency Selector */}
          <div className="py-2 border-t border-white/5">
            <div className="text-[11px] text-[#9ea3b5] mb-2 font-medium">
              {lang === 'ar' ? 'عملة الدفع:' : 'Payment Currency:'}
            </div>
            <CurrencySelector
              currentCurrency={currentCurrency}
              onSelectCurrency={(c) => {
                onSelectCurrency(c);
                setMobileMenuOpen(false);
              }}
              lang={lang}
              variant="pills"
            />
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#141520] border border-[#d4af37]/20">
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-[#d4af37]">{currentUser.tier}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 p-1"
                >
                  {t.signOut}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg text-xs font-bold text-[#d4af37] border border-[#d4af37]/40 bg-[#161722]"
                >
                  {t.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg text-xs font-bold bg-[#d4af37] text-[#0c0d12]"
                >
                  {t.register}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenQuickCheckout();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0c0d12] text-xs font-bold flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t.quickPay}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
