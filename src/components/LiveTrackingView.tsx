import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Play, 
  FastForward, 
  Sparkles, 
  Award, 
  Scale, 
  Coins, 
  AlertCircle, 
  ExternalLink, 
  Truck 
} from 'lucide-react';
import { PickupStatus } from '../types';

export const LiveTrackingView: React.FC = () => {
  const { 
    activePickup, 
    pickups, 
    setActivePickupId, 
    simulateNextStep, 
    fastCompletePickup, 
    t, 
    user 
  } = useApp();

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // If no active pickup, fall back to first one
  const targetPickup = activePickup || pickups[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && targetPickup && targetPickup.status !== 'Completed') {
      timer = setTimeout(() => {
        simulateNextStep(targetPickup.id);
      }, 2500);
    } else if (targetPickup?.status === 'Completed') {
      setIsAutoPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, targetPickup?.status]);

  if (!targetPickup) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-lg font-bold text-gray-800">No Active Collection Found</h2>
        <p className="text-xs text-gray-500 mt-1">
          Schedule a collection from the home dashboard or basket.
        </p>
      </div>
    );
  }

  const stepsList: {
    status: PickupStatus;
    title: string;
    desc: string;
  }[] = [
    { status: 'Scheduled', title: t('stepScheduled'), desc: t('stepScheduledDesc') },
    { status: 'Collector Assigned', title: t('stepCollectorAssigned'), desc: t('stepCollectorAssignedDesc') },
    { status: 'On The Way', title: t('stepOnTheWay'), desc: t('stepOnTheWayDesc') },
    { status: 'Arrived', title: t('stepArrived'), desc: t('stepArrivedDesc') },
    { status: 'Collected', title: t('stepCollected'), desc: t('stepCollectedDesc') },
    { status: 'Weight Verified', title: t('stepWeightVerified'), desc: t('stepWeightVerifiedDesc') },
    { status: 'Payment Sent', title: t('stepPaymentSent'), desc: t('stepPaymentSentDesc') },
    { status: 'Completed', title: t('stepCompleted'), desc: t('stepCompletedDesc') },
  ];

  const currentStepIdx = stepsList.findIndex((s) => s.status === targetPickup.status);

  // Animated vehicle progress percentage for the map
  const routeProgressPercent = Math.min(
    100,
    Math.round(((currentStepIdx + 1) / stepsList.length) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28">
      {/* Pickup Header / ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {t('liveTrackingTitle')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('pickupIdLabel')}: <span className="font-bold text-gray-800">{targetPickup.id}</span> •{' '}
            {targetPickup.pickupDate} ({targetPickup.timeSlot})
          </p>
        </div>

        {/* Switch pickup if multiple */}
        {pickups.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {pickups.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePickupId(p.id)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  p.id === targetPickup.id
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ETA Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-3xl p-5 shadow-lg shadow-emerald-950/15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Truck className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-200 block">
              Doorstep Collector Status
            </span>
            <h3 className="font-extrabold text-base sm:text-lg">
              {targetPickup.status === 'Completed'
                ? 'Doorstep Collection Completed 🎉'
                : `${targetPickup.status}`}
            </h3>
            <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {targetPickup.status === 'Completed' ? (
                <span>Payment credited to your digital wallet</span>
              ) : (
                <span>
                  ETA ~{targetPickup.currentEtaMinutes} mins • {targetPickup.currentDistanceKm} km away
                </span>
              )}
            </p>
          </div>
        </div>

        {targetPickup.status !== 'Completed' && (
          <div className="hidden sm:block text-right shrink-0">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">
              Estimated Payout
            </span>
            <span className="text-xl font-black">
              ₹{targetPickup.payoutAmount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Map Visual with Route and Animated Collector Vehicle */}
      <div className="relative bg-[#E8F5E9]/50 rounded-3xl border border-emerald-200/80 overflow-hidden shadow-xs h-72 sm:h-80">
        {/* Styled SVG Map Roads, Green Parks & Waterways */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 600 300"
        >
          {/* Base Background Grid / City Blocks */}
          <rect width="600" height="300" fill="#E8F0E8" />

          {/* Green parks */}
          <rect x="40" y="20" width="120" height="90" rx="15" fill="#C8E6C9" opacity="0.7" />
          <rect x="420" y="160" width="140" height="100" rx="20" fill="#C8E6C9" opacity="0.7" />
          <rect x="250" y="10" width="80" height="60" rx="10" fill="#D4EDDA" opacity="0.6" />

          {/* Lake/Waterway */}
          <path
            d="M 500,0 Q 530,60 560,110 T 600,160 L 600,0 Z"
            fill="#B2DFDB"
            opacity="0.6"
          />

          {/* City secondary streets */}
          <path d="M 0,80 L 600,80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M 0,220 L 600,220" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M 120,0 L 120,300" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M 380,0 L 380,300" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M 480,0 L 480,300" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

          {/* Main Transit Avenue */}
          <path d="M 0,150 L 600,150" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <path d="M 220,0 L 220,300" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />

          {/* Active Navigation Route Curve */}
          <path
            d="M 80,180 C 140,180 180,150 240,150 S 340,120 440,120 S 480,180 520,200"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 80,180 C 140,180 180,150 240,150 S 340,120 440,120 S 480,180 520,200"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="5"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Recycling Depot Hub Pin (Origin) */}
        <div className="absolute left-16 top-36 sm:top-40 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
            <RecycleIcon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold bg-white/90 px-1.5 py-0.5 rounded shadow-xs text-gray-700 mt-1 border border-gray-200">
            Eco Depot #4
          </span>
        </div>

        {/* User Destination Residence Pin */}
        <div className="absolute right-12 sm:right-16 bottom-16 sm:bottom-20 flex flex-col items-center z-10">
          <div className="relative">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
            <div className="relative w-10 h-10 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-sm shadow-xl border-3 border-white">
              <MapPin className="w-5 h-5 fill-white" />
            </div>
          </div>
          <span className="text-[10px] font-black bg-[#1B5E20] text-white px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
            {targetPickup.placeType}: {targetPickup.address.line1.slice(0, 18)}...
          </span>
        </div>

        {/* Animated Collector Vehicle Marker moving along the route */}
        <div
          className="absolute z-20 transition-all duration-1000 ease-in-out flex flex-col items-center"
          style={{
            left: `${Math.min(84, Math.max(16, 16 + (routeProgressPercent / 100) * 68))}%`,
            top: `${Math.min(70, Math.max(30, 48 - Math.sin((routeProgressPercent / 100) * Math.PI) * 15))}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulsing GPS ring */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-14 h-14 rounded-full bg-emerald-500/30 animate-ping" />
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-2xl border-2 border-[#2E7D32] flex items-center justify-center text-[#1B5E20]">
              <Truck className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md border border-gray-200 text-center">
            <span className="text-[10px] font-extrabold text-gray-900 block leading-tight">
              {targetPickup.collector.name}
            </span>
            <span className="text-[9px] font-semibold text-[#2E7D32]">
              {targetPickup.collector.vehicle.split('(')[0]}
            </span>
          </div>
        </div>

        {/* Live GPS Radar Badge in top corner */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-gray-200 flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
          <Navigation className="w-3.5 h-3.5 text-[#2E7D32] animate-pulse" />
          <span>Real-time Telemetry Active</span>
        </div>
      </div>

      {/* Collector Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={targetPickup.collector.photoUrl}
            alt={targetPickup.collector.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-gray-900">
                {targetPickup.collector.name}
              </h3>
              <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                ★ {targetPickup.collector.rating}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('assignedCollector')} • {targetPickup.collector.totalPickups}+ collections
            </p>
            <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">
              Vehicle: {targetPickup.collector.vehicle}
            </p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`tel:${targetPickup.collector.phone.replace(/\s+/g, '')}`}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t('callCollectorBtn')}</span>
          </a>

          <button
            onClick={() => alert(`Direct in-app messaging with collector Rajesh Kumar:\n"Hello Rajesh, scrap is packed and ready at entrance."`)}
            className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('chatBtn')}</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="font-extrabold text-sm text-gray-900">
            Collection Journey (8 Stages)
          </h3>
          <span className="text-xs font-bold text-[#2E7D32]">
            Stage {currentStepIdx + 1} of {stepsList.length}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
          {stepsList.map((step, idx) => {
            const isPassed = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Stepper Dot */}
                <div
                  className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isPassed
                      ? 'bg-[#2E7D32] text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 animate-pulse'
                      : 'bg-white border-2 border-gray-300 text-transparent'
                  }`}
                >
                  {(isPassed || isCurrent) && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold leading-none ${
                        isCurrent
                          ? 'text-[#1B5E20] font-black'
                          : isPassed
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20]">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    {step.desc}
                  </p>

                  {/* If Weight Verified stage is current or passed, show verified metrics */}
                  {step.status === 'Weight Verified' && (isPassed || isCurrent) && targetPickup.finalVerifiedWeight > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>Certified Digital Weight: {targetPickup.finalVerifiedWeight} kg</span>
                      <span>Rate Applied: ₹{targetPickup.payoutAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demonstration Simulator Controls Dock */}
      <div className="bg-[#F8FAF8] rounded-3xl p-5 border-2 border-dashed border-emerald-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1B5E20]">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t('simulationTitle')}</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Explore complete lifecycle testing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => simulateNextStep(targetPickup.id)}
            disabled={targetPickup.status === 'Completed'}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-[#1B5E20] font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t('simulateNextStep')}</span>
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={targetPickup.status === 'Completed'}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-200'
            }`}
          >
            <span>{isAutoPlaying ? 'Pause Auto-Play' : t('autoPlaySim')}</span>
          </button>

          <button
            onClick={() => fastCompletePickup(targetPickup.id)}
            disabled={targetPickup.status === 'Completed'}
            className="py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{t('completeNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline helper
function RecycleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.583-.938 1.8 1.8 0 0 0-.05-1.844L17 10" />
      <path d="m15.5 12 3.5-5 3.5 5" />
      <path d="M12 2v4" />
      <path d="m8 6 4-4 4 4" />
    </svg>
  );
}
