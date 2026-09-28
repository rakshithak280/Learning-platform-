import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function DigitalLogicLab() {
  // 4-bit registers A and B (represented as booleans [MSB ... LSB])
  const [regA, setRegA] = useState<[boolean, boolean, boolean, boolean]>([false, true, false, true]); // 0101 = 5
  const [regB, setRegB] = useState<[boolean, boolean, boolean, boolean]>([false, false, true, true]); // 0011 = 3
  const [opCode, setOpCode] = useState<'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR'>('ADD');

  const toggleBitA = (index: number) => {
    const updated = [...regA] as [boolean, boolean, boolean, boolean];
    updated[index] = !updated[index];
    setRegA(updated);
  };

  const toggleBitB = (index: number) => {
    const updated = [...regB] as [boolean, boolean, boolean, boolean];
    updated[index] = !updated[index];
    setRegB(updated);
  };

  // Convert 4-bit array to unsigned integer
  const bitsToInt = (bits: [boolean, boolean, boolean, boolean]): number => {
    return (bits[0] ? 8 : 0) + (bits[1] ? 4 : 0) + (bits[2] ? 2 : 0) + (bits[3] ? 1 : 0);
  };

  const valA = bitsToInt(regA);
  const valB = bitsToInt(regB);

  // Compute ALU Result
  let resultInt = 0;
  let carryOut = false;
  let overflow = false;

  switch (opCode) {
    case 'ADD': {
      const sum = valA + valB;
      resultInt = sum & 0x0f;
      carryOut = sum > 15;
      // 4-bit 2's complement overflow detection
      const signA = regA[0];
      const signB = regB[0];
      const signR = Boolean(resultInt & 8);
      overflow = signA === signB && signA !== signR;
      break;
    }
    case 'SUB': {
      const diff = valA - valB;
      resultInt = (diff + 16) & 0x0f;
      carryOut = valA >= valB; // Borrow condition
      break;
    }
    case 'AND':
      resultInt = valA & valB;
      break;
    case 'OR':
      resultInt = valA | valB;
      break;
    case 'XOR':
      resultInt = valA ^ valB;
      break;
    case 'NOT':
      resultInt = (~valA) & 0x0f;
      break;
    case 'SHL':
      resultInt = (valA << 1) & 0x0f;
      carryOut = Boolean(valA & 8);
      break;
    case 'SHR':
      resultInt = (valA >> 1) & 0x0f;
      carryOut = Boolean(valA & 1);
      break;
  }

  // Convert resultInt back to 4 bits
  const resultBits: [boolean, boolean, boolean, boolean] = [
    Boolean(resultInt & 8),
    Boolean(resultInt & 4),
    Boolean(resultInt & 2),
    Boolean(resultInt & 1),
  ];

  const zeroFlag = resultInt === 0;
  const signFlag = resultBits[0]; // MSB is sign in 2's complement

  const handleReset = () => {
    setRegA([false, true, false, true]);
    setRegB([false, false, true, true]);
    setOpCode('ADD');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Digital Logic & 4-bit ALU Processor Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Interactive Arithmetic Logic Unit: Bitwise register toggles, binary full adders, and status register flags.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Registers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive ALU Schematic Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            {/* Input Registers A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Register A */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wider">REGISTER A (4-bit)</span>
                  <span className="font-mono text-xs text-cyan-400 font-semibold tabular-nums">
                    DEC: {valA} · HEX: 0x{valA.toString(16).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {regA.map((bit, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleBitA(idx)}
                      className={`flex-1 py-3 flex flex-col items-center justify-center rounded-lg border transition-all ${
                        bit
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono text-base font-bold">{bit ? '1' : '0'}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">A{3 - idx}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register B */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wider">REGISTER B (4-bit)</span>
                  <span className="font-mono text-xs text-amber-400 font-semibold tabular-nums">
                    DEC: {valB} · HEX: 0x{valB.toString(16).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {regB.map((bit, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleBitB(idx)}
                      className={`flex-1 py-3 flex flex-col items-center justify-center rounded-lg border transition-all ${
                        bit
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono text-base font-bold">{bit ? '1' : '0'}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">B{3 - idx}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Central ALU Core Graphic */}
            <div className="relative bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
                <span className="font-mono">OPCODE: <strong className="text-white font-bold">{opCode}</strong></span>
                <span className="font-mono text-slate-400">74LS181 ARCHITECTURE EMULATOR</span>
              </div>

              {/* Visual ALU Trapezoid Representation */}
              <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl p-4 text-center shadow-lg">
                <div className="flex justify-around items-center text-xs font-mono text-slate-400 mb-2">
                  <span>A: {regA.map(b => b ? '1' : '0').join('')}</span>
                  <span className="text-cyan-400 font-bold px-3 py-1 bg-cyan-950/80 rounded border border-cyan-500/30">
                    ALU CORE [{opCode}]
                  </span>
                  <span>B: {regB.map(b => b ? '1' : '0').join('')}</span>
                </div>
                <div className="py-2 text-xs text-slate-300">
                  {opCode === 'ADD' && `Full Ripple Adder: A + B = ${valA} + ${valB} = ${valA + valB}`}
                  {opCode === 'SUB' && `2's Complement Adder: A - B = ${valA} - ${valB} = ${valA - valB}`}
                  {opCode === 'AND' && `Bitwise Conjunction: A AND B`}
                  {opCode === 'OR' && `Bitwise Disjunction: A OR B`}
                  {opCode === 'XOR' && `Bitwise Exclusive OR: A XOR B`}
                  {opCode === 'NOT' && `Bitwise Inversion: NOT A`}
                  {opCode === 'SHL' && `Arithmetic Left Shift: A << 1`}
                  {opCode === 'SHR' && `Logical Right Shift: A >> 1`}
                </div>
              </div>

              {/* Output Bus */}
              <div className="w-full max-w-md mt-4 p-4 bg-slate-900 rounded-xl border border-emerald-500/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white tracking-wider">ALU OUTPUT Y (4-bit)</span>
                  <span className="font-mono text-xs text-emerald-400 font-semibold tabular-nums">
                    DEC: {resultInt} · HEX: 0x{resultInt.toString(16).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {resultBits.map((bit, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 py-2.5 flex flex-col items-center justify-center rounded-lg border ${
                        bit
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="font-mono text-base font-bold">{bit ? '1' : '0'}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Y{3 - idx}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Processor Status Register (Flags) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-2.5">PROCESSOR STATUS REGISTER (FLAGS)</span>
              <div className="grid grid-cols-4 gap-2">
                <div className={`p-2.5 rounded-lg border text-center ${
                  zeroFlag ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-mono text-xs font-bold block">ZF (Zero)</span>
                  <span className="font-mono text-sm mt-0.5 block">{zeroFlag ? '1' : '0'}</span>
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${
                  carryOut ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-mono text-xs font-bold block">CF (Carry)</span>
                  <span className="font-mono text-sm mt-0.5 block">{carryOut ? '1' : '0'}</span>
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${
                  signFlag ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-mono text-xs font-bold block">SF (Sign)</span>
                  <span className="font-mono text-sm mt-0.5 block">{signFlag ? '1' : '0'}</span>
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${
                  overflow ? 'bg-rose-500/20 border-rose-400 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-mono text-xs font-bold block">OF (Overflow)</span>
                  <span className="font-mono text-sm mt-0.5 block">{overflow ? '1' : '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: OpCode Controls & Cross-Branch Bridge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white">Select ALU Operation</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { op: 'ADD', label: 'ADD (A + B)' },
                { op: 'SUB', label: 'SUB (A - B)' },
                { op: 'AND', label: 'AND (Bitwise)' },
                { op: 'OR', label: 'OR (Bitwise)' },
                { op: 'XOR', label: 'XOR (Parity)' },
                { op: 'NOT', label: 'NOT (~A)' },
                { op: 'SHL', label: 'SHL (Shift L)' },
                { op: 'SHR', label: 'SHR (Shift R)' },
              ].map(({ op, label }) => (
                <button
                  key={op}
                  onClick={() => setOpCode(op as typeof opCode)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors ${
                    opCode === op
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Cross-Discipline Intuition Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-white block">Cross-Discipline Silicon Translation</span>
              <p className="leading-relaxed">
                <strong className="text-cyan-400">For Mechanical & Chemical Engineers:</strong> A digital transistor is not magic code; it is a solid-state hydraulic valve. In CMOS, PMOS and NMOS transistors act as push-pull valves pressurizing (1 = 3.3V) or draining (0 = 0V) micro-capacitors.
              </p>
              <p className="leading-relaxed pt-1 border-t border-slate-800/80">
                <strong className="text-amber-400">How 1-bit Addition Works:</strong> A single Full Adder uses just 2 XOR gates, 2 AND gates, and 1 OR gate:
                <br />
                <code className="text-[11px] font-mono text-slate-400 block mt-1">
                  Sum = A ⊕ B ⊕ Cin
                  <br />
                  Cout = (A · B) + (Cin · (A ⊕ B))
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
