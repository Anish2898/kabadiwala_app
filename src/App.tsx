import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { SchedulePickupView } from './components/SchedulePickupView';
import { LiveTrackingView } from './components/LiveTrackingView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { ScannerModal } from './components/ScannerModal';
import { ScanResultModal } from './components/ScanResultModal';
import { LocationSetupModal } from './components/LocationSetupModal';
import { WithdrawModal } from './components/WithdrawModal';
import { ScrapRatesModal } from './components/ScrapRatesModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#1A1C19] flex flex-col font-sans selection:bg-[#2E7D32] selection:text-white">
      {/* Top Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {currentTab === 'home' && <DashboardView />}
        {currentTab === 'basket' && <SchedulePickupView />}
        {currentTab === 'tracking' && <LiveTrackingView />}
        {currentTab === 'history' && <HistoryView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Fullscreen / Global Modals */}
      <ScannerModal />
      <ScanResultModal />
      <LocationSetupModal />
      <WithdrawModal />
      <ScrapRatesModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
