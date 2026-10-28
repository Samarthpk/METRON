import {
  Lock,
  Unlock,
  Database,
  ShieldCheck,
  X,
  FileText,
  FolderOpen,
  Activity,
  HeartPulse,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { useState } from 'react';
import {
  useCommandCenter,
  classColor,
  type Rag,
  type ViewId,
} from '@/state/CommandCenterContext';

const RAG_STATUS: Record<Rag['status'], { label: string; color: string }> = {
  secure: { label: 'SECURE', color: 'text-green-400' },
  sealed: { label: 'SEALED', color: 'text-green-400' },
  active: { label: 'ACTIVE', color: 'text-amber-400' },
  locked: { label: 'LOCKED', color: 'text-gray-500' },
};

const RAG_DESCRIPTION: Record<string, string> = {
  canon: 'Final Human-Verified Docs',
  workspace: 'Active AI Drafts & Working Docs',
  market_validation: 'Research & Transcripts',
  external_sandbox: 'External Advisory Capture',
};

const RAG_COLOR_MAP: Record<string, { text: string; border: string; bg: string }> = {
  cyan: { text: 'text-metron-cyan', border: 'border-metron-cyan/30', bg: 'bg-metron-cyan/5' },
  blue: { text: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/5' },
  amber: { text: 'text-metron-amber', border: 'border-metron-amber/30', bg: 'bg-metron-amber/5' },
  violet: { text: 'text-metron-violet', border: 'border-metron-violet/30', bg: 'bg-metron-violet/5' },
};

const PIPELINE_LABEL: Record<string, string> = {
  aidc: 'AI DC Pipeline',
  aiapps: 'AI Apps Pipeline',
  simsp: 'SI/MSP Channel',
};

const STATUS_PROGRESS: Record<string, number> = {
  Prospect: 25,
  'SDK Test': 45,
  'MOU Review': 60,
  Negotiation: 75,
};

function Header({ onClear }: { onClear?: () => void }) {
  return (
    <div className="h-[52px] shrink-0 border-b border-metron-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Database size={14} className="text-gray-500" />
        <span className="font-mono text-[12px] font-semibold tracking-widest text-gray-300">
          CONTEXT &amp; EVIDENCE
        </span>
      </div>
      {onClear && (
        <button
          aria-label="Close deal context"
          onClick={onClear}
          className="h-7 w-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-metron-surface transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function RagList() {
  const { rags, activeAgent, agents, guestView } = useCommandCenter();
  const agent = agents.find((a) => a.id === activeAgent);
  const [denied, setDenied] = useState<string | null>(null);

  // Guest view only sees the EXTERNAL_SANDBOX RAG.
  const visibleRags = guestView
    ? rags.filter((r) => r.id === 'external_sandbox')
    : rags;

  const isAccessible = (rag: Rag) => {
    if (guestView) {
      return rag.id === 'external_sandbox';
    }
    // CANON is read-only to AI — all agents can read.
    // WORKSPACE and MARKET_VALIDATION: agent class determines access.
    if (rag.id === 'canon') return true;
    if (rag.id === 'workspace') return agent !== undefined && agent.class <= 2;
    if (rag.id === 'market_validation') return agent !== undefined && agent.class <= 2;
    if (rag.id === 'external_sandbox') return true;
    return false;
  };

  const handleClick = (rag: Rag) => {
    if (!isAccessible(rag) && !guestView) {
      setDenied(`Access Denied: ${rag.name} requires elevated clearance`);
      window.setTimeout(() => setDenied(null), 2200);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="mb-3 px-1 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Knowledge RAGs
        </span>
        <span className="font-mono text-[10px] text-gray-600">
          Viewer: {guestView ? 'GUEST' : agent?.name ?? '—'}
        </span>
      </div>

      {denied && (
        <div className="mb-3 px-3 py-2 rounded-md bg-metron-crimson/10 border border-metron-crimson/40 font-mono text-[11px] text-metron-crimson flex items-center gap-2">
          <Lock size={12} />
          {denied}
        </div>
      )}

      <ul className="space-y-2">
        {visibleRags.map((rag) => {
          const accessible = isAccessible(rag);
          const status = RAG_STATUS[rag.status];
          const Icon = accessible ? Unlock : Lock;
          const colorMap = RAG_COLOR_MAP[rag.color] ?? RAG_COLOR_MAP.cyan;
          return (
            <li
              key={rag.id}
              onClick={() => handleClick(rag)}
              className={`group rounded-lg border p-3 transition-colors ${
                accessible
                  ? `${colorMap.border} ${colorMap.bg} cursor-pointer hover:border-current/50`
                  : 'border-metron-border/60 bg-metron-surface/30 opacity-70 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={13}
                      className={accessible ? colorMap.text : 'text-gray-600'}
                    />
                    <span
                      className={`font-mono text-[12px] font-semibold tracking-wide truncate ${
                        accessible ? colorMap.text : 'text-gray-500'
                      }`}
                    >
                      {rag.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-600 leading-snug mt-0.5">
                    {RAG_DESCRIPTION[rag.id] ?? ''}
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-gray-500">
                      {rag.class === 0 ? 'CL0' : `CL${rag.class}`}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500">{rag.docs} docs</span>
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] ${status.color}`}
                    >
                      {(rag.status === 'sealed' || rag.status === 'secure') && <ShieldCheck size={10} />}
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {guestView && (
        <div className="mt-4 px-3 py-2.5 rounded-md bg-metron-violet/5 border border-metron-violet/30 flex items-center gap-2">
          <EyeOff size={12} className="text-metron-violet" />
          <span className="font-mono text-[10px] text-metron-violet/90 leading-snug">
            Guest view restricted to EXTERNAL_SANDBOX only.
          </span>
        </div>
      )}
    </div>
  );
}

function DealContext() {
  const { activeDeal, closeDeal } = useCommandCenter();
  if (!activeDeal) return null;

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Deal Context
        </div>
        <div className="rounded-lg border border-metron-border bg-metron-surface p-4">
          <div className="font-mono text-[13px] font-semibold text-white leading-snug">
            {activeDeal.title}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-metron-amber/40 text-metron-amber bg-metron-amber/5">
              {activeDeal.status.toUpperCase()}
            </span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded border ${classColor(
                activeDeal.class,
              )} border-current/30`}
            >
              CLASS {activeDeal.class}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-metron-border/60">
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">
              Owning Agent
            </div>
            <div className={`font-mono text-[12px] font-semibold ${classColor(activeDeal.class)}`}>
              {activeDeal.agent}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          <FolderOpen size={11} />
          Evidence
        </div>
        <div className="rounded-lg border border-metron-border bg-metron-surface p-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 shrink-0 rounded-md bg-metron-bg border border-metron-border flex items-center justify-center">
              <FileText size={16} className="text-metron-cyan" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[12px] text-gray-200 truncate">
                {activeDeal.evidence}
              </div>
              <div className="font-mono text-[10px] text-gray-600 mt-0.5">
                Attached · {activeDeal.type}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Knowledge RAGs
        </div>
        <RagList />
      </div>
    </div>
  );
}

function EcosystemHealth({ view }: { view: ViewId }) {
  const { pipelines } = useCommandCenter();
  const deals = pipelines[view as keyof typeof pipelines] ?? [];

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-600">
        <HeartPulse size={11} />
        Ecosystem Health
      </div>

      <div className="rounded-lg border border-metron-border bg-metron-surface p-4 mb-4">
        <div className="font-mono text-[11px] text-gray-500 mb-1">Active Pipeline</div>
        <div className="font-mono text-[13px] font-semibold text-gray-200">
          {PIPELINE_LABEL[view] ?? view}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[10px] text-gray-600">{deals.length} deals</span>
          <span className="h-1 w-1 rounded-full bg-gray-700" />
          <span className="font-mono text-[10px] text-gray-600">Class 2 · Ops</span>
        </div>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => {
          const pct = STATUS_PROGRESS[deal.status] ?? 30;
          return (
            <div key={deal.id} className="rounded-lg border border-metron-border bg-metron-surface p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[12px] text-gray-200 truncate">{deal.name}</span>
                <span className="font-mono text-[10px] text-metron-amber">{deal.status}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-metron-bg overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-metron-amber/70 to-metron-amber"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-600">{deal.owner}</span>
                <span className="font-mono text-[10px] text-gray-600">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentActivity() {
  const { activity } = useCommandCenter();
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-600">
        <Activity size={11} />
        Agent Activity
      </div>
      <div className="bg-metron-surface/60 border border-metron-border rounded-lg p-4 font-mono text-[12px] leading-relaxed">
        {activity.map((evt) => (
          <div key={evt.id} className="flex items-start gap-2">
            <span className="text-gray-600 shrink-0">[{evt.ts}]</span>
            <span className="shrink-0 text-gray-600">[</span>
            <span className={`shrink-0 ${classColor(evt.agentClass)}`}>
              {evt.agent}
              <span className="text-gray-600"> - Class {evt.agentClass}</span>
            </span>
            <span className="shrink-0 text-gray-600">]:</span>
            <span className="text-gray-400">{evt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidationProgress() {
  const { tollGates, agents } = useCommandCenter();
  const sealed = tollGates.filter((g) => g.isSealed).length;
  const total = tollGates.length;
  const pct = total > 0 ? Math.round((sealed / total) * 100) : 0;

  // Class 1 validation owners
  const validationAgents = agents.filter(
    (a) => a.class === 1 && tollGates.some((g) => g.owner === a.name),
  );

  const GATE_STATUS_COLOR: Record<string, string> = {
    'Not Started': 'text-metron-crimson',
    'In Progress': 'text-metron-amber',
    Drafting: 'text-metron-amber',
    Sealed: 'text-green-400',
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Validation Progress
          </span>
          <span
            className={`font-mono text-[10px] font-semibold ${
              sealed === total ? 'text-green-400' : 'text-metron-crimson'
            }`}
          >
            {sealed} of {total} Sealed
          </span>
        </div>

        <div className="rounded-lg border border-metron-border bg-metron-surface p-4">
          <div className="h-2 w-full rounded-full bg-metron-bg overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                sealed === total
                  ? 'bg-gradient-to-r from-green-500/70 to-green-400'
                  : 'bg-gradient-to-r from-metron-crimson/60 to-metron-amber'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-gray-600">{pct}% complete</span>
            <span className="font-mono text-[10px] text-gray-600">Critical Path</span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Class 1 Validation Assignments
        </div>
        <ul className="space-y-2">
          {validationAgents.map((agent) => {
            const task = tollGates.find((g) => g.owner === agent.name);
            if (!task) return null;
            return (
              <li
                key={agent.id}
                className="rounded-lg border border-metron-border bg-metron-surface p-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[12px] font-semibold ${classColor(1)}`}>
                    {agent.name}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${GATE_STATUS_COLOR[task.status] ?? 'text-gray-500'}`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-gray-600">{task.id}</div>
                <div className="mt-0.5 text-[11px] text-gray-400 truncate">{task.name}</div>
                {!task.isSealed && (
                  <div className="mt-1.5 text-[10px] text-gray-600 italic">
                    Blocker: {task.blocker}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const RISK_SEVERITY: Record<string, { dot: string; border: string; text: string }> = {
  high: { dot: 'bg-metron-crimson', border: 'border-metron-crimson/40', text: 'text-metron-crimson' },
  medium: { dot: 'bg-metron-amber', border: 'border-metron-amber/40', text: 'text-metron-amber' },
  low: { dot: 'bg-gray-500', border: 'border-gray-600/40', text: 'text-gray-400' },
};

function RiskRadar() {
  const { riskRadar } = useCommandCenter();
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-600">
        <ShieldCheck size={11} />
        Risk Radar
      </div>
      <ul className="space-y-2">
        {riskRadar.map((risk) => {
          const sev = RISK_SEVERITY[risk.severity] ?? RISK_SEVERITY.low;
          return (
            <li
              key={risk.id}
              className={`rounded-lg border ${sev.border} bg-metron-surface p-3`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${sev.dot} ${risk.severity === 'high' ? 'shadow-[0_0_6px_currentColor]' : ''}`} />
                <span className={`font-mono text-[11px] font-semibold ${sev.text}`}>
                  {risk.label}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 leading-snug">{risk.detail}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SystemStatus() {
  const { tollGates } = useCommandCenter();
  const sealed = tollGates.filter((g) => g.isSealed).length;

  const stats = [
    { label: 'System Version', value: 'AOC-001 v3.0' },
    { label: 'Data Silos', value: '4 Active' },
    { label: 'Agent Classes', value: '5 Active' },
    { label: 'Active Toll Gates', value: `${tollGates.length} (${sealed} Sealed)` },
  ];

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-600">
        <Cpu size={11} />
        System Status
      </div>
      <div className="rounded-lg border border-metron-border bg-metron-surface p-4 space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-gray-500">{stat.label}</span>
            <span className="font-mono text-[12px] font-semibold text-gray-200">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-metron-border bg-metron-surface p-4">
        <div className="font-mono text-[10px] text-gray-600 mb-2 uppercase tracking-widest">
          Silo Map
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-metron-cyan" />
            <span className="font-mono text-[11px] text-metron-cyan">CANON</span>
            <span className="font-mono text-[10px] text-gray-600 ml-auto">Sealed · RO</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="font-mono text-[11px] text-blue-400">WORKSPACE</span>
            <span className="font-mono text-[10px] text-gray-600 ml-auto">AI Drafts · RW</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-metron-amber" />
            <span className="font-mono text-[11px] text-metron-amber">MARKET_VALIDATION</span>
            <span className="font-mono text-[10px] text-gray-600 ml-auto">Class 2 · RW</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-metron-violet" />
            <span className="font-mono text-[11px] text-metron-violet">EXTERNAL_SANDBOX</span>
            <span className="font-mono text-[10px] text-gray-600 ml-auto">Class 3/4 · RO</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function RightRail() {
  const { activeDeal, closeDeal, activeView, guestView } = useCommandCenter();

  const renderContext = () => {
    if (activeDeal) return <DealContext />;
    if (guestView) return <RagList />;
    if (activeView === 'architecture') return <SystemStatus />;
    if (activeView === 'tollgates')
      return (
        <>
          <ValidationProgress />
          <RiskRadar />
        </>
      );
    if (activeView === 'aidc' || activeView === 'aiapps' || activeView === 'simsp') {
      return <EcosystemHealth view={activeView} />;
    }
    if (activeView === 'vault') return <AgentActivity />;
    return <RagList />;
  };

  return (
    <aside className="w-[380px] shrink-0 border-l border-metron-border bg-metron-bg flex flex-col">
      <Header onClear={activeDeal ? closeDeal : undefined} />
      <div className="flex-1 overflow-y-auto scrollbar-thin">{renderContext()}</div>
    </aside>
  );
}
