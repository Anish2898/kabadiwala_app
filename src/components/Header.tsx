import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { languages } from '../i18n/translations';
import { 
  Recycle, 
  Bell, 
  User as UserIcon, 
  Wallet, 
  MapPin, 
  Globe, 
  ChevronDown, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    user, 
    setCurrentTab, 
    setAuthModalOpen, 
    setWithdrawModalOpen, 
    notifications, 
    unreadNotificationCount, 
    markAllNotificationsRead,
    addresses,
    selectedAddressId
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0E0E0] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-[#1B5E20] tracking-tight">
                  {t('appName')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-emerald-200">
                  AI Doorstep
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block line-clamp-1">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Center: Language Dropdown Box */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAF8] hover:bg-emerald-50 text-gray-800 rounded-xl border border-gray-200 hover:border-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="px-1.5 py-0.2 rounded-md bg-[#E8F5E9] text-[#1B5E20] text-[10px] font-extrabold">
                {currentLangObj.scriptBadge}
              </span>
              <span className="font-bold text-gray-800">{currentLangObj.native}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu List */}
            {langDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Choose Language / భాష / भाषा
                </div>
                <div className="py-1">
                  {languages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E8F5E9] text-[#1B5E20] font-bold'
                            : 'text-gray-700 hover:bg-gray-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center ${
                            isSelected ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {lang.scriptBadge}
                          </span>
                          <div>
                            <span className="block font-bold">{lang.native}</span>
                            <span className="block text-[10px] text-gray-400">{lang.name}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#2E7D32]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Wallet Balance, Notifications & User Avatar */}
          <div className="flex items-center gap-2">
            {/* Quick Wallet pill */}
            {user && (
              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#1B5E20] hover:bg-emerald-100 transition-colors border border-emerald-200/60 font-semibold text-xs cursor-pointer"
                title="Click to withdraw funds"
              >
                <Wallet className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>₹{user.walletBalance.toFixed(2)}</span>
                <span className="text-[10px] bg-[#2E7D32] text-white px-1.5 py-0.2 rounded-full font-bold">
                  Cash
                </span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) markAllNotificationsRead();
                }}
                className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Notifications Popup */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-bold text-sm text-gray-800">Notifications</span>
                    <span className="text-[11px] text-gray-500 font-medium">EcoPickup Dispatch</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 py-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2 px-1 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 w-2 h-2 rounded-full bg-[#2E7D32] shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{n.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full mt-2 py-1.5 text-center text-xs text-[#2E7D32] font-semibold hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            {user ? (
              <button
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2E7D32] to-[#81C784] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-0.5">{user.impactTier}</p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar for Current Location Display on Mobile */}
        {activeAddress && (
          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-gray-100 text-[11px] text-gray-500">
            <div className="flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3 h-3 text-[#2E7D32] shrink-0" />
              <span className="font-semibold text-gray-700">{activeAddress.label}:</span>
              <span className="truncate">{activeAddress.line1}, {activeAddress.city}</span>
            </div>
            <span className="shrink-0 text-[10px] bg-emerald-50 text-emerald-800 font-medium px-1.5 py-0.2 rounded border border-emerald-100">
              Pin: {activeAddress.pincode}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
