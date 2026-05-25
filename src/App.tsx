import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Layers, 
  BookOpen, 
  CalendarRange, 
  FolderLock,
  Compass,
  ArrowRight,
  BookmarkCheck,
  MapPin,
  Clock,
  Trash2
} from 'lucide-react';
import ThreeDShowroom from './components/ThreeDShowroom';
import BookingSystem from './components/BookingSystem';
import ProbotoExperience from './components/ProbotoExperience';
import { Product, Booking } from './types';
import { 
  playChime, 
  startAmbientSoundtrack, 
  stopAmbientSoundtrack, 
  playSnip 
} from './utils/audio';

export default function App() {
  const [activeNav, setActiveNav] = useState<'showroom' | 'science' | 'booking' | 'my-bookings'>('showroom');
  const [selectedAddons, setSelectedAddons] = useState<Product[]>([]);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  // Load existing persistent bookings from localStorage
  const reloadBookings = () => {
    try {
      const cached = localStorage.getItem('muskan_luxury_appointments');
      if (cached) {
        setUserBookings(JSON.parse(cached));
      }
    } catch (e) {
      console.warn('Failed loading cached reservations list', e);
    }
  };

  useEffect(() => {
    reloadBookings();
  }, []);

  // Handle addition of Krone trolley bottles as booking addon accessories
  const handleAddProductToBooking = (product: Product) => {
    setSelectedAddons(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        // If already exists, toggle it off (remove)
        playSnip();
        return prev.filter(p => p.id !== product.id);
      } else {
        // Otherwise append it
        playChime();
        return [...prev, product];
      }
    });
  };

  const handleRemoveAddon = (product: Product) => {
    setSelectedAddons(prev => prev.filter(p => p.id !== product.id));
    playSnip();
  };

  const handleClearAddons = () => {
    setSelectedAddons([]);
  };

  // Sound toggler
  const toggleAmbientAudiosphere = () => {
    if (isAmbientPlaying) {
      stopAmbientSoundtrack();
      setIsAmbientPlaying(false);
    } else {
      const success = startAmbientSoundtrack();
      if (success) {
        setIsAmbientPlaying(true);
      }
    }
  };

  // Delete a customized booking
  const handleDeleteBooking = (id: string) => {
    try {
      const cached = localStorage.getItem('muskan_luxury_appointments');
      if (cached) {
        const bookings: Booking[] = JSON.parse(cached);
        const filtered = bookings.filter(b => b.id !== id);
        localStorage.setItem('muskan_luxury_appointments', JSON.stringify(filtered));
        setUserBookings(filtered);
        playSnip();
      }
    } catch (e) {}
  };

  // When reservation is successfully complete
  const handleBookingComplete = () => {
    reloadBookings();
    setActiveNav('my-bookings');
  };

  return (
    <div className="min-h-screen bg-brand-teal-950 text-brand-teal-200 font-sans flex flex-col justify-between selection:bg-brand-teal-700 relative overflow-hidden">
      
      {/* Aesthetic Corner Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* 1. LUXURY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-brand-teal-950/80 backdrop-blur-md border-b border-brand-teal-900/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative z-10">
          
          {/* Muskan Brand Logo Group */}
          <div className="flex flex-col select-none">
            <span className="font-serif text-lg md:text-xl font-semibold tracking-[0.25em] text-white uppercase">
              MUSKAN<span className="text-[10px] text-gold-500 font-sans tracking-normal align-super">★</span>
            </span>
            <span className="font-mono text-[9px] text-gold-500 tracking-[0.18em] uppercase leading-none mt-1">
              HAIR & BEAUTY SALON
            </span>
          </div>

          {/* Desktop Central Navigation items */}
          <nav className="hidden md:flex items-center bg-brand-teal-900/40 p-1 border border-brand-teal-800/50 rounded-full">
            <button
              id="nav-showroom"
              onClick={() => { setActiveNav('showroom'); playChime(); }}
              className={`px-5 py-2 text-xs uppercase font-bold tracking-widest rounded-full transition ${
                activeNav === 'showroom' 
                  ? 'bg-gold-500 text-brand-teal-950 font-extrabold shadow' 
                  : 'text-brand-teal-200 hover:text-white'
              }`}
            >
              3D Sandbox
            </button>
            <button
              id="nav-science"
              onClick={() => { setActiveNav('science'); playChime(); }}
              className={`px-5 py-2 text-xs uppercase font-bold tracking-widest rounded-full transition ${
                activeNav === 'science' 
                  ? 'bg-gold-500 text-brand-teal-950 font-extrabold shadow' 
                  : 'text-brand-teal-200 hover:text-white'
              }`}
            >
              Care & Organic
            </button>
            <button
              id="nav-booking"
              onClick={() => { setActiveNav('booking'); playChime(); }}
              className={`px-5 py-2 text-xs uppercase font-bold tracking-widest rounded-full transition ${
                activeNav === 'booking' 
                  ? 'bg-gold-500 text-brand-teal-950 font-extrabold shadow' 
                  : 'text-brand-teal-200 hover:text-white'
              }`}
            >
              Book Station
            </button>
            <button
              id="nav-my-bookings"
              onClick={() => { setActiveNav('my-bookings'); playChime(); }}
              className={`px-5 py-2 text-xs uppercase font-bold tracking-widest rounded-full transition relative ${
                activeNav === 'my-bookings' 
                  ? 'bg-gold-500 text-brand-teal-950 font-extrabold shadow' 
                  : 'text-brand-teal-200 hover:text-white'
              }`}
            >
              Reservations
              {userBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold ring-2 ring-brand-teal-950 animate-bounce">
                  {userBookings.length}
                </span>
              )}
            </button>
          </nav>

          {/* Luxury Sound System Widget & Maps Link shortcut */}
          <div className="flex items-center gap-3">
            
            {/* Google Maps Salon Redirection Link */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Muskan+Hair+and+Beauty+Salon+St+Marys"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal-900/30 border border-brand-teal-800 hover:border-gold-500/50 rounded-xl text-[11px] font-mono tracking-wider text-brand-teal-200 hover:text-white transition"
              title="Visit Muskan Hair and Beauty Salon on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-500 animate-bounce" />
              <span>St Marys Map</span>
            </a>

            {/* Ambient Toggler */}
            <button
              onClick={toggleAmbientAudiosphere}
              className={`p-2.5 rounded-full border transition flex items-center gap-2 ${
                isAmbientPlaying 
                  ? 'bg-gold-500 border-gold-400 text-brand-teal-950 shadow-[0_0_15px_rgba(204,165,97,0.3)]' 
                  : 'bg-brand-teal-900/40 border-brand-teal-850 text-brand-teal-300 hover:text-white hover:border-brand-teal-700'
              }`}
              title="Toggle calming ambient salon soundtrack (generates dynamic Web Audio drones)"
            >
              {isAmbientPlaying ? <Volume2 className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider hidden lg:inline">
                {isAmbientPlaying ? 'AMBIENT ON' : 'SOUNDTRACK'}
              </span>
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE CENTRAL NAVIGATION RAIL */}
      <div className="md:hidden sticky top-20 z-40 bg-brand-teal-950/90 border-b border-brand-teal-900/40 p-2 flex gap-1 justify-around overflow-x-auto">
        <button
          onClick={() => { setActiveNav('showroom'); playChime(); }}
          className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition ${
            activeNav === 'showroom' ? 'bg-gold-500 text-brand-teal-950' : 'text-brand-teal-300'
          }`}
        >
          3D Sandbox
        </button>
        <button
          onClick={() => { setActiveNav('science'); playChime(); }}
          className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition ${
            activeNav === 'science' ? 'bg-gold-500 text-brand-teal-950' : 'text-brand-teal-300'
          }`}
        >
          Care & Organic
        </button>
        <button
          onClick={() => { setActiveNav('booking'); playChime(); }}
          className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition ${
            activeNav === 'booking' ? 'bg-gold-500 text-brand-teal-950' : 'text-brand-teal-300'
          }`}
        >
          Book Station
        </button>
        <button
          onClick={() => { setActiveNav('my-bookings'); playChime(); }}
          className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg transition relative ${
            activeNav === 'my-bookings' ? 'bg-gold-500 text-brand-teal-950' : 'text-brand-teal-300'
          }`}
        >
          Reservations
          {userBookings.length > 0 && (
            <span className="absolute top-0 right-1 bg-emerald-500 text-white font-mono text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {userBookings.length}
            </span>
          )}
        </button>
      </div>

      {/* 2. DYNAMIC BROADCAST HERO BANNER (Only shows on home showroom route) */}
      {activeNav === 'showroom' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-r from-brand-teal-900 via-brand-teal-950 to-[#0A0A0A] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
          >
            
            {/* Background absolute branding highlights */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(197,160,89,0.08),transparent)] pointer-events-none" />
            
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="font-mono text-[10px] text-gold-500 tracking-wider uppercase font-bold">
                  Muskan Interactive Virtual Lounge — St Marys NSW
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                Inspect Beauty Stations, Select Organic Formulations & Book Appointments
              </h1>
              <p className="text-xs text-brand-teal-200 leading-relaxed font-sans">
                Rotate the 3D beauty display trolley, customize the luxurious hydraulic lift treatment chair upholstery, and activate LED profiles on the studio vanity mirror.
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => { setActiveNav('science'); playChime(); }}
                className="p-3 px-5 border border-brand-teal-750 hover:border-gold-500/50 bg-brand-teal-900/40 hover:bg-brand-teal-900/60 transition rounded-xl text-xs uppercase font-sans tracking-wider text-brand-teal-100 hover:text-white"
              >
                Herbal Ingredients
              </button>
              <button
                onClick={() => { setActiveNav('booking'); playChime(); }}
                className="p-3 px-5 bg-gold-400 hover:bg-gold-500 transition text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                Schedule Slots <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* 3. CORE ROUTE TRANSITION CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* A. SHOWROOM TAB */}
          {activeNav === 'showroom' && (
            <motion.div
              key="showroom-route"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <ThreeDShowroom 
                onAddProductToBooking={handleAddProductToBooking} 
                selectedAddons={selectedAddons}
                openBookingWithPackage={() => {
                  setActiveNav('booking');
                }}
              />
            </motion.div>
          )}

          {/* B. TREATMENT SCIENCE TAB */}
          {activeNav === 'science' && (
            <motion.div
              key="science-route"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <ProbotoExperience />
            </motion.div>
          )}

          {/* C. BOOKING SYSTEM TAB */}
          {activeNav === 'booking' && (
            <motion.div
              key="booking-route"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <BookingSystem 
                initialAddons={selectedAddons} 
                onRemoveAddon={handleRemoveAddon}
                onClearAddons={handleClearAddons}
                onBookingComplete={handleBookingComplete}
              />
            </motion.div>
          )}

          {/* D. MY RESERVATIONS Dynamic cache check */}
          {activeNav === 'my-bookings' && (
            <motion.div
              key="my-bookings-route"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-gold-500" /> My Securing Reservations
                  </h2>
                  <p className="text-xs text-brand-teal-300 font-sans mt-0.5">
                    Inspect, manage, or cancel your active appointments in the local salon browser memory database.
                  </p>
                </div>
                
                {userBookings.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all secure bookings from browser persistent history?')) {
                        localStorage.removeItem('muskan_luxury_appointments');
                        setUserBookings([]);
                        playSnip();
                      }
                    }}
                    className="p-2 border border-red-500/30 text-red-400 hover:text-white rounded-lg text-xs bg-red-950/25 hover:bg-red-850/50 transition whitespace-nowrap"
                  >
                    Wipe History Ledger
                  </button>
                )}
              </div>

              {userBookings.length === 0 ? (
                <div className="border border-dashed border-brand-teal-900 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                  <span className="text-4xl block font-mono">📅</span>
                  <h3 className="font-serif text-base font-semibold text-white">No Appointments Booked</h3>
                  <p className="text-xs text-brand-teal-300 leading-relaxed font-sans">
                    You have not secured any styling slots in this browser session. Open our booking scheduler or try organic hair and beauty solutions directly on our virtual cabinet.
                  </p>
                  <button
                    onClick={() => { setActiveNav('booking'); playChime(); }}
                    className="p-3 px-6 bg-gold-500 hover:bg-gold-600 text-brand-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Open booking scheduler
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((b) => (
                    <div 
                      key={b.id} 
                      className="border border-brand-teal-800 bg-brand-teal-900/15 rounded-3xl p-5 hover:bg-brand-teal-900/20 md:p-6 transition flex flex-col md:flex-row gap-6 justify-between text-xs"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-brand-teal-900 pb-2">
                          <div className="">
                            <h3 className="font-serif text-sm font-bold text-white uppercase">{b.service.title}</h3>
                            <p className="text-[10px] text-brand-teal-400 font-mono tracking-wider mt-0.5">SLOT ID: {b.id}</p>
                          </div>
                          <span className="px-2.5 py-0.5 bg-emerald-600/20 border border-emerald-500 text-emerald-400 font-mono text-[9px] uppercase rounded font-bold">
                            RESERVATION SECURED
                          </span>
                        </div>

                        {/* Timing grids */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-teal-950/50 p-3 rounded-xl border border-brand-teal-900/60">
                          <div>
                            <span className="text-[9px] text-brand-teal-400 font-mono uppercase block mb-0.5">Beauty Specialist:</span>
                            <span className="font-semibold text-white block">{b.stylist.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-brand-teal-400 font-mono uppercase block mb-0.5">Date Reserved:</span>
                            <span className="font-semibold text-white block">{b.date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-brand-teal-400 font-mono uppercase block mb-0.5">Estimated Hour:</span>
                            <span className="font-semibold text-gold-300 block">{b.timeSlot}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-brand-teal-400 font-mono uppercase block mb-0.5">Client Registrant:</span>
                            <span className="font-semibold text-white truncate block">{b.customerName}</span>
                          </div>
                        </div>

                        {/* Addons attached */}
                        {b.addons.length > 0 && (
                          <div className="pt-1.5 space-y-1">
                            <span className="text-[9px] text-brand-teal-400 uppercase font-mono tracking-widest block font-bold">Product enhancements:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {b.addons.map(ad => (
                                <span key={ad.id} className="bg-brand-teal-900 border border-brand-teal-800 text-brand-teal-200 text-[10px] px-2.5 py-0.5 rounded-full font-sans">
                                  {ad.name} ({ad.volume})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between items-end gap-4 border-t md:border-t-0 md:border-l border-brand-teal-900 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-44 text-right">
                        <div>
                          <span className="text-[9px] text-brand-teal-400 font-mono uppercase block">Total Net cost:</span>
                          <span className="font-serif text-lg font-extrabold text-gold-500">${b.totalPrice}</span>
                        </div>

                        <div className="flex md:flex-col gap-2 w-full">
                          <button
                            onClick={() => window.print()}
                            className="flex-1 p-2 border border-brand-teal-800 hover:border-gold-500 bg-brand-teal-900/30 font-semibold text-[10px] text-brand-teal-200 uppercase rounded-xl transition cursor-pointer"
                          >
                            Print Card
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete and cancel this scheduled beauty reservation?')) {
                                handleDeleteBooking(b.id);
                              }
                            }}
                            className="flex-1 p-2 border border-red-950 hover:bg-red-900/20 text-red-400 hover:text-white rounded-xl text-[10px] font-mono uppercase transition flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. HONEST, PREMIUM, LUXURY FOOTER */}
      <footer className="border-t border-brand-teal-900 bg-brand-teal-950/80 p-6 md:p-8 selection:bg-brand-teal-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-brand-teal-400">
          
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-serif text-white font-bold tracking-widest uppercase">
              Muskan Hair and Beauty Salon
            </h4>
            <p className="text-[11px] leading-relaxed max-w-sm">
              2/48 Sydney St, St Marys NSW 2760, Australia. Experiential virtual 3D showroom and booking kiosk.
            </p>
            <div className="text-[10px] text-gold-500 font-mono flex flex-wrap gap-x-4 justify-center md:justify-start">
              <span>TEL: +61 2 7904 8868</span>
              <span>•</span>
              <span>Open 9 AM Wed — Mon</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right font-mono text-[10px] uppercase">
            <div className="flex gap-4 items-center">
              <a href="https://www.google.com/maps/search/?api=1&query=Muskan+Hair+and+Beauty+Salon+St+Marys" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-white transition decoration-dotted underline">
                Google Maps Registry
              </a>
              <span>•</span>
              <a href="https://www.facebook.com/people/Muskan-Hair-and-Beauty-Salon/100063953578796/" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-white transition decoration-dotted underline">
                Facebook Page
              </a>
              <span>•</span>
              <span>dawanshashi@gmail.com</span>
            </div>
            <p className="mt-1">
              © 2026 Muskan Salon. Developed for high-end virtual execution.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
