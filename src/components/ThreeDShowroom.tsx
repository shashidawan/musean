import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Palette, 
  HelpCircle,
  Maximize2,
  Minimize2,
  Volume2,
  Plus,
  ShoppingBag,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react';
import { KRONE_PRODUCTS } from '../data';
import { Product } from '../types';
import { playChime, playSnip, startDryerHum, stopDryerHum } from '../utils/audio';

interface ThreeDShowroomProps {
  onAddProductToBooking: (product: Product) => void;
  selectedAddons: Product[];
  openBookingWithPackage: () => void;
}

export default function ThreeDShowroom({ 
  onAddProductToBooking, 
  selectedAddons,
  openBookingWithPackage
}: ThreeDShowroomProps) {
  // Chair States
  const [chairRotation, setChairRotation] = useState<number>(45);
  const [chairHeight, setChairHeight] = useState<number>(30); // 0 to 60px height offset
  const [chairColor, setChairColor] = useState<'obsidian' | 'luxury-gold' | 'emerald'>('obsidian');
  const [isDryerOn, setIsDryerOn] = useState<boolean>(false);
  const [isScissorClipping, setIsScissorClipping] = useState<boolean>(false);

  // Trolley States
  const [trolleyRotation, setTrolleyRotation] = useState<number>(25);
  const [selectedShelf, setSelectedShelf] = useState<number>(1);
  const [isZoomedTrolley, setIsZoomedTrolley] = useState<boolean>(false);
  const [isTrolleySpinning, setIsTrolleySpinning] = useState<boolean>(false);

  // Mirror & Room States
  const [mirrorGlow, setMirrorGlow] = useState<boolean>(true);
  const [glowColor, setGlowColor] = useState<'candlelight' | 'daylight' | 'aurora'>('aurora');

  // Interactive instructions info panel
  const [activeTab, setActiveTab] = useState<'trolley' | 'chair' | 'lighting'>('trolley');
  
  // Drag states for rotating models with mouse swipe
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);

  // Drag handlers for the Trolley (makes it interactive to swipe/spin)
  const handleTrolleyMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = trolleyRotation;
  };

  const handleTrolleyMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // factor of sensitivity
    const nextRotation = (startRotationRef.current + deltaX * 0.5) % 360;
    setTrolleyRotation(nextRotation);
  };

  const handleTrolleyMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Drag handlers for the Chair
  const handleChairMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = chairRotation;
  };

  const handleChairMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const nextRotation = (startRotationRef.current + deltaX * 0.5) % 360;
    setChairRotation(nextRotation);
  };

  // Sound triggering helper for actions
  const triggerScissorSnip = () => {
    setIsScissorClipping(true);
    playSnip();
    setTimeout(() => setIsScissorClipping(false), 250);
  };

  const toggleDryerAudio = () => {
    if (isDryerOn) {
      stopDryerHum();
      setIsDryerOn(false);
    } else {
      const active = startDryerHum();
      if (active) setIsDryerOn(true);
    }
  };

  useEffect(() => {
    // Unmount safe cleanup
    return () => {
      stopDryerHum();
    };
  }, []);

  const selectedProduct = KRONE_PRODUCTS.find(p => p.shelf === selectedShelf) || KRONE_PRODUCTS[0];
  const isProductAdded = selectedAddons.some(p => p.id === selectedProduct.id);

  // Auto spin for the product trolley to show off the separate layers
  useEffect(() => {
    let interval: any;
    if (isTrolleySpinning) {
      interval = setInterval(() => {
        setTrolleyRotation(prev => (prev + 0.8) % 360);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isTrolleySpinning]);

  // Upholstery configurations
  const upholsteryConfig = {
    obsidian: {
      seat: 'from-gray-800 to-gray-950 border-gray-900',
      stitching: 'border-brand-teal-500/20',
      label: 'Obsidian Stitched Leather'
    },
    'luxury-gold': {
      seat: 'from-amber-700 to-gold-800 border-gold-900',
      stitching: 'border-yellow-200/40',
      label: 'Sovereign Gold Velvet'
    },
    emerald: {
      seat: 'from-[#1E2022] to-[#121315] border-black/40',
      stitching: 'border-[#C5A059]/30',
      label: 'Imperial Oyster Tweed'
    }
  };

  // Backlight glows glow gradient Map
  const backlightThemes = {
    candlelight: {
      shadow: 'shadow-[0_0_80px_25px_rgba(245,158,11,0.25)]',
      bg: 'bg-amber-500/10',
      glowLabel: 'Sunset Warm Candlelight (2700K)'
    },
    daylight: {
      shadow: 'shadow-[0_0_80px_25px_rgba(255,255,255,0.2)]',
      bg: 'bg-white/10',
      glowLabel: 'Signature Daylight Studio (5500K)'
    },
    aurora: {
      shadow: 'shadow-[0_0_80px_25px_rgba(20,184,166,0.25)]',
      bg: 'bg-teal-500/10',
      glowLabel: 'Muskan Emerald Aurora (Soothing)'
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="showroom-section">
      
      {/* 1. Left Interactive Model Window (8 Columns) */}
      <div className="lg:col-span-8 bg-brand-teal-950 border border-brand-teal-800/40 rounded-3xl p-6 relative overflow-hidden h-[630px] flex flex-col justify-between selection:bg-brand-teal-700 shadow-2xl">
        
        {/* Dynamic Studio Room Ambient Light Cast */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-out pointer-events-none ${
          mirrorGlow ? backlightThemes[glowColor].shadow : 'shadow-none'
        } ${mirrorGlow ? backlightThemes[glowColor].bg : 'bg-transparent'}`} />

        {/* Abstract salon grid background floor lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.06),transparent)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_top,rgba(8,8,8,0.5),transparent)] border-b border-brand-teal-900 pointer-events-none" />

        {/* Header Options inside 3D Viewport */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <p className="font-mono text-xs text-brand-teal-200 tracking-widest uppercase">
              Muskan Luxury Sandbox Studio
            </p>
          </div>

          {/* Core Navigation Controls within the Sandbox */}
          <div className="bg-brand-teal-900/60 backdrop-blur-md p-1 border border-brand-teal-800/40 rounded-xl flex gap-1">
            <button
              id="tab-trolley"
              onClick={() => { setActiveTab('trolley'); playChime(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'trolley' 
                  ? 'bg-brand-teal-700 text-white shadow-md' 
                  : 'text-brand-teal-300 hover:text-white hover:bg-brand-teal-800/30'
              }`}
            >
              Muskan Trolley
            </button>
            <button
              id="tab-chair"
              onClick={() => { setActiveTab('chair'); playChime(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'chair' 
                  ? 'bg-brand-teal-700 text-white shadow-md' 
                  : 'text-brand-teal-300 hover:text-white hover:bg-brand-teal-800/30'
              }`}
            >
              Styling Chair
            </button>
            <button
              id="tab-lighting"
              onClick={() => { setActiveTab('lighting'); playChime(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase ${
                activeTab === 'lighting' 
                  ? 'bg-brand-teal-700 text-white shadow-md' 
                  : 'text-brand-teal-300 hover:text-white hover:bg-brand-teal-800/30'
              }`}
            >
              LED Room
            </button>
          </div>
        </div>

        {/* 3D CANVAS VIEWPORT */}
        <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* TROLLEY PERSPECTIVE SCENE */}
            {activeTab === 'trolley' && (
              <motion.div
                key="trolley-scene"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center relative h-full"
                onMouseDown={handleTrolleyMouseDown}
                onMouseMove={handleTrolleyMouseMove}
                onMouseUp={handleTrolleyMouseUpOrLeave}
                onMouseLeave={handleTrolleyMouseUpOrLeave}
                style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
              >
                {/* 3D Display Trolley wrapper with custom CSS perspective */}
                <div 
                  className="relative preserve-3d w-[320px] h-[380px] transition-transform duration-300 ease-out select-none flex items-center justify-center mb-6"
                  style={{ 
                    perspective: '1000px',
                    transform: `rotateX(-12deg) rotateY(${trolleyRotation}deg)`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                    {/* BACK LAYER PANEL: Shadows & Back Panel */}
                    <div className="absolute w-[150px] h-[270px] bg-brand-teal-100 border border-brand-teal-200/50 rounded-lg shadow-inner preserve-3d" style={{ transform: 'translateZ(-40px)' }} />

                    {/* WHEELS (4 rolling caster wheels styled in elegant gold gradients and black rims) */}
                    <div className="absolute bottom-[20px] left-[70px] bg-gray-900 border border-gold-500/60 rounded-full w-[24px] h-[24px] flex items-center justify-center shadow-lg preserve-3d" style={{ transform: 'translateZ(30px)' }}>
                      <div className="w-1.5 h-1.5 bg-gold-200 rounded-full animate-pulse" />
                    </div>
                    <div className="absolute bottom-[20px] right-[70px] bg-gray-900 border border-gold-500/60 rounded-full w-[24px] h-[24px] flex items-center justify-center shadow-lg preserve-3d" style={{ transform: 'translateZ(30px)' }}>
                      <div className="w-1.5 h-1.5 bg-gold-200 rounded-full" />
                    </div>
                    <div className="absolute bottom-[20px] left-[70px] bg-gray-900 border border-gold-500/60 rounded-full w-[24px] h-[24px] flex items-center justify-center shadow-lg preserve-3d" style={{ transform: 'translateZ(-30px)' }}>
                      <div className="w-1.5 h-1.5 bg-gold-200 rounded-full" />
                    </div>
                    <div className="absolute bottom-[20px] right-[70px] bg-gray-900 border border-gold-500/60 rounded-full w-[24px] h-[24px] flex items-center justify-center shadow-lg preserve-3d" style={{ transform: 'translateZ(-30px)' }}>
                      <div className="w-1.5 h-1.5 bg-gold-200 rounded-full" />
                    </div>

                    {/* CORE UPRIGHT TROLLEY COLUMNS (Left and Right Rails) */}
                    <div className="absolute bottom-[44px] left-[65px] w-[8px] h-[216px] bg-gradient-to-t from-gray-300 to-white border border-gray-400 rounded-full shadow-md preserve-3d" style={{ transform: 'translateZ(30px)' }} />
                    <div className="absolute bottom-[44px] right-[65px] w-[8px] h-[216px] bg-gradient-to-t from-gray-300 to-white border border-gray-400 rounded-full shadow-md preserve-3d" style={{ transform: 'translateZ(30px)' }} />
                    <div className="absolute bottom-[44px] left-[65px] w-[8px] h-[216px] bg-gradient-to-t from-gray-300 to-white border border-gray-400 rounded-full shadow-md preserve-3d" style={{ transform: 'translateZ(-30px)' }} />
                    <div className="absolute bottom-[44px] right-[65px] w-[8px] h-[216px] bg-gradient-to-t from-gray-300 to-white border border-gray-400 rounded-full shadow-md preserve-3d" style={{ transform: 'translateZ(-30px)' }} />

                    {/* FOUR SEPARATE INTERACTIVE SHELVES (with products residing on them) */}
                    {[1, 2, 3, 4].map((shelfNum) => {
                      const isActive = selectedShelf === shelfNum;
                      const yPos = 210 - (shelfNum - 1) * 55; // spacing each shelf 55px upwards
                      
                      // Identify the product for this shelf
                      const prodOnShelf = KRONE_PRODUCTS.find(p => p.shelf === shelfNum);

                      return (
                        <div
                          key={`shelf-${shelfNum}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShelf(shelfNum);
                            playChime();
                          }}
                          className={`absolute w-[130px] h-[16px] transition-all cursor-pointer preserve-3d flex items-center justify-center border-l border-r border-t`}
                          style={{
                            bottom: `${yPos}px`,
                            transform: 'translateZ(0px) rotateX(2deg)',
                            borderColor: isActive ? 'var(--color-gold-500)' : 'var(--color-brand-teal-700)',
                            background: isActive 
                              ? 'linear-gradient(to right, var(--color-brand-teal-800), var(--color-brand-teal-900))'
                              : 'linear-gradient(to right, var(--color-brand-teal-900), var(--color-brand-teal-950))',
                            boxShadow: isActive ? '0 0 15px rgba(204,165,97,0.45)' : 'none'
                          }}
                        >
                          {/* Top Border Band branding */}
                          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
                            isActive ? 'from-gold-500 to-amber-400' : 'from-brand-teal-600 to-brand-teal-500'
                          } font-serif text-[5px] text-center uppercase tracking-widest text-white leading-none overflow-hidden flex items-center justify-center`}>
                            {isActive ? 'Selected Shelf' : 'Muskan Organic'}
                          </div>

                          {/* BRANDING TEXT LAYER (Krone Professional logo and style band on side of shelf) */}
                          <div className="absolute -left-12 top-0.5 transform -rotate-y-90 origin-right w-[40px] h-[12px] bg-brand-teal-800 border-r border-brand-teal-600/40 px-1 py-0.5 flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(10px) translateX(-10px)' }}>
                            <span className="font-serif text-[4px] text-gold-200 tracking-wider">MUSKAN</span>
                          </div>

                          {/* FRONT DISPLAY LABEL (With KRONE and text as shown in requested photo) */}
                          <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                            <span className="font-serif text-[5px] text-brand-teal-100 font-semibold tracking-wider">MUSKAN</span>
                            <span className="font-mono text-[4px] text-gold-200 italic">BOTANICAL</span>
                          </div>

                          {/* PRODUCT BOTTLE INTERACTIVE OBJECT MODEL (Resides on shelf, drawn as 3D layered shapes) */}
                          {prodOnShelf && (
                            <div 
                              className="absolute bottom-4 preserve-3d flex flex-col items-center justify-end"
                              style={{ transform: 'translateZ(10px)' }}
                            >
                              <motion.div 
                                className={`w-5 h-9 rounded-md transition-all duration-300 flex flex-col justify-between items-center py-1 relative ${
                                  isActive 
                                    ? 'bg-gradient-to-t from-brand-teal-50 to-white ring-2 ring-gold-500/50 shadow-lg scale-110' 
                                    : 'bg-gradient-to-t from-gray-200 to-slate-100 hover:bg-white shadow-md'
                                }`}
                              >
                                {/* Bottle Teal Cap */}
                                <div className={`w-2.5 h-1.5 rounded-t-sm transition-colors ${
                                  isActive ? 'bg-brand-teal-600' : 'bg-gray-400'
                                }`} />
                                {/* Label Band */}
                                <div className="w-full h-3 bg-brand-teal-700 flex items-center justify-center overflow-hidden">
                                  <span className="text-[3px] text-gold-100 uppercase tracking-tighter">P-X {shelfNum}</span>
                                </div>
                                {/* Liquid levels / micro-glow indicator */}
                                {isActive && (
                                  <div className="absolute bottom-0.5 inset-x-1 h-0.5 bg-teal-400 rounded-full animate-pulse" />
                                )}
                              </motion.div>
                            </div>
                          )}

                          {/* Shelf Inner shadow projection */}
                          <div className="absolute inset-0 bg-black/25 mix-blend-overlay opacity-60 pointer-events-none" />
                        </div>
                      );
                    })}

                    {/* TOP DECORATIVE INTEGRATED HEADER (Signage board featuring high-end Muskan advert) */}
                    <div 
                      className="absolute bottom-[268px] w-[140px] h-[55px] bg-gradient-to-br from-brand-teal-800 to-brand-teal-950 border border-brand-teal-700 rounded p-1.5 flex flex-col justify-between shadow-2xl preserve-3d"
                      style={{ transform: 'translateZ(-5px) rotateX(-5deg)' }}
                    >
                      <div className="border-b border-brand-teal-600/30 pb-0.5 text-center">
                        <h4 className="font-serif text-[7px] text-gold-100 uppercase tracking-widest font-bold">Muskan</h4>
                        <p className="text-[3px] text-brand-teal-200 uppercase tracking-tighter leading-none mt-0.5">Organic Herbal Suite</p>
                      </div>
                      
                      <div className="text-center py-0.5 flex flex-col justify-center">
                        <span className="font-serif italic text-[5px] text-white">Experience the</span>
                        <span className="font-sans text-[6px] text-gold-200 tracking-wider font-extrabold uppercase animate-pulse">BOTANICAL</span>
                      </div>

                      <div className="border-t border-brand-teal-600/30 pt-0.5 flex justify-between items-center">
                        <span className="text-[3px] font-mono text-brand-teal-300">THERAPY LUXE</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Help Instructions underneath trolley */}
                <div className="text-center flex flex-col gap-1 z-10 select-none">
                  <div className="flex justify-center gap-1.5 items-center">
                    <button 
                      onClick={() => setTrolleyRotation(prev => (prev - 45) % 360)}
                      className="p-1 px-2.5 rounded-lg border border-brand-teal-800 bg-brand-teal-900/40 text-brand-teal-200 text-xs font-semibold hover:text-white"
                      title="Rotate counterclockwise"
                    >
                      ↺
                    </button>
                    <p className="text-xs text-brand-teal-200 font-sans tracking-wide">
                      Drag to Spin Cabinet ({Math.round(trolleyRotation)}°)
                    </p>
                    <button 
                      onClick={() => setTrolleyRotation(prev => (prev + 45) % 360)}
                      className="p-1 px-2.5 rounded-lg border border-brand-teal-800 bg-brand-teal-900/40 text-brand-teal-200 text-xs font-semibold hover:text-white"
                      title="Rotate clockwise"
                    >
                      ↻
                    </button>
                  </div>
                  <div className="flex justify-center items-center gap-3 mt-1.5">
                    <button
                      onClick={() => { setIsTrolleySpinning(!isTrolleySpinning); playChime(); }}
                      className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider rounded-full border transition-all ${
                        isTrolleySpinning 
                          ? 'bg-gold-500 border-gold-400 text-brand-teal-950 font-bold' 
                          : 'bg-brand-teal-900/40 border-brand-teal-800 text-brand-teal-300 hover:text-white'
                      }`}
                    >
                      {isTrolleySpinning ? '■ Auto-Spin ON' : '▶ Auto-Spin OFF'}
                    </button>
                    <span className="text-[10px] text-brand-teal-400 font-mono">
                      Click layers/shelves to inspect
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAIR PERSPECTIVE SCENE */}
            {activeTab === 'chair' && (
              <motion.div
                key="chair-scene"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center relative h-full"
                onMouseDown={handleChairMouseDown}
                onMouseMove={handleChairMouseMove}
                onMouseUp={handleTrolleyMouseUpOrLeave}
                onMouseLeave={handleTrolleyMouseUpOrLeave}
                style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
              >
                {/* 3D Styling Chair Box with CSS perspective */}
                <div 
                  className="relative preserve-3d w-[320px] h-[380px] transition-transform duration-300 ease-out select-none flex items-center justify-center mb-6"
                  style={{ 
                    perspective: '1200px',
                    transform: `rotateX(-12deg) rotateY(${chairRotation}deg)`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center preserve-3d" style={{ top: `${-chairHeight}px`, transition: 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    {/* BASE: Chrome Star Pedestal Base */}
                    <div className="absolute bottom-[40px] w-[140px] h-[8px] bg-gradient-to-r from-gray-400 via-white to-gray-400 border border-gray-500 rounded-full shadow-[0_5px_8px_rgba(0,0,0,0.4)] preserve-3d" />
                    
                    {/* BASE STEM: Chrome Hydraulic Shaft Column */}
                    <div className="absolute bottom-[48px] w-[20px] h-[70px] bg-gradient-to-r from-gray-300 via-white to-gray-300 border-x border-gray-400 shadow-md preserve-3d">
                      {/* Height line markers */}
                      <div className="absolute inset-y-2 left-0 right-0 border-y border-gray-400/50" />
                    </div>

                    {/* SEAT SUPPORT: Under seat cross bracket */}
                    <div className="absolute bottom-[114px] w-[80px] h-[10px] bg-gray-800 border border-gray-950 rounded preserve-3d" />

                    {/* CHAIR SEAT CUSHION (Upholstered) */}
                    <div 
                      className={`absolute bottom-[124px] w-[110px] h-[28px] rounded-lg bg-gradient-to-b border shadow-xl preserve-3d ${
                        upholsteryConfig[chairColor].seat
                      }`}
                    >
                      {/* Micro Stitching highlight */}
                      <div className={`absolute inset-1 border rounded-md pointer-events-none ${upholsteryConfig[chairColor].stitching}`} />
                    </div>

                    {/* CHAIR BACKREST (Upholstered curve panel with central support) */}
                    <div 
                      className={`absolute bottom-[148px] w-[100px] h-[75px] rounded-t-2xl bg-gradient-to-b border shadow-lg preserve-3d flex flex-col justify-between p-2 text-center origin-bottom`}
                      style={{ 
                        transform: 'translateZ(-45px) rotateX(4deg)',
                        ...{
                          obsidian: { backgroundImage: 'linear-gradient(to bottom, #1f2937, #030712)' },
                          'luxury-gold': { backgroundImage: 'linear-gradient(to bottom, #d97706, #78350f)' },
                          emerald: { backgroundImage: 'linear-gradient(to bottom, #1E2022, #121315)' }
                        }[chairColor]
                      }}
                    >
                      <span className="font-serif text-[7px] text-gold-200 tracking-widest font-bold uppercase pointer-events-none">Muskan Luxe</span>
                      <div className="w-6 h-1 bg-gold-500/50 mx-auto rounded-full" />
                    </div>

                    {/* LEFT AND RIGHT ERGONOMIC ARMRESTS */}
                    {/* Left armrest bracket & pad */}
                    <div className="absolute bottom-[140px] left-[55px] preserve-3d" style={{ transform: 'translateZ(-15px)' }}>
                      {/* Chrome support stem */}
                      <div className="absolute bottom-0 w-[6px] h-[35px] bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-400 rounded" />
                      {/* Padded Top cap */}
                      <div className={`absolute bottom-[32px] -left-2 w-[16px] h-[8px] bg-gray-900 border border-gray-950 rounded shadow-md ${upholsteryConfig[chairColor].seat}`} />
                    </div>
                    {/* Right armrest bracket & pad */}
                    <div className="absolute bottom-[140px] right-[55px] preserve-3d" style={{ transform: 'translateZ(-15px)' }}>
                      <div className="absolute bottom-0 w-[6px] h-[35px] bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-400 rounded" />
                      <div className={`absolute bottom-[32px] -right-2 w-[16px] h-[8px] bg-gray-900 border border-gray-950 rounded shadow-md ${upholsteryConfig[chairColor].seat}`} />
                    </div>

                    {/* FOOTREST (Hanging lower chrome metal loop structure) */}
                    <div className="absolute bottom-[104px] w-[50px] h-[25px] border-x-2 border-b-2 border-gray-300 shadow-md preserve-3d" style={{ transform: 'translateZ(40px) rotateX(15deg)', transformOrigin: 'top' }}>
                      {/* Foot platform */}
                      <div className="absolute bottom-0 left-[-4px] right-[-4px] h-[5px] bg-gray-800 rounded shadow border border-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Virtual Stylist Controls under Chair */}
                <div className="w-full max-w-sm flex flex-col gap-2 z-10 bg-brand-teal-900/30 backdrop-blur-md p-3 border border-brand-teal-800/40 rounded-2xl select-none">
                  <div className="flex justify-between items-center pb-1 border-b border-brand-teal-800/40">
                    <span className="text-xs font-semibold text-brand-teal-200 uppercase tracking-wider">Hydraulic Lift</span>
                    <span className="text-[10px] font-mono text-gold-500 font-bold">HEIGHT: {Math.round(chairHeight)}mm</span>
                  </div>
                  
                  {/* Height Incrementor tools */}
                  <div className="flex items-center justify-between gap-2 py-1">
                    <button
                      onClick={() => {
                        if (chairHeight < 50) {
                          setChairHeight(prev => Math.min(prev + 10, 50));
                          triggerScissorSnip();
                        }
                      }}
                      disabled={chairHeight >= 50}
                      className="flex-1 p-2 bg-brand-teal-900/60 border border-brand-teal-700 rounded-lg text-xs font-bold text-white hover:bg-brand-teal-800 flex items-center justify-center gap-2 transition disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-gold-500" /> Pump Up
                    </button>
                    <button
                      onClick={() => {
                        if (chairHeight > 0) {
                          setChairHeight(prev => Math.max(prev - 10, 0));
                          triggerScissorSnip();
                        }
                      }}
                      disabled={chairHeight <= 0}
                      className="flex-1 p-2 bg-brand-teal-900/60 border border-brand-teal-700 rounded-lg text-xs font-bold text-white hover:bg-brand-teal-800 flex items-center justify-center gap-2 transition disabled:opacity-40"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-gold-500" /> Release Base
                    </button>
                  </div>

                  {/* Upholstery Colors */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-sans text-brand-teal-300">Upholstery:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setChairColor('obsidian'); playChime(); }}
                        className={`w-6 h-6 rounded-full bg-gray-900 border-2 transition ${
                          chairColor === 'obsidian' ? 'border-gold-500 scale-110' : 'border-colors hover:border-gray-300'
                        }`}
                        title="Obsidian Black Stitching"
                      />
                      <button
                        onClick={() => { setChairColor('luxury-gold'); playChime(); }}
                        className={`w-6 h-6 rounded-full bg-amber-600 border-2 transition ${
                          chairColor === 'luxury-gold' ? 'border-gold-500 scale-110' : 'border-colors hover:border-gray-500'
                        }`}
                        title="Sovereign Gold Velvet"
                      />
                      <button
                        onClick={() => { setChairColor('emerald'); playChime(); }}
                        className={`w-6 h-6 rounded-full bg-emerald-800 border-2 transition ${
                          chairColor === 'emerald' ? 'border-gold-500 scale-110' : 'border-colors hover:border-emerald-500'
                        }`}
                        title="Emerald Teal Cashmere"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LIGHTING & BACKLIT STUDIO SCENE */}
            {activeTab === 'lighting' && (
              <motion.div
                key="lighting-scene"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center relative h-full"
              >
                {/* 3D Giant Backlit Salon Mirror */}
                <div className="relative w-[180px] h-[260px] flex flex-col items-center justify-center mb-6">
                  
                  {/* Glowing LED Ring Behind the Mirror Shape */}
                  {mirrorGlow && (
                    <div 
                      className={`absolute -inset-1 rounded-t-full transition-all duration-700 blur-[25px] ${
                        glowColor === 'candlelight' 
                          ? 'bg-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.8)]' 
                          : glowColor === 'daylight'
                          ? 'bg-white/80 shadow-[0_0_50px_rgba(255,255,255,0.8)]'
                          : 'bg-teal-400/80 shadow-[0_0_50px_rgba(45,212,191,0.8)]'
                      }`} 
                    />
                  )}

                  {/* Mirror Mirror Frame Shape */}
                  <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-slate-400 to-slate-200 border-2 border-gold-500 p-[3px] flex items-stretch justify-center overflow-hidden shadow-2xl z-10">
                    
                    {/* Mirror Reflection Glass Coating */}
                    <div className="flex-1 rounded-t-full bg-gradient-to-br from-cyan-900/60 via-slate-800/80 to-slate-900 relative overflow-hidden flex flex-col items-center justify-between p-4 mix-blend-screen">
                      
                      {/* Dynamic luxury logo stencil inside glass */}
                      <span className="font-serif text-gold-500/50 uppercase tracking-widest text-xs font-bold pt-4 text-center">
                        Muskan Studio
                      </span>

                      {/* Simulated customer face layout vector ring */}
                      <div className="w-16 h-16 rounded-full border border-teal-500/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
                        <Sparkles className="w-5 h-5 text-gold-500/30 animate-spin" style={{ animationDuration: '10s' }} />
                      </div>

                      {/* Mirror surface specularity glares */}
                      <div className="absolute top-[-50px] left-[-30px] w-12 h-[400px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12" />
                      <div className="absolute top-[-20px] left-[40px] w-8 h-[400px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12" />
                      
                      <span className="font-mono text-[7px] text-brand-teal-400/40 tracking-widest uppercase">
                        Mirror Stream Active
                      </span>
                    </div>
                  </div>

                  {/* Chrome support desk base stand */}
                  <div className="absolute bottom-[-10px] w-[110px] h-3 bg-gradient-to-r from-gray-400 via-white to-gray-400 border border-gray-500 rounded-md shadow z-20" />
                </div>

                {/* Lighting Control Box */}
                <div className="w-full max-w-sm flex flex-col gap-3 z-10 bg-brand-teal-900/30 backdrop-blur-md p-4 border border-brand-teal-800/40 rounded-2xl select-none">
                  <div className="flex justify-between items-center pb-1 border-b border-brand-teal-800/40">
                    <span className="text-xs font-semibold text-brand-teal-200 uppercase tracking-wider">LED System Console</span>
                    <button
                      onClick={() => { setMirrorGlow(!mirrorGlow); playChime(); }}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                        mirrorGlow 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' 
                          : 'bg-red-500/10 border-red-900 text-red-400'
                      }`}
                    >
                      {mirrorGlow ? 'ACTIVE' : 'STANDBY'}
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-brand-teal-300 block mb-1.5 uppercase">Select Backlight Profile:</span>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => { setGlowColor('candlelight'); playChime(); }}
                        className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                          glowColor === 'candlelight' 
                            ? 'border-amber-400 bg-amber-500/10 text-amber-200 font-semibold' 
                            : 'border-brand-teal-800 bg-brand-teal-900/20 text-brand-teal-300 hover:text-white'
                        }`}
                      >
                        <span>Warm Gold Sunset</span>
                        <div className="w-3 h-3 bg-amber-400 rounded-full shadow" />
                      </button>
                      <button
                        onClick={() => { setGlowColor('daylight'); playChime(); }}
                        className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                          glowColor === 'daylight' 
                            ? 'border-white bg-white/5 text-white font-semibold' 
                            : 'border-brand-teal-800 bg-brand-teal-900/20 text-brand-teal-300 hover:text-white'
                        }`}
                      >
                        <span>Nordic Daylight</span>
                        <div className="w-3 h-3 bg-white rounded-full shadow" />
                      </button>
                      <button
                        onClick={() => { setGlowColor('aurora'); playChime(); }}
                        className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                          glowColor === 'aurora' 
                            ? 'border-teal-400 bg-teal-500/10 text-teal-200 font-semibold' 
                            : 'border-brand-teal-800 bg-brand-teal-900/20 text-brand-teal-300 hover:text-white'
                        }`}
                      >
                        <span>Dreamy Aurora (Teal)</span>
                        <div className="w-3 h-3 bg-teal-400 rounded-full shadow" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-center font-serif text-brand-teal-400 italic">
                    Ambient profile casts real-time luxury shadows on the salon floor.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Ambient controls bar (Dryer Sounds, Shear Clicks) */}
        <div className="z-10 bg-brand-teal-900/50 backdrop-blur-md p-3 border-t border-brand-teal-800/40 rounded-b-2xl -mx-6 -mb-6 flex items-center justify-between text-xs overflow-x-auto gap-3">
          <div className="flex gap-2">
            <button
              onClick={toggleDryerAudio}
              className={`p-1 px-3 rounded-lg border flex items-center gap-1.5 transition whitespace-nowrap font-semibold ${
                isDryerOn 
                  ? 'bg-amber-400 border-amber-300 text-brand-teal-950 font-bold' 
                  : 'bg-brand-teal-900/40 border-brand-teal-800 text-brand-teal-300 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isDryerOn ? 'Mute Hairdryer' : 'Sound Test: Hairdryer'}
            </button>
            <button
              onClick={triggerScissorSnip}
              className={`p-1 px-3 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 font-semibold ${
                isScissorClipping 
                  ? 'bg-teal-400 border-teal-300 text-brand-teal-950 scale-95 font-bold' 
                  : 'bg-brand-teal-900/40 border-brand-teal-800 text-brand-teal-300 hover:text-white'
              }`}
            >
              ✂️
              {isScissorClipping ? 'Clipping!' : 'Sound Test: Scissors'}
            </button>
          </div>
          <span className="text-[10px] text-brand-teal-400 font-mono hidden sm:inline">
            SYSTEM: OK • 2026-05
          </span>
        </div>

      </div>

      {/* 2. Right Inspect Panel & Package Builder (4 Columns) */}
      <div className="lg:col-span-4 flex flex-col justify-between selection:bg-brand-teal-700">
        
        {/* UPPER INFO MODULE: Detailed presentation of inspected object/product */}
        <div className="flex-1 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            
            {/* TROLLEY BOTTLE INSPECT PANEL */}
            {activeTab === 'trolley' && (
              <motion.div
                key={`inspect-trolley-${selectedShelf}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-teal-900/25 border border-brand-teal-800/30 rounded-3xl p-5"
              >
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-brand-teal-800/60 border border-brand-teal-700 rounded-full font-mono text-[9px] text-brand-teal-200 tracking-wider uppercase font-semibold">
                      Shelf {selectedShelf} Specimen
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mt-1.5 leading-tight">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  
                  {/* Circular visual category representation */}
                  <span className="text-2xl" title={selectedProduct.category}>
                    {selectedShelf === 1 ? '🧴' : selectedShelf === 2 ? '🍯' : selectedShelf === 3 ? '🧪' : '💨'}
                  </span>
                </div>

                <p className="text-xs text-brand-teal-200 font-sans leading-relaxed mb-4 pb-4 border-b border-brand-teal-800/40">
                  {selectedProduct.description}
                </p>

                {/* Benefits checklist */}
                <div className="space-y-2 mb-4">
                  <p className="font-serif text-[11px] font-bold text-gold-500 uppercase tracking-widest">
                    Key Micro-Benefits:
                  </p>
                  {selectedProduct.benefits.map((benefit, bi) => (
                    <div key={bi} className="flex gap-2 items-start text-[11px] text-zinc-300">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Spec sheets */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-2.5 bg-brand-teal-950/40 rounded-xl border border-brand-teal-800/30 text-xs">
                  <div>
                    <span className="text-[10px] text-brand-teal-400 block mb-0.5 font-mono uppercase">Standard Volume:</span>
                    <span className="font-semibold text-white">{selectedProduct.volume}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-teal-400 block mb-0.5 font-mono uppercase">Addon Price:</span>
                    <span className="font-semibold text-gold-200">${selectedProduct.price} USD</span>
                  </div>
                </div>

                {/* Trolley inspect actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onAddProductToBooking(selectedProduct);
                    }}
                    className={`flex-1 p-3 rounded-xl text-xs font-bold transition duration-300 flex items-center justify-center gap-2 ${
                      isProductAdded
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gold-500 hover:bg-gold-600 text-brand-teal-950 shadow-md shadow-gold-950/20'
                    }`}
                  >
                    {isProductAdded ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Added to Booking
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 font-bold" /> Add Product Addon
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* CHAIR DETAIL INSPECT PANEL */}
            {activeTab === 'chair' && (
              <motion.div
                key={`inspect-chair`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-teal-900/25 border border-brand-teal-800/30 rounded-3xl p-5"
              >
                <div className="mb-4">
                  <span className="px-2.5 py-0.5 bg-brand-teal-800/60 border border-brand-teal-700 rounded-full font-mono text-[9px] text-brand-teal-200 tracking-wider uppercase font-semibold">
                    Interactive Furniture Spec
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-1.5 leading-tight">
                    Premium Muskan Hydraulic Styling Chair
                  </h3>
                </div>

                <p className="text-xs text-brand-teal-200 font-sans leading-relaxed mb-4">
                  Built specifically for Muskan Hair & Beauty Salon at St Marys. Designed to maximize client comfort during threading, eyelash liftings, relaxing herbal facials, and precision hair colouring.
                </p>

                <div className="space-y-3 mb-5 p-3 bg-brand-teal-950/40 rounded-xl border border-brand-teal-800/20 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-teal-400">Current Lift offset:</span>
                    <span className="font-semibold text-white">{chairHeight} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-teal-400">Upholstery Textile:</span>
                    <span className="font-semibold text-gold-200 uppercase">{upholsteryConfig[chairColor].label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-teal-400">Star Base support:</span>
                    <span className="font-semibold text-white">Chromed Brushed Steel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-teal-400">Weight Capacity:</span>
                    <span className="font-semibold text-emerald-400">Up to 240kg (Hydraulic)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playChime();
                    // Choose gold color upholstery for the prestige vibe
                    setChairColor('luxury-gold');
                    setChairHeight(30);
                  }}
                  className="w-full p-2.5 border border-brand-teal-700 bg-brand-teal-900/40 text-xs font-semibold text-brand-teal-100 hover:text-white rounded-xl hover:bg-brand-teal-800/40 transition"
                >
                  Reset to Premium Sovereign Vibe
                </button>
              </motion.div>
            )}

            {/* LIGHTING SYSTEM INSPECT PANEL */}
            {activeTab === 'lighting' && (
              <motion.div
                key={`inspect-lighting`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-teal-900/25 border border-brand-teal-800/30 rounded-3xl p-5"
              >
                <div className="mb-4">
                  <span className="px-2.5 py-0.5 bg-brand-teal-800/60 border border-brand-teal-700 rounded-full font-mono text-[9px] text-brand-teal-200 tracking-wider uppercase font-semibold">
                    Studio Ambience Spec
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-1.5 leading-tight">
                    Smart LED Chromatic Mirror Station
                  </h3>
                </div>

                <p className="text-xs text-brand-teal-200 font-sans leading-relaxed mb-4">
                  Premium backlit LEDs built to replicate diverse environmental lighting conditions. Allows precision styling matching where the customer intends to showcase their hair (fine dinners, outside daylight, or nightclub glows).
                </p>

                <div className="space-y-3 p-3 bg-brand-teal-950/40 rounded-xl border border-brand-teal-800/20 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span><strong>Warm Candlelight:</strong> Perfect for high-end dining, ballrooms, and low-light evening lounges.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    <span><strong>Daylight Studio:</strong> Sharp 5500 Kelvin light replicating standard daylight and high-definition photography.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span><strong>Muskan Emerald Aurora:</strong> Calms strain, providing luxury deep emerald ambient studio focus.</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* PACKAGE SUMMARY BUILDER PANEL AT THE BOTTOM */}
        <div className="mt-6 bg-gradient-to-br from-brand-teal-900/60 to-brand-teal-950/80 border border-brand-teal-700/50 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-teal-800/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <h4 className="font-serif text-sm font-bold text-white">Your Selections</h4>
            </div>
            <span className="font-mono text-xs text-brand-teal-300 font-semibold bg-brand-teal-950 px-2.5 py-0.5 rounded-lg border border-brand-teal-800/60">
              {selectedAddons.length} products
            </span>
          </div>

          {selectedAddons.length === 0 ? (
            <div className="text-center py-4 bg-brand-teal-950/50 rounded-2xl border border-brand-teal-800/20 text-xs text-brand-teal-300">
              <p>Explore the Muskan display shelf levels.</p>
              <p className="text-[10px] text-brand-teal-400 mt-1 font-mono uppercase">Add custom products as booking supplements.</p>
            </div>
          ) : (
            <div className="max-h-[120px] overflow-y-auto space-y-2 mb-4 pr-1">
              {selectedAddons.map((addPr) => (
                <div key={addPr.id} className="flex items-center justify-between text-xs p-2 bg-brand-teal-950/80 rounded-xl border border-brand-teal-800/40">
                  <div className="mr-2">
                    <p className="font-medium text-white line-clamp-1">{addPr.name}</p>
                    <p className="text-[9px] text-brand-teal-400">Shelf {addPr.shelf} Specimen • {addPr.volume}</p>
                  </div>
                  <span className="font-bold text-gold-200 shrink-0">${addPr.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Checkout & reservation call trigger */}
          <button
            onClick={() => {
              playChime();
              openBookingWithPackage();
            }}
            className="w-full py-3 bg-brand-teal-600 hover:bg-brand-teal-500 text-white hover:text-white rounded-xl text-xs uppercase font-sans tracking-widest font-bold transition-all shadow-md hover:shadow-brand-teal-800/40 cursor-pointer"
          >
            Proceed to Appointment Booking
          </button>
        </div>

      </div>

    </div>
  );
}
