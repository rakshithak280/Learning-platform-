import { useState, useEffect, useRef, useId } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export function ThermodynamicsLab() {
  const [cycleType, setCycleType] = useState<'carnot' | 'otto' | 'diesel' | 'brayton'>('otto');
  const [compressionRatio, setCompressionRatio] = useState<number>(9.5); // r = V1 / V2
  const [tempHighC, setTempHighC] = useState<number>(1400); // Peak combustion temp
  const [tempLowC, setTempLowC] = useState<number>(25); // Ambient sink temp
  const [gamma, setGamma] = useState<number>(1.4); // Air heat capacity ratio (Cp / Cv)
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cyclePhaseRef = useRef<number>(0);

  const tHighK = tempHighC + 273.15;
  const tLowK = tempLowC + 273.15;

  // Efficiency Calculations
  const carnotEff = 1 - (tLowK / tHighK);

  let cycleEff = 0;
  if (cycleType === 'carnot') {
    cycleEff = carnotEff;
  } else if (cycleType === 'otto') {
    cycleEff = 1 - (1 / Math.pow(compressionRatio, gamma - 1));
  } else if (cycleType === 'diesel') {
    const rc = 2.0; // cutoff ratio
    cycleEff = 1 - (1 / Math.pow(compressionRatio, gamma - 1)) * ((Math.pow(rc, gamma) - 1) / (gamma * (rc - 1)));
  } else {
    // Brayton
    const pr = 12; // pressure ratio
    cycleEff = 1 - (1 / Math.pow(pr, (gamma - 1) / gamma));
  }

  // Work and heat estimations
  const heatInKj = 1200; // assumed kJ/kg
  const netWorkKj = heatInKj * cycleEff;
  const heatOutKj = heatInKj - netWorkKj;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      if (isAnimating) {
        cyclePhaseRef.current = (cyclePhaseRef.current + 0.015) % (Math.PI * 2);
      }

      const phase = cyclePhaseRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw PV Axes
      const ox = 70;
      const oy = height - 50;
      const axWidth = width - 110;
      const axHeight = height - 90;

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // P-axis
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox, oy - axHeight);
      ctx.stroke();

      // V-axis
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axWidth, oy);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText('P (Pressure)', ox - 20, oy - axHeight - 10);
      ctx.fillText('V (Volume)', ox + axWidth - 20, oy + 25);

      // Define 4 Cycle Coordinates in PV Space
      // V1 = V_max (bottom right), V2 = V_min (top left)
      const vMin = ox + 40;
      const vMax = ox + axWidth - 30;
      const pMin = oy - 25;
      const pMax = oy - axHeight + 20;
      const pMid = oy - axHeight * 0.55;

      let p1 = { x: vMax, y: pMin, label: '1' };
      let p2 = { x: vMin, y: pMid, label: '2' };
      let p3 = { x: vMin, y: pMax, label: '3' };
      let p4 = { x: vMax, y: oy - axHeight * 0.35, label: '4' };

      if (cycleType === 'brayton') {
        p2 = { x: vMin + 40, y: pMax + 40, label: '2' };
        p3 = { x: vMax - 60, y: pMax + 40, label: '3' };
      } else if (cycleType === 'diesel') {
        p3 = { x: vMin + 70, y: pMax, label: '3' };
      }

      // Draw Enclosed PV Loop Area with gradient fill
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      // Curve 1->2 (Compression)
      ctx.quadraticCurveTo(p1.x - (p1.x - p2.x) * 0.6, p1.y - 10, p2.x, p2.y);
      // Line or Curve 2->3 (Heat addition)
      ctx.lineTo(p3.x, p3.y);
      // Curve 3->4 (Expansion / Power Stroke)
      ctx.quadraticCurveTo(p3.x + (p4.x - p3.x) * 0.4, p3.y + 40, p4.x, p4.y);
      // Line 4->1 (Heat rejection)
      ctx.closePath();
      ctx.fill();

      // Stroke loop boundary
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw State Points & Labels
      [p1, p2, p3, p4].forEach((pt) => {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.fillText(`State ${pt.label}`, pt.x + 8, pt.y - 6);
      });

      // Moving Current State Indicator along the cycle path
      const cycleNorm = (phase / (Math.PI * 2));
      let curX = p1.x;
      let curY = p1.y;

      if (cycleNorm < 0.25) {
        const t = cycleNorm / 0.25;
        curX = p1.x + (p2.x - p1.x) * t;
        curY = p1.y + (p2.y - p1.y) * Math.pow(t, 1.4);
      } else if (cycleNorm < 0.5) {
        const t = (cycleNorm - 0.25) / 0.25;
        curX = p2.x + (p3.x - p2.x) * t;
        curY = p2.y + (p3.y - p2.y) * t;
      } else if (cycleNorm < 0.75) {
        const t = (cycleNorm - 0.5) / 0.25;
        curX = p3.x + (p4.x - p3.x) * t;
        curY = p3.y + (p4.y - p3.y) * Math.pow(t, 0.7);
      } else {
        const t = (cycleNorm - 0.75) / 0.25;
        curX = p4.x + (p1.x - p4.x) * t;
        curY = p4.y + (p1.y - p4.y) * t;
      }

      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(curX, curY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Piston Cylinder Animation inset (Top Right corner)
      const px = width - 150;
      const py = 30;
      const pW = 100;
      const pH = 70;

      // Cylinder outline
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pW, pH);

      // Piston position inside cylinder (oscillates with phase)
      const pistonOffset = (Math.cos(phase) + 1) * 0.5 * (pW - 35);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + pistonOffset, py + 4, 18, pH - 8);

      // Connecting rod
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + pistonOffset + 18, py + pH / 2);
      ctx.lineTo(px + pW + 20, py + pH / 2 + Math.sin(phase) * 12);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('PISTON CYLINDER', px, py + pH + 15);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAnimating, cycleType, compressionRatio, tHighK, tLowK, gamma]);

  const compSliderId = useId();
  const thSliderId = useId();
  const tcSliderId = useId();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Thermodynamic Heat Engine & PV Cycle Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Synchronized PV diagram and animated piston-cylinder simulating Carnot, Otto, and Diesel thermal cycles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isAnimating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isAnimating ? 'Pause Cycle' : 'Play Engine'}
          </button>
          <button
            onClick={() => {
              setCompressionRatio(9.5);
              setTempHighC(1400);
              setTempLowC(25);
              setGamma(1.4);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: PV Diagram & Real-time Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-bold text-white tracking-wider">{cycleType} CYCLE PV DIAGRAM</span>
              <span className="font-mono text-cyan-400">WORKING FLUID: AIR (γ = {gamma})</span>
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

            {/* Efficiency & Thermodynamic Performance Row */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Thermal Efficiency (η)</span>
                <span className="font-mono text-lg font-bold text-cyan-400 tabular-nums">
                  {(cycleEff * 100).toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                  Carnot Ceiling: {(carnotEff * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Net Work Output (W_net)</span>
                <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                  {netWorkKj.toFixed(0)} kJ/kg
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                  Qin = {heatInKj} kJ/kg
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Heat Rejected (Q_out)</span>
                <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
                  {heatOutKj.toFixed(0)} kJ/kg
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                  Entropy lost to sink
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Cross-Branch Insight (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white">Engine Cycle Controls</h3>

            {/* Cycle Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Thermodynamic Ideal Cycle</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'otto', name: 'Otto (Petrol / Gasoline)' },
                  { id: 'diesel', name: 'Diesel (Heavy Engine)' },
                  { id: 'brayton', name: 'Brayton (Jet Turbine)' },
                  { id: 'carnot', name: 'Carnot (Theoretical Max)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCycleType(c.id as typeof cycleType)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors ${
                      cycleType === c.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Compression Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={compSliderId} className="text-slate-300 font-medium">Compression Ratio (r = V1 / V2)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{compressionRatio.toFixed(1)} : 1</span>
              </div>
              <input
                id={compSliderId}
                type="range"
                min="5"
                max="22"
                step="0.5"
                value={compressionRatio}
                onChange={(e) => setCompressionRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>8:1 (Standard Petrol)</span>
                <span>16:1–22:1 (Diesel)</span>
              </div>
            </div>

            {/* Peak Temp Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={thSliderId} className="text-slate-300 font-medium">Peak Gas Temperature (T_max)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{tempHighC} °C ({tHighK.toFixed(0)} K)</span>
              </div>
              <input
                id={thSliderId}
                type="range"
                min="600"
                max="2200"
                step="50"
                value={tempHighC}
                onChange={(e) => setTempHighC(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Cold Sink Temp */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={tcSliderId} className="text-slate-300 font-medium">Sink Exhaust Temperature (T_min)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{tempLowC} °C ({tLowK.toFixed(0)} K)</span>
              </div>
              <input
                id={tcSliderId}
                type="range"
                min="0"
                max="80"
                step="5"
                value={tempLowC}
                onChange={(e) => setTempLowC(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Second Law of Thermodynamics Insight */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-white block">The Kelvin-Planck Invariant</span>
              <p className="leading-relaxed">
                No heat engine can convert 100% of absorbed heat into work. To complete a closed thermodynamic cycle, the working gas must be cooled and compressed back to its starting state, necessarily dumping heat <code className="text-amber-400 font-mono">Q_out</code> into a cold sink.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
