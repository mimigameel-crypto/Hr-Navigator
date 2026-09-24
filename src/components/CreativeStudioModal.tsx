import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Video,
  Image as ImageIcon,
  Upload,
  Play,
  Download,
  RefreshCw,
  Film,
  Layers,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ratio,
  Maximize2,
  Share2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Zap,
  Sliders,
  History,
  Trash2
} from 'lucide-react';
import { Language } from '../types';
import {
  CreativeStudioApi,
  VideoGenParams,
  ImageGenParams
} from '../lib/creativeStudioApi';

interface CreativeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'image_to_video' | 'text_to_video' | 'create_image' | 'gallery';
  initialImage?: string | null;
}

interface GeneratedItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  prompt: string;
  mediaUrl: string;
  aspectRatio: string;
  model: string;
  timestamp: number;
}

const REASSURING_VIDEO_STEPS_AR = [
  'جارٍ الاتصال بنموذج Veo وتجهيز مسار المعالجة...',
  'جارٍ تحليل العناصر البصرية وهندسة المشهد الحركي...',
  'جارٍ محاكاة الفيزياء الحركية والإضاءة السينمائية الذهبية...',
  'جارٍ تصيير الإطارات بمعدل احترافي ودقة عالية...',
  'جارٍ تجميع الفيديو النهائي ووضعه في مسار التنزيل...',
];

const REASSURING_VIDEO_STEPS_EN = [
  'Connecting to Veo model and initializing video pipeline...',
  'Analyzing visual elements and composing motion dynamics...',
  'Simulating camera motion and cinematic golden reflections...',
  'Rendering video frames with high fidelity...',
  'Assembling final MP4 stream and preparing download...',
];

export const CreativeStudioModal: React.FC<CreativeStudioModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'image_to_video',
  initialImage = null,
}) => {
  const isArabic = lang === 'ar';

  // Tabs: 'image_to_video' (Veo 3.1) | 'text_to_video' (Veo 3.1 Fast) | 'create_image' (Gemini 3.1 Flash Image) | 'gallery'
  const [activeTab, setActiveTab] = useState<'image_to_video' | 'text_to_video' | 'create_image' | 'gallery'>(initialTab);

  // --- Image to Video States (Veo 3.1) ---
  const [imgToVidImage, setImgToVidImage] = useState<string | null>(initialImage);
  const [imgToVidPrompt, setImgToVidPrompt] = useState<string>('');
  const [imgToVidRatio, setImgToVidRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imgToVidResolution, setImgToVidResolution] = useState<'720p' | '1080p'>('720p');

  // --- Text to Video States (Veo 3.1 Fast) ---
  const [txtToVidPrompt, setTxtToVidPrompt] = useState<string>('');
  const [txtToVidRatio, setTxtToVidRatio] = useState<'16:9' | '9:16'>('16:9');
  const [txtToVidResolution, setTxtToVidResolution] = useState<'720p' | '1080p'>('720p');

  // --- Image Generation & Editing States (Gemini 3.1 Flash Image) ---
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageInputBase, setImageInputBase] = useState<string | null>(null);
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '512px'>('1K');

  // --- Generation Pipeline States ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [currentOperationName, setCurrentOperationName] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentResultMedia, setCurrentResultMedia] = useState<{
    type: 'video' | 'image';
    url: string;
    prompt: string;
    model: string;
    aspectRatio: string;
  } | null>(null);

  // --- Media Gallery (persisted in localStorage) ---
  const [galleryItems, setGalleryItems] = useState<GeneratedItem[]>(() => {
    try {
      const saved = localStorage.getItem('hrn_creative_gallery');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Polling ref to clear timers
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialImage) {
      setImgToVidImage(initialImage);
      setActiveTab('image_to_video');
    }
  }, [initialImage]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, []);

  const saveToGallery = (item: Omit<GeneratedItem, 'id' | 'timestamp'>) => {
    const newItem: GeneratedItem = {
      ...item,
      id: 'gen_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    try {
      localStorage.setItem('hrn_creative_gallery', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearGallery = () => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من مسح سجل الإبداعات؟' : 'Are you sure you want to clear media history?')) {
      setGalleryItems([]);
      localStorage.removeItem('hrn_creative_gallery');
    }
  };

  // -------------------------------------------------------------
  // Action 1: Animate Image into Video (Veo 3.1)
  // -------------------------------------------------------------
  const handleStartAnimateImage = async () => {
    if (!imgToVidImage) {
      setGenerationError(isArabic ? 'يرجى تحميل صورة أولاً لتحريكها إلى فيديو.' : 'Please upload an image first.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStepIndex(0);
    setCurrentResultMedia(null);

    // Animated reassuring messages every 6 seconds
    stepIntervalRef.current = setInterval(() => {
      setGenerationStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 6000);

    try {
      const response = await CreativeStudioApi.startVideoGeneration({
        mode: 'image_to_video',
        image: imgToVidImage,
        prompt: imgToVidPrompt || 'Cinematic fluid motion with natural camera parallax and soft golden corporate lighting',
        model: 'veo-3.1',
        aspectRatio: imgToVidRatio,
        resolution: imgToVidResolution,
      });

      setCurrentOperationName(response.operationName);
      startPollingVideo(response.operationName, imgToVidPrompt || 'Image Animation', 'veo-3.1', imgToVidRatio);
    } catch (err: any) {
      clearInterval(stepIntervalRef.current as NodeJS.Timeout);
      setIsGenerating(false);
      setGenerationError(err.message || 'فشل في بدء عملية تحريك الصورة.');
    }
  };

  // -------------------------------------------------------------
  // Action 2: Generate Video from Text (Veo 3.1 Fast)
  // -------------------------------------------------------------
  const handleStartTextToVideo = async () => {
    if (!txtToVidPrompt.trim()) {
      setGenerationError(isArabic ? 'يرجى كتابة وصف المشهد المراد توليده.' : 'Please enter a video prompt.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStepIndex(0);
    setCurrentResultMedia(null);

    stepIntervalRef.current = setInterval(() => {
      setGenerationStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 6000);

    try {
      const response = await CreativeStudioApi.startVideoGeneration({
        mode: 'text_to_video',
        prompt: txtToVidPrompt.trim(),
        model: 'veo-3.1-fast-generate-preview',
        aspectRatio: txtToVidRatio,
        resolution: txtToVidResolution,
      });

      setCurrentOperationName(response.operationName);
      startPollingVideo(response.operationName, txtToVidPrompt.trim(), 'veo-3.1-fast-generate-preview', txtToVidRatio);
    } catch (err: any) {
      clearInterval(stepIntervalRef.current as NodeJS.Timeout);
      setIsGenerating(false);
      setGenerationError(err.message || 'فشل في بدء توليد الفيديو من النص.');
    }
  };

  // -------------------------------------------------------------
  // Polling Mechanism for Veo Operations
  // -------------------------------------------------------------
  const startPollingVideo = (operationName: string, promptText: string, modelName: string, ratio: string) => {
    let attempts = 0;
    const maxAttempts = 75; // ~5 minutes max

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const status = await CreativeStudioApi.checkVideoStatus(operationName);

        if (status.done) {
          clearInterval(pollIntervalRef.current as NodeJS.Timeout);
          clearInterval(stepIntervalRef.current as NodeJS.Timeout);

          if (status.error) {
            setIsGenerating(false);
            setGenerationError(status.error.message || 'فشل نموذج Veo في استكمال توليد الفيديو.');
            return;
          }

          // Fetch downloaded video blob
          const { blobUrl } = await CreativeStudioApi.fetchVideoBlobUrl(operationName);
          setIsGenerating(false);
          const result = {
            type: 'video' as const,
            url: blobUrl,
            prompt: promptText,
            model: modelName,
            aspectRatio: ratio,
          };
          setCurrentResultMedia(result);
          saveToGallery({
            type: 'video',
            title: promptText.slice(0, 45) + '...',
            prompt: promptText,
            mediaUrl: blobUrl,
            aspectRatio: ratio,
            model: modelName,
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(pollIntervalRef.current as NodeJS.Timeout);
          clearInterval(stepIntervalRef.current as NodeJS.Timeout);
          setIsGenerating(false);
          setGenerationError(isArabic ? 'استغرقت العملية وقتاً أطول من المتوقع، يمكنك المحاولة لاحقاً.' : 'Video generation timed out.');
        }
      } catch (err: any) {
        console.warn('Polling check error:', err);
      }
    }, 4000);
  };

  // -------------------------------------------------------------
  // Action 3: Create & Edit Image (Gemini 3.1 Flash Image)
  // -------------------------------------------------------------
  const handleGenerateOrEditImage = async () => {
    if (!imagePrompt.trim()) {
      setGenerationError(isArabic ? 'يرجى كتابة وصف الصورة أو التعديل المطلوب.' : 'Please enter an image prompt.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setCurrentResultMedia(null);

    try {
      const response = await CreativeStudioApi.generateOrEditImage({
        prompt: imagePrompt.trim(),
        image: imageInputBase || undefined,
        aspectRatio: imageRatio,
        imageSize: imageSize,
        model: 'gemini-3.1-flash-image',
      });

      setIsGenerating(false);
      const result = {
        type: 'image' as const,
        url: response.imageUrl,
        prompt: imagePrompt.trim(),
        model: response.model || 'gemini-3.1-flash-image',
        aspectRatio: response.aspectRatio || imageRatio,
      };
      setCurrentResultMedia(result);
      saveToGallery({
        type: 'image',
        title: imagePrompt.slice(0, 45) + '...',
        prompt: imagePrompt,
        mediaUrl: response.imageUrl,
        aspectRatio: response.aspectRatio || imageRatio,
        model: response.model || 'gemini-3.1-flash-image',
      });
    } catch (err: any) {
      setIsGenerating(false);
      setGenerationError(err.message || 'فشل في توليد أو تعديل الصورة.');
    }
  };

  // File Upload Helper (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'imgToVid' | 'imgEdit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isArabic ? 'يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP).' : 'Please choose a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'imgToVid') {
          setImgToVidImage(reader.result);
        } else {
          setImageInputBase(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-5xl bg-[#0e0f17] border border-[#d4af37]/30 rounded-2xl sm:rounded-3xl shadow-[0_10px_50px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-[#d4af37]/20 bg-gradient-to-r from-[#141520] via-[#1a1b28] to-[#141520] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#c59b27] flex items-center justify-center text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Sparkles className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff] to-[#d4af37]">
                  {isArabic ? 'استوديو الإبداع والإنتاج المرئي للذكاء الاصطناعي' : 'AI Creative & Media Studio'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40">
                  Veo 3 & Gemini
                </span>
              </div>
              <p className="text-xs text-[#9ea3b5]">
                {isArabic
                  ? 'تحريك الصور بالذكاء الاصطناعي وإنتاج مقاطع الفيديو السينمائية والتصاميم الفاخرة لشركتك'
                  : 'Animate photos into cinematic videos and generate high-end corporate visuals'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9ea3b5] hover:text-[#ffd700] hover:bg-[#1f212f] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 bg-[#12131c] border-b border-[#d4af37]/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Tab 1: Animate Image into Video (Veo 3.1) */}
          <button
            type="button"
            onClick={() => setActiveTab('image_to_video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'image_to_video'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-[#9ea3b5] hover:text-white hover:bg-[#1a1b28]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{isArabic ? 'تحريك الصور إلى فيديو' : 'Animate Image to Video'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded font-semibold">Veo 3.1</span>
          </button>

          {/* Tab 2: Generate Video from Text (Veo 3.1 Fast) */}
          <button
            type="button"
            onClick={() => setActiveTab('text_to_video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'text_to_video'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-[#9ea3b5] hover:text-white hover:bg-[#1a1b28]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isArabic ? 'توليد فيديو من النص' : 'Generate Video from Text'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded font-semibold">Veo 3 Fast</span>
          </button>

          {/* Tab 3: Create & Edit Images (Gemini 3.1 Flash Image) */}
          <button
            type="button"
            onClick={() => setActiveTab('create_image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'create_image'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-[#9ea3b5] hover:text-white hover:bg-[#1a1b28]'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>{isArabic ? 'توليد وتعديل الصور' : 'Create & Edit Images'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded font-semibold">Gemini Flash</span>
          </button>

          {/* Tab 4: Media Gallery */}
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ms-auto ${
              activeTab === 'gallery'
                ? 'bg-[#d4af37]/25 text-[#ffd700] border border-[#d4af37]/40'
                : 'text-[#9ea3b5] hover:text-white hover:bg-[#1a1b28]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{isArabic ? 'المعرض والإنتاجات' : 'Media Gallery'}</span>
            {galleryItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] flex items-center justify-center font-bold">
                {galleryItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Error Banner */}
          {generationError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm flex-1">
                <p className="font-bold text-red-300">{isArabic ? 'تنبيه أثناء المعالجة' : 'Processing Error'}</p>
                <p>{generationError}</p>
              </div>
              <button
                onClick={() => setGenerationError(null)}
                className="text-red-400 hover:text-red-200 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Generation In-Progress Overlay/Card */}
          {isGenerating && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#161824] to-[#0f1019] border border-[#d4af37]/40 text-center space-y-4 shadow-lg">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37] animate-spin" />
                <Sparkles className="w-7 h-7 text-[#ffd700] animate-pulse" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {isArabic ? 'جارٍ المعالجة الإبداعية بالذكاء الاصطناعي...' : 'AI Creative Engine is Processing...'}
                </h4>
                <p className="text-xs sm:text-sm text-[#d4af37] mt-1 font-medium">
                  {isArabic
                    ? REASSURING_VIDEO_STEPS_AR[generationStepIndex]
                    : REASSURING_VIDEO_STEPS_EN[generationStepIndex]}
                </p>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      step <= generationStepIndex
                        ? 'w-8 bg-[#ffd700]'
                        : 'w-2 bg-[#2a2c3d]'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-[#787c91]">
                {isArabic
                  ? 'قد تستغرق معالجة الفيديو الدقيقة بضع لحظات لتوليد إطارات سينمائية بأعلى جودة وثبات فيزيائي.'
                  : 'High-fidelity cinematic rendering takes 30-90 seconds to simulate lighting and motion dynamics.'}
              </p>
            </div>
          )}

          {/* Current Generated Result Card */}
          {currentResultMedia && !isGenerating && (
            <div className="p-5 rounded-2xl bg-[#141624] border border-[#ffd700]/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-bold text-white">
                    {isArabic ? 'تم اكتمال الإنتاج بنجاح!' : 'Media Generated Successfully!'}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#ffd700] text-[10px] font-semibold border border-[#d4af37]/30">
                    {currentResultMedia.model}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1f2130] text-[#9ea3b5] text-[10px]">
                    {currentResultMedia.aspectRatio}
                  </span>
                </div>

                <a
                  href={currentResultMedia.url}
                  download={currentResultMedia.type === 'video' ? 'hr-navigator-veo.mp4' : 'hr-navigator-visual.png'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black text-xs font-bold hover:brightness-110 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تنزيل الملف' : 'Download'}</span>
                </a>
              </div>

              {/* Media Display */}
              <div className="flex justify-center bg-black/60 rounded-xl overflow-hidden p-2 border border-[#d4af37]/20">
                {currentResultMedia.type === 'video' ? (
                  <video
                    src={currentResultMedia.url}
                    controls
                    autoPlay
                    loop
                    className={`max-h-[420px] rounded-lg shadow-lg ${
                      currentResultMedia.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  />
                ) : (
                  <div className="relative group flex flex-col items-center">
                    <img
                      src={currentResultMedia.url}
                      alt={currentResultMedia.prompt}
                      className="max-h-[380px] object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImgToVidImage(currentResultMedia.url);
                        setActiveTab('image_to_video');
                      }}
                      className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black text-xs font-bold hover:scale-105 transition-all shadow-lg"
                    >
                      <Film className="w-4 h-4" />
                      <span>{isArabic ? 'تحويل هذه الصورة إلى فيديو عبر Veo 3.1 ↗' : 'Animate this image with Veo ↗'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-[#9ea3b5] flex items-center justify-between pt-1 border-t border-[#d4af37]/10">
                <span className="truncate max-w-[80%]">"{currentResultMedia.prompt}"</span>
                <button
                  onClick={() => setCurrentResultMedia(null)}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  {isArabic ? 'إغلاق المعاينة' : 'Close Preview'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Animate Images into Video (Veo 3.1) */}
          {activeTab === 'image_to_video' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#141522] border border-[#d4af37]/20 flex items-start gap-3">
                <Film className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
                <div className="text-xs text-[#a5a9bd] space-y-1">
                  <p className="font-bold text-white text-sm">
                    {isArabic ? 'تحريك الصور إلى فيديو عبر نموذج Veo 3.1' : 'Animate Images into Video via Veo 3.1'}
                  </p>
                  <p>
                    {isArabic
                      ? 'قم برفع أي صورة (شعار الشركة، بطاقة الموظف، لقطة مكتبية، بوستر تدريبي) وسيقوم نموذج Veo 3.1 بإنشاء حركة كاميرا سينمائية ثلاثية الأبعاد وإضاءة ديناميكية.'
                      : 'Upload any image (brand logo, executive portrait, office space, recruitment poster) and Veo 3.1 will synthesize realistic 3D camera motion and dynamics.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image Upload & Preview */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-white">
                    {isArabic ? '1. اختر الصورة المراد تحريكها (مطلوب)' : '1. Upload Image to Animate (Required)'}
                  </label>

                  {imgToVidImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 bg-black/40 group">
                      <img
                        src={imgToVidImage}
                        alt="Uploaded preview"
                        className="w-full h-56 object-contain bg-black/30"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-xs font-bold cursor-pointer hover:bg-white transition-colors">
                          {isArabic ? 'تغيير الصورة' : 'Change Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'imgToVid')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setImgToVidImage(null)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                        >
                          {isArabic ? 'حذف' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed border-[#d4af37]/40 hover:border-[#ffd700] bg-[#12131f]/50 hover:bg-[#161827] cursor-pointer transition-all p-6 text-center group">
                      <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 flex items-center justify-center text-[#ffd700] mb-3 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {isArabic ? 'اضغط لرفع صورة أو اسحبها هنا' : 'Click to upload or drag & drop'}
                      </p>
                      <p className="text-[11px] text-[#7e8296] mt-1">
                        PNG, JPG, WebP (بحد أقصى 10MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'imgToVid')}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Preset Template Images */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#8e92a8]">
                      {isArabic ? 'أو اختر من النماذج التنفيذية الجاهزة:' : 'Or choose an executive template:'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          nameAr: 'مكتب قيادي فخم',
                          nameEn: 'Luxury Office',
                          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                          nameAr: 'برج أعمال مضيء',
                          nameEn: 'Corporate Tower',
                          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                          nameAr: 'مجلس إدارة واستشارات',
                          nameEn: 'Boardroom Advisory',
                          url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
                        },
                      ].map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImgToVidImage(tpl.url)}
                          className="p-1.5 rounded-xl border border-[#d4af37]/20 bg-[#141520] hover:border-[#ffd700] text-start transition-all overflow-hidden flex flex-col items-center"
                        >
                          <img
                            src={tpl.url}
                            alt={tpl.nameAr}
                            className="w-full h-14 object-cover rounded-lg mb-1"
                          />
                          <span className="text-[10px] text-[#d4af37] truncate w-full text-center">
                            {isArabic ? tpl.nameAr : tpl.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Motion Controls & Aspect Ratio */}
                <div className="space-y-4">
                  {/* Motion Prompt */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? '2. توجيه الحركة وتفاصيل الكاميرا (اختياري)' : '2. Motion Prompt & Camera Direction (Optional)'}
                    </label>
                    <textarea
                      value={imgToVidPrompt}
                      onChange={(e) => setImgToVidPrompt(e.target.value)}
                      placeholder={
                        isArabic
                          ? 'مثال: تقريب سينمائي بطيء مع انعكاسات إضاءة ذهبية ناعمة وحركة واقعية...'
                          : 'E.g., Cinematic slow zoom with glowing golden ambient lighting and dynamic camera parallax...'
                      }
                      rows={3}
                      className="w-full p-3 rounded-xl bg-[#12131f] border border-[#d4af37]/30 focus:border-[#ffd700] text-xs sm:text-sm text-white placeholder-[#5a5e74] focus:outline-none"
                    />

                    {/* Quick Motion Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { ar: 'تقريب سينمائي بطيء', en: 'Cinematic Slow Zoom' },
                        { ar: 'تحريك جانبي بانورامي', en: 'Smooth Panning' },
                        { ar: 'إضاءة ذهبية متلألئة', en: 'Golden Glimmer' },
                        { ar: 'حركة ثلاثية الأبعاد درامية', en: 'Dramatic 3D Orbit' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImgToVidPrompt((prev) => (prev ? prev + ' - ' + (isArabic ? preset.ar : preset.en) : (isArabic ? preset.ar : preset.en)))}
                          className="px-2 py-1 rounded-lg bg-[#181926] border border-[#d4af37]/20 text-[11px] text-[#ffd700] hover:bg-[#d4af37]/20 transition-colors"
                        >
                          + {isArabic ? preset.ar : preset.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Selector (16:9 vs 9:16) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? '3. أبعاد الفيديو (Aspect Ratio)' : '3. Video Aspect Ratio'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setImgToVidRatio('16:9')}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                          imgToVidRatio === '16:9'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700] shadow-sm'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-3.5 border border-current rounded-sm" />
                          <span>16:9 (Landscape)</span>
                        </div>
                        <span className="text-[10px] text-[#ffd700]">{isArabic ? 'يوتيوب / موقع' : 'YouTube / Web'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImgToVidRatio('9:16')}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                          imgToVidRatio === '9:16'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700] shadow-sm'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-6 border border-current rounded-sm" />
                          <span>9:16 (Portrait)</span>
                        </div>
                        <span className="text-[10px] text-[#ffd700]">{isArabic ? 'ريلز / تيك توك' : 'Reels / Shorts'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Resolution Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? '4. دقة الفيديو' : '4. Video Resolution'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setImgToVidResolution('720p')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          imgToVidResolution === '720p'
                            ? 'bg-[#d4af37]/20 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#8e92a8]'
                        }`}
                      >
                        720p HD ({isArabic ? 'سريع ومستقر' : 'Fast & Stable'})
                      </button>
                      <button
                        type="button"
                        onClick={() => setImgToVidResolution('1080p')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          imgToVidResolution === '1080p'
                            ? 'bg-[#d4af37]/20 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#8e92a8]'
                        }`}
                      >
                        1080p Full HD ({isArabic ? 'فائق الوضوح' : 'High Quality'})
                      </button>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="button"
                    disabled={isGenerating || !imgToVidImage}
                    onClick={handleStartAnimateImage}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b3891d] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    <span>
                      {isGenerating
                        ? (isArabic ? 'جارٍ تحريك الصورة عبر Veo 3.1...' : 'Generating Video with Veo 3.1...')
                        : (isArabic ? 'بدء تحريك الصورة إلى فيديو (Veo 3.1)' : 'Animate Image with Veo 3.1')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Generate Video from Text (Veo 3.1 Fast) */}
          {activeTab === 'text_to_video' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#141522] border border-[#d4af37]/20 flex items-start gap-3">
                <Video className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
                <div className="text-xs text-[#a5a9bd] space-y-1">
                  <p className="font-bold text-white text-sm">
                    {isArabic
                      ? 'توليد مقاطع فيديو سينمائية من النص عبر نموذج Veo 3 Fast'
                      : 'Generate Video from Text via Veo 3 Fast (veo-3.1-fast-generate-preview)'}
                  </p>
                  <p>
                    {isArabic
                      ? 'اكتب فكرة المشهد الإعلاني أو المؤسسي وسيقوم نموذج Veo 3 Fast بإنشاء فيديو عالي الدقة بنسبة 16:9 أو 9:16 مع إضاءة فخمة وحركات كاميرا سلسة.'
                      : 'Describe your corporate or marketing vision, and Veo 3 Fast will generate high-quality video in 16:9 or 9:16 aspect ratio.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Prompt Textarea */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white">
                    {isArabic ? '1. وصف المشهد المراد إنتاجه (Prompt)' : '1. Video Scene Description (Prompt)'}
                  </label>
                  <textarea
                    value={txtToVidPrompt}
                    onChange={(e) => setTxtToVidPrompt(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'اكتب وصفاً مفصلاً للمشهد: المكان، الإضاءة، حركة الكاميرا، والأجواء المؤسسية الفاخرة...'
                        : 'Describe the scene in detail: environment, lighting, camera movement, corporate atmosphere...'
                    }
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-[#12131f] border border-[#d4af37]/30 focus:border-[#ffd700] text-xs sm:text-sm text-white placeholder-[#5a5e74] focus:outline-none"
                  />
                </div>

                {/* Preset Prompts for Corporate & HR Consulting */}
                <div className="space-y-2">
                  <span className="text-[11px] text-[#8e92a8]">
                    {isArabic ? 'أفكار مقترحة لشركة HR Navigator Consultations:' : 'Suggested HR Navigator Prompts:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      {
                        titleAr: 'إعلان قمة القيادة والتطوير المؤسسي 2026',
                        titleEn: 'HR Leadership Summit 2026 Announcement',
                        prompt: 'Cinematic corporate teaser: Executive leaders in a luxury boardroom overlooking city skyline at golden hour, discussing strategies, golden lighting reflections, 4k ultra realism',
                      },
                      {
                        titleAr: 'برومو إطلاق مجلة HR Navigator التنفيذية',
                        titleEn: 'Executive Magazine Launch Promo',
                        prompt: '3D magazine pages turning smoothly with golden foil text "HR Navigator Executive", floating in modern glass studio with warm amber cinematic lights',
                      },
                      {
                        titleAr: 'فيديو ريلز لجذب المواهب والتوظيف الاستراتيجي',
                        titleEn: 'Talent Acquisition & Recruitment Reel',
                        prompt: 'Energetic modern corporate reel: talented professionals collaborating around interactive digital display, confident smiles, vibrant golden and navy blue ambiance',
                      },
                      {
                        titleAr: 'مقر استشاري فاخر وبرج أعمال مع شمس الصباح',
                        titleEn: 'Luxury Skyscraper & Morning Sun',
                        prompt: 'Majestic drone shot ascending a modern glass corporate skyscraper as the morning sun reveals gleaming golden architecture, smooth cinematic flight',
                      },
                    ].map((idea, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTxtToVidPrompt(idea.prompt)}
                        className="p-2.5 rounded-xl border border-[#d4af37]/20 bg-[#131520] hover:border-[#ffd700] text-start transition-all flex flex-col gap-1 group"
                      >
                        <span className="text-xs font-bold text-[#ffd700] group-hover:underline">
                          {isArabic ? idea.titleAr : idea.titleEn}
                        </span>
                        <span className="text-[11px] text-[#7e8297] line-clamp-1">
                          {idea.prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio & Resolution Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Aspect Ratio */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? '2. نسبة الأبعاد (مطلوب 16:9 أو 9:16)' : '2. Aspect Ratio (16:9 or 9:16)'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTxtToVidRatio('16:9')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          txtToVidRatio === '16:9'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5]'
                        }`}
                      >
                        <div className="w-5 h-3 border border-current rounded-sm" />
                        <span>16:9 Landscape</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTxtToVidRatio('9:16')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          txtToVidRatio === '9:16'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5]'
                        }`}
                      >
                        <div className="w-3 h-5 border border-current rounded-sm" />
                        <span>9:16 Portrait</span>
                      </button>
                    </div>
                  </div>

                  {/* Resolution */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? '3. جودة التصيير' : '3. Quality'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTxtToVidResolution('720p')}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          txtToVidResolution === '720p'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5]'
                        }`}
                      >
                        720p Fast
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxtToVidResolution('1080p')}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          txtToVidResolution === '1080p'
                            ? 'bg-[#d4af37]/25 border-[#ffd700] text-[#ffd700]'
                            : 'bg-[#141522] border-[#25283b] text-[#9ea3b5]'
                        }`}
                      >
                        1080p Full HD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="button"
                  disabled={isGenerating || !txtToVidPrompt.trim()}
                  onClick={handleStartTextToVideo}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b3891d] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
                >
                  <Video className="w-4 h-4" />
                  <span>
                    {isGenerating
                      ? (isArabic ? 'جارٍ التوليد عبر Veo 3 Fast...' : 'Generating with Veo 3 Fast...')
                      : (isArabic ? 'بدء توليد الفيديو (Veo 3 Fast Preview)' : 'Generate Video (Veo 3 Fast Preview)')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Create & Edit Images (Gemini 3.1 Flash Image) */}
          {activeTab === 'create_image' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#141522] border border-[#d4af37]/20 flex items-start gap-3">
                <Wand2 className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
                <div className="text-xs text-[#a5a9bd] space-y-1">
                  <p className="font-bold text-white text-sm">
                    {isArabic
                      ? 'استوديو توليد وتعديل الصور عبر Gemini 3.1 Flash Image'
                      : 'Generate & Edit Images with Gemini 3.1 Flash Image'}
                  </p>
                  <p>
                    {isArabic
                      ? 'قم بتوليد تصاميم وصور فائقة الجودة لعلامتك التجارية، أو ارفع صورة موجودة لتعديلها وإضافة لمسات ذهبية وهوية مؤسسية، مع إمكانية تحويل أي صورة مباشرةً إلى فيديو بضغطة زر.'
                      : 'Create brand visuals or edit existing photos with precise prompts, then animate them into videos directly via Veo.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Optional Base Image for Editing */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">
                      {isArabic ? 'صورة أساسية للتعديل (اختياري)' : 'Base Image for Editing (Optional)'}
                    </label>
                    {imageInputBase && (
                      <button
                        type="button"
                        onClick={() => setImageInputBase(null)}
                        className="text-[11px] text-red-400 hover:underline"
                      >
                        {isArabic ? 'إزالة الصورة (توليد جديد)' : 'Clear (Generate from scratch)'}
                      </button>
                    )}
                  </div>

                  {imageInputBase ? (
                    <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-black/40 h-48">
                      <img
                        src={imageInputBase}
                        alt="Input base preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border border-dashed border-[#d4af37]/30 hover:border-[#ffd700] bg-[#12131f]/40 hover:bg-[#161827] cursor-pointer transition-all p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-[#d4af37]/60 mb-2" />
                      <p className="text-xs font-semibold text-white">
                        {isArabic ? 'ارفع صورة إذا أردت تعديلها' : 'Upload photo if you want to edit it'}
                      </p>
                      <p className="text-[10px] text-[#787c91] mt-0.5">
                        {isArabic ? 'أو اترك هذا الحقل فارغاً لتوليد صورة جديدة كلياً' : 'Or leave empty to generate from text prompt'}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'imgEdit')}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Aspect Ratio & Size Controls */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white">
                      {isArabic ? 'نسبة الأبعاد وحجم الصورة:' : 'Aspect Ratio & Resolution:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setImageRatio(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            imageRatio === r
                              ? 'bg-[#d4af37] text-black border-[#ffd700]'
                              : 'bg-[#141522] text-[#9ea3b5] border-[#25283b] hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}

                      <div className="ms-auto flex gap-1">
                        {(['1K', '2K', '512px'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setImageSize(sz)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              imageSize === sz
                                ? 'bg-[#d4af37]/30 text-[#ffd700] border-[#ffd700]'
                                : 'bg-[#141522] text-[#7e8297] border-[#25283b]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Prompt & Presets */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-white">
                    {imageInputBase
                      ? (isArabic ? 'تعليمات التعديل على الصورة:' : 'Edit Instructions:')
                      : (isArabic ? 'وصف الصورة المراد توليدها:' : 'Image Generation Prompt:')}
                  </label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder={
                      imageInputBase
                        ? (isArabic ? 'مثال: أضف لمسات ذهبية فاخرة واجعل الخلفية مكتب استشاري تنفيذي مع إضاءة دافئة...' : 'E.g., Add subtle gold foil luxury details and modern office background...')
                        : (isArabic ? 'مثال: شعار فخم لشركة استشارات موارد بشرية باللونين الأسود والذهبي مع هندسة معمارية فاخرة...' : 'E.g., Luxury black and gold executive corporate emblem with sleek typography...')
                    }
                    rows={4}
                    className="w-full p-3.5 rounded-2xl bg-[#12131f] border border-[#d4af37]/30 focus:border-[#ffd700] text-xs sm:text-sm text-white placeholder-[#5a5e74] focus:outline-none"
                  />

                  {/* Preset Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#8e92a8]">
                      {isArabic ? 'نماذج جاهزة سريعة:' : 'Quick Presets:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { ar: 'خلفية ذهبية فاخرة', en: 'Gold Luxury Texture', p: 'Luxury corporate abstract background with glowing gold leaf textures and deep obsidian black marble' },
                        { ar: 'شهادة تدريب معتمدة', en: 'Certificate Design', p: 'Luxury executive certificate of completion with gold embossed seal and modern Arabic calligraphy aesthetics' },
                        { ar: 'مجلس قيادة مؤسسية', en: 'Leadership Council', p: 'Executive leadership council meeting in high rise boardroom, golden hour ambient lighting, ultra realistic 8k' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImagePrompt(item.p)}
                          className="px-2.5 py-1 rounded-lg bg-[#181a29] border border-[#d4af37]/25 text-[11px] text-[#ffd700] hover:bg-[#d4af37]/20 transition-colors"
                        >
                          {isArabic ? item.ar : item.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="button"
                    disabled={isGenerating || !imagePrompt.trim()}
                    onClick={handleGenerateOrEditImage}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b3891d] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-3"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>
                      {isGenerating
                        ? (isArabic ? 'جارٍ معالجة الصورة عبر Gemini...' : 'Processing with Gemini Flash Image...')
                        : (imageInputBase
                            ? (isArabic ? 'تطبيق التعديل على الصورة' : 'Apply Edits to Image')
                            : (isArabic ? 'توليد الصورة (Gemini 3.1 Flash Image)' : 'Generate Image (Gemini Flash Image)'))}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isArabic ? 'معرض الإبداعات المنتجة' : 'Media History & Generated Gallery'}
                  </h3>
                  <p className="text-xs text-[#9ea3b5]">
                    {isArabic
                      ? 'جميع مقاطع الفيديو والصور التي قمت بتوليدها جاهزة للمعاينة والتنزيل أو إعادة التحريك'
                      : 'All generated videos and images ready for preview, download, or re-animation'}
                  </p>
                </div>

                {galleryItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearGallery}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مسح السجل' : 'Clear Gallery'}</span>
                  </button>
                )}
              </div>

              {galleryItems.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#12131e] border border-[#d4af37]/20 space-y-3">
                  <Film className="w-10 h-10 text-[#d4af37]/40 mx-auto" />
                  <p className="text-sm font-semibold text-white">
                    {isArabic ? 'لا توجد وسائط مولدة حتى الآن' : 'No generated media yet'}
                  </p>
                  <p className="text-xs text-[#7e8297]">
                    {isArabic
                      ? 'ابدأ بتحريك صورة أو توليد فيديو من النص لتظهر نتائجك هنا تلقائياً'
                      : 'Start by animating an image or generating video from text to see items here.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('image_to_video')}
                    className="px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:bg-white transition-colors"
                  >
                    {isArabic ? 'بدء أول تجربة الآن' : 'Start First Creation'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#141522] border border-[#d4af37]/25 space-y-2 hover:border-[#ffd700] transition-all flex flex-col justify-between group"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-video flex items-center justify-center">
                        {item.type === 'video' ? (
                          <video
                            src={item.mediaUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-2 end-2 px-2 py-0.5 rounded bg-black/70 text-[#ffd700] text-[10px] font-bold border border-[#d4af37]/30">
                          {item.type === 'video' ? 'Veo Video' : 'Gemini Image'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#7e8297] line-clamp-2">
                          {item.prompt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#222538]">
                        <span className="text-[10px] text-[#ffd700]">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {item.type === 'image' && (
                            <button
                              type="button"
                              onClick={() => {
                                setImgToVidImage(item.mediaUrl);
                                setActiveTab('image_to_video');
                              }}
                              title={isArabic ? 'تحريك إلى فيديو' : 'Animate to video'}
                              className="p-1.5 rounded-lg bg-[#1c1e2e] text-[#ffd700] hover:bg-[#d4af37] hover:text-black transition-colors"
                            >
                              <Film className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <a
                            href={item.mediaUrl}
                            download={item.type === 'video' ? 'hr-navigator-veo.mp4' : 'hr-navigator-visual.png'}
                            className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#ffd700] hover:bg-[#d4af37] hover:text-black transition-colors"
                            title={isArabic ? 'تنزيل' : 'Download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#d4af37]/20 bg-[#10111a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#8e92a8]">
            <Sparkles className="w-4 h-4 text-[#ffd700]" />
            <span>
              {isArabic
                ? 'مدعوم بأحدث تقنيات Google Veo 3 و Gemini 3.1 للاستشارات والإنتاج الفاخر'
                : 'Powered by Google Veo 3 & Gemini 3.1 for Luxury Corporate Production'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#d4af37]/30 text-xs font-bold text-[#e5e5e5] hover:bg-[#1a1b28] transition-colors cursor-pointer"
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
