import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  Package, 
  Cpu, 
  Wine, 
  ShieldCheck, 
  Lightbulb 
} from 'lucide-react';
import { SCRAP_RATES_CATALOG } from '../data/mockData';

export const ScrapRatesModal: React.FC = () => {
  const { scrapRatesModalOpen, setScrapRatesModalOpen, t, setScannerOpen } = useApp();

  if (!scrapRatesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {t('todaysScrapRates')}
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                Fair market rates benchmarked weekly across southern recycling yards
              </p>
            </div>
          </div>
          <button
            onClick={() => setScrapRatesModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <Sparkles className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>
              Certified electronic digital scales used for all collections. Zero deductions or round-offs.
            </span>
          </div>

          <div className="space-y-3">
            {SCRAP_RATES_CATALOG.map((cat) => (
              <div
                key={cat.category}
                className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-200/90 hover:border-emerald-300 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-gray-900">
                      {cat.category}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1B5E20]">
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">
                    {cat.material}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-[#1B5E20] block">
                    {cat.rate}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {cat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tips for maximum payout */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-extrabold flex items-center gap-1.5 text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              How to get top scrap payout:
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
              <li>Rinse containers with cold water so plastics are non-greasy.</li>
              <li>Flatten cardboard shipping boxes to maximize van load efficiency.</li>
              <li>Keep dry paper separated from wet organic kitchen waste.</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setScrapRatesModalOpen(false);
              setScannerOpen(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Scan Waste to Check Rate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
