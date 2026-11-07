import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Minus, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Scale, 
  Coins, 
  Lightbulb, 
  X 
} from 'lucide-react';
import { ScannedItem } from '../types';

export const ScanResultModal: React.FC = () => {
  const { 
    activeScanResult, 
    setActiveScanResult, 
    addToBasket, 
    setCurrentTab, 
    setScannerOpen, 
    t 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [editableItem, setEditableItem] = useState<ScannedItem | null>(null);

  // Sync state whenever result changes
  React.useEffect(() => {
    if (activeScanResult) {
      setQuantity(activeScanResult.quantity || 1);
      setEditableItem({ ...activeScanResult });
    }
  }, [activeScanResult]);

  if (!activeScanResult || !editableItem) return null;

  const currentItem = editableItem;
  const isRecyclable = currentItem.isRecyclable;

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
    const updatedPayout = parseFloat(
      (currentItem.estimatedWeightKg * newQty * currentItem.estimatedPricePerKg).toFixed(2)
    );
    setEditableItem({
      ...currentItem,
      quantity: newQty,
      estimatedPayout: updatedPayout,
    });
  };

  const handleAddAndScanAnother = () => {
    addToBasket({
      ...currentItem,
      quantity,
    });
    setActiveScanResult(null);
    setScannerOpen(true);
  };

  const handleProceedToSchedule = () => {
    addToBasket({
      ...currentItem,
      quantity,
    });
    setActiveScanResult(null);
    setCurrentTab('basket');
  };

  const handleClose = () => {
    setActiveScanResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Header Bar */}
        <div
          className={`p-5 flex items-center justify-between ${
            isRecyclable
              ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white'
              : 'bg-gradient-to-r from-red-600 to-rose-700 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isRecyclable ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {isRecyclable ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isRecyclable ? t('recyclableTitle') : t('nonRecyclableTitle')}
              </h3>
              <p className="text-[11px] opacity-90 font-medium">
                {isRecyclable ? t('recyclableBadge') : t('nonRecyclableBadge')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Item Preview Card */}
          <div className="flex gap-4 items-start bg-[#F8FAF8] p-3.5 rounded-2xl border border-gray-200">
            {currentItem.imageUrl ? (
              <img
                src={currentItem.imageUrl}
                alt={currentItem.objectName}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-200 shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-emerald-100 flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0 border border-emerald-200">
                Eco Scan
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {currentItem.category}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {Math.round(currentItem.confidence * 100)}% match
                </span>
              </div>
              <h4 className="font-extrabold text-gray-900 text-base truncate">
                {currentItem.objectName}
              </h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {currentItem.material}
              </p>
            </div>
          </div>

          {/* If Recyclable: Grid of metrics & quantity */}
          {isRecyclable ? (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#E8F5E9] p-3 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {t('estWeightLabel')}
                  </span>
                  <div className="text-sm font-extrabold text-[#1B5E20] mt-1 flex items-center justify-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{currentItem.estimatedWeightRangeKg}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {t('estRateLabel')}
                  </span>
                  <div className="text-sm font-extrabold text-[#1B5E20] mt-1 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-700" />
                    <span>₹{currentItem.estimatedPricePerKg}/kg</span>
                  </div>
                </div>

                <div className="bg-gradient-to-tr from-emerald-600 to-green-600 text-white p-3 rounded-2xl shadow-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-100 block">
                    {t('estPayoutLabel')}
                  </span>
                  <div className="text-sm font-extrabold mt-1">
                    ₹{currentItem.estimatedPayout.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quantity Counter & Edit Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">
                    {t('quantityLabel')}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Adjust count of identical items
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-base text-gray-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center hover:bg-[#1B5E20] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Practical Tip */}
              {currentItem.recyclingTip && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      {t('recyclingGuidance')}
                    </span>
                    <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                      {currentItem.recyclingTip}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Non-Recyclable Warnings & Guidance */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <span className="text-xs font-bold text-red-900 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {t('nonRecyclableReasonTitle')}
                </span>
                <p className="text-xs text-red-800 leading-relaxed mt-1">
                  {currentItem.reasonIfNotRecyclable ||
                    'This material cannot be processed by standard mechanical doorstep recycling due to multi-layer composite bonding or contamination hazards.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  {t('nonRecyclableDisposalTitle')}
                </span>
                <p className="text-xs text-amber-800 leading-relaxed mt-1">
                  {currentItem.recyclingTip ||
                    'Please dispose in non-recyclable domestic dry waste or consult municipality drop-off centers.'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {isRecyclable ? (
              <>
                <button
                  onClick={handleProceedToSchedule}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer hover:translate-y-[-1px]"
                >
                  <span>{t('proceedToScheduleBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddAndScanAnother}
                  className="w-full py-3 px-4 rounded-2xl bg-[#E8F5E9] hover:bg-emerald-100 text-[#1B5E20] font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('scanAnotherBtn')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveScanResult(null);
                    setScannerOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('scanAnotherBtn')}</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl text-gray-500 hover:text-gray-800 font-semibold text-xs text-center transition-colors cursor-pointer"
                >
                  {t('returnHomeBtn')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
