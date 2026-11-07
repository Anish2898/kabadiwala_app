import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Crosshair, 
  Check, 
  Home, 
  Building2, 
  Briefcase, 
  Navigation, 
  Sparkles 
} from 'lucide-react';

export const LocationSetupModal: React.FC = () => {
  const { 
    locationModalOpen, 
    setLocationModalOpen, 
    addAddress, 
    t 
  } = useApp();

  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number }>({
    lat: 17.4156,
    lng: 78.4357,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Office' | 'Workspace' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('500034');
  const [errorMsg, setErrorMsg] = useState('');

  if (!locationModalOpen) return null;

  // HTML5 Geolocation API
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setErrorMsg('');

    if (!navigator.geolocation) {
      simulateGpsAutoFill();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPinCoords({ lat: latitude, lng: longitude });
        reverseGeocodeSimulation(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error or permission denied, using simulated GPS coordinates', err);
        simulateGpsAutoFill();
      },
      { timeout: 7000 }
    );
  };

  const simulateGpsAutoFill = () => {
    setIsLocating(false);
    setPinCoords({ lat: 17.4239, lng: 78.4482 });
    setFlatNo('Plot 84, Green Acres');
    setStreet('Road No. 36, Jubilee Hills');
    setLandmark('Near Metro Station');
    setCity('Hyderabad');
    setState('Telangana');
    setPincode('500033');
  };

  const reverseGeocodeSimulation = (lat: number, lng: number) => {
    // Reverse geocode heuristic
    setFlatNo('Flat 204, Eco Enclave');
    setStreet('Gachibowli Main Rd');
    setLandmark('Opposite Biodiversity Park');
    setCity('Hyderabad');
    setState('Telangana');
    setPincode('500081');
  };

  // Interactive map click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Shift coordinates slightly
    setPinCoords({
      lat: 17.38 + (1 - y) * 0.1,
      lng: 78.35 + x * 0.15,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo.trim() || !street.trim()) {
      setErrorMsg('Please enter your house/flat number and street name.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit postal pincode.');
      return;
    }

    addAddress({
      line1: `${flatNo.trim()}, ${street.trim()}`,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      latitude: pinCoords.lat,
      longitude: pinCoords.lng,
      label,
    });

    setLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {t('setupLocationTitle')}
              </h3>
              <p className="text-[11px] text-emerald-100/80 font-medium">
                Accurate pin ensures fast doorstep arrival
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Map Visual */}
        <div
          onClick={handleMapClick}
          className="relative h-48 bg-[#E8F0E8] cursor-crosshair overflow-hidden border-b border-gray-200"
          title="Click to place entrance pin"
        >
          {/* Map roads background */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <rect width="400" height="200" fill="#E8F0E8" />
            <rect x="20" y="20" width="80" height="60" rx="10" fill="#C8E6C9" opacity="0.8" />
            <rect x="260" y="80" width="100" height="80" rx="15" fill="#C8E6C9" opacity="0.8" />
            <path d="M 0,60 L 400,60" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 0,140 L 400,140" stroke="#FFFFFF" strokeWidth="8" />
            <path d="M 120,0 L 120,200" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M 280,0 L 280,200" stroke="#FFFFFF" strokeWidth="5" />
          </svg>

          {/* Draggable/Clickable Pin in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="relative">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-500 opacity-75" />
              <div className="w-10 h-10 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shadow-xl border-3 border-white">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
            </div>
            <div className="mt-1 bg-white/95 px-2 py-0.5 rounded-full shadow text-[10px] font-black text-[#1B5E20] border border-gray-200">
              Pickup Point
            </div>
          </div>

          {/* Quick "Use Current Location" Floating Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUseCurrentLocation();
            }}
            disabled={isLocating}
            className="absolute bottom-3 right-3 bg-white hover:bg-emerald-50 text-[#1B5E20] font-bold text-xs py-2 px-3 rounded-xl shadow-md border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Crosshair className={`w-4 h-4 text-[#2E7D32] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t('locatingGps') : t('useCurrentLocationBtn')}</span>
          </button>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Place Label Radio Chips */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
              Address Label
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Home', 'Office', 'Workspace', 'Other'] as const).map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    label === l
                      ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#2E7D32]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l === 'Home' && <Home className="w-3.5 h-3.5" />}
                  {l === 'Office' && <Building2 className="w-3.5 h-3.5" />}
                  {l === 'Workspace' && <Briefcase className="w-3.5 h-3.5" />}
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block">
                {t('flatHouseNo')} *
              </label>
              <input
                type="text"
                required
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="e.g. Flat 402, Green Palm"
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block">
                {t('streetName')} *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Road No 12, Banjara Hills"
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block">
                {t('city')}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block">
                {t('state')}
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block">
                {t('pincode')} *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="500034"
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-600 block">
              {t('landmark')}
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Lotus Pond"
              className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 mt-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
          >
            {t('saveAddressBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};
