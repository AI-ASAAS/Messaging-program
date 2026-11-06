'use client';

import React, { useState } from 'react';
import { TeamMember } from '@/types';
import { UserCheck, Users, X, Plus, Search, ChevronDown, ChevronUp, Mail } from 'lucide-react';

interface RecipientSelectorProps {
  to: string[];
  cc: string[];
  bcc: string[];
  onChange: (to: string[], cc: string[], bcc: string[]) => void;
  members: TeamMember[];
  suggestedRecipients?: string[];
}

export function RecipientSelector({
  to,
  cc,
  bcc,
  onChange,
  members,
  suggestedRecipients = [],
}: RecipientSelectorProps) {
  const [showCc, setShowCc] = useState(cc.length > 0);
  const [showBcc, setShowBcc] = useState(bcc.length > 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetField, setTargetField] = useState<'to' | 'cc' | 'bcc'>('to');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [customInput, setCustomInput] = useState('');

  const departments = ['ALL', ...Array.from(new Set(members.map((m) => m.department)))];

  const handleAddExternal = (field: 'to' | 'cc' | 'bcc') => {
    const email = customInput.trim();
    if (!email || !email.includes('@')) return;

    if (field === 'to' && !to.includes(email)) {
      onChange([...to, email], cc, bcc);
    } else if (field === 'cc' && !cc.includes(email)) {
      onChange(to, [...cc, email], bcc);
    } else if (field === 'bcc' && !bcc.includes(email)) {
      onChange(to, cc, [...bcc, email]);
    }
    setCustomInput('');
  };

  const handleRemove = (field: 'to' | 'cc' | 'bcc', email: string) => {
    if (field === 'to') {
      onChange(to.filter((e) => e !== email), cc, bcc);
    } else if (field === 'cc') {
      onChange(to, cc.filter((e) => e !== email), bcc);
    } else if (field === 'bcc') {
      onChange(to, cc, bcc.filter((e) => e !== email));
    }
  };

  const handleSelectAllTeam = (field: 'to' | 'cc') => {
    const allEmails = members.map((m) => m.email);
    if (field === 'to') {
      const merged = Array.from(new Set([...to, ...allEmails]));
      onChange(merged, cc, bcc);
    } else {
      const merged = Array.from(new Set([...cc, ...allEmails]));
      onChange(to, merged, bcc);
    }
  };

  const handleToggleMember = (email: string) => {
    if (targetField === 'to') {
      if (to.includes(email)) {
        onChange(to.filter((e) => e !== email), cc, bcc);
      } else {
        onChange([...to, email], cc, bcc);
      }
    } else if (targetField === 'cc') {
      if (cc.includes(email)) {
        onChange(to, cc.filter((e) => e !== email), bcc);
      } else {
        onChange(to, [...cc, email], bcc);
      }
    } else if (targetField === 'bcc') {
      if (bcc.includes(email)) {
        onChange(to, cc, bcc.filter((e) => e !== email));
      } else {
        onChange(to, cc, [...bcc, email]);
      }
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesDept = selectedDept === 'ALL' || m.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  const getMemberByEmail = (email: string) => members.find((m) => m.email === email);

  const totalCount = to.length + cc.length + bcc.length;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#e8e2d5] rounded-xl p-3.5 shadow-sm text-sm">
      {/* Header with counter & quick actions */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#f0ece1]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#ba9555]" />
          <span className="font-bold text-[#221f1f]">المستلمون</span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-[#ba9555]/15 text-[#8f6626] rounded-full">
            {totalCount} مستلم
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleSelectAllTeam('to')}
            className="flex items-center gap-1 px-2.5 py-1 font-medium bg-[#fcf9f5] hover:bg-[#ba9555]/10 text-[#8f6626] border border-[#ba9555]/30 rounded-lg transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
            تحديد جميع الأعضاء ({members.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setTargetField('to');
              setModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 font-medium bg-[#221f1f] text-white hover:bg-[#3d3838] rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            اختيار من الدليل
          </button>
        </div>
      </div>

      {/* Suggested recipients from AI */}
      {suggestedRecipients.length > 0 && (
        <div className="mb-2.5 px-2.5 py-1.5 bg-[#fcf9f5] rounded-lg border border-[#e8e2d5] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#8f6626] font-semibold flex items-center gap-1">
            ✨ مقترحات المساعد:
          </span>
          {suggestedRecipients.map((email) => {
            const member = getMemberByEmail(email);
            const isAlreadyAdded = to.includes(email) || cc.includes(email) || bcc.includes(email);
            if (isAlreadyAdded) return null;

            return (
              <button
                key={email}
                type="button"
                onClick={() => onChange([...to, email], cc, bcc)}
                className="flex items-center gap-1 px-2 py-0.5 bg-white border border-[#ba9555]/40 hover:bg-[#ba9555]/10 text-[#221f1f] rounded-full transition"
              >
                <span>{member ? member.name : email}</span>
                <Plus className="w-3 h-3 text-[#ba9555]" />
              </button>
            );
          })}
        </div>
      )}

      {/* Field: TO */}
      <div className="flex items-start gap-2 py-1">
        <span className="w-10 pt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">إلى:</span>
        <div className="flex-1 flex flex-wrap items-center gap-1.5">
          {to.map((email) => {
            const m = getMemberByEmail(email);
            return (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 bg-[#f4eee2] text-[#221f1f] border border-[#d3c6b4] rounded-lg text-xs"
              >
                <span className="w-4 h-4 rounded-full bg-[#ba9555] text-white flex items-center justify-center text-[10px] font-bold">
                  {m ? m.initials : email[0].toUpperCase()}
                </span>
                <span className="font-medium">{m ? m.name : email}</span>
                <button
                  type="button"
                  onClick={() => handleRemove('to', email)}
                  className="hover:text-red-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          <div className="inline-flex items-center gap-1 min-w-[140px] flex-1">
            <input
              type="text"
              placeholder="اكتب بريداً خارجياً واضغط Enter..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExternal('to');
                }
              }}
              className="w-full text-xs bg-transparent border-0 outline-none placeholder:text-gray-400 py-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          {!showCc && (
            <button
              type="button"
              onClick={() => setShowCc(true)}
              className="hover:text-[#ba9555] px-1 py-0.5 rounded transition"
            >
              CC
            </button>
          )}
          {!showBcc && (
            <button
              type="button"
              onClick={() => setShowBcc(true)}
              className="hover:text-[#ba9555] px-1 py-0.5 rounded transition"
            >
              BCC
            </button>
          )}
        </div>
      </div>

      {/* Field: CC */}
      {showCc && (
        <div className="flex items-start gap-2 py-1 border-t border-[#f7f4ee]">
          <span className="w-10 pt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">نسخة:</span>
          <div className="flex-1 flex flex-wrap items-center gap-1.5">
            {cc.map((email) => {
              const m = getMemberByEmail(email);
              return (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg text-xs"
                >
                  <span className="font-medium">{m ? m.name : email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove('cc', email)}
                    className="hover:text-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setTargetField('cc');
                setModalOpen(true);
              }}
              className="text-xs text-[#8f6626] hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> إضافة CC
            </button>
          </div>
        </div>
      )}

      {/* Field: BCC */}
      {showBcc && (
        <div className="flex items-start gap-2 py-1 border-t border-[#f7f4ee]">
          <span className="w-10 pt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">مخفية:</span>
          <div className="flex-1 flex flex-wrap items-center gap-1.5">
            {bcc.map((email) => {
              const m = getMemberByEmail(email);
              return (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg text-xs"
                >
                  <span className="font-medium">{m ? m.name : email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove('bcc', email)}
                    className="hover:text-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setTargetField('bcc');
                setModalOpen(true);
              }}
              className="text-xs text-[#8f6626] hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> إضافة BCC
            </button>
          </div>
        </div>
      )}

      {/* Members Directory Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e2d5] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#f0ece1] flex items-center justify-between bg-[#fcf9f5]">
              <div>
                <h3 className="text-base font-bold text-[#221f1f]">
                  دليل أعضاء الشركة المسجلين
                </h3>
                <p className="text-xs text-gray-500">
                  تحديد المستلمين لحقل ({targetField === 'to' ? 'To المستلمون الأساسيون' : targetField === 'cc' ? 'CC نسخة' : 'BCC نسخة مخفية'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div className="p-3 border-b border-[#f0ece1] bg-white flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، أو المسمى الوظيفي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#ba9555] outline-none"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#ba9555]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'جميع الإدارات والأقسام' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Members List */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  لم يتم العثور على أعضاء مطابقين للبحث
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const isSelected =
                    targetField === 'to'
                      ? to.includes(member.email)
                      : targetField === 'cc'
                      ? cc.includes(member.email)
                      : bcc.includes(member.email);

                  return (
                    <div
                      key={member.id}
                      onClick={() => handleToggleMember(member.email)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                        isSelected ? 'bg-[#ba9555]/10 border border-[#ba9555]/30' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ba9555] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {member.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#221f1f]">{member.name}</span>
                            <span className="text-[10px] px-2 py-0.2 bg-gray-100 text-gray-600 rounded-full">
                              {member.department}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500">{member.email}</div>
                          <div className="text-[10px] text-gray-400">{member.titleAr}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#ba9555] rounded accent-[#ba9555] cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#f0ece1] bg-[#fcf9f5] flex items-center justify-between text-xs">
              <span className="text-gray-500">
                المحددون حالياً: {targetField === 'to' ? to.length : targetField === 'cc' ? cc.length : bcc.length} عضو
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 font-bold bg-[#ba9555] text-white hover:bg-[#a88344] rounded-lg transition"
              >
                تأكيد التحديد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
