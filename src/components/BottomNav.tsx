import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Camera, 
  ShoppingBag, 
  Compass, 
  Clock, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    t, 
    basket, 
    activePickup, 
    setScannerOpen 
  } = useApp();

  const totalBasketItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  const isTrackingActive = activePickup && activePickup.status !== 'Completed';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEFF1] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'text-[#2E7D32] font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('navHome')}</span>
        </button>

        {/* Live Tracking */}
        <button
          onClick={() => setCurrentTab('tracking')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'tracking'
              ? 'text-[#2E7D32] font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${currentTab === 'tracking' ? 'stroke-[2.5]' : ''}`} />
            {isTrackingActive && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Track</span>
        </button>

        {/* Center Primary Action: Scan Camera FAB */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={() => setScannerOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#43A047] text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white"
            aria-label="Scan an Item"
          >
            <Camera className="w-7 h-7 stroke-[2.2]" />
          </button>
          <span className="text-[10px] font-extrabold text-[#1B5E20] mt-0.5 uppercase tracking-wider">
            {t('navScan')}
          </span>
        </div>

        {/* Basket */}
        <button
          onClick={() => setCurrentTab('basket')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'basket'
              ? 'text-[#2E7D32] font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentTab === 'basket' ? 'stroke-[2.5]' : ''}`} />
            {totalBasketItems > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 min-w-[16px] h-4 rounded-full bg-[#2E7D32] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                {totalBasketItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t('navBasket')}</span>
        </button>

        {/* History */}
        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'history'
              ? 'text-[#2E7D32] font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Clock className={`w-5 h-5 ${currentTab === 'history' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('navHistory')}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'text-[#2E7D32] font-bold'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <UserIcon className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
