import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  Home, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Coins, 
  Camera, 
  FileText 
} from 'lucide-react';
import { PlaceType } from '../types';

export const SchedulePickupView: React.FC = () => {
  const { 
    basket, 
    removeFromBasket, 
    updateBasketItemQuantity, 
    basketTotalWeightKg, 
    basketTotalEstimatedPayout, 
    addresses, 
    selectedAddressId, 
    setSelectedAddressId, 
    setLocationModalOpen, 
    setScannerOpen, 
    createPickup, 
    t 
  } = useApp();

  const [placeType, setPlaceType] = useState<PlaceType>('Home');
  const [selectedSlot, setSelectedSlot] = useState<string>(
    '10:00 AM - 12:00 PM'
  );
  const [notes, setNotes] = useState('');

  // Generate next 10 calendar days
  const daysList = React.useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const dayName = isToday
        ? 'Today'
        : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });
      list.push({
        id: i,
        fullString: `${dayName}, ${dateStr}`,
        dayName,
        dateStr,
        dayNumber: d.getDate(),
      });
    }
    return list;
  }, []);

  const [selectedDayString, setSelectedDayString] = useState<string>(
    daysList[0].fullString
  );

  const timeSlots = [
    { id: 'slot1', time: '08:00 AM - 10:00 AM', label: t('slot1') },
    { id: 'slot2', time: '10:00 AM - 12:00 PM', label: t('slot2') },
    { id: 'slot3', time: '02:00 PM - 04:00 PM', label: t('slot3') },
    { id: 'slot4', time: '04:00 PM - 06:00 PM', label: t('slot4') },
  ];

  const handleConfirmSchedule = () => {
    if (basket.length === 0) return;
    createPickup({
      addressId: selectedAddressId,
      pickupDate: selectedDayString,
      timeSlot: selectedSlot,
      placeType,
      notes: notes.trim() || undefined,
    });
  };

  if (basket.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto border border-emerald-200">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">
          {t('basketSummary')} is Empty
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          {t('emptyBasketMsg')}
        </p>
        <button
          onClick={() => setScannerOpen(true)}
          className="py-3 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{t('scanAnItem')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {t('schedulePickupTitle')}
        </h1>
        <p className="text-xs text-gray-600 mt-0.5">
          Review your recyclable items and book your doorstep collection slot.
        </p>
      </div>

      {/* 1. Basket Items Review */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-extrabold text-sm text-gray-900">
              {t('itemsInBasket')} ({basket.length})
            </h3>
          </div>
          <button
            onClick={() => setScannerOpen(true)}
            className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>
        </div>

        {/* Item Cards List */}
        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
          {basket.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.objectName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0">
                    Eco
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate">
                    {item.objectName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">
                      ₹{item.estimatedPricePerKg}/kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-0.5">
                  <button
                    onClick={() => updateBasketItemQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer shadow-2xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold px-1.5 min-w-[18px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateBasketItemQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center hover:bg-[#1B5E20] cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[55px]">
                  <span className="text-xs font-black text-gray-900 block">
                    ₹{item.estimatedPayout.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ~{(item.estimatedWeightKg * item.quantity).toFixed(2)} kg
                  </span>
                </div>

                <button
                  onClick={() => removeFromBasket(item.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary Banner */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 bg-[#E8F5E9]/60 p-3.5 rounded-2xl border border-emerald-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              {t('estTotalWeight')}
            </span>
            <div className="text-sm font-black text-[#1B5E20] flex items-center gap-1 mt-0.5">
              <Scale className="w-4 h-4 text-[#2E7D32]" />
              <span>~{basketTotalWeightKg} kg</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              {t('estTotalCash')}
            </span>
            <div className="text-sm font-black text-[#1B5E20] flex items-center justify-end gap-1 mt-0.5">
              <Coins className="w-4 h-4 text-[#2E7D32]" />
              <span>₹{basketTotalEstimatedPayout.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pickup Address Selection */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-extrabold text-sm text-gray-900">
              {t('selectAddressTitle')}
            </h3>
          </div>
          <button
            onClick={() => setLocationModalOpen(true)}
            className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
          >
            {t('addNewAddressBtn')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2E7D32] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                      {addr.label === 'Home' && <Home className="w-3.5 h-3.5 text-emerald-700" />}
                      {addr.label === 'Office' && <Building2 className="w-3.5 h-3.5 text-blue-700" />}
                      {addr.label === 'Workspace' && <Briefcase className="w-3.5 h-3.5 text-purple-700" />}
                      {addr.label}
                    </span>
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="accent-[#2E7D32] w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
                    {addr.line1}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Place Type Chips */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-gray-900">
          {t('placeTypeTitle')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['Home', 'Office', 'Workspace'] as PlaceType[]).map((type) => {
            const isSelected = placeType === type;
            return (
              <button
                key={type}
                onClick={() => setPlaceType(type)}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type === 'Home' && <Home className="w-4 h-4" />}
                {type === 'Office' && <Building2 className="w-4 h-4" />}
                {type === 'Workspace' && <Briefcase className="w-4 h-4" />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Date Picker (Next 10 Days Horizontal Scroll) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="font-extrabold text-sm text-gray-900">
            {t('selectDateTitle')}
          </h3>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {daysList.map((day) => {
            const isSelected = selectedDayString === day.fullString;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayString(day.fullString)}
                className={`flex-shrink-0 w-20 py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#2E7D32] bg-[#2E7D32] text-white shadow-md shadow-emerald-900/20'
                    : 'border-gray-200 hover:border-gray-300 bg-[#F8FAF8] text-gray-700'
                }`}
              >
                <span className="block text-[11px] font-semibold opacity-90">
                  {day.dayName}
                </span>
                <span className="block text-lg font-black my-0.5">
                  {day.dayNumber}
                </span>
                <span className="block text-[10px] font-medium opacity-80">
                  {day.dateStr.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Time Slots */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="font-extrabold text-sm text-gray-900">
            {t('selectSlotTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.time)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] font-bold shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="text-xs block font-bold">{slot.time}</span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {slot.label.split('(')[1]?.replace(')', '') || 'Standard'}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Special Collector Notes (Optional) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h3 className="font-extrabold text-xs text-gray-700">
            {t('collectorNotesTitle')}
          </h3>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('collectorNotesPlaceholder')}
          rows={2}
          className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent placeholder:text-gray-400 bg-[#F8FAF8]"
        />
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmSchedule}
        className="w-full py-4 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/25 transition-all cursor-pointer hover:scale-[1.01]"
      >
        <span>{t('confirmScheduleBtn')}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
