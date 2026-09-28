import React, { useState, useId } from 'react';
import { ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { ASSET_IMAGES } from '../../assets/images';

export function StructuralLab() {
  const [loadKn, setLoadKn] = useState<number>(35); // Applied vertical load in kN
  const [loadPosRatio, setLoadPosRatio] = useState<number>(0.5); // Position along span (0 to 1)
  const [spanMeters, setSpanMeters] = useState<number>(12); // Span length in meters
  const [trussHeight, setTrussHeight] = useState<number>(3.5); // Height in meters
  const [material, setMaterial] = useState<'steel' | 'aluminum' | 'titanium'>('steel');

  const materials = {
    steel: { name: 'Structural Steel S355', yieldMpa: 355, youngsGpa: 210, density: 7850 },
    aluminum: { name: 'Aerospace Al 6061-T6', yieldMpa: 276, youngsGpa: 69, density: 2700 },
    titanium: { name: 'Titanium Ti-6Al-4V', yieldMpa: 880, youngsGpa: 114, density: 4430 },
  };

  const selectedMat = materials[material];

  // Reactions calculations for simply supported truss
  // Load applied at x = spanMeters * loadPosRatio
  const loadX = spanMeters * loadPosRatio;
  const reactionB = (loadKn * loadX) / spanMeters; // Right support reaction (kN)
  const reactionA = loadKn - reactionB; // Left support reaction (kN)

  // Maximum bending moment approximation
  const maxBendingMomentKnM = reactionA * loadX;

  // Maximum member force approximation in top chord (compression) and bottom chord (tension)
  const topChordForceKn = maxBendingMomentKnM / Math.max(0.5, trussHeight); // Compression
  const bottomChordForceKn = topChordForceKn; // Tension
  
  // Diagonal shear member force
  const diagonalAngleRad = Math.atan2(trussHeight, spanMeters / 4);
  const diagonalForceKn = Math.max(reactionA, reactionB) / Math.sin(diagonalAngleRad);

  // Cross section area assumed 1500 mm^2 = 0.0015 m^2
  const memberAreaMm2 = 1800;
  const maxStressMpa = (topChordForceKn * 1000) / memberAreaMm2; // MPa
  const factorOfSafety = selectedMat.yieldMpa / Math.max(1, maxStressMpa);

  // Deflection estimate (mm)
  const estDeflectionMm = (loadKn * 1000 * Math.pow(spanMeters, 3)) / (48 * selectedMat.youngsGpa * 1e9 * 0.00012) * 1000;

  const handleReset = () => {
    setLoadKn(35);
    setLoadPosRatio(0.5);
    setSpanMeters(12);
    setTrussHeight(3.5);
    setMaterial('steel');
  };

  const isSafe = factorOfSafety >= 1.5;

  const loadSliderId = useId();
  const posSliderId = useId();
  const spanSliderId = useId();
  const heightSliderId = useId();

  return (
    <div className="space-y-6">
      {/* Editorial Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Truss Bridge & Structural Load Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Interactive 2D Pratt Truss analyzer solving pin reactions, member axial forces, and material safety margins.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Parameters
          </button>
        </div>
      </div>

      {/* Two-Zone Layout: Left Stage (Visual) + Right Deck (Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-slate-900/90 rounded-xl border border-slate-800 p-5 overflow-hidden">
            {/* Background grid canvas aesthetic */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-mono">SPAN: {spanMeters}m · HEIGHT: {trussHeight}m</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <span className="w-2.5 h-1 bg-amber-500 inline-block rounded-full" /> Compression
                </span>
                <span className="flex items-center gap-1.5 font-medium text-cyan-400">
                  <span className="w-2.5 h-1 bg-cyan-500 inline-block rounded-full" /> Tension
                </span>
              </div>
            </div>

            {/* SVG Truss Diagram */}
            <div className="relative w-full aspect-[16/9] flex items-center justify-center">
              <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
                {/* Ground Line */}
                <line x1="40" y1="320" x2="760" y2="320" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                {/* Left Pin Support (A) */}
                <polygon points="100,320 85,345 115,345" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="100" cy="320" r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="100" y="365" textAnchor="middle" fill="#94a3b8" className="text-[12px] font-mono">
                  R_A = {reactionA.toFixed(1)} kN
                </text>

                {/* Right Roller Support (B) */}
                <polygon points="700,320 685,340 715,340" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="692" cy="346" r="4" fill="#64748b" />
                <circle cx="708" cy="346" r="4" fill="#64748b" />
                <circle cx="700" cy="320" r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="700" y="365" textAnchor="middle" fill="#94a3b8" className="text-[12px] font-mono">
                  R_B = {reactionB.toFixed(1)} kN
                </text>

                {/* Truss Node Coordinates */}
                {/* Bottom Nodes: N0(100,320), N1(250,320), N2(400,320), N3(550,320), N4(700,320) */}
                {/* Top Nodes: T1(250, 180), T2(400, 180), T3(550, 180) */}

                {/* Bottom Chord (Tension - Cyan) */}
                <line x1="100" y1="320" x2="250" y2="320" stroke="#06b6d4" strokeWidth="3" />
                <line x1="250" y1="320" x2="400" y2="320" stroke="#06b6d4" strokeWidth="4" />
                <line x1="400" y1="320" x2="550" y2="320" stroke="#06b6d4" strokeWidth="4" />
                <line x1="550" y1="320" x2="700" y2="320" stroke="#06b6d4" strokeWidth="3" />

                {/* Top Chord (Compression - Amber) */}
                <line x1="250" y1="180" x2="400" y2="180" stroke="#f59e0b" strokeWidth="4" />
                <line x1="400" y1="180" x2="550" y2="180" stroke="#f59e0b" strokeWidth="4" />

                {/* End Diagonals (Compression) */}
                <line x1="100" y1="320" x2="250" y2="180" stroke="#f59e0b" strokeWidth="3.5" />
                <line x1="700" y1="320" x2="550" y2="180" stroke="#f59e0b" strokeWidth="3.5" />

                {/* Vertical Web Members */}
                <line x1="250" y1="180" x2="250" y2="320" stroke="#06b6d4" strokeWidth="2.5" />
                <line x1="400" y1="180" x2="400" y2="320" stroke="#f59e0b" strokeWidth="3" strokeDasharray={loadPosRatio === 0.5 ? 'none' : '2 2'} />
                <line x1="550" y1="180" x2="550" y2="320" stroke="#06b6d4" strokeWidth="2.5" />

                {/* Diagonal Web Members */}
                <line x1="250" y1="180" x2="400" y2="320" stroke="#06b6d4" strokeWidth="2.5" />
                <line x1="550" y1="180" x2="400" y2="320" stroke="#06b6d4" strokeWidth="2.5" />

                {/* Truss Joints (Pins) */}
                {[[100,320], [250,320], [400,320], [550,320], [700,320], [250,180], [400,180], [550,180]].map(([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r="5.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
                ))}

                {/* Applied Load Arrow */}
                {(() => {
                  const arrowX = 100 + (700 - 100) * loadPosRatio;
                  const arrowY = 320;
                  return (
                    <g className="transition-all duration-150">
                      <line x1={arrowX} y1={arrowY - 80} x2={arrowX} y2={arrowY - 10} stroke="#ef4444" strokeWidth="3" />
                      <polygon points={`${arrowX},${arrowY} ${arrowX - 7},${arrowY - 16} ${arrowX + 7},${arrowY - 16}`} fill="#ef4444" />
                      <rect x={arrowX - 45} y={arrowY - 105} width="90" height="22" rx="4" fill="#020617" stroke="#ef4444" strokeWidth="1" />
                      <text x={arrowX} y={arrowY - 90} textAnchor="middle" fill="#fca5a5" className="text-[11px] font-mono font-bold">
                        P = {loadKn} kN
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Real-time State Callout */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Peak Top Chord</span>
                <span className="font-mono text-sm font-semibold text-amber-400 tabular-nums">
                  {topChordForceKn.toFixed(1)} kN C
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Max Bending Moment</span>
                <span className="font-mono text-sm font-semibold text-cyan-400 tabular-nums">
                  {maxBendingMomentKnM.toFixed(1)} kN·m
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Estimated Deflection</span>
                <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                  {estDeflectionMm.toFixed(2)} mm
                </span>
              </div>
            </div>
          </div>

          {/* Reference Blueprint Card */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
            <img
              src={ASSET_IMAGES.structuralTruss}
              alt="Structural truss mechanics diagram"
              className="w-24 h-18 object-cover rounded-lg border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">Method of Joints & Sections</span>
              At every pin node $\sum F_x = 0$ and $\sum F_y = 0$. Diagonal chords triangulate shear stress to preserve structural rigidity under eccentric moving loads.
            </div>
          </div>
        </div>

        {/* Control Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white">Parameter Controls</h3>

            {/* Load Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={loadSliderId} className="text-slate-300 font-medium">Applied Load (P)</label>
                <span className="font-mono text-cyan-400 tabular-nums">{loadKn} kN</span>
              </div>
              <input
                id={loadSliderId}
                type="range"
                min="5"
                max="120"
                step="1"
                value={loadKn}
                onChange={(e) => setLoadKn(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>5 kN (Light)</span>
                <span>120 kN (Heavy Truck)</span>
              </div>
            </div>

            {/* Load Position Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={posSliderId} className="text-slate-300 font-medium">Load Position Along Span</label>
                <span className="font-mono text-cyan-400 tabular-nums">{(loadPosRatio * 100).toFixed(0)}% (x = {loadX.toFixed(1)}m)</span>
              </div>
              <input
                id={posSliderId}
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={loadPosRatio}
                onChange={(e) => setLoadPosRatio(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Span Length Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={spanSliderId} className="text-slate-300 font-medium">Truss Span Length</label>
                <span className="font-mono text-cyan-400 tabular-nums">{spanMeters} m</span>
              </div>
              <input
                id={spanSliderId}
                type="range"
                min="6"
                max="24"
                step="1"
                value={spanMeters}
                onChange={(e) => setSpanMeters(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Truss Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={heightSliderId} className="text-slate-300 font-medium">Truss Depth / Height</label>
                <span className="font-mono text-cyan-400 tabular-nums">{trussHeight} m</span>
              </div>
              <input
                id={heightSliderId}
                type="range"
                min="1.5"
                max="6"
                step="0.25"
                value={trussHeight}
                onChange={(e) => setTrussHeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Material Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Material Grade</span>
              <div className="grid grid-cols-3 gap-2">
                {(['steel', 'aluminum', 'titanium'] as const).map((matKey) => (
                  <button
                    key={matKey}
                    onClick={() => setMaterial(matKey)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                      material === matKey
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {matKey === 'steel' && 'Steel S355'}
                    {matKey === 'aluminum' && 'Al 6061-T6'}
                    {matKey === 'titanium' && 'Ti-6Al-4V'}
                  </button>
                ))}
              </div>
            </div>

            {/* Structural Health & Factor of Safety (FoS) Card */}
            <div className={`p-4 rounded-xl border ${
              isSafe ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isSafe ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  <span className="font-semibold text-sm">
                    {isSafe ? 'Structural Condition: NOMINAL' : 'Structural Warning: OVERSTRESSED'}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold tabular-nums">
                  FoS: {factorOfSafety.toFixed(2)}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                Max Member Stress is <span className="font-mono font-semibold">{maxStressMpa.toFixed(1)} MPa</span> vs material yield strength of <span className="font-mono font-semibold">{selectedMat.yieldMpa} MPa</span>.
                {isSafe ? ' Meets standard engineering code (FoS ≥ 1.5).' : ' Exceeds allowable stress limit; increase truss height or select higher yield material.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
