import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  User, 
  Address, 
  ScannedItem, 
  Pickup, 
  PickupStatus, 
  PlaceType, 
  WalletTransaction, 
  NotificationItem 
} from '../types';
import { translations } from '../i18n/translations';
import { 
  INITIAL_USER, 
  INITIAL_ADDRESSES, 
  INITIAL_PICKUPS, 
  INITIAL_TRANSACTIONS 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, displayName?: string) => void;
  signup: (name: string, emailOrPhone: string) => void;
  demoLogin: () => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  
  // Addresses
  addresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (addr: Omit<Address, 'id' | 'userId'>) => Address;
  updateAddress: (id: string, partial: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  
  // Basket
  basket: ScannedItem[];
  addToBasket: (item: ScannedItem) => void;
  removeFromBasket: (id: string) => void;
  updateBasketItemQuantity: (id: string, delta: number) => void;
  updateBasketItem: (id: string, updated: Partial<ScannedItem>) => void;
  clearBasket: () => void;
  basketTotalWeightKg: number;
  basketTotalEstimatedPayout: number;
  
  // Pickups
  pickups: Pickup[];
  activePickupId: string | null;
  activePickup: Pickup | undefined;
  setActivePickupId: (id: string | null) => void;
  createPickup: (data: {
    addressId: string;
    pickupDate: string;
    timeSlot: string;
    placeType: PlaceType;
    notes?: string;
  }) => Pickup;
  simulateNextStep: (pickupId: string) => void;
  fastCompletePickup: (pickupId: string) => void;
  
  // Wallet & Transactions
  transactions: WalletTransaction[];
  requestWithdrawal: (amount: number, method: string, details: string) => boolean;
  
  // Navigation & Modals
  currentTab: 'home' | 'scan' | 'basket' | 'tracking' | 'history' | 'profile';
  setCurrentTab: (tab: 'home' | 'scan' | 'basket' | 'tracking' | 'history' | 'profile') => void;
  scannerOpen: boolean;
  setScannerOpen: (open: boolean) => void;
  locationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  withdrawModalOpen: boolean;
  setWithdrawModalOpen: (open: boolean) => void;
  scrapRatesModalOpen: boolean;
  setScrapRatesModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  activeScanResult: ScannedItem | null;
  setActiveScanResult: (item: ScannedItem | null) => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STATUS_ORDER: PickupStatus[] = [
  'Scheduled',
  'Collector Assigned',
  'On The Way',
  'Arrived',
  'Collected',
  'Weight Verified',
  'Payment Sent',
  'Completed',
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Localization
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ecopickup_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ecopickup_lang', lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return (dict as any)[key] || translations.en[key] || key;
  };

  // Auth & User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecopickup_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('ecopickup_user')) || true;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecopickup_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecopickup_user');
    }
  }, [user]);

  const login = (emailOrPhone: string, displayName?: string) => {
    let resolvedName = displayName;
    if (!resolvedName) {
      if (emailOrPhone.includes('@')) {
        const handle = emailOrPhone.split('@')[0];
        resolvedName = handle.charAt(0).toUpperCase() + handle.slice(1);
      } else {
        resolvedName = 'Eco User';
      }
    }

    const loggedUser: User = {
      ...INITIAL_USER,
      emailOrPhone,
      name: resolvedName,
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
  };

  const signup = (name: string, emailOrPhone: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || 'New Eco Champion',
      emailOrPhone,
      walletBalance: 50.0, // Welcome signup bonus
      totalRecycledKg: 0,
      co2SavedKg: 0,
      itemsRecycledCount: 0,
      impactTier: 'Eco Starter',
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    setLocationModalOpen(true); // Prompt location setup on fresh signup
  };

  const demoLogin = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthModalOpen(true);
  };

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('ecopickup_addrs');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || 'addr_home_01'
  );

  useEffect(() => {
    localStorage.setItem('ecopickup_addrs', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (addr: Omit<Address, 'id' | 'userId'>): Address => {
    const newAddr: Address = {
      ...addr,
      id: `addr_${Date.now()}`,
      userId: user?.id || 'usr_demo',
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
    return newAddr;
  };

  const updateAddress = (id: string, partial: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...partial } : a))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id && addresses.length > 1) {
      const next = addresses.find((a) => a.id !== id);
      if (next) setSelectedAddressId(next.id);
    }
  };

  // Basket / Cart
  const [basket, setBasket] = useState<ScannedItem[]>(() => {
    const saved = localStorage.getItem('ecopickup_basket');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecopickup_basket', JSON.stringify(basket));
  }, [basket]);

  const addToBasket = (item: ScannedItem) => {
    setBasket((prev) => {
      // If exact object name exists, increment quantity
      const existingIdx = prev.findIndex((i) => i.objectName === item.objectName);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const existing = copy[existingIdx];
        const newQty = existing.quantity + (item.quantity || 1);
        copy[existingIdx] = {
          ...existing,
          quantity: newQty,
          estimatedPayout: parseFloat(
            (existing.estimatedWeightKg * newQty * existing.estimatedPricePerKg).toFixed(2)
          ),
        };
        return copy;
      }
      return [item, ...prev];
    });
  };

  const removeFromBasket = (id: string) => {
    setBasket((prev) => prev.filter((i) => i.id !== id));
  };

  const updateBasketItemQuantity = (id: string, delta: number) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              estimatedPayout: parseFloat(
                (item.estimatedWeightKg * newQty * item.estimatedPricePerKg).toFixed(2)
              ),
            };
          }
          return item;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const updateBasketItem = (id: string, updated: Partial<ScannedItem>) => {
    setBasket((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updated } : i))
    );
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const basketTotalWeightKg = parseFloat(
    basket
      .reduce((sum, item) => sum + item.estimatedWeightKg * item.quantity, 0)
      .toFixed(2)
  );

  const basketTotalEstimatedPayout = parseFloat(
    basket
      .reduce((sum, item) => sum + item.estimatedPayout, 0)
      .toFixed(2)
  );

  // Pickups
  const [pickups, setPickups] = useState<Pickup[]>(() => {
    const saved = localStorage.getItem('ecopickup_pickups');
    return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
  });

  const [activePickupId, setActivePickupId] = useState<string | null>(
    INITIAL_PICKUPS[0]?.id || null
  );

  useEffect(() => {
    localStorage.setItem('ecopickup_pickups', JSON.stringify(pickups));
  }, [pickups]);

  const activePickup = pickups.find((p) => p.id === activePickupId);

  const createPickup = (data: {
    addressId: string;
    pickupDate: string;
    timeSlot: string;
    placeType: PlaceType;
    notes?: string;
  }): Pickup => {
    const selectedAddr =
      addresses.find((a) => a.id === data.addressId) || addresses[0];
    const newId = `PKP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPickup: Pickup = {
      id: newId,
      userId: user?.id || 'usr_demo',
      addressId: selectedAddr.id,
      address: selectedAddr,
      items: [...basket],
      pickupDate: data.pickupDate,
      timeSlot: data.timeSlot,
      placeType: data.placeType,
      status: 'Scheduled',
      finalVerifiedWeight: 0,
      payoutAmount: basketTotalEstimatedPayout,
      collector: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        rating: 4.9,
        vehicle: 'Electric Eco Van (EV-902)',
        totalPickups: 1420,
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      collectorCoords: {
        lat: selectedAddr.latitude + 0.015,
        lng: selectedAddr.longitude - 0.012,
      },
      currentEtaMinutes: 18,
      currentDistanceKm: 3.8,
      createdAt: new Date().toISOString(),
      notes: data.notes,
      stepperHistory: STATUS_ORDER.map((s, idx) => ({
        status: s,
        timestamp: idx === 0 ? 'Just now' : '--',
        completed: idx === 0,
      })),
    };

    setPickups((prev) => [newPickup, ...prev]);
    setActivePickupId(newId);
    clearBasket();
    setCurrentTab('tracking');

    addNotification({
      title: 'Pickup Scheduled 📦',
      message: `Your doorstep collection ${newId} is set for ${data.pickupDate} (${data.timeSlot}).`,
      type: 'pickup',
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    return newPickup;
  };

  const updatePickupStatus = (pickupId: string, nextStatus: PickupStatus) => {
    setPickups((prev) =>
      prev.map((p) => {
        if (p.id !== pickupId) return p;

        const currentIdx = STATUS_ORDER.indexOf(nextStatus);
        const timeNow = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Calculate progress coords closer to user address
        const progressFraction = Math.min(1, (currentIdx + 1) / STATUS_ORDER.length);
        const newCoords = {
          lat: p.collectorCoords.lat + (p.address.latitude - p.collectorCoords.lat) * 0.45,
          lng: p.collectorCoords.lng + (p.address.longitude - p.collectorCoords.lng) * 0.45,
        };
        const newEta = Math.max(0, Math.round(p.currentEtaMinutes * 0.6));
        const newDist = Math.max(0, parseFloat((p.currentDistanceKm * 0.6).toFixed(1)));

        const updatedHistory = p.stepperHistory.map((step) => {
          const stepIdx = STATUS_ORDER.indexOf(step.status);
          if (stepIdx <= currentIdx) {
            return {
              ...step,
              completed: true,
              timestamp: step.timestamp === '--' ? timeNow : step.timestamp,
            };
          }
          return step;
        });

        return {
          ...p,
          status: nextStatus,
          collectorCoords: newCoords,
          currentEtaMinutes: newEta,
          currentDistanceKm: newDist,
          stepperHistory: updatedHistory,
        };
      })
    );
  };

  const simulateNextStep = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target) return;

    const currentIdx = STATUS_ORDER.indexOf(target.status);
    if (currentIdx < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentIdx + 1];
      updatePickupStatus(pickupId, nextStatus);

      // If we reached Weight Verified or Payment Sent or Completed
      if (nextStatus === 'Weight Verified') {
        const verifiedWeight = parseFloat(
          (target.items.reduce((acc, i) => acc + i.estimatedWeightKg * i.quantity, 0) * 1.05).toFixed(2)
        ) || 6.8;
        const verifiedPayout = parseFloat(
          (verifiedWeight * 16).toFixed(2)
        ) || 108.80;

        setPickups((prev) =>
          prev.map((p) =>
            p.id === pickupId
              ? { ...p, finalVerifiedWeight: verifiedWeight, payoutAmount: verifiedPayout }
              : p
          )
        );
      }

      if (nextStatus === 'Payment Sent') {
        const amount = target.payoutAmount || 68.0;
        // Credit to wallet
        if (user) {
          const newBalance = parseFloat((user.walletBalance + amount).toFixed(2));
          const newWeight = parseFloat((user.totalRecycledKg + (target.finalVerifiedWeight || 5)).toFixed(2));
          const newCo2 = parseFloat((newWeight * 1.2).toFixed(2));
          const newCount = user.itemsRecycledCount + target.items.length;
          updateUser({
            walletBalance: newBalance,
            totalRecycledKg: newWeight,
            co2SavedKg: newCo2,
            itemsRecycledCount: newCount,
          });

          // Add transaction
          const newTxn: WalletTransaction = {
            id: `TXN-${Date.now().toString().slice(-4)}`,
            pickupId,
            type: 'credit',
            amount,
            description: `Scrap Payout for ${pickupId} (${target.finalVerifiedWeight || '6.8'} kg)`,
            timestamp: 'Just now',
            referenceId: `UPI-CR-${Math.floor(10000 + Math.random() * 90000)}`,
            status: 'Completed',
          };
          setTransactions((prev) => [newTxn, ...prev]);

          addNotification({
            title: `₹${amount.toFixed(2)} Credited! 💰`,
            message: `Verification complete for ${pickupId}. Funds added to your Eco Wallet.`,
            type: 'wallet',
          });

          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        }
      }
    }
  };

  const fastCompletePickup = (pickupId: string) => {
    STATUS_ORDER.forEach((status, idx) => {
      setTimeout(() => {
        updatePickupStatus(pickupId, status);
        if (status === 'Payment Sent') {
          simulateNextStep(pickupId);
        }
      }, idx * 300);
    });
  };

  // Wallet
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('ecopickup_txns');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('ecopickup_txns', JSON.stringify(transactions));
  }, [transactions]);

  const requestWithdrawal = (
    amount: number,
    method: string,
    details: string
  ): boolean => {
    if (!user || user.walletBalance < amount || amount <= 0) {
      return false;
    }

    const newBalance = parseFloat((user.walletBalance - amount).toFixed(2));
    updateUser({ walletBalance: newBalance });

    const newTxn: WalletTransaction = {
      id: `TXN-W${Date.now().toString().slice(-4)}`,
      type: 'withdrawal',
      amount,
      description: `Withdrawal via ${method} (${details})`,
      timestamp: 'Just now',
      method,
      referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
    };

    setTransactions((prev) => [newTxn, ...prev]);

    addNotification({
      title: 'Withdrawal Processed 💸',
      message: `₹${amount.toFixed(2)} transferred to ${details}.`,
      type: 'wallet',
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
      });
    } catch {}

    return true;
  };

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<
    'home' | 'scan' | 'basket' | 'tracking' | 'history' | 'profile'
  >('home');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [scrapRatesModalOpen, setScrapRatesModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeScanResult, setActiveScanResult] = useState<ScannedItem | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Scrap Metal Price Up +₹4/kg',
      message: 'Aluminium cans now earn up to ₹52/kg in your region.',
      timestamp: '2 hours ago',
      read: false,
      type: 'rate',
    },
    {
      id: 'notif_2',
      title: 'Eco Champion Streak 🔥',
      message: 'You have diverted 42 kg of recyclables from landfills!',
      timestamp: 'Yesterday',
      read: false,
      type: 'tip',
    },
  ]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (
    notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        isAuthenticated,
        login,
        signup,
        demoLogin,
        logout,
        updateUser,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        basket,
        addToBasket,
        removeFromBasket,
        updateBasketItemQuantity,
        updateBasketItem,
        clearBasket,
        basketTotalWeightKg,
        basketTotalEstimatedPayout,
        pickups,
        activePickupId,
        activePickup,
        setActivePickupId,
        createPickup,
        simulateNextStep,
        fastCompletePickup,
        transactions,
        requestWithdrawal,
        currentTab,
        setCurrentTab,
        scannerOpen,
        setScannerOpen,
        locationModalOpen,
        setLocationModalOpen,
        withdrawModalOpen,
        setWithdrawModalOpen,
        scrapRatesModalOpen,
        setScrapRatesModalOpen,
        authModalOpen,
        setAuthModalOpen,
        activeScanResult,
        setActiveScanResult,
        notifications,
        unreadNotificationCount,
        markAllNotificationsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
