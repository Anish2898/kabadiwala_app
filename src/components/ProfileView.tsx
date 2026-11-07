import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { languages } from '../i18n/translations';
import { 
  User as UserIcon, 
  Wallet, 
  MapPin, 
  Globe, 
  Bell, 
  LogOut, 
  Coins, 
  Award, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    logout, 
    language, 
    setLanguage, 
    addresses, 
    deleteAddress, 
    setLocationModalOpen, 
    setWithdrawModalOpen, 
    transactions, 
    t 
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [rateAlertsEnabled, setRateAlertsEnabled] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {t('profileTitle')}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your circular wallet, regional language, and collection addresses.
        </p>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#81C784] text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-950/15">
            {user?.name.slice(0, 2).toUpperCase() || 'EP'}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-black text-gray-900">{user?.name}</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20] border border-emerald-200">
                Verified Eco Citizen
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.emailOrPhone}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#2E7D32]" />
                {user?.impactTier || 'Circular Champion'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-600 font-semibold">
                {user?.totalRecycledKg.toFixed(1)} kg recycled
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('logoutBtn')}</span>
        </button>
      </div>

      {/* Digital Wallet Card */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white rounded-3xl p-6 shadow-xl shadow-emerald-950/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-200" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
              {t('walletBalanceTitle')}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
            Direct UPI & Bank
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-3xl sm:text-4xl font-black tracking-tight">
              ₹{user?.walletBalance.toFixed(2) || '0.00'}
            </span>
            <span className="text-xs text-emerald-100/90 ml-2 font-semibold">
              Available Cash
            </span>
          </div>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-white text-[#1B5E20] font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <Coins className="w-4 h-4 text-[#2E7D32]" />
            <span>{t('withdrawFundsBtn')}</span>
          </button>
        </div>

        {/* Mini transactions breakdown */}
        <div className="pt-3 border-t border-white/15 text-xs text-emerald-100/90 flex items-center justify-between">
          <span>Recent Transactions: {transactions.length}</span>
          <span className="text-emerald-200 font-bold">Zero Platform Fees</span>
        </div>
      </div>

      {/* Language Preference Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="font-extrabold text-sm text-gray-900">
            {t('activeLanguagesTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] font-extrabold shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-[#F8FAF8]'
                }`}
              >
                <span className="block text-sm font-black">{lang.native}</span>
                <span className="block text-[11px] text-gray-500 mt-0.5">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Addresses Manager */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-extrabold text-sm text-gray-900">
              {t('savedAddressesTitle')} ({addresses.length})
            </h3>
          </div>
          <button
            onClick={() => setLocationModalOpen(true)}
            className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addNewAddressBtn')}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-gray-200/80 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#1B5E20]">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  {addr.line1}, {addr.city} - {addr.pincode}
                </p>
              </div>

              {addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Bell className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="font-extrabold text-sm text-gray-900">
            {t('notificationsSetting')}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">
                {t('pickupStatusAlerts')}
              </p>
              <p className="text-[11px] text-gray-500">
                Instant updates when the collector is en route and arrives.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="accent-[#2E7D32] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-800">
                {t('scrapRateAlerts')}
              </p>
              <p className="text-[11px] text-gray-500">
                Alerts when local metal and plastic recycling prices increase.
              </p>
            </div>
            <input
              type="checkbox"
              checked={rateAlertsEnabled}
              onChange={() => setRateAlertsEnabled(!rateAlertsEnabled)}
              className="accent-[#2E7D32] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
