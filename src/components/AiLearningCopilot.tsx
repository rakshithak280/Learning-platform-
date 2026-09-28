import { useState, useId } from 'react';
import { Sparkles, ArrowRight, Loader2, BookOpen, MapPin, Lightbulb } from 'lucide-react';
import { ENGINEERING_BRANCHES, type EngineeringBranch } from '../data/disciplinesData';

export function AiLearningCopilot({ userBranch }: { userBranch: EngineeringBranch }) {
  const [activeTab, setActiveTab] = useState<'bridge' | 'explain' | 'roadmap' | 'problem'>('bridge');

  // Bridge States
  const [fromBranch, setFromBranch] = useState<string>(userBranch);
  const [toBranch, setToBranch] = useState<string>('Computer Science & Software');
  const [bridgeConcept, setBridgeConcept] = useState<string>('State Machines & Digital Latches');

  // Explain States
  const [explainTopic, setExplainTopic] = useState<string>('Kalman Filtering and Sensor Fusion');
  const [explainTargetDiscipline, setExplainTargetDiscipline] = useState<string>('Robotics & Autonomous Systems');

  // Roadmap States
  const [targetRole, setTargetRole] = useState<string>('Robotics Systems & Firmware Engineer');
  const [timeframeWeeks, setTimeframeWeeks] = useState<number>(12);

  // Problem States
  const [problemTopic, setProblemTopic] = useState<string>('Beam Bending & Mohr Circle');
  const [problemDifficulty, setProblemDifficulty] = useState<'Foundation' | 'Core' | 'Advanced'>('Core');

  // Loading & Result States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const conceptInputId = useId();
  const topicInputId = useId();
  const careerInputId = useId();
  const weeksSliderId = useId();
  const probTopicId = useId();

  const handleQuery = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResultData(null);

    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'bridge') {
        endpoint = '/api/gemini/bridge';
        payload = { fromBranch, toBranch, concept: bridgeConcept };
      } else if (activeTab === 'explain') {
        endpoint = '/api/gemini/explain';
        payload = { topic: explainTopic, sourceBranch: userBranch, targetDiscipline: explainTargetDiscipline };
      } else if (activeTab === 'roadmap') {
        endpoint = '/api/gemini/roadmap';
        payload = { currentBranch: userBranch, targetCareerOrSkill: targetRole, timeframeWeeks };
      } else if (activeTab === 'problem') {
        endpoint = '/api/gemini/problem';
        payload = { branch: userBranch, topic: problemTopic, difficulty: problemDifficulty };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResultData(data);
    } catch (err: unknown) {
      console.error('Copilot query error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to generate cross-discipline response. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">Cross-Discipline AI Learning Copilot</h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Gemini 3.8
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tailored cognitive bridges, first-principles explanations, and career conversion pathways adapted to your engineering background.
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {[
          { id: 'bridge', label: 'Bridge Any Concept', icon: Lightbulb },
          { id: 'explain', label: 'First-Principles Explainer', icon: BookOpen },
          { id: 'roadmap', label: 'Custom Tech Roadmap', icon: MapPin },
          { id: 'problem', label: 'Practice Challenge', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setResultData(null);
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Input Deck */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
        {activeTab === 'bridge' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">Your Native Branch (Source Mental Model)</label>
                <select
                  value={fromBranch}
                  onChange={(e) => setFromBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {ENGINEERING_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">Target Discipline (Alien Field)</label>
                <select
                  value={toBranch}
                  onChange={(e) => setToBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {ENGINEERING_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={conceptInputId} className="text-xs text-slate-300 font-medium block">Concept to Demystify</label>
              <div className="flex gap-2">
                <input
                  id={conceptInputId}
                  type="text"
                  value={bridgeConcept}
                  onChange={(e) => setBridgeConcept(e.target.value)}
                  placeholder="e.g. Convolution in Neural Networks, PID Controller, MOSFET Transistor, Pointers in C"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Convolutional Neural Nets', 'PID Control Loop', 'Fourier Transform', 'Finite State Machines', 'MOSFET Inverter'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBridgeConcept(preset)}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explain' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={topicInputId} className="text-xs text-slate-300 font-medium block">Engineering Concept / Topic</label>
                <input
                  id={topicInputId}
                  type="text"
                  value={explainTopic}
                  onChange={(e) => setExplainTopic(e.target.value)}
                  placeholder="e.g. Extended Kalman Filter, Navier-Stokes Equation, Eigenvalue Modal Analysis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">Field / Discipline Context</label>
                <input
                  type="text"
                  value={explainTargetDiscipline}
                  onChange={(e) => setExplainTargetDiscipline(e.target.value)}
                  placeholder="e.g. Autonomous Vehicles, Aerospace Structures, Semiconductor VLSI"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              This will generate a first-principles explanation specifically translated into metaphors and physical intuition from <strong className="text-cyan-400">{userBranch}</strong>.
            </p>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={careerInputId} className="text-xs text-slate-300 font-medium block">Target Engineering Career / Specialization</label>
                <input
                  id={careerInputId}
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Autonomous Systems Engineer, ASIC Verification Engineer, Battery Management Specialist"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor={weeksSliderId} className="text-slate-300 font-medium">Preparation Timeline</label>
                  <span className="font-mono text-cyan-400">{timeframeWeeks} Weeks</span>
                </div>
                <input
                  id={weeksSliderId}
                  type="range"
                  min="6"
                  max="24"
                  step="2"
                  value={timeframeWeeks}
                  onChange={(e) => setTimeframeWeeks(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Autonomous Robotics (ROS2)', 'ASIC/FPGA Design (Verilog)', 'Embedded Firmware (FreeRTOS)', 'Clean Energy & BMS Systems'].map((careerPreset) => (
                <button
                  key={careerPreset}
                  onClick={() => setTargetRole(careerPreset)}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                >
                  {careerPreset}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'problem' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={probTopicId} className="text-xs text-slate-300 font-medium block">Topic for Challenge Problem</label>
                <input
                  id={probTopicId}
                  type="text"
                  value={problemTopic}
                  onChange={(e) => setProblemTopic(e.target.value)}
                  placeholder="e.g. Bernoulli Flow, Nyquist Sampling, Thermodynamic Carnot Efficiency"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium block">Rigorous Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Foundation', 'Core', 'Advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setProblemDifficulty(diff)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                        problemDifficulty === diff
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleQuery}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Synthesizing Engineering Model...
              </>
            ) : (
              <>
                Synthesize Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Result Display Stage */}
      {resultData && (
        <div className="bg-slate-900/95 rounded-xl border border-cyan-500/30 p-6 space-y-6 shadow-xl animate-fade-in">
          {activeTab === 'bridge' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white tracking-tight">{resultData.conceptTitle}</h3>
                <span className="text-xs font-mono text-cyan-400">
                  {fromBranch} ➔ {toBranch}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">The Core Intuition</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{resultData.theCoreIntuition}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">Native Discipline Analogy</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{resultData.bridgeAnalogy}</p>
                </div>
              </div>

              {resultData.governingEquation && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Governing Mathematical Law</span>
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-sm text-cyan-300 text-center">
                    {resultData.governingEquation}
                  </div>
                </div>
              )}

              {resultData.concreteApplication && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">Multi-Disciplinary Engineering Application</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{resultData.concreteApplication}</p>
                </div>
              )}

              {resultData.commonPitfalls && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Common Conceptual Pitfalls</span>
                  <ul className="space-y-1.5">
                    {resultData.commonPitfalls.map((pitfall: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">·</span>
                        {pitfall}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultData.actionableExercise && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
                  <strong className="block mb-1">5-Minute Mental Challenge:</strong>
                  {resultData.actionableExercise}
                </div>
              )}
            </div>
          )}

          {activeTab === 'explain' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white tracking-tight">{resultData.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{resultData.executiveSummary}</p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider mb-2">First-Principles Derivation</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{resultData.firstPrinciples}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider mb-2">Branch-Specific Analogy ({userBranch})</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{resultData.crossDisciplineAnalogy}</p>
                </div>
              </div>

              {resultData.keyFormulas && resultData.keyFormulas.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Formulas & Equation Set</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resultData.keyFormulas.map((f: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-xs font-semibold text-white block mb-1">{f.name}</span>
                        <div className="font-mono text-xs text-cyan-300 bg-slate-900 p-2 rounded mb-1">{f.equation}</div>
                        <span className="text-[11px] text-slate-400">{f.variables}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultData.industryTools && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Industry Standard Toolchain</span>
                  <div className="flex flex-wrap gap-2">
                    {resultData.industryTools.map((tool: string, idx: number) => (
                      <span key={idx} className="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resultData.handsOnProject && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-200">
                  <strong className="block mb-1 text-emerald-300">Hands-On Build Blueprint:</strong>
                  {resultData.handsOnProject}
                </div>
              )}
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{resultData.targetRole}</h3>
                  <span className="text-xs text-slate-400">Starting from: {resultData.startingBranch} · {resultData.totalDuration}</span>
                </div>
              </div>

              {resultData.leveragePoints && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <strong className="text-cyan-400 block mb-1">Your Competitive Advantage as an Engineer:</strong>
                  {resultData.leveragePoints}
                </div>
              )}

              {resultData.phases && (
                <div className="space-y-4">
                  {resultData.phases.map((ph: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          Phase {ph.phaseNumber}: {ph.title}
                        </span>
                        <span className="font-mono text-xs text-cyan-400">{ph.weeks}</span>
                      </div>
                      <p className="text-xs text-slate-400">{ph.focus}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-xs">
                        <div>
                          <span className="font-semibold text-slate-300 block mb-1">Core Competencies:</span>
                          <ul className="space-y-1 text-slate-400">
                            {ph.keyCompetencies?.map((c: string, cIdx: number) => (
                              <li key={cIdx}>· {c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-300 block mb-1">Industry Tools:</span>
                          <div className="flex flex-wrap gap-1">
                            {ph.recommendedTools?.map((t: string, tIdx: number) => (
                              <span key={tIdx} className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {ph.milestoneDeliverable && (
                        <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-emerald-300 border border-slate-800">
                          <strong>Phase Milestone:</strong> {ph.milestoneDeliverable}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resultData.capstoneIdea && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
                  <strong className="block mb-1 text-cyan-300">Portfolio Capstone Project:</strong>
                  {resultData.capstoneIdea}
                </div>
              )}
            </div>
          )}

          {activeTab === 'problem' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  Diagnostic Numerical Challenge · {problemDifficulty}
                </span>
                <p className="text-sm font-semibold text-white">{resultData.problemStatement}</p>
              </div>

              {resultData.givenValues && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                  <strong className="text-slate-400 block mb-1">Given Parameters:</strong>
                  {Object.entries(resultData.givenValues).map(([k, v]) => (
                    <span key={k} className="inline-block mr-4">{k}: {String(v)}</span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-xs font-semibold text-white block">Calculate: {resultData.question}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resultData.options?.map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono ${
                        idx === resultData.correctIndex
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt} {idx === resultData.correctIndex && '✓ (Correct)'}
                    </div>
                  ))}
                </div>
              </div>

              {resultData.stepByStepSolution && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-cyan-400 block uppercase tracking-wider">Step-by-Step Derivation</span>
                  <pre className="font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{resultData.stepByStepSolution}</pre>
                </div>
              )}

              {resultData.engineeringTakeaway && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
                  <strong className="block mb-0.5">Engineering Takeaway:</strong>
                  {resultData.engineeringTakeaway}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
