'use client';

import React, { useState } from 'react';
import { Role, TeamMember } from '@/types';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Shield,
  Briefcase,
  Phone,
  Trash2,
  Check,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';

interface TeamMembersViewProps {
  members: TeamMember[];
  onRefresh: () => void;
  onSendToMember: (memberEmail: string) => void;
}

export function TeamMembersView({ members, onRefresh, onSendToMember }: TeamMembersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Invite Form State
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [department, setDepartment] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [phone, setPhone] = useState('');

  const departments = ['ALL', ...Array.from(new Set(members.map((m) => m.department)))];

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('يرجى كتابة الاسم والبريد الإلكتروني', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nameEn: nameEn || name,
          email,
          role,
          department: department || 'General',
          titleAr: titleAr || 'عضو فريق',
          titleEn: titleEn || 'Team Member',
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت إضافة العضو');
      }

      showToast(`تمت دعوة وإضافة ${name} إلى دليل الشركة بنجاح!`);
      setInviteModalOpen(false);
      // Reset form
      setName('');
      setNameEn('');
      setEmail('');
      setDepartment('');
      setTitleAr('');
      setTitleEn('');
      setPhone('');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string, memberName: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في إزالة العضو "${memberName}"؟`)) return;

    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل حذف العضو');
      showToast(`تم حذف العضو "${memberName}"`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = members.filter((m) => {
    const matchesDept = selectedDept === 'ALL' || m.department === selectedDept;
    const matchesRole = selectedRole === 'ALL' || m.role === selectedRole;
    const q = searchQuery.toLowerCase();
    const matchesQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.titleAr.toLowerCase().includes(q);
    return matchesDept && matchesRole && matchesQ;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcf9f5] overflow-hidden">
      {/* Toast Notification */}
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
      <div className="p-4 bg-white border-b border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#221f1f] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ba9555]" />
            <span>إدارة أعضاء الفريق والدليل المؤسسي</span>
          </h2>
          <p className="text-xs text-gray-500">
            قائمة بجميع الأعضاء المسجلين في المنصة لإرسال المراسلات الرسمية إليهم وإدارة أدوارهم
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-xl shadow-sm transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>دعوة عضو جديد</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-3 bg-white/60 border-b border-[#e8e2d5] flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد الإلكتروني، القسم، أو المسمى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ba9555]"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'جميع الإدارات والأقسام' : d}
            </option>
          ))}
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ba9555]"
        >
          <option value="ALL">جميع الأدوار والصلاحيات</option>
          <option value="admin">مسؤول النظام (Admin)</option>
          <option value="manager">مدير قسم (Manager)</option>
          <option value="member">عضو فريق (Member)</option>
        </select>
      </div>

      {/* Members Grid / List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#ba9555] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#221f1f]">{member.name}</h3>
                      <div className="text-[10px] text-gray-500 font-mono">{member.email}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : member.role === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Manager' : 'Member'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 bg-[#fcf9f5] p-2.5 rounded-xl border border-[#f0ece1]">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#ba9555]" />
                    <span className="font-semibold text-gray-800">{member.titleAr}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 pr-5">{member.department}</div>
                  {member.phone && (
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span dir="ltr">{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onSendToMember(member.email)}
                  className="flex items-center gap-1 text-[#ba9555] hover:text-[#a88344] font-bold transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال بريد له</span>
                </button>

                {member.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member.id, member.name)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="إزالة العضو"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e2d5] w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-[#fcf9f5] border-b border-[#f0ece1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#ba9555]" />
                <h3 className="font-bold text-sm text-[#221f1f]">دعوة عضو جديد إلى المنصة</h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الاسم الكامل (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. فهد السديري"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    placeholder="e.g. Fahad Al-Sudairy"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">البريد الإلكتروني الرسمي *</label>
                  <input
                    type="email"
                    required
                    placeholder="fahad@ai-asaas.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الصلاحية والدور</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  >
                    <option value="member">عضو فريق (Team Member)</option>
                    <option value="manager">مدير قسم (Manager)</option>
                    <option value="admin">مسؤول النظام (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الإدارة أو القسم</label>
                  <input
                    type="text"
                    placeholder="مثال: هندسة البرمجيات"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    placeholder="مثال: مهندس برمجيات أول"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رقم الهاتف (اختياري)</label>
                <input
                  type="text"
                  placeholder="+966 5x xxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
                />
              </div>

              <div className="p-4 bg-[#fcf9f5] border-t border-[#f0ece1] -mx-5 -mb-5 mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-bold bg-[#ba9555] text-white hover:bg-[#a88344] rounded-xl shadow-xs transition"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'إرسال الدعوة وإضافة العضو'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
