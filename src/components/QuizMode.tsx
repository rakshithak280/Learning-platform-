import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  discipline: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  branchTakeaway: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    discipline: 'Electronics & Hardware',
    question: 'An analog sensor output signal has frequency components up to 12 kHz. According to the Nyquist-Shannon theorem, what is the minimum sampling rate required to reconstruct the signal without aliasing?',
    options: ['12 kHz', '24 kHz', '48 kHz', '6 kHz'],
    correctIndex: 1,
    explanation: 'The Nyquist-Shannon sampling theorem states that fs >= 2 * fmax. Therefore, 2 * 12 kHz = 24 kHz.',
    branchTakeaway: 'Mechanical engineers analyzing high-frequency accelerometer vibrations must also set data logger sample rates at least 2x higher than the highest natural frequency.'
  },
  {
    id: 2,
    discipline: 'Mechanical & Civil Engineering',
    question: 'If you double the length (L) of a cantilever beam while keeping the applied end force (F) and beam cross-section identical, by what factor does the tip deflection increase?',
    options: ['2 times (linear)', '4 times (quadratic)', '8 times (cubic)', '16 times (quartic)'],
    correctIndex: 2,
    explanation: 'The Euler-Bernoulli deflection formula is delta = (F * L^3) / (3 * E * I). Deflection scales with L^3. Doubling L results in 2^3 = 8 times greater deflection.',
    branchTakeaway: 'Doubling span length causes extreme loss of stiffness in structures, robot arms, and crane booms.'
  },
  {
    id: 3,
    discipline: 'Thermodynamics',
    question: 'A heat engine receives heat from a furnace at 600°C and rejects waste heat to the atmosphere at 27°C. What is the theoretical maximum thermal efficiency permitted by the laws of physics?',
    options: ['95.5%', '65.6%', '50.0%', '45.0%'],
    correctIndex: 1,
    explanation: 'Carnot efficiency = 1 - (TC / TH). Converting to Kelvin: TH = 600 + 273.15 = 873.15 K, TC = 27 + 273.15 = 300.15 K. Carnot = 1 - (300.15 / 873.15) = 1 - 0.3437 ≈ 65.6%.',
    branchTakeaway: 'Always convert temperatures to absolute Kelvin in thermodynamic equations!'
  },
  {
    id: 4,
    discipline: 'Computer Science & Systems',
    question: 'A CPU has a 1-cycle L1 cache with a 90% hit rate and a 50-cycle main memory access latency on cache misses. What is the Average Memory Access Time (AMAT)?',
    options: ['5.0 cycles', '6.0 cycles', '10.0 cycles', '51.0 cycles'],
    correctIndex: 1,
    explanation: 'AMAT = Hit Time + (Miss Rate * Miss Penalty). Here Hit Time = 1, Miss Rate = 1 - 0.90 = 0.10, Penalty = 50. AMAT = 1 + (0.10 * 50) = 1 + 5 = 6.0 cycles.',
    branchTakeaway: 'Cache misses are memory latency bottlenecks in both CPU software and FPGA stream processing.'
  },
  {
    id: 5,
    discipline: 'Control Systems & Robotics',
    question: 'In a PID controller, what is the primary role of the Derivative (D) term?',
    options: [
      'Eliminates steady-state error completely',
      'Provides high baseline gain for sluggish systems',
      'Anticipates future error based on rate of change and damps oscillations',
      'Acts as a low-pass filter to eliminate sensor noise'
    ],
    correctIndex: 2,
    explanation: 'The derivative term K_d * (de/dt) responds to the slope/velocity of error, acting as a predictive brake that dampens overshoot and oscillation.',
    branchTakeaway: 'However, derivative action amplifies high-frequency noise, which is why derivative filters are required in real hardware.'
  }
];

export function QuizMode() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<(number | null)[]>([]);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return; // already answered this question
    setSelectedAnswer(index);
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setAnswersHistory(prev => [...prev, selectedAnswer]);
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setAnswersHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Cross-Discipline Diagnostic Assessment</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Test and calibrate your engineering fundamentals across circuits, mechanics, thermodynamics, algorithms, and control theory.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400 font-bold tabular-nums">Score: {score}</span>
        </div>
      </div>

      {!completed ? (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 space-y-6">
          {/* Question Category & Text */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              {currentQ.discipline}
            </span>
            <h3 className="text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const hasAnswered = selectedAnswer !== null;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex-1">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation */}
          {selectedAnswer !== null && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 animate-fade-in text-xs">
              <div>
                <strong className="text-cyan-400 block mb-1">Conceptual Breakdown:</strong>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
              <div className="pt-2 border-t border-slate-850">
                <strong className="text-amber-400 block mb-1">Cross-Branch Takeaway:</strong>
                <p className="text-slate-400 leading-relaxed">{currentQ.branchTakeaway}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors"
                >
                  {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'Complete Assessment'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Score Screen */
        <div className="bg-slate-900/90 rounded-xl border border-cyan-500/30 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">Assessment Completed</h3>
            <p className="text-xs text-slate-400">
              Cross-disciplinary diagnostic report across 5 major engineering competencies.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 max-w-sm mx-auto">
            <span className="text-xs text-slate-400 block mb-1">Final Score</span>
            <span className="font-mono text-3xl font-bold text-cyan-400 tabular-nums">
              {score} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              ({((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}% Mastery)
            </span>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {score >= 4
              ? 'Outstanding cross-disciplinary intuition! You demonstrate solid foundational fluency across physical and computational domains.'
              : 'Good effort! Review the Bridge Engine and Formula Bank to strengthen your analogies across unfamiliar branches.'}
          </p>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Diagnostic
          </button>
        </div>
      )}
    </div>
  );
}
