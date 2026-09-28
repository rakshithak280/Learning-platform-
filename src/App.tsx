import { useState } from 'react';
import {
  Layers,
  FlaskConical,
  MapPin,
  Calculator,
  Sparkles,
  Bookmark,
  GraduationCap,
  ArrowRight,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { ENGINEERING_BRANCHES, type EngineeringBranch } from './data/disciplinesData';
import { ASSET_IMAGES } from './assets/images';
import { DisciplineCatalog } from './components/DisciplineCatalog';
import { BridgeEngine } from './components/BridgeEngine';
import { CareerRoadmaps } from './components/CareerRoadmaps';
import { FormulaBank } from './components/FormulaBank';
import { AiLearningCopilot } from './components/AiLearningCopilot';
import { QuizMode } from './components/QuizMode';
import { StructuralLab } from './components/labs/StructuralLab';
import { SignalLab } from './components/labs/SignalLab';
import { DigitalLogicLab } from './components/labs/DigitalLogicLab';
import { ThermodynamicsLab } from './components/labs/ThermodynamicsLab';

type NavSection = 'disciplines' | 'bridges' | 'labs' | 'roadmaps' | 'formulas' | 'ai-copilot' | 'quiz';
type LabType = 'structural' | 'signals' | 'logic' | 'thermo';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('disciplines');
  const [userBranch, setUserBranch] = useState<EngineeringBranch>('Mechanical Engineering');
  const [activeLab, setActiveLab] = useState<LabType>('structural');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['cs-memory-hierarchy', 'mech-stress-strain']);
  const [showBranchMenu, setShowBranchMenu] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleExploreInAi = (_concept: string) => {
    setActiveSection('ai-copilot');
  };

  const handleCustomRoadmapAi = (_role: string) => {
    setActiveSection('ai-copilot');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 
        Mandatory Top Bar Contract (Section 2 of constitution):
        [Brand title, one line] — [4–6 nav links, 1–2 word labels, single-line] — [1–2 primary actions]
      */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('disciplines');
            }}
            className="text-lg font-extrabold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 font-display"
          >
            OmniEngineer
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setActiveSection('disciplines')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'disciplines' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Disciplines
            </button>
            <button
              onClick={() => setActiveSection('bridges')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'bridges' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Bridges
            </button>
            <button
              onClick={() => setActiveSection('labs')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'labs' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Virtual Labs
            </button>
            <button
              onClick={() => setActiveSection('roadmaps')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'roadmaps' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Roadmaps
            </button>
            <button
              onClick={() => setActiveSection('formulas')}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                activeSection === 'formulas' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Formulas
            </button>
            <button
              onClick={() => setActiveSection('ai-copilot')}
              className={`hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === 'ai-copilot' ? 'text-cyan-400 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AI Copilot
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions (Active Branch Selector + Diagnostics) */}
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-slate-400">My Branch:</span>
                <span className="font-semibold text-white max-w-[130px] truncate">{userBranch}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Branch Selector Dropdown */}
              {showBranchMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                    Select Your Background Branch
                  </div>
                  {ENGINEERING_BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        setUserBranch(branch);
                        setShowBranchMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        userBranch === branch
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{branch}</span>
                      {userBranch === branch && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveSection('quiz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                activeSection === 'quiz'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Diagnostic
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'disciplines', label: 'Disciplines' },
          { id: 'bridges', label: 'Bridges' },
          { id: 'labs', label: 'Labs' },
          { id: 'roadmaps', label: 'Roadmaps' },
          { id: 'formulas', label: 'Formulas' },
          { id: 'ai-copilot', label: 'AI Copilot' },
          { id: 'quiz', label: 'Diagnostic' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as NavSection)}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeSection === item.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-12">
        {/* Editorial Hero Frame */}
        <section className="relative rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-cyan-400">ACADEMIC YEAR 2026</span>
                <span aria-hidden="true">·</span>
                <span>All 8 Core Engineering Disciplines</span>
                <span aria-hidden="true">·</span>
                <span>Branch-Agnostic Mastery</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance font-display">
                Master Any Subject, Skill, or Technology — Across Every Engineering Branch.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Engineering boundaries are artificial. Learn computer architecture through fluid dynamics, master robotics through structural mechanics, and pivot effortlessly into emerging technologies with cognitive bridges tailored to your branch.
              </p>

              {/* Fast-Track Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveSection('labs')}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shadow-lg hover:shadow-cyan-500/20"
                >
                  <FlaskConical className="w-4 h-4 text-slate-950" />
                  Launch Interactive Labs
                </button>
                <button
                  onClick={() => setActiveSection('bridges')}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Explore Cross-Branch Bridges
                </button>
              </div>

              {/* Claim-to-Proof Adjacency (Constitution Section 1.H) */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div>
                  <span className="font-mono text-base font-bold text-white block tabular-nums">8 Branches</span>
                  Mechanical to Silicon
                </div>
                <div>
                  <span className="font-mono text-base font-bold text-cyan-400 block tabular-nums">4 Virtual Labs</span>
                  Real-time Simulation
                </div>
                <div>
                  <span className="font-mono text-base font-bold text-emerald-400 block tabular-nums">Zero-Barrier</span>
                  Tailored Analogies
                </div>
              </div>
            </div>

            {/* Hero Visual Blueprint Asset */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src={ASSET_IMAGES.heroEngineeringHub}
                  alt="Modern interdisciplinary engineering laboratory"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4">
                  <span className="text-xs font-medium text-slate-200">
                    Cross-Disciplinary Laboratory · Mechanics, Silicon & Algorithms Converged
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section View Routing */}
        {activeSection === 'disciplines' && (
          <section className="space-y-6">
            <DisciplineCatalog
              userBranch={userBranch}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          </section>
        )}

        {activeSection === 'bridges' && (
          <section className="space-y-6">
            <BridgeEngine onExploreInAi={handleExploreInAi} />
          </section>
        )}

        {activeSection === 'labs' && (
          <section className="space-y-6">
            {/* Lab Switcher Bar */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
              {[
                { id: 'structural', label: '1. Truss Bridge & Solid Mechanics', desc: 'Civil / Mech' },
                { id: 'signals', label: '2. Dynamic Signals & Harmonic FFT', desc: 'ECE / EE' },
                { id: 'logic', label: '3. Digital Logic & 4-bit ALU', desc: 'CS / ECE' },
                { id: 'thermo', label: '4. Heat Engine & PV Cycle', desc: 'Mech / Chem / Aero' },
              ].map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id as LabType)}
                  className={`flex-1 min-w-[200px] text-left px-4 py-2.5 rounded-lg border transition-all ${
                    activeLab === lab.id
                      ? 'bg-slate-800 border-slate-700 text-cyan-300 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-xs font-bold block">{lab.label}</span>
                  <span className="text-[11px] text-slate-400">{lab.desc}</span>
                </button>
              ))}
            </div>

            {/* Active Lab Component */}
            {activeLab === 'structural' && <StructuralLab />}
            {activeLab === 'signals' && <SignalLab />}
            {activeLab === 'logic' && <DigitalLogicLab />}
            {activeLab === 'thermo' && <ThermodynamicsLab />}
          </section>
        )}

        {activeSection === 'roadmaps' && (
          <section className="space-y-6">
            <CareerRoadmaps onCustomRoadmapAi={handleCustomRoadmapAi} />
          </section>
        )}

        {activeSection === 'formulas' && (
          <section className="space-y-6">
            <FormulaBank />
          </section>
        )}

        {activeSection === 'ai-copilot' && (
          <section className="space-y-6">
            <AiLearningCopilot userBranch={userBranch} />
          </section>
        )}

        {activeSection === 'quiz' && (
          <section className="space-y-6">
            <QuizMode />
          </section>
        )}
      </main>

      {/* Editorial Footer (Strictly quiet, no ornamental engines or fake telemetry) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-extrabold text-white tracking-tight font-display text-sm">
              OmniEngineer
            </span>
            <p className="text-slate-400">
              Universal Cross-Disciplinary Engineering Academy for Students & Researchers.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <button onClick={() => setActiveSection('disciplines')} className="hover:text-slate-200">
              Disciplines
            </button>
            <button onClick={() => setActiveSection('bridges')} className="hover:text-slate-200">
              Bridge Engine
            </button>
            <button onClick={() => setActiveSection('labs')} className="hover:text-slate-200">
              Virtual Labs
            </button>
            <button onClick={() => setActiveSection('roadmaps')} className="hover:text-slate-200">
              Roadmaps
            </button>
            <button onClick={() => setActiveSection('formulas')} className="hover:text-slate-200">
              Formula Bank
            </button>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            © 2026 OmniEngineer Academy · Universal Curriculum
          </div>
        </div>
      </footer>
    </div>
  );
}
