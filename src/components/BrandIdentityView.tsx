'use client';

import React, { useState } from 'react';
import { BrandIdentity } from '@/types';
import {
  Palette,
  Upload,
  Check,
  Sparkles,
  Building,
  Phone,
  Globe,
  Mail,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { renderEmailHtml } from '@/lib/email-renderer';

interface BrandIdentityViewProps {
  brand: BrandIdentity;
  onUpdateBrand: (updated: BrandIdentity) => void;
}

const COLOR_PRESETS = [
  { name: 'ذهب أساس الأيقوني (Default)', primary: '#ba9555', secondary: '#221f1f', accent: '#d3c6b4' },
  { name: 'الكحلي الإمبراطوري (Navy Blue)', primary: '#1e3a8a', secondary: '#0f172a', accent: '#93c5fd' },
  { name: 'الأخضر الزمردي (Emerald Enterprise)', primary: '#059669', secondary: '#064e3b', accent: '#a7f3d0' },
  { name: 'الأرجواني الملكي (Royal Purple)', primary: '#7c3aed', secondary: '#1e1b4b', accent: '#ddd6fe' },
  { name: 'الرمادي التنفيذي الفاخر (Slate Executive)', primary: '#475569', secondary: '#0f172a', accent: '#cbd5e1' },
];

export function BrandIdentityView({ brand, onUpdateBrand }: BrandIdentityViewProps) {
  const [currentBrand, setCurrentBrand] = useState<BrandIdentity>(brand);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/brand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBrand),
      });

      if (!res.ok) throw new Error('فشل تحديث الهوية البصرية');
      const data = await res.json();
      onUpdateBrand(data.brand);
      showToast('تم حفظ وتحديث الهوية البصرية الرسمية وتطبيقها على جميع القوالب!');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'asset') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/brand/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل رفع الملف');

      setCurrentBrand((prev) => ({
        ...prev,
        logoUrl: data.url,
      }));

      showToast(`تم رفع ${type === 'logo' ? 'شعار الشركة' : 'الملف'} واستخراجه بنجاح!`);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Sample rendered preview of brand email
  const sampleEmailHtml = renderEmailHtml(
    {
      subject: 'معاينة تطبيق الهوية البصرية على المراسلات',
      headline: 'الهوية البصرية الرسمية المعتمدة للمراسلات',
      summary: 'هذه معاينة حية لشكل القوالب الرسمية باستخدام الألوان والخطوط والشعار والتوقيع المعتمد أدناه.',
      templateId: 'announcement',
      language: 'ar',
      urgency: 'normal',
      sections: [
        {
          title: 'الألوان والرموز المؤسسية',
          content: 'تطبق الهوية البصرية الحالية على جميع رسائل البريد الإلكتروني مع مراعاة أعلى معايير التصميم العالمي المتوافق مع برامج البريد الإلكتروني.',
          type: 'paragraph',
        },
      ],
      callToAction: {
        text: 'زر الإجراء المعتمد باللون الأساسي',
        url: '#',
        style: 'primary',
      },
    },
    currentBrand
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcf9f5] overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-xl text-xs font-bold transition flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-white border-b border-[#e8e2d5] flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#221f1f] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#ba9555]" />
            <span>إدارة وتخصيص الهوية البصرية للشركة</span>
          </h2>
          <p className="text-xs text-gray-500">
            رفع الشعار، وضبط لوحة الألوان الرسمية، وتحديد الخطوط والترويسة والتوقيع المعتمد
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      {/* Body: Split View (Settings + Live Mini Preview) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* Left: Brand Configuration Forms */}
        <div className="flex-1 space-y-6">
          {/* Logo & Asset Upload */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#ba9555]" />
              <span>شعار الشركة وأصول الهوية (Brand Assets)</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#fcf9f5] rounded-xl border border-[#e8e2d5]">
              <div className="w-24 h-16 bg-[#221f1f] rounded-xl p-2 flex items-center justify-center border border-[#e8e2d5] shadow-xs">
                <img
                  src={currentBrand.logoUrl}
                  alt="Company Logo"
                  className="max-h-full max-w-full object-contain filter brightness-0 invert"
                />
              </div>

              <div className="flex-1 text-center sm:text-right">
                <div className="text-xs font-bold text-gray-800 mb-1">رفع شعار جديد (PNG, SVG, JPG, PDF)</div>
                <div className="text-[11px] text-gray-500 mb-2">
                  يدعم الذكاء الاصطناعي استخراج الألوان التلقائي ومطابقة أبعاد الشعار
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#221f1f] hover:bg-[#332e2d] text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingLogo ? 'جارٍ الرفع...' : 'اختيار ملف الشعار'}</span>
                  <input
                    type="file"
                    accept=".png,.svg,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Color Palette Presets & Custom Pickers */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#ba9555]" />
              <span>لوحة الألوان الرسمية (Brand Colors)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                نماذج جاهزة معتمدة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setCurrentBrand((prev) => ({
                        ...prev,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        accentColor: preset.accent,
                      }))
                    }
                    className="p-2.5 text-right bg-[#fcf9f5] hover:bg-[#ba9555]/10 border border-[#e8e2d5] rounded-xl transition flex items-center justify-between text-xs"
                  >
                    <span className="font-medium">{preset.name}</span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اللون الأساسي (Primary)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                  <input
                    type="color"
                    value={currentBrand.primaryColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, primaryColor: e.target.value })
                    }
                    className="w-7 h-7 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentBrand.primaryColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, primaryColor: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اللون الثانوي (Secondary)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                  <input
                    type="color"
                    value={currentBrand.secondaryColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, secondaryColor: e.target.value })
                    }
                    className="w-7 h-7 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentBrand.secondaryColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, secondaryColor: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">لون التمييز (Accent)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                  <input
                    type="color"
                    value={currentBrand.accentColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, accentColor: e.target.value })
                    }
                    className="w-7 h-7 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentBrand.accentColor}
                    onChange={(e) =>
                      setCurrentBrand({ ...currentBrand, accentColor: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#ba9555]" />
              <span>بيانات المنشأة الرسمية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم الشركة (بالعربية)</label>
                <input
                  type="text"
                  value={currentBrand.companyNameAr}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, companyNameAr: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Company Name (English)</label>
                <input
                  type="text"
                  value={currentBrand.companyNameEn}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, companyNameEn: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">الموقع الإلكتروني الرسمي</label>
                <input
                  type="text"
                  value={currentBrand.website}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, website: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رقم الهاتف الرسمي</label>
                <input
                  type="text"
                  value={currentBrand.phone}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, phone: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">العنوان والمقر الرئيسي</label>
                <input
                  type="text"
                  value={currentBrand.addressAr}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, addressAr: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Official Email Signature */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ba9555]" />
              <span>التوقيع الرسمي وبيان السرية (Official Signature)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم الموقّع المعتمد</label>
                <input
                  type="text"
                  value={currentBrand.officialSignature.signerNameAr}
                  onChange={(e) =>
                    setCurrentBrand({
                      ...currentBrand,
                      officialSignature: {
                        ...currentBrand.officialSignature,
                        signerNameAr: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={currentBrand.officialSignature.signerTitleAr}
                  onChange={(e) =>
                    setCurrentBrand({
                      ...currentBrand,
                      officialSignature: {
                        ...currentBrand.officialSignature,
                        signerTitleAr: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">نص إخلاء المسؤولية وسرية المراسلات</label>
                <textarea
                  rows={2}
                  value={currentBrand.officialSignature.disclaimerAr}
                  onChange={(e) =>
                    setCurrentBrand({
                      ...currentBrand,
                      officialSignature: {
                        ...currentBrand.officialSignature,
                        disclaimerAr: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Live Preview of Branded Template */}
        <div className="w-full lg:w-[460px] sticky top-4 flex flex-col">
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-3 mb-2 flex items-center justify-between shadow-2xs">
            <span className="text-xs font-bold text-[#221f1f] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#ba9555]" />
              <span>معاينة حية فورية لتطبيق الهوية</span>
            </span>
            <span className="text-[10px] text-gray-400">تتحدث تلقائياً مع الألوان</span>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-[#e8e2d5] overflow-hidden shadow-lg p-3">
            <iframe
              title="Brand Mini Preview"
              srcDoc={sampleEmailHtml}
              className="w-full h-[620px] border-0 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
