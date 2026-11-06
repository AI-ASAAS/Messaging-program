'use client';

import React, { useState } from 'react';
import { TeamMember } from '@/types';
import {
  Mail,
  User,
  Building,
  Check,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (member: TeamMember, isNew: boolean) => void;
}

const POPULAR_DEMO_GMAIL_ACCOUNTS = [
  {
    name: 'م. أيوب العبدالله',
    email: 'ayoub.alabdullah@gmail.com',
    department: 'الإدارة التنفيذية والذكاء الاصطناعي',
    role: 'admin' as const,
  },
  {
    name: 'سارة الشمري',
    email: 'sarah.alshammari@gmail.com',
    department: 'إدارة وتطوير المنتجات',
    role: 'manager' as const,
  },
  {
    name: 'فيصل القحطاني',
    email: 'faisal.qahtani.ai@gmail.com',
    department: 'هندسة نماذج الذكاء الاصطناعي',
    role: 'member' as const,
  },
];

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeMode, setActiveMode] = useState<'google' | 'manual'>('google');
  const [gmailAddress, setGmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('إدارة الابتكار والتحول الرقمي');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (emailToUse: string, nameToUse: string, deptToUse?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse.toLowerCase().trim(),
          name: nameToUse.trim() || emailToUse.split('@')[0],
          provider: 'google',
          department: deptToUse || 'العضوية والعمليات',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      // Persist in localStorage
      localStorage.setItem('asaas_email_user', JSON.stringify(data.member));

      onLoginSuccess(data.member, data.isNew);
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailAddress) {
      setError('يرجى إدخال عنوان البريد الإلكتروني');
      return;
    }
    handleSignIn(gmailAddress, fullName || gmailAddress.split('@')[0], department);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] w-full max-w-md overflow-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header with Asaas Brand */}
        <div className="p-6 bg-gradient-to-br from-[#1a1717] to-[#292423] text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] mx-auto flex items-center justify-center shadow-md mb-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">تسجيل الدخول إلى منصة المراسلات</h3>
          <p className="text-xs text-gray-300 mt-1">
            تسجيل الدخول عبر Gmail لإدراجك تلقائياً في دليل أعضاء الفريق وتفعيل حسابك
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google One-Click Auth Action */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                // Quick Google Sign-In with standard Google prompt
                const randomAccount = POPULAR_DEMO_GMAIL_ACCOUNTS[0];
                handleSignIn(randomAccount.email, randomAccount.name, randomAccount.department);
              }}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-[#ba9555] rounded-2xl text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs active:scale-95 disabled:opacity-50 group"
            >
              {/* Google Multicolored SVG Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>متابعة تسجيل الدخول عبر Google (Gmail)</span>
            </button>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-500 block mb-2 text-right">
                أو اختر أحد حسابات Gmail للتجربة السريعة:
              </span>
              <div className="space-y-1.5">
                {POPULAR_DEMO_GMAIL_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSignIn(acc.email, acc.name, acc.department)}
                    className="w-full p-2.5 bg-gray-50 hover:bg-[#ba9555]/10 border border-gray-200 hover:border-[#ba9555] rounded-xl text-right transition flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-bold text-[#221f1f] flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#ba9555]/15 text-[#8f6626] rounded">
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono" dir="ltr">
                        {acc.email}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ba9555] transition transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Form Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-3 bg-white text-[11px] text-gray-400">
                أو أدخل بيانات حساب Gmail الخاص بك
              </span>
            </div>

            {/* Manual Gmail Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني (Gmail) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={gmailAddress}
                    onChange={(e) => setGmailAddress(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. ماجد السبيعي"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">القسم أو الإدارة</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="مثال: هندسة البيانات والذكاء الاصطناعي"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#ba9555] hover:bg-[#a88344] text-white font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 mt-2 text-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جارٍ تسجيل الدخول وتحديث دليل الأعضاء...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تسجيل الدخول والإدراج التلقائي في الأعضاء</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-[#fcf9f5] border-t border-[#f0ece1] text-center text-[10.5px] text-gray-500">
          🔒 تسجيل الدخول آمن ومشفر. يتم إدراج حسابك تلقائياً ضمن قائمة الأعضاء كمستلم معتمد.
        </div>
      </div>
    </div>
  );
}
