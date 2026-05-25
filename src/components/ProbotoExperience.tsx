import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, Flame, ShieldAlert, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { KRONE_PRODUCTS } from '../data';
import { playChime, startDryerHum, stopDryerHum, playSnip } from '../utils/audio';

export default function ProbotoExperience() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState<number>(50); // percentage 0 to 100 for interactive slider mask
  const [isDryerSimulationRunning, setIsDryerSimulationRunning] = useState<boolean>(false);

  // Four Treatment stages corresponding to the 4 Muskan products
  const treatmentStages = [
    {
      title: 'Saffron Deep Radiance Cleanse (Step 1)',
      product: KRONE_PRODUCTS[2], // Saffron cleanser
      duration: '15 Minutes',
      intensity: 'Calming',
      icon: '🧖‍♀️',
      instruction: 'Apply the Muskan Ayurvedic Glow Saffron and Sandalwood Cleanser with soft, circular fingertip sweeps. Organic active elements lift scalp or facial impurities and gently open pores.',
      scientificFact: 'Kashmiri saffron acts as a natural antioxidant, working synergistically with sandalwood oil to brighten dull skin layers and lift impurities without stripping.'
    },
    {
      title: 'Organic Threading & Recovery (Step 2)',
      product: KRONE_PRODUCTS[1], // Soothing Gel
      duration: '15 Minutes',
      intensity: 'Soothing Restorative',
      icon: '✨',
      instruction: 'Perform precision Indian-technique threading followed by applying our cooling Aloe Recovery Gel over the treated areas. Aloe vera, cucumber, and lavender extracts calm dermal follicles instantly.',
      scientificFact: 'Active mucilage polysaccharides within newly harvested aloe vera gel create a breathable antiseptic seal that cools skin and reduces redness by up to 92%.'
    },
    {
      title: 'Herbal Brow & Lash Nourishment (Step 3)',
      product: KRONE_PRODUCTS[0], // Brow Oil
      duration: '10 Minutes',
      intensity: 'Root Stimulation',
      icon: '🌱',
      instruction: 'Brush the Herbal Brow & Lash Oil directly onto cleansed brow arches. A pure botanical blend of cold-pressed castor oil and rosemary stimulates local follicle metabolism.',
      scientificFact: 'Saturating hair root matrices with ricinoleic acid and biomimetic rosemary oils helps trigger accelerated growth resulting in thicker, highly defined brow arches.'
    },
    {
      title: 'Moroccan Argan Moisture Infusion (Step 4)',
      product: KRONE_PRODUCTS[3], // Argan hair serum
      duration: '45 Minutes',
      intensity: 'Keratin Seal',
      icon: '💨',
      instruction: 'Apply the Moroccan Argan Hair Elixir before styling. Complete under a warm blowout to activate high-potency keratin proteins, sealing moisture into the cuticular core.',
      scientificFact: 'Tandem lipids coat newly colored or cut locks, sealing microscopic fissures in hair cuticles to protect styling results from up to 98% ambient humidity.'
    }
  ];

  const handleStageNavigation = (index: number) => {
    setActiveStep(index);
    playChime();
    
    // Stop safe dryer sound when stepping away from the thermal finish stage
    if (index !== 3) {
      stopDryerHum();
      setIsDryerSimulationRunning(false);
    }
  };

  const toggleTreatmentDryer = () => {
    if (isDryerSimulationRunning) {
      stopDryerHum();
      setIsDryerSimulationRunning(false);
    } else {
      const live = startDryerHum();
      if (live) setIsDryerSimulationRunning(true);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 selection:bg-brand-teal-750">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/30 rounded-full font-mono text-[10px] text-gold-500 uppercase tracking-widest font-bold">
          The Muskan Beauty Suite
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          The Ayurvedic & Threading Alchemy
        </h2>
        <p className="text-xs text-brand-teal-200 leading-relaxed font-sans">
          Discover how our organic, cold-pressed herbal remedies nourish skin, stimulate brow density, and protect hair fibers against external stressors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* 2. Left side: Stage Details & Interactive Simulators (7 Columns) */}
        <div className="md:col-span-7 bg-brand-teal-950 border border-brand-teal-800/40 rounded-3xl p-6 shadow-xl space-y-6">
          
          {/* Quick Stage Steps Navigation List */}
          <div className="flex gap-1 bg-brand-teal-900/40 p-1 border border-brand-teal-900/60 rounded-xl overflow-x-auto">
            {treatmentStages.map((stage, i) => (
              <button
                key={i}
                onClick={() => handleStageNavigation(i)}
                className={`flex-1 p-2 rounded-lg text-center text-xs font-semibold whitespace-nowrap transition-all ${
                  activeStep === i 
                    ? 'bg-brand-teal-700 text-white shadow-md' 
                    : 'text-brand-teal-300 hover:text-white hover:bg-brand-teal-800/20'
                }`}
              >
                Stage {i+1}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-xs"
            >
              <div className="flex justify-between items-start border-b border-brand-teal-900 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-brand-teal-900/50 p-2.5 rounded-2xl border border-brand-teal-800/30 block shadow">
                    {treatmentStages[activeStep].icon}
                  </span>
                  <div>
                    <span className="font-mono text-[9px] text-gold-500 font-bold block uppercase tracking-wider">
                      PROCESS STAGE 0{activeStep + 1} • {treatmentStages[activeStep].duration}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white mt-1 uppercase">
                      {treatmentStages[activeStep].title}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-brand-teal-900/80 border border-gold-500/20 text-gold-500 font-mono text-[9px] uppercase rounded font-bold">
                  {treatmentStages[activeStep].intensity} Focus
                </span>
              </div>

              {/* Step instructions */}
              <div className="p-4 bg-brand-teal-900/15 border border-brand-teal-900 rounded-2xl">
                <h4 className="font-serif font-bold text-white mb-1.5 uppercase text-[10px] tracking-wider">Suite Instructions:</h4>
                <p className="text-brand-teal-200 leading-relaxed font-sans">
                  {treatmentStages[activeStep].instruction}
                </p>
              </div>

              {/* Scientific Fact box */}
              <div className="p-4 bg-gradient-to-r from-brand-teal-950 to-brand-teal-900 border border-brand-teal-800/40 rounded-2xl flex gap-3">
                <Zap className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-gold-100 uppercase text-[10px] tracking-wider mb-0.5">Molecular Mechanics:</h4>
                  <p className="text-zinc-300 leading-relaxed">
                    {treatmentStages[activeStep].scientificFact}
                  </p>
                </div>
              </div>

              {/* Interactive Audio controls triggered inside simulation step */}
              {activeStep === 3 && (
                <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-2xl flex items-center justify-between text-xs gap-3">
                  <div>
                    <span className="text-gold-200 font-serif font-bold block">Test Step 4 Blowout Elixir:</span>
                    <span className="text-[10px] text-brand-teal-300 block">Trigger lowpass filtered hairdryer sound simulator.</span>
                  </div>
                  <button
                    onClick={toggleTreatmentDryer}
                    className={`p-2 px-4 rounded-xl font-bold uppercase text-[10px] tracking-wider transition ${
                      isDryerSimulationRunning 
                        ? 'bg-amber-400 text-brand-teal-950 font-black scale-95 shadow-inner' 
                        : 'bg-gold-500 hover:bg-gold-600 text-brand-teal-950'
                    }`}
                  >
                    {isDryerSimulationRunning ? '■ Stop Hairdryer' : '▶ Play Hairdryer'}
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

        {/* 3. Right side: Before/After Interactive Sliding Canvas (5 Columns) */}
        <div className="md:col-span-5 bg-brand-teal-950 border border-brand-teal-800/40 rounded-3xl p-6 shadow-xl space-y-4">
          
          <div className="border-b border-brand-teal-900 pb-2">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold-500 animate-spin" style={{ animationDuration: '6s' }} />
              Result Visualizer
            </h3>
            <p className="text-[11px] text-brand-teal-300 font-sans mt-0.5 leading-tight">
              Drag the control slider to inspect <strong>Before vs. After</strong> cuticle structures.
            </p>
          </div>

          {/* SLIDER CONTAINER */}
          <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-brand-teal-900 select-none bg-brand-teal-950">
            
            {/* After (Healthy, Silky, Ultra-glass finish strands) */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400&h=400" 
                alt="High shine glassy hair filament result" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-110 contrast-125"
              />
              <div className="absolute bottom-3 right-3 bg-brand-teal-900/90 border border-emerald-500 text-emerald-400 font-mono text-[9px] px-2.5 py-0.5 rounded uppercase font-bold z-10">
                After Muskan Nourish (Glass Polish)
              </div>
            </div>

            {/* Before (Damaged, frizzy, dull split-ends hair filament layers) - Clipped by Slider percentage */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden z-10 transition-all border-r border-gold-500"
              style={{ width: `${beforeAfterSlider}%` }}
            >
              <div className="absolute inset-0 h-60 w-[420px]">
                <img 
                  src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400&h=400" 
                  alt="Damaged dry unkempt hair filament layer" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-75 saturate-150 blur-[2px]"
                />
              </div>
              <div className="absolute bottom-3 left-3 bg-red-950/90 border border-red-700 text-red-300 font-mono text-[9px] px-2.5 py-0.5 rounded uppercase font-bold whitespace-nowrap z-10">
                Before (Damaged Cuticles)
              </div>
            </div>

            {/* Micro visual slide line pointer */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-gold-400 pointer-events-none z-20"
              style={{ left: `${beforeAfterSlider}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6.5 h-6.5 rounded-full bg-gold-500 border border-yellow-200 text-brand-teal-950 font-black text-xs flex items-center justify-center shadow-lg">
                ↔
              </div>
            </div>

          </div>

          {/* Pure HTML input range control */}
          <div className="space-y-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={beforeAfterSlider}
              onChange={(e) => {
                setBeforeAfterSlider(Number(e.target.value));
                if (Number(e.target.value) % 15 === 0) playSnip(); // faint snap tick
              }}
              className="w-full h-1 bg-brand-teal-900 rounded-lg appearance-none cursor-ew-resize accent-gold-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-brand-teal-400">
              <span>BEFORE: 100%</span>
              <span>SLIDE FOCUS</span>
              <span>AFTER: 100%</span>
            </div>
          </div>

          <div className="bg-brand-teal-950/60 p-3 rounded-2xl border border-brand-teal-800/20 text-xs">
            <span className="font-serif font-bold text-white block mb-1">Restorations metrics:</span>
            <ul className="space-y-1 text-[11px] text-zinc-300 list-disc list-inside">
              <li>98% reduction in persistent environmental frizz</li>
              <li>Dual fiber strength enhanced by 2.4X</li>
              <li>Microscopic cracks along cuticular cells fully sealed</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
