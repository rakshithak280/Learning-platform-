import { useState } from 'react';
import { Search, Calculator, Check } from 'lucide-react';
import { FORMULA_COLLECTION, type EngineeringFormula } from '../data/formulasData';

export function FormulaBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(FORMULA_COLLECTION[0].id);

  const selectedFormula = FORMULA_COLLECTION.find(f => f.id === selectedFormulaId) || FORMULA_COLLECTION[0];

  // Parameter state dictionary
  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    selectedFormula.variables.forEach(v => {
      initial[v.symbol] = v.defaultVal;
    });
    return initial;
  });

  const handleSelectFormula = (f: EngineeringFormula) => {
    setSelectedFormulaId(f.id);
    const initial: Record<string, number> = {};
    f.variables.forEach(v => {
      initial[v.symbol] = v.defaultVal;
    });
    setParams(initial);
  };

  const handleParamChange = (symbol: string, val: number) => {
    setParams(prev => ({ ...prev, [symbol]: val }));
  };

  const filteredFormulas = FORMULA_COLLECTION.filter(f => {
    const q = searchQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.discipline.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  const calculation = selectedFormula.calculateResult(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Universal Formula Compendium & Live Calculators</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Key physical and mathematical laws across all engineering fields with interactive parameter calculators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & Formula Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations, laws, or branches..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredFormulas.map((f) => {
              const isSelected = f.id === selectedFormulaId;
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelectFormula(f)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                      {f.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{f.discipline}</span>
                    <span aria-hidden="true">·</span>
                    <span>{f.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Formula Calculation Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            <div>
              <span className="text-xs font-mono text-cyan-400 block mb-1">
                {selectedFormula.discipline} · {selectedFormula.category}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">{selectedFormula.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedFormula.physicalMeaning}
              </p>
            </div>

            {/* Formula Presentation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-center">
              <span className="font-mono text-base font-semibold text-cyan-300 text-center tracking-wide">
                {selectedFormula.equation}
              </span>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-white block">Input Parameters</span>
              <div className="space-y-3.5">
                {selectedFormula.variables.map((v) => {
                  const currentVal = params[v.symbol] ?? v.defaultVal;
                  return (
                    <div key={v.symbol} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <label className="text-slate-300">
                          {v.name} <span className="font-mono text-slate-400">({v.symbol})</span>
                        </label>
                        <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                          {currentVal} {v.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={v.min}
                        max={v.max}
                        step={v.step}
                        value={currentVal}
                        onChange={(e) => handleParamChange(v.symbol, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Computed Output Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  Calculated Output
                </div>
                <span className="font-mono text-base font-bold text-cyan-300 tabular-nums">
                  {calculation.value.toLocaleString()} {calculation.unit}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {calculation.description}
              </p>
            </div>

            {/* Engineering Practical Scenario */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              <strong className="text-slate-300 block mb-0.5">Real-World Engineering Context:</strong>
              {selectedFormula.realScenario}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
