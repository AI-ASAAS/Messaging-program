'use client';

import React, { useState } from 'react';
import { EmailTemplateDef, TemplateCategory } from '@/types';
import {
  LayoutTemplate,
  Search,
  Sparkles,
  ArrowRight,
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
  Plus,
  Trash2,
  Rocket,
  Shield,
  Coffee,
  Heart,
  Star,
  Gift,
} from 'lucide-react';
import { CreateTemplateModal } from './CreateTemplateModal';

interface TemplatesViewProps {
  templates: EmailTemplateDef[];
  onSelectTemplate: (template: EmailTemplateDef) => void;
  onTemplateCreated?: (template: EmailTemplateDef) => void;
  onRefreshTemplates?: () => void;
}

const ICON_MAP: Record<string, any> = {
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
  LayoutTemplate,
};

const CATEGORIES: { id: TemplateCategory | 'ALL'; labelAr: string }[] = [
  { id: 'ALL', labelAr: 'كافة القوالب' },
  { id: 'custom', labelAr: 'القوالب المخصصة ⭐' },
  { id: 'announcements', labelAr: 'التعاميم والإعلانات' },
  { id: 'meetings', labelAr: 'الاجتماعات والمحاضر' },
  { id: 'projects', labelAr: 'المشاريع والمهام' },
  { id: 'hr', labelAr: 'الموارد البشرية والشكر' },
  { id: 'approvals', labelAr: 'طلبات الاعتماد' },
  { id: 'general', labelAr: 'المراسلات الإدارية' },
];

export function TemplatesView({
  templates,
  onSelectTemplate,
  onTemplateCreated,
  onRefreshTemplates,
}: TemplatesViewProps) {
  const [selectedCat, setSelectedCat] = useState<TemplateCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteCustom = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف القالب المخصص "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل حذف القالب');
      showToast(`تم حذف القالب "${name}" بنجاح`);
      if (onRefreshTemplates) onRefreshTemplates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = templates.filter((t) => {
    const matchesCat = selectedCat === 'ALL' || t.category === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesQ =
      !q ||
      t.nameAr.toLowerCase().includes(q) ||
      t.nameEn.toLowerCase().includes(q) ||
      t.descriptionAr.toLowerCase().includes(q) ||
      t.descriptionEn.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcf9f5] overflow-hidden relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-white border-b border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#221f1f] flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#ba9555]" />
            <span>مكتبة القوالب البريدية المؤسسية الذكية</span>
          </h2>
          <p className="text-xs text-gray-500">
            استعراض القوالب المعتمدة أو إنشاء وتخصيص قوالب جديدة خاصة بمنشأتك
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1 bg-[#ba9555]/15 text-[#8f6626] rounded-full">
            {templates.length} قوالب متاحة
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء قالب جديد</span>
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="p-3 bg-white/60 border-b border-[#e8e2d5] flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث في القوالب بالاسم، الوصف، أو العنوان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedCat === c.id
                  ? 'bg-[#ba9555] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.labelAr}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <LayoutTemplate className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <div className="font-bold text-sm">لا توجد قوالب مطابقة</div>
            <div className="text-xs text-gray-400 mt-1">
              يمكنك إنشاء قالب جديد مخصص بالضغط على زر «إنشاء قالب جديد»
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tmpl) => {
              const Icon = ICON_MAP[tmpl.icon] || LayoutTemplate;
              return (
                <div
                  key={tmpl.id}
                  className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-lg transition flex flex-col justify-between group ${
                    tmpl.isCustom ? 'border-[#ba9555]/50 ring-1 ring-[#ba9555]/20' : 'border-[#e8e2d5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: tmpl.accentColor || '#ba9555' }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tmpl.isCustom && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ba9555] text-white shadow-2xs">
                            قالب مخصص
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#fcf9f5] border border-[#e8e2d5] text-gray-600">
                          {tmpl.nameEn}
                        </span>
                        {tmpl.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustom(tmpl.id, tmpl.nameAr)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="حذف القالب المخصص"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-[#221f1f] mb-1 group-hover:text-[#ba9555] transition">
                      {tmpl.nameAr}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {tmpl.descriptionAr}
                    </p>

                    {/* Feature tags */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold text-gray-400 block">المميزات المضمنة:</span>
                      <div className="flex flex-wrap gap-1">
                        {tmpl.features.map((f, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-[#fcf9f5] border border-[#e8e2d5] text-gray-700 rounded-md"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Default subject preview */}
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-[11px] text-gray-600">
                      <span className="font-semibold text-gray-800">العنوان الافتراضي: </span>
                      <span>{tmpl.defaultSubjectAr}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onSelectTemplate(tmpl)}
                      className="w-full py-2 px-3 text-xs font-bold bg-[#221f1f] hover:bg-[#ba9555] text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>إنشاء بريد بهذا القالب</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Custom Template Modal */}
      <CreateTemplateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTemplateCreated={(newTmpl) => {
          showToast(`تم إنشاء القالب المخصص "${newTmpl.nameAr}" بنجاح!`);
          if (onTemplateCreated) onTemplateCreated(newTmpl);
          if (onRefreshTemplates) onRefreshTemplates();
        }}
      />
    </div>
  );
}
