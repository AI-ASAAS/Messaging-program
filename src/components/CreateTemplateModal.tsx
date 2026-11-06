'use client';

import React, { useState } from 'react';
import { EmailTemplateDef } from '@/types';
import {
  LayoutTemplate,
  X,
  Check,
  Palette,
  Sparkles,
  Plus,
  Trash2,
  Megaphone,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  CheckSquare,
  Bell,
  Award,
  UserPlus,
  FileCheck,
  BarChart3,
  AlertCircle,
  MailCheck,
  Rocket,
  Shield,
  Coffee,
  Heart,
  Star,
  Gift,
} from 'lucide-react';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (newTemplate: EmailTemplateDef) => void;
}

const AVAILABLE_ICONS = [
  { id: 'Megaphone', label: 'مكبر صوت', icon: Megaphone },
  { id: 'Calendar', label: 'تقويم', icon: Calendar },
  { id: 'Award', label: 'وسام / شكر', icon: Award },
  { id: 'TrendingUp', label: 'مؤشر نمو', icon: TrendingUp },
  { id: 'CheckSquare', label: 'مهمة', icon: CheckSquare },
  { id: 'Bell', label: 'تنبيه', icon: Bell },
  { id: 'Rocket', label: 'إطلاق', icon: Rocket },
  { id: 'Shield', label: 'أمان', icon: Shield },
  { id: 'Coffee', label: 'مناسبة / لقاء', icon: Coffee },
  { id: 'Heart', label: 'اهتمام / صحة', icon: Heart },
  { id: 'Star', label: 'تميز', icon: Star },
  { id: 'Gift', label: 'مكافأة', icon: Gift },
  { id: 'FileCheck', label: 'اعتماد', icon: FileCheck },
  { id: 'BarChart3', label: 'تقرير إحصائي', icon: BarChart3 },
];

const PRESET_ACCENTS = [
  '#ba9555', // Asaas Gold
  '#2563eb', // Royal Blue
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#dc2626', // Red
  '#d97706', // Amber
  '#0891b2', // Cyan
  '#475569', // Slate
];

export function CreateTemplateModal({
  isOpen,
  onClose,
  onTemplateCreated,
}: CreateTemplateModalProps) {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('custom');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [icon, setIcon] = useState('Rocket');
  const [accentColor, setAccentColor] = useState('#ba9555');
  const [defaultSubjectAr, setDefaultSubjectAr] = useState('');
  const [defaultSubjectEn, setDefaultSubjectEn] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'شارة مميزة للقالب',
    'متوافق مع هوية الشركة الرسمية',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !defaultSubjectAr) {
      setError('يرجى إدخال اسم القالب والعنوان الافتراضي بالعربية');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr,
          nameEn: nameEn || nameAr,
          category,
          descriptionAr: descriptionAr || `قالب مخصص لمراسلات: ${nameAr}`,
          descriptionEn: descriptionEn || nameEn || nameAr,
          icon,
          accentColor,
          defaultSubjectAr,
          defaultSubjectEn: defaultSubjectEn || defaultSubjectAr,
          features,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إنشاء القالب المخصص');
      }

      onTemplateCreated(data.template);
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ القالب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#fcf9f5] border-b border-[#f0ece1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#221f1f]">إنشاء قالب بريد إلكتروني جديد</h3>
              <p className="text-xs text-gray-500">
                إضافة قالب مخصص إلى مكتبة القوالب وتفعيله للمساعد الذكي
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name AR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">اسم القالب (بالعربية) *</label>
              <input
                type="text"
                required
                placeholder="مثال: إشعار ترقية وظيفية / تعميم إجازة"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Template Name (English)</label>
              <input
                type="text"
                placeholder="e.g. Promotion Announcement / Holiday Notice"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>
          </div>

          {/* Category & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">تصنيف القالب (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              >
                <option value="custom">قوالب مخصصة (Custom)</option>
                <option value="announcements">التعاميم والإعلانات (Announcements)</option>
                <option value="meetings">الاجتماعات والمحاضر (Meetings)</option>
                <option value="projects">المشاريع والعمليات (Projects)</option>
                <option value="hr">الموارد البشرية والشكر (HR)</option>
                <option value="approvals">الاعتمادات والموافقات (Approvals)</option>
                <option value="general">المراسلات العامة (General)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">اللون المميز للقالب (Accent Color)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border-0 cursor-pointer"
                />
                <div className="flex items-center gap-1 flex-1">
                  {PRESET_ACCENTS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`w-6 h-6 rounded-full transition border ${
                        accentColor === c ? 'scale-110 border-black' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">أيقونة القالب المعبرة</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'border-[#ba9555] bg-[#ba9555]/15 text-[#ba9555] font-bold shadow-xs'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Subjects */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                صيغة العنوان الافتراضي (Subject Formula - بالعربية) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: تعميم رسمي بخصوص [الموضوع] - [التاريخ]"
                value={defaultSubjectAr}
                onChange={(e) => setDefaultSubjectAr(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Default Subject Line (English)
              </label>
              <input
                type="text"
                placeholder="e.g. Official Directive Regarding [Subject] - [Date]"
                value={defaultSubjectEn}
                onChange={(e) => setDefaultSubjectEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">وصف القالب والغرض منه</label>
            <textarea
              rows={2}
              placeholder="اكتب نبذة توضح حالات استخدام هذا القالب..."
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
            />
          </div>

          {/* Features / Tags */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">مميزات وعناصر القالب (Features)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="أضف ميزة (مثال: جدول مقارنة، زر RSVP، اعتماد تنفيذي)..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-gray-800 text-white rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((f, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ba9555]/10 text-[#8f6626] border border-[#ba9555]/30 rounded-lg text-[11px]"
                >
                  <span>✓ {f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="p-4 bg-[#fcf9f5] border-t border-[#f0ece1] -mx-5 -mb-5 mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'جارٍ إنشاء القالب...' : 'حفظ وإدراج القالب في المنصة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
