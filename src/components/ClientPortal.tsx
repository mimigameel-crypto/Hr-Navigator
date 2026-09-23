import React, { useState } from 'react';
import { 
  User, 
  Package, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  HelpCircle,
  CreditCard,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Language, Order, User as UserType } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';

interface ClientPortalProps {
  lang: Language;
  currentUser: UserType | null;
  orders: Order[];
  onExplore: () => void;
  onViewInvoice: (order: Order) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  lang,
  currentUser,
  orders,
  onExplore,
  onViewInvoice,
  onOpenAuth,
  onSignOut
}) => {
  const isArabic = lang === 'ar';
  const t = translations[lang];
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Filter orders matching current user's email or default to user's orders
  const clientOrders = currentUser 
    ? orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.email.includes('client'))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#12131c] via-[#161826] to-[#0f1017] border border-[#d4af37]/30 p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#ffd700] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'بوابة المشتركين والشركاء' : 'Client & Subscriber Portal'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentUser 
                ? (isArabic ? `مرحباً بك، ${currentUser.name}` : `Welcome, ${currentUser.name}`)
                : (isArabic ? 'بوابة عملاء ومشتركي HR Navigator' : 'HR Navigator Client Area')}
            </h1>

            <p className="text-sm text-[#9ea3b5] max-w-2xl leading-relaxed">
              {isArabic 
                ? 'تابع استشاراتك المحجوزة، مواعيد الجلسات، الفواتير الضريبية، وحالة إنجاز الملفات الإدارية الخاصة بمنشأتك بكل خصوصية وأمان.' 
                : 'Manage your active consultations, booked advisory sessions, tax invoices, and project deliverables with complete privacy.'}
            </p>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-[#1a1c2a] border border-[#d4af37]/30 text-right rtl:text-right ltr:text-left">
                <div className="text-xs text-[#8a8d9a]">{isArabic ? 'فئة المنشأة:' : 'Membership:'}</div>
                <div className="text-sm font-bold text-[#ffd700] flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{currentUser.tier}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/15 text-xs text-[#9ea3b5] hover:text-rose-300 border border-white/10 transition-colors"
              >
                {t.signOut}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all"
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-5 py-2.5 rounded-xl bg-[#1a1c29] text-white font-semibold text-xs border border-white/15 hover:border-[#d4af37] transition-all"
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: If user not logged in */}
      {!currentUser ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#12131c]/60 border border-white/5 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#181926] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {isArabic ? 'سجل دخولك لعرض استشارات منشأتك' : 'Log in to view your consultations'}
          </h3>
          <p className="text-xs text-[#8a8d9a] max-w-md mx-auto leading-relaxed">
            {isArabic 
              ? 'يمكنك تسجيل الدخول الآن بريدك الإلكتروني للوصول إلى الجلسات المجدولة، الفواتير، وتحميل مخرجات العمل.' 
              : 'Sign in to access your organization’s active consultations, invoices, and deliverables.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="px-6 py-3 rounded-xl bg-[#1a1c29] text-[#e2e4ea] font-medium text-xs border border-white/10 hover:border-[#d4af37]/50 transition-all"
            >
              {isArabic ? 'استعراض الباقات والاستشارات' : 'Browse Consultations'}
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Metrics for the Subscriber */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#13141f] border border-[#d4af37]/20">
              <div className="flex items-center justify-between text-xs text-[#8a8d9a] mb-2">
                <span>{isArabic ? 'إجمالي الاستشارات المطلوبة' : 'Total Consultations'}</span>
                <Package className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{clientOrders.length}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#13141f] border border-[#d4af37]/20">
              <div className="flex items-center justify-between text-xs text-[#8a8d9a] mb-2">
                <span>{isArabic ? 'استشارات قيد التنفيذ' : 'Active In-Progress'}</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {clientOrders.filter(o => o.status === 'processing' || o.status === 'new').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#13141f] border border-[#d4af37]/20">
              <div className="flex items-center justify-between text-xs text-[#8a8d9a] mb-2">
                <span>{isArabic ? 'استشارات تم تسليمها' : 'Delivered & Complete'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {clientOrders.filter(o => o.status === 'completed').length}
              </div>
            </div>
          </div>

          {/* Consultations List */}
          <div className="rounded-2xl bg-[#12131d] border border-white/10 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {isArabic ? 'سجل استشارات وطلبات منشأتك' : 'Your Consultation Bookings'}
                </h3>
                <p className="text-xs text-[#8a8d9a]">
                  {isArabic ? 'معلومات كل طلب، الفاتورة الضريبية، وحالة التنفيذ الحالية' : 'Details, invoice, and execution status for each engagement'}
                </p>
              </div>
              <button
                type="button"
                onClick={onExplore}
                className="px-3.5 py-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#ffd700] text-xs font-semibold border border-[#d4af37]/30 transition-colors flex items-center gap-1.5"
              >
                <span>{isArabic ? '+ طلب استشارة جديدة' : '+ Book New Consultation'}</span>
              </button>
            </div>

            {clientOrders.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <Package className="w-12 h-12 mx-auto text-[#4b4e60]" />
                <h4 className="text-sm font-bold text-white">
                  {isArabic ? 'لا توجد طلبات استشارات مسجلة حتى الآن' : 'No consultations booked yet'}
                </h4>
                <p className="text-xs text-[#8a8d9a] max-w-sm mx-auto">
                  {isArabic 
                    ? 'اختر من باقات HR Navigator الاستراتيجية لتطوير رأس المال البشري لمنشأتك.' 
                    : 'Choose from HR Navigator strategic advisory packages to scale your organizational capability.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onExplore}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all"
                  >
                    {isArabic ? 'استعراض الباقات المتاحة' : 'Explore Packages'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {clientOrders.map(order => (
                  <div key={order.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#ffd700] bg-[#ffd700]/10 px-2 py-0.5 rounded border border-[#ffd700]/20">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-[#6e7284]">
                            {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            order.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : order.status === 'processing'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}>
                            {order.status === 'completed' 
                              ? (isArabic ? 'مكتملة ومسلّمة' : 'Completed') 
                              : order.status === 'processing' 
                              ? (isArabic ? 'قيد العمل والتحليل' : 'In Progress') 
                              : (isArabic ? 'تم تأكيد الحجز' : 'Confirmed')}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">
                          {order.items.map(i => isArabic ? i.titleAr : i.titleEn).join(' + ')}
                        </h4>

                        <div className="text-xs text-[#8a8d9a] flex items-center gap-3">
                          <span>{isArabic ? 'الإجمالي:' : 'Total:'} <strong className="text-white font-mono">{order.total.toLocaleString()} {order.currency}</strong></span>
                          <span>•</span>
                          <span>{isArabic ? 'طريقة الدفع:' : 'Paid via:'} <strong className="text-white uppercase">{order.paymentMethod.replace('_', ' ')}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewInvoice(order)}
                          className="px-3.5 py-2 rounded-xl bg-[#1a1c29] hover:bg-[#25283a] text-xs text-[#ffd700] font-semibold border border-[#d4af37]/30 transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{isArabic ? 'عرض الفاتورة الضريبية' : 'View Tax Invoice'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
