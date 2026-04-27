'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { getFromErp, postToErp } from '@/lib/erp';

type Step = 'DATE' | 'DETAILS' | 'SUCCESS';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RegionRef =
  | string
  | {
      _id: string;
      name?: string;
      status?: string;
    };

interface ErpPackage {
  _id: string;
  name: string;
  price: number;
  advanceAmount: number;
  regionPrices?: Array<{
    region: RegionRef;
    price: number;
  }>;
}

interface ErpRegion {
  _id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface ErpBlockedDate {
  date: string;
  reason?: string;
  active?: boolean;
}

interface ErpPublicBooking {
  bookingDate?: string;
  selectedDates?: string[];
  status?: string;
}

interface CartItem {
  id: string;
  packageId: string;
}

const EXTRA_DATE_AMOUNT = 3000;
const BOOKING_CAPACITY_PER_DAY = 2;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const makeDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown[] }).items)) {
    return (value as { items: T[] }).items;
  }
  return [];
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('DATE');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingNumber, setBookingNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  const [packages, setPackages] = useState<ErpPackage[]>([]);
  const [regions, setRegions] = useState<ErpRegion[]>([]);
  const [blockedReasonByDate, setBlockedReasonByDate] = useState<Record<string, string>>({});
  const [fullyBookedDates, setFullyBookedDates] = useState<Set<string>>(new Set());

  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const themedFieldClass =
    'w-full bg-white border border-navy/10 px-4 py-3.5 text-sm text-navy focus:outline-none focus:border-gold transition-colors';

  const selectedDateKeys = useMemo(
    () => selectedDates.map((date) => makeDateKey(date)).sort(),
    [selectedDates]
  );

  const selectedRegion = useMemo(
    () => regions.find((region) => region._id === selectedRegionId) ?? null,
    [regions, selectedRegionId]
  );

  const packageById = useMemo(() => {
    const map = new Map<string, ErpPackage>();
    for (const item of packages) {
      map.set(item._id, item);
    }
    return map;
  }, [packages]);

  const getPackagePrice = (servicePackage: ErpPackage | undefined, regionId: string) => {
    if (!servicePackage) return 0;

    const regionalPrice = servicePackage.regionPrices?.find((entry) => {
      const regionValue = entry.region;
      const regionKey = typeof regionValue === 'string' ? regionValue : regionValue?._id;
      return String(regionKey ?? '') === String(regionId);
    });

    return Number(regionalPrice?.price ?? servicePackage.price) || 0;
  };

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const servicePackage = packageById.get(item.packageId);
        return sum + getPackagePrice(servicePackage, selectedRegionId);
      }, 0),
    [cartItems, packageById, selectedRegionId]
  );

  const cartAdvance = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const servicePackage = packageById.get(item.packageId);
        return sum + (Number(servicePackage?.advanceAmount) || 0);
      }, 0),
    [cartItems, packageById]
  );

  const extraDateCharge = Math.max(0, selectedDateKeys.length - 1) * EXTRA_DATE_AMOUNT;
  const totalPrice = cartSubtotal + extraDateCharge;

  const serviceSummary = useMemo(() => {
    const names = cartItems
      .map((item) => packageById.get(item.packageId)?.name ?? '')
      .filter(Boolean);
    return names.join(' + ');
  }, [cartItems, packageById]);

  // Reset and initialize modal data on open.
  useEffect(() => {
    if (!isOpen) return;

    setStep('DATE');
    setSelectedDates([]);
    setCurrentMonth(new Date());
    setBookingNumber('');
    setError('');
    setSubmitting(false);
    setLoadingData(true);

    const load = async () => {
      try {
        const [packagesResponse, regionsResponse, blockedDatesResponse, publicBookingsResponse] =
          await Promise.all([
            getFromErp<unknown>('/api/packages'),
            getFromErp<unknown>('/api/regions?active=true'),
            getFromErp<unknown>('/api/blocked-dates?active=true'),
            getFromErp<ErpPublicBooking[]>('/api/bookings/public'),
          ]);

        const packageItems = toArray<ErpPackage>(packagesResponse);
        const regionItems = toArray<ErpRegion>(regionsResponse).filter(
          (region) => region.status === 'active'
        );
        const blockedItems = toArray<ErpBlockedDate>(blockedDatesResponse).filter(
          (entry) => entry.active !== false
        );
        const bookings = Array.isArray(publicBookingsResponse) ? publicBookingsResponse : [];

        const blockedMap: Record<string, string> = {};
        for (const blocked of blockedItems) {
          const date = new Date(blocked.date);
          if (Number.isNaN(date.getTime())) continue;
          blockedMap[makeDateKey(date)] = blocked.reason?.trim() || 'Blocked by admin';
        }

        const bookingCountByDate = new Map<string, number>();
        for (const booking of bookings) {
          const status = String(booking.status ?? '').toLowerCase();
          if (status === 'cancelled' || status === 'completed') {
            continue;
          }

          const keys =
            Array.isArray(booking.selectedDates) && booking.selectedDates.length > 0
              ? booking.selectedDates
              : booking.bookingDate
                ? [booking.bookingDate]
                : [];

          for (const rawDate of keys) {
            const date = new Date(rawDate);
            if (Number.isNaN(date.getTime())) continue;
            const key = makeDateKey(date);
            bookingCountByDate.set(key, (bookingCountByDate.get(key) ?? 0) + 1);
          }
        }

        const fullDates = new Set<string>();
        for (const [key, count] of Array.from(bookingCountByDate.entries())) {
          if (count >= BOOKING_CAPACITY_PER_DAY) {
            fullDates.add(key);
          }
        }

        setPackages(packageItems);
        setRegions(regionItems);
        setBlockedReasonByDate(blockedMap);
        setFullyBookedDates(fullDates);

        setSelectedRegionId((prev) => prev || regionItems[0]?._id || '');
        setCartItems((prev) => {
          if (prev.length > 0) return prev;
          if (!packageItems[0]?._id) return [];

          return [
            {
              id: 'item-1',
              packageId: packageItems[0]._id,
            },
          ];
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load booking data');
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [isOpen]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDateKeys.length === 0) {
      setError('Please select at least one event date.');
      return;
    }

    if (!selectedRegionId || !selectedRegion) {
      setError('Please choose your region.');
      return;
    }

    const validCartItems = cartItems.filter((item) => item.packageId);
    if (validCartItems.length === 0) {
      setError('Please add at least one package.');
      return;
    }

    if (!serviceSummary) {
      setError('Please select at least one package service.');
      return;
    }

    setSubmitting(true);
    setError('');

    const orderedDates = [...selectedDateKeys].sort();
    const firstDate = parseDateKey(orderedDates[0]);
    const lastDate = parseDateKey(orderedDates[orderedDates.length - 1]);

    const serviceStart = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate(),
      9,
      0,
      0,
      0
    );
    const serviceEnd = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
      10,
      0,
      0,
      0
    );

    try {
      const booking = await postToErp({
        path: '/api/bookings/public',
        body: {
          customerName: formData.name,
          phone: formData.phone,
          email: formData.email,
          packageId: validCartItems[0].packageId,
          regionId: selectedRegionId,
          region: selectedRegion.name,
          service: serviceSummary,
          eventSlot: '',
          bookingDate: firstDate.toISOString(),
          selectedDates: orderedDates,
          serviceStart: serviceStart.toISOString(),
          serviceEnd: serviceEnd.toISOString(),
          totalPrice,
          advanceAmount: cartAdvance,
          status: 'pending',
          source: 'website-booking',
          bookingItems: validCartItems.map((item) => {
            const servicePackage = packageById.get(item.packageId);

            return {
              packageId: item.packageId,
              service: servicePackage?.name ?? 'Package',
              eventSlot: '',
              selectedDates: orderedDates,
              totalPrice: getPackagePrice(servicePackage, selectedRegionId),
              advanceAmount: Number(servicePackage?.advanceAmount) || 0,
            };
          }),
        },
      });

      setBookingNumber(String(booking.bookingNumber || 'Pending'));
      setStep('SUCCESS');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const key = makeDateKey(date);
    const today = startOfDay(new Date());

    if (date < today) return;
    if (blockedReasonByDate[key] || fullyBookedDates.has(key)) return;

    setSelectedDates((prev) => {
      const exists = prev.some((entry) => makeDateKey(entry) === key);
      if (exists) {
        return prev.filter((entry) => makeDateKey(entry) !== key);
      }

      return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
    });
  };

  const addCartItem = () => {
    const defaultPackageId = packages[0]?._id;
    if (!defaultPackageId) return;

    setCartItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        packageId: defaultPackageId,
      },
    ]);
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      >
        <div className="absolute inset-0 bg-navy/80 backdrop-blur-xl" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[1080px] bg-cream overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] border border-white/10"
          style={{ minHeight: '560px' }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-navy/40 hover:text-navy transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col lg:flex-row h-full overflow-y-auto max-h-[90vh]">
            {step !== 'SUCCESS' && (
              <div className="hidden lg:flex w-1/3 bg-navy p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
                    Exclusive Experience
                  </span>
                  <h2 className="font-display text-4xl text-white font-light leading-tight mb-6">
                    Build Your <br />
                    <span className="italic text-gold">Booking Cart</span>
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed font-light">
                    Select region, combine packages, lock your dates, then submit one premium booking request.
                  </p>
                </div>

                <div className="relative z-10 space-y-6 pt-12 border-t border-white/10">
                  <div className="flex items-center gap-4 text-white/60">
                    <CheckCircle2 size={18} className="text-gold" />
                    <span className="text-xs tracking-wide">Realtime Package Pricing</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <CheckCircle2 size={18} className="text-gold" />
                    <span className="text-xs tracking-wide">Region-aware Booking</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <CheckCircle2 size={18} className="text-gold" />
                    <span className="text-xs tracking-wide">Calendar Capacity Guard</span>
                  </div>
                </div>

                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />
              </div>
            )}

            <div className={`flex-1 p-8 lg:p-14 bg-white ${step === 'SUCCESS' ? 'lg:p-20' : ''}`}>
              <AnimatePresence mode="wait">
                {step === 'DATE' && (
                  <motion.div
                    key="step-date"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-8">
                      <h3 className="font-display text-2xl text-navy mb-2">1. Select Dates</h3>
                      <p className="text-navy/50 text-sm">
                        Available dates come from backend blocked days and public booking capacity.
                      </p>
                    </div>

                    {loadingData ? (
                      <div className="text-sm text-navy/60 border border-navy/10 bg-navy/[0.02] p-4">
                        Syncing packages, regions, and availability...
                      </div>
                    ) : (
                      <>
                        <div className="max-w-md mx-auto lg:mx-0">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-navy font-semibold tracking-wide">
                              {monthName} {year}
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gold/10 rounded-full transition-colors text-gold"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gold/10 rounded-full transition-colors text-gold"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                              <div
                                key={d}
                                className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.1em] py-2"
                              >
                                {d}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDayOfMonth(currentMonth) }).map((_, i) => (
                              <div key={`empty-${i}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                              const day = i + 1;
                              const date = new Date(
                                currentMonth.getFullYear(),
                                currentMonth.getMonth(),
                                day
                              );
                              const key = makeDateKey(date);
                              const isSelected = selectedDateKeys.includes(key);
                              const isToday = key === makeDateKey(new Date());
                              const isPast = startOfDay(date) < startOfDay(new Date());
                              const blockedReason = blockedReasonByDate[key];
                              const isFull = fullyBookedDates.has(key);
                              const isLocked = isPast || Boolean(blockedReason) || isFull;

                              let title = '';
                              if (blockedReason) title = blockedReason;
                              if (isFull) title = 'Fully booked';
                              if (isPast) title = 'Past date';

                              return (
                                <button
                                  key={day}
                                  onClick={() => handleDateClick(day)}
                                  title={title}
                                  disabled={isLocked}
                                  className={`aspect-square flex items-center justify-center text-sm transition-all duration-300 relative group
                                  ${isSelected ? 'bg-navy text-white' : 'text-navy'}
                                  ${!isSelected && !isLocked ? 'hover:bg-gold/10' : ''}
                                  ${isToday && !isSelected ? 'text-gold font-bold' : ''}
                                  ${isLocked ? 'text-navy/25 cursor-not-allowed bg-navy/[0.03]' : ''}
                                `}
                                >
                                  {day}
                                  {isToday && !isSelected && !isLocked && (
                                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-6 space-y-2 text-xs text-navy/60">
                          <p>
                            Selected days: <span className="text-navy font-semibold">{selectedDateKeys.length}</span>
                          </p>
                          <p>Extra dates are charged at {currencyFormatter.format(EXTRA_DATE_AMOUNT)} each.</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep('DETAILS')}
                          disabled={selectedDateKeys.length === 0}
                          className="mt-8 w-full bg-navy text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500"
                        >
                          Continue to Details
                        </button>
                      </>
                    )}
                  </motion.div>
                )}

                {step === 'DETAILS' && (
                  <motion.div
                    key="step-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-10 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl text-navy mb-2">2. Booking Details</h3>
                        <p className="text-navy/50 text-sm">
                          Dates:{' '}
                          <span className="text-gold font-medium">
                            {selectedDateKeys.length > 0
                              ? selectedDateKeys
                                  .map((key) =>
                                    parseDateKey(key).toLocaleDateString('default', {
                                      dateStyle: 'medium',
                                    })
                                  )
                                  .join(', ')
                              : 'None selected'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => setStep('DATE')}
                        className="text-[10px] uppercase tracking-widest text-gold font-bold border-b border-gold/40 hover:border-gold transition-all"
                      >
                        Change Dates
                      </button>
                    </div>

                    <form onSubmit={handleConfirmBooking} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Full Name</label>
                          <div className="relative">
                            <User
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50"
                              size={16}
                            />
                            <input
                              required
                              type="text"
                              placeholder="e.g. Sarah Johnson"
                              className="w-full bg-white border border-navy/10 pl-11 pr-4 py-3.5 text-sm text-navy focus:outline-none focus:border-gold transition-colors"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Phone Number</label>
                          <div className="relative">
                            <Phone
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50"
                              size={16}
                            />
                            <input
                              required
                              type="tel"
                              placeholder="+91 00000 00000"
                              className="w-full bg-white border border-navy/10 pl-11 pr-4 py-3.5 text-sm text-navy focus:outline-none focus:border-gold transition-colors"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Email Address</label>
                        <div className="relative">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50"
                            size={16}
                          />
                          <input
                            required
                            type="email"
                            placeholder="sarah@example.com"
                            className="w-full bg-white border border-navy/10 pl-11 pr-4 py-3.5 text-sm text-navy focus:outline-none focus:border-gold transition-colors"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">Region</label>
                        <select
                          required
                          className={`${themedFieldClass} appearance-none cursor-pointer`}
                          value={selectedRegionId}
                          onChange={(e) => setSelectedRegionId(e.target.value)}
                        >
                          <option value="" disabled>
                            Select your region
                          </option>
                          {regions.map((region) => (
                            <option key={region._id} value={region._id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3 border border-navy/10 p-4 bg-navy/[0.02]">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-widest text-navy/50 font-bold">
                            Booking Cart
                          </p>
                          <button
                            type="button"
                            onClick={addCartItem}
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold font-bold"
                          >
                            <Plus size={12} /> Add Package
                          </button>
                        </div>

                        {cartItems.map((item, index) => {
                          return (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border border-navy/10 p-3 bg-white">
                              <div className="md:col-span-10 space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-navy/40 font-bold">
                                  Package {index + 1}
                                </label>
                                <select
                                  value={item.packageId}
                                  onChange={(e) =>
                                    updateCartItem(item.id, { packageId: e.target.value })
                                  }
                                  className={`${themedFieldClass} appearance-none cursor-pointer`}
                                >
                                  {packages.map((servicePackage) => (
                                    <option key={servicePackage._id} value={servicePackage._id}>
                                      {servicePackage.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                                {cartItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCartItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remove package"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border border-gold/20 bg-gold/[0.06] p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-navy/80 font-semibold">Total Advance</span>
                          <span className="text-gold font-semibold">{currencyFormatter.format(cartAdvance)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || loadingData}
                        className="w-full bg-navy text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-navy transition-all duration-500 flex items-center justify-center gap-3 mt-4 group disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Confirm & Pay Advance'}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                      {error ? (
                        <p className="text-sm text-red-600" role="alert">
                          {error}
                        </p>
                      ) : null}
                    </form>
                  </motion.div>
                )}

                {step === 'SUCCESS' && (
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle2 size={48} className="text-gold" />
                      </motion.div>
                      <div className="absolute inset-0 border border-gold/20 rounded-full animate-ping opacity-20" />
                    </div>

                    <h2 className="font-display text-4xl text-navy mb-4">Request Submitted!</h2>
                    <p className="text-navy/50 text-sm max-w-sm mb-12">
                      Your booking is now pending CRM verification. We&apos;ve recorded your preferred region and package cart.
                    </p>

                    <div className="w-full max-w-md bg-navy/[0.02] border border-navy/5 p-8 space-y-6 mb-12">
                      <div className="flex justify-between items-center text-sm border-b border-navy/5 pb-4">
                        <span className="text-navy/40 font-medium">Services</span>
                        <span className="text-navy font-semibold text-right">{serviceSummary}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-navy/5 pb-4">
                        <span className="text-navy/40 font-medium">Region</span>
                        <span className="text-navy font-semibold">{selectedRegion?.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-navy/5 pb-4">
                        <span className="text-navy/40 font-medium">Dates</span>
                        <span className="text-navy font-semibold text-right">
                          {selectedDateKeys
                            .map((key) =>
                              parseDateKey(key).toLocaleDateString('default', {
                                dateStyle: 'medium',
                              })
                            )
                            .join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-navy/5 pb-4">
                        <span className="text-navy/40 font-medium">Advance</span>
                        <span className="text-gold font-semibold">{currencyFormatter.format(cartAdvance)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-navy/40 font-medium">Booking ID</span>
                        <span className="text-navy font-semibold text-gold">#{bookingNumber}</span>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="px-10 py-4 bg-gold text-navy text-[10px] font-bold tracking-widest uppercase hover:bg-gold-light transition-colors"
                    >
                      Back to Home
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
