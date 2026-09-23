import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  Settings, 
  Sparkles, 
  Layers,
  ArrowLeftRight,
  Database
} from 'lucide-react';
import { CloudService, FirebaseConnectionConfig } from '../lib/cloudService';
import { Language } from '../types';

interface CloudSwitcherProps {
  lang: Language;
  onOpenSettings?: () => void;
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const CloudSwitcher: React.FC<CloudSwitcherProps> = ({
  lang,
  onOpenSettings,
  className = '',
  variant = 'compact'
}) => {
  const isArabic = lang === 'ar';
  const [connections, setConnections] = useState<FirebaseConnectionConfig[]>([]);
  const [activeConnection, setActiveConnection] = useState<FirebaseConnectionConfig>(CloudService.getActiveConnection());
  const [isOpen, setIsOpen] = useState(false);
  const [justSwitched, setJustSwitched] = useState(false);

  useEffect(() => {
    setConnections(CloudService.getConnections());
    setActiveConnection(CloudService.getActiveConnection());

    const unsubscribe = CloudService.subscribe((updated) => {
      setActiveConnection(updated);
      setConnections(CloudService.getConnections());
    });

    return () => unsubscribe();
  }, []);

  const handleSelect = (connectionId: string) => {
    if (connectionId === activeConnection.id) {
      setIsOpen(false);
      return;
    }

    const success = CloudService.switchConnection(connectionId);
    if (success) {
      setJustSwitched(true);
      setTimeout(() => setJustSwitched(false), 2500);
    }
    setIsOpen(false);
  };

  if (variant === 'pill') {
    return (
      <div className={`relative inline-block ${className}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121626] border border-[#4285F4]/40 hover:border-[#4285F4] text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
        >
          <Cloud className={`w-3.5 h-3.5 ${activeConnection.id.includes('82') ? 'text-amber-400' : 'text-[#4285F4]'}`} />
          <span className="text-[11px] max-w-[130px] truncate">
            {isArabic ? activeConnection.nameAr : activeConnection.nameEn}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <ChevronDown className={`w-3 h-3 text-[#8a8d9a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1.5 start-0 z-50 w-72 rounded-2xl bg-[#0e101a] border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.8)] p-2 backdrop-blur-xl">
            <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#8a8d9a] tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#4285F4]" />
                {isArabic ? 'تبديل اتصال السحابة' : 'Switch Cloud Target'}
              </span>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="text-[10px] text-[#ffd700] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Settings className="w-2.5 h-2.5" />
                  <span>{isArabic ? 'إدارة' : 'Manage'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              {connections.map((c) => {
                const isSelected = c.id === activeConnection.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className={`w-full p-2 rounded-xl text-left rtl:text-right flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#4285F4]/15 border border-[#4285F4]/40 text-white' 
                        : 'hover:bg-white/5 text-[#c7cbd9] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        c.id.includes('82') ? 'bg-amber-500/20 text-amber-400' : 'bg-[#4285F4]/20 text-[#4285F4]'
                      }`}>
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {isArabic ? c.nameAr : c.nameEn}
                        </div>
                        <div className="text-[10px] text-[#8a8d9a] font-mono truncate">
                          {c.accountEmail}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default compact or full card
  return (
    <div 
      className={`rounded-2xl bg-[#0e111d] border border-white/10 p-3.5 shadow-md ${className}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner flex-shrink-0 ${
            activeConnection.id.includes('82') 
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
              : 'bg-[#4285F4]/15 border-[#4285F4]/40 text-[#4285F4]'
          }`}>
            <Cloud className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {isArabic ? activeConnection.nameAr : activeConnection.nameEn}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-emerald-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>{isArabic ? 'سحابة نشطة' : 'Active'}</span>
              </span>
              {justSwitched && (
                <span className="px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 text-[9px] font-bold text-[#ffd700] animate-pulse">
                  {isArabic ? 'تم التبديل!' : 'Switched!'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8a8d9a] font-mono flex items-center gap-1.5 mt-0.5">
              <span>{activeConnection.accountEmail}</span>
              <span>•</span>
              <span className="text-[#c7cbd9]">{activeConnection.projectId}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="relative">
            <button
              id="btn-cloud-switcher-dropdown"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>{isArabic ? 'تبديل السحابة' : 'Switch'}</span>
              <ChevronDown className={`w-3 h-3 text-[#8a8d9a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute end-0 top-full mt-2 z-50 w-72 rounded-2xl bg-[#0c0e18] border border-white/20 shadow-2xl p-2.5 backdrop-blur-xl animate-fade-in">
                <div className="text-[10px] font-bold text-[#8a8d9a] uppercase px-2 py-1 mb-1 border-b border-white/10">
                  {isArabic ? 'السحابات المتاحة للاتصال' : 'Available Cloud Targets'}
                </div>

                <div className="space-y-1.5">
                  {connections.map((conn) => {
                    const isSelected = conn.id === activeConnection.id;
                    return (
                      <button
                        key={conn.id}
                        type="button"
                        onClick={() => handleSelect(conn.id)}
                        className={`w-full p-2.5 rounded-xl text-left rtl:text-right flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-white shadow-sm'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent text-[#cbd5e1]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>{isArabic ? conn.nameAr : conn.nameEn}</span>
                            {conn.isDefault && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#8a8d9a]">
                                {isArabic ? 'افتراضي' : 'Default'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8a8d9a] font-mono mt-0.5 truncate">
                            {conn.accountEmail}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#ffd700] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {onOpenSettings && (
            <button
              id="btn-cloud-settings-trigger"
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8a8d9a] hover:text-white transition-colors cursor-pointer"
              title={isArabic ? 'إعدادات وإضافة سحابات Firebase' : 'Cloud Connection Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
