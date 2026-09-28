import { useState } from 'react';
import { CROSS_BRIDGES, type CrossBridge } from '../data/crossBridgesData';
import { ArrowRight, Layers } from 'lucide-react';

export function BridgeEngine({ onExploreInAi }: { onExploreInAi: (concept: string) => void }) {
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>(CROSS_BRIDGES[0].id);

  const selectedBridge: CrossBridge = CROSS_BRIDGES.find((b) => b.id === selectedBridgeId) || CROSS_BRIDGES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Cross-Disciplinary Bridge Engine</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Universal physical and mathematical isomorphisms connecting all branches of engineering.
          </p>
        </div>
      </div>

      {/* Bridge Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CROSS_BRIDGES.map((bridge) => {
          const active = bridge.id === selectedBridgeId;
          return (
            <button
              key={bridge.id}
              onClick={() => setSelectedBridgeId(bridge.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                active
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-bold block mb-1 ${active ? 'text-cyan-300' : 'text-white'}`}>
                {bridge.universalPrinciple}
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {bridge.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Bridge Overview */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>UNIVERSAL ISOMORPHISM</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{selectedBridge.universalPrinciple}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-4xl">
            {selectedBridge.mentalModelDescription}
          </p>
        </div>

        {/* Matrix Comparison Table */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
            Branch-by-Branch Variable Equivalence Matrix
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBridge.branches.map((b, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-white block">{b.branchName}</span>
                  <span className="text-[11px] font-mono text-cyan-400">{b.domainTerm}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Potential Variable (Gradient):</span>
                    <span className="font-semibold text-slate-200">{b.potentialVariable}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Flow Variable (Rate):</span>
                    <span className="font-semibold text-slate-200">{b.flowVariable}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Opposition / Resistance:</span>
                    <span className="text-slate-300">{b.oppositionResistance}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg text-center font-mono text-xs text-cyan-300">
                  {b.governingFormula}
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  <strong className="text-slate-300">Scenario:</strong> {b.concreteExample}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capstone Convergence Highlight */}
        <div className="p-5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                Convergent Multi-Disciplinary System
              </span>
              <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                {selectedBridge.multiDisciplinaryCapstone.systemName}
              </h4>
            </div>
            <button
              onClick={() => onExploreInAi(selectedBridge.universalPrinciple)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shrink-0"
            >
              Analyze with AI Copilot
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedBridge.multiDisciplinaryCapstone.description}
          </p>

          <div className="p-3 bg-slate-900/90 rounded-lg text-xs text-slate-300 border border-slate-800">
            <strong className="text-amber-400 block mb-1">How Engineering Branches Converge:</strong>
            {selectedBridge.multiDisciplinaryCapstone.howDisciplinesConverge}
          </div>
        </div>
      </div>
    </div>
  );
}
