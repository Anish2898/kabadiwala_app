import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Wallet, 
  Leaf, 
  Recycle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Lightbulb, 
  Coins, 
  ShieldCheck, 
  Compass, 
  Award 
} from 'lucide-react';
import { SCRAP_RATES_CATALOG } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    t, 
    setCurrentTab, 
    setScannerOpen, 
    setWithdrawModalOpen, 
    setScrapRatesModalOpen, 
    activePickup, 
    pickups, 
    setActivePickupId, 
    basket 
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const recentPickup = activePickup || pickups[0];

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Hero Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>{t('appName')} Eco Hub</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            {getGreeting()}, {user?.name.split(' ')[0] || 'Friend'}! 👋
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {t('taglineSubtitle')}
          </p>
        </div>

        {/* Eco Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#E8F5E9] px-3 py-1.5 rounded-2xl border border-emerald-200">
          <Award className="w-4 h-4 text-[#2E7D32]" />
          <div>
            <span className="text-[10px] text-emerald-800 block uppercase font-bold">
              {t('impactTierLabel')}
            </span>
            <span className="text-xs font-extrabold text-[#1B5E20]">
              {user?.impactTier || 'Circular Champion'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Pickup Spotlight Banner (if active collection in progress) */}
      {activePickup && activePickup.status !== 'Completed' && (
        <div 
          onClick={() => {
            setActivePickupId(activePickup.id);
            setCurrentTab('tracking');
          }}
          className="relative overflow-hidden bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/15 cursor-pointer group hover:scale-[1.01] transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                    Live Collection
                  </span>
                  <span className="text-xs text-emerald-100 font-medium">
                    ID: {activePickup.id}
                  </span>
                </div>
                <h3 className="font-extrabold text-base mt-1">
                  {activePickup.status} • {activePickup.collector.name}
                </h3>
                <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  ETA: ~{activePickup.currentEtaMinutes} mins ({activePickup.currentDistanceKm} km away)
                </p>
              </div>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-white text-[#1B5E20] font-extrabold text-xs flex items-center gap-1.5 shadow-md group-hover:bg-emerald-50 transition-colors shrink-0">
              <span>{t('trackLiveBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Massive Action Button: SCAN AN ITEM */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-500 rounded-3xl blur-sm opacity-40 group-hover:opacity-75 transition duration-300" />
        <button
          onClick={() => setScannerOpen(true)}
          className="relative w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-between gap-4 shadow-xl shadow-emerald-900/25 cursor-pointer hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Vision Recycler
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {t('scanAnItem')}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5 hidden sm:block">
                {t('scanSubtitle')}
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Bento Grid Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bento Card 1: Total Earnings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#E8F5E9] rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('totalEarnings')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#2E7D32]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                ₹{user?.walletBalance.toFixed(2) || '0.00'}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2E7D32] mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('earningsDelta')}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-emerald-100">
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{t('requestPayoutBtn')}</span>
            </button>
          </div>
        </div>

        {/* Bento Card 2: Items Recycled */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('itemsRecycled')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {user?.itemsRecycledCount || 0}
              </span>
              <span className="text-xs text-gray-500 ml-1.5 font-medium">items</span>
              <p className="text-xs text-gray-500 mt-1">
                {user?.totalRecycledKg.toFixed(1)} kg diverted from landfill
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-semibold">Plastics, Paper, Metal</span>
            <span className="text-[#2E7D32] font-bold">100% Circular</span>
          </div>
        </div>

        {/* Bento Card 3: KG CO₂ Saved */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('co2Saved')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-[#1B5E20] tracking-tight">
                {user?.co2SavedKg.toFixed(1) || '0.0'}
              </span>
              <span className="text-xs text-emerald-700 ml-1.5 font-bold">KG CO₂</span>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                {t('co2FormulaExplanation')}
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Equivalent to planting 3.2 mature trees</span>
          </div>
        </div>
      </div>

      {/* Scrap Rates Guide Banner */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-extrabold text-sm text-gray-900">
              {t('todaysScrapRates')}
            </h3>
          </div>
          <button
            onClick={() => setScrapRatesModalOpen(true)}
            className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllRates')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SCRAP_RATES_CATALOG.map((item) => (
            <div
              key={item.category}
              onClick={() => setScrapRatesModalOpen(true)}
              className="p-3 rounded-2xl bg-[#F8FAF8] border border-gray-200/80 hover:border-emerald-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase truncate">
                  {item.category.split(' ')[0]}
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {item.trend}
                </span>
              </div>
              <p className="text-sm font-extrabold text-[#1B5E20] group-hover:text-[#2E7D32]">
                {item.rate}
              </p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                {item.material.split(',')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip of the Day & Recent Pickups Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tip of the Day */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-5 border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-2">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>{t('tipOfTheDayTitle')}</span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {t('tipContent')}
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-800">
            <span>✨ Pro tip: Keeps your home odor-free and dry!</span>
          </div>
        </div>

        {/* Bento Card 4: Recent Pickups Preview */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm text-gray-900">
                {t('recentPickups')}
              </span>
              <button
                onClick={() => setCurrentTab('history')}
                className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
              >
                {t('viewAllHistory')}
              </button>
            </div>

            {recentPickup ? (
              <div 
                onClick={() => {
                  setActivePickupId(recentPickup.id);
                  setCurrentTab(recentPickup.status === 'Completed' ? 'history' : 'tracking');
                }}
                className="p-3 rounded-2xl bg-[#F8FAF8] border border-gray-200/80 hover:border-emerald-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">{recentPickup.pickupDate}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    recentPickup.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {recentPickup.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2E7D32]" />
                  <span>{recentPickup.placeType} • {recentPickup.timeSlot}</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-100">
                  <span>{recentPickup.items.length} scrap items</span>
                  <span className="font-extrabold text-[#1B5E20]">
                    ₹{recentPickup.payoutAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-3">No pickups yet. Schedule your first one!</p>
            )}
          </div>

          <div className="pt-3 mt-2">
            <button
              onClick={() => setCurrentTab('basket')}
              className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Current Basket ({basket.length} items)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
