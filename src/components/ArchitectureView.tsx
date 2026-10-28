import {
  ArrowDown,
  ArrowRight,
  ShieldX,
  GitBranch,
  Lock,
  CheckCircle2,
  XCircle,
  BookOpen,
  Layers,
  Cpu,
  Eye,
  Database,
  ArrowRightLeft,
} from 'lucide-react';

function FlowBox({
  label,
  sublabel,
  borderClass,
  bgClass,
  textClass,
}: {
  label: string;
  sublabel?: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg border-2 ${borderClass} ${bgClass} px-4 py-3 text-center min-w-[200px]`}>
      <div className={`font-mono text-[13px] font-semibold tracking-wide ${textClass}`}>
        {label}
      </div>
      {sublabel && (
        <div className="font-mono text-[10px] text-gray-500 mt-1">{sublabel}</div>
      )}
    </div>
  );
}

function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <ArrowDown size={20} className="text-gray-600" />
      {label && (
        <span className="font-mono text-[9px] text-gray-600 mt-0.5">{label}</span>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof BookOpen; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="h-8 w-8 rounded-md bg-metron-surface border border-metron-border flex items-center justify-center">
        <Icon size={16} className="text-metron-cyan" />
      </div>
      <h2 className="font-mono text-lg font-bold tracking-wide text-white">{title}</h2>
    </div>
  );
}

const CLASS_MATRIX = [
  {
    cls: 0,
    name: 'Class 0 · Harness',
    agents: 'MACEY',
    access: 'Routes to all',
    role: 'Intent routing, triage, context management',
    color: 'text-gray-300',
    border: 'border-gray-600/40',
  },
  {
    cls: 1,
    name: 'Class 1 · Tech',
    agents: 'ARCH, TIME, CHAIN, NEMO',
    access: 'CANON (Read) + WORKSPACE (RW)',
    role: 'Invariants & Sanitized Tech Summaries',
    color: 'text-metron-cyan',
    border: 'border-metron-cyan/40',
  },
  {
    cls: 2,
    name: 'Class 2 · Ops',
    agents: 'MAYA, SCOUT, VERA, ELIAS, ARIA',
    access: 'MARKET_VALIDATION (Read/Write)',
    role: 'Deals, Pipeline & Business Strategy',
    color: 'text-metron-amber',
    border: 'border-metron-amber/40',
  },
  {
    cls: 3,
    name: 'Class 3 · Sandbox',
    agents: 'MILES',
    access: 'EXTERNAL_SANDBOX (Read/Write)',
    role: 'Public Research & Sanitized Reports',
    color: 'text-metron-violet',
    border: 'border-metron-violet/40',
  },
  {
    cls: 4,
    name: 'Class 4 · Guest',
    agents: '@INVESTOR, @LAWYER',
    access: 'EXTERNAL_SANDBOX (Read-Only)',
    role: 'Due Diligence & External Review',
    color: 'text-metron-crimson',
    border: 'border-metron-crimson/40',
  },
];

const LOGIC_CARDS = [
  {
    title: 'The Abstention Logic',
    icon: ShieldX,
    color: 'text-metron-crimson',
    border: 'border-metron-crimson/30',
    bg: 'bg-metron-crimson/5',
    text: 'If a Class 2 agent is queried for Class 1 data, the UI must block the LLM call and render an [ ABSTAIN ] card. Clicking [ Escalate ] shifts activeAgent to ARCH and unlocks CANON in the Right Rail.',
  },
  {
    title: 'The Gate Block Logic',
    icon: Lock,
    color: 'text-metron-amber',
    border: 'border-metron-amber/30',
    bg: 'bg-metron-amber/5',
    text: 'When the user clicks [ Approve ] on a draft, the state machine checks the tollGates array. If VAL-001 is unsealed, the approval is blocked by a modal. An override action updates the Risk Radar in the Right Rail.',
  },
  {
    title: 'The Guest View Logic',
    icon: Eye,
    color: 'text-metron-violet',
    border: 'border-metron-violet/30',
    bg: 'bg-metron-violet/5',
    text: 'Toggling Guest View (Class 4) strips the Left Sidebar of all internal pipelines, hides Class 1 and Class 2 agents, and forces the Center Pane to only show EXTERNAL_SANDBOX documents.',
  },
  {
    title: 'The RAG API Isolation Logic',
    icon: Database,
    color: 'text-metron-cyan',
    border: 'border-metron-cyan/30',
    bg: 'bg-metron-cyan/5',
    text: 'Do not use a single vector database with metadata filtering. You must instantiate three separate databases. MACEY (the Harness) does not have direct DB access; she routes the user\'s query to a specific agent, and that agent holds the API key for only its assigned database. If a Class 2 agent tries to query the Class 1 DB, the API call returns a 403 Forbidden.',
  },
  {
    title: 'The Sandbox Containment Logic',
    icon: ShieldX,
    color: 'text-metron-violet',
    border: 'border-metron-violet/30',
    bg: 'bg-metron-violet/5',
    text: 'To enforce the Sandbox rule, the EXTERNAL_SANDBOX vector database must be hosted in a separate environment with no cross-RAG API access. When a thread is created in the Sandbox, MACEY must tag it with isSandbox=true. The UI must prevent @ARCH or @MAYA from being invoked in this thread. Only MILES (Class 3) or external guests can participate.',
  },
  {
    title: 'The Workspace vs. Canon Logic',
    icon: Database,
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/5',
    text: 'Drafting must happen in WORKSPACE. When the CEO approves a draft, the system must lock the document from further AI editing, generate a hash, and move it to the CANON vector database. This prevents AI hallucination from corrupting final legal documents.',
  },
];

const RAG_STRATEGY_CARDS = [
  {
    name: 'CANON',
    label: 'CLASS 0 · SEALED TRUTH',
    description: 'Final, human-sealed truth. Read-only to AI. Only Amir/Samarth can seal documents here.',
    color: 'text-metron-cyan',
    border: 'border-metron-cyan/50',
    topBorder: 'border-t-metron-cyan',
    bg: 'bg-metron-cyan/5',
  },
  {
    name: 'WORKSPACE',
    label: 'CLASS 0 · AI DRAFTS',
    description: 'The AI Drafting Room. Agents generate scripts and proposals here. No document is legally binding until moved to CANON.',
    color: 'text-blue-400',
    border: 'border-blue-400/50',
    topBorder: 'border-t-blue-400',
    bg: 'bg-blue-400/5',
  },
  {
    name: 'MARKET_VALIDATION',
    label: 'CLASS 2 · DEALS',
    description: 'Deals, transcripts, and competitor intel.',
    color: 'text-metron-amber',
    border: 'border-metron-amber/50',
    topBorder: 'border-t-metron-amber',
    bg: 'bg-metron-amber/5',
  },
  {
    name: 'EXTERNAL_SANDBOX',
    label: 'CLASS 3 / 4 · CONTAINED',
    description: 'Contained external advisory. Used for guest advisors and public research. Conversations here are permanently siloed.',
    color: 'text-metron-violet',
    border: 'border-metron-violet/50',
    topBorder: 'border-t-metron-violet',
    bg: 'bg-metron-violet/5',
  },
];

const BINDING_MATRIX = [
  {
    cls: 'Class 1 (Tech)',
    agents: 'ARCH, TIME, CHAIN, NEMO',
    rag: 'WORKSPACE',
    write: 'RW WORKSPACE',
    read: 'Reads CANON & MARKET_VALIDATION',
    color: 'text-metron-cyan',
  },
  {
    cls: 'Class 2 (Ops)',
    agents: 'MAYA, SCOUT, VERA, ELIAS, ARIA',
    rag: 'WORKSPACE + MARKET_VALIDATION',
    write: 'RW WORKSPACE & MARKET',
    read: 'Reads CANON (Sanitized)',
    color: 'text-metron-amber',
  },
  {
    cls: 'Class 3 (Sandbox)',
    agents: 'MILES',
    rag: 'EXTERNAL_SANDBOX',
    write: 'RW (Public)',
    read: 'NO ACCESS to internal RAGs',
    color: 'text-metron-violet',
  },
  {
    cls: 'Class 4 (Guest)',
    agents: '@INVESTOR, @LAWYER',
    rag: 'EXTERNAL_SANDBOX',
    write: 'Read Only',
    read: 'NO ACCESS to internal RAGs',
    color: 'text-metron-crimson',
  },
];

export default function ArchitectureView() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      {/* Page title */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
          SYSTEM ARCHITECTURE
        </h1>
        <p className="mt-1 text-[13px] text-gray-500">
          The operational logic, agent classes, and data flow that govern the Metron Command Center.
        </p>
      </div>

      {/* Section 1: Operational Flowchart */}
      <section>
        <SectionHeader icon={GitBranch} title="OPERATIONAL FLOW: THE HARNESS ROUTING" />

        <div className="rounded-xl border border-metron-border bg-metron-surface/40 p-8">
          {/* Step 1: User Input */}
          <div className="flex justify-center">
            <FlowBox
              label="User Input in Composer"
              sublabel="Operator types intent"
              borderClass="border-gray-600/40"
              bgClass="bg-gray-600/5"
              textClass="text-gray-300"
            />
          </div>

          <DownArrow />

          {/* Step 2: MACEY */}
          <div className="flex justify-center">
            <FlowBox
              label="MACEY (Class 0 Harness)"
              sublabel="Routes intent, triages tickets"
              borderClass="border-green-500/50"
              bgClass="bg-green-500/5"
              textClass="text-green-400"
            />
          </div>

          <DownArrow label="classifies intent" />

          {/* Split into two paths */}
          <div className="flex justify-center gap-8 mt-2">
            {/* Path A: Class 1 */}
            <div className="flex flex-col items-center">
              <FlowBox
                label="Class 1 Agents"
                sublabel="ARCH, TIME, CHAIN, NEMO"
                borderClass="border-metron-cyan/50"
                bgClass="bg-metron-cyan/5"
                textClass="text-metron-cyan"
              />
              <DownArrow />
              <FlowBox
                label="CANON RAG"
                sublabel="Sealed Truth · 46 docs"
                borderClass="border-metron-cyan/50"
                bgClass="bg-metron-cyan/5"
                textClass="text-metron-cyan"
              />
            </div>

            {/* Path B: Class 2 */}
            <div className="flex flex-col items-center">
              <FlowBox
                label="Class 2 Agents"
                sublabel="MAYA, SCOUT, VERA, ELIAS"
                borderClass="border-metron-amber/50"
                bgClass="bg-metron-amber/5"
                textClass="text-metron-amber"
              />
              <DownArrow />
              <FlowBox
                label="MARKET_VALIDATION RAG"
                sublabel="Deals & Strategy · 12 docs"
                borderClass="border-metron-amber/50"
                bgClass="bg-metron-amber/5"
                textClass="text-metron-amber"
              />
            </div>
          </div>

          {/* Cross-path arrows */}
          <div className="mt-6 space-y-3">
            {/* Denied access arrow */}
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-[10px] text-metron-crimson border border-dashed border-metron-crimson/50 rounded px-2 py-1">
                Path B &#8594; CANON
              </span>
              <ArrowRight size={14} className="text-metron-crimson" />
              <span className="font-mono text-[10px] font-bold text-metron-crimson bg-metron-crimson/10 border border-metron-crimson/40 rounded px-2 py-1">
                ABSTAIN / ACCESS DENIED
              </span>
            </div>

            {/* Escalation arrow */}
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-[10px] text-metron-amber border border-dashed border-metron-amber/50 rounded px-2 py-1">
                Path B &#8594; Path A
              </span>
              <ArrowRight size={14} className="text-metron-amber" />
              <span className="font-mono text-[10px] font-bold text-metron-amber bg-metron-amber/10 border border-metron-amber/40 rounded px-2 py-1">
                Escalation Card
              </span>
            </div>
          </div>

          <DownArrow label="draft ready for approval" />

          {/* Human Seal */}
          <div className="flex justify-center">
            <FlowBox
              label="The Human Seal (Amir / Samarth)"
              sublabel="Class 0 operator authorizes"
              borderClass="border-white/40"
              bgClass="bg-white/5"
              textClass="text-white"
            />
          </div>

          <DownArrow label="approval attempt" />

          {/* Toll Gate Check */}
          <div className="flex justify-center">
            <FlowBox
              label="Toll Gate Check (VAL-001)"
              sublabel="Is the timing certificate sealed?"
              borderClass="border-metron-amber/50"
              bgClass="bg-metron-amber/5"
              textClass="text-metron-amber"
            />
          </div>

          <DownArrow />

          {/* Final split */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <FlowBox
                label="Gate Blocked"
                sublabel="Modal: override or cancel"
                borderClass="border-metron-crimson/50"
                bgClass="bg-metron-crimson/5"
                textClass="text-metron-crimson"
              />
              <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-metron-crimson/70">
                <XCircle size={11} />
                Risk logged
              </div>
            </div>
            <div className="flex flex-col items-center">
              <FlowBox
                label="Sealed & Approved"
                sublabel="Deal moves forward"
                borderClass="border-green-500/50"
                bgClass="bg-green-500/5"
                textClass="text-green-400"
              />
              <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-green-400/70">
                <CheckCircle2 size={11} />
                Clean approval
              </div>
            </div>
          </div>
        </div>

        {/* The Harness Concept text block */}
        <div className="mt-6 rounded-lg border border-metron-border bg-metron-surface/60 p-5">
          <div className="font-mono text-[11px] font-bold tracking-widest text-metron-cyan mb-2">
            THE HARNESS CONCEPT
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            MACEY (Class 0) is not a generic chatbot. She is a router. She does not hold patents or deal terms. When the CEO speaks, MACEY analyzes the intent and routes the query to the correct Class. This prevents the CEO from having to remember which agent knows what, while strictly enforcing data boundaries.
          </p>
          <div className="mt-4 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="font-mono text-[11px] font-semibold text-metron-cyan shrink-0 w-[110px]">Class 1 (Tech):</span>
              <span className="text-[12px] text-gray-400 leading-relaxed">The Architects. They defend the invariants and the raw IP.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-[11px] font-semibold text-metron-amber shrink-0 w-[110px]">Class 2 (Ops):</span>
              <span className="text-[12px] text-gray-400 leading-relaxed">The Executors. They drive revenue using only Sanitized Summaries.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-[11px] font-semibold text-metron-violet shrink-0 w-[110px]">Class 3 (Sandbox):</span>
              <span className="text-[12px] text-gray-400 leading-relaxed">The External Cortex. It provides advisory and research without touching internal IP.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1.5: The Four RAG Strategy */}
      <section>
        <SectionHeader icon={Database} title="THE FOUR RAG STRATEGY (DATA SOVEREIGNTY)" />
        <p className="text-[13px] text-gray-500 mb-6 -mt-4">
          Why we isolate data at the API level, not just the UI level.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RAG_STRATEGY_CARDS.map((rag) => (
            <div
              key={rag.name}
              className={`rounded-xl border ${rag.border} ${rag.bg} border-t-2 ${rag.topBorder} p-5 flex flex-col`}
            >
              <div className={`font-mono text-[14px] font-bold tracking-wide ${rag.color}`}>
                {rag.name}
              </div>
              <div className="font-mono text-[10px] text-gray-600 mt-1 mb-3 tracking-wider">
                {rag.label}
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed flex-1">
                {rag.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-metron-border bg-metron-surface/60 p-5">
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-[11px] font-bold tracking-widest text-metron-cyan shrink-0">
              THE LOGIC:
            </span>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              If we used one RAG, a malicious PDF uploaded by a guest could instruct the LLM to leak our patents to a competitor. By isolating the API keys and vector databases, we enforce a mathematical wall between the IP and the business.
            </p>
          </div>
        </div>

        {/* Sandbox Containment Rule callout */}
        <div className="mt-4 rounded-lg border border-metron-violet/30 bg-metron-violet/5 p-5">
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-metron-violet mt-0.5 shrink-0" />
            <div>
              <div className="font-mono text-[11px] font-bold tracking-widest text-metron-violet mb-1.5">
                [ THE SANDBOX CONTAINMENT RULE ]
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                If Amir discusses a strategic pivot with an external advisor in the Sandbox, that thread is sealed. MAYA (Class 2) cannot read it to draft a proposal, and ARCH (Class 1) cannot read it to update the architecture. This protects the company from accidental IP leakage and protects the advisor\'s input from corporate capture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1.75: Agent-RAG Binding Matrix */}
      <section>
        <SectionHeader icon={ArrowRightLeft} title="AGENT-RAG BINDING (STRICT API ISOLATION)" />

        <div className="rounded-xl border border-metron-border bg-metron-surface/40 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-metron-border bg-metron-surface">
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Agent Class
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Agents
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Bound RAG
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Write Access
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Read Access
                </th>
              </tr>
            </thead>
            <tbody>
              {BINDING_MATRIX.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-metron-border/60 hover:bg-metron-surface/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[12px] font-semibold ${row.color}`}>
                      {row.cls}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] text-gray-300">{row.agents}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-semibold ${row.color}`}>
                      {row.rag}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] text-gray-400">{row.write}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-mono text-[11px] ${
                        row.read.includes('NO ACCESS') ? 'text-metron-crimson' : 'text-gray-400'
                      }`}
                    >
                      {row.read.includes('NO ACCESS') && <Lock size={10} className="inline mr-1" />}
                      {row.read}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-lg border border-metron-amber/30 bg-metron-amber/5 p-5">
          <div className="flex items-start gap-3">
            <ArrowRightLeft size={16} className="text-metron-amber mt-0.5 shrink-0" />
            <div>
              <div className="font-mono text-[11px] font-bold tracking-widest text-metron-amber mb-1.5">
                [ ESCALATION PATH ]
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                If MAYA (Class 2) needs a technical claim for a proposal, she must use the Harness to request a{' '}
                <span className="text-metron-cyan font-mono">Sanitized Tech Summary</span> from ARCH (Class 1).
                ARCH generates the summary, seals it, and pushes it to{' '}
                <span className="text-metron-amber font-mono">MARKET_VALIDATION</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Agent Classes & RAG Matrix */}
      <section>
        <SectionHeader icon={Layers} title="AGENT CLASSES & DATA SILOS" />

        <div className="rounded-xl border border-metron-border bg-metron-surface/40 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-metron-border bg-metron-surface">
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Class
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Agents
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Data Access
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {CLASS_MATRIX.map((row) => (
                <tr
                  key={row.cls}
                  className="border-b border-metron-border/60 hover:bg-metron-surface/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[12px] font-semibold ${row.color}`}>
                      {row.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[12px] text-gray-300">{row.agents}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${row.color}`}
                    >
                      {row.cls === 4 && <Lock size={10} />}
                      {row.access}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-gray-400">{row.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The Separation of Powers text block */}
        <div className="mt-6 rounded-lg border border-metron-border bg-metron-surface/60 p-5">
          <div className="font-mono text-[11px] font-bold tracking-widest text-metron-cyan mb-2">
            THE SEPARATION OF POWERS
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            The AOC is designed so that no single agent can compromise the company. The Tech class (ARCH, TIME) cannot negotiate deals. The Ops class (MAYA, SCOUT) cannot alter the technical architecture. The Sandbox class (MILES, Advisors) cannot see the internal operations. The Human (Class 0) sits at the top to approve the intersections.
          </p>
        </div>
      </section>

      {/* Section 3: State Machine Logic */}
      <section>
        <SectionHeader icon={Cpu} title="STATE MACHINE LOGIC (FOR SAMARTH)" />

        <div className="grid grid-cols-1 gap-4">
          {LOGIC_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`rounded-xl border ${card.border} ${card.bg} p-5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-md bg-metron-bg border ${card.border} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={card.color} />
                  </div>
                  <div>
                    <h3 className={`font-mono text-[14px] font-semibold ${card.color}`}>
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-gray-400 leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-4" />
    </div>
  );
}
