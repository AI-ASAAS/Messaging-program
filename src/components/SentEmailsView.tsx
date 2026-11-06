'use client';

import React, { useState } from 'react';
import { BrandIdentity, EmailRecord } from '@/types';
import {
  Send,
  Search,
  Eye,
  Copy,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  X,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { EMAIL_TEMPLATES } from '@/lib/templates-data';

interface SentEmailsViewProps {
  emails: EmailRecord[];
  brand: BrandIdentity;
  onReuseEmail: (record: EmailRecord) => void;
  onRefresh: () => void;
}

export function SentEmailsView({ emails, brand, onReuseEmail, onRefresh }: SentEmailsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'draft'>('all');
  const [previewEmail, setPreviewEmail] = useState<EmailRecord | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const filtered = emails.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      e.subject.toLowerCase().includes(q) ||
      e.senderName.toLowerCase().includes(q) ||
      e.to.some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  const getTemplateName = (id: string) => {
    return EMAIL_TEMPLATES.find((t) => t.id === id)?.nameAr || id;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcf9f5] overflow-hidden">
      {/* View Header */}
      <div className="p-4 bg-white border-b border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#221f1f] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#ba9555]" />
            <span>سجل الرسائل الرسمية</span>
          </h2>
          <p className="text-xs text-gray-500">
            استعراض ومتابعة كافة الرسائل التي تم إنشاؤها وإرسالها وحفظها في المنصة
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#fcf9f5] hover:bg-[#ba9555]/10 text-[#8f6626] border border-[#ba9555]/30 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white/60 border-b border-[#e8e2d5] flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث بعنوان الرسالة، اسم المرسل، أو المستلم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'all' ? 'bg-white font-bold text-[#221f1f] shadow-xs' : 'text-gray-600'
            }`}
          >
            الكل ({emails.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('sent')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'sent' ? 'bg-white font-bold text-green-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            المرسل ({emails.filter((e) => e.status === 'sent').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'draft' ? 'bg-white font-bold text-amber-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            المسودات ({emails.filter((e) => e.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Emails List Table / Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <div className="font-bold text-sm">لا توجد رسائل مطابقة</div>
            <div className="text-xs text-gray-400">جرّب تغيير عبارة البحث أو الفلاتر</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'sent'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status === 'sent' ? 'تم الإرسال بنجاح' : 'مسودة محفوظة'}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#ba9555]/15 text-[#8f6626] font-semibold">
                      {getTemplateName(item.templateId)}
                    </span>

                    <span className="text-gray-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.sentAt || item.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#221f1f] mb-1 truncate">
                    {item.subject}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span>
                      المرسل: <strong className="text-gray-700">{item.senderName}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      المستلمون ({item.to.length}):{' '}
                      <span className="text-gray-700">{item.to.slice(0, 3).join(', ')}</span>
                      {item.to.length > 3 && ` +${item.to.length - 3} آخرين`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewEmail(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#fcf9f5] hover:bg-[#ba9555]/10 text-gray-700 border border-[#e8e2d5] rounded-xl transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ba9555]" />
                    <span>معاينة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReuseEmail(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-xs transition active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>إعادة استخدام</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e2d5] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#fcf9f5] border-b border-[#f0ece1] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#221f1f]">{previewEmail.subject}</h3>
                <div className="text-xs text-gray-500">
                  قالب: {getTemplateName(previewEmail.templateId)} • المرسل: {previewEmail.senderName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-200 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded transition ${
                      previewDevice === 'desktop' ? 'bg-white font-bold text-black shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5 inline ml-1" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded transition ${
                      previewDevice === 'mobile' ? 'bg-white font-bold text-black shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 inline ml-1" /> Mobile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewEmail(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-[#f8f5ee] flex justify-center">
              <div
                className={`transition-all ${
                  previewDevice === 'desktop' ? 'w-full max-w-2xl' : 'w-[375px]'
                }`}
              >
                <iframe
                  title="Sent Email Preview"
                  srcDoc={previewEmail.renderedHtml}
                  className="w-full min-h-[600px] border-0 rounded-xl shadow-md bg-white"
                />
              </div>
            </div>

            <div className="p-3 bg-white border-t border-[#f0ece1] flex items-center justify-between text-xs">
              <span className="text-gray-500">
                المستلمون: {previewEmail.to.join(', ')}
              </span>
              <button
                type="button"
                onClick={() => {
                  onReuseEmail(previewEmail);
                  setPreviewEmail(null);
                }}
                className="px-4 py-1.5 font-bold bg-[#ba9555] text-white hover:bg-[#a88344] rounded-lg transition"
              >
                نسخ إلى محرر الإيميل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
