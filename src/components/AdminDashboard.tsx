import React, { useState, useEffect } from 'react';
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
  BookOpen,
  GraduationCap,
  HardDrive,
  Folder,
  FolderPlus,
  Upload,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck,
  Cloud,
  Scale,
  Palette,
  Layers,
  Database,
  ArrowLeftRight,
  Settings
} from 'lucide-react';
import { Language, Order, OrderStatus, DigitalResource, SocialPost } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { BrandGuidelinesModal } from './BrandGuidelinesModal';
import { LocalStorageNoticeBanner } from './LocalStorageNoticeBanner';
import { CloudSwitcher } from './CloudSwitcher';
import { CloudSettingsModal } from './CloudSettingsModal';
import { CloudService, FirebaseConnectionConfig } from '../lib/cloudService';
import { currencies } from '../utils/currency';
import { 
  GoogleDriveFile, 
  getStoredDriveFiles, 
  saveFileToGoogleDrive, 
  GOOGLE_DRIVE_SCOPES 
} from '../utils/googleDrive';

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
  onOpenContractModal?: () => void;
  onViewSampleInvoice?: () => void;
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
  onDeleteSocialPost,
  onOpenContractModal,
  onViewSampleInvoice
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';

  const [adminTab, setAdminTab] = useState<'orders' | 'resources' | 'social' | 'drive' | 'cloud'>('orders');
  const [brandGuidelinesModalOpen, setBrandGuidelinesModalOpen] = useState(false);
  const [cloudSettingsModalOpen, setCloudSettingsModalOpen] = useState(false);
  const [activeCloudConnection, setActiveCloudConnection] = useState<FirebaseConnectionConfig>(CloudService.getActiveConnection());
  const [cloudConnectionsList, setCloudConnectionsList] = useState<FirebaseConnectionConfig[]>(CloudService.getConnections());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [copiedClientLink, setCopiedClientLink] = useState(false);
  const [copiedOwnerLink, setCopiedOwnerLink] = useState(false);

  // Google Drive Cloud Storage State
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [driveCategoryFilter, setDriveCategoryFilter] = useState<'all' | GoogleDriveFile['category']>('all');
  const [driveSearchTerm, setDriveSearchTerm] = useState('');
  const [isSyncingInvoices, setIsSyncingInvoices] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [addDriveModalOpen, setAddDriveModalOpen] = useState(false);
  const [newDriveFileName, setNewDriveFileName] = useState('');
  const [newDriveFileCategory, setNewDriveFileCategory] = useState<GoogleDriveFile['category']>('invoice');
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState(false);
  const [copiedDriveId, setCopiedDriveId] = useState<string | null>(null);

  useEffect(() => {
    setDriveFiles(getStoredDriveFiles());

    // Subscribe to cloud connection changes
    const unsub = CloudService.subscribe((conn) => {
      setActiveCloudConnection(conn);
      setCloudConnectionsList(CloudService.getConnections());
    });
    return () => unsub();
  }, []);

  const handleSyncAllInvoicesToDrive = async () => {
    setIsSyncingInvoices(true);
    try {
      const currentStored = getStoredDriveFiles();
      let newlySynced = 0;
      for (const order of orders) {
        const expectedName = `Invoice-${order.invoiceNumber}.pdf`;
        const alreadyExists = currentStored.some(f => f.name.toLowerCase() === expectedName.toLowerCase());
        if (!alreadyExists) {
          await saveFileToGoogleDrive(expectedName, 'invoice');
          newlySynced++;
        }
      }
      const updated = getStoredDriveFiles();
      setDriveFiles(updated);
      setSyncNotice(
        isArabic 
          ? `تمت مزامنة ${newlySynced > 0 ? newlySynced : 'جميع'} فواتير الحجوزات بنجاح إلى مجلد Google Drive!`
          : `Synced ${newlySynced > 0 ? newlySynced : 'all'} invoices successfully to Google Drive folder!`
      );
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncingInvoices(false);
    }
  };

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetCategory?: GoogleDriveFile['category']) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDrive(true);
    try {
      const cat = targetCategory || newDriveFileCategory;
      await saveFileToGoogleDrive(file.name, cat);
      setDriveFiles(getStoredDriveFiles());
      setSyncNotice(isArabic ? `تم رفع ملف "${file.name}" إلى مجلد Google Drive بنجاح!` : `Uploaded "${file.name}" to Google Drive successfully!`);
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const handleDriveFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveFileName.trim()) return;
    setIsUploadingDrive(true);
    try {
      await saveFileToGoogleDrive(newDriveFileName.trim(), newDriveFileCategory);
      setDriveFiles(getStoredDriveFiles());
      setDriveUploadSuccess(true);
      setTimeout(() => {
        setDriveUploadSuccess(false);
        setAddDriveModalOpen(false);
        setNewDriveFileName('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const handleDeleteDriveFile = (id: string) => {
    const remaining = driveFiles.filter(f => f.id !== id);
    setDriveFiles(remaining);
    try {
      localStorage.setItem('hrn_google_drive_files', JSON.stringify(remaining));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyDriveLink = (file: GoogleDriveFile) => {
    const link = file.webViewLink || 'https://drive.google.com';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    }
    setCopiedDriveId(file.id);
    setTimeout(() => setCopiedDriveId(null), 2500);
  };

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
          <button
            id="admin-btn-brand-guidelines"
            type="button"
            onClick={() => setBrandGuidelinesModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[#141624] border border-[#d4af37]/40 hover:bg-[#1c1f33] text-[#ffd700] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Palette className="w-4 h-4 text-[#ffd700]" />
            <span>{isArabic ? 'دليل وأصول الهوية البصرية' : 'Brand Identity & Guidelines'}</span>
          </button>

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

          {adminTab === 'drive' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="admin-btn-sync-invoices"
                type="button"
                onClick={handleSyncAllInvoicesToDrive}
                disabled={isSyncingInvoices}
                className="px-3.5 py-2.5 rounded-xl bg-[#131b2e] border border-[#4285F4]/40 hover:bg-[#1a253e] text-[#60a5fa] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingInvoices ? 'animate-spin text-[#4285F4]' : 'text-[#4285F4]'}`} />
                <span>{isSyncingInvoices ? (isArabic ? 'جارٍ المزامنة...' : 'Syncing...') : (isArabic ? 'مزامنة فواتير الحجوزات' : 'Sync Invoices')}</span>
              </button>

              <button
                id="admin-btn-upload-drive"
                type="button"
                onClick={() => setAddDriveModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563EB] text-white text-xs font-bold shadow-[0_2px_15px_rgba(66,133,244,0.35)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isArabic ? 'رفع مستند سحابي جديد' : 'Upload Cloud Doc'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sync Success Notification */}
      {syncNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* LocalStorage & Multi-Device Sync Explanation Banner */}
      <LocalStorageNoticeBanner lang={lang} />

      {/* CloudSwitcher: Multi-Account Firebase Management Bar */}
      <div className="mb-6">
        <CloudSwitcher 
          lang={lang} 
          onOpenSettings={() => setCloudSettingsModalOpen(true)}
        />
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

        <button
          id="admin-tab-google-drive"
          type="button"
          onClick={() => setAdminTab('drive')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'drive'
              ? 'bg-[#4285F4] text-white shadow-md'
              : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <HardDrive className="w-4 h-4 text-[#4285F4]" />
          <span>{isArabic ? 'سحابة Google Drive' : 'Google Drive Cloud'}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            adminTab === 'drive' ? 'bg-white/25 text-white' : 'bg-[#4285F4]/20 text-[#60a5fa]'
          }`}>
            {driveFiles.length}
          </span>
        </button>

        {/* Tab 5: Multi-Cloud Firebase Management */}
        <button
          id="admin-tab-cloud-management"
          type="button"
          onClick={() => setAdminTab('cloud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'cloud'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
              : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>{isArabic ? 'إدارة تعدد السحابات' : 'Multi-Cloud Manager'}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            adminTab === 'cloud' ? 'bg-black/30 text-black font-extrabold' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {cloudConnectionsList.length}
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

      {/* Official & Confidential Governance Documents (Admin Only) */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#141624] via-[#1a1c2e] to-[#121320] border border-[#d4af37]/35 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/15 text-[#ffd700]">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">
              {isArabic ? 'الوثائق والنماذج التعاقدية المعتمدة (حصرية للإدارة)' : 'Confidential Governance & Contract Templates'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {isArabic ? 'خاص بالملاك' : 'Owners Only'}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {isArabic ? 'نماذج عقود الاستشارات الإدارية والفوترة الضريبية الرسمية' : 'Executive Consulting Agreement & ZATCA Tax Invoicing'}
          </h4>
          <p className="text-xs text-[#9ea3b5] leading-relaxed">
            {isArabic 
              ? 'هذه النماذج محجوبة بالكامل عن الزوار والمشتركين لضمان سرية وحوكمة أعمال HR Navigator. يمكنك من هنا استخراج صيغة العقد، طباعتها أو تصديرها، ومعاينة المعايير الضريبية.' 
              : 'These legal frameworks are strictly confidential to leadership. Preview, generate printable PDF contracts with seals, or examine ZATCA e-invoicing templates.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {onOpenContractModal && (
            <button
              type="button"
              onClick={onOpenContractModal}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>{isArabic ? 'معاينة وطباعة عقد الاستشارات (PDF)' : 'Print Consulting Contract (PDF)'}</span>
            </button>
          )}

          {onViewSampleInvoice && (
            <button
              type="button"
              onClick={onViewSampleInvoice}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#161928] hover:bg-[#20243a] border border-[#d4af37]/30 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'معاينة نموذج الفاتورة الضريبية' : 'View Sample Tax Invoice'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setBrandGuidelinesModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#181528] hover:bg-[#231e3b] border border-purple-500/40 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>{isArabic ? 'دليل وأصول الهوية البصرية' : 'Brand Identity Kit'}</span>
          </button>
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
                        {order.isStudentOrder && (
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                              <GraduationCap className="w-3 h-3" />
                              <span>{isArabic ? 'طالب جامعي' : 'Student'}</span>
                            </span>
                            {order.studentIdCardUrl && (
                              <a
                                href={order.studentIdCardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-[#ffd700] hover:underline"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>{isArabic ? 'عرض الكارنيه' : 'View ID'}</span>
                              </a>
                            )}
                          </div>
                        )}
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

  {/* TAB 4: GOOGLE DRIVE CLOUD STORAGE (بوابة الملاك) */}
  {adminTab === 'drive' && (
    <div className="space-y-6">
      {/* Google Workspace Cloud Master Banner */}
      <div className="rounded-3xl bg-gradient-to-b from-[#131728] via-[#101320] to-[#0b0d17] border border-[#4285F4]/30 shadow-2xl overflow-hidden relative">
        {/* Google Signature Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#172036] border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4] shadow-[0_0_20px_rgba(66,133,244,0.25)] flex-shrink-0">
                <HardDrive className="w-8 h-8 text-[#4285F4]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/40 text-[10px] font-bold text-[#60a5fa]">
                    GOOGLE WORKSPACE DRIVE
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-[10px] font-bold text-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{isArabic ? 'سحابة الملاك متصلة ومؤمنة' : 'Cloud Connected'}</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {isArabic ? 'سحابة ملفات Google Drive • بوابة الملاك' : 'Google Drive Cloud Storage • Owners Portal'}
                </h3>
                <p className="text-xs text-[#9ea3b5] mt-1 font-mono">
                  {isArabic ? 'المجلد الرئيسي:' : 'Root Folder:'} <span className="text-[#ffd700]">My Drive / HR Navigator Consultations</span> • <span className="text-blue-300">hrnavigator.consult@gmail.com</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-[#4285F4]/40 bg-[#162038] hover:bg-[#1f2d4e] text-[#60a5fa] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-[#4285F4]" />
                <span>{isArabic ? 'فتح Google Drive' : 'Open in Google Drive'}</span>
              </a>

              <button
                type="button"
                onClick={handleSyncAllInvoicesToDrive}
                disabled={isSyncingInvoices}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingInvoices ? 'animate-spin' : ''}`} />
                <span>{isSyncingInvoices ? (isArabic ? 'جارٍ المزامنة...' : 'Syncing...') : (isArabic ? 'مزامنة فواتير الحجوزات السحابية' : 'Sync All Invoices')}</span>
              </button>
            </div>
          </div>

          {/* Cloud Storage Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#0c0e17] border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#9ea3b5]">{isArabic ? 'إجمالي الملفات' : 'Total Files'}</span>
                <HardDrive className="w-4 h-4 text-[#4285F4]" />
              </div>
              <span className="text-2xl font-bold text-white">{driveFiles.length}</span>
              <span className="text-[10px] text-[#717688] block mt-0.5">{isArabic ? 'ملف مؤمن على السحابة' : 'Cloud documents'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0e17] border border-amber-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-amber-400">{isArabic ? 'فواتير العملاء' : 'Invoices'}</span>
                <FileCheck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-bold text-amber-400">{driveFiles.filter(f => f.category === 'invoice').length}</span>
              <span className="text-[10px] text-[#717688] block mt-0.5">{isArabic ? 'فاتورة ضريبية رسمية' : 'Tax invoices'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0e17] border border-blue-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-400">{isArabic ? 'عروض وعقود' : 'Proposals & Contracts'}</span>
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {driveFiles.filter(f => f.category === 'proposal' || f.category === 'contract').length}
              </span>
              <span className="text-[10px] text-[#717688] block mt-0.5">{isArabic ? 'عقود ودراسات فنية' : 'Proposals & agreements'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0e17] border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-emerald-400">{isArabic ? 'سعة التخزين' : 'Storage Quota'}</span>
                <Cloud className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">3.8 / 15 GB</span>
              <span className="text-[10px] text-emerald-500/80 block mt-0.5">{isArabic ? 'سعة سحابية نشطة 100%' : '15 GB Workspace Cloud'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sub-Folders Tree */}
      <div className="p-5 rounded-2xl bg-[#10121d] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-[#ffd700]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isArabic ? 'المجلدات الفرعية داخل Google Drive (HR Navigator Consultations)' : 'Drive Sub-Folders'}
            </h4>
          </div>
          <span className="text-[11px] text-[#717688]">
            {isArabic ? 'انقر على أي مجلد لتصفية الوثائق تلقائياً' : 'Click any folder to filter'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => setDriveCategoryFilter('invoice')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
              driveCategoryFilter === 'invoice'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                : 'bg-[#151724] border-white/10 hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className="w-5 h-5 text-amber-400" />
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-[10px] font-bold">
                {driveFiles.filter(f => f.category === 'invoice').length}
              </span>
            </div>
            <div className="text-xs font-bold text-white">/Invoices/</div>
            <div className="text-[10px] text-[#8a8d9a] mt-0.5">{isArabic ? 'فواتير العملاء' : 'Customer Invoices'}</div>
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('proposal')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
              driveCategoryFilter === 'proposal'
                ? 'bg-blue-500/15 border-blue-500/50 shadow-md'
                : 'bg-[#151724] border-white/10 hover:border-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className="w-5 h-5 text-blue-400" />
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-blue-300 font-mono text-[10px] font-bold">
                {driveFiles.filter(f => f.category === 'proposal').length}
              </span>
            </div>
            <div className="text-xs font-bold text-white">/Proposals/</div>
            <div className="text-[10px] text-[#8a8d9a] mt-0.5">{isArabic ? 'عروض الأسعار والدراسات' : 'Custom Proposals'}</div>
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('contract')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
              driveCategoryFilter === 'contract'
                ? 'bg-purple-500/15 border-purple-500/50 shadow-md'
                : 'bg-[#151724] border-white/10 hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className="w-5 h-5 text-purple-400" />
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-purple-300 font-mono text-[10px] font-bold">
                {driveFiles.filter(f => f.category === 'contract').length}
              </span>
            </div>
            <div className="text-xs font-bold text-white">/Contracts/</div>
            <div className="text-[10px] text-[#8a8d9a] mt-0.5">{isArabic ? 'عقود التكليف والاتفاقيات' : 'Client Agreements'}</div>
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('toolkit')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
              driveCategoryFilter === 'toolkit'
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md'
                : 'bg-[#151724] border-white/10 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className="w-5 h-5 text-emerald-400" />
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-mono text-[10px] font-bold">
                {driveFiles.filter(f => f.category === 'toolkit').length}
              </span>
            </div>
            <div className="text-xs font-bold text-white">/Toolkits/</div>
            <div className="text-[10px] text-[#8a8d9a] mt-0.5">{isArabic ? 'حقائب العمل والأدلة' : 'HR Toolkits'}</div>
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('student_id')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
              driveCategoryFilter === 'student_id'
                ? 'bg-rose-500/15 border-rose-500/50 shadow-md'
                : 'bg-[#151724] border-white/10 hover:border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className="w-5 h-5 text-rose-400" />
              <span className="px-1.5 py-0.5 rounded bg-black/40 text-rose-300 font-mono text-[10px] font-bold">
                {driveFiles.filter(f => f.category === 'student_id').length}
              </span>
            </div>
            <div className="text-xs font-bold text-white">/Student_IDs/</div>
            <div className="text-[10px] text-[#8a8d9a] mt-0.5">{isArabic ? 'كارنيهات وإثباتات الطلبة' : 'Student IDs (45% Off)'}</div>
          </button>
        </div>
      </div>

      {/* Direct Cloud Upload Strip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#121626] to-[#141829] border border-[#4285F4]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4285F4]/20 border border-[#4285F4]/40 flex items-center justify-center text-[#60a5fa] flex-shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {isArabic ? 'رفع ملفات أو وثائق استشارية مباشرة إلى سحابة Google Drive' : 'Direct Upload to Google Drive'}
            </h4>
            <p className="text-[11px] text-[#8a8d9a]">
              {isArabic ? 'يدعم ملفات PDF، إكسل، وورد، والصور (حتى 50 ميجابايت)' : 'Supports PDF, Excel, Word, and Images up to 50MB'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingDrive ? (isArabic ? 'جارٍ الرفع...' : 'Uploading...') : (isArabic ? 'اختر ملفاً من جهازك' : 'Choose File')}</span>
            <input 
              type="file" 
              onChange={e => handleDirectFileUpload(e)}
              disabled={isUploadingDrive}
              className="hidden" 
            />
          </label>
          {onOpenContractModal && (
            <button
              type="button"
              onClick={onOpenContractModal}
              className="px-3.5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>{isArabic ? 'نموذج العقد المعتمد' : 'Contract Template'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setAddDriveModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 text-white text-xs font-semibold cursor-pointer"
          >
            {isArabic ? 'إضافة وثيقة باسم مخصص' : 'Custom Entry'}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[#717688]" />
          <input
            type="text"
            value={driveSearchTerm}
            onChange={e => setDriveSearchTerm(e.target.value)}
            placeholder={isArabic ? 'ابحث في ملفات ووثائق Google Drive...' : 'Search Google Drive documents...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 rounded-xl bg-[#0e101a] border border-white/10 text-xs text-white placeholder-[#717688] focus:border-[#4285F4] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setDriveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              driveCategoryFilter === 'all'
                ? 'bg-white/15 text-white border border-white/30'
                : 'text-[#8a8d9a] hover:text-white hover:bg-white/5'
            }`}
          >
            {isArabic ? 'كافة الوثائق' : 'All Documents'} ({driveFiles.length})
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('invoice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              driveCategoryFilter === 'invoice'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8a8d9a] hover:text-white hover:bg-white/5'
            }`}
          >
            {isArabic ? 'الفواتير' : 'Invoices'} ({driveFiles.filter(f => f.category === 'invoice').length})
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('proposal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              driveCategoryFilter === 'proposal'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-[#8a8d9a] hover:text-white hover:bg-white/5'
            }`}
          >
            {isArabic ? 'العروض الفنية' : 'Proposals'} ({driveFiles.filter(f => f.category === 'proposal').length})
          </button>

          <button
            type="button"
            onClick={() => setDriveCategoryFilter('toolkit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              driveCategoryFilter === 'toolkit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-[#8a8d9a] hover:text-white hover:bg-white/5'
            }`}
          >
            {isArabic ? 'الحقائب' : 'Toolkits'} ({driveFiles.filter(f => f.category === 'toolkit').length})
          </button>
        </div>
      </div>

      {/* Files Table / Cards */}
      <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
            <thead className="bg-[#141624] text-[#9ea3b5] uppercase text-[10px] tracking-wider border-b border-white/10 font-semibold">
              <tr>
                <th className="px-5 py-3.5">{isArabic ? 'اسم الوثيقة / المستند السحابي' : 'Document Name'}</th>
                <th className="px-4 py-3.5">{isArabic ? 'المجلد / التصنيف' : 'Category / Folder'}</th>
                <th className="px-4 py-3.5">{isArabic ? 'الحجم' : 'File Size'}</th>
                <th className="px-4 py-3.5">{isArabic ? 'تاريخ الحفظ' : 'Saved Date'}</th>
                <th className="px-4 py-3.5">{isArabic ? 'الحالة في Drive' : 'Status'}</th>
                <th className="px-5 py-3.5 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {driveFiles
                .filter(file => {
                  const matchesSearch = file.name.toLowerCase().includes(driveSearchTerm.toLowerCase());
                  const matchesCat = driveCategoryFilter === 'all' || file.category === driveCategoryFilter;
                  return matchesSearch && matchesCat;
                })
                .map((file) => {
                  const isPdf = file.name.endsWith('.pdf');
                  const isXls = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

                  const getCatBadge = (cat: GoogleDriveFile['category']) => {
                    switch (cat) {
                      case 'invoice':
                        return { label: isArabic ? 'فاتورة ضريبية' : 'Invoice', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
                      case 'proposal':
                        return { label: isArabic ? 'عرض أسعار مخصص' : 'Proposal', cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
                      case 'contract':
                        return { label: isArabic ? 'عقد تكليف' : 'Contract', cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
                      case 'toolkit':
                        return { label: isArabic ? 'حقيبة استشارية' : 'Toolkit', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
                      case 'student_id':
                        return { label: isArabic ? 'كارنيه طالب (خصم 45%)' : 'Student ID', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
                      default:
                        return { label: isArabic ? 'مستند سحابي' : 'Document', cls: 'bg-gray-500/15 text-gray-300 border-gray-500/30' };
                    }
                  };

                  const badge = getCatBadge(file.category);

                  return (
                    <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isPdf ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                            isXls ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}>
                            {isPdf ? <FileText className="w-4 h-4" /> : isXls ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs hover:text-[#60a5fa] transition-colors">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-[#717688] font-mono mt-0.5">
                              ID: {file.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-[#9ea3b5] font-mono text-xs">
                        {file.size || '1.2 MB'}
                      </td>

                      <td className="px-4 py-4 text-[#717688] text-xs font-mono">
                        {new Date(file.createdTime).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isArabic ? 'سحابي متزامن' : 'Synced'}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={file.webViewLink || 'https://drive.google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30 transition-all cursor-pointer"
                            title={isArabic ? 'فتح في Google Drive' : 'Open in Google Drive'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyDriveLink(file)}
                            className="p-1.5 rounded-lg text-[#ffd700] hover:text-white hover:bg-[#d4af37]/20 border border-transparent hover:border-[#d4af37]/30 transition-all cursor-pointer"
                            title={isArabic ? 'نسخ رابط السحابة' : 'Copy Cloud Link'}
                          >
                            {copiedDriveId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDriveFile(file.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                            title={isArabic ? 'حذف من السحابة' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {/* TAB 5: MULTI-CLOUD FIREBASE MANAGER (إدارة وتعدد السحابات) */}
  {adminTab === 'cloud' && (
    <div className="space-y-6">
      {/* Cloud Header Banner */}
      <div className="rounded-3xl bg-gradient-to-b from-[#161a2e] via-[#101322] to-[#0a0c16] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#ffd700] to-[#4285F4]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)] flex-shrink-0">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  MULTI-CLOUD FIREBASE ARCHITECTURE
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{isArabic ? 'جاهز ومتصل لحظياً' : 'Live Connected'}</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isArabic ? 'إدارة وتعدد السحابات • Firebase & Google Cloud' : 'Multi-Cloud Management • Firebase & Google Cloud'}
              </h3>
              <p className="text-xs text-[#9ea3b5] mt-1 font-mono">
                {isArabic ? 'السحابة النشطة حالياً:' : 'Active Target:'} <span className="text-[#ffd700] font-bold">{isArabic ? activeCloudConnection.nameAr : activeCloudConnection.nameEn}</span> • <span className="text-blue-300">{activeCloudConnection.accountEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-open-cloud-settings-modal"
              type="button"
              onClick={() => setCloudSettingsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f26] text-black text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>{isArabic ? 'إعدادات وإضافة سحابة جديدة' : 'Manage & Add Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Cloud Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#0e101a] border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8a8d9a]">{isArabic ? 'السحابات المسجلة' : 'Registered Clouds'}</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-white">{cloudConnectionsList.length}</span>
            <span className="text-[10px] text-[#717688] block mt-0.5">{isArabic ? 'حسابات Google Cloud / Firebase' : 'Target accounts configured'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e101a] border border-[#4285F4]/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#60a5fa]">{isArabic ? 'السحابة النشطة' : 'Active Connection'}</span>
              <Cloud className="w-4 h-4 text-[#4285F4]" />
            </div>
            <span className="text-sm font-bold text-white truncate block">{activeCloudConnection.accountEmail}</span>
            <span className="text-[10px] text-[#ffd700] block mt-0.5">{activeCloudConnection.projectId}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e101a] border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-emerald-400">{isArabic ? 'حالة التزامن اللحظي' : 'Real-time Sync'}</span>
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <span className="text-sm font-bold text-emerald-300">{isArabic ? 'مفعل وتلقائي' : 'Enabled & Active'}</span>
            <span className="text-[10px] text-[#717688] block mt-0.5">{isArabic ? 'Firestore Realtime Snapshots' : 'Live Document Listeners'}</span>
          </div>
        </div>
      </div>

      {/* Cloud Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cloudConnectionsList.map((conn) => {
          const isActive = conn.id === activeCloudConnection.id;
          return (
            <div
              key={conn.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive 
                  ? 'bg-gradient-to-b from-[#131728] to-[#0c0e18] border-[#4285F4] shadow-[0_0_30px_rgba(66,133,244,0.15)]' 
                  : 'bg-[#0f111e] border-white/10 hover:border-white/20'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-[#4285F4]" />
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                      conn.id.includes('82') 
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                        : 'bg-[#4285F4]/15 border-[#4285F4]/30 text-[#4285F4]'
                    }`}>
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isArabic ? conn.nameAr : conn.nameEn}
                      </h4>
                      <div className="text-xs text-[#ffd700] font-mono mt-0.5">
                        {conn.accountEmail}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isArabic ? 'متصل حالياً' : 'Active'}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        CloudService.switchConnection(conn.id);
                        setActiveCloudConnection(CloudService.getActiveConnection());
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{isArabic ? 'تبديل وتفعيل' : 'Activate'}</span>
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#080910] border border-white/5 space-y-1.5 my-3 text-xs font-mono">
                  <div className="flex justify-between text-[#8a8d9a]">
                    <span>Project ID:</span>
                    <span className="text-white">{conn.projectId}</span>
                  </div>
                  <div className="flex justify-between text-[#8a8d9a]">
                    <span>Auth Domain:</span>
                    <span className="text-[#60a5fa] truncate max-w-[190px]">{conn.authDomain}</span>
                  </div>
                  <div className="flex justify-between text-[#8a8d9a]">
                    <span>App ID:</span>
                    <span className="text-[#8a8d9a] truncate max-w-[190px]">{conn.appId}</span>
                  </div>
                </div>

                {conn.notes && (
                  <p className="text-xs text-[#8a8d9a] italic leading-relaxed">
                    "{conn.notes}"
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCloudSettingsModalOpen(true)}
                  className="text-xs text-[#ffd700] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تعديل تفاصيل الاتصال' : 'Edit Credentials'}</span>
                </button>

                {!isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      CloudService.switchConnection(conn.id);
                      setActiveCloudConnection(CloudService.getActiveConnection());
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    {isArabic ? 'استخدام هذه السحابة الآن' : 'Use this Cloud'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}
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
  {/* Modal: Add Document to Google Drive Cloud */}
  {addDriveModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141624] border border-[#4285F4]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#4285F4]" />
            <span>{isArabic ? 'رفع وثيقة جديدة إلى Google Drive' : 'Upload to Google Drive'}</span>
          </h3>
          <button 
            type="button" 
            onClick={() => setAddDriveModalOpen(false)}
            className="p-1 rounded-lg text-[#8a8d9a] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {driveUploadSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isArabic ? 'تم حفظ الوثيقة في السحابة بنجاح!' : 'Document Uploaded to Cloud!'}
            </h4>
            <p className="text-xs text-[#9ea3b5]">
              {isArabic ? 'تم إدراج الوثيقة في مجلد HR Navigator Consultations' : 'File has been placed in HR Navigator Consultations directory.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleDriveFileUpload} className="space-y-4 text-xs">
            {/* Folder selection */}
            <div>
              <label className="block text-[#c7cbd9] mb-1 font-semibold">
                {isArabic ? 'المجلد السحابي المستهدف في Drive' : 'Target Drive Folder'}
              </label>
              <select
                value={newDriveFileCategory}
                onChange={e => setNewDriveFileCategory(e.target.value as GoogleDriveFile['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#4285F4] outline-none"
              >
                <option value="invoice">{isArabic ? '📁 /Invoices/ - فواتير العملاء والضرائب' : '/Invoices/ - Customer Invoices'}</option>
                <option value="proposal">{isArabic ? '📁 /Proposals/ - عروض الأسعار والدراسات الفنية' : '/Proposals/ - Proposals'}</option>
                <option value="contract">{isArabic ? '📁 /Contracts/ - عقود التكليف والاتفاقيات' : '/Contracts/ - Client Contracts'}</option>
                <option value="toolkit">{isArabic ? '📁 /Toolkits/ - الحقائب التدريبية وأدلة العمل' : '/Toolkits/ - Toolkits'}</option>
                <option value="student_id">{isArabic ? '📁 /Student_IDs/ - كارنيهات الطلبة (خصم 45%)' : '/Student_IDs/ - Student IDs'}</option>
              </select>
            </div>

            {/* Direct Device Upload Option */}
            <div className="p-3.5 rounded-xl bg-[#0e101a] border border-dashed border-white/20 text-center">
              <label className="cursor-pointer block">
                <Upload className="w-6 h-6 mx-auto mb-1.5 text-[#4285F4]" />
                <span className="text-xs font-bold text-[#60a5fa] block">
                  {isArabic ? 'انقر لاختيار ملف من جهازك' : 'Choose file from your device'}
                </span>
                <span className="text-[10px] text-[#717688] block mt-0.5">
                  PDF, XLSX, DOCX, PNG, JPG (Max 50MB)
                </span>
                <input
                  type="file"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setNewDriveFileName(f.name);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* File Name input */}
            <div>
              <label className="block text-[#c7cbd9] mb-1 font-semibold">
                {isArabic ? 'اسم الملف السحابي' : 'Cloud File Name'}
              </label>
              <input
                type="text"
                value={newDriveFileName}
                onChange={e => setNewDriveFileName(e.target.value)}
                placeholder="مثال: Agreement-TechCorp-HR-Restructuring.pdf"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e101a] border border-white/10 text-white focus:border-[#4285F4] outline-none"
                required
              />
            </div>

            {/* Reassurance Info */}
            <div className="p-3 rounded-xl bg-[#131b2e] border border-[#4285F4]/30 text-[11px] text-[#93c5fd] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#4285F4] flex-shrink-0 mt-0.5" />
              <span>
                {isArabic 
                  ? 'سيتم تشفير وحفظ الوثيقة تلقائياً برقم تعريفي سحابي وربطها بحساب Google Workspace الخاص بشركة HR Navigator.'
                  : 'File will be automatically secured with a cloud ID in your HR Navigator Google Workspace drive.'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAddDriveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-[#9ea3b5] hover:text-white text-xs font-semibold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isUploadingDrive || !newDriveFileName.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563EB] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploadingDrive ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isArabic ? 'جارٍ الرفع للسحابة...' : 'Uploading to Cloud...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'حفظ ورفع إلى Drive' : 'Save to Drive'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )}
      {/* Official Brand Identity & Guidelines Modal */}
      <BrandGuidelinesModal
        lang={lang}
        isOpen={brandGuidelinesModalOpen}
        onClose={() => setBrandGuidelinesModalOpen(false)}
      />

      {/* Multi-Cloud Firebase Management & Settings Modal */}
      <CloudSettingsModal
        lang={lang}
        isOpen={cloudSettingsModalOpen}
        onClose={() => setCloudSettingsModalOpen(false)}
      />
    </div>
  );
};
