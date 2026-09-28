export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  timeframe: string;
  focus: string;
  keySkills: string[];
  industryTools: string[];
  deliverableProject: string;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  targetRole: string;
  originBranches: string[];
  difficulty: 'Moderate' | 'Steep' | 'Challenging';
  estimatedMonths: string;
  whyThisComboIsHighValue: string;
  prerequisites: string[];
  phases: RoadmapPhase[];
  capstonePortfolioPiece: {
    title: string;
    description: string;
    techStack: string[];
  };
}

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: 'mech-to-robotics',
    title: 'Mechanical / Civil → Autonomous Systems & Robotics Engineer',
    targetRole: 'Robotics Software & Controls Engineer',
    originBranches: ['Mechanical Engineering', 'Civil & Structural', 'Automotive'],
    difficulty: 'Steep',
    estimatedMonths: '6–8 Months',
    whyThisComboIsHighValue: 'Software developers struggle with physical mechanics and motor torque limits. Mechanical engineers who can write robust C++ and ROS2 control code are rare, highly sought after by Tesla, Boston Dynamics, and aerospace leaders.',
    prerequisites: ['Vector Statics & Dynamics', 'Basic Python or C programming', 'Matrix Linear Algebra'],
    phases: [
      {
        phaseNumber: 1,
        title: 'Rigorous C++ & Linux for Physical Systems',
        timeframe: 'Weeks 1–6',
        focus: 'Bridging from scripts to memory-managed real-time software.',
        keySkills: ['Modern C++ (C++17/20, pointers, RAII, concurrency)', 'Linux CLI, Bash, CMake', 'Object-Oriented Kinematics Classes'],
        industryTools: ['Ubuntu LTS', 'GCC / Clang', 'GDB debugger', 'Eigen3 Matrix Library'],
        deliverableProject: 'Build a C++ 3D rigid body kinematics simulator calculating forward and inverse kinematics of a 3-DOF robot arm without external physics engines.'
      },
      {
        phaseNumber: 2,
        title: 'ROS2 (Robot Operating System) & Sensor Drivers',
        timeframe: 'Weeks 7–14',
        focus: 'Distributed robotic communications, node pub/sub, and sensor telemetry.',
        keySkills: ['ROS2 Nodes, Topics, Services, Actions', 'URDF & Xacro Robot Modeling', 'IMU, LiDAR, and Wheel Odometry Sensor Fusion'],
        industryTools: ['ROS2 Humble/Iron', 'RViz2', 'Gazebo Ignition Simulator'],
        deliverableProject: 'Simulate a 4-wheel differential drive mobile robot in Gazebo with obstacle avoidance using 2D LiDAR point clouds.'
      },
      {
        phaseNumber: 3,
        title: 'State Estimation (Kalman Filtering) & Motion Planning',
        timeframe: 'Weeks 15–22',
        focus: 'Bridging sensor noise to smooth trajectory execution.',
        keySkills: ['Extended Kalman Filters (EKF)', 'A* and RRT* Motion Planning', 'Pure Pursuit & Model Predictive Control (MPC)'],
        industryTools: ['Nav2 Navigation Stack', 'OpenCV', 'Google Cartographer (SLAM)'],
        deliverableProject: 'Deploy an autonomous SLAM pipeline that maps an unknown warehouse floor and navigates around dynamic obstacles using MPC.'
      }
    ],
    capstonePortfolioPiece: {
      title: 'Full-Stack Quadruped or Robotic Arm Digital Twin with ROS2 & Hardware-in-the-Loop',
      description: 'A complete end-to-end robotic project featuring CAD mechanical design, custom URDF simulation in Gazebo, and C++ trajectory generation controller with real-time telemetry dashboard.',
      techStack: ['ROS2', 'Modern C++', 'Gazebo', 'Eigen3', 'Python', 'RViz']
    }
  },
  {
    id: 'ece-to-vlsi',
    title: 'Electrical / ECE → Silicon, FPGA & ASIC Hardware Design',
    targetRole: 'Digital Design & Verification Engineer (ASIC/FPGA)',
    originBranches: ['Electronics & Communication (ECE)', 'Electrical Engineering', 'Computer Engineering'],
    difficulty: 'Challenging',
    estimatedMonths: '5–7 Months',
    whyThisComboIsHighValue: 'The global AI accelerator and semiconductor boom has created massive demand for engineers who write synthesizable hardware description code (Verilog/SystemVerilog) and understand physical clock domains.',
    prerequisites: ['Digital Logic Gates', 'Boolean Algebra', 'Basic C programming'],
    phases: [
      {
        phaseNumber: 1,
        title: 'Synthesizable SystemVerilog & Synchronous Design',
        timeframe: 'Weeks 1–6',
        focus: 'Thinking in concurrent silicon hardware rather than sequential software.',
        keySkills: ['RTL coding in SystemVerilog', 'Finite State Machine (FSM) Mealy vs Moore', 'Clock domain crossing (CDC) and Metastability'],
        industryTools: ['Vivado / Quartus', 'ModelSim / Questa', 'Icarus Verilog + GTKWave'],
        deliverableProject: 'Implement a synthesizable SPI and UART communication controller with configurable baud rates and verified with GTKWave testbenches.'
      },
      {
        phaseNumber: 2,
        title: 'RISC-V CPU Core Architecture from Scratch',
        timeframe: 'Weeks 7–14',
        focus: 'Building a working instruction set processor in silicon.',
        keySkills: ['Instruction Decode, ALU, Register File', '5-stage Pipelining (IF, ID, EX, MEM, WB)', 'Data Hazards, Forwarding, and Branch Prediction'],
        industryTools: ['RISC-V GNU Toolchain', 'Verilator', 'FPGA Dev Board (Xilinx Artix-7 / Basys 3)'],
        deliverableProject: 'Design, simulate, and flash a 32-bit RV32I pipelined RISC-V processor executing compiled C programs on an actual FPGA board.'
      },
      {
        phaseNumber: 3,
        title: 'SystemVerilog UVM Verification & Static Timing Analysis',
        timeframe: 'Weeks 15–20',
        focus: 'Industry-standard pre-silicon verification protocols.',
        keySkills: ['Universal Verification Methodology (UVM)', 'Constrained Random Verification', 'Static Timing Analysis (STA: Setup & Hold slack)'],
        industryTools: ['Synopsys Design Compiler (concepts)', 'OpenLane / SkyWater 130nm ASIC flow'],
        deliverableProject: 'Tape out an open-source ASIC block using OpenLane 130nm process with full GDSII layout verification.'
      }
    ],
    capstonePortfolioPiece: {
      title: 'Pipelined RV32I Processor with Hardware Matrix Multiplication Accelerator for Edge AI',
      description: 'A custom silicon core with an integrated systolic array hardware accelerator for accelerating convolution operations on FPGA.',
      techStack: ['SystemVerilog', 'RISC-V', 'Vivado', 'Verilator', 'C', 'GTKWave']
    }
  },
  {
    id: 'any-to-embedded-iot',
    title: 'Any Engineering Discipline → Embedded Firmware & IoT Architect',
    targetRole: 'Embedded Systems & Firmware Engineer',
    originBranches: ['Mechanical Engineering', 'Chemical & Process', 'Civil & Structural', 'Computer Science'],
    difficulty: 'Moderate',
    estimatedMonths: '4–6 Months',
    whyThisComboIsHighValue: 'Every physical machine is getting sensors and microcontrollers. An engineer who knows the physical system (pumps, engines, structures) AND writes embedded firmware is a 10x systems engineer.',
    prerequisites: ['Basic programming', 'High school physics (current & voltage)'],
    phases: [
      {
        phaseNumber: 1,
        title: 'Bare-Metal Embedded C & Microcontroller Peripherals',
        timeframe: 'Weeks 1–5',
        focus: 'Direct register manipulation without Arduino abstractions.',
        keySkills: ['Memory-mapped I/O, bitwise masks', 'Timers, Interrupts (ISR), and PWM generation', 'GPIO, ADC reading and filtering'],
        industryTools: ['ARM Cortex-M (STM32 Nucleo)', 'STM32CubeIDE', 'Saleae Logic Analyzer'],
        deliverableProject: 'Write bare-metal register-level C drivers for an I2C OLED display and an SPI digital accelerometer without external HAL libraries.'
      },
      {
        phaseNumber: 2,
        title: 'Real-Time Operating Systems (FreeRTOS)',
        timeframe: 'Weeks 6–11',
        focus: 'Deterministic task scheduling and multi-threaded embedded firmware.',
        keySkills: ['Preemptive Task Scheduling & Priorities', 'Queues, Mutexes, and Semaphores', 'Priority Inversion and Deadlock prevention'],
        industryTools: ['FreeRTOS kernel', 'Segger SystemView', 'J-Link Debugger'],
        deliverableProject: 'Build a multi-tasking data logger that streams high-speed sensor samples to an SD card while servicing communication interrupts.'
      },
      {
        phaseNumber: 3,
        title: 'Industrial Protocols (CAN bus, Modbus) & Edge IoT',
        timeframe: 'Weeks 12–18',
        focus: 'Robust automotive and industrial communications.',
        keySkills: ['CAN 2.0B bus framing and error handling', 'BLE / Wi-Fi (ESP-IDF)', 'Low-power sleep states and battery management'],
        industryTools: ['ESP32 ESP-IDF', 'Wireshark / CANoe', 'MQTT / TLS'],
        deliverableProject: 'Develop a battery-operated industrial condition monitor with CAN bus telemetry and cellular/Wi-Fi cloud reporting.'
      }
    ],
    capstonePortfolioPiece: {
      title: 'Automotive / Industrial CAN Bus Telemetry Node with FreeRTOS & Cloud Digital Twin',
      description: 'A production-grade embedded node reading temperature, vibration, and current sensors with real-time fault detection and CAN bus broadcast.',
      techStack: ['Embedded C', 'STM32 / ESP32', 'FreeRTOS', 'CAN Bus', 'MQTT', 'Python']
    }
  },
  {
    id: 'chem-civil-to-cleantech',
    title: 'Chemical / Civil / Mech → Battery & Clean Energy Systems',
    targetRole: 'Battery Management (BMS) & Energy Storage Engineer',
    originBranches: ['Chemical & Process', 'Mechanical Engineering', 'Electrical Engineering'],
    difficulty: 'Steep',
    estimatedMonths: '5–7 Months',
    whyThisComboIsHighValue: 'The energy transition requires massive grid batteries and EV packs. Understanding electrochemistry plus thermal management and electronic BMS is the holy grail of clean tech engineering.',
    prerequisites: ['Basic Thermodynamics', 'General Chemistry / Electrochemistry', 'Circuit fundamentals'],
    phases: [
      {
        phaseNumber: 1,
        title: 'Electrochemical Principles of Li-ion & Solid-State Cells',
        timeframe: 'Weeks 1–6',
        focus: 'Intercalation, degradation mechanisms, SEI layer, and thermal runaway physics.',
        keySkills: ['NMC, LFP, and Sodium-ion cell chemistries', 'Open-Circuit Voltage (OCV) vs State of Charge (SOC)', 'Equivalent Circuit Models (Thevenin ECM)'],
        industryTools: ['Python (PyBaMM - Python Battery Mathematical Model)', 'MATLAB / Simulink'],
        deliverableProject: 'Simulate a multi-cell battery discharge curve and parameterize an ECM model from pulse test data in PyBaMM.'
      },
      {
        phaseNumber: 2,
        title: 'Battery Management System (BMS) Algorithms',
        timeframe: 'Weeks 7–14',
        focus: 'State estimation and safe cell balancing.',
        keySkills: ['Coulomb Counting and EKF State-of-Charge (SOC) estimation', 'State-of-Health (SOH) and internal resistance tracking', 'Passive vs Active cell balancing topologies'],
        industryTools: ['Simulink Simscape Battery', 'Texas Instruments BMS ICs (BQ76952)', 'CANopen'],
        deliverableProject: 'Implement an Extended Kalman Filter in Python/C for real-time SOC estimation robust to current sensor noise.'
      },
      {
        phaseNumber: 3,
        title: 'Pack Thermal Management & High-Voltage Safety',
        timeframe: 'Weeks 15–22',
        focus: 'Cooling plate design, pressure drops, and electrical contactor safety.',
        keySkills: ['Direct liquid cooling vs immersion cooling', 'Thermal Runaway propagation prevention', 'High-voltage interlock loops (HVIL) and pre-charge circuits'],
        industryTools: ['ANSYS Fluent / OpenFOAM (thermal CFD)', 'CAD (SolidWorks/Fusion 360)'],
        deliverableProject: 'Design a 400V 50kWh battery module enclosure with cold plate fluid cooling channels maintaining delta-T < 3°C across all cells.'
      }
    ],
    capstonePortfolioPiece: {
      title: 'Full 48V / 400V Scaled Battery Pack with Active BMS Firmware and Thermal CFD Validation',
      description: 'Complete battery system design combining cell electrochemical modeling, hardware BMS schematic, embedded firmware balancing, and thermal cooling analysis.',
      techStack: ['PyBaMM', 'Python / C', 'Simulink', 'CAD', 'KiCad', 'CFD']
    }
  }
];
