import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'node:http';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface ExplainRequest {
  topic: string;
  sourceBranch: string; // e.g. "Mechanical Engineering"
  targetDiscipline: string; // e.g. "Computer Science & Neural Networks"
  learningGoal?: string;
}

export interface BridgeRequest {
  fromBranch: string;
  toBranch: string;
  concept: string;
}

export interface RoadmapRequest {
  currentBranch: string;
  targetCareerOrSkill: string;
  timeframeWeeks?: number;
}

export interface ProblemRequest {
  branch: string;
  topic: string;
  difficulty: 'Foundation' | 'Core' | 'Advanced';
}

export async function handleGeminiApi(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;

  // Set standard JSON headers & CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Parse body
  let bodyBuffer = '';
  req.on('data', chunk => {
    bodyBuffer += chunk;
  });

  req.on('end', async () => {
    try {
      const data = bodyBuffer ? JSON.parse(bodyBuffer) : {};
      const ai = getAI();

      if (path === '/api/gemini/bridge') {
        const { fromBranch, toBranch, concept } = data as BridgeRequest;
        if (!concept || !fromBranch || !toBranch) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing required fields: fromBranch, toBranch, concept' }));
          return;
        }

        if (ai) {
          const prompt = `You are a world-class cross-disciplinary engineering professor.
A student studying ${fromBranch} needs to master the concept: "${concept}" from ${toBranch}.

Provide a brilliant, crystal-clear breakdown structured in JSON with these exact keys:
{
  "conceptTitle": "${concept}",
  "theCoreIntuition": "1-2 concise paragraphs explaining the physical or mathematical essence without unnecessary jargon.",
  "bridgeAnalogy": "A direct, vivid conceptual bridge/isomorphism between ${fromBranch} and ${toBranch} (e.g. how electrical voltage/current/resistance maps to mechanical force/velocity/friction or hydraulic pressure/flow rate/pipe drag).",
  "governingEquation": "The main mathematical formula with all variables defined and their physical units.",
  "concreteApplication": "A real-world multi-disciplinary engineering system where both ${fromBranch} and ${toBranch} combine using this concept (e.g. Electric Vehicle regenerative braking, Robotic arm actuation, Smart grid sensor).",
  "commonPitfalls": ["Pitfall 1 with clarification", "Pitfall 2 with clarification"],
  "actionableExercise": "A quick 5-minute mental or calculation challenge to test their grasp."
}

Return ONLY valid raw JSON without markdown backticks.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          const rawText = response.text?.trim() || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          res.statusCode = 200;
          res.end(cleanJson);
          return;
        }

        // Fallback deterministic high-grade bridge
        res.statusCode = 200;
        res.end(JSON.stringify(getFallbackBridge(fromBranch, toBranch, concept)));
        return;
      }

      if (path === '/api/gemini/explain') {
        const { topic, sourceBranch, targetDiscipline } = data as ExplainRequest;
        if (!topic) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing topic' }));
          return;
        }

        if (ai) {
          const prompt = `You are an elite polymath engineering educator.
Explain the topic "${topic}" (Discipline: ${targetDiscipline || 'Engineering'}) specifically tailored for a student with a background in ${sourceBranch || 'Engineering'}.

Provide a structured JSON output with:
{
  "title": "${topic}",
  "executiveSummary": "2 clear sentences answering: what is this, and why do engineers care?",
  "firstPrinciples": "Explain from foundational physical/mathematical principles.",
  "crossDisciplineAnalogy": "How this connects directly to ${sourceBranch || 'everyday physical mechanics'}.",
  "keyFormulas": [
    { "name": "Formula Name", "equation": "LaTeX or plain text formula", "variables": "Explanation of terms" }
  ],
  "industryTools": ["Tool 1 (e.g., MATLAB, ANSYS, ROS2, Verilog, PyTorch)", "Tool 2", "Tool 3"],
  "handsOnProject": "A practical project an engineering student can build combining their branch with this topic."
}

Return ONLY valid raw JSON without markdown backticks.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          const rawText = response.text?.trim() || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          res.statusCode = 200;
          res.end(cleanJson);
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(getFallbackExplain(topic, sourceBranch, targetDiscipline)));
        return;
      }

      if (path === '/api/gemini/roadmap') {
        const { currentBranch, targetCareerOrSkill, timeframeWeeks } = data as RoadmapRequest;
        if (!targetCareerOrSkill) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing targetCareerOrSkill' }));
          return;
        }

        if (ai) {
          const prompt = `Generate an engineering career and tech transition roadmap for a student in ${currentBranch || 'Engineering'} wanting to become a ${targetCareerOrSkill} over ${timeframeWeeks || 12} weeks.

Structure as JSON:
{
  "targetRole": "${targetCareerOrSkill}",
  "startingBranch": "${currentBranch || 'Engineering'}",
  "totalDuration": "${timeframeWeeks || 12} Weeks",
  "leveragePoints": "What unique advantages the student brings from their background in ${currentBranch}.",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "weeks": "Weeks 1-3",
      "focus": "Core focus",
      "keyCompetencies": ["Skill 1", "Skill 2", "Skill 3"],
      "recommendedTools": ["Tool A", "Tool B"],
      "milestoneDeliverable": "Specific project milestone"
    },
    {
      "phaseNumber": 2,
      "title": "Phase title",
      "weeks": "Weeks 4-7",
      "focus": "Core focus",
      "keyCompetencies": ["Skill 1", "Skill 2", "Skill 3"],
      "recommendedTools": ["Tool A", "Tool B"],
      "milestoneDeliverable": "Specific project milestone"
    },
    {
      "phaseNumber": 3,
      "title": "Phase title",
      "weeks": "Weeks 8-12",
      "focus": "Core focus",
      "keyCompetencies": ["Skill 1", "Skill 2", "Skill 3"],
      "recommendedTools": ["Tool A", "Tool B"],
      "milestoneDeliverable": "Specific capstone project"
    }
  ],
  "capstoneIdea": "A showcase portfolio project demonstrating mastery across both branches."
}

Return ONLY valid raw JSON without markdown backticks.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          const rawText = response.text?.trim() || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          res.statusCode = 200;
          res.end(cleanJson);
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(getFallbackRoadmap(currentBranch, targetCareerOrSkill)));
        return;
      }

      if (path === '/api/gemini/problem') {
        const { branch, topic, difficulty } = data as ProblemRequest;
        if (ai) {
          const prompt = `Create 1 rigorous, practical engineering numerical or diagnostic conceptual challenge for topic: "${topic}" in ${branch} at ${difficulty || 'Core'} level.

Output JSON:
{
  "problemStatement": "Clear scenario and numeric values with units.",
  "givenValues": { "param1": "value", "param2": "value" },
  "question": "Exact target calculation or question.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "stepByStepSolution": "Detailed mathematical and physical solution.",
  "engineeringTakeaway": "Key insight for practical design or real systems."
}

Return ONLY valid raw JSON without markdown backticks.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          const rawText = response.text?.trim() || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          res.statusCode = 200;
          res.end(cleanJson);
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(getFallbackProblem(topic, branch, difficulty)));
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    } catch (err: unknown) {
      console.error('Gemini API Handler error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
      res.statusCode = 500;
      res.end(JSON.stringify({ error: errorMessage }));
    }
  });
}

function getFallbackBridge(fromBranch: string, toBranch: string, concept: string) {
  return {
    conceptTitle: concept,
    theCoreIntuition: `${concept} is a fundamental engineering phenomenon governing how energy, state transitions, or signals propagate through a constrained physical or computational system. Regardless of whether you analyze a mechanical linkage, an electrical mesh, or a data pipeline, the mathematical equations governing balance and conservation remain topologically isomorphic.`,
    bridgeAnalogy: `In ${fromBranch}, you are accustomed to potential gradients driving equilibrium (e.g. pressure drops, mechanical force balances, or thermal dissipation). In ${toBranch}, ${concept} acts precisely like that same equilibrium mechanism: potential difference divided by resistance or impedance equals throughput rate.`,
    governingEquation: `General Transfer Law: \\dot{\\Phi} = \\frac{\\Delta \\Psi}{R_{effective}}`,
    concreteApplication: `Modern Autonomous Electric Vehicles: The battery thermal management (Chemical & Thermal), motor torque vectoring (Electrical & Mechanical), and trajectory planning algorithms (Computer Science) synchronize using this exact balance principle in real-time control loops.`,
    commonPitfalls: [
      `Confusing transient dynamic behavior with steady-state response.`,
      `Neglecting parasitic losses (friction, internal resistance, memory overhead) that disrupt idealized theoretical models.`
    ],
    actionableExercise: `Identify the 'potential variable' and 'flow variable' in your native discipline, then write down the equivalent variables for ${concept} in ${toBranch}.`
  };
}

function getFallbackExplain(topic: string, sourceBranch: string, targetDiscipline: string) {
  return {
    title: topic,
    executiveSummary: `${topic} is a cornerstone concept in ${targetDiscipline || 'engineering'}. It provides the mathematical and physical basis for modeling, predicting, and optimizing system performance under operational constraints.`,
    firstPrinciples: `At its core, ${topic} relies on conservation principles (mass, momentum, energy, or information). By establishing the boundary conditions and applying differential balance, the system state can be solved analytically or discretized for numerical simulation.`,
    crossDisciplineAnalogy: `From the perspective of ${sourceBranch || 'engineering mechanics'}, think of ${topic} as analogous to an equilibrium state where conflicting forces or state rates reach a steady balance point.`,
    keyFormulas: [
      {
        name: 'Governing State Equation',
        equation: 'dY/dt = f(Y, U, t)',
        variables: 'Y = state vector, U = input vector, t = time'
      }
    ],
    industryTools: ['MATLAB / Simulink', 'Python (NumPy / SciPy)', 'ANSYS / OpenFOAM', 'SolidWorks / Cadence'],
    handsOnProject: `Design and simulate an active closed-loop controller incorporating ${topic} with a hardware-in-the-loop (HIL) or virtual testbed.`
  };
}

function getFallbackRoadmap(currentBranch: string, targetCareerOrSkill: string) {
  return {
    targetRole: targetCareerOrSkill,
    startingBranch: currentBranch || 'Engineering',
    totalDuration: '12 Weeks',
    leveragePoints: `Your background in ${currentBranch || 'engineering'} provides strong mathematical rigor, physical intuition, and systems-level problem solving that purely self-taught developers or technicians often lack.`,
    phases: [
      {
        phaseNumber: 1,
        title: 'Foundational Bridges & Mathematical Parallels',
        weeks: 'Weeks 1–3',
        focus: 'Translating native domain models into target programming and architecture primitives.',
        keyCompetencies: ['Core Syntax & Toolchains', 'State Representation', 'Linear Algebra & Calculus mapping'],
        recommendedTools: ['Python / C++', 'Git / GitHub', 'VS Code'],
        milestoneDeliverable: 'Build a working mathematical simulator modeling a physical process from your home discipline.'
      },
      {
        phaseNumber: 2,
        title: 'Domain-Specific Architecture & Tooling',
        weeks: 'Weeks 4–7',
        focus: `Mastering industry-standard protocols, libraries, and frameworks required for ${targetCareerOrSkill}.`,
        keyCompetencies: ['Real-Time Operating Systems (RTOS) or High-Performance Frameworks', 'API & Sensor Protocols', 'Hardware/Software Interfaces'],
        recommendedTools: ['Linux / Docker', 'ROS2 or PyTorch / Verilog', 'CAN/SPI/I2C Analyzers'],
        milestoneDeliverable: 'Develop a functional multi-threaded driver or data processing pipeline with telemetry.'
      },
      {
        phaseNumber: 3,
        title: 'Production Capstone & Portfolio Deployment',
        weeks: 'Weeks 8–12',
        focus: 'End-to-end integration, performance benchmarking, and open-source documentation.',
        keyCompetencies: ['System Optimization', 'Fail-Safe Engineering', 'Technical Case Study Writing'],
        recommendedTools: ['CI/CD Pipelines', 'Benchmarking Profilers', 'Simulation Environments'],
        milestoneDeliverable: `A complete, peer-reviewable capstone project demonstrating how ${currentBranch} intuition enhances ${targetCareerOrSkill} solutions.`
      }
    ],
    capstoneIdea: `An intelligent physical-digital hybrid system: An automated test bench or digital twin connecting real physical sensors to real-time algorithmic decision-making.`
  };
}

function getFallbackProblem(topic: string, branch: string, difficulty: string) {
  return {
    problemStatement: `In a high-reliability ${branch} system operating under steady-state conditions for ${topic}, calculate the critical operating parameter when the load increases by 25% from nominal rating.`,
    givenValues: { "Nominal Load P0": "100 kW", "Efficiency η": "92%", "Safety Factor FoS": "1.5" },
    question: `What is the required design capacity to maintain the safety factor?`,
    options: [
      "125.0 kW",
      "187.5 kW",
      "153.2 kW",
      "204.1 kW"
    ],
    correctIndex: 1,
    stepByStepSolution: `Step 1: Calculate the new load after 25% increase: P_new = 100 kW * 1.25 = 125 kW.\nStep 2: Apply the required Factor of Safety: P_design = P_new * FoS = 125 kW * 1.5 = 187.5 kW.\nStep 3: This ensures the system maintains resilience against unexpected harmonic surges or transient stresses.`,
    engineeringTakeaway: `Engineering designs must always calculate margin over worst-case peak loads rather than nominal operating points.`
  };
}
