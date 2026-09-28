import { useState } from 'react';
import { Search, Bookmark, BookmarkCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { DISCIPLINES, type Discipline, type SubjectTopic } from '../data/disciplinesData';

export function DisciplineCatalog({
  userBranch,
  bookmarkedIds,
  onToggleBookmark,
}: {
  userBranch: string;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}) {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(DISCIPLINES[0].id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(DISCIPLINES[0].subjects[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const selectedDiscipline = DISCIPLINES.find((d) => d.id === selectedDisciplineId) || DISCIPLINES[0];
  const selectedSubject =
    selectedDiscipline.subjects.find((s) => s.id === selectedSubjectId) || selectedDiscipline.subjects[0];

  const isBookmarked = bookmarkedIds.includes(selectedSubject.id);

  // Filter disciplines or subjects by search query
  const filteredDisciplines = DISCIPLINES.map((d) => ({
    ...d,
    subjects: d.subjects.filter(
      (s) =>
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((d) => d.subjects.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Universal Discipline Catalog</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Core subjects across all 8 engineering disciplines, translated for every branch mental model.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, topics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Discipline Navigation Bar (Horizontal Scrollable Segmented Buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {filteredDisciplines.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDisciplineId(d.id);
              if (d.subjects.length > 0) {
                setSelectedSubjectId(d.subjects[0].id);
              }
              setShowSolution(false);
            }}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedDisciplineId === d.id
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {d.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Subjects within this discipline (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{selectedDiscipline.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{selectedDiscipline.description}</p>
          </div>

          <div className="space-y-2">
            {selectedDiscipline.subjects.map((sub: SubjectTopic) => {
              const active = sub.id === selectedSubjectId;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setShowSolution(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-xs font-bold ${active ? 'text-cyan-300' : 'text-white'}`}>
                      {sub.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {sub.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{sub.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{sub.readTime}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Subject Deep-Dive (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 space-y-6">
            {/* Subject Title & Actions */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{selectedDiscipline.shortName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSubject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-cyan-400">{selectedSubject.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedSubject.title}</h3>
              </div>
              <button
                onClick={() => onToggleBookmark(selectedSubject.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
                  isBookmarked
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                {isBookmarked ? 'Bookmarked' : 'Save'}
              </button>
            </div>

            {/* Summary */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedSubject.summary}
            </p>

            {/* Core Physical & Mathematical Laws */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Core Governing Invariants
              </span>
              <div className="space-y-2">
                {selectedSubject.coreLaws.map((law, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{law}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Branch Analogies ("How to think about this in YOUR branch") */}
            <div className="bg-slate-950 rounded-xl border border-cyan-500/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Cross-Discipline Mental Model
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Targeted for {userBranch}
                </span>
              </div>
              <div className="space-y-3">
                {selectedSubject.forOtherBranches.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
                    <strong className="text-amber-400 block mb-1">From {item.branch} perspective:</strong>
                    <p className="text-slate-300 leading-relaxed">{item.analogy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Formulas */}
            {selectedSubject.keyFormulas.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Essential Mathematical Equations
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSubject.keyFormulas.map((f, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-white block">{f.name}</span>
                      <div className="p-2.5 bg-slate-900 rounded font-mono text-sm text-cyan-300 text-center">
                        {f.latex}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Units:</strong> {f.units}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World Applications */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Industrial Applications & Systems
              </span>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                {selectedSubject.realWorldApplications.map((app, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0" />
                    {app}
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Challenge & Solution Reveal */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Diagnostic Practice Challenge
                  </span>
                </div>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedSubject.practiceChallenge.question}
              </p>

              <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-slate-400">
                <strong className="text-slate-300">Hint:</strong> {selectedSubject.practiceChallenge.hint}
              </div>

              {showSolution && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-xs text-emerald-200 animate-fade-in">
                  <strong className="block mb-1 font-semibold text-emerald-300">Detailed Solution:</strong>
                  {selectedSubject.practiceChallenge.solution}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
