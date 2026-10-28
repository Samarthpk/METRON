import { MessageSquare, Target, Lightbulb, UserCircle } from 'lucide-react';
import {
  useCommandCenter,
  classColor,
  type PipelineDeal,
  type ViewId,
} from '@/state/CommandCenterContext';

interface ViewMeta {
  title: string;
  subtitle: string;
}

const VIEW_META: Record<string, ViewMeta> = {
  aidc: { title: 'AI DC PIPELINE', subtitle: 'Target: Neoclouds & Hyperscalers' },
  aiapps: { title: 'AI APP ECOSYSTEM', subtitle: 'Target: SDK & Integration Partners' },
  simsp: { title: 'SI/MSP CHANNEL', subtitle: 'Target: System Integrators & MSPs' },
};

function PipelineCard({ deal }: { deal: PipelineDeal }) {
  const { setActiveAgent, agents } = useCommandCenter();
  const ownerAgent = agents.find((a) => a.name === deal.owner);

  const handleOpenThread = () => {
    if (ownerAgent) setActiveAgent(ownerAgent.id);
  };

  return (
    <div className="bg-metron-surface border border-metron-border rounded-lg p-5 flex flex-col gap-3 hover:border-metron-amber/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-md bg-metron-bg border border-metron-border flex items-center justify-center">
            <Target size={16} className="text-metron-amber" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white leading-tight">{deal.name}</h3>
            <div className="font-mono text-[10px] text-gray-600 mt-0.5">{deal.id}</div>
          </div>
        </div>
        <span className="shrink-0 font-mono text-[10px] font-semibold tracking-widest px-2 py-1 rounded border border-metron-amber/40 text-metron-amber bg-metron-amber/5">
          {deal.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-start gap-2">
        <Lightbulb size={13} className="text-gray-500 mt-0.5 shrink-0" />
        <p className="text-[13px] text-gray-300 leading-relaxed">{deal.hypothesis}</p>
      </div>

      <div className="pt-3 border-t border-metron-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UserCircle size={13} className="text-gray-500" />
          <span className="text-[11px] text-gray-500">Owner:</span>
          <span className={`font-mono text-[11px] font-semibold ${classColor(2)}`}>
            {deal.owner}
          </span>
        </div>
        <button
          onClick={handleOpenThread}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-metron-cyan/10 border border-metron-cyan/40 text-metron-cyan text-[12px] font-semibold hover:bg-metron-cyan/20 transition-colors"
        >
          <MessageSquare size={13} />
          Open Thread
        </button>
      </div>
    </div>
  );
}

interface PipelineViewProps {
  view: ViewId;
}

export default function PipelineView({ view }: PipelineViewProps) {
  const { pipelines } = useCommandCenter();
  const meta = VIEW_META[view] ?? { title: 'PIPELINE', subtitle: '' };
  const deals = pipelines[view as keyof typeof pipelines] ?? [];

  return (
    <div className="px-6 py-6">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-wide text-white">{meta.title}</h1>
        <p className="mt-1 text-[13px] text-gray-500">{meta.subtitle}</p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className="font-mono text-[11px] text-gray-600">
          {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
        </span>
        <span className="h-1 w-1 rounded-full bg-gray-700" />
        <span className="font-mono text-[11px] text-gray-600">Class 2 · Ops</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {deals.map((deal) => (
          <PipelineCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
