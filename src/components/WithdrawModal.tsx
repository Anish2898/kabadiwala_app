import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Wallet, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  QrCode, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const { 
    withdrawModalOpen, 
    setWithdrawModalOpen, 
    user, 
    requestWithdrawal, 
    t 
  } = useApp();

  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [amount, setAmount] = useState<string>('');
  const [upiId, setUpiId] = useState('priya@okaxis');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!withdrawModalOpen) return null;

  const currentBalance = user?.walletBalance || 0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }

    if (numAmount > currentBalance) {
      setError(t('insufficientBalance'));
      return;
    }

    if (method === 'upi' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@okaxis).');
      return;
    }

    if (method === 'bank' && (!bankAccount.trim() || !ifsc.trim())) {
      setError('Please provide Bank Account Number and IFSC code.');
      return;
    }

    const details = method === 'upi' ? upiId : `A/C ending in ${bankAccount.slice(-4)}`;
    const ok = requestWithdrawal(numAmount, method === 'upi' ? 'UPI' : 'Bank IMPS', details);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setWithdrawModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {t('withdrawModalTitle')}
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                {t('withdrawSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setWithdrawModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-lg text-gray-900">Transfer Successful!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              {t('payoutSuccessMsg')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Balance Banner */}
            <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Available Wallet Balance
                </span>
                <span className="text-xl font-black text-[#1B5E20]">
                  ₹{currentBalance.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAmount(currentBalance.toString())}
                className="text-xs font-bold text-[#2E7D32] hover:underline bg-white px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer shadow-2xs"
              >
                Withdraw All
              </button>
            </div>

            {/* Amount input & quick chips */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                {t('withdrawAmountLabel')} *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 rounded-xl border border-gray-200 text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex gap-2 mt-2">
                {[100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(Math.min(currentBalance, preset).toString())}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Destination Tabs */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1.5">
                {t('selectMethodLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    method === 'upi'
                      ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    method === 'bank'
                      ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bank Account</span>
                </button>
              </div>
            </div>

            {/* Method Details inputs */}
            {method === 'upi' ? (
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={t('upiIdPlaceholder')}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block">
                    {t('accountNumberPlaceholder')}
                  </label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="e.g. 50100234123984"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block">
                    {t('ifscPlaceholder')}
                  </label>
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0001234"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-gray-50 focus:bg-white uppercase font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              {t('confirmWithdrawBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
