export interface CrossBridge {
  id: string;
  universalPrinciple: string;
  tagline: string;
  mentalModelDescription: string;
  branches: {
    branchName: string;
    domainTerm: string;
    potentialVariable: string;
    flowVariable: string;
    oppositionResistance: string;
    storageElement1: string; // e.g. Inductance / Kinetic Mass
    storageElement2: string; // e.g. Capacitance / Elastic Compliance
    governingFormula: string;
    concreteExample: string;
  }[];
  multiDisciplinaryCapstone: {
    systemName: string;
    description: string;
    howDisciplinesConverge: string;
  };
}

export const CROSS_BRIDGES: CrossBridge[] = [
  {
    id: 'potential-vs-flow',
    universalPrinciple: 'The Universal Gradient & Flow Law (Transport Phenomena)',
    tagline: 'Flow Rate = Potential Difference ÷ Resistance (The fundamental transport isomorphism)',
    mentalModelDescription: 'Across all physical and computational engineering fields, nothing moves unless there is a potential gradient (voltage, pressure, temperature, chemical potential, queue backlog). The resulting flux rate is universally constrained by the medium’s physical or structural resistance.',
    branches: [
      {
        branchName: 'Electrical / Electronics (EE/ECE)',
        domainTerm: "Ohm's Law & Drift Current",
        potentialVariable: 'Voltage Potential Difference (V, Volts)',
        flowVariable: 'Electric Current (I, Amperes = Coulombs/s)',
        oppositionResistance: 'Electrical Resistance (R, Ohms = V/I)',
        storageElement1: 'Inductor (L, Henries): Stores magnetic kinetic energy',
        storageElement2: 'Capacitor (C, Farads): Stores electrostatic potential',
        governingFormula: 'I = \\frac{\\Delta V}{R}',
        concreteExample: 'Electrons drifting through a copper PCB trace constrained by wire cross-section and resistivity.'
      },
      {
        branchName: 'Mechanical Engineering (Fluids)',
        domainTerm: "Poiseuille's Fluid Flow & Darcy-Weisbach",
        potentialVariable: 'Pressure Differential (ΔP, Pascals = N/m²)',
        flowVariable: 'Volumetric Flow Rate (Q, m³/s)',
        oppositionResistance: 'Hydraulic Pipe Friction Resistance (R_h = 8μL / πr⁴)',
        storageElement1: 'Fluid Inertance (I_f): Inertia of moving fluid column',
        storageElement2: 'Fluid Compliance (C_f): Expansion elasticity of pipe walls',
        governingFormula: 'Q = \\frac{\\Delta P}{R_h}',
        concreteExample: 'Hydraulic fluid driven through brake lines in a car when the brake pedal creates pressure.'
      },
      {
        branchName: 'Thermal & Chemical Engineering',
        domainTerm: "Fourier's Law of Heat Conduction",
        potentialVariable: 'Temperature Difference (ΔT, Kelvin)',
        flowVariable: 'Heat Transfer Rate (q, Watts = Joules/s)',
        oppositionResistance: 'Thermal Resistance (R_th = L / (k · A), K/W)',
        storageElement1: 'Thermal Mass / Enthalpy storage in fluid stream',
        storageElement2: 'Thermal Capacitance (C_th = m · c_p, J/K)',
        governingFormula: 'q = \\frac{\\Delta T}{R_{th}}',
        concreteExample: 'CPU heat pipe conducting thermal energy from silicon die to aluminum heatsink fins.'
      },
      {
        branchName: 'Civil & Environmental Engineering',
        domainTerm: "Darcy's Law of Groundwater Seepage",
        potentialVariable: 'Hydraulic Head Difference (Δh, Meters)',
        flowVariable: 'Seepage Discharge Rate (Q, m³/s)',
        oppositionResistance: 'Soil Matrix Permeability / Friction (1/K)',
        storageElement1: 'Hydrodynamic Momentum in aquifer channels',
        storageElement2: 'Specific Aquifer Storage Coefficient (S_s)',
        governingFormula: 'Q = -K \\cdot A \\cdot \\frac{\\Delta h}{L}',
        concreteExample: 'Water seeping through an earthen dam foundation embankment.'
      },
      {
        branchName: 'Computer Science & Networks',
        domainTerm: "Little's Law & Queue Throughput",
        potentialVariable: 'Task Backlog / Queue Pressure (ΔN, Tasks)',
        flowVariable: 'Throughput Processing Rate (λ, requests/s)',
        oppositionResistance: 'Service Latency / Computational Bottleneck (W, seconds)',
        storageElement1: 'Memory Cache Buffers (holds in-flight processing state)',
        storageElement2: 'Persistent Storage Disk Queues',
        governingFormula: '\\lambda = \\frac{N}{W}',
        concreteExample: 'Web API server routing inbound HTTP requests through an overloaded database pool.'
      }
    ],
    multiDisciplinaryCapstone: {
      systemName: 'Electric Vehicle Liquid Cooling & Fast-Charging System',
      description: 'During 350 kW DC fast charging, battery cells generate massive heat (Thermal), require high coolant pumping (Fluid), draw 500A currents (Electrical), and require real-time algorithmic throttling (Computer Science).',
      howDisciplinesConverge: 'The Electrical engineer limits I²R resistive heating; the Mechanical engineer computes pressure drops in liquid cooling channels; the Chemical engineer tracks electrochemical lithium intercalation; and the Software engineer runs predictive PID loops.'
    }
  },
  {
    id: 'feedback-and-control',
    universalPrinciple: 'Closed-Loop Feedback & Error Correction (Cybernetics & Control)',
    tagline: 'Control Signal = Controller(Target - Measured Output)',
    mentalModelDescription: 'Whether controlling an aircraft rudder, an op-amp amplifier, an autonomous vehicle speed, or software server auto-scaling, every intelligent engineering system senses its output, compares it with a setpoint target, and drives an actuator to minimize error.',
    branches: [
      {
        branchName: 'Mechanical & Robotics',
        domainTerm: 'PID Motion Control & Servo Actuation',
        potentialVariable: 'Position Error: e(t) = Target_Angle - Current_Angle',
        flowVariable: 'Motor Torque Command (τ, N·m)',
        oppositionResistance: 'Mechanical Friction & Damping (b)',
        storageElement1: 'Rotational Inertia (J, kg·m²)',
        storageElement2: 'Linkage Elasticity & Spring constant (k)',
        governingFormula: 'u(t) = K_p e(t) + K_i \\int e(t)dt + K_d \\frac{de(t)}{dt}',
        concreteExample: 'A robotic arm positioning a microchip on a circuit board with sub-millimeter precision.'
      },
      {
        branchName: 'Electronics & Communication',
        domainTerm: 'Negative Feedback in Operational Amplifiers',
        potentialVariable: 'Differential Input Voltage: v_d = v_+ - v_-',
        flowVariable: 'Amplifier Output Current / Voltage Swing',
        oppositionResistance: 'Feedback Resistor Network (R_f / R_in)',
        storageElement1: 'Parasitic Inductance',
        storageElement2: 'Compensation Capacitor (prevents high-frequency ringing)',
        governingFormula: 'A_{closed} = \\frac{A_{open}}{1 + A_{open} \\beta} \\approx \\frac{1}{\\beta}',
        concreteExample: 'An audio pre-amplifier eliminating harmonic distortion by feeding a portion of output back out-of-phase.'
      },
      {
        branchName: 'Computer Science & Software',
        domainTerm: 'TCP Congestion Control & Kubernetes Horizontal Pod Autoscaler',
        potentialVariable: 'Lag / Packet Loss Rate: Target_Latency - Observed_Latency',
        flowVariable: 'Congestion Window Size (cwnd) / Replicas Spawned',
        oppositionResistance: 'Network Bandwidth Limit & API Rate Limiting',
        storageElement1: 'Packet In-Flight Buffer',
        storageElement2: 'Redis Event Queue',
        governingFormula: '\\text{Replicas} = \\left\\lceil \\text{Current Replicas} \\times \\frac{\\text{Current Metric}}{\\text{Desired Metric}} \\right\\rceil',
        concreteExample: 'Netflix backend auto-scaling microservice containers during peak evening streaming traffic spikes.'
      },
      {
        branchName: 'Chemical & Biotech',
        domainTerm: 'Continuous Bioreactor pH & Temperature Regulation',
        potentialVariable: 'pH Error: ΔpH = Target_pH - Sensor_pH',
        flowVariable: 'Acid / Base Reagent Metering Pump Flow (mL/min)',
        oppositionResistance: 'Buffer Capacity of Solution',
        storageElement1: 'Residence Volume Time Lag',
        storageElement2: 'Thermal Heat Capacity of Broth',
        governingFormula: '\\frac{dC}{dt} = \\frac{Q}{V}(C_{in} - C) + r_A(C, T)',
        concreteExample: 'Maintaining precise 37.0°C and 7.4 pH for bacterial culture fermenting human insulin.'
      }
    ],
    multiDisciplinaryCapstone: {
      systemName: 'Reusable Rocket Vertical Landing (Falcon 9 / Starship)',
      description: 'Executing an aerodynamic flip and rocket burn deceleration to land on a droneship in ocean swell.',
      howDisciplinesConverge: 'Aerospace dynamics dictate aerodynamic grid fin drag; Mechatronics gimbal hydraulic actuators vector the rocket nozzle; ECE IMU sensors fuse gyroscope and accelerometer data with Kalman filters; and CS guidance algorithms solve convex optimization trajectory problems at 50 Hz.'
    }
  },
  {
    id: 'fourier-and-resonance',
    universalPrinciple: 'Fourier Decomposition & Natural Frequency Resonance',
    tagline: 'Every complex waveform is a superposition of sinusoids; matching frequency creates resonance',
    mentalModelDescription: 'Complex physical behavior is intractable in the time domain, but trivial in the frequency domain. When driving frequency matches a system’s natural pole, energy transfer maximizes—causing destructive structural collapse or desirable high-Q radio tuning.',
    branches: [
      {
        branchName: 'Civil & Structural',
        domainTerm: 'Seismic Building Resonance & Tuned Mass Dampers',
        potentialVariable: 'Ground Acceleration Spectral Amplitude (m/s²)',
        flowVariable: 'Lateral Story Drift Velocity (m/s)',
        oppositionResistance: 'Structural Viscous Damping Coefficient (c)',
        storageElement1: 'Skyscraper Kinetic Mass (M)',
        storageElement2: 'Column Lateral Bending Stiffness (K)',
        governingFormula: '\\omega_n = \\sqrt{\\frac{K}{M}}',
        concreteExample: 'Taipei 101’s suspended 660-tonne golden pendulum counteracting typhoon and earthquake sway.'
      },
      {
        branchName: 'Electronics & RF',
        domainTerm: 'LC Resonant Tanks & Radio Antennas',
        potentialVariable: 'RF Electric Field Potential (V/m)',
        flowVariable: 'Oscillating Antenna Surface Current (I, A)',
        oppositionResistance: 'Radiation Resistance & Skin Effect Loss (R)',
        storageElement1: 'Coil Inductance (L)',
        storageElement2: 'Electrode Capacitance (C)',
        governingFormula: 'f_0 = \\frac{1}{2\\pi \\sqrt{LC}}',
        concreteExample: 'Wi-Fi 6E receiver filtering a tiny 6 GHz electromagnetic carrier out of ambient radio noise.'
      },
      {
        branchName: 'Mechanical & Automotive',
        domainTerm: 'Internal Combustion Engine Crankshaft Torsional Vibration',
        potentialVariable: 'Cylinder Combustion Pressure Pulse (Torque, N·m)',
        flowVariable: 'Crankshaft Angular Oscillatory Velocity (rad/s)',
        oppositionResistance: 'Viscous Fluid Harmonic Damper',
        storageElement1: 'Flywheel Moment of Inertia (I)',
        storageElement2: 'Steel Shaft Torsional Rigidity (G·J / L)',
        governingFormula: '\\omega_{torsion} = \\sqrt{\\frac{k_t}{I}}',
        concreteExample: 'Harmonic harmonic damper pulley on the front of a car engine preventing the crankshaft from snapping.'
      },
      {
        branchName: 'Computer Science & AI',
        domainTerm: 'Fast Fourier Transform (FFT) & Convolutional Feature Maps',
        potentialVariable: 'Spatial Pixel Intensity Gradient / Sound Amplitude',
        flowVariable: 'Frequency Coefficient Magnitude & Phase',
        oppositionResistance: 'Computational Complexity O(N log N) vs O(N²)',
        storageElement1: 'Frequency Domain Spectral Vectors',
        storageElement2: 'Spatial Convolutional Kernel Weights',
        governingFormula: 'X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j 2\\pi k n / N}',
        concreteExample: 'MP3 and JPEG compression discarding high-frequency coefficients imperceptible to human senses.'
      }
    ],
    multiDisciplinaryCapstone: {
      systemName: 'Magnetic Resonance Imaging (MRI) Scanner',
      description: 'Non-invasive 3D medical imaging of human soft tissues using nuclear magnetic resonance.',
      howDisciplinesConverge: 'Biomedical physics exploits hydrogen proton precession; Superconducting electrical magnets produce 3 Tesla fields; RF electronics transmit precise Larmor frequency pulses; and CS high-performance algorithms compute 3D inverse Fourier transforms to reconstruct anatomical images.'
    }
  }
];
