'use client';

import React, { useState, useEffect } from 'react';
import { AISettings, EmailProviderSettings } from '@/types';
import {
  Settings,
  Mail,
  Cpu,
  ShieldAlert,
  Check,
  Server,
  Key,
  Sliders,
  History,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminSettingsView() {
  const [emailSettings, setEmailSettings] = useState<EmailProviderSettings>({
    activeProvider: 'test',
    testMode: true,
    senderAddress: 'internal-comms@ai-asaas.com',
    senderName: 'ASAAS AI Corporate Comms',
    resendApiKey: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
  });

  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: '',
    temperature: 0.2,
    customSystemPrompt: '',
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.email) setEmailSettings(data.settings.email);
          if (data.settings.ai) setAiSettings(data.settings.ai);
        }
        if (data.auditLogs) setAuditLogs(data.auditLogs);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailSettings,
          ai: aiSettings,
        }),
      });

      if (!res.ok) throw new Error('فشل حفظ الإعدادات');
      showToast('تم حفظ وتحديث إعدادات المزود والذكاء الاصطناعي بنجاح!');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
            <Settings className="w-5 h-5 text-[#ba9555]" />
            <span>لوحة تحكم المسؤول وإعدادات النظام (Admin Dashboard)</span>
          </h2>
          <p className="text-xs text-gray-500">
            إدارة خدمات إرسال البريد الإلكتروني، إعدادات مفاتيح الذكاء الاصطناعي، ومراقبة سجل العمليات
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-5xl mx-auto w-full">
        {/* Email Delivery Provider */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ba9555]" />
              <span>مزود إرسال البريد الإلكتروني (Email Delivery Provider)</span>
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                emailSettings.testMode
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {emailSettings.testMode ? 'وضع المحاكاة الآمن (Simulation)' : 'إرسال حي مباشر (Live API)'}
            </span>
          </div>

          {/* Provider Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() =>
                setEmailSettings({ ...emailSettings, activeProvider: 'test', testMode: true })
              }
              className={`p-3 text-right rounded-xl border transition text-xs flex flex-col justify-between ${
                emailSettings.activeProvider === 'test'
                  ? 'border-[#ba9555] bg-[#ba9555]/10 font-bold'
                  : 'border-gray-200 bg-gray-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>وضع الاختبار والمحاكاة</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-normal">
                تسليم فوري ومحاكاة حقيقية مع تسجيل الرسائل في السجل دون الحاجة لمفاتيح خارجية.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setEmailSettings({ ...emailSettings, activeProvider: 'resend', testMode: false })
              }
              className={`p-3 text-right rounded-xl border transition text-xs flex flex-col justify-between ${
                emailSettings.activeProvider === 'resend'
                  ? 'border-[#ba9555] bg-[#ba9555]/10 font-bold'
                  : 'border-gray-200 bg-gray-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>Resend API</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-normal">
                إرسال مباشر عالي الاعتمادية عبر خدمة Resend العالمية مع دعم HTML وتتبع الفتح.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setEmailSettings({ ...emailSettings, activeProvider: 'smtp', testMode: false })
              }
              className={`p-3 text-right rounded-xl border transition text-xs flex flex-col justify-between ${
                emailSettings.activeProvider === 'smtp'
                  ? 'border-[#ba9555] bg-[#ba9555]/10 font-bold'
                  : 'border-gray-200 bg-gray-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>Custom SMTP Server</span>
                <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.2 rounded font-bold">
                  Self-Hosted
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-normal">
                الربط مع خادم بريد الشركة الداخلي مثل Exchange أو Postfix أو Google Workspace SMTP.
              </p>
            </button>
          </div>

          {/* Provider Specific Credentials */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">عنوان بريد الإرسال الرسمي (From Address)</label>
                <input
                  type="email"
                  value={emailSettings.senderAddress}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, senderAddress: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم جهة الإرسال (From Name)</label>
                <input
                  type="text"
                  value={emailSettings.senderName}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, senderName: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                />
              </div>
            </div>

            {emailSettings.activeProvider === 'resend' && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Resend API Key (re_...)</label>
                <input
                  type="password"
                  placeholder="re_123456789..."
                  value={emailSettings.resendApiKey || ''}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, resendApiKey: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-mono"
                />
              </div>
            )}

            {emailSettings.activeProvider === 'smtp' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    placeholder="smtp.company.com"
                    value={emailSettings.smtpHost || ''}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    value={emailSettings.smtpPort || 587}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) || 587 })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Username / Password</label>
                  <input
                    type="text"
                    placeholder="User"
                    value={emailSettings.smtpUser || ''}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none mb-1"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={emailSettings.smtpPass || ''}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPass: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Capabilities Engine */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ba9555]" />
            <span>محرك الذكاء الاصطناعي (AI LLM Engine)</span>
          </h3>

          <div className="p-3 bg-[#fcf9f5] border border-[#e8e2d5] rounded-xl text-xs text-gray-600 leading-relaxed">
            💡 المنصة مزودة بمحرك تحليل ذكي مدمج يعمل تلقائياً وبكفاءة عالية. لإتاحة القدرات التوليدية العصبية
            الكاملة (Neural Generation)، يمكنك إدخال مفتاح <strong>Google Gemini API Key</strong> واختيار النموذج
            المفضل أدناه:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">نموذج الذكاء الاصطناعي (Gemini Model)</label>
              <select
                value={aiSettings.model}
                onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (الأسرع والأدق للأعمال)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (المعقد والتحليلي المتقدم)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Google Gemini API Key</span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-gray-400 hover:text-black"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </label>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={aiSettings.apiKey || ''}
                onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">تعليمات النبرة المؤسسية المخصصة (System Prompt Instructions)</label>
              <textarea
                rows={2}
                value={aiSettings.customSystemPrompt || ''}
                onChange={(e) =>
                  setAiSettings({ ...aiSettings, customSystemPrompt: e.target.value })
                }
                placeholder="اكتب التوجيهات الإضافية للغة والنبرة المؤسسية المتبعة في شركتكم..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-[#221f1f] flex items-center gap-2">
            <History className="w-4 h-4 text-[#ba9555]" />
            <span>سجل الرقابة والعمليات الأمنية (Audit Logs)</span>
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 text-xs">
            {auditLogs.length === 0 ? (
              <div className="py-4 text-center text-gray-400">لا توجد سجلات بعد</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{log.action}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded">
                        {log.targetType}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 shrink-0">
                    {new Date(log.timestamp).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
