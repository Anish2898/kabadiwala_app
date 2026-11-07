import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  MapPin, 
  Scale, 
  Coins, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  X, 
  Award, 
  Leaf, 
  Printer 
} from 'lucide-react';
import { Pickup } from '../types';

export const HistoryView: React.FC = () => {
  const { 
    pickups, 
    setActivePickupId, 
    setCurrentTab, 
    t, 
    user 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<Pickup | null>(null);

  const filteredPickups = pickups.filter((p) => {
    if (activeFilter === 'active') return p.status !== 'Completed';
    if (activeFilter === 'completed') return p.status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {t('pickupHistoryTitle')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified records of collections, weighment receipts, and eco earnings.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {(['all', 'active', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-[#1B5E20] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter === 'all'
                ? t('filterAll')
                : filter === 'active'
                ? t('filterActive')
                : t('filterCompleted')}
            </button>
          ))}
        </div>
      </div>

      {/* Pickups List */}
      {filteredPickups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700">{t('noHistoryMsg')}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Book a doorstep collection to view invoices and records here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredPickups.map((pickup) => {
            const isCompleted = pickup.status === 'Completed';
            return (
              <div
                key={pickup.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">
                      {pickup.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-[#1B5E20]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pickup.status}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {pickup.pickupDate}
                  </span>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 bg-[#F8FAF8] p-3 rounded-2xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Time Slot
                    </span>
                    <span className="font-bold text-gray-800">{pickup.timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Place
                    </span>
                    <span className="font-bold text-gray-800">{pickup.placeType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      {t('verifiedWeightLabel')}
                    </span>
                    <span className="font-extrabold text-[#1B5E20]">
                      {pickup.finalVerifiedWeight > 0
                        ? `${pickup.finalVerifiedWeight} kg`
                        : `~${pickup.items.reduce((acc, i) => acc + i.estimatedWeightKg * i.quantity, 0).toFixed(1)} kg`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      {t('payoutCreditedLabel')}
                    </span>
                    <span className="font-black text-[#1B5E20]">
                      ₹{pickup.payoutAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="text-xs text-gray-500 flex items-center justify-between pt-1">
                  <div className="truncate max-w-sm">
                    <span className="font-semibold text-gray-700">Items: </span>
                    <span>
                      {pickup.items.map((i) => `${i.objectName} (x${i.quantity})`).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedReceipt(pickup)}
                      className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t('viewReceiptBtn')}</span>
                    </button>

                    {!isCompleted && (
                      <button
                        onClick={() => {
                          setActivePickupId(pickup.id);
                          setCurrentTab('tracking');
                        }}
                        className="py-1 px-2.5 rounded-lg bg-[#2E7D32] text-white font-bold text-xs hover:bg-[#1B5E20] transition-colors cursor-pointer"
                      >
                        Track Live
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Green Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto p-6 space-y-5">
            {/* Modal header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">
                    EcoPickup Green Receipt
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Ref: {selectedReceipt.id} • Certified Digital Weigher
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Certificate Stamp */}
            <div className="p-4 rounded-2xl bg-[#E8F5E9]/80 border border-emerald-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Official Circular Economy Receipt
              </span>
              <div className="text-2xl font-black text-[#1B5E20]">
                ₹{selectedReceipt.payoutAmount.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-900 font-medium">
                Credited to user wallet • Verified by {selectedReceipt.collector.name}
              </p>
            </div>

            {/* Line items table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase block">
                Collected Waste Breakdown
              </span>
              <div className="divide-y divide-gray-100 text-xs">
                {selectedReceipt.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{item.objectName}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.category} • Qty: {item.quantity} • ₹{item.estimatedPricePerKg}/kg
                      </p>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      ₹{item.estimatedPayout.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact metric */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-bold text-emerald-900">CO₂ Avoided</span>
              </div>
              <span className="font-black text-[#1B5E20]">
                ~{((selectedReceipt.finalVerifiedWeight || 6) * 1.2).toFixed(1)} kg CO₂
              </span>
            </div>

            {/* Close / Print actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
