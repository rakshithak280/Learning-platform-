import { useState, useEffect, useRef, useId } from 'react';
import { Volume2, VolumeX, Play, Pause, RefreshCw } from 'lucide-react';
import { ASSET_IMAGES } from '../../assets/images';

export function SignalLab() {
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'triangle' | 'pwm'>('sine');
  const [frequencyHz, setFrequencyHz] = useState<number>(440); // 440 Hz (Concert A)
  const [amplitudeV, setAmplitudeV] = useState<number>(2.5); // Volts
  const [filterType, setFilterType] = useState<'none' | 'lowpass' | 'highpass'>('none');
  const [cutoffHz, setCutoffHz] = useState<number>(1000); // Filter cutoff
  const [noiseLevel, setNoiseLevel] = useState<number>(0.1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeOffsetRef = useRef<number>(0);

  // Web Audio Hook
  useEffect(() => {
    if (!audioEnabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform === 'pwm' ? 'square' : waveform;
      osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // keep gentle volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.error('Audio initialization error:', e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [audioEnabled, waveform]);

  // Update oscillator frequency on the fly
  useEffect(() => {
    if (oscillatorRef.current && audioCtxRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequencyHz, audioCtxRef.current.currentTime);
    }
  }, [frequencyHz]);

  // Oscilloscope Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw horizontal center zero volt axis
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isPlaying) {
        timeOffsetRef.current += 0.05 * (frequencyHz / 200);
      }

      const t = timeOffsetRef.current;

      // Filter attenuation calculation
      let filterGain = 1.0;
      if (filterType === 'lowpass') {
        filterGain = 1 / Math.sqrt(1 + Math.pow(frequencyHz / cutoffHz, 2));
      } else if (filterType === 'highpass') {
        filterGain = (frequencyHz / cutoffHz) / Math.sqrt(1 + Math.pow(frequencyHz / cutoffHz, 2));
      }

      const effectiveAmp = amplitudeV * filterGain;
      const scaleY = (height / 2 - 20) / 4.0; // scale 4V peak-to-peak to canvas height

      // Draw input signal trace (faint grey reference)
      if (filterType !== 'none') {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const sampleTime = (x / width) * 4 * Math.PI + t;
          let rawVal = 0;
          if (waveform === 'sine') {
            rawVal = Math.sin(sampleTime);
          } else if (waveform === 'square') {
            rawVal = Math.sin(sampleTime) >= 0 ? 1 : -1;
          } else if (waveform === 'triangle') {
            rawVal = (2 / Math.PI) * Math.asin(Math.sin(sampleTime));
          } else if (waveform === 'pwm') {
            const phase = (sampleTime % (2 * Math.PI)) / (2 * Math.PI);
            rawVal = phase < 0.25 ? 1 : -1;
          }
          const y = centerY - rawVal * amplitudeV * scaleY;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw filtered output signal trace (vibrant cyan glow)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const sampleTime = (x / width) * 4 * Math.PI + t;
        let rawVal = 0;

        if (waveform === 'sine') {
          rawVal = Math.sin(sampleTime);
        } else if (waveform === 'square') {
          rawVal = Math.sin(sampleTime) >= 0 ? 1 : -1;
        } else if (waveform === 'triangle') {
          rawVal = (2 / Math.PI) * Math.asin(Math.sin(sampleTime));
        } else if (waveform === 'pwm') {
          const phase = ((sampleTime % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI);
          rawVal = phase < 0.25 ? 1 : -1;
        }

        // Add Gaussian pseudo-noise
        const noise = (Math.sin(x * 12.9898 + t * 5) * 43758.5453) % 1;
        const noisyVal = rawVal + (noise - 0.5) * noiseLevel;

        const filteredVal = noisyVal * effectiveAmp;
        const y = centerY - filteredVal * scaleY;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, waveform, frequencyHz, amplitudeV, filterType, cutoffHz, noiseLevel]);

  // Compute Fourier Harmonic Bars
  const computeHarmonics = () => {
    if (waveform === 'sine') {
      return [{ harmonic: '1f (Fund)', mag: 1.0 }, { harmonic: '2f', mag: 0.0 }, { harmonic: '3f', mag: 0.0 }, { harmonic: '4f', mag: 0.0 }, { harmonic: '5f', mag: 0.0 }];
    } else if (waveform === 'square') {
      return [{ harmonic: '1f (Fund)', mag: 1.0 }, { harmonic: '3f', mag: 0.333 }, { harmonic: '5f', mag: 0.20 }, { harmonic: '7f', mag: 0.143 }, { harmonic: '9f', mag: 0.111 }];
    } else if (waveform === 'triangle') {
      return [{ harmonic: '1f (Fund)', mag: 1.0 }, { harmonic: '3f', mag: 0.111 }, { harmonic: '5f', mag: 0.04 }, { harmonic: '7f', mag: 0.02 }, { harmonic: '9f', mag: 0.012 }];
    } else {
      return [{ harmonic: '1f (Fund)', mag: 0.8 }, { harmonic: '2f', mag: 0.6 }, { harmonic: '3f', mag: 0.4 }, { harmonic: '4f', mag: 0.25 }, { harmonic: '5f', mag: 0.15 }];
    }
  };

  const harmonics = computeHarmonics();

  const freqSliderId = useId();
  const ampSliderId = useId();
  const cutSliderId = useId();
  const noiseSliderId = useId();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Dynamic Signal & Harmonic Frequency Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time oscilloscope, RC frequency response filtering, and Fourier spectral breakdown.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? 'Freeze Time' : 'Run Wave'}
          </button>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              audioEnabled ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            {audioEnabled ? 'Audio Active' : 'Listen Tone'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Oscilloscope Canvas & Harmonic Spectrum (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">CH1: {amplitudeV}V / div · f = {frequencyHz} Hz</span>
              <span className="font-mono text-cyan-400">
                FILTER: {filterType.toUpperCase()} {filterType !== 'none' ? `(fc = ${cutoffHz}Hz)` : ''}
              </span>
            </div>

            {/* Canvas */}
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-slate-800">
              <canvas
                ref={canvasRef}
                width={700}
                height={350}
                className="w-full h-full block"
              />
            </div>

            {/* Fourier Spectral Analyzer */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium text-slate-300">Fast Fourier Transform (FFT) Harmonic Distribution</span>
                <span className="font-mono text-[11px] text-slate-500">Frequency Magnitude |X(f)|</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {harmonics.map((h, idx) => (
                  <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">{h.harmonic}</span>
                    <div className="w-full h-12 bg-slate-900 rounded flex items-end justify-center p-1">
                      <div
                        className="w-full bg-cyan-400 rounded-sm transition-all duration-200"
                        style={{ height: `${Math.max(4, h.mag * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">{(h.mag * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reference Diagram Card */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
            <img
              src={ASSET_IMAGES.circuitSignal}
              alt="Circuit signal diagram"
              className="w-24 h-18 object-cover rounded-lg border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">Nyquist & Fourier Equivalence</span>
              Any continuous real periodic waveform can be decomposed into an infinite sum of harmonically related sinusoids: $x(t) = a_0 + \sum [a_n \cos(n\omega_0 t) + b_n \sin(n\omega_0 t)]$.
            </div>
          </div>
        </div>

        {/* Right: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white">Waveform & Filter Deck</h3>

            {/* Waveform Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Generator Waveform</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['sine', 'square', 'triangle', 'pwm'] as const).map((wKey) => (
                  <button
                    key={wKey}
                    onClick={() => setWaveform(wKey)}
                    className={`py-2 px-1 text-xs font-medium rounded-lg border uppercase transition-colors ${
                      waveform === wKey
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {wKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={freqSliderId} className="text-slate-300 font-medium">Signal Frequency (f)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{frequencyHz} Hz</span>
              </div>
              <input
                id={freqSliderId}
                type="range"
                min="50"
                max="2500"
                step="10"
                value={frequencyHz}
                onChange={(e) => setFrequencyHz(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>50 Hz (Mains Hum)</span>
                <span>440 Hz (Note A4)</span>
                <span>2.5 kHz (Audio)</span>
              </div>
            </div>

            {/* Amplitude Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={ampSliderId} className="text-slate-300 font-medium">Peak Amplitude (Vp)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{amplitudeV.toFixed(1)} V</span>
              </div>
              <input
                id={ampSliderId}
                type="range"
                min="0.5"
                max="3.5"
                step="0.1"
                value={amplitudeV}
                onChange={(e) => setAmplitudeV(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Filter Configuration */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-medium block">Analog RC Filter Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'lowpass', 'highpass'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterType(mode)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                      filterType === mode
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'none' ? 'Bypass' : mode}
                  </button>
                ))}
              </div>

              {filterType !== 'none' && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={cutSliderId} className="text-slate-300 font-medium">Cutoff Frequency (fc = 1 / 2πRC)</label>
                    <span className="font-mono text-cyan-400 tabular-nums">{cutoffHz} Hz</span>
                  </div>
                  <input
                    id={cutSliderId}
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={cutoffHz}
                    onChange={(e) => setCutoffHz(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}
            </div>

            {/* Noise Injection Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={noiseSliderId} className="text-slate-300 font-medium">Thermal Noise Injection (SNR)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{(noiseLevel * 100).toFixed(0)}%</span>
              </div>
              <input
                id={noiseSliderId}
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
