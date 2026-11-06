'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BrandIdentity, ChatMessage, EmailContent, TeamMember } from '@/types';
import {
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight,
  Bot,
  User,
  Wand2,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';

interface ChatWorkspaceProps {
  currentEmail: EmailContent;
  brand: BrandIdentity;
  members: TeamMember[];
  onEmailGenerated: (email: EmailContent, suggestedRecipients?: string[]) => void;
  conversationHistory: ChatMessage[];
  onUpdateHistory: (messages: ChatMessage[]) => void;
  currentUser?: TeamMember;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

const QUICK_STARTERS = [
  'أريد إرسال دعوة اجتماع للفريق يوم الأحد الساعة 10 صباحاً لمناقشة الخطة الربعية.',
  'أريد إرسال تعميم إداري رسمي بخصوص تحديث سياسات العمل وساعات الدوام.',
  'أريد إرسال تحديث رسمي حول تقدم مشروع المنصة الداخلية إلى الإدارة العليا.',
  'أريد إرسال رسالة شكر وتقدير للزميل فيصل القحطاني على إنجازه المتميز.',
  'أريد طلب التقرير الأسبوعي للإنجازات ومؤشرات الأداء من كافة رؤساء الأقسام.',
];

const QUICK_REFINEMENTS = [
  'اجعل النبرة أكثر رسمية وبروتوكولية 🎩',
  'اختصر الرسالة وركز على النقاط الجوهرية ⚡',
  'أضف بنوداً مرقمة بالتعليمات التنفيذية 📋',
  'غير موعد الاجتماع ليكون يوم الثلاثاء 2 ظهراً 📅',
  'أضف تنبيهاً بضرورة إحضار أجهزة اللابتوب 💻',
  'ترجم الرسالة وصغها باللغة الإنجليزية 🌐',
];

export function ChatWorkspace({
  currentEmail,
  brand,
  members,
  onEmailGenerated,
  conversationHistory,
  onUpdateHistory,
  currentUser,
  isLoggedIn,
  onOpenLogin,
  onLogout,
}: ChatWorkspaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, isLoading]);

  const handleSubmit = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...conversationHistory, userMessage];
    onUpdateHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          conversationHistory: newHistory,
          currentEmail,
        }),
      });

      if (!res.ok) {
        throw new Error('فشل معالجة طلب الذكاء الاصطناعي');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.chatResponse,
        timestamp: new Date().toISOString(),
        suggestedTemplateId: data.email?.templateId,
        suggestedRecipients: data.suggestedRecipients,
        clarifyingQuestions: data.clarifyingQuestions,
        emailSnapshot: data.email,
      };

      onUpdateHistory([...newHistory, assistantMessage]);

      if (data.email) {
        onEmailGenerated(data.email, data.suggestedRecipients);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `عذراً، حدث خطأ أثناء المعالجة: ${err.message}. يرجى المحاولة مرة أخرى.`,
        timestamp: new Date().toISOString(),
      };
      onUpdateHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    onUpdateHistory([]);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcf9f5] border-l border-[#e8e2d5] relative">
      {/* Top Header */}
      <div className="p-3.5 bg-white border-b border-[#e8e2d5] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#221f1f] flex items-center gap-1.5">
              <span>المساعد الذكي للمراسلات</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#ba9555]/15 text-[#8f6626] font-semibold rounded-full">
                AI Agent
              </span>
            </h2>
            <p className="text-[11px] text-gray-500">
              اكتب ما تريد إرساله باللغة الطبيعية وسيقوم النظام باختيار القالب وصياغة البريد فوراً
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#fcf9f5] border border-[#e8e2d5] text-xs">
              <div className="w-5 h-5 rounded-full bg-[#ba9555] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {currentUser.initials}
              </div>
              <span className="font-semibold text-gray-700 truncate max-w-[110px] text-[11px]">
                {currentUser.name}
              </span>
              {isLoggedIn ? (
                onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="تسجيل الخروج"
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )
              ) : (
                onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    title="تسجيل الدخول عبر Gmail"
                    className="text-[#ba9555] hover:text-[#8f6626] font-bold text-[11px] px-1 transition"
                  >
                    دخول
                  </button>
                )
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-[#ba9555] flex items-center gap-1 font-medium transition px-2 py-1 rounded-lg hover:bg-gray-50"
            title="بدء محادثة جديدة"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#ba9555]/10 text-[#ba9555] flex items-center justify-center mb-3">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-[#221f1f] mb-1">
              مرحباً بك في مساعد المراسلات الرسمي
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              ماذا ترغب في إرساله اليوم؟ يمكنك كتابة فكرتك ببساطة، أو اختيار أحد النماذج السريعة أدناه:
            </p>

            {/* Quick Starters */}
            <div className="w-full space-y-2 text-right">
              {QUICK_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSubmit(starter)}
                  className="w-full text-right p-2.5 text-xs bg-white hover:bg-[#ba9555]/5 border border-[#e8e2d5] hover:border-[#ba9555] rounded-xl text-gray-800 transition flex items-center justify-between group shadow-2xs"
                >
                  <span className="leading-relaxed">{starter}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ba9555] transition transform group-hover:-translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversationHistory.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#221f1f] text-white'
                      : 'bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#221f1f] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-[#e8e2d5] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Clarifying questions from AI */}
                  {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-[#ba9555] flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        أسئلة توضيحية لإثراء الإيميل:
                      </div>
                      {msg.clarifyingQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSubmit(`بخصوص: ${q}، الإجابة هي: `)}
                          className="w-full text-right p-1.5 bg-[#fcf9f5] hover:bg-[#ba9555]/10 border border-[#ba9555]/30 rounded-lg text-[11px] text-[#221f1f] transition"
                        >
                          ❓ {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-[#e8e2d5] rounded-2xl rounded-tl-none p-3.5 text-xs text-gray-600 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#ba9555] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#ba9555] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#ba9555] rounded-full animate-bounce"></span>
              </div>
              <span>جارٍ تحليل الطلب واختيار القالب وتوليد محتوى البريد...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Refinements Chips */}
      {conversationHistory.length > 0 && (
        <div className="px-3 py-1.5 bg-white/70 border-t border-[#f0ece1] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-gray-400 font-semibold shrink-0">تعديلات سريعة:</span>
          {QUICK_REFINEMENTS.map((refinement, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmit(refinement)}
              className="shrink-0 px-2.5 py-1 bg-[#fcf9f5] hover:bg-[#ba9555]/10 border border-[#ba9555]/30 text-[#8f6626] rounded-full transition"
            >
              {refinement}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-[#e8e2d5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              rows={2}
              placeholder="اكتب ما تريد إرساله... (مثال: أريد إرسال دعوة اجتماع، أو اجعل الرسالة أكثر رسمية)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full p-2.5 pl-10 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 px-4 bg-[#ba9555] hover:bg-[#a88344] disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
}
