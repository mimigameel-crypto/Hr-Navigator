import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Download, 
  Share2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Search, 
  Filter, 
  Layers, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  Award, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Quote, 
  SlidersHorizontal,
  X,
  Maximize2
} from 'lucide-react';
import { Language } from '../types';
import { MAGAZINE_ISSUES, MagazineIssue, MagazineArticle } from '../data/magazineData';

interface MagazinePageViewProps {
  lang: Language;
  onBackToStore: () => void;
  onConsultationBook?: () => void;
}

export const MagazinePageView: React.FC<MagazinePageViewProps> = ({
  lang,
  onBackToStore,
  onConsultationBook
}) => {
  const isArabic = lang === 'ar';
  const issues = MAGAZINE_ISSUES;

  // Selected Issue & Article State
  const [selectedIssueId, setSelectedIssueId] = useState<string>(issues[0].id);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPdfReaderEmbed, setShowPdfReaderEmbed] = useState(false);

  // Active Issue
  const activeIssue = useMemo(() => {
    return issues.find(i => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  // Categories in Active Issue
  const categories = useMemo(() => {
    const set = new Set<string>();
    activeIssue.articles.forEach(a => {
      set.add(isArabic ? a.categoryAr : a.categoryEn);
    });
    return Array.from(set);
  }, [activeIssue, isArabic]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return activeIssue.articles.filter(article => {
      const cat = isArabic ? article.categoryAr : article.categoryEn;
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      const title = isArabic ? article.titleAr : article.titleEn;
      const highlight = isArabic ? article.highlightAr : article.highlightEn;
      const author = isArabic ? article.authorAr : article.authorEn;
      const matchesSearch = !searchQuery.trim() || 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeIssue, selectedCategory, searchQuery, isArabic]);

  // Active article being read
  const activeArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return activeIssue.articles.find(a => a.id === selectedArticleId) || null;
  }, [activeIssue, selectedArticleId]);

  const handleShareMagazine = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSelectNextArticle = () => {
    if (!activeArticle) return;
    const currentIndex = activeIssue.articles.findIndex(a => a.id === activeArticle.id);
    if (currentIndex < activeIssue.articles.length - 1) {
      setSelectedArticleId(activeIssue.articles[currentIndex + 1].id);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSelectPrevArticle = () => {
    if (!activeArticle) return;
    const currentIndex = activeIssue.articles.findIndex(a => a.id === activeArticle.id);
    if (currentIndex > 0) {
      setSelectedArticleId(activeIssue.articles[currentIndex - 1].id);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#cbd5e1] pb-24" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-20 z-30 bg-[#0c0e17]/95 border-b border-[#d4af37]/20 backdrop-blur-xl py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-[#9ea3b5] hover:text-[#ffd700] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isArabic ? 'العودة للمنصة الرئيسية' : 'Back to Store'}</span>
            </button>
            <span className="text-white/30">/</span>
            <span className="text-[#ffd700] font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مجلة HR Navigator التنفيذية' : 'Executive Advisory Magazine'}</span>
            </span>
            <span className="text-white/30 hidden sm:inline">/</span>
            <span className="text-white hidden sm:inline font-mono">
              {isArabic ? `العدد ${activeIssue.issueNumber}` : `Issue #${activeIssue.issueNumber}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareMagazine}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isArabic ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{isArabic ? 'مشاركة المجلة' : 'Share'}</span>
                </>
              )}
            </button>

            <a
              href="https://aistudio.google.com/u/1/apps/500e0d19-e33d-4ab8-94e8-d4e93f4c3a2e?showPreview=true&showAssistant=true&fullscreenApplet=true"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4285F4]/20 to-[#2563EB]/20 border border-[#4285F4]/50 hover:border-[#4285F4] text-[#60a5fa] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title={isArabic ? 'فتح تطبيق المجلة التفاعلي في نافذة كاملة' : 'Open Fullscreen Applet'}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="hidden sm:inline">{isArabic ? 'التطبيق التفاعلي السحابي' : 'Interactive Applet'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={activeIssue.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f26] hover:brightness-110 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تحميل النسخة الكاملة (PDF)' : 'Download PDF'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 border-b border-[#d4af37]/20 bg-gradient-to-b from-[#131627] via-[#0d0f1a] to-[#090a0f]">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            
            {/* Magazine Cover Visual Presentation */}
            <div className="w-full sm:w-80 flex-shrink-0 flex justify-center">
              <div className="relative group">
                {/* Book Spine Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] rounded-3xl blur opacity-35 group-hover:opacity-60 transition duration-500" />
                
                <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1b1e33] via-[#101220] to-[#090b14] border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-5 flex flex-col justify-between overflow-hidden">
                  {/* Top Branding */}
                  <div className="border-b border-[#d4af37]/30 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#d4af37] font-bold uppercase block">
                        HR NAVIGATOR
                      </span>
                      <span className="text-xs font-serif font-bold text-white">
                        EXECUTIVE REVIEW
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-[9px] font-mono font-bold">
                      ISSUE #{activeIssue.issueNumber}
                    </span>
                  </div>

                  {/* Center Cover Title */}
                  <div className="my-auto py-4 text-center">
                    <span className="text-[10px] text-[#9ea3b5] uppercase tracking-wider block mb-1">
                      {activeIssue.volume}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug gold-gradient-text font-serif">
                      {isArabic ? activeIssue.titleAr : activeIssue.titleEn}
                    </h2>
                    <p className="text-[11px] text-[#9ea3b5] mt-2 line-clamp-3 leading-relaxed">
                      {isArabic ? activeIssue.subtitleAr : activeIssue.subtitleEn}
                    </p>
                  </div>

                  {/* Cover Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8a8d9a]">
                    <span>{isArabic ? activeIssue.releaseDateAr : activeIssue.releaseDateEn}</span>
                    <span className="text-[#ffd700] font-mono">{activeIssue.pageCount} Pages • PDF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Description & Editorial Spotlight */}
            <div className="flex-1 space-y-5 text-center lg:text-start">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd700] text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'الإصدار المعتمد • متاح للجميع مجاناً' : 'Official Issue • 100% Free'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono">
                  {activeIssue.stats.readersCount.toLocaleString()} {isArabic ? 'قارئ تنفيذي' : 'Executive Readers'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  {activeIssue.stats.downloadsCount.toLocaleString()} {isArabic ? 'تحميل مباشر' : 'Downloads'}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {isArabic ? activeIssue.titleAr : activeIssue.titleEn}
                </h1>
                <p className="text-sm sm:text-base text-[#ffd700] mt-2 font-medium">
                  {isArabic ? activeIssue.subtitleAr : activeIssue.subtitleEn}
                </p>
              </div>

              {/* Editorial Message Quote */}
              <div className="p-4 rounded-2xl bg-[#111322]/80 border border-white/10 text-xs leading-relaxed relative">
                <Quote className="w-6 h-6 text-[#d4af37]/30 absolute top-2 end-2 pointer-events-none" />
                <p className="text-[#c7cbd9] italic">
                  "{isArabic ? activeIssue.editorialAr.messageAr : activeIssue.editorialEn.messageEn}"
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#ffd700]">
                    {isArabic ? activeIssue.editorialAr.editorNameAr : activeIssue.editorialEn.editorNameEn}
                  </span>
                  <span className="text-[#8a8d9a]">
                    {isArabic ? activeIssue.editorialAr.editorRoleAr : activeIssue.editorialEn.editorRoleEn}
                  </span>
                </div>
              </div>

              {/* Topics Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#8a8d9a] uppercase tracking-wider block">
                  {isArabic ? 'المحاور الرئيسية لهذا العدد:' : 'Key Pillars & Themes:'}
                </span>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {(isArabic ? activeIssue.topicsAr : activeIssue.topicsEn).map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-[#cbd5e1] font-medium"
                    >
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="https://aistudio.google.com/u/1/apps/500e0d19-e33d-4ab8-94e8-d4e93f4c3a2e?showPreview=true&showAssistant=true&fullscreenApplet=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563EB] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(66,133,244,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isArabic ? 'فتح تطبيق المجلة السحابي التفاعلي' : 'Open Live Interactive Applet'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={activeIssue.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isArabic ? 'قراءة وتحميل المجلة (PDF عبر Adobe)' : 'Read & Download PDF (Adobe)'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowPdfReaderEmbed(!showPdfReaderEmbed)}
                  className="px-5 py-3 rounded-xl bg-[#181b2e] hover:bg-[#20243d] border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#ffd700]" />
                  <span>{showPdfReaderEmbed ? (isArabic ? 'إخفاء عارض الـ PDF' : 'Hide PDF Reader') : (isArabic ? 'تصفح الـ PDF داخل الصفحة' : 'Preview PDF In-Page')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-Page PDF Reader Drawer / Frame (if toggled) */}
      {showPdfReaderEmbed && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          <div className="rounded-3xl bg-[#0e101a] border-2 border-[#d4af37]/40 shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ffd700]" />
                <span className="text-sm font-bold text-white">
                  {isArabic ? 'قارئ المستندات السحابي التفاعلي (Adobe Acrobat Cloud)' : 'Cloud Document Viewer (Adobe Acrobat Cloud)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeIssue.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#ffd700] transition-colors"
                  title={isArabic ? 'فتح بملء الشاشة في نافذة جديدة' : 'Open Full Screen'}
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setShowPdfReaderEmbed(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8a8d9a] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <iframe
                src={activeIssue.pdfUrl}
                title="HR Navigator Magazine Issue PDF"
                className="w-full h-full border-0"
                allow="fullscreen"
              />
            </div>
          </div>
        </section>
      )}

      {/* Issues Switcher Bar (Tabs for Editions) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 flex-wrap">
          <div>
            <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider block">
              {isArabic ? 'أرشيف وقائمة الإصدارات' : 'Issues Archive & Series'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {isArabic ? 'اختر إصدار المجلة للتصفح' : 'Select Magazine Edition'}
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {issues.map(iss => {
              const isSelected = iss.id === activeIssue.id;
              return (
                <button
                  key={iss.id}
                  type="button"
                  onClick={() => {
                    setSelectedIssueId(iss.id);
                    setSelectedArticleId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-extrabold'
                      : 'bg-[#131626] border border-white/10 text-[#9ea3b5] hover:text-white hover:border-[#d4af37]/40'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isArabic ? `العدد #${iss.issueNumber}` : `Issue #${iss.issueNumber}`}</span>
                  {iss.featured && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isArabic ? 'الأحدث' : 'Latest'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Article Reader Mode (If an article is selected) */}
      {activeArticle ? (
        <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-10">
          <div className="rounded-3xl bg-[#0e101a] border border-[#d4af37]/30 shadow-2xl p-6 sm:p-10 space-y-6 animate-fade-in">
            {/* Top article actions */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <button
                type="button"
                onClick={() => setSelectedArticleId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ffd700] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isArabic ? 'العودة لفهرس مقالات العدد' : 'Back to Articles Index'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8a8d9a] font-mono">
                  {isArabic ? `صفحة ${activeArticle.pageNumber}` : `Page ${activeArticle.pageNumber}`}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-[#ffd700]">
                  {isArabic ? activeArticle.readTimeAr : activeArticle.readTimeEn}
                </span>
              </div>
            </div>

            {/* Article Heading */}
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-xs font-bold inline-block">
                {isArabic ? activeArticle.categoryAr : activeArticle.categoryEn}
              </span>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight font-serif">
                {isArabic ? activeArticle.titleAr : activeArticle.titleEn}
              </h2>

              {/* Author & Practice byline */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isArabic ? activeArticle.authorAr : activeArticle.authorEn}
                  </div>
                  <div className="text-[11px] text-[#8a8d9a]">
                    {isArabic ? activeArticle.authorRoleAr : activeArticle.authorRoleEn}
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Highlight Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171a2e] to-[#121424] border-s-4 border-[#d4af37] text-sm text-[#ffd700] font-medium leading-relaxed italic shadow-inner">
              "{isArabic ? activeArticle.highlightAr : activeArticle.highlightEn}"
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#c7cbd9] leading-relaxed font-light">
              {(isArabic ? activeArticle.contentParagraphsAr : activeArticle.contentParagraphsEn).map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Takeaways Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121526] border border-emerald-500/30 space-y-3 mt-6">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{isArabic ? 'الخلاصة الاستشارية والتطبيق الميداني (Key Takeaways):' : 'Executive Key Takeaways:'}</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#e2e8f0]">
                {(isArabic ? activeArticle.keyTakeawaysAr : activeArticle.keyTakeawaysEn).map((item, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation to Next / Prev Article */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleSelectPrevArticle}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isArabic ? 'المقال السابق' : 'Previous Article'}</span>
              </button>

              <button
                type="button"
                onClick={handleSelectNextArticle}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{isArabic ? 'المقال التالي' : 'Next Article'}</span>
                {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Full Index & Articles Grid of Active Issue */
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#10121f] border border-white/10 mb-8 shadow-lg">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'text-[#9ea3b5] hover:text-white bg-white/5'
                }`}
              >
                {isArabic ? 'جميع المقالات والدراسات' : 'All Articles'} ({activeIssue.articles.length})
              </button>

              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37] text-black shadow'
                      : 'text-[#9ea3b5] hover:text-white bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-[#717688] absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث في موضوعات هذا العدد...' : 'Search articles in this issue...'}
                className="w-full py-2 px-9 rounded-xl bg-[#0a0b12] border border-white/10 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#d4af37]/60 transition-colors"
              />
            </div>
          </div>

          {/* Articles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  setSelectedArticleId(article.id);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-[#0e101a] hover:bg-[#121422] border border-white/10 hover:border-[#d4af37]/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#ffd700] font-semibold">
                      {isArabic ? article.categoryAr : article.categoryEn}
                    </span>
                    <span className="text-[#8a8d9a] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isArabic ? article.readTimeAr : article.readTimeEn}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#ffd700] transition-colors leading-snug font-serif">
                    {isArabic ? article.titleAr : article.titleEn}
                  </h3>

                  <p className="text-xs text-[#9ea3b5] line-clamp-3 leading-relaxed">
                    {isArabic ? article.contentParagraphsAr[0] : article.contentParagraphsEn[0]}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#c7cbd9] italic line-clamp-2">
                    "{isArabic ? article.highlightAr : article.highlightEn}"
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#8a8d9a]">
                    <User className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="font-medium text-white">{isArabic ? article.authorAr : article.authorEn}</span>
                    <span>•</span>
                    <span className="font-mono">{isArabic ? `ص ${article.pageNumber}` : `p. ${article.pageNumber}`}</span>
                  </div>

                  <span className="text-xs font-bold text-[#ffd700] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                    <span>{isArabic ? 'قراءة المقال' : 'Read Article'}</span>
                    {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Advisory Banner at Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#171b30] via-[#121526] to-[#0c0e18] border-2 border-[#d4af37]/40 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-xs font-bold inline-block">
              {isArabic ? 'هل تحتاج لاستشارة مخصصة لمنشأتك؟' : 'Need Custom Executive Advisory?'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isArabic ? 'حوّل المعرفة النظرية إلى نتائج تشغيلية ملموسة في شركتك' : 'Translate Insights into Measurable Organizational ROI'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3b5] max-w-2xl">
              {isArabic 
                ? 'فريق مستشاري HR Navigator يقدم جلسات استشارية تشخيصية لتطوير هياكل الرواتب، حوكمة الأداء، والتدقيق التنظيمي.' 
                : 'Our senior consulting practice provides hands-on diagnostic sessions for restructuring, comp & benefits, and performance systems.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {isArabic ? 'حجز جلسة استشارية تنفيذية' : 'Book Executive Advisory'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
