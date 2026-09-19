import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  ChevronDown, 
  Share2, 
  Copy, 
  Check, 
  Lock, 
  Users, 
  ExternalLink,
  Trash2,
  Video,
  PlayCircle,
  Youtube,
  Instagram,
  Linkedin,
  MessageCircle,
  X,
  Download,
  Info,
  BookOpen
} from 'lucide-react';
import { Language, Order, OrderStatus, DigitalResource, SocialPost } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { currencies } from '../utils/currency';

interface AdminDashboardProps {
  lang: Language;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewInvoice: (order: Order) => void;
  onAddManualOrder: () => void;
  resources?: DigitalResource[];
  onAddResource?: (resource: DigitalResource) => void;
  onDeleteResource?: (id: string) => void;
  socialPosts?: SocialPost[];
  onAddSocialPost?: (post: SocialPost) => void;
  onDeleteSocialPost?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  orders,
  onUpdateOrderStatus,
  onViewInvoice,
  onAddManualOrder,
  resources = [],
  onAddResource,
  onDeleteResource,
  socialPosts = [],
  onAddSocialPost,
  onDeleteSocialPost
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';

  const [adminTab, setAdminTab] = useState<'orders' | 'resources' | 'social'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [copiedClientLink, setCopiedClientLink] = useState(false);
  const [copiedOwnerLink, setCopiedOwnerLink] = useState(false);

  // Resource Add Modal State
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [newResTitleAr, setNewResTitleAr] = useState('');
  const [newResTitleEn, setNewResTitleEn] = useState('');
  const [newResDescAr, setNewResDescAr] = useState('');
  const [newResCategoryAr, setNewResCategoryAr] = useState('نماذج وأدوات الموارد البشرية');
  const [newResAccessType, setNewResAccessType] = useState<'free' | 'paid'>('free');
  const [newResPrice, setNewResPrice] = useState(250);
  const [newResPages, setNewResPages] = useState(30);
  const [newResTopicsAr, setNewResTopicsAr] = useState('مؤشرات الأداء، خطة العمل، بطاقات المتابعة');

  // Social Post Add Modal State
  const [addSocialModalOpen, setAddSocialModalOpen] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<'linkedin' | 'instagram' | 'youtube' | 'whatsapp'>('linkedin');
  const [newSocialMediaType, setNewSocialMediaType] = useState<'article' | 'video' | 'infographic'>('article');
  const [newSocialTitleAr, setNewSocialTitleAr] = useState('');
  const [newSocialSummaryAr, setNewSocialSummaryAr] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialTagAr, setNewSocialTagAr] = useState('استشارات وهيكلة');

  // Derive current baseUrl
  const getBaseUrl = () => {
    try {
      return window.location.origin + window.location.pathname;
    } catch (e) {
      return '';
    }
  };

  const clientUrl = `${getBaseUrl()}?view=portal`;
  const ownerUrl = `${getBaseUrl()}?view=admin`;

  const copyToClipboard = (text: string, type: 'client' | 'owner') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'client') {
      setCopiedClientLink(true);
      setTimeout(() => setCopiedClientLink(false), 2500);
    } else {
      setCopiedOwnerLink(true);
      setTimeout(() => setCopiedOwnerLink(false), 2500);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'new' || o.status === 'processing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US').format(val);
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(i => 
        i.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          label: t.statusNew,
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'processing':
        return {
          label: t.statusProcessing,
          classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
      case 'completed':
        return {
          label: t.statusCompleted,
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'cancelled':
        return {
          label: t.statusCancelled,
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
    }
  };

  return (
    <div id="admin-dashboard-container" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#d4af37]/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[11px] font-bold text-[#ffd700]">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-[#8a8d9a]">| {t.adminSubtitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t.adminTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {adminTab === 'orders' && (
            <button
              id="admin-btn-add-order"
              type="button"
              onClick={onAddManualOrder}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] text-xs font-bold shadow-[0_2px_15px_rgba(212,175,55,0.3)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addManualOrder}</span>
            </button>
          )}

          {adminTab === 'resources' && (
            <button
              id="admin-btn-add-resource"
              type="button"
              onClick={() => setAddResourceModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] text-xs font-bold shadow-[0_2px_15px_rgba(212,175,55,0.3)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة ملف PDF / حقيبة جديدة' : 'Add New PDF / Toolkit'}</span>
            </button>
          )}

          {adminTab === 'social' && (
            <button
              id="admin-btn-add-social"
              type="button"
              onClick={() => setAddSocialModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] text-xs font-bold shadow-[0_2px_15px_rgba(212,175,55,0.3)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة منشور أو رابط فيديو' : 'Add Social Post or Video'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl bg-[#0e101a] border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isArabic ? 'طلبات وحجوزات الاستشارات' : 'Orders & Bookings'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono font-bold">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'resources'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isArabic ? 'مكتبة ملفات PDF والحقائب التدريبية' : 'PDF Toolkits & Library'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono font-bold">
            {resources.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'social'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>{isArabic ? 'منشورات وفيديوهات التواصل' : 'Social Posts & Videos'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono font-bold">
            {socialPosts.length}
          </span>
        </button>
      </div>

      {/* Reassuring Information Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-[#141624] border border-[#d4af37]/30 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#ffd700] flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#c7cbd9] leading-relaxed">
          <span className="font-bold text-[#ffd700] block mb-0.5">
            {isArabic ? 'مرونة كاملة في إضافة المحتوى والوسائط:' : 'Complete Flexibility in Content Management:'}
          </span>
          {isArabic 
            ? 'يمكنكِ إضافة وتعديل وحذف أي ملف PDF أو رابط فيديو (يوتيوب / إنستغرام / لينكد إن) مباشرة بنفسكِ من هذه اللوحة، كما يمكنكِ أيضاً إرسال أي رابط أو ملف في الشات لنقوم بإضافته وتنسيقه فوراً!'
            : 'You can add, edit, or delete any PDF toolkit or video link directly from this console, or simply send links/files in the conversation for instant formatting!'}
        </div>
      </div>

      {/* TAB 1: ORDERS & CONSULTATIONS */}
      {adminTab === 'orders' && (
        <>
          {/* Dedicated Links Separation & Sharing Console */}
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#12131f] via-[#161827] to-[#11121c] border border-[#d4af37]/35 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffd700]">
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              <span>{isArabic ? 'إدارة وفصل روابط الوصول للمنصة' : 'Platform Access & Distribution Links'}</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {isArabic ? 'روابط منفصلة ومخصصة للمشتركين مقابل الملاك' : 'Dedicated Independent Links (Subscribers vs. Owners)'}
            </h3>
            <p className="text-xs text-[#9ea3b5] leading-relaxed">
              {isArabic 
                ? 'انسخ الرابط المناسب لكل طرف؛ رابط المشتركين يعرض المتجر وبوابة الاستشارات فقط دون أي بيانات إدارية أو إيرادات، بينما رابط الملاك محمي برمز أمان سري.' 
                : 'Share appropriate links; Subscribers access only the store & bookings without revenue/admin data, while Owners have confidential PIN access.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto flex-shrink-0">
            {/* 1. Subscriber Link */}
            <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-blue-500/30 flex flex-col justify-between gap-2 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'رابط المشتركين والعملاء' : 'Subscribers Link'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  {isArabic ? 'آمن للعملاء' : 'Client Safe'}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a]">
                {isArabic ? 'أرسله للعملاء لحجز الاستشارات ومتابعة طلباتهم' : 'Send to clients to book services & view their orders'}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(clientUrl, 'client')}
                className="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedClientLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isArabic ? 'تم نسخ الرابط!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'نسخ رابط المشتركين' : 'Copy Subscriber Link'}</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Owner Link */}
            <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-[#d4af37]/35 flex flex-col justify-between gap-2 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ffd700] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'رابط الملاك والإدارة' : 'Owners & Executive Link'}</span>
                </span>
                <span className="text-[10px] text-[#ffd700] bg-[#ffd700]/10 px-1.5 py-0.5 rounded font-mono">
                  {isArabic ? 'محمي وسري' : 'PIN Protected'}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a]">
                {isArabic ? 'خاص بإدارة الشركة لمتابعة الإيرادات والطلبات' : 'For leadership to track revenue & manage all orders'}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(ownerUrl, 'owner')}
                className="w-full py-2 px-3 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#ffd700] border border-[#d4af37]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedOwnerLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isArabic ? 'تم نسخ الرابط!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'نسخ رابط الملاك' : 'Copy Owner Link'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-[#d4af37]/25 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9ea3b5]">{t.totalRevenue}</span>
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#ffd700]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold gold-gradient-text font-serif">
            {formatCurrency(totalRevenue)} <span className="text-xs font-semibold text-[#d4af37]">{t.currency}</span>
          </div>
          <div className="text-[11px] text-[#34d399] mt-2 flex items-center gap-1">
            <span>+18.4%</span>
            <span className="text-[#717585]">مقارنة بالشهر الماضي</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-[#d4af37]/25 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9ea3b5]">{t.totalOrders}</span>
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#ffd700]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-serif">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-[#9ea3b5] mt-2">
            كافة طلبات النخبة المسجلة
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-amber-500/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9ea3b5]">{t.pendingOrders}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-serif">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-2">
            تتطلب متابعة أو تنفيذ حالي
          </div>
        </div>

        {/* Completed Orders */}
        <div className="p-5 rounded-2xl bg-[#12131c] border border-emerald-500/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#9ea3b5]">{t.completedOrders}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-serif">
            {completedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-2">
            تم التنفيذ وإصدار الفواتير
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12131c] border border-[#d4af37]/20 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-[#8a8d9a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t.searchOrdersPlaceholder}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-[#171824] border border-white/10 focus:border-[#d4af37] text-xs text-white placeholder-[#626678] focus:outline-none transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'all', label: t.allStatuses },
            { id: 'new', label: t.statusNew },
            { id: 'processing', label: t.statusProcessing },
            { id: 'completed', label: t.statusCompleted },
            { id: 'cancelled', label: t.statusCancelled }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#d4af37] text-[#0b0c10] shadow-sm'
                  : 'bg-[#171824] text-[#8a8d9a] hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-[#12131c] border border-[#d4af37]/20 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[#161724] text-[#8a8d9a]">
                <th className="py-4 px-4 font-bold">{t.orderNumberCol}</th>
                <th className="py-4 px-4 font-bold">{t.customerCol}</th>
                <th className="py-4 px-4 font-bold">{t.serviceCol}</th>
                <th className="py-4 px-4 font-bold">{t.amountCol}</th>
                <th className="py-4 px-4 font-bold">{t.paymentCol}</th>
                <th className="py-4 px-4 font-bold">{t.statusCol}</th>
                <th className="py-4 px-4 font-bold">{t.dateCol}</th>
                <th className="py-4 px-4 font-bold text-center">{t.actionsCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#717585]">
                    <AlertCircle className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-50" />
                    <p>{t.noOrdersFound}</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const badge = getStatusBadge(order.status);
                  const firstItem = order.items[0];
                  const itemName = firstItem ? (isArabic ? firstItem.titleAr : firstItem.titleEn) : '-';
                  const moreItemsCount = order.items.length - 1;

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-[#181927]/60 transition-colors text-[#c5c8d6]"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-[#ffd700]">
                          {order.orderNumber}
                        </div>
                        {order.transactionRef && (
                          <div className="text-[10px] text-[#717585] font-mono truncate max-w-[100px]">
                            {order.transactionRef}
                          </div>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white leading-tight">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-[#8a8d9a] font-mono">
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* Service / Item */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-medium text-white truncate">
                          {itemName}
                        </div>
                        {order.consultationAppointment ? (
                          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 mt-0.5 font-mono">
                            <span>📅 {order.consultationAppointment.date}</span>
                            <span>({order.consultationAppointment.timeSlot.split('–')[0].trim()})</span>
                          </div>
                        ) : moreItemsCount > 0 ? (
                          <div className="text-[10px] text-[#d4af37]">
                            +{moreItemsCount} {isArabic ? 'خدمات إضافية' : 'more items'}
                          </div>
                        ) : null}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <span className="gold-gradient-text text-sm">
                          {formatCurrency(order.total)}
                        </span>{' '}
                        <span className="text-[10px] text-[#ffd700] font-bold px-1 py-0.5 rounded bg-black/40">
                          {isArabic ? (currencies[order.currency]?.symbolAr || 'ر.س') : (currencies[order.currency]?.symbolEn || 'SAR')}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4">
                        {order.paymentMethod === 'instapay' ? (
                          <span className="px-2 py-1 rounded bg-[#8b5cf6]/20 text-[#c084fc] font-bold text-[11px] uppercase border border-[#8b5cf6]/40 flex items-center gap-1 w-fit">
                            <span>⚡ INSTAPAY</span>
                          </span>
                        ) : order.paymentMethod === 'knet' ? (
                          <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[11px] uppercase border border-cyan-500/40 flex items-center gap-1 w-fit">
                            <span>🇰🇼 K-NET</span>
                          </span>
                        ) : order.paymentMethod === 'google_pay' ? (
                          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] uppercase border border-blue-500/40 flex items-center gap-1 w-fit">
                            <span>G-PAY</span>
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-[#1c1e2d] text-[#c5c8d6] font-semibold text-[11px] uppercase border border-white/5">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer appearance-none pr-6 rtl:pr-2.5 rtl:pl-6 focus:outline-none transition-all ${badge.classes}`}
                          >
                            <option value="new" className="bg-[#12131c] text-amber-300">{t.statusNew}</option>
                            <option value="processing" className="bg-[#12131c] text-blue-300">{t.statusProcessing}</option>
                            <option value="completed" className="bg-[#12131c] text-emerald-300">{t.statusCompleted}</option>
                            <option value="cancelled" className="bg-[#12131c] text-rose-300">{t.statusCancelled}</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute top-2 right-1.5 rtl:right-auto rtl:left-1.5 pointer-events-none opacity-70" />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-[#8a8d9a] font-mono text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onViewInvoice(order)}
                          className="p-1.5 rounded-lg text-[#ffd700] hover:bg-[#d4af37]/20 border border-[#d4af37]/30 transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                          title={t.viewInvoice}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.viewInvoice}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

  {/* TAB 2: DIGITAL RESOURCES & PDF TOOLKITS */}
  {adminTab === 'resources' && (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#12131c] border border-white/10">
          <span className="text-xs text-[#9ea3b5] block mb-1">{isArabic ? 'إجمالي الملفات والحقائب' : 'Total Resources'}</span>
          <span className="text-2xl font-bold text-white">{resources.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#12131c] border border-emerald-500/20">
          <span className="text-xs text-emerald-400 block mb-1">{isArabic ? 'ملفات مجانية للتحميل' : 'Free Downloads'}</span>
          <span className="text-2xl font-bold text-emerald-400">{resources.filter(r => r.accessType === 'free').length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#12131c] border border-[#d4af37]/20">
          <span className="text-xs text-[#ffd700] block mb-1">{isArabic ? 'حقائب تدريبية واستشارية مدفوعة' : 'Paid Toolkits'}</span>
          <span className="text-2xl font-bold text-[#ffd700]">{resources.filter(r => r.accessType === 'paid').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res) => (
          <div 
            key={res.id}
            className="p-5 rounded-2xl bg-[#12131c] border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  res.accessType === 'free' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/30'
                }`}>
                  {res.accessType === 'free' ? (isArabic ? 'مجاني 100%' : 'Free') : `${res.price} SAR`}
                </span>
                <span className="text-[11px] text-[#717688] font-mono">{res.fileSize} • {res.pageCount} {isArabic ? 'صفحة' : 'pages'}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                {isArabic ? res.titleAr : res.titleEn}
              </h4>
              <p className="text-xs text-[#9ea3b5] line-clamp-2 leading-relaxed mb-4">
                {isArabic ? res.descriptionAr : res.descriptionEn}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[11px] text-[#717688]">
                {res.downloadsCount}+ {isArabic ? 'عملية تحميل' : 'downloads'}
              </span>
              <div className="flex items-center gap-2">
                {onDeleteResource && (
                  <button
                    type="button"
                    onClick={() => onDeleteResource(res.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* TAB 3: SOCIAL POSTS & VIDEOS */}
  {adminTab === 'social' && (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#12131c] border border-white/10">
          <span className="text-xs text-[#9ea3b5] block mb-1">{isArabic ? 'إجمالي المحتوى' : 'Total Items'}</span>
          <span className="text-xl font-bold text-white">{socialPosts.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-[#0077b5]/30">
          <span className="text-xs text-[#0077b5] block mb-1">LinkedIn</span>
          <span className="text-xl font-bold text-white">{socialPosts.filter(p => p.platform === 'linkedin').length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-pink-500/30">
          <span className="text-xs text-pink-400 block mb-1">Instagram</span>
          <span className="text-xl font-bold text-white">{socialPosts.filter(p => p.platform === 'instagram').length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12131c] border border-red-500/30">
          <span className="text-xs text-red-400 block mb-1">YouTube Videos</span>
          <span className="text-xl font-bold text-white">{socialPosts.filter(p => p.platform === 'youtube' || p.mediaType === 'video').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPosts.map((post) => (
          <div 
            key={post.id}
            className="p-5 rounded-2xl bg-[#12131c] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    post.platform === 'linkedin' 
                      ? 'bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30' 
                      : post.platform === 'instagram'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {post.platform.toUpperCase()}
                  </span>
                  {post.mediaType === 'video' && (
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                      {isArabic ? 'فيديو' : 'Video'}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#717688] font-mono">{post.publishDate}</span>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                {isArabic ? post.titleAr : post.titleEn}
              </h4>
              <p className="text-xs text-[#9ea3b5] line-clamp-2 leading-relaxed mb-4">
                {isArabic ? post.summaryAr : post.summaryEn}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>{isArabic ? 'رابط المنشور المباشر' : 'Direct Link'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onDeleteSocialPost && (
                <button
                  type="button"
                  onClick={() => onDeleteSocialPost(post.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'حذف' : 'Delete'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Modal: Add New PDF Toolkit / Resource */}
  {addResourceModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141624] border border-[#d4af37]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ffd700]" />
            <span>{isArabic ? 'إضافة ملف PDF أو حقيبة تدريبية' : 'Add New PDF / Toolkit'}</span>
          </h3>
          <button 
            type="button" 
            onClick={() => setAddResourceModalOpen(false)}
            className="p-1 rounded-lg text-[#8a8d9a] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'عنوان الملف / الحقيبة (بالعربية)' : 'Title (Arabic)'}</label>
            <input
              type="text"
              value={newResTitleAr}
              onChange={e => setNewResTitleAr(e.target.value)}
              placeholder="مثال: الحقيبة التنفيذية لتقييم الجدارات الوظيفية (PDF)"
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'تصنيف الملف' : 'Category'}</label>
            <select
              value={newResCategoryAr}
              onChange={e => setNewResCategoryAr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none"
            >
              <option value="نماذج وأدوات الموارد البشرية">نماذج وأدوات الموارد البشرية</option>
              <option value="تقييم الأداء والمؤشرات">تقييم الأداء والمؤشرات</option>
              <option value="بروفايل الشركة والأعمال">بروفايل الشركة والأعمال</option>
              <option value="التدريب والتطوير المؤسسي">التدريب والتطوير المؤسسي</option>
              <option value="الرواتب والتعويضات">الرواتب والتعويضات</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'نوع التحميل' : 'Access Type'}</label>
              <select
                value={newResAccessType}
                onChange={e => setNewResAccessType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none"
              >
                <option value="free">تحميل مجاني مباشر</option>
                <option value="paid">حقيبة مدفوعة برسم</option>
              </select>
            </div>
            {newResAccessType === 'paid' && (
              <div>
                <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'السعر بالريال السعودي' : 'Price (SAR)'}</label>
                <input
                  type="number"
                  value={newResPrice}
                  onChange={e => setNewResPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none font-mono"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'وصف مختصر ومحتويات الملف' : 'Description'}</label>
            <textarea
              rows={3}
              value={newResDescAr}
              onChange={e => setNewResDescAr(e.target.value)}
              placeholder="وصف مختصر لأهمية الملف وكيف يفيد الشركات ومديري الموارد البشرية..."
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'المحاور الرئيسية (مفصولة بفاصلة)' : 'Topics'}</label>
            <input
              type="text"
              value={newResTopicsAr}
              onChange={e => setNewResTopicsAr(e.target.value)}
              placeholder="مصفوفة الجدارات، نماذج التقييم، دليل التطبيق"
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#d4af37] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setAddResourceModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/5 text-[#9ea3b5] hover:text-white text-xs font-semibold cursor-pointer"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!newResTitleAr.trim()) return;
              const newResource: DigitalResource = {
                id: `res-custom-${Date.now()}`,
                titleAr: newResTitleAr,
                titleEn: newResTitleEn || newResTitleAr,
                descriptionAr: newResDescAr || 'ملف وحقيبة تنفيذية معتمدة من مستشاري HR Navigator.',
                descriptionEn: newResDescAr || 'Executive toolkit from HR Navigator consultants.',
                categoryAr: newResCategoryAr,
                categoryEn: newResCategoryAr,
                accessType: newResAccessType,
                price: newResAccessType === 'free' ? 0 : Number(newResPrice) || 0,
                fileSize: '4.5 MB',
                pageCount: Number(newResPages) || 25,
                format: 'PDF',
                downloadsCount: 1,
                badgeAr: newResAccessType === 'free' ? 'تحميل مجاني' : 'حقيبة معتمدة',
                badgeEn: newResAccessType === 'free' ? 'Free Download' : 'Certified Toolkit',
                topicsAr: newResTopicsAr.split('،').map(s => s.trim()).filter(Boolean),
                topicsEn: newResTopicsAr.split('،').map(s => s.trim()).filter(Boolean)
              };
              onAddResource?.(newResource);
              setAddResourceModalOpen(false);
              setNewResTitleAr('');
              setNewResDescAr('');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
          >
            {isArabic ? 'حفظ وإضافة الملف فوراً' : 'Save & Publish File'}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Modal: Add New Social Post or Video */}
  {addSocialModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141624] border border-blue-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>{isArabic ? 'إضافة منشور أو فيديو من منصات التواصل' : 'Add Social Post or Video'}</span>
          </h3>
          <button 
            type="button" 
            onClick={() => setAddSocialModalOpen(false)}
            className="p-1 rounded-lg text-[#8a8d9a] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'المنصة' : 'Platform'}</label>
              <select
                value={newSocialPlatform}
                onChange={e => setNewSocialPlatform(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="whatsapp">مجتمع واتساب</option>
              </select>
            </div>
            <div>
              <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'نوع المحتوى' : 'Media Type'}</label>
              <select
                value={newSocialMediaType}
                onChange={e => setNewSocialMediaType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none"
              >
                <option value="article">مقال / تدوينة</option>
                <option value="video">فيديو / ريلز</option>
                <option value="infographic">انفوجرافيك وإحصائيات</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'رابط المنشور أو الفيديو' : 'Post or Video URL'}</label>
            <input
              type="url"
              value={newSocialUrl}
              onChange={e => setNewSocialUrl(e.target.value)}
              placeholder="https://www.linkedin.com/... أو https://youtu.be/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'عنوان المنشور / الفيديو' : 'Title'}</label>
            <input
              type="text"
              value={newSocialTitleAr}
              onChange={e => setNewSocialTitleAr(e.target.value)}
              placeholder="مثال: دليلك العملي لتقليل معدل دوران الموظفين في الشركات"
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'ملخص الفكرة أو محتوى الفيديو' : 'Summary'}</label>
            <textarea
              rows={3}
              value={newSocialSummaryAr}
              onChange={e => setNewSocialSummaryAr(e.target.value)}
              placeholder="ملخص يوضح أبرز النقاط التي يتناولها المنشور أو الفيديو..."
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[#c7cbd9] mb-1 font-semibold">{isArabic ? 'الوسم / التصنيف' : 'Tag'}</label>
            <input
              type="text"
              value={newSocialTagAr}
              onChange={e => setNewSocialTagAr(e.target.value)}
              placeholder="مثال: الهيكلة، الرواتب والأجور، استبقاء المواهب"
              className="w-full px-3 py-2 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-blue-400 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setAddSocialModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/5 text-[#9ea3b5] hover:text-white text-xs font-semibold cursor-pointer"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!newSocialTitleAr.trim() || !newSocialUrl.trim()) return;
              const newPost: SocialPost = {
                id: `post-custom-${Date.now()}`,
                platform: newSocialPlatform,
                mediaType: newSocialMediaType,
                titleAr: newSocialTitleAr,
                titleEn: newSocialTitleAr,
                summaryAr: newSocialSummaryAr || 'منشور ورؤية استشارية من خبراء HR Navigator.',
                summaryEn: newSocialSummaryAr || 'Consulting insight from HR Navigator experts.',
                postUrl: newSocialUrl,
                videoUrl: newSocialMediaType === 'video' ? newSocialUrl : undefined,
                likesCount: 15,
                sharesCount: 5,
                publishDate: new Date().toISOString().split('T')[0],
                tagAr: newSocialTagAr,
                tagEn: newSocialTagAr
              };
              onAddSocialPost?.(newPost);
              setAddSocialModalOpen(false);
              setNewSocialTitleAr('');
              setNewSocialSummaryAr('');
              setNewSocialUrl('');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
          >
            {isArabic ? 'إضافة ونشر الرابط فوراً' : 'Publish Link'}
          </button>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};
