import React, { useState, useEffect } from 'react';
import { 
  X, 
  HardDrive, 
  Upload, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  FolderPlus, 
  ShieldCheck, 
  Sparkles,
  Download,
  Trash2
} from 'lucide-react';
import { Language } from '../types';
import { 
  GoogleDriveFile, 
  getStoredDriveFiles, 
  saveFileToGoogleDrive,
  GOOGLE_DRIVE_SCOPES 
} from '../utils/googleDrive';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isArabic = lang === 'ar';
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFiles(getStoredDriveFiles());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newFile = await saveFileToGoogleDrive(file.name, 'toolkit');
      setFiles(prev => [newFile, ...prev]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      id="google-drive-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="google-drive-modal-dialog"
        className="relative w-full max-w-2xl rounded-2xl bg-[#0e1017] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.2)] overflow-hidden my-8"
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#141824] border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4] shadow-md">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#162030] text-[#60a5fa] text-[11px] font-semibold border border-[#3b82f6]/30 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google Workspace Integration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                {isArabic ? 'سحابة ملفات Google Drive • HR Navigator' : 'Google Drive Cloud Storage • HR Navigator'}
              </h2>
            </div>
          </div>

          {/* Sync Status Banner */}
          <div className="p-4 rounded-xl bg-[#131726] border border-[#3b82f6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isArabic ? 'متصل بحساب Google Workspace' : 'Connected to Google Workspace'}</span>
              </div>
              <p className="text-[11px] text-[#9ea3b5]">
                {isArabic 
                  ? 'المجلد السحابي: My Drive / HR Navigator Consultations / Deliverables'
                  : 'Cloud Folder: My Drive / HR Navigator Consultations / Deliverables'}
              </p>
            </div>

            <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-bold transition-all shadow-[0_2px_10px_rgba(212,175,55,0.25)] flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? (isArabic ? 'جارٍ الرفع...' : 'Uploading...') : (isArabic ? 'رفع ملف إلى Drive' : 'Upload to Drive')}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleSimulateUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 mb-4 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'تم حفظ ومزامنة الملف بنجاح على Google Drive!' : 'File successfully saved and synced to Google Drive!'}</span>
            </div>
          )}

          {/* Files List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-[#ffd700] uppercase tracking-wider mb-2">
              {isArabic ? 'الملفات والمستندات المخزنة سحابياً:' : 'Files in HR Navigator Drive:'}
            </h3>
            {files.map(f => (
              <div 
                key={f.id}
                className="p-3 rounded-xl bg-[#121422] border border-white/5 hover:border-[#d4af37]/30 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#191c2e] flex items-center justify-center text-[#d4af37] flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {f.name}
                    </h4>
                    <p className="text-[10px] text-[#8a8d9a]">
                      {f.size} • {new Date(f.createdTime).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <a
                    href={f.webViewLink || 'https://drive.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#ffd700] transition-colors text-xs flex items-center gap-1"
                    title={isArabic ? 'فتح في Google Drive' : 'Open in Google Drive'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Scopes & Privacy info */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#787b8d]">
            <span>
              {isArabic ? 'تم تفعيل صلاحيات Google Drive بإذن معتمد.' : 'Google Drive API scopes enabled with permission.'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#d4af37] hover:underline"
            >
              {isArabic ? 'إغلاق النافذة' : 'Close Window'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
