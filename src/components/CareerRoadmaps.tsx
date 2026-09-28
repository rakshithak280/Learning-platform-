import { useState } from 'react';
import { CAREER_ROADMAPS, type CareerRoadmap } from '../data/roadmapsData';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export function CareerRoadmaps({ onCustomRoadmapAi }: { onCustomRoadmapAi: (role: string) => void }) {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(CAREER_ROADMAPS[0].id);

  const selectedRoadmap: CareerRoadmap =
    CAREER_ROADMAPS.find((r) => r.id === selectedRoadmapId) || CAREER_ROADMAPS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Cross-Branch Tech & Career Roadmaps</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Step-by-step transition pathways enabling any engineering student to pivot into emerging high-demand tech.
          </p>
        </div>
      </div>

      {/* Roadmap Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {CAREER_ROADMAPS.map((r) => {
          const active = r.id === selectedRoadmapId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmapId(r.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                active
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] font-mono text-cyan-400 block mb-1">
                {r.estimatedMonths} · {r.difficulty}
              </span>
              <span className={`text-xs font-bold block mb-1.5 ${active ? 'text-cyan-300' : 'text-white'}`}>
                {r.title}
              </span>
              <span className="text-[11px] text-slate-400 block truncate">Target: {r.targetRole}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Roadmap Details */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Origin: {selectedRoadmap.originBranches.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-400">{selectedRoadmap.estimatedMonths}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{selectedRoadmap.difficulty} Curve</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{selectedRoadmap.title}</h3>
            <span className="text-xs font-semibold text-slate-300 block mt-1">
              Target Professional Role: <strong className="text-cyan-300">{selectedRoadmap.targetRole}</strong>
            </span>
          </div>

          <button
            onClick={() => onCustomRoadmapAi(selectedRoadmap.targetRole)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            Customize with AI
          </button>
        </div>

        {/* Why this combo is high value */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
          <strong className="text-amber-400 block uppercase tracking-wider text-[11px]">
            The Engineering Advantage (Why This Hybrid Is Valued):
          </strong>
          <p className="leading-relaxed">{selectedRoadmap.whyThisComboIsHighValue}</p>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
            Curriculum Progression Stages
          </span>

          <div className="space-y-4">
            {selectedRoadmap.phases.map((phase) => (
              <div key={phase.phaseNumber} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {phase.phaseNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{phase.title}</h4>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 pl-8 sm:pl-0">{phase.timeframe}</span>
                </div>

                <p className="text-xs text-slate-400 pl-8">{phase.focus}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pl-8 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1.5">Core Competencies:</span>
                    <ul className="space-y-1 text-slate-400">
                      {phase.keySkills.map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300 block mb-1.5">Industry Standard Tools:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.industryTools.map((tool, tIdx) => (
                        <span key={tIdx} className="text-[11px] text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-emerald-300 border border-slate-800/80 ml-8">
                  <strong>Hands-on Project Milestone:</strong> {phase.deliverableProject}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capstone Portfolio Piece */}
        <div className="p-5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Capstone Portfolio Showcase Piece
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            {selectedRoadmap.capstonePortfolioPiece.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedRoadmap.capstonePortfolioPiece.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedRoadmap.capstonePortfolioPiece.techStack.map((tech, idx) => (
              <span key={idx} className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/50">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
