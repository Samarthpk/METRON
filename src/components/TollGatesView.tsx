import { ShieldAlert, Lock, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { useCommandCenter, classColor, type TollGate } from '@/state/CommandCenterContext';

const STATUS_INDICATOR: Record<string, { dot: string; ring: string }> = {
  'Not Started': { dot: 'bg-metron-crimson', ring: 'border-metron-crimson/40' },
  'In Progress': { dot: 'bg-metron-amber', ring: 'border-metron-amber/40' },
  Drafting: { dot: 'bg-metron-amber', ring: 'border-metron-amber/40' },
  Sealed: { dot: 'bg-green-400', ring: 'border-green-400/40' },
};

function GateRow({ gate, index, total }: { gate: TollGate; index: number; total: number }) {
  const ind = STATUS_INDICATOR[gate.status] ?? STATUS_INDICATOR['Not Started'];
  const isLast = index === total - 1;

  return (
    <div className="flex gap-4">
      {/* Timeline rail + node */}
      <div className="flex flex-col items-center">
        <div
          className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${ind.ring} bg-metron-bg`}
        >
          {gate.isSealed ? (
            <CheckCircle2 size={16} className="text-green-400" />
          ) : gate.status === 'Not Started' ? (
            <Circle size={14} className="text-metron-crimson/70" />
          ) : (
            <span className={`h-2.5 w-2.5 rounded-full ${ind.dot} shadow-[0_0_8px_currentColor]`} />
          )}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-metron-border mt-1" />}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-4 rounded-lg border p-4 transition-colors ${
          gate.isSealed
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-metron-border bg-metron-surface'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-600">{gate.id}</span>
              {gate.isSealed ? (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-green-500/40 text-green-400 bg-green-500/5">
                  SEALED
                </span>
              ) : (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-metron-crimson/40 text-metron-crimson bg-metron-crimson/5">
                  UNSEALED
                </span>
              )}
            </div>
            <h3 className="mt-1.5 text-[15px] font-semibold text-white leading-snug">
              {gate.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
              <span className="text-gray-500">
                Owner: <span className="font-mono text-metron-cyan">{gate.owner}</span>
              </span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">
                Status: <span className={gate.isSealed ? 'text-green-400' : 'text-metron-amber'}>{gate.status}</span>
              </span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">
                Blocker: <span className="text-gray-400">{gate.blocker}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TollGatesView() {
  const { tollGates } = useCommandCenter();
  const sealedCount = tollGates.filter((g) => g.isSealed).length;

  return (
    <div className="px-6 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
            CRITICAL PATH: TECHNICAL VALIDATION
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            We cannot sell what we have not proven.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${
            sealedCount === tollGates.length
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-metron-crimson/10 border-metron-crimson/30'
          }`}
        >
          <ShieldAlert size={14} className={sealedCount === tollGates.length ? 'text-green-400' : 'text-metron-crimson'} />
          <span
            className={`font-mono text-[12px] font-semibold tracking-wider ${
              sealedCount === tollGates.length ? 'text-green-400' : 'text-metron-crimson'
            }`}
          >
            {sealedCount} / {tollGates.length} SEALED
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-metron-amber/30 bg-metron-amber/5 p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-metron-amber mt-0.5 shrink-0" />
        <p className="text-[13px] text-gray-400 leading-relaxed">
          Each gate must be sealed in sequence before Metron can legally offer
          evidence-grade Mode B services. Approving deals before the chain is
          sealed creates legal exposure and will be logged as a gate override.
        </p>
      </div>

      <div className="mt-6">
        {tollGates.map((gate, idx) => (
          <GateRow key={gate.id} gate={gate} index={idx} total={tollGates.length} />
        ))}
      </div>
    </div>
  );
}
