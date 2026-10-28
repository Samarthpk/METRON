import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AgentStatus = 'active' | 'idle' | 'working' | 'alert';
export type ViewId = 'triage' | 'aidc' | 'aiapps' | 'simsp' | 'vault' | 'sandbox' | 'tollgates' | 'architecture';

export interface Agent {
  id: string;
  name: string;
  class: 0 | 1 | 2 | 3;
  role: string;
  mandate: string;
  status: AgentStatus;
  color: string;
}

export interface Rag {
  id: string;
  name: string;
  class: 0 | 1 | 2 | 3;
  status: 'secure' | 'sealed' | 'active' | 'locked';
  docs: number;
  color: 'cyan' | 'blue' | 'amber' | 'violet';
}

export type GateItemStatus = 'Needs Approval' | 'Needs Review' | 'Needs Revision';

export interface GateItem {
  id: string;
  title: string;
  agent: string;
  class: 1 | 2;
  status: GateItemStatus;
  type: string;
  summary: string;
  evidence: string;
}

export interface ChatMessage {
  id: string;
  author: 'operator' | 'system' | string;
  text: string;
  ts: number;
}

export interface ActivityEvent {
  id: string;
  ts: string;
  agent: string;
  agentClass: number;
  text: string;
}

export type ThreadMessageType = 'text' | 'draft' | 'abstention';

export interface ThreadMessage {
  id: string;
  sender: string; // MACEY, MAYA, ARCH, AMIR
  class: 0 | 1 | 2;
  text: string;
  type: ThreadMessageType;
  draftTitle?: string;
  draftRag?: 'workspace' | 'canon';
}

export interface PipelineDeal {
  id: string;
  name: string;
  status: string;
  hypothesis: string;
  owner: string;
}

export interface Pipelines {
  aidc: PipelineDeal[];
  aiapps: PipelineDeal[];
  simsp: PipelineDeal[];
}

export interface VaultDoc {
  id: string;
  name: string;
  rag: string;
  ragClass: 0 | 1 | 2 | 3;
  status: 'Secure' | 'Active' | 'Shared' | 'Quarantined';
}

export type TollGateStatus = 'Not Started' | 'In Progress' | 'Drafting' | 'Sealed';

export interface TollGate {
  id: string;
  name: string;
  owner: string;
  status: TollGateStatus;
  blocker: string;
  isSealed: boolean;
}

export interface RiskItem {
  id: string;
  label: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface GateBlockContext {
  dealId: string;
  dealTitle: string;
  gateId: string;
  gateName: string;
  reason: string;
}

export interface CommandCenterState {
  activeView: ViewId;
  activeAgent: string;
  agents: Agent[];
  rags: Rag[];
  gateQueue: GateItem[];
  activeReviewItem: string | null;
  chatHistory: ChatMessage[];
  activity: ActivityEvent[];
  activeDeal: GateItem | null;
  activeThread: ThreadMessage[];
  isTyping: boolean;
  techCanonUnlocked: boolean;
  pipelines: Pipelines;
  vault: VaultDoc[];
  guestView: boolean;
  tollGates: TollGate[];
  gateBlocked: GateBlockContext | null;
  riskRadar: RiskItem[];
}

export interface CommandCenterContextValue extends CommandCenterState {
  setActiveView: (view: ViewId) => void;
  setActiveAgent: (id: string) => void;
  setActiveReviewItem: (id: string | null) => void;
  approveGateItem: (id: string) => void;
  sendChatMessage: (text: string) => void;
  openDeal: (deal: GateItem) => void;
  closeDeal: () => void;
  appendThread: (msg: ThreadMessage) => void;
  setTyping: (v: boolean) => void;
  setTechCanonUnlocked: (v: boolean) => void;
  sealDraft: (msgId: string) => void;
  setGuestView: (v: boolean) => void;
  attemptApprove: (deal: GateItem) => void;
  cancelGateBlock: () => void;
  overrideGate: () => void;
}

const initialState: CommandCenterState = {
  activeView: 'triage',
  activeAgent: 'macey',
  agents: [
    { id: 'macey', name: 'MACEY', class: 0, role: 'Harness', mandate: 'Routes intent, triages tickets, manages context.', status: 'active', color: 'text-green-400' },
    { id: 'arch', name: 'ARCH', class: 1, role: 'Systems Architect', mandate: 'Validates invariants, generates Sanitized Tech Summaries.', status: 'idle', color: 'text-cyan-400' },
    { id: 'time', name: 'TIME', class: 1, role: 'Time & Identity', mandate: 'Validates PTP/GNSS, enforces uncertainty brackets.', status: 'idle', color: 'text-cyan-400' },
    { id: 'chain', name: 'CHAIN', class: 1, role: 'Model & Chain', mandate: 'HSM integration, Merkle sealing, key splits.', status: 'idle', color: 'text-cyan-400' },
    { id: 'nemo', name: 'NEMO', class: 1, role: 'NetOps', mandate: 'FCAPS telemetry, zero-host-software discipline.', status: 'idle', color: 'text-cyan-400' },
    { id: 'maya', name: 'MAYA', class: 2, role: 'Deals Synthesis', mandate: 'Synthesizes transcripts, drafts proposals, manages pipeline.', status: 'working', color: 'text-amber-400' },
    { id: 'scout', name: 'SCOUT', class: 2, role: 'AI DC Market', mandate: 'Scans hyperscalers, tracks NOC leads, monitors neoclouds.', status: 'idle', color: 'text-amber-400' },
    { id: 'vera', name: 'VERA', class: 2, role: 'Risk & Compliance', mandate: 'Tracks strategic risks, quarantines Class 4 uploads.', status: 'alert', color: 'text-amber-400' },
    { id: 'elias', name: 'ELIAS', class: 2, role: 'Competitive Intel', mandate: 'Analyzes competitors (Arista, Clockwork) for gaps.', status: 'idle', color: 'text-amber-400' },
    { id: 'aria', name: 'ARIA', class: 2, role: 'AI App Ecosystem', mandate: 'Evaluates AI app SDKs, tests integrations.', status: 'idle', color: 'text-amber-400' },
    { id: 'miles', name: 'MILES', class: 3, role: 'External Researcher', mandate: 'Scans public web, writes sanitized reports to Sandbox.', status: 'idle', color: 'text-violet-400' },
  ],
  rags: [
    { id: 'canon', name: 'CANON', class: 0, status: 'sealed', docs: 46, color: 'cyan' },
    { id: 'workspace', name: 'WORKSPACE', class: 0, status: 'active', docs: 8, color: 'blue' },
    { id: 'market_validation', name: 'MARKET_VALIDATION', class: 2, status: 'active', docs: 12, color: 'amber' },
    { id: 'external_sandbox', name: 'EXTERNAL_SANDBOX', class: 3, status: 'locked', docs: 2, color: 'violet' },
  ],
  gateQueue: [
    {
      id: 'h-a3',
      title: 'Delta MRO Follow-up Script',
      agent: 'MAYA',
      class: 2,
      status: 'Needs Approval',
      type: 'DRAFT',
      summary: 'Drafted follow-up script for the Delta MRO deal addressing FOD accountability.',
      evidence: 'delta_call_notes.txt',
    },
    {
      id: 'h-b1',
      title: 'Canoga Spin-off Term Sheet',
      agent: 'ARCH',
      class: 1,
      status: 'Needs Review',
      type: 'LEGAL',
      summary: 'Final review of Section 4: IP Assignment and Non-Compete before sending to counsel.',
      evidence: 'LEG-001_v3.docx',
    },
    {
      id: 'h-c2',
      title: 'CoreWeave Mode B Proposal',
      agent: 'MAYA',
      class: 2,
      status: 'Needs Revision',
      type: 'PROPOSAL',
      summary: 'Amir requested the addition of the camera session manifest from Blueprint 4.0.',
      evidence: 'blueprint_v4.pdf',
    },
  ],
  activeReviewItem: null,
  chatHistory: [],
  activity: [
    { id: 'a1', ts: '14:05', agent: 'SCOUT', agentClass: 2, text: 'Scanned CoreWeave expansion. Found 2 NOC leads.' },
    { id: 'a2', ts: '14:12', agent: 'MAYA', agentClass: 2, text: 'Synthesized Delta MRO call notes.' },
    { id: 'a3', ts: '14:18', agent: 'ARCH', agentClass: 1, text: 'Reviewed Option A Abstentions.' },
  ],
  activeDeal: null,
  activeThread: [],
  isTyping: false,
  techCanonUnlocked: false,
  pipelines: {
    aidc: [
      { id: 'cw-1', name: 'CoreWeave', status: 'Negotiation', hypothesis: 'Needs Mode B for multi-tenant isolation.', owner: 'SCOUT' },
      { id: 'lambda-1', name: 'Lambda Labs', status: 'Prospect', hypothesis: 'Concerned about GPU noisy neighbors.', owner: 'MAYA' },
      { id: 'crusoe-1', name: 'Crusoe Energy', status: 'Prospect', hypothesis: 'Requires evidence for carbon credits.', owner: 'SCOUT' },
    ],
    aiapps: [
      { id: 'hf-1', name: 'HuggingFace', status: 'SDK Test', hypothesis: 'API overlap allows deep telemetry sealing.', owner: 'ARIA' },
      { id: 'synth-1', name: 'Synthesia', status: 'Prospect', hypothesis: 'Needs model version proof for enterprise.', owner: 'MAYA' },
    ],
    simsp: [
      { id: 'wwt-1', name: 'World Wide Technology', status: 'MOU Review', hypothesis: 'Will certify for Hospital/MRO overlays.', owner: 'MAYA' },
      { id: 'insight-1', name: 'Insight Enterprises', status: 'Prospect', hypothesis: 'Has strong healthcare vertical reach.', owner: 'SCOUT' },
    ],
  },
  vault: [
    { id: 'v1', name: 'Blueprint_4.0.md', rag: 'CANON', ragClass: 0, status: 'Secure' },
    { id: 'v2', name: 'Delta_MRO_Call.mp4', rag: 'MARKET_VALIDATION', ragClass: 2, status: 'Active' },
    { id: 'v3', name: 'COM-001_Whitepaper.pdf', rag: 'EXTERNAL_SANDBOX', ragClass: 3, status: 'Shared' },
    { id: 'v4', name: 'CoreWeave_NDA.pdf', rag: 'MARKET_VALIDATION', ragClass: 2, status: 'Quarantined' },
    { id: 'v5', name: 'Delta_MRO_Script_v2.docx', rag: 'WORKSPACE', ragClass: 0, status: 'Active' },
  ],
  guestView: false,
  tollGates: [
    { id: 'val-001', name: 'VAL-001 Layer 1 Timing', owner: 'TIME', status: 'In Progress', blocker: 'Waiting on Samarth', isSealed: false },
    { id: 'val-002', name: 'Evidence Protocol Document', owner: 'CHAIN', status: 'Drafting', blocker: 'Requires ARCH review', isSealed: false },
    { id: 'val-003', name: 'Attorney Opinion (FRE 902)', owner: 'MACEY', status: 'Not Started', blocker: 'Needs VAL-001 first', isSealed: false },
    { id: 'val-004', name: 'Adversarial Moot', owner: 'NEMO', status: 'Not Started', blocker: 'Needs Attorney Opinion', isSealed: false },
    { id: 'val-005', name: 'eIDAS Trust Integration', owner: 'ARCH', status: 'Not Started', blocker: 'Needs Moot complete', isSealed: false },
  ],
  gateBlocked: null,
  riskRadar: [
    { id: 'r1', label: 'Risk 1 (Timing)', detail: 'VAL-001 not sealed. 1-rack validation incomplete.', severity: 'high' },
    { id: 'r2', label: 'Risk 2 (Legal)', detail: 'Attorney opinion pending FRE 902 evidence protocol.', severity: 'medium' },
    { id: 'r3', label: 'Risk 3 (Competitive)', detail: 'Clockwork signaling similar Mode B offering.', severity: 'low' },
  ],
};

const CommandCenterContext = createContext<CommandCenterContextValue | null>(null);

const CLASS_COLOR: Record<number, string> = {
  1: 'text-metron-cyan',
  2: 'text-metron-amber',
};

export function classColor(cls: number): string {
  return CLASS_COLOR[cls] ?? 'text-gray-400';
}

let msgSeq = 0;
function nextMsgId(prefix = 'm'): string {
  msgSeq += 1;
  return `${prefix}-${Date.now()}-${msgSeq}`;
}

// Simulated opening thread per deal. Keyed by gate item id.
const SEED_THREADS: Record<string, ThreadMessage[]> = {
  'h-a3': [
    {
      id: 'seed-a3-1',
      sender: 'MAYA',
      class: 2,
      type: 'text',
      text: 'Amir, I\'ve synthesized the Delta MRO call. They are concerned about tool custody and FOD. Here is the drafted follow-up script.',
    },
    {
      id: 'seed-a3-2',
      sender: 'MAYA',
      class: 2,
      type: 'draft',
      text: 'Hi team, following up on FOD accountability. We propose a dual-custody log for all loaned tooling with sign-off at each shift change, plus a weekly FOD walk-down documented with timestamped photos...',
      draftTitle: 'Delta MRO Script',
      draftRag: 'workspace',
    },
  ],
  'h-b1': [
    {
      id: 'seed-b1-1',
      sender: 'ARCH',
      class: 1,
      type: 'text',
      text: 'Amir, the Canoga spin-off term sheet is ready for your final review. Section 4 (IP Assignment and Non-Compete) is the last open item before counsel.',
    },
  ],
  'h-c2': [
    {
      id: 'seed-c2-1',
      sender: 'MAYA',
      class: 2,
      type: 'text',
      text: 'Amir, you asked for the camera session manifest from Blueprint 4.0 to be added to the CoreWeave Mode B proposal. I do not have that manifest in my Class 2 scope — flagging for your input.',
    },
  ],
};

export function getSeedThread(dealId: string): ThreadMessage[] {
  return SEED_THREADS[dealId] ?? [];
}

export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CommandCenterState>(initialState);

  const value = useMemo<CommandCenterContextValue>(
    () => ({
      ...state,
      setActiveView: (view) => setState((s) => ({ ...s, activeView: view })),
      setActiveAgent: (id) => setState((s) => ({ ...s, activeAgent: id })),
      setActiveReviewItem: (id) => setState((s) => ({ ...s, activeReviewItem: id })),
      approveGateItem: (id) =>
        setState((s) => ({
          ...s,
          gateQueue: s.gateQueue.filter((item) => item.id !== id),
          activeReviewItem: s.activeReviewItem === id ? null : s.activeReviewItem,
        })),
      sendChatMessage: (text) =>
        setState((s) => ({
          ...s,
          chatHistory: [
            ...s.chatHistory,
            { id: nextMsgId(), author: 'operator', text, ts: Date.now() },
          ],
        })),
      openDeal: (deal) =>
        setState((s) => ({
          ...s,
          activeDeal: deal,
          activeReviewItem: deal.id,
          activeThread: getSeedThread(deal.id),
          isTyping: false,
          techCanonUnlocked: false,
        })),
      closeDeal: () =>
        setState((s) => ({
          ...s,
          activeDeal: null,
          activeThread: [],
          isTyping: false,
          techCanonUnlocked: false,
          activeReviewItem: null,
        })),
      appendThread: (msg) => setState((s) => ({ ...s, activeThread: [...s.activeThread, msg] })),
      setTyping: (v) => setState((s) => ({ ...s, isTyping: v })),
      setTechCanonUnlocked: (v) => setState((s) => ({ ...s, techCanonUnlocked: v })),
      sealDraft: (msgId) =>
        setState((s) => ({
          ...s,
          activeThread: s.activeThread.map((msg) =>
            msg.id === msgId && msg.type === 'draft'
              ? { ...msg, draftRag: 'canon' }
              : msg,
          ),
        })),
      setGuestView: (v) =>
        setState((s) => ({
          ...s,
          guestView: v,
          activeView: v ? 'sandbox' : 'triage',
          activeDeal: v ? null : s.activeDeal,
          activeAgent: v ? 'macey' : s.activeAgent,
        })),
      attemptApprove: (deal) =>
        setState((s) => {
          const firstUnsealed = s.tollGates.find((g) => !g.isSealed);
          if (firstUnsealed) {
            return {
              ...s,
              gateBlocked: {
                dealId: deal.id,
                dealTitle: deal.title,
                gateId: firstUnsealed.id,
                gateName: firstUnsealed.name,
                reason: `${firstUnsealed.name} is not sealed. ${firstUnsealed.owner} has not completed the validation.`,
              },
            };
          }
          return {
            ...s,
            gateQueue: s.gateQueue.filter((item) => item.id !== deal.id),
            activeReviewItem: s.activeReviewItem === deal.id ? null : s.activeReviewItem,
          };
        }),
      cancelGateBlock: () => setState((s) => ({ ...s, gateBlocked: null })),
      overrideGate: () =>
        setState((s) => {
          if (!s.gateBlocked) return s;
          const { dealId, gateName } = s.gateBlocked;
          const overridden = s.gateQueue.find((item) => item.id === dealId);
          return {
            ...s,
            gateBlocked: null,
            gateQueue: s.gateQueue.filter((item) => item.id !== dealId),
            activeReviewItem: s.activeReviewItem === dealId ? null : s.activeReviewItem,
            chatHistory: [
              ...s.chatHistory,
              {
                id: nextMsgId(),
                author: 'system',
                text: `WARNING: Gate Override Logged. ${overridden?.title ?? 'Deal'} approved without ${gateName}.`,
                ts: Date.now(),
              },
            ],
            riskRadar: [
              ...s.riskRadar,
              {
                id: `risk-override-${Date.now()}`,
                label: 'Risk 5 (Gate Override)',
                detail: `${overridden?.title ?? 'Deal'} approved without validation. Legal exposure.`,
                severity: 'high',
              },
            ],
          };
        }),
    }),
    [state],
  );

  return <CommandCenterContext.Provider value={value}>{children}</CommandCenterContext.Provider>;
}

export function useCommandCenter(): CommandCenterContextValue {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error('useCommandCenter must be used within CommandCenterProvider');
  return ctx;
}

export function makeMessage(
  sender: string,
  cls: 0 | 1 | 2,
  text: string,
  type: ThreadMessageType = 'text',
  extra?: Partial<ThreadMessage>,
): ThreadMessage {
  return { id: nextMsgId('t'), sender, class: cls, text, type, ...extra };
}
