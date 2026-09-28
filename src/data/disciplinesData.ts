export interface SubjectTopic {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'Foundation' | 'Core' | 'Advanced';
  summary: string;
  coreLaws: string[];
  forOtherBranches: {
    branch: string;
    analogy: string;
  }[];
  keyFormulas: {
    name: string;
    latex: string;
    units: string;
    explanation: string;
  }[];
  realWorldApplications: string[];
  practiceChallenge: {
    question: string;
    hint: string;
    solution: string;
  };
}

export interface Discipline {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  accentColor: string;
  borderColor: string;
  iconName: string;
  description: string;
  keySubfields: string[];
  corePrerequisites: string[];
  subjects: SubjectTopic[];
}

export const ENGINEERING_BRANCHES = [
  'Computer Science & Software',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering',
  'Civil & Structural',
  'Electrical & Power (EEE)',
  'Chemical & Process',
  'Aerospace & Aeronautical',
  'Robotics & Mechatronics',
  'Biomedical Engineering',
  'Universal First-Year Foundations',
] as const;

export type EngineeringBranch = typeof ENGINEERING_BRANCHES[number];

export const DISCIPLINES: Discipline[] = [
  {
    id: 'cs-software',
    name: 'Computer Science & Software Systems',
    shortName: 'CS & Software',
    tagline: 'Computational complexity, systems architecture, distributed state, and hardware-software abstraction layers.',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    iconName: 'Cpu',
    description: 'The mathematical study and engineering implementation of computation, algorithmic state machines, memory hierarchies, and distributed information flows.',
    keySubfields: ['Algorithms & Complexity', 'Computer Architecture', 'Operating Systems', 'Distributed Systems', 'Compilers & Languages'],
    corePrerequisites: ['Discrete Mathematics', 'Boolean Algebra', 'Data Structures', 'Basic Digital Logic'],
    subjects: [
      {
        id: 'cs-memory-hierarchy',
        title: 'Memory Hierarchies & Cache Coherence',
        category: 'Computer Systems',
        readTime: '6 min read',
        difficulty: 'Core',
        summary: 'How physical distance, latency laws, and spatial-temporal locality dictate processor execution speed from L1 caches to NVMe storage.',
        coreLaws: [
          'Locality of Reference (Spatial and Temporal Locality)',
          'Amdahl’s Law for Parallel Execution Bottlenecks',
          'MESI Protocol for Multicore Cache Coherence'
        ],
        forOtherBranches: [
          {
            branch: 'Mechanical Engineering',
            analogy: 'Think of L1 cache as the wrench in your hand, RAM as the toolbox on the workbench, and SSD storage as the warehouse across town. Moving heavy tools takes exponential setup time.'
          },
          {
            branch: 'Civil & Structural',
            analogy: 'Like material logistics on a skyscraper construction site: daily rebar is kept on the active floor deck (cache), while bulk concrete and steel trusses sit at the staging yard (RAM).'
          },
          {
            branch: 'Chemical Engineering',
            analogy: 'Analogous to a catalyst bed residence time: reacting molecules in the immediate active pore (registers) react instantly, while replenishing stock from bulk tank storage (disk) takes orders of magnitude longer.'
          }
        ],
        keyFormulas: [
          {
            name: 'Average Memory Access Time (AMAT)',
            latex: 'AMAT = t_{hit} + (MR \\times t_{miss\\_penalty})',
            units: 'Nanoseconds (ns) or Clock Cycles',
            explanation: 'Quantifies the true latency experienced by the CPU as a function of cache hit rate and miss penalty.'
          },
          {
            name: 'Amdahl\'s Speedup Law',
            latex: 'S_{latency}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}',
            units: 'Dimensionless Ratio',
            explanation: 'Theoretical speedup of parallelizing a fraction p of a task across s processor cores.'
          }
        ],
        realWorldApplications: [
          'High-Frequency Trading engines optimizing memory alignment to avoid cache misses',
          'Autonomous vehicle edge computing vision models executing real-time obstacle inference',
          'GPU unified memory architectures in gaming and deep learning clusters'
        ],
        practiceChallenge: {
          question: 'A CPU has a 1-cycle L1 cache with a 95% hit rate. When an L1 miss occurs, fetching from main memory requires 100 cycles. What is the AMAT?',
          hint: 'Apply AMAT = Hit Time + (Miss Rate * Miss Penalty). Note Miss Rate = 1 - 0.95 = 0.05.',
          solution: 'AMAT = 1 + (0.05 * 100) = 1 + 5 = 6 cycles. Even a 5% miss rate increases effective memory latency by 6x!'
        }
      },
      {
        id: 'cs-distributed-consensus',
        title: 'Distributed State & Paxos / Raft Consensus',
        category: 'Distributed Computing',
        readTime: '8 min read',
        difficulty: 'Advanced',
        summary: 'Achieving deterministic agreement among autonomous nodes over an unreliable, asynchronous communication network.',
        coreLaws: [
          'CAP Theorem (Consistency, Availability, Partition Tolerance)',
          'FLP Impossibility Result for Asynchronous Distributed Systems',
          'Leader Election and Log Replication Invariants'
        ],
        forOtherBranches: [
          {
            branch: 'Electronics & Communication',
            analogy: 'Like multi-channel phase-locked loops (PLLs) maintaining frequency synchronization across noisy transmission cables where signals can drop or arrive out of sequence.'
          },
          {
            branch: 'Electrical Engineering',
            analogy: 'Comparable to decentralized power grid islands agreeing on frequency and phase angles before reconnecting to prevent catastrophic cascading blackouts.'
          }
        ],
        keyFormulas: [
          {
            name: 'Fault-Tolerance Quorum Size',
            latex: 'Q = \\left\\lfloor \\frac{N}{2} \\right\\rfloor + 1',
            units: 'Number of nodes',
            explanation: 'To survive f node failures in crash-fault models, a system of N nodes requires a majority quorum of at least 2f + 1 nodes.'
          }
        ],
        realWorldApplications: [
          'Cloud infrastructure databases (etcd, Kubernetes control plane, CockroachDB)',
          'Aircraft fly-by-wire multi-computer voting systems to survive hardware faults',
          'Global satellite constellation telemetry and ground station command coordination'
        ],
        practiceChallenge: {
          question: 'In a distributed cluster of 7 servers running Raft, what is the maximum number of servers that can simultaneously fail while the cluster continues processing writes?',
          hint: 'Raft requires a strict majority quorum: Q = floor(N/2) + 1.',
          solution: 'For N = 7, majority is floor(7/2) + 1 = 4. The system can tolerate 7 - 4 = 3 server crashes.'
        }
      }
    ]
  },
  {
    id: 'ece-electronics',
    name: 'Electronics & Communication (ECE / EE)',
    shortName: 'Electronics & Hardware',
    tagline: 'Semiconductor physics, frequency spectrum, analog-digital conversion, and electromagnetic signal propagation.',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    iconName: 'Zap',
    description: 'Mastering the physical flow of electrons, microchips, RF wireless communication, and low-latency hardware interfaces.',
    keySubfields: ['Analog & Mixed-Signal ICs', 'Digital Signal Processing (DSP)', 'RF & Antenna Engineering', 'VLSI Design', 'Embedded Firmware'],
    corePrerequisites: ['Maxwell’s Equations', 'Differential Equations', 'Complex Numbers & Phasors', 'Fourier Analysis'],
    subjects: [
      {
        id: 'ece-signal-filtering',
        title: 'Signals, Frequency Response & Fourier Transforms',
        category: 'Signal Processing',
        readTime: '7 min read',
        difficulty: 'Core',
        summary: 'Decomposing arbitrary continuous and discrete waveforms into sinusoidal harmonics to filter noise and preserve information.',
        coreLaws: [
          'Nyquist-Shannon Sampling Theorem (f_s >= 2 * f_max)',
          'Fourier Duality (Time Domain convolution = Frequency Domain multiplication)',
          'Bode Plot Gain and Phase Margins for Stability'
        ],
        forOtherBranches: [
          {
            branch: 'Mechanical Engineering',
            analogy: 'Exact equivalent to vibrational resonance analysis in automotive suspension or turbine shafts. Resonant frequencies must be dampened just like unwanted electrical noise.'
          },
          {
            branch: 'Civil & Structural',
            analogy: 'Identical to seismic harmonic analysis in earthquake engineering: tall buildings act as low-pass filters that oscillate dangerously when ground motion matches their natural frequency.'
          },
          {
            branch: 'Chemical Engineering',
            analogy: 'Similar to distillation columns separating a liquid mixture into constituent boiling fractions; Fourier transform separates a raw signal into its pure frequency constituents.'
          }
        ],
        keyFormulas: [
          {
            name: 'Continuous Fourier Transform',
            latex: 'X(\\omega) = \\int_{-\\infty}^{\\infty} x(t) e^{-j\\omega t} dt',
            units: 'V/Hz or Spectral Density',
            explanation: 'Transforms a time-domain voltage signal into complex frequency spectrum with magnitude and phase.'
          },
          {
            name: 'RC Low-Pass Cutoff Frequency',
            latex: 'f_c = \\frac{1}{2\\pi R C}',
            units: 'Hertz (Hz)',
            explanation: 'The -3dB frequency where output power drops to half of input power.'
          }
        ],
        realWorldApplications: [
          'Radar and LiDAR sensor signal filtering in aerospace defense',
          'Biomedical electrocardiogram (ECG) noise suppression filtering out 50/60Hz AC hum',
          '5G Beamforming antennas shaping radio waves for high-bandwidth mobile arrays'
        ],
        practiceChallenge: {
          question: 'An analog sensor signal contains frequencies up to 15 kHz. What is the absolute minimum sampling rate required to avoid aliasing artifacts?',
          hint: 'Recall Nyquist-Shannon: f_sampling must be strictly greater than or equal to twice the maximum signal frequency.',
          solution: 'f_s >= 2 * 15 kHz = 30 kHz. In practice, engineers use 44.1 kHz or 48 kHz to allow roll-off room for anti-aliasing analog filters.'
        }
      },
      {
        id: 'ece-mosfet-switching',
        title: 'MOSFET Semiconductor Switching & CMOS Inverters',
        category: 'VLSI & Circuit Design',
        readTime: '6 min read',
        difficulty: 'Foundation',
        summary: 'The physical mechanism of field-effect charge carrier inversion that powers every modern microprocessor on Earth.',
        coreLaws: [
          'Ohmic (Triode) vs Saturation Region Physics',
          'Gate Capacitance and Dynamic Power Dissipation (P = C * V^2 * f)',
          'CMOS Push-Pull Complementary Topology'
        ],
        forOtherBranches: [
          {
            branch: 'Mechanical & Fluid',
            analogy: 'A MOSFET is an automated diaphragm valve: voltage on the gate acts like air pressure on a pilot membrane, opening or shutting the fluid canal between source and drain.'
          },
          {
            branch: 'Computer Science',
            analogy: 'The physical transistor is the bedrock of the 0 and 1 bit: when on, it charges a tiny capacitor; when off, it drains it.'
          }
        ],
        keyFormulas: [
          {
            name: 'Dynamic Switching Power Dissipation',
            latex: 'P_{dynamic} = \\alpha \\cdot C_{load} \\cdot V_{DD}^2 \\cdot f_{clock}',
            units: 'Watts (W)',
            explanation: 'Explains why increasing clock frequency or voltage causes explosive thermal output in GPUs and CPUs.'
          }
        ],
        realWorldApplications: [
          'Modern 3nm FinFET and Gate-All-Around (GAA) microprocessors',
          'Solid-state motor controllers and inverters in electric vehicles',
          'Power Management Integrated Circuits (PMICs) in smartphones'
        ],
        practiceChallenge: {
          question: 'If a smartphone processor decreases its operating voltage from 1.2V to 0.9V while keeping capacitance and frequency constant, by what percentage is dynamic power reduced?',
          hint: 'Dynamic power is proportional to the square of voltage (V^2). Calculate (0.9^2)/(1.2^2).',
          solution: '(0.9 / 1.2)^2 = (0.75)^2 = 0.5625. Power is reduced by 100% - 56.25% = 43.75%! This is why voltage scaling is so critical for battery life.'
        }
      }
    ]
  },
  {
    id: 'mech-engineering',
    name: 'Mechanical & Automotive Engineering',
    shortName: 'Mechanical Systems',
    tagline: 'Statics, dynamics, continuum mechanics, thermodynamics, and precision kinetic machines.',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    iconName: 'Cog',
    description: 'Transforming energy and physical materials into machines, engines, robotic linkages, and aerodynamic bodies.',
    keySubfields: ['Thermodynamics & Heat Transfer', 'Fluid Dynamics & Aerodynamics', 'Machine Design & Kinematics', 'Finite Element Analysis (FEA)', 'Vibrations & Acoustics'],
    corePrerequisites: ['Vector Mechanics', 'Multivariable Calculus', 'Materials Science', 'Differential Equations'],
    subjects: [
      {
        id: 'mech-thermo-cycles',
        title: 'Thermodynamic Cycles & The Carnot Limit',
        category: 'Thermal Engineering',
        readTime: '8 min read',
        difficulty: 'Core',
        summary: 'The fundamental thermodynamic bounds on converting heat energy into mechanical work through PV and TS state trajectories.',
        coreLaws: [
          'First Law of Thermodynamics (Energy Conservation: dU = dQ - dW)',
          'Second Law of Thermodynamics (Entropy Generation: dS >= dQ/T)',
          'Carnot Theorem: No engine operating between two reservoirs is more efficient than a reversible Carnot engine'
        ],
        forOtherBranches: [
          {
            branch: 'Computer Science',
            analogy: 'Thermodynamic efficiency is like algorithmic time complexity: just as Landauer’s Principle sets the minimum energy cost of erasing a bit, Carnot sets the maximum physical work from heat.'
          },
          {
            branch: 'Electrical Engineering',
            analogy: 'Temperature difference (T_H - T_C) is identical to electrical voltage potential, heat flow Q is current, and entropy increase represents resistive I^2*R dissipation.'
          }
        ],
        keyFormulas: [
          {
            name: 'Carnot Maximum Thermal Efficiency',
            latex: '\\eta_{Carnot} = 1 - \\frac{T_{Cold}}{T_{Hot}}',
            units: 'Dimensionless (0 to 1, or %)',
            explanation: 'Absolute theoretical ceiling for heat-to-work conversion using absolute temperatures in Kelvin.'
          },
          {
            name: 'Ideal Gas State Equation',
            latex: 'P V = m R T',
            units: 'Pressure (Pa), Volume (m^3), Temp (K)',
            explanation: 'Relates state variables for gases undergoing expansion and compression.'
          }
        ],
        realWorldApplications: [
          'Gas turbines in commercial aviation generating thrust with high turbine inlet temperatures',
          'Data center liquid cooling systems and heat exchangers',
          'Geothermal and nuclear thermal power generation plants'
        ],
        practiceChallenge: {
          question: 'A geothermal power plant operates with hot steam reservoir at 227°C and cools with river water at 27°C. What is the theoretical maximum thermal efficiency?',
          hint: 'Temperatures MUST be converted to Kelvin: T(K) = T(°C) + 273.15.',
          solution: 'T_Hot = 227 + 273 = 500 K. T_Cold = 27 + 273 = 300 K. Carnot efficiency = 1 - (300 / 500) = 1 - 0.60 = 40% maximum!'
        }
      },
      {
        id: 'mech-stress-strain',
        title: 'Beam Deflection, Shear Stress & Mohr’s Circle',
        category: 'Solid Mechanics',
        readTime: '7 min read',
        difficulty: 'Core',
        summary: 'How physical members deform under bending, axial tension, and torsion, and finding the maximum principal stresses before failure.',
        coreLaws: [
          'Hooke’s Law for Linear Elasticity (sigma = E * epsilon)',
          'Euler-Bernoulli Beam Bending Theory',
          'Mohr’s Circle Transformation for Principal Stresses'
        ],
        forOtherBranches: [
          {
            branch: 'Civil & Structural',
            analogy: 'Directly applied to concrete bridge girders and steel building columns under combined dead, live, and seismic lateral loads.'
          },
          {
            branch: 'Biomedical Engineering',
            analogy: 'Exactly how orthopedic surgeons calculate load bearing on titanium hip implants and human femur bones during gait cycles.'
          }
        ],
        keyFormulas: [
          {
            name: 'Flexure Formula for Bending Stress',
            latex: '\\sigma = \\frac{M \\cdot y}{I}',
            units: 'Pascals (Pa or MPa)',
            explanation: 'Internal normal stress at distance y from the neutral axis under bending moment M.'
          },
          {
            name: 'Cantilever Beam End Deflection',
            latex: '\\delta = \\frac{F \\cdot L^3}{3 E I}',
            units: 'Meters (m)',
            explanation: 'Deflection of a cantilever beam of length L, Young\'s modulus E, and second moment of area I under tip load F.'
          }
        ],
        realWorldApplications: [
          'Aircraft wing structural rib design flexing under aerodynamic turbulence',
          'Automotive crash chassis absorbing deceleration kinetic energy safely',
          'Micro-Electro-Mechanical Systems (MEMS) cantilever accelerometers inside smartphones'
        ],
        practiceChallenge: {
          question: 'If you double the length L of a cantilever beam while keeping the load F and cross-section identical, by what factor does the tip deflection increase?',
          hint: 'Look at the exponent of L in the deflection formula: delta = (F * L^3) / (3 * E * I).',
          solution: 'Since deflection scales with L^3, doubling length results in 2^3 = 8 times greater deflection! Stiffness drops dramatically with length.'
        }
      }
    ]
  },
  {
    id: 'civil-structural',
    name: 'Civil & Structural Engineering',
    shortName: 'Civil & Infrastructure',
    tagline: 'Geotechnical soil mechanics, reinforced concrete, seismic resilience, and transportation networks.',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    iconName: 'Building',
    description: 'Engineering the physical foundations of human civilization: bridges, skyscrapers, dams, water distribution, and seismic resilience.',
    keySubfields: ['Structural Analysis', 'Geotechnical & Soil Mechanics', 'Hydraulics & Water Resources', 'Transportation Engineering', 'Construction Management'],
    corePrerequisites: ['Statics & Mechanics of Materials', 'Fluid Mechanics', 'Geology & Soil Dynamics', 'Probability & Statistics'],
    subjects: [
      {
        id: 'civil-truss-equilibrium',
        title: 'Truss Analysis & The Method of Joints',
        category: 'Structural Mechanics',
        readTime: '6 min read',
        difficulty: 'Foundation',
        summary: 'Determining the internal axial tension and compression forces across triangulated bridge and roof truss systems.',
        coreLaws: [
          'Static Equilibrium Conditions: Sum(Fx) = 0, Sum(Fy) = 0, Sum(M) = 0',
          'Two-Force Member Axiom (Truss members carry only pure axial load, zero moment)',
          'Method of Joints and Method of Sections'
        ],
        forOtherBranches: [
          {
            branch: 'Mechanical & Aerospace',
            analogy: 'Space frames in formula racing cars and rocket booster internal thrust-structure cages are analyzed using the identical method of joints.'
          },
          {
            branch: 'Computer Science',
            analogy: 'A pin-jointed truss is mathematically an undirected graph where nodes are pin joints, edges are members, and stiffness matrices are solved via sparse linear algebra.'
          }
        ],
        keyFormulas: [
          {
            name: 'Static Determinacy of a 2D Truss',
            latex: 'm = 2j - r',
            units: 'Member Count',
            explanation: 'Relates number of members m, joints j, and support reaction components r for a statically determinate truss.'
          }
        ],
        realWorldApplications: [
          'Long-span steel railway bridges over gorges and rivers',
          'Tower cranes lifting prefabricated modules on skyscraper construction sites',
          'Space station solar array deployment support booms'
        ],
        practiceChallenge: {
          question: 'A 2D truss has 11 joints and 3 support reaction components. How many members are required for the truss to be statically determinate?',
          hint: 'Use the formula m = 2j - r.',
          solution: 'm = 2(11) - 3 = 22 - 3 = 19 members.'
        }
      },
      {
        id: 'civil-soil-bearing',
        title: 'Terzaghi Soil Mechanics & Foundation Bearing Capacity',
        category: 'Geotechnical Engineering',
        readTime: '7 min read',
        difficulty: 'Core',
        summary: 'Predicting how soil shears, consolidates, and supports multi-thousand-ton foundation footings without shear collapse or excessive settlement.',
        coreLaws: [
          'Effective Stress Principle: sigma\' = sigma - u (Total stress minus pore water pressure)',
          'Mohr-Coulomb Shear Strength Criterion (tau = c + sigma * tan(phi))',
          'Terzaghi General Bearing Capacity Equation'
        ],
        forOtherBranches: [
          {
            branch: 'Chemical Engineering',
            analogy: 'Soil pore water pressure u behaves like fluid pressure in a porous packed filtration bed: excess pressure reduces mechanical particle friction.'
          },
          {
            branch: 'Mechanical Engineering',
            analogy: 'Soil internal friction angle phi is equivalent to Coulomb friction between granular surfaces, while cohesion c is like surface tension or adhesive bonding.'
          }
        ],
        keyFormulas: [
          {
            name: 'Mohr-Coulomb Soil Shear Strength',
            latex: '\\tau_f = c\' + \\sigma\' \\tan(\\phi\')',
            units: 'Kilopascals (kPa)',
            explanation: 'Maximum shear stress the soil can withstand before catastrophic sliding failure.'
          }
        ],
        realWorldApplications: [
          'Deep pile foundations for offshore wind turbines and oil platforms',
          'Subway tunneling shield machines boring through clay and sand without street subsidence',
          'Earthen dam slope stability under sudden seismic water reservoir drawdown'
        ],
        practiceChallenge: {
          question: 'If the water table rises to the ground surface, reducing effective stress sigma\' by 50% in a purely frictional sand (c = 0), what happens to the shear strength?',
          hint: 'Since tau = sigma\' * tan(phi), shear strength is directly proportional to effective stress.',
          solution: 'Shear strength drops by 50%! This is why saturated slopes fail during heavy rains or earthquakes (liquefaction).'
        }
      }
    ]
  },
  {
    id: 'chem-process',
    name: 'Chemical & Process Engineering',
    shortName: 'Chemical & Process',
    tagline: 'Mass & energy balances, reactor kinetics, distillation, and clean energy battery chemistry.',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    iconName: 'FlaskConical',
    description: 'Scaling atomic and molecular chemical reactions into gigawatt petrochemical plants, pharmaceutical synthesizers, and battery manufacturing.',
    keySubfields: ['Reaction Engineering & Catalysis', 'Mass & Heat Transfer Operations', 'Process Dynamics & Control', 'Thermodynamics of Mixtures', 'Electrochemical Engineering'],
    corePrerequisites: ['Physical Chemistry', 'Thermodynamics', 'Differential Equations', 'Transport Phenomena'],
    subjects: [
      {
        id: 'chem-reactor-design',
        title: 'Continuous Stirred-Tank (CSTR) vs Plug Flow (PFR) Reactors',
        category: 'Reaction Kinetics',
        readTime: '8 min read',
        difficulty: 'Core',
        summary: 'Comparing perfectly mixed reactors against tubular flow reactors for conversion efficiency, heat dissipation, and yield selectivity.',
        coreLaws: [
          'Arrhenius Law of Temperature Dependence on Reaction Rate',
          'Continuity Equation of Species Conservation',
          'Damköhler Number (Reaction Rate vs Flow Rate)'
        ],
        forOtherBranches: [
          {
            branch: 'Computer Science',
            analogy: 'CSTR is like a shared message queue buffer where all incoming tasks mix instantly; PFR is like a strict FIFO queue pipeline where tasks progress in ordered stages.'
          },
          {
            branch: 'Electrical Engineering',
            analogy: 'CSTR behaves as a first-order low-pass RC filter smoothing concentration fluctuations; PFR is a pure transmission delay line.'
          }
        ],
        keyFormulas: [
          {
            name: 'CSTR Design Equation',
            latex: 'V = \\frac{F_{A0} \\cdot X}{-r_A}',
            units: 'Cubic Meters (m^3)',
            explanation: 'Volume required for molar feed rate F_A0 to reach conversion fraction X with reaction rate -r_A evaluated at exit conditions.'
          }
        ],
        realWorldApplications: [
          'Industrial synthesis of ammonia via the Haber-Bosch process sustaining global agriculture',
          'Bioreactors producing therapeutic monoclonal antibodies and vaccines',
          'Continuous flow cathode slurry coating for electric vehicle lithium-ion battery cells'
        ],
        practiceChallenge: {
          question: 'For a first-order chemical reaction where rate decreases as reactant is consumed, which reactor requires less volume to achieve 90% conversion: CSTR or PFR?',
          hint: 'In CSTR, the reaction takes place entirely at the lowest exit concentration. In PFR, concentration starts high at the inlet.',
          solution: 'PFR requires significantly less volume! Because reaction rate is higher at high initial concentrations along the tube length.'
        }
      }
    ]
  },
  {
    id: 'aero-aerospace',
    name: 'Aerospace & Aeronautical Systems',
    shortName: 'Aerospace & Space',
    tagline: 'Compressible aerodynamics, rocket propulsion, orbital mechanics, and lightweight composites.',
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    iconName: 'Compass',
    description: 'Engineering systems that overcome gravity and atmospheric drag: supersonic aircraft, orbital launch vehicles, satellites, and interplanetary probes.',
    keySubfields: ['Aerodynamics & Hypersonics', 'Propulsion & Combustion', 'Orbital Mechanics & Astrodynamics', 'Flight Dynamics & Control', 'Aeroelasticity'],
    corePrerequisites: ['Vector Calculus', 'Fluid Dynamics', 'Thermodynamics', 'Rigid Body Dynamics'],
    subjects: [
      {
        id: 'aero-rocket-equation',
        title: 'The Tsiolkovsky Rocket Equation & Orbital Delta-V',
        category: 'Space Propulsion',
        readTime: '7 min read',
        difficulty: 'Core',
        summary: 'The tyranny of the rocket equation: why exponential propellant mass is required to achieve orbital velocity.',
        coreLaws: [
          'Conservation of Linear Momentum in Variable Mass Systems',
          'Specific Impulse (I_sp) as Measure of Propellant Energy Density',
          'Staging Efficiency to Shed Dead Structure Mass'
        ],
        forOtherBranches: [
          {
            branch: 'Mechanical Engineering',
            analogy: 'Like driving a transport truck whose total mass is 90% liquid gasoline, and having to accelerate the weight of that fuel alongside the payload.'
          },
          {
            branch: 'Electrical Engineering',
            analogy: 'Similar to power transmission line losses where delivering high current over long distances requires heavy copper conductors that increase line weight.'
          }
        ],
        keyFormulas: [
          {
            name: 'Tsiolkovsky Rocket Equation',
            latex: '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)',
            units: 'Meters per Second (m/s)',
            explanation: 'Calculates the velocity increment achieved by expelling propellant with exhaust velocity v_e = I_sp * g_0.'
          }
        ],
        realWorldApplications: [
          'Orbital insertion trajectories for reusable rockets (SpaceX Falcon 9, Starship)',
          'Deep space gravity-assist trajectories (Voyager, James Webb Space Telescope)',
          'Electric ion propulsion engines on satellite station-keeping arrays'
        ],
        practiceChallenge: {
          question: 'A rocket stage has a mass ratio (m_0 / m_f) of 10 and specific impulse I_sp = 300 s. What is the delta-v achieved? (Use g0 = 9.81 m/s^2, ln(10) ≈ 2.302).',
          hint: 'Multiply 300 * 9.81 * 2.302.',
          solution: 'Delta-v = 300 * 9.81 * 2.302 ≈ 6,775 m/s. Notice that reaching Low Earth Orbit (~9,400 m/s with gravity losses) requires multi-stage rockets!'
        }
      }
    ]
  },
  {
    id: 'robotics-mechatronics',
    name: 'Robotics, Mechatronics & Automation',
    shortName: 'Robotics & Control',
    tagline: 'Kinematics, inverse dynamics, state estimation, motor drives, and real-time robotic middleware.',
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    iconName: 'Bot',
    description: 'The convergence of mechanical linkages, high-frequency embedded controllers, computer vision, and autonomous decision-making.',
    keySubfields: ['Forward & Inverse Kinematics', 'State Estimation (Kalman Filtering)', 'Motion Planning & Trajectory Generation', 'Actuator Design & FOC Motor Control', 'ROS2 Middleware'],
    corePrerequisites: ['Linear Algebra & Matrices', 'Classical Control Theory', 'C++ / Python Programming', 'Rigid Body Kinematics'],
    subjects: [
      {
        id: 'robotics-inverse-kinematics',
        title: 'Denavit-Hartenberg (DH) Parameters & Inverse Kinematics',
        category: 'Manipulator Kinematics',
        readTime: '8 min read',
        difficulty: 'Core',
        summary: 'Mapping target Cartesian end-effector coordinates in 3D space back to individual joint motor angles theta_1 ... theta_n.',
        coreLaws: [
          'Homogeneous Transformation Matrices (4x4 Rotation + Translation)',
          'DH Parameter Convention (theta, d, a, alpha)',
          'Jacobian Matrix Mapping Joint Velocities to End-Effector Cartesian Velocities'
        ],
        forOtherBranches: [
          {
            branch: 'Computer Science',
            analogy: 'Inverse kinematics is finding the inverse function of a complex non-linear coordinate pipeline, solved using gradient descent optimization or Newton-Raphson methods.'
          },
          {
            branch: 'Civil & Structural',
            analogy: 'Similar to resolving member deformations in an indeterminate frame, but with active motorized joints rotating along specific geometric axes.'
          }
        ],
        keyFormulas: [
          {
            name: 'Differential Kinematics Jacobian',
            latex: '\\mathbf{v} = \\mathbf{J}(\\mathbf{q}) \\cdot \\dot{\\mathbf{q}}',
            units: 'v in m/s, q in rad/s',
            explanation: 'Relates joint angle velocity vector q_dot to end-effector linear and angular velocity vector v.'
          }
        ],
        realWorldApplications: [
          '6-axis automotive assembly robot welding car chassis with sub-millimeter precision',
          'Da Vinci robotic surgical arms executing minimally invasive laparoscopic surgery',
          'Humanoid robot whole-body balance controllers traversing uneven terrain'
        ],
        practiceChallenge: {
          question: 'What mathematical condition occurs when the determinant of the Jacobian matrix det(J) equals 0 for a robot arm?',
          hint: 'Consider what happens to the inverse of a matrix when its determinant is zero.',
          solution: 'Kinematic Singularity! The arm loses one or more degrees of freedom, and inverse kinematics demands infinite joint velocity to move in that direction.'
        }
      }
    ]
  },
  {
    id: 'bio-biomedical',
    name: 'Biomedical & Bioengineering Systems',
    shortName: 'Biomedical Systems',
    tagline: 'Biomechanics, physiological signal acquisition, biomaterials, and prosthetic neural interfaces.',
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    iconName: 'Activity',
    description: 'Applying engineering principles to the human body: medical diagnostic imaging, bionic prosthetics, tissue engineering, and biosensors.',
    keySubfields: ['Biomedical Instrumentation', 'Biomechanics & Orthopedics', 'Biomaterials & Tissue Scaffolds', 'Neural Engineering', 'Medical Imaging (MRI/CT)'],
    corePrerequisites: ['Physiology & Cell Biology', 'Circuit Analysis', 'Continuum Mechanics', 'Signal Processing'],
    subjects: [
      {
        id: 'bio-instrumentation-amp',
        title: 'Biopotential Instrumentation Amplifiers & ECG Acquisition',
        category: 'Bio-Instrumentation',
        readTime: '6 min read',
        difficulty: 'Core',
        summary: 'Extracting microvolt-level cardiac biopotentials from the human body in the presence of massive 50/60Hz electromagnetic mains interference.',
        coreLaws: [
          'High Common-Mode Rejection Ratio (CMRR > 100 dB)',
          'Extremely High Input Impedance (> 10^9 Ohms) to Prevent Loading Human Skin',
          'Right Leg Drive (RLD) Active Feedback for Noise Inversion'
        ],
        forOtherBranches: [
          {
            branch: 'Electronics & Communication',
            analogy: 'Standard differential amplifier instrumentation challenge where common-mode noise is 1000x larger than the microvolt differential signal.'
          },
          {
            branch: 'Mechanical & Civil',
            analogy: 'Like measuring a subtle 0.1 mm vibration in a bridge truss while a freight train is thundering past right next to your sensor.'
          }
        ],
        keyFormulas: [
          {
            name: 'Common-Mode Rejection Ratio',
            latex: '\\text{CMRR} = 20 \\log_{10}\\left(\\frac{A_d}{A_{cm}}\\right)',
            units: 'Decibels (dB)',
            explanation: 'Ratio of differential gain to common-mode noise gain. Higher is better.'
          }
        ],
        realWorldApplications: [
          'Clinical 12-lead ECG monitors detecting myocardial infarction in emergency rooms',
          'Non-invasive EEG Brain-Computer Interfaces (BCI) decoding motor intention for paralyzed patients',
          'Wearable smartwatches tracking real-time heart rate variability (HRV)'
        ],
        practiceChallenge: {
          question: 'If an instrumentation amplifier has a differential gain of 1,000 and a common-mode gain of 0.01, what is its CMRR in decibels?',
          hint: 'CMRR = 20 * log10(Ad / Acm). Calculate 1,000 / 0.01 first.',
          solution: 'Ad / Acm = 1000 / 0.01 = 100,000. log10(100,000) = 5. CMRR = 20 * 5 = 100 dB. High rejection of common-mode interference!'
        }
      }
    ]
  }
];
