// Web Audio API synthesiser for immersive high-end salon audio feedback.
// Zero external files makes this robust, lightweight, and offline-compatible.

let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let dryerNoiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
let dryerFilterNode: BiquadFilterNode | null = null;
let dryerGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create an elegant, crystal bell metallic chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.1); // High bell chime sweep
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now); // E6 note
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  } catch (e) {
    console.warn('Audio Context blocked or not supported yet: ', e);
  }
}

export function playSnip() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Simulate a crisp "snip-snip" of styling shears using highpass-filtered pink/white noise bursts
    // Creating white noise buffer
    const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // First snip burst
    const noise1 = ctx.createBufferSource();
    noise1.buffer = buffer;
    
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(4500, now);
    
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    noise1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);
    
    noise1.start(now);
    noise1.stop(now + 0.1);

    // Second overlapping snip burst
    const nowDelayed = now + 0.12;
    const noise2 = ctx.createBufferSource();
    noise2.buffer = buffer;
    
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(4000, nowDelayed);
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, nowDelayed);
    gain2.gain.linearRampToValueAtTime(0.1, nowDelayed + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, nowDelayed + 0.08);
    
    noise2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);
    
    noise2.start(nowDelayed);
    noise2.stop(nowDelayed + 0.1);
  } catch (e) {
    console.warn('Audio Context blocked clip: ', e);
  }
}

export function startDryerHum(): boolean {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    if (dryerGain) {
      stopDryerHum();
    }
    
    // Generate constant stream of white noise with lowpass filter sweep to simulate luxurious salon hairdryer
    const bufferSize = ctx.sampleRate * 2; // 2 sec loopable buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Fill with pinkish / brown noise (filtered white noise) for warmer dryer sound
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Filter coefficient for brownian walk sound
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 4.5; // raise volume base
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    
    dryerFilterNode = ctx.createBiquadFilter();
    dryerFilterNode.type = 'lowpass';
    dryerFilterNode.frequency.setValueAtTime(350, now);
    
    // Slow cosmetic thermal modulation LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.6; // 0.6 Hz filter wave
    lfoGain.gain.value = 80; // swing around filter
    
    lfo.connect(lfoGain);
    lfoGain.connect(dryerFilterNode.frequency);
    
    dryerGain = ctx.createGain();
    dryerGain.gain.setValueAtTime(0, now);
    dryerGain.gain.linearRampToValueAtTime(0.06, now + 0.5); // Warm raise
    
    noiseSource.connect(dryerFilterNode);
    dryerFilterNode.connect(dryerGain);
    dryerGain.connect(ctx.destination);
    
    lfo.start(now);
    noiseSource.start(now);
    
    // Store reference so we can stop it
    (noiseSource as any).lfoRef = lfo;
    (dryerGain as any).sourceRef = noiseSource;
    return true;
  } catch (e) {
    console.warn('Failed to start dryer sound: ', e);
    return false;
  }
}

export function stopDryerHum() {
  try {
    if (dryerGain) {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const currentGain = dryerGain;
      const source = (currentGain as any).sourceRef;
      const lfo = (currentGain as any).lfoRef;
      
      currentGain.gain.cancelScheduledValues(now);
      currentGain.gain.setValueAtTime(currentGain.gain.value, now);
      currentGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5); // smooth fade transition
      
      setTimeout(() => {
        try {
          if (source) source.stop();
          if (lfo) lfo.stop();
        } catch (e) {}
      }, 600);
      
      dryerGain = null;
      dryerFilterNode = null;
    }
  } catch (e) {}
}

export function startAmbientSoundtrack(): boolean {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    if (ambientGain) {
      stopAmbientSoundtrack();
    }
    
    // Synthesises a deep, beautiful, luxurious ambient drone/harmony in E major pentatonic scale
    ambientOsc1 = ctx.createOscillator();
    ambientOsc2 = ctx.createOscillator();
    ambientGain = ctx.createGain();
    
    ambientOsc1.type = 'triangle';
    ambientOsc1.frequency.setValueAtTime(164.81, now); // E3 chord root base
    // Slow pitch vibrato
    const lfo1 = ctx.createOscillator();
    const lfo1Gain = ctx.createGain();
    lfo1.frequency.value = 0.15;
    lfo1Gain.gain.value = 1.5;
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(ambientOsc1.frequency);
    lfo1.start(now);
    
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(246.94, now); // B3 luxury perfect fifth frequency
    // Slow pitch vibrato 2
    const lfo2 = ctx.createOscillator();
    const lfo2Gain = ctx.createGain();
    lfo2.frequency.value = 0.08;
    lfo2Gain.gain.value = 2.0;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(ambientOsc2.frequency);
    lfo2.start(now);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    
    ambientGain.gain.setValueAtTime(0, now);
    ambientGain.gain.linearRampToValueAtTime(0.04, now + 2.0); // soft volume ramp in
    
    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    
    ambientOsc1.start(now);
    ambientOsc2.start(now);
    
    // Safe reference storage to dismantle
    (ambientGain as any).osc1 = ambientOsc1;
    (ambientGain as any).osc2 = ambientOsc2;
    (ambientGain as any).lfo1 = lfo1;
    (ambientGain as any).lfo2 = lfo2;
    return true;
  } catch (e) {
    console.warn('Unable to play ambient soundtrack: ', e);
    return false;
  }
}

export function stopAmbientSoundtrack() {
  try {
    if (ambientGain) {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const currentGain = ambientGain;
      
      const osc1 = (currentGain as any).osc1;
      const osc2 = (currentGain as any).osc2;
      const lfo1 = (currentGain as any).lfo1;
      const lfo2 = (currentGain as any).lfo2;
      
      currentGain.gain.cancelScheduledValues(now);
      currentGain.gain.setValueAtTime(currentGain.gain.value, now);
      currentGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      
      setTimeout(() => {
        try {
          if (osc1) osc1.stop();
          if (osc2) osc2.stop();
          if (lfo1) lfo1.stop();
          if (lfo2) lfo2.stop();
        } catch (e) {}
      }, 1600);
      
      ambientGain = null;
      ambientOsc1 = null;
      ambientOsc2 = null;
    }
  } catch (e) {}
}
