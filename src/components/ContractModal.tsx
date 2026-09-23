import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  HardDrive, 
  Check, 
  Copy, 
  Shield, 
  FileText, 
  CheckCircle, 
  Scale, 
  Building2, 
  ExternalLink, 
  Eye, 
  Edit3,
  Maximize2
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { saveFileToGoogleDrive } from '../utils/googleDrive';
import { 
  downloadDocumentFile, 
  openDocumentInNewTab, 
  buildPrintableHtmlDocument,
  getDocumentBlobUrl 
} from '../utils/documentExporter';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  clientName?: string;
  serviceTitle?: string;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  lang,
  clientName = 'شركة العميل الموقر / الشريك الاستراتيجي',
  serviceTitle = 'مشروع إعادة الهيكلة الشاملة وتطوير رأس المال البشري'
}) => {
  if (!isOpen) return null;

  const isArabic = lang === 'ar';
  const t = translations[lang];

  const [savedToDrive, setSavedToDrive] = useState(false);
  const [isSavingDrive, setIsSavingDrive] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [customClient, setCustomClient] = useState(clientName);
  const [customProject, setCustomProject] = useState(serviceTitle);
  const [activeTab, setActiveTab] = useState<'iframe' | 'interactive'>('iframe');

  const contractDate = new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US');
  const contractNumber = `HRN-AGR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSaveToDrive = async () => {
    setIsSavingDrive(true);
    try {
      await saveFileToGoogleDrive(`Contract-Agreement-${contractNumber}.pdf`, 'contract');
      setSavedToDrive(true);
      setTimeout(() => setSavedToDrive(false), 3500);
    } finally {
      setIsSavingDrive(false);
    }
  };

  const getContractHtmlContent = () => {
    return `
      <div style="padding: 28px; border: 2px solid #d4af37; border-radius: 12px; background: #ffffff;">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 24px; border-bottom: 2px solid #eee; padding-bottom: 16px;">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 20px; font-weight: 900; color: #b8860b; letter-spacing: 1px;">HR NAVIGATOR</div>
              <div style="font-size: 13px; font-weight: bold; color: #333; margin-top: 4px;">استشارات الموارد البشرية وتطوير الأعمال وحوكمة رأس المال البشري</div>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">المملكة العربية السعودية • جمهورية مصر العربية • الشرق الأوسط</div>
              <div style="font-size: 11px; color: #b8860b; font-family: monospace; margin-top: 4px;">السجل التجاري: 1010482910 | الرقم الضريبي: 31094829100003</div>
            </td>
            <td style="text-align: ${isArabic ? 'left' : 'right'}; vertical-align: top;">
              <div style="font-size: 22px; font-weight: 900; color: #111;">عقد تقديم خدمات استشارية</div>
              <div style="font-size: 13px; color: #555; margin-top: 4px;">رقم العقد: <strong style="color: #b8860b;">${contractNumber}</strong></div>
              <div style="font-size: 12px; color: #555; margin-top: 2px;">تاريخ التحرير: <strong>${contractDate}</strong></div>
              <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">✓ صيغة قانونية معتمدة وفق المعايير التنظيمية</div>
            </td>
          </tr>
        </table>

        <!-- Contracting Parties -->
        <div style="background: #f9fafb; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <div style="font-size: 13px; font-weight: bold; color: #b8860b; margin-bottom: 8px;">أطراف التعاقد الرسمي:</div>
          <div style="font-size: 12px; color: #333; margin-bottom: 6px;">
            <strong>الطرف الأول (الاستشاري المُنفّذ):</strong> شركة HR Navigator للاستشارات الإدارية وتطوير رأس المال البشري.
          </div>
          <div style="font-size: 12px; color: #333;">
            <strong>الطرف الثاني (العميل / المنشأة المستفيدة):</strong> <strong>${customClient}</strong>.
          </div>
        </div>

        <!-- Clauses -->
        <div style="font-size: 13px; color: #333; line-height: 1.8;">
          <div style="margin-bottom: 14px;">
            <strong style="color: #b8860b;">البند الأول: موضوع التعاقد ونطاق العمل</strong>
            <p style="margin: 4px 0 0 0; color: #4b5563;">
              اتفق الطرفان على قيام الطرف الأول بتقديم أعمال الدعم والاستشارة المؤسسية وتطوير الموارد البشرية لمشروع: <strong>(${customProject})</strong>، وفق المنهجيات المعتمدة عالمياً ومعايير CIPD ومقتضيات الأنظمة واللوائح السارية.
            </p>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: #b8860b;">البند الثاني: المخرجات والتسليمات الميدانية (Deliverables)</strong>
            <ul style="margin: 4px 0 0 16px; padding: 0; color: #4b5563;">
              <li>إعداد التقرير التشخيصي الشامل للواقع الإداري وتحديد فجوات الأداء والمخاطر التنظيمية.</li>
              <li>تصميم الهياكل التنظيمية المعتمدة وبطاقات الوصف الوظيفي وسلالم الجدارات.</li>
              <li>صياغة لوائح العمل الداخلية وسياسات شؤون الموظفين المعتمدة.</li>
              <li>جلسات التوجيه التنفيذي (Advisory Debriefing) ونقل المعرفة لكوادر المنشأة.</li>
            </ul>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: #b8860b;">البند الثالث: الالتزام بالسرية وحماية المعلومات (NDA)</strong>
            <p style="margin: 4px 0 0 0; color: #4b5563;">
              يلتزم الطرف الأول بحفظ سرية تامة ومطلقة لكافة البيانات والمعلومات والخطط الاستراتيجية التي يطلع عليها أثناء تنفيذ العقد، ولا يجوز إفشاؤها لأي طرف ثالث دون موافقة كتابية مسبقة من الطرف الثاني.
            </p>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: #b8860b;">البند الرابع: المقابل المالي والفوترة الضريبية</strong>
            <p style="margin: 4px 0 0 0; color: #4b5563;">
              يتم سداد الأتعاب الاستشارية بموجب الفاتورة الضريبية الرسمية الإلكترونية الصادرة عن شركة HR Navigator والمعتمدة برمز QR ومتوافقة مع المعايير الضريبية (ZATCA).
            </p>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: #b8860b;">البند الخامس: الملكية الفكرية</strong>
            <p style="margin: 4px 0 0 0; color: #4b5563;">
              تؤول كافة المخرجات والنظم الإدارية المصممة خصيصاً للطرف الثاني إلى ملكيته الكاملة بمجرد اعتماد محضر التسليم النهائي وسداد كامل المستحقات المقررة.
            </p>
          </div>
        </div>

        <!-- Signatures & Seal -->
        <table style="width: 100%; margin-top: 28px; border-top: 2px solid #d4af37; padding-top: 20px;">
          <tr>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <div style="font-size: 13px; font-weight: bold; color: #b8860b; margin-bottom: 8px;">اعتماد الطرف الأول (HR Navigator)</div>
              <div style="display: inline-block; border: 2px dashed #b8860b; border-radius: 50%; width: 90px; height: 90px; line-height: 20px; padding-top: 15px; color: #b8860b; font-size: 10px; font-weight: bold;">
                HR NAVIGATOR<br>OFFICIAL SEAL<br>✓ VERIFIED
              </div>
              <div style="font-size: 11px; color: #555; margin-top: 6px;">الإدارة التنفيذية للاستشارات الإدارية</div>
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <div style="font-size: 13px; font-weight: bold; color: #111; margin-bottom: 8px;">اعتماد الطرف الثاني (العميل الشريك)</div>
              <div style="height: 90px; border-bottom: 1px dashed #999; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #888; font-style: italic;">
                (التوقيع والختم الرسمي للمنشأة)
              </div>
              <div style="font-size: 11px; color: #333; font-weight: bold; margin-top: 6px;">${customClient}</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  // Compile standalone HTML for the iframe preview
  const iframeDocumentSrcDoc = useMemo(() => {
    return buildPrintableHtmlDocument({
      title: `عقد تقديم خدمات استشارية - ${contractNumber}`,
      htmlContent: getContractHtmlContent(),
      isArabic
    });
  }, [customClient, customProject, isArabic, contractNumber, contractDate]);

  // Generate valid Blob URL for direct HTML anchor download & tab opening
  const documentBlobUrl = useMemo(() => {
    return getDocumentBlobUrl({
      title: `عقد تقديم خدمات استشارية - ${contractNumber}`,
      htmlContent: getContractHtmlContent(),
      isArabic
    });
  }, [customClient, customProject, isArabic, contractNumber, contractDate]);

  const contractDownloadFilename = `Contract-Agreement-${contractNumber}.html`;

  // Download PDF file or open printable document
  const handleDownloadContract = () => {
    downloadDocumentFile({
      filename: `Contract-Agreement-${contractNumber}`,
      title: `عقد تقديم خدمات استشارية - ${contractNumber} - HR Navigator`,
      htmlContent: getContractHtmlContent(),
      isArabic
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Open PDF in a new tab
  const handleOpenInNewTab = () => {
    openDocumentInNewTab({
      title: `عقد تقديم خدمات استشارية - ${contractNumber} - HR Navigator`,
      htmlContent: getContractHtmlContent(),
      isArabic
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textContent = `
عقد تقديم خدمات استشارية وتطوير الموارد البشرية
رقم العقد: ${contractNumber}
التاريخ: ${contractDate}

الطرف الأول: شركة HR Navigator للاستشارات الإدارية وتطوير رأس المال البشري
الطرف الثاني: ${customClient}
موضوع التعاقد: ${customProject}

البند الأول: موضوع التعاقد ونطاق العمل
اتفق الطرفان على قيام الطرف الأول بتقديم أعمال الدعم والاستشارة المؤسسية وتطوير الموارد البشرية لمشروع: (${customProject})، وفق المنهجيات المعتمدة ومعايير CIPD العالمية.

البند الثاني: المخرجات والتسليمات الميدانية
1. إعداد التقرير التشخيصي للواقع الإداري وتحديد فجوات الأداء والمخاطر التنظيمية.
2. تصميم الهياكل التنظيمية المعتمدة وبطاقات الوصف الوظيفي وسلالم الجدارات.
3. صياغة لوائح العمل الداخلية وسياسات شؤون الموظفين المعتمدة.
4. جلسات التوجيه التنفيذي (Advisory Debriefing) ونقل المعرفة لكوادر المنشأة.

البند الثالث: الالتزام بالسرية وحماية المعلومات (NDA)
يلتزم الطرف الأول بحفظ سرية تامة ومطلقة لكافة البيانات والمعلومات والخطط الاستراتيجية التي يطلع عليها.

البند الرابع: المقابل المالي والفوترة الضريبية
يتم سداد الأتعاب الاستشارية بموجب الفاتورة الضريبية الرسمية الإلكترونية الصادرة عن شركة HR Navigator.

البند الخامس: الملكية الفكرية
تؤول كافة المخرجات والنظم الإدارية المصممة خصيصاً للطرف الثاني إلى ملكيته الكاملة بمجرد اعتماد محضر التسليم النهائي وسداد المستحقات.
`;
    navigator.clipboard.writeText(textContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div
      id="contract-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white"
    >
      <div
        id="contract-modal-dialog"
        className="relative w-full max-w-5xl rounded-3xl bg-[#0b0d14] border border-[#d4af37]/40 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden my-auto max-h-[94vh] flex flex-col print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none"
      >
        {/* Top Gold Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411] print:hidden" />

        {/* Modal Action Header */}
        <div className="p-3.5 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#12141f] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {isArabic ? 'معاينة عقد تقديم الخدمات الاستشارية' : 'Consulting Agreement Review'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  {contractNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a]">
                {isArabic ? 'معاينة حية للمستند عبر iframe مع خيارات الفتح والتحميل في تبويب جديد' : 'Live iframe document preview with new-tab PDF viewer'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: iframe Document Preview vs Editable Interactive */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('iframe')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'iframe' 
                    ? 'bg-[#d4af37] text-black shadow-md' 
                    : 'text-[#8a8d9a] hover:text-white'
                }`}
                title="عرض المستند عبر iframe"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? 'معاينة المستند (iFrame)' : 'iFrame Preview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'interactive' 
                    ? 'bg-[#d4af37] text-black shadow-md' 
                    : 'text-[#8a8d9a] hover:text-white'
                }`}
                title="تعديل بيانات العقد"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تخصيص البيانات' : 'Customize'}</span>
              </button>
            </div>

            {/* Google Drive Save */}
            <button
              type="button"
              onClick={handleSaveToDrive}
              disabled={isSavingDrive}
              className="px-3 py-1.5 rounded-xl border border-[#4285F4]/40 bg-[#131726] hover:bg-[#1a2238] text-xs font-bold text-[#60a5fa] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              title="Google Drive"
            >
              {savedToDrive ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isArabic ? 'تم الحفظ' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span>{isSavingDrive ? (isArabic ? 'جارٍ...' : '...') : 'Drive'}</span>
                </>
              )}
            </button>

            {/* Copy Text */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedText ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}</span>
            </button>

            {/* Primary Action 1: Open PDF in New Tab */}
            <a
              id="btn-contract-open-tab"
              href={documentBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-xs font-bold text-[#ffd700] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-decoration-none"
              title={isArabic ? 'فتح ملف العقد في علامة تبويب جديدة كـ PDF جاهز للطباعة' : 'Open PDF in New Tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isArabic ? 'فتح في تبويب جديد (PDF)' : 'Open in New Tab (PDF)'}</span>
            </a>

            {/* Primary Action 2: Direct Download PDF Anchor */}
            <a
              id="btn-contract-download-file"
              href={documentBlobUrl}
              download={contractDownloadFilename}
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3500);
              }}
              className="px-4 py-1.5 rounded-xl border border-[#d4af37]/70 bg-gradient-to-r from-[#d4af37] to-[#b38f26] hover:brightness-110 text-xs font-bold text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md text-decoration-none"
              title={isArabic ? 'تحميل ملف العقد فوراً إلى جهازك' : 'Download Contract to Device'}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تم التحميل!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تحميل العقد (PDF)' : 'Download PDF'}</span>
                </>
              )}
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8a8d9a] hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Document Preview Area */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4 print:p-8 bg-[#090b10]">
          {/* Quick Customization Toolbar */}
          <div className="max-w-4xl mx-auto p-3 rounded-2xl bg-[#12141f] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#8a8d9a]">{isArabic ? 'اسم المنشأة المتعاقدة:' : 'Client:'}</span>
                <input
                  type="text"
                  value={customClient}
                  onChange={e => setCustomClient(e.target.value)}
                  className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-white text-xs font-bold focus:border-[#d4af37] outline-none min-w-[200px]"
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#8a8d9a]">{isArabic ? 'موضوع المشروع:' : 'Project:'}</span>
                <input
                  type="text"
                  value={customProject}
                  onChange={e => setCustomProject(e.target.value)}
                  className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-white text-xs font-bold focus:border-[#d4af37] outline-none min-w-[240px]"
                  placeholder="عنوان المشروع الاستشاري"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="text-[#ffd700] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer ml-auto"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{isArabic ? 'ملء الشاشة في تبويب جديد' : 'Full Screen'}</span>
            </button>
          </div>

          {/* Tab 1: Live iFrame Document Preview */}
          {activeTab === 'iframe' && (
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl bg-white">
              <div className="bg-gray-100 p-2 border-b border-gray-300 flex items-center justify-between text-xs text-gray-600 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-[11px] text-gray-500 mr-2">
                    {contractNumber}.pdf • معاينة رسمية حيّة
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenInNewTab}
                    className="text-xs font-bold text-[#b8860b] hover:text-[#886411] flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'فتح في تبويب مستقل' : 'Open in New Tab'}</span>
                  </button>
                </div>
              </div>
              <iframe
                id="contract-preview-iframe"
                srcDoc={iframeDocumentSrcDoc}
                title="معاينة نموذج العقد الرسمي"
                className="w-full h-[580px] border-none bg-white"
              />
            </div>
          )}

          {/* Tab 2: Interactive In-Page View with Direct Editing */}
          {activeTab === 'interactive' && (
            <div className="max-w-4xl mx-auto rounded-2xl bg-white text-gray-900 shadow-2xl p-6 sm:p-10 border border-gray-200 space-y-8" dir={isArabic ? 'rtl' : 'ltr'}>
              {/* Header Info with Brand Logo */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
                <div>
                  <BrandLogo lang={lang} size="md" />
                  <p className="text-xs text-gray-600 mt-2 max-w-sm font-serif">
                    {isArabic 
                      ? 'بيت الخبرة الإقليمي للاستشارات الإدارية وحوكمة رأس المال البشري' 
                      : 'Regional Executive House of HR Consulting & Strategic Governance'}
                  </p>
                  <p className="text-xs text-[#b8860b] font-mono font-bold mt-1">
                    CR: 1010482910 • {t.taxNumber}
                  </p>
                </div>

                <div className="text-right rtl:text-left ltr:text-right">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 font-serif block">
                    {isArabic ? 'عقد تقديم خدمات استشارية' : 'Consulting Services Agreement'}
                  </span>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold text-gray-800">{isArabic ? 'رقم العقد: ' : 'Ref: '}</span>
                    <span className="font-mono text-[#b8860b] font-bold">{contractNumber}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    <span>{isArabic ? 'تاريخ التحرير: ' : 'Date: '}</span>
                    <span className="font-mono font-semibold text-gray-800">{contractDate}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold mt-2">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{isArabic ? 'صيغة قانونية معتمدة' : 'Legally Approved Format'}</span>
                  </div>
                </div>
              </div>

              {/* Contracting Parties */}
              <div className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#b8860b] uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#b8860b]" />
                    <span>{isArabic ? 'أطراف التعاقد الرسمي' : 'Contracting Parties'}</span>
                  </h4>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-gray-400" />
                    {isArabic ? 'يمكنك تعديل اسم المنشأة والمشروع مباشرة' : 'Editable client & project'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <strong className="text-gray-900 block mb-1">
                      {isArabic ? 'الطرف الأول (الاستشاري المُنفّذ):' : 'First Party (Consultant):'}
                    </strong>
                    <div className="text-gray-700">
                      شركة <strong>HR Navigator للاستشارات الإدارية</strong>، ومقرها المسجل، ويمثلها في التوقيع الإدارة التنفيذية لقطاع الاستشارات.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <strong className="text-gray-900 block mb-1">
                      {isArabic ? 'الطرف الثاني (العميل / المنشأة المستفيدة):' : 'Second Party (Client):'}
                    </strong>
                    <input
                      type="text"
                      value={customClient}
                      onChange={e => setCustomClient(e.target.value)}
                      className="w-full bg-amber-50/50 border-b-2 border-[#d4af37] text-gray-900 font-bold text-xs py-1 px-1.5 rounded outline-none"
                      placeholder="اسم شركة العميل أو المؤسسة"
                    />
                    <div className="text-[11px] text-gray-500 mt-1">
                      {isArabic ? '(الطرف المستفيد من الخدمات الاستشارية والدراسات التنظيمية)' : '(Client beneficiary of consulting deliverables)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Clauses */}
              <div className="space-y-6 text-xs text-gray-800 leading-relaxed">
                {/* Clause 1 */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>{isArabic ? 'البند الأول: التمهيد ونطاق العمل الاستشاري' : 'Clause 1: Scope of Engagement'}</span>
                  </h5>
                  <p className="pr-7 rtl:pr-7 ltr:pl-7 text-gray-700">
                    {isArabic ? (
                      <>
                        اتفق الطرفان على قيام الطرف الأول بتقديم أعمال الدعم والاستشارة المؤسسية وتطوير الموارد البشرية لمشروع:
                        <input
                          type="text"
                          value={customProject}
                          onChange={e => setCustomProject(e.target.value)}
                          className="mx-1 px-1.5 py-0.5 rounded bg-amber-50 border-b border-[#d4af37] text-gray-900 font-bold outline-none"
                        />
                        ، وفق المنهجيات الاستشارية المعتمدة والمعايير التنظيمية الصادرة عن ممارسات CIPD العالمية ومتطلبات القوانين والأنظمة المعمول بها.
                      </>
                    ) : (
                      <>
                        The First Party agrees to deliver advisory consultancy, diagnostic assessment, and human capital governance for: <strong>({customProject})</strong> in full compliance with CIPD frameworks and statutory regulations.
                      </>
                    )}
                  </p>
                </div>

                {/* Clause 2 */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>{isArabic ? 'البند الثاني: المخرجات والتسليمات الميدانية (Deliverables)' : 'Clause 2: Deliverables & Milestones'}</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-1 pr-7 rtl:pr-7 ltr:pl-7 text-gray-700">
                    <li>{isArabic ? 'إعداد التقرير التشخيصي للواقع الإداري وتحديد فجوات الأداء والمخاطر التنظيمية.' : 'Comprehensive Diagnostic HR Audit and organizational gap analysis report.'}</li>
                    <li>{isArabic ? 'تصميم الهياكل التنظيمية المعتمدة وبطاقات الوصف الوظيفي وسلالم الجدارات.' : 'Approved organizational charts, job descriptions, and competency matrices.'}</li>
                    <li>{isArabic ? 'صياغة لوائح العمل الداخلية وسياسات شؤون الموظفين وفق الضوابط النظامية.' : 'Standard operational bylaws and HR governance policies aligned with labor regulations.'}</li>
                    <li>{isArabic ? 'جلسات التوجيه التنفيذي (Advisory Debriefing) ونقل المعرفة لكوادر المنشأة.' : 'Executive coaching and knowledge transfer sessions for internal staff.'}</li>
                  </ul>
                </div>

                {/* Clause 3 */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>{isArabic ? 'البند الثالث: الالتزام بالسرية وحماية المعلومات (NDA)' : 'Clause 3: Confidentiality & NDA'}</span>
                  </h5>
                  <p className="pr-7 rtl:pr-7 ltr:pl-7 text-gray-700">
                    {isArabic
                      ? 'يتعهد الطرف الأول بحفظ سرية تامة ومطلقة لكافة البيانات والوثائق والمعلومات المالية والتنظيمية وشؤون الموظفين التي يطلع عليها بحكم تنفيذ هذا العقد، ولا يجوز إفشاؤها لأي جهة أو طرف ثالث دون موافقة خطية صريحة مسبقة من الطرف الثاني.'
                      : 'The First Party covenants that all institutional records, organizational blueprints, payroll data, and trade secrets shall be preserved under strict non-disclosure obligations indefinitely.'}
                  </p>
                </div>

                {/* Clause 4 */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-mono font-bold">4</span>
                    <span>{isArabic ? 'البند الرابع: المقابل المالي والفوترة الضريبية' : 'Clause 4: Fees & Tax Invoicing'}</span>
                  </h5>
                  <p className="pr-7 rtl:pr-7 ltr:pl-7 text-gray-700">
                    {isArabic
                      ? 'يتم سداد الأتعاب الاستشارية بموجب الفاتورة الضريبية الرسمية الإلكترونية الصادرة عن شركة HR Navigator، والمعتمدة برمز الاستجابة السريع QR ومتوافقة مع المعايير الضريبية، وحسب جدول الدفعات المتفق عليه في عرض السعر المالي.'
                      : 'Advisory fees shall be disbursed against official electronic tax invoices issued by HR Navigator, compliant with ZATCA electronic billing standards and verified payment receipts.'}
                  </p>
                </div>

                {/* Clause 5 */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-mono font-bold">5</span>
                    <span>{isArabic ? 'البند الخامس: الملكية الفكرية ومحاضر الاستلام' : 'Clause 5: Intellectual Property & Final Sign-off'}</span>
                  </h5>
                  <p className="pr-7 rtl:pr-7 ltr:pl-7 text-gray-700">
                    {isArabic
                      ? 'تؤول كافة المخرجات والنظم الإدارية المصممة خصيصاً للطرف الثاني إلى ملكيته الكاملة بمجرد اعتماد محضر التسليم النهائي وسداد كامل المستحقات المقررة.'
                      : 'All custom deliverables and organizational documentation become the full property of the Second Party upon issuance of the final acceptance sign-off.'}
                  </p>
                </div>
              </div>

              {/* Official Signatures & Digital Stamp */}
              <div className="pt-6 border-t-2 border-[#d4af37] grid grid-cols-2 gap-8">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-3">
                  <span className="text-xs font-bold text-[#b8860b] block uppercase">
                    {isArabic ? 'اعتماد الطرف الأول (HR Navigator)' : 'First Party Authorized Signatory'}
                  </span>
                  <div className="py-2">
                    <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-[#b8860b] flex flex-col items-center justify-center text-[10px] text-[#b8860b] leading-tight">
                      <Shield className="w-5 h-5 mb-0.5" />
                      <span className="font-bold">HR NAVIGATOR</span>
                      <span className="text-[8px]">OFFICIAL SEAL</span>
                      <span className="text-[8px] font-mono">VERIFIED</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-700 font-semibold">
                    {isArabic ? 'الإدارة التنفيذية للاستشارات' : 'Executive Consulting Directorate'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-3">
                  <span className="text-xs font-bold text-gray-900 block uppercase">
                    {isArabic ? 'اعتماد الطرف الثاني (العميل الشريك)' : 'Second Party Authorized Signatory'}
                  </span>
                  <div className="h-24 flex flex-col items-center justify-center border-b border-dashed border-gray-400">
                    <span className="text-xs text-gray-500 italic">
                      {isArabic ? '(التوقيع والختم الرسمي للمنشأة)' : '(Signature & Corporate Seal)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-800 font-bold font-mono">
                    {customClient}
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-4 border-t border-gray-200 text-[10px] text-gray-500">
                {isArabic 
                  ? 'وثيقة تعاقد استشارية رسمية معتمدة صادرة عن منظومة HR Navigator للاستشارات الإدارية • صالحة للتحميل والطباعة والأرشفة السحابية' 
                  : 'Official Consulting Contract Agreement generated by HR Navigator System • Available for download, printing & cloud archiving'}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#12141f] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="text-[#8a8d9a] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ffd700]" />
            <span>{isArabic ? 'وثيقة تعاقدية رسمية ومحمية بأنظمة الحوكمة والسرية' : 'Official contractual document protected under governance'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#ffd700]" />
              <span>{isArabic ? 'طباعة مباشرة' : 'Direct Print'}</span>
            </button>

            <a
              id="btn-contract-footer-open-tab"
              href={documentBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] font-bold flex items-center gap-1.5 hover:bg-[#d4af37]/30 transition-all cursor-pointer text-decoration-none"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isArabic ? 'فتح في تبويب جديد (PDF)' : 'Open in New Tab'}</span>
            </a>

            <a
              id="btn-contract-footer-download"
              href={documentBlobUrl}
              download={contractDownloadFilename}
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3500);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f26] text-black font-bold flex items-center gap-1.5 hover:brightness-110 shadow-lg transition-all cursor-pointer text-decoration-none"
            >
              <Download className="w-4 h-4" />
              <span>{isArabic ? 'تنزيل العقد إلى الجهاز' : 'Download Document'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
