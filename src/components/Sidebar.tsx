'use client';

import React from 'react';
import {
  Send,
  FileText,
  Users,
  LayoutTemplate,
  Palette,
  Settings,
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { BrandIdentity, TeamMember } from '@/types';

export type ActiveTab = 'new' | 'sent' | 'drafts' | 'members' | 'templates' | 'brand' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  brand: BrandIdentity;
  sentCount: number;
  draftCount: number;
  membersCount: number;
  currentUser: TeamMember;
  isLoggedIn?: boolean;
  onOpenLogin: () => void;
  onLogout?: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  brand,
  sentCount,
  draftCount,
  membersCount,
  currentUser,
  isLoggedIn = false,
  onOpenLogin,
  onLogout,
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const navItems = [
    {
      id: 'new' as ActiveTab,
      label: 'إنشاء بريد ذكي',
      labelEn: 'New Email',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'sent' as ActiveTab,
      label: 'البريد المرسل',
      labelEn: 'Sent Emails',
      icon: Send,
      count: sentCount,
    },
    {
      id: 'drafts' as ActiveTab,
      label: 'المسودات',
      labelEn: 'Drafts',
      icon: FileText,
      count: draftCount,
    },
    {
      id: 'members' as ActiveTab,
      label: 'أعضاء الفريق',
      labelEn: 'Team Members',
      icon: Users,
      count: membersCount,
    },
    {
      id: 'templates' as ActiveTab,
      label: 'مكتبة القوالب',
      labelEn: 'Templates',
      icon: LayoutTemplate,
      badge: 'القوالب الذكية',
    },
    {
      id: 'brand' as ActiveTab,
      label: 'الهوية البصرية',
      labelEn: 'Brand Identity',
      icon: Palette,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'الإدارة والإعدادات',
      labelEn: 'Admin Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-[#1a1717] text-white flex flex-col h-full border-l border-[#2e2928] select-none shrink-0">
      {/* Brand & Organization Header */}
      <div className="p-4 border-b border-[#2e2928] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ba9555] to-[#d8b36f] flex items-center justify-center p-1.5 shadow-sm">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-full h-full object-contain filter brightness-0 invert"
          />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-xs text-white truncate tracking-wide">
            {brand.companyNameAr}
          </h1>
          <div className="text-[10px] text-[#ba9555] font-medium truncate">
            {brand.companyNameEn}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1">
          منظومة المراسلات
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#ba9555] to-[#a88344] text-white shadow-md font-bold'
                  : item.highlight
                  ? 'bg-[#292423] text-[#d8b36f] hover:bg-[#332e2d]'
                  : 'text-gray-300 hover:bg-[#252120] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#ba9555]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#2f2a29] text-gray-400'
                  }`}
                >
                  {item.count}
                </span>
              )}

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#ba9555]/20 text-[#d8b36f]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Card & Account Actions */}
      <div className="p-3 border-t border-[#2e2928] bg-[#141212] space-y-2">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#221e1e] border border-[#2e2928]">
          <div className="flex items-center gap-2.5 overflow-hidden flex-1">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#ba9555] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.initials}
              </div>
              {isLoggedIn && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#141212]"
                  title="متصل حالياً"
                />
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>{currentUser.name}</span>
                {currentUser.provider === 'google' && (
                  <span className="text-[9px] bg-red-600/30 text-red-300 px-1 py-0.2 rounded font-mono font-normal">
                    Gmail
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 truncate font-mono" dir="ltr">
                {currentUser.email}
              </div>
            </div>
          </div>

          {/* Quick Logout Button on Profile Card */}
          {onLogout && (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              title="تسجيل الخروج من الحساب"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/15 transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Sign In / Switch Account / Log Out */}
        {isLoggedIn ? (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onOpenLogin}
              className="py-1.5 px-2 bg-[#292423] hover:bg-[#ba9555]/20 border border-[#ba9555]/30 text-[#d8b36f] rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1"
              title="تبديل إلى حساب بريد آخر"
            >
              <LogIn className="w-3 h-3 text-[#ba9555]" />
              <span>تبديل الحساب</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="py-1.5 px-2 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 hover:text-red-200 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1"
              title="تسجيل الخروج من الحساب"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full py-2 px-3 bg-gradient-to-r from-[#ba9555] to-[#a88344] hover:from-[#c5a05f] hover:to-[#ba9555] text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول عبر Gmail</span>
            </button>
            <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
              <span>وضع المعاينة الافتراضي</span>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-gray-400 hover:text-red-400 flex items-center gap-0.5 transition"
                >
                  <LogOut className="w-2.5 h-2.5" />
                  <span>خروج</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-[#1e1b1b] border border-[#383231] rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-sm text-white">تأكيد تسجيل الخروج</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                هل أنت متأكد من رغبتك في تسجيل الخروج من حساب{' '}
                <span className="text-[#ba9555] font-semibold">{currentUser.name}</span>؟
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>نعم، تسجيل الخروج</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2 bg-[#2d2827] hover:bg-[#383231] text-gray-300 rounded-xl text-xs font-semibold transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
