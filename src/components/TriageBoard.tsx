import { FileText, ShieldCheck, CheckCircle2, Eye, Paperclip, Activity, Lock } from 'lucide-react';
import {
  useCommandCenter,
  classColor,
  type GateItem,
} from '@/state/CommandCenterContext';

const TYPE_ICON: Record<string, typeof FileText> = {
  DRAFT: FileText,
  LEGAL: ShieldCheck,
  PROPOSAL: FileText,
};

const CLASS_TAG: Record<number, string> = {
  1: 'CLASS 1: TECH',
  2: 'CLASS 2: MARKET',
};

function TriageCard({ item }: { item: GateItem }) {
  const { attemptApprove, openDeal } = useCommandCenter();
  const TypeIcon = TYPE_ICON[item.type] ?? FileText;

  const statusIsAmber =
    item.status === 'Needs Approval' || item.status === 'Needs Revision';

  return (
    <div
      className="bg-metron-surface border rounded-lg p-5 flex flex-col justify-between transition-colors border-metron-border hover:border-metron-cyan/30"
    >
      <div>
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TypeIcon size={12} className="text-gray-500" />
            <span className="font-mono text-[10px] tracking-widest text-gray-500">
              {item.type}
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded border ${classColor(
              item.class,
            )} border-current/30 bg-current/5`}
          >
            {item.class === 1 && <Lock size={9} className="opacity-80" />}
            {CLASS_TAG[item.class] ?? `CLASS ${item.class}`}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-semibold text-white leading-snug">
          {item.title}
        </h3>

        {/* Agent */}
        <p className="mt-1 text-sm text-gray-400">
          Drafted by{' '}
          <span className={`font-mono ${classColor(item.class)}`}>{item.agent}</span>
        </p>

        {/* Summary */}
        <p className="mt-2 text-sm text-gray-300 leading-relaxed">{item.summary}</p>

        {/* Evidence */}
        <div className="mt-3 flex items-center gap-1.5 text-gray-500">
          <Paperclip size={12} />
          <span className="font-mono text-[11px]">{item.evidence}</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 pt-4 border-t border-metron-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[11px] tracking-wide ${
              statusIsAmber ? 'text-metron-amber' : 'text-metron-cyan'
            }`}
          >
            Status: {item.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDeal(item)}
            className="px-3 py-1.5 rounded-md bg-metron-cyan text-metron-bg text-[12px] font-semibold hover:bg-metron-cyan/90 transition-colors flex items-center gap-1.5"
          >
            <Eye size={13} />
            Review
          </button>
          <button
            onClick={() => attemptApprove(item)}
            className="px-3 py-1.5 rounded-md border border-green-500/60 text-green-400 text-[12px] font-semibold hover:bg-green-500/10 transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 size={13} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TriageBoard() {
  const { gateQueue, activity } = useCommandCenter();
  const pending = gateQueue.length;

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
            NEEDS YOU TODAY
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Triage items requiring your Class 0 authorization.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-metron-amber/10 border border-metron-amber/30">
          <span className="h-1.5 w-1.5 rounded-full bg-metron-amber shadow-[0_0_6px_#FFB300]" />
          <span className="font-mono text-[12px] font-semibold tracking-wider text-metron-amber">
            {pending} Pending
          </span>
        </div>
      </div>

      {/* Gate queue grid */}
      <div className="mt-6 grid grid-cols-1 gap-4">
        {gateQueue.length === 0 ? (
          <div className="bg-metron-surface border border-metron-border rounded-lg p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={28} className="text-green-400" />
            <p className="mt-3 font-mono text-sm text-gray-300">Gate clear.</p>
            <p className="mt-1 text-[12px] text-gray-600">
              No items awaiting your authorization.
            </p>
          </div>
        ) : (
          gateQueue.map((item) => <TriageCard key={item.id} item={item} />)
        )}
      </div>

      {/* System pulse */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={13} className="text-gray-600" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-gray-500">
            SYSTEM PULSE
          </span>
        </div>
        <div className="bg-metron-surface/60 border border-metron-border rounded-lg p-4 font-mono text-[12px] leading-relaxed">
          {activity.map((evt, idx) => (
            <div key={evt.id} className="flex items-start gap-2">
              <span className="text-gray-600 shrink-0">[{evt.ts}]</span>
              <span className="shrink-0 text-gray-600">[</span>
              <span className={`shrink-0 ${classColor(evt.agentClass)}`}>
                {evt.agent}
                <span className="text-gray-600"> - Class {evt.agentClass}</span>
              </span>
              <span className="shrink-0 text-gray-600">]:</span>
              <span className="text-gray-400">{evt.text}</span>
              {idx < activity.length - 1 && <span className="hidden" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
