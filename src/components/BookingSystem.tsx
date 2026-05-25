import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  Trash2, 
  Award, 
  Star,
  DollarSign,
  ChevronRight,
  AlertCircle,
  X,
  CreditCard,
  Ticket
} from 'lucide-react';
import { SALON_STYLISTS, SERVICE_PACKAGES, KRONE_PRODUCTS } from '../data';
import { Product, Stylist, ServicePackage, Booking } from '../types';
import { playChime, playSnip } from '../utils/audio';

interface BookingSystemProps {
  initialAddons: Product[];
  onRemoveAddon: (product: Product) => void;
  onClearAddons: () => void;
  onBookingComplete: () => void;
}

export default function BookingSystem({
  initialAddons,
  onRemoveAddon,
  onClearAddons,
  onBookingComplete
}: BookingSystemProps) {
  // Booking Form States
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage>(SERVICE_PACKAGES[0]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist>(SALON_STYLISTS[1]); // Decides on Serena Vance (Hair Botox Expert)
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Customer details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');

  // Cart list
  const [addons, setAddons] = useState<Product[]>(initialAddons);

  // States
  const [bookingStep, setBookingStep] = useState<number>(1); // Step 1: Package & Addons, Step 2: Date & Stylist, Step 3: Contacts & Checkout
  const [holdTimer, setHoldTimer] = useState<number>(300); // 5 minute countdown
  const [isSlotLocked, setIsSlotLocked] = useState<boolean>(false);
  const [simulatedLoadProgress, setSimulatedLoadProgress] = useState<number>(0);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  
  // Validation feedback
  const [validationError, setValidationError] = useState<string>('');

  // Update local addons when props change
  useEffect(() => {
    setAddons(initialAddons);
  }, [initialAddons]);

  // Hold Timer countdown
  useEffect(() => {
    if (bookingStep >= 2 && holdTimer > 0) {
      const interval = setInterval(() => {
        setHoldTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [bookingStep, holdTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate 7 upcoming safe dates
  const getUpcomingDates = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Start from tomorrow
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const dayName = days[d.getDay()];
      const dateNum = d.getDate();
      const monthName = months[d.getMonth()];
      const fullString = `${dayName}, ${monthName} ${dateNum}`;
      
      dates.push({
        dayName,
        dateNum,
        monthName,
        fullString,
        standardISO: d.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const datesList = getUpcomingDates();

  // Pick first available date on load
  useEffect(() => {
    if (datesList.length > 0 && !selectedDate) {
      // Find a day available for our stylist
      const availableDate = datesList.find(d => selectedStylist.availableDays.includes(d.dayName));
      if (availableDate) {
        setSelectedDate(availableDate.standardISO);
        setSelectedTime(selectedStylist.timeSlots[0]);
      } else {
        setSelectedDate(datesList[0].standardISO);
        setSelectedTime(selectedStylist.timeSlots[0]);
      }
    }
  }, [selectedStylist]);

  // Adjust time slot selection when date or stylist shifts
  const handleStylistChange = (stylist: Stylist) => {
    setSelectedStylist(stylist);
    // Auto-select a date matching stylist availability
    const matchDate = datesList.find(d => stylist.availableDays.includes(d.dayName));
    if (matchDate) {
      setSelectedDate(matchDate.standardISO);
    }
    setSelectedTime(stylist.timeSlots[0]);
    playChime();
  };

  // Calculations
  const addonsTotal = addons.reduce((sum, p) => sum + p.price, 0);
  const packageCost = selectedPkg.price;
  const totalCost = packageCost + addonsTotal;

  // Next steps click handlers
  const handleNextStep = () => {
    setValidationError('');
    
    if (bookingStep === 1) {
      setBookingStep(2);
      playChime();
    } else if (bookingStep === 2) {
      if (!selectedDate) {
        setValidationError('Please select an appointment date.');
        return;
      }
      if (!selectedTime) {
        setValidationError('Please select a preferred time slot.');
        return;
      }
      setBookingStep(3);
      playChime();
    }
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
      playChime();
    }
  };

  // Save selection confirmation of booking
  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName.trim()) {
      setValidationError('Please specify your luxury membership or full name.');
      return;
    }
    if (!customerPhone.trim()) {
      setValidationError('Please provide a secure contact phone number.');
      return;
    }
    if (!customerEmail.trim()) {
      setValidationError('Please input your electronic notification email address.');
      return;
    }

    // Begin simulated transaction loading block
    setIsSlotLocked(true);
    let speed = 0;
    const progressInterval = setInterval(() => {
      speed += 12;
      setSimulatedLoadProgress(Math.min(speed, 100));
      if (speed >= 100) {
        clearInterval(progressInterval);
        
        // Generate actual confirmed appointment receipt structure
        const nextBooking: Booking = {
          id: `KRN-${Math.floor(Math.random() * 900000 + 100000)}`,
          customerName,
          customerPhone,
          customerEmail,
          stylist: selectedStylist,
          service: selectedPkg,
          date: selectedDate,
          timeSlot: selectedTime,
          addons: [...addons],
          totalPrice: totalCost,
          status: 'confirmed',
          timestamp: new Date().toISOString()
        };

        // Cache persistent bookings table locally
        const cached = localStorage.getItem('muskan_luxury_appointments');
        const appointmentsList = cached ? JSON.parse(cached) : [];
        appointmentsList.unshift(nextBooking);
        localStorage.setItem('muskan_luxury_appointments', JSON.stringify(appointmentsList));

        // State confirm transition
        setCompletedBooking(nextBooking);
        setIsSlotLocked(false);
        onClearAddons();
        playChime();
      }
    }, 280);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-brand-teal-950 border border-brand-teal-800/40 rounded-3xl overflow-hidden shadow-2xl selection:bg-brand-teal-700">
      
      {/* 1. PROGRESS BAR RAIL */}
      <div className="border-b border-brand-teal-900 bg-brand-teal-950/60 p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide">
            Muskan Virtual Reservation Desk
          </h2>
          <p className="text-xs text-brand-teal-300 font-sans mt-0.5">
            Configure, schedule, and finalize secure styling reservations in minutes.
          </p>
        </div>
        
        {/* Step circles */}
        {!completedBooking && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition ${
                    bookingStep === step 
                      ? 'bg-gold-500 text-brand-teal-950 border-2 border-gold-400 font-extrabold' 
                      : bookingStep > step 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-brand-teal-900 border border-brand-teal-800 text-brand-teal-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 transition ${
                    bookingStep > step ? 'bg-emerald-600' : 'bg-brand-teal-900'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ERROR FEEDBACK BAR */}
      {validationError && (
        <div className="bg-red-950/70 border-b border-red-800/50 p-3 px-5 flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 2. REALTIME TIMER LOCK BANNER */}
      {bookingStep >= 2 && !completedBooking && (
        <div className="bg-brand-teal-900/40 p-2.5 px-5 flex justify-between items-center text-xs border-b border-brand-teal-900">
          <div className="flex items-center gap-2 text-brand-teal-200">
            <Clock className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
            <span>Time-sensitive hold active on premium salon chair</span>
          </div>
          <div className="font-mono text-gold-500 font-bold bg-brand-teal-950 border border-gold-500/20 px-2 py-0.5 rounded">
            HOLD WINDOW: {formatTimer(holdTimer)}
          </div>
        </div>
      )}

      {/* 3. CORE MULTI-STEP RENDER CONTAINER */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SERVICE SELECTION & ADDON INSPECTOR */}
          {bookingStep === 1 && !completedBooking && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-serif text-base font-semibold text-white mb-3">
                  Step 1: Choose Your Core Stylistic Package
                </h3>
                
                {/* Package Cards list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SERVICE_PACKAGES.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        id={`package-${pkg.id}`}
                        onClick={() => { setSelectedPkg(pkg); playChime(); }}
                        className={`border rounded-2xl p-4 cursor-pointer relative flex flex-col justify-between transition duration-300 ${
                          isSelected 
                            ? 'border-gold-500 bg-brand-teal-900/40 shadow-lg shadow-gold-950/10' 
                            : 'border-brand-teal-900 hover:border-brand-teal-800 bg-brand-teal-900/10 hover:bg-brand-teal-900/20'
                        }`}
                      >
                        {pkg.isRecommended && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-gold-600 text-brand-teal-950 text-[9px] uppercase tracking-wider font-extrabold rounded-full">
                            ★★ Highly Recommended ★★
                          </span>
                        )}

                        <div>
                          <p className="font-mono text-[10px] text-brand-teal-400 font-bold uppercase tracking-wider mb-1">
                            {pkg.duration}
                          </p>
                          <h4 className="font-serif text-sm font-semibold text-white mb-2 leading-tight">
                            {pkg.title}
                          </h4>
                          <p className="text-[11px] text-brand-teal-200 line-clamp-3 leading-relaxed mb-4">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-brand-teal-800/40 flex items-center justify-between mt-auto">
                          <span className="font-sans text-xs text-brand-teal-300">Total treatment cost:</span>
                          <span className="font-serif text-base font-extrabold text-gold-200">${pkg.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Package Inclusion check Sheet */}
              <div className="bg-brand-teal-950 border border-brand-teal-900 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-teal-900">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span className="text-white font-serif font-bold uppercase tracking-wider">
                    Therapuetic Inclusions in "{selectedPkg.title}":
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-zinc-300">
                  {selectedPkg.includes.map((inc, ii) => (
                    <div key={ii} className="flex gap-2 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons summary sub panel */}
              <div>
                <h3 className="font-serif text-base font-semibold text-white mb-3">
                  Complementary Muskan Formulation Addons
                </h3>
                
                {addons.length === 0 ? (
                  <div className="border border-dashed border-brand-teal-900 rounded-2xl p-5 text-center text-xs text-brand-teal-400">
                    <p>No product addons attached yet.</p>
                    <p className="text-[10px] opacity-80 mt-1">
                      You can attach hair treatment bottles directly from the <strong>Muskan Display</strong> in the 3D showroom layout above!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addons.map((addPr) => (
                      <div 
                        key={addPr.id} 
                        className="flex items-center justify-between p-3 bg-brand-teal-900/20 border border-brand-teal-900 rounded-xl hover:border-brand-teal-800 transition text-xs"
                      >
                        <div className="mr-3">
                          <p className="font-semibold text-white">{addPr.name}</p>
                          <p className="text-[10px] text-brand-teal-400">Standard {addPr.volume} • Shelf {addPr.shelf} Specimen</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gold-300">${addPr.price}</span>
                          <button
                            onClick={() => { onRemoveAddon(addPr); playSnip(); }}
                            className="p-1 text-brand-teal-400 hover:text-red-400 transition"
                            title="Remove Addon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Finalized calculations block */}
              <div className="bg-brand-teal-900/30 p-4 border border-brand-teal-800/40 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] text-brand-teal-400 block uppercase font-mono">Current estimation:</span>
                  <p className="text-xs text-brand-teal-200 mt-0.5">
                    Package <span className="text-white font-semibold">${packageCost}</span> + Formulation Addons <span className="text-white font-semibold">${addonsTotal}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-brand-teal-400 block uppercase font-mono">Total Order:</span>
                    <span className="font-serif text-xl font-black text-gold-500">${totalCost}</span>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="p-3 px-6 bg-gold-500 hover:bg-gold-600 text-brand-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    Select Stylist <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* STEP 2: STYLIST & CALENDAR SELECTION */}
          {bookingStep === 2 && !completedBooking && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              
              {/* Backtrack indicator helper */}
              <button
                onClick={handlePrevStep}
                className="text-xs text-brand-teal-300 hover:text-white flex items-center gap-1 transition"
              >
                ← Back to Service Packages
              </button>

              {/* STYLIST SELECTOR */}
              <div>
                <h3 className="font-serif text-base font-semibold text-white mb-3">
                  Step 2: Entrust Your Locks to an Elite Stylist
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {SALON_STYLISTS.map((stylist) => {
                    const isSelected = selectedStylist.id === stylist.id;
                    return (
                      <div
                        key={stylist.id}
                        id={`stylist-${stylist.id}`}
                        onClick={() => handleStylistChange(stylist)}
                        className={`border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition duration-300 ${
                          isSelected 
                            ? 'border-gold-500 bg-brand-teal-900/40 shadow-lg' 
                            : 'border-brand-teal-900 hover:border-brand-teal-800 bg-brand-teal-900/10'
                        }`}
                      >
                        {/* Stylist Headshot Image */}
                        <div className="h-32 w-full relative overflow-hidden bg-brand-teal-950">
                          <img 
                            src={stylist.image} 
                            alt={stylist.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale brightness-90 contrast-110 hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-teal-950 to-transparent" />
                          <div className="absolute bottom-2 inset-x-2 flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-brand-teal-100 font-mono uppercase bg-brand-teal-900/80 px-2 py-0.5 rounded border border-brand-teal-800/40">
                              {stylist.experience} EXP
                            </span>
                            <div className="bg-brand-teal-900/80 px-1.5 py-0.5 rounded flex items-center gap-1 border border-brand-teal-800/40">
                              <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
                              <span className="text-[9px] font-bold text-white leading-none">{stylist.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description bio */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-xs font-bold text-white tracking-wider uppercase mb-0.5">{stylist.name}</h4>
                            <p className="text-[10px] text-brand-teal-300 font-mono leading-none">{stylist.role}</p>
                            <p className="text-[11px] text-zinc-300 italic mt-2 leading-tight">
                              "{stylist.specialty}"
                            </p>
                          </div>

                          {/* Days availability mini tagger */}
                          <div className="mt-3 pt-2 border-t border-brand-teal-800/30 flex justify-between items-center">
                            <span className="text-[9px] text-brand-teal-400 font-mono tracking-wider uppercase">Availability:</span>
                            <span className="text-[9px] font-bold text-teal-300 font-mono">
                              {stylist.availableDays.join(' • ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CALENDAR & TIMESLOT MATRIX FOR THE SELECTED STYLIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Available reservation Dates selection */}
                <div className="bg-brand-teal-900/10 border border-brand-teal-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 pb-1 border-b border-brand-teal-900">
                    <CalendarIcon className="w-4 h-4 text-gold-500" />
                    <span className="font-serif text-sm font-semibold text-white">Preferred Date</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {datesList.map((dateObj) => {
                      const isAvailable = selectedStylist.availableDays.includes(dateObj.dayName);
                      const isPicked = selectedDate === dateObj.standardISO;
                      
                      return (
                        <button
                          key={dateObj.standardISO}
                          disabled={!isAvailable}
                          onClick={() => { setSelectedDate(dateObj.standardISO); playChime(); }}
                          className={`p-2.5 rounded-xl flex flex-col items-center justify-center border transition ${
                            isPicked 
                              ? 'border-gold-500 bg-gold-500 text-brand-teal-950 font-bold' 
                              : isAvailable 
                              ? 'border-brand-teal-800 bg-brand-teal-900/30 text-brand-teal-100 hover:border-brand-teal-700' 
                              : 'border-brand-teal-950 bg-black/10 text-brand-teal-500 opacity-30 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-[9px] font-mono uppercase tracking-wider block">{dateObj.dayName}</span>
                          <span className="text-base font-extrabold block -my-px font-sans">{dateObj.dateNum}</span>
                          <span className="text-[9px] block uppercase">{dateObj.monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-brand-teal-400 mt-2.5 block text-center font-mono uppercase">
                    ★ Stylist only accepts appointments on available highlighted days.
                  </span>
                </div>

                {/* Available Hours list */}
                <div className="bg-brand-teal-900/10 border border-brand-teal-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 pb-1 border-b border-brand-teal-900">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span className="font-serif text-sm font-semibold text-white">Preferred Time Slot</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStylist.timeSlots.map((time) => {
                      const isPicked = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => { setSelectedTime(time); playChime(); }}
                          className={`p-3 rounded-xl border font-mono text-xs transition ${
                            isPicked 
                              ? 'border-gold-500 bg-gold-500 text-brand-teal-950 font-bold' 
                              : 'border-brand-teal-800 bg-brand-teal-900/30 text-brand-teal-200 hover:border-brand-teal-700 hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedDate && (
                    <div className="mt-4 p-2 bg-brand-teal-950 rounded-lg text-[10px] text-center text-teal-300 font-mono tracking-wide border border-brand-teal-900">
                      ★ REALTIME: Serena Vance has 3 appointments currently pending on this calendar day.
                    </div>
                  )}
                </div>

              </div>

              {/* Navigation trigger button */}
              <div className="pt-4 border-t border-brand-teal-900 flex justify-end gap-2">
                <button
                  onClick={handleNextStep}
                  className="p-3 px-6 bg-gold-500 hover:bg-gold-600 text-brand-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  Confirm Slot, Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 3: GUEST CONTACTS CODES & CONFIRM PAYMENTS */}
          {bookingStep === 3 && !completedBooking && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button
                onClick={handlePrevStep}
                className="text-xs text-brand-teal-300 hover:text-white flex items-center gap-1 transition"
              >
                ← Back to Stylist Schedule
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* GUEST DETAILS INPUT (7 Columns) */}
                <form onSubmit={handleCompletePayment} className="md:col-span-7 bg-brand-teal-900/10 border border-brand-teal-900 p-5 rounded-2xl space-y-4">
                  <h3 className="font-serif text-sm font-semibold text-white border-b border-brand-teal-950 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" /> Secure Guest Registration
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-brand-teal-300 font-mono block uppercase mb-1">Membership or Guest Name:</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Caroline Astor" 
                        required
                        className="w-full p-2.5 rounded-lg border border-brand-teal-800 bg-brand-teal-950 text-white text-xs placeholder:text-brand-teal-600 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-brand-teal-300 font-mono block uppercase mb-1">Direct Callback Mobile:</label>
                        <input 
                          type="tel" 
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+1 (555) 234-5678" 
                          required
                          className="w-full p-2.5 rounded-lg border border-brand-teal-800 bg-brand-teal-950 text-white text-xs placeholder:text-brand-teal-600 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-brand-teal-300 font-mono block uppercase mb-1">Receipt Email Address:</label>
                        <input 
                          type="email" 
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="caroline@astorluxe.com" 
                          required
                          className="w-full p-2.5 rounded-lg border border-brand-teal-800 bg-brand-teal-950 text-white text-xs placeholder:text-brand-teal-600 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic card payment simulator */}
                  <div className="pt-4 border-t border-brand-teal-950">
                    <h4 className="font-serif text-xs font-bold text-white mb-2 leading-none">Virtual Appointment Guarantee</h4>
                    <p className="text-[10px] text-brand-teal-400 leading-relaxed mb-3">
                      Your booking is guaranteed through our secure luxury sandbox. No immediate credit charge will happen until services occur in-suite.
                    </p>
                    <div className="p-3 bg-brand-teal-950 rounded-xl border border-brand-teal-800/40 flex items-center justify-between text-xs text-brand-teal-200">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gold-500" />
                        <span className="font-mono">SANDBOX SECURE RESERVATION</span>
                      </div>
                      <span className="font-semibold text-emerald-400">FREE GUARANTEE</span>
                    </div>
                  </div>

                  {/* Submit checkout button */}
                  <button
                    type="submit"
                    disabled={isSlotLocked}
                    className="w-full mt-2 py-3 bg-gold-500 hover:bg-gold-600 text-brand-teal-950 font-bold font-sans text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSlotLocked ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-brand-teal-950 border-t-transparent" />
                        Securing Luxurious Slot...
                      </>
                    ) : (
                      <>
                        Secure Booking Confirmation • ${totalCost}
                      </>
                    )}
                  </button>
                </form>

                {/* BOOKING SUMMARY TARIFF (5 Columns) */}
                <div className="md:col-span-5 bg-gradient-to-br from-brand-teal-900/30 to-brand-teal-950/40 border border-brand-teal-800/40 p-4 rounded-2xl flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-white border-b border-brand-teal-950 pb-2 mb-3">
                      Tariff Ledger
                    </h3>

                    <div className="space-y-2 mb-4">
                      {/* Stylist Summary block */}
                      <div className="flex items-center gap-2 pb-2 border-b border-brand-teal-950">
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-gold-500">
                          <img src={selectedStylist.image} alt={selectedStylist.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-serif text-[11px] font-bold text-white uppercase leading-none">{selectedStylist.name}</p>
                          <p className="text-[9px] text-brand-teal-400 font-mono uppercase mt-0.5">{selectedStylist.role}</p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex justify-between items-center bg-brand-teal-950/60 p-2 border border-brand-teal-900 rounded-lg font-mono">
                        <div>
                          <span className="text-[9px] text-brand-teal-400 block uppercase">Scheduled Date:</span>
                          <span className="font-semibold text-white">{selectedDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-brand-teal-400 block uppercase">Time Slot:</span>
                          <span className="font-semibold text-gold-200">{selectedTime}</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-brand-teal-300">Core Package:</span>
                        <span className="font-semibold text-white">${selectedPkg.price}</span>
                      </div>
                      
                      {addons.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-brand-teal-950">
                          <span className="text-brand-teal-400 font-mono text-[10px] block uppercase">Addon Supplements:</span>
                          {addons.map(add => (
                            <div key={add.id} className="flex justify-between text-[11px] text-zinc-300 pl-2">
                              <span>• {add.name}</span>
                              <span>${add.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-teal-950">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs uppercase font-semibold text-brand-teal-200">Sum Total (USD):</span>
                      <span className="font-serif text-lg font-extrabold text-gold-500">${totalCost}</span>
                    </div>
                    <span className="text-[9px] block text-center text-brand-teal-400 font-serif italic mt-2">
                      Exclusive of local state hair stylist tax indices.
                    </span>
                  </div>

                </div>

              </div>
              
              {/* Securing processing slider loader card */}
              {isSlotLocked && (
                <div className="fixed inset-0 z-50 bg-brand-teal-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6">
                  <div className="bg-brand-teal-900 border border-brand-teal-700/60 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
                    <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-teal-800 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 animate-spin" />
                      <Ticket className="w-6 h-6 text-gold-500 animate-bounce" />
                    </div>
                    
                    <h4 className="font-serif text-base font-bold text-white mb-2 uppercase tracking-wide">Securing Muskan Slot</h4>
                    <p className="text-xs text-brand-teal-300 leading-relaxed mb-4">
                      Securing your reservation in the luxury appointment database...
                    </p>

                    {/* Progress slider bar */}
                    <div className="h-1.5 w-full bg-brand-teal-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold-600 to-amber-300 transition-all duration-300" style={{ width: `${simulatedLoadProgress}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-gold-500 block mt-2 font-bold">{simulatedLoadProgress}% COMPLETE</span>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* SUCCESS MODAL / INVOICE RECEIPT SUMMARY */}
          {completedBooking && (
            <motion.div
              key="success-invoice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-teal-900/10 border-2 border-gold-500/60 p-6 md:p-8 rounded-3xl text-center shadow-2xl relative"
            >
              
              {/* Particle glow ring under congratulations */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,165,97,0.1),transparent)] pointer-events-none" />

              <div className="mx-auto w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-brand-teal-950 mb-4 shadow-[0_0_20px_rgba(204,165,97,0.35)]">
                <CheckCircle className="w-7 h-7" />
              </div>

              <h3 className="font-serif text-xl font-bold text-white tracking-wide uppercase mb-1">
                Appointment Specimen Confirmed
              </h3>
              <p className="text-xs text-brand-teal-200 uppercase font-mono tracking-wider mb-6">
                RECEIPT ID: {completedBooking.id}
              </p>

              {/* Invoice body sheet details */}
              <div className="w-full max-w-md mx-auto bg-brand-teal-950 border border-brand-teal-800/60 p-5 rounded-2xl text-left space-y-4 mb-6">
                
                <div className="flex justify-between items-start pb-3 border-b border-brand-teal-900">
                  <div>
                    <span className="text-[9px] text-brand-teal-400 font-mono uppercase block">Scheduled Member:</span>
                    <span className="text-sm font-semibold text-white block">{completedBooking.customerName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-brand-teal-900 border border-brand-teal-800 rounded font-mono text-[9px] text-gold-500 uppercase font-semibold">
                    STATUS: SECURED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div>
                    <span className="text-[10px] text-brand-teal-400 uppercase font-mono block">Chosen Expert:</span>
                    <span className="font-bold text-white block-spacing">{completedBooking.stylist.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-teal-400 uppercase font-mono block">Treatment Room:</span>
                    <span className="font-semibold text-white block">Teal Suite B</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-teal-400 uppercase font-mono block">Arranged Date:</span>
                    <span className="font-bold text-white block">{completedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-teal-400 uppercase font-mono block">Hold Hour Slot:</span>
                    <span className="font-bold text-gold-200 block">{completedBooking.timeSlot}</span>
                  </div>
                </div>

                {/* Tariff calculations summary inside receipt */}
                <div className="pt-3 border-t border-brand-teal-900 space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>{completedBooking.service.title}</span>
                    <span className="font-bold text-white">${completedBooking.service.price}</span>
                  </div>
                  {completedBooking.addons.map(add => (
                    <div key={add.id} className="flex justify-between text-zinc-400 text-[11px] pl-2">
                      <span>• {add.name}</span>
                      <span>${add.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-brand-teal-900 font-mono text-xs font-bold">
                    <span className="text-white text-semibold uppercase">Total Tariff Paid:</span>
                    <span className="text-sm text-gold-500 font-extrabold font-serif">${completedBooking.totalPrice} USD</span>
                  </div>
                </div>

              </div>

              <div className="space-y-3">
                <p className="text-xs text-brand-teal-200 font-sans leading-relaxed max-w-md mx-auto">
                  A verification confirmation code has been dispatched to <strong className="text-white font-medium">{completedBooking.customerEmail}</strong>. Please render this electronic specimen card upon suite reception.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => {
                      setCompletedBooking(null);
                      setBookingStep(1);
                      setAddons([]);
                      onBookingComplete();
                    }}
                    className="p-3 px-6 border border-brand-teal-700 bg-brand-teal-900/30 text-brand-teal-100 font-bold font-mono text-xs hover:text-white hover:bg-brand-teal-800 uppercase rounded-xl transition cursor-pointer"
                  >
                    Open New Reservation
                  </button>
                  <button
                    onClick={() => {
                      // Trigger native print / share popup elegantly
                      window.print();
                    }}
                    className="p-3 px-6 bg-gold-400 hover:bg-gold-500 text-brand-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Print Electronic Card
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
