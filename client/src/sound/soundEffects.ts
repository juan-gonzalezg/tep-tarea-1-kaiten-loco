// Web Audio API Hostile Sound Synthesizer
let audioCtx: AudioContext | null = null;
let isAudioInitialized = false;
let isJingleRunning = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Initialized on any user gesture
export function initHostileAudio() {
  if (isAudioInitialized) return;
  try {
    getAudioContext();
    isAudioInitialized = true;
    startUnpausableBackgroundJingle();
  } catch (err) {
    console.warn('Audio autoplay delayed until user interaction');
  }
}

// Annoying high-pitch beep on hover
export function playHoverBeep(freq = 1480, duration = 0.04) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

// Harsh alarm buzz on error or layout shift
export function playHarshBuzz() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // ignore
  }
}

// Countdown tick
export function playCountdownTick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // ignore
  }
}

// 8-bit repetitive conveyor belt tune that plays without pause button
function startUnpausableBackgroundJingle() {
  if (isJingleRunning) return;
  isJingleRunning = true;

  const notes = [
    523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33,
    523.25, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25
  ];
  let noteIndex = 0;

  setInterval(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);

      noteIndex++;
    } catch {
      // ignore
    }
  }, 240);
}

// Global hook on window to activate audio on first click or pointermove
if (typeof window !== 'undefined') {
  const activateAudio = () => {
    initHostileAudio();
    window.removeEventListener('pointerdown', activateAudio);
    window.removeEventListener('keydown', activateAudio);
  };
  window.addEventListener('pointerdown', activateAudio);
  window.addEventListener('keydown', activateAudio);
}
