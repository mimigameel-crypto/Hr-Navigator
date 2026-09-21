import React, { useState, useRef } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Crown, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  UploadCloud,
  CheckCircle2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { demoUsers } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  lang: Language;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'register',
  lang,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState<'Gold VIP' | 'Platinum Elite' | 'Royal Black'>('Gold VIP');
  const [isStudent, setIsStudent] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [studentIdFileName, setStudentIdFileName] = useState('');
  const [studentIdDataUrl, setStudentIdDataUrl] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const t = translations[lang];
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const handleStudentIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStudentIdFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setStudentIdDataUrl(event.target?.result as string || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
        setError(isArabic ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
      if (isStudent && !studentIdDataUrl) {
        setError(isArabic ? 'يرجى رفع صورة كارنيه الجامعة لتفعيل خصم الطلبة' : 'Please upload your University Student ID photo to activate the discount');
        return;
      }
      if (!agreed) {
        setError(isArabic ? 'يرجى الموافقة على الشروط والأحكام' : 'Please accept the terms and conditions');
        return;
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: 'customer',
        tier: tier,
        joinedDate: new Date().toISOString().split('T')[0],
        isStudent: isStudent,
        universityName: universityName.trim() || undefined,
        studentIdCard: studentIdDataUrl || undefined
      };

      onSuccess(newUser);
      onClose();
    } else {
      // Login
      if (!email.trim() || !password) {
        setError(isArabic ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
        return;
      }

      // Check if matches demo users or create session
      const cleanEmail = email.trim().toLowerCase();
      const matched = demoUsers.find(u => u.email.toLowerCase() === cleanEmail);
      const isAdminEmail = cleanEmail.includes('admin') || 
                           cleanEmail === 'mimigameel@gmail.com' || 
                           cleanEmail === 'mimigameel82@gmail.com';

      const loggedUser: User = matched || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        phone: '+201092792321',
        role: isAdminEmail ? 'admin' : 'customer',
        tier: isAdminEmail ? 'Royal Black' : 'Gold VIP',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      onSuccess(loggedUser);
      onClose();
    }
  };

  const handleQuickDemo = (role: 'admin' | 'vip') => {
    const user = role === 'admin' ? demoUsers[0] : demoUsers[1];
    onSuccess(user);
    onClose();
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="auth-modal-dialog"
        className="relative w-full max-w-lg rounded-2xl bg-[#0f1017] border border-[#d4af37]/35 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden my-8"
      >
        {/* Subtle Gold top line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <BrandLogo lang={lang} size="md" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {mode === 'register' ? t.authTitleRegister : t.authTitleLogin}
            </h2>
            <p className="text-xs text-[#9ea3b5]">
              {mode === 'register' ? t.authDescRegister : t.authDescLogin}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#171822] p-1 border border-[#d4af37]/20 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-[#d4af37] text-[#0c0d12] shadow-sm'
                  : 'text-[#9ea3b5] hover:text-white'
              }`}
            >
              {t.register}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-[#d4af37] text-[#0c0d12] shadow-sm'
                  : 'text-[#9ea3b5] hover:text-white'
              }`}
            >
              {t.signIn}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#c5c8d6] mb-1.5">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-[#d4af37]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder={isArabic ? 'مثال: عبد العزيز بن ناصر' : 'e.g. Alexander Hamilton'}
                      className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-sm text-white placeholder-[#5a5e70] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c5c8d6] mb-1.5">
                    {t.phoneNumber}
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-[#d4af37]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                      className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-sm text-white placeholder-[#5a5e70] focus:outline-none transition-colors text-right rtl:text-left"
                    />
                  </div>
                </div>

                {/* Membership Tier Picker */}
                <div>
                  <label className="block text-xs font-medium text-[#c5c8d6] mb-1.5 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{t.membershipTier}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Gold VIP', label: t.tierGold },
                      { id: 'Platinum Elite', label: t.tierPlatinum },
                      { id: 'Royal Black', label: t.tierRoyal }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTier(item.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                          tier === item.id
                            ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#ffd700]'
                            : 'border-white/5 bg-[#14151f] text-[#8a8d9a] hover:border-white/20'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* University Student Discount Verification Section */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b1c2b] to-[#12131f] border border-[#d4af37]/35 shadow-inner space-y-3">
                  <div className="flex items-start gap-2.5">
                    <input
                      id="is-student-checkbox"
                      type="checkbox"
                      checked={isStudent}
                      onChange={e => setIsStudent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded accent-[#ffd700] bg-[#0c0d12] border-[#d4af37]/40 cursor-pointer"
                    />
                    <label htmlFor="is-student-checkbox" className="text-xs font-bold text-white cursor-pointer flex-1">
                      <div className="flex items-center gap-1.5 text-[#ffd700]">
                        <GraduationCap className="w-4 h-4" />
                        <span>{t.isStudentCheckbox}</span>
                      </div>
                      <p className="text-[11px] text-[#9ea3b5] font-normal mt-0.5">
                        {isArabic ? 'خصم حصري على كورس HR for Juniors (3,000 ج.م بدلاً من 4,500 ج.م) لجميع طلبة الجامعات' : 'Special offer on HR for Juniors (3,000 EGP instead of 4,500 EGP) for university students'}
                      </p>
                    </label>
                  </div>

                  {isStudent && (
                    <div className="pt-2.5 border-t border-white/10 space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#c5c8d6] mb-1">
                          {t.universityNameLabel}
                        </label>
                        <input
                          type="text"
                          value={universityName}
                          onChange={e => setUniversityName(e.target.value)}
                          placeholder={t.universityNamePlaceholder}
                          className="w-full px-3 py-2 rounded-xl bg-[#0e0f17] border border-[#d4af37]/30 text-xs text-white placeholder-[#5a5e70] focus:outline-none focus:border-[#ffd700]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#c5c8d6] mb-1 flex items-center justify-between">
                          <span>{t.studentIdUploadLabel} <span className="text-amber-400">*</span></span>
                          <span className="text-[10px] text-[#8a8d9a] font-mono">JPG, PNG, PDF</span>
                        </label>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleStudentIdUpload}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="auth-student-id-upload"
                        />

                        {studentIdDataUrl ? (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-bold text-emerald-300 truncate">
                                  {studentIdFileName || (isArabic ? 'صورة كارنيه الجامعة' : 'Student ID Card')}
                                </p>
                                <span className="text-[10px] text-emerald-400/80">
                                  {t.studentIdUploadSuccess}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setStudentIdDataUrl('');
                                setStudentIdFileName('');
                              }}
                              className="text-[11px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer p-1"
                            >
                              {isArabic ? 'تغيير' : 'Change'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-3 rounded-xl border border-dashed border-[#d4af37]/50 hover:border-[#ffd700] bg-[#0c0d15] hover:bg-[#151624] text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
                          >
                            <UploadCloud className="w-5 h-5 text-[#ffd700] group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-white">
                              {isArabic ? 'اضغط لرفع صورة كارنيه الجامعة' : 'Click to upload Student ID photo'}
                            </span>
                            <span className="text-[10px] text-[#8a8d9a]">
                              {t.studentIdUploadHint}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[#c5c8d6] mb-1.5">
                {t.emailAddress}
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-[#d4af37]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@prestige.com"
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-sm text-white placeholder-[#5a5e70] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5c8d6] mb-1.5">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-[#d4af37]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-sm text-white placeholder-[#5a5e70] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="agree-terms-checkbox"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#d4af37] bg-[#14151f] border-[#d4af37]/30"
                />
                <label htmlFor="agree-terms-checkbox" className="text-xs text-[#9ea3b5] cursor-pointer">
                  {t.agreeTerms}
                </label>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-[#0c0d12] text-sm font-extrabold shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'register' ? t.registerBtn : t.loginBtn}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login for Fast Client Testing */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-[11px] text-[#8a8d9a] text-center mb-2.5 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabic ? 'دخول تجريبي سريع للمشتركين والعملاء:' : 'Instant Demo Client Access:'}</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo('vip')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#171924] hover:bg-[#202334] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700] transition-colors text-center flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>{t.demoClientLogin}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
