export interface EngineeringFormula {
  id: string;
  name: string;
  discipline: string;
  category: string;
  equation: string;
  physicalMeaning: string;
  variables: {
    symbol: string;
    name: string;
    unit: string;
    defaultVal: number;
    min: number;
    max: number;
    step: number;
  }[];
  calculateResult: (params: Record<string, number>) => { value: number; unit: string; description: string };
  realScenario: string;
}

export const FORMULA_COLLECTION: EngineeringFormula[] = [
  {
    id: 'cantilever-deflection',
    name: 'Euler-Bernoulli Cantilever Beam Deflection',
    discipline: 'Mechanical & Civil Engineering',
    category: 'Mechanics of Materials',
    equation: '\\delta_{max} = \\frac{F \\cdot L^3}{3 \\cdot E \\cdot I}',
    physicalMeaning: 'Quantifies the tip displacement of a cantilever beam under a concentrated end point load. Deflection grows cubically with span length, meaning doubling length increases deflection eight-fold.',
    variables: [
      { symbol: 'F', name: 'Applied End Load', unit: 'Newtons (N)', defaultVal: 5000, min: 100, max: 50000, step: 100 },
      { symbol: 'L', name: 'Beam Length (Span)', unit: 'Meters (m)', defaultVal: 2.5, min: 0.5, max: 10, step: 0.1 },
      { symbol: 'E', name: "Young's Modulus", unit: 'Gigapascals (GPa)', defaultVal: 200, min: 50, max: 400, step: 5 },
      { symbol: 'I', name: 'Second Moment of Area (x10^-6)', unit: 'm⁴ (x10⁻⁶)', defaultVal: 15, min: 1, max: 100, step: 1 },
    ],
    calculateResult: (p) => {
      const F = p.F;
      const L = p.L;
      const E = p.E * 1e9; // convert GPa to Pa
      const I = p.I * 1e-6; // convert to m^4
      const delta = (F * Math.pow(L, 3)) / (3 * E * I);
      const deltaMm = delta * 1000;
      return {
        value: Number(deltaMm.toFixed(2)),
        unit: 'mm',
        description: `Under ${F} N load over ${L} m span, maximum tip deflection is ${deltaMm.toFixed(2)} mm.`
      };
    },
    realScenario: 'Diving board design, aircraft wingtip deflection in flight, and tower crane boom bending.'
  },
  {
    id: 'carnot-efficiency',
    name: 'Carnot Maximum Thermal Engine Efficiency',
    discipline: 'Mechanical & Chemical Engineering',
    category: 'Thermodynamics',
    equation: '\\eta_{Carnot} = 1 - \\frac{T_C}{T_H} = \\frac{T_H - T_C}{T_H}',
    physicalMeaning: 'The upper thermodynamic bound permitted by the Second Law of Thermodynamics for converting heat energy into useful mechanical work between two thermal reservoirs.',
    variables: [
      { symbol: 'TH_C', name: 'Hot Reservoir Temperature', unit: '°Celsius (°C)', defaultVal: 550, min: 100, max: 1500, step: 10 },
      { symbol: 'TC_C', name: 'Cold Sink Temperature', unit: '°Celsius (°C)', defaultVal: 35, min: 0, max: 100, step: 1 },
    ],
    calculateResult: (p) => {
      const TH = p.TH_C + 273.15;
      const TC = p.TC_C + 273.15;
      const eta = Math.max(0, 1 - (TC / TH));
      const percentage = eta * 100;
      return {
        value: Number(percentage.toFixed(1)),
        unit: '%',
        description: `Max theoretical efficiency is ${percentage.toFixed(1)}% (Hot: ${TH.toFixed(0)} K, Cold: ${TC.toFixed(0)} K).`
      };
    },
    realScenario: 'Gas turbine combined cycle power plants, automotive combustion engines, and geothermal energy extraction.'
  },
  {
    id: 'rlc-resonant-frequency',
    name: 'Series RLC Resonant Frequency & Impedance',
    discipline: 'Electrical & Electronics (ECE)',
    category: 'Circuits & AC Theory',
    equation: 'f_0 = \\frac{1}{2\\pi \\sqrt{L \\cdot C}}, \\quad Z = \\sqrt{R^2 + (X_L - X_C)^2}',
    physicalMeaning: 'At the resonant frequency f0, inductive reactance XL equals capacitive reactance XC, canceling each other out completely. Total impedance collapses to purely resistive R, maximizing current flow.',
    variables: [
      { symbol: 'R', name: 'Resistance', unit: 'Ohms (Ω)', defaultVal: 50, min: 1, max: 1000, step: 5 },
      { symbol: 'L_mH', name: 'Inductance', unit: 'Millihenries (mH)', defaultVal: 10, min: 0.1, max: 100, step: 0.5 },
      { symbol: 'C_uF', name: 'Capacitance', unit: 'Microfarads (μF)', defaultVal: 4.7, min: 0.01, max: 100, step: 0.1 },
    ],
    calculateResult: (p) => {
      const R = p.R;
      const L = p.L_mH * 1e-3;
      const C = p.C_uF * 1e-6;
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
      return {
        value: Number(f0.toFixed(1)),
        unit: 'Hz',
        description: `Resonant frequency is ${f0.toFixed(1)} Hz. At this frequency, circuit impedance is purely resistive at ${R} Ω.`
      };
    },
    realScenario: 'Radio antenna tuning stages, wireless inductive smartphone charging pads, and induction cooktops.'
  },
  {
    id: 'reynolds-number',
    name: "Reynolds Number (Laminar vs. Turbulent Flow)",
    discipline: 'Mechanical & Chemical Engineering',
    category: 'Fluid Mechanics',
    equation: 'Re = \\frac{\\rho \\cdot v \\cdot D}{\\mu} = \\frac{v \\cdot D}{\\nu}',
    physicalMeaning: 'The ratio of inertial fluid forces to viscous friction forces. Predicts whether fluid motion will be smooth and orderly (Laminar, Re < 2300 in pipes) or chaotic and eddying (Turbulent, Re > 4000).',
    variables: [
      { symbol: 'v', name: 'Flow Velocity', unit: 'm/s', defaultVal: 1.8, min: 0.1, max: 20, step: 0.1 },
      { symbol: 'D', name: 'Pipe Inner Diameter', unit: 'Meters (m)', defaultVal: 0.15, min: 0.01, max: 2, step: 0.01 },
      { symbol: 'rho', name: 'Fluid Density', unit: 'kg/m³', defaultVal: 1000, min: 1, max: 2000, step: 10 },
      { symbol: 'mu_mPa', name: 'Dynamic Viscosity', unit: 'mPa·s (cP)', defaultVal: 1.0, min: 0.01, max: 50, step: 0.1 },
    ],
    calculateResult: (p) => {
      const v = p.v;
      const D = p.D;
      const rho = p.rho;
      const mu = p.mu_mPa * 1e-3;
      const Re = (rho * v * D) / mu;
      let regime = 'Laminar (Re < 2,300)';
      if (Re >= 2300 && Re <= 4000) regime = 'Transitional (2,300 ≤ Re ≤ 4,000)';
      if (Re > 4000) regime = 'Turbulent (Re > 4,000)';
      return {
        value: Math.round(Re),
        unit: 'Dimensionless',
        description: `Re = ${Math.round(Re).toLocaleString()} → ${regime}`
      };
    },
    realScenario: 'Oil and gas pipeline pumping design, blood flow in coronary arteries, and submarine hull drag.'
  },
  {
    id: 'shannon-capacity',
    name: 'Shannon-Hartley Channel Capacity Limit',
    discipline: 'Electronics & Computer Science',
    category: 'Information Theory',
    equation: 'C = B \\cdot \\log_2\\left(1 + \\text{SNR}\\right)',
    physicalMeaning: 'The theoretical maximum rate at which error-free digital information can be transmitted over a noisy analog communication channel of given bandwidth B and signal-to-noise ratio.',
    variables: [
      { symbol: 'B_MHz', name: 'Channel Bandwidth', unit: 'Megahertz (MHz)', defaultVal: 20, min: 1, max: 160, step: 1 },
      { symbol: 'SNR_dB', name: 'Signal-to-Noise Ratio', unit: 'Decibels (dB)', defaultVal: 25, min: 0, max: 60, step: 1 },
    ],
    calculateResult: (p) => {
      const B = p.B_MHz * 1e6;
      const snrLinear = Math.pow(10, p.SNR_dB / 10);
      const capacityBps = B * Math.log2(1 + snrLinear);
      const capacityMbps = capacityBps / 1e6;
      return {
        value: Number(capacityMbps.toFixed(2)),
        unit: 'Mbps',
        description: `Max theoretical information rate: ${capacityMbps.toFixed(2)} Mbps across ${p.B_MHz} MHz at ${p.SNR_dB} dB SNR.`
      };
    },
    realScenario: '5G NR carrier aggregation, Starlink satellite downlink throughput, and deep-space NASA telemetry.'
  }
];
