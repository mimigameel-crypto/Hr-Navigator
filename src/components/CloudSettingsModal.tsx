import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Plus, 
  Check, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  Save, 
  Key, 
  Layers, 
  Copy, 
  ExternalLink,
  Database,
  Info
} from 'lucide-react';
import { CloudService, FirebaseConnectionConfig } from '../lib/cloudService';
import { Language } from '../types';

interface CloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isArabic = lang === 'ar';
  const [connections, setConnections] = useState<FirebaseConnectionConfig[]>([]);
  const [activeConnection, setActiveConnection] = useState<FirebaseConnectionConfig>(CloudService.getActiveConnection());
  const [selectedConnection, setSelectedConnection] = useState<FirebaseConnectionConfig | null>(null);
  const [isEditingNew, setIsEditingNew] = useState(false);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [notes, setNotes] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const list = CloudService.getConnections();
    const active = CloudService.getActiveConnection();
    setConnections(list);
    setActiveConnection(active);
    if (!selectedConnection && list.length > 0) {
      populateForm(active);
    }
  };

  const populateForm = (conn: FirebaseConnectionConfig) => {
    setSelectedConnection(conn);
    setIsEditingNew(false);
    setNameAr(conn.nameAr || '');
    setNameEn(conn.nameEn || '');
    setAccountEmail(conn.accountEmail || '');
    setProjectId(conn.projectId || '');
    setApiKey(conn.apiKey || '');
    setAuthDomain(conn.authDomain || '');
    setStorageBucket(conn.storageBucket || '');
    setMessagingSenderId(conn.messagingSenderId || '');
    setAppId(conn.appId || '');
    setNotes(conn.notes || '');
  };

  const startAddNew = () => {
    setIsEditingNew(true);
    setSelectedConnection(null);
    setNameAr(isArabic ? 'سحابة حسابي الثاني (Mimigameel82)' : 'Secondary Cloud (Mimigameel82)');
    setNameEn('Secondary Cloud (Mimigameel82)');
    setAccountEmail('Mimigameel82@gmail.com');
    setProjectId('hr-navigator-cloud-82');
    setApiKey(activeConnection.apiKey);
    setAuthDomain('hr-navigator-cloud-82.firebaseapp.com');
    setStorageBucket('hr-navigator-cloud-82.firebasestorage.app');
    setMessagingSenderId('495042743337');
    setAppId('1:495042743337:web:secondary82');
    setNotes(isArabic ? 'سحابة احتياطية وتخزين إضافي للحساب الثاني' : 'Secondary backup cloud for second account');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const configId = isEditingNew 
      ? `cloud_${Date.now()}` 
      : (selectedConnection ? selectedConnection.id : `cloud_${Date.now()}`);

    const newConfig: FirebaseConnectionConfig = {
      id: configId,
      nameAr: nameAr.trim() || 'سحابة Google مخصصة',
      nameEn: nameEn.trim() || 'Custom Google Cloud',
      accountEmail: accountEmail.trim(),
      projectId: projectId.trim(),
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.firebasestorage.app`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      notes: notes.trim(),
      isDefault: selectedConnection?.isDefault || false
    };

    CloudService.addOrUpdateConnection(newConfig);
    loadData();
    setSelectedConnection(newConfig);
    setIsEditingNew(false);

    setNotification(
      isArabic 
        ? 'تم حفظ تفاصيل اتصال السحابة بنجاح!' 
        : 'Cloud connection details saved successfully!'
    );
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (connections.length <= 1) {
      alert(isArabic ? 'لا يمكن حذف السحابة الوحيدة المتبقية' : 'Cannot delete the only connection');
      return;
    }
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا الاتصال السحابي؟' : 'Are you sure you want to delete this cloud connection?')) {
      CloudService.removeConnection(id);
      loadData();
      const remaining = CloudService.getConnections();
      if (remaining.length > 0) {
        populateForm(remaining[0]);
      }
    }
  };

  const handleSwitchToThis = (id: string) => {
    CloudService.switchConnection(id);
    setActiveConnection(CloudService.getActiveConnection());
    setNotification(
      isArabic ? 'تم التبديل إلى هذه السحابة بنجاح!' : 'Switched to this cloud target successfully!'
    );
    setTimeout(() => setNotification(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0c0e18] border border-white/15 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header with Google Brand Line */}
        <div className="bg-gradient-to-r from-[#121628] via-[#171d34] to-[#121628] p-5 sm:p-6 border-b border-white/10 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#4285F4]/20 border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {isArabic ? 'إعدادات وتعدد سحابات Firebase (Google Cloud)' : 'Multi-Cloud Firebase Connections Manager'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/30 text-[10px] text-[#60a5fa] font-bold">
                    Multi-Account
                  </span>
                </div>
                <p className="text-xs text-[#8a8d9a] mt-0.5">
                  {isArabic 
                    ? 'إدارة التبديل والربط بين حسابك الأول (mimigameel@gmail.com) وحسابك الثاني (Mimigameel82@gmail.com) أو أي سحابة مخصصة' 
                    : 'Switch and configure multiple Firebase projects seamlessly'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#8a8d9a] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification pill */}
        {notification && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Main Content: Left List, Right Form */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          
          {/* Left Column: Cloud Connections List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#c7cbd9] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isArabic ? 'السحابات المسجلة' : 'Registered Clouds'}</span>
              </span>
              <button
                type="button"
                onClick={startAddNew}
                className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-[#ffd700] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة سحابة' : 'Add Cloud'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {connections.map((c) => {
                const isActive = c.id === activeConnection.id;
                const isSelected = selectedConnection?.id === c.id && !isEditingNew;

                return (
                  <div
                    key={c.id}
                    onClick={() => populateForm(c)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left rtl:text-right ${
                      isSelected
                        ? 'bg-[#181d32] border-[#4285F4] shadow-[0_0_20px_rgba(66,133,244,0.2)]'
                        : 'bg-[#101320] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {isArabic ? c.nameAr : c.nameEn}
                          </h4>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                              {isArabic ? 'نشطة الآن' : 'Active'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#ffd700] font-mono mt-0.5 truncate">
                          {c.accountEmail}
                        </p>
                        <p className="text-[10px] text-[#8a8d9a] font-mono mt-0.5 truncate">
                          Project: {c.projectId}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSwitchToThis(c.id);
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold cursor-pointer transition-colors"
                            title={isArabic ? 'التبديل إلى هذه السحابة الآن' : 'Switch to this cloud'}
                          >
                            {isArabic ? 'تفعيل' : 'Activate'}
                          </button>
                        )}
                        {connections.length > 1 && !c.isDefault && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(c.id);
                            }}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-[#8a8d9a] hover:text-red-400 transition-colors cursor-pointer"
                            title={isArabic ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-[#121626] border border-blue-500/20 text-[11px] text-[#8a8d9a] leading-relaxed">
              <div className="text-white font-bold mb-1 flex items-center gap-1 text-xs">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>{isArabic ? 'كيف يعمل تعدد السحابات؟' : 'How Multi-Cloud Works'}</span>
              </div>
              {isArabic 
                ? 'يمكنك التبديل بين سحابة حسابك الأول أو الثاني في أي وقت. عند اختيار سحابة، سيتم توجيه جميع عمليات حفظ واسترجاع ومزامنة الطلبات والمؤشرات إليها مباشرة.'
                : 'Switching cloud targets redirects all read/write and snapshot sync queries to that specific Firebase project configuration.'}
            </div>
          </div>

          {/* Right Column: Connection Config Form */}
          <div className="lg:col-span-7 bg-[#101322] border border-white/10 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#ffd700]" />
                <h4 className="text-xs font-bold text-white">
                  {isEditingNew 
                    ? (isArabic ? 'إضافة اتصال سحابي جديد' : 'Add New Cloud Connection') 
                    : (isArabic ? 'تعديل تفاصيل اتصال السحابة' : 'Edit Cloud Connection Details')}
                </h4>
              </div>
              {selectedConnection && (
                <button
                  type="button"
                  onClick={() => handleSwitchToThis(selectedConnection.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedConnection.id === activeConnection.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#4285F4] hover:bg-[#3367d6] text-white shadow-md'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {selectedConnection.id === activeConnection.id 
                      ? (isArabic ? 'السحابة النشطة حالياً ✓' : 'Currently Active ✓') 
                      : (isArabic ? 'تعيين كسحابة نشطة' : 'Set as Active')}
                  </span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'اسم السحابة (بالعربية):' : 'Cloud Label (Arabic):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: سحابة الحساب الثاني"
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'اسم السحابة (بالإنجليزية):' : 'Cloud Label (English):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Secondary Cloud (Mimigameel82)"
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'البريد الإلكتروني المرتبط بالسحابة:' : 'Account Google Email:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="Mimigameel82@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#ffd700] text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'معرف المشروع (Firebase Project ID):' : 'Project ID:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="hr-navigator-cloud-82"
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cbd5e1] mb-1 font-semibold flex items-center justify-between">
                  <span>{isArabic ? 'مفتاح الويب (API Key):' : 'Firebase API Key:'}</span>
                  <span className="text-[10px] text-[#8a8d9a] font-mono">Client-side Safe</span>
                </label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'نطاق المصادقة (Auth Domain):' : 'Auth Domain:'}
                  </label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder={`${projectId || 'project-id'}.firebaseapp.com`}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cbd5e1] mb-1 font-semibold">
                    {isArabic ? 'معرف التطبيق (App ID):' : 'App ID:'}
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="1:495042743337:web:..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cbd5e1] mb-1 font-semibold">
                  {isArabic ? 'ملاحظات وصفية حول هذا الحساب السحابي:' : 'Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isArabic ? 'سحابة مخصصة للنسخ الاحتياطي ومتابعة الأعمال...' : 'Optional notes...'}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c14] border border-white/15 focus:border-[#4285F4] text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8a8d9a] hover:text-white transition-colors cursor-pointer"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>

                <button
                  id="btn-save-cloud-connection"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f26] text-black font-bold flex items-center gap-1.5 hover:brightness-110 shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isArabic ? 'حفظ إعدادات السحابة' : 'Save Connection'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
