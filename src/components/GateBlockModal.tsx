import { ShieldAlert, X, AlertTriangle, Zap } from 'lucide-react';
import { useCommandCenter } from '@/state/CommandCenterContext';

export default function GateBlockModal() {
  const { gateBlocked, cancelGateBlock, overrideGate } = useCommandCenter();
  if (!gateBlocked) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-metron-bg/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-lg rounded-xl border border-metron-crimson/50 bg-metron-surface shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-metron-crimson/30 bg-metron-crimson/10">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-metron-crimson" />
            <span className="font-mono text-[13px] font-bold tracking-widest text-metron-crimson">
              GATE BLOCKED
            </span>
          </div>
          <button
            onClick={cancelGateBlock}
            className="h-7 w-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-metron-bg transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[14px] text-gray-200 leading-relaxed">
            Amir, we cannot approve{' '}
            <span className="font-semibold text-white">{gateBlocked.dealTitle}</span>.
            {' '}
            <span className="font-mono text-metron-crimson">{gateBlocked.gateId}</span>{' '}
            ({gateBlocked.gateName}) is not sealed.
          </p>
          <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">
            {gateBlocked.reason}
          </p>

          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-metron-amber/30 bg-metron-amber/5 p-3">
            <AlertTriangle size={14} className="text-metron-amber mt-0.5 shrink-0" />
            <p className="text-[12px] text-gray-400 leading-relaxed">
              Overriding the gate will approve the deal without technical
              validation. This action is permanently logged and creates legal
              exposure.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-metron-border flex items-center justify-end gap-2.5">
          <button
            onClick={cancelGateBlock}
            className="px-4 py-2 rounded-md text-[12px] font-semibold text-gray-400 hover:text-gray-200 hover:bg-metron-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={overrideGate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-semibold bg-metron-crimson/15 border border-metron-crimson/50 text-metron-crimson hover:bg-metron-crimson/25 transition-colors"
          >
            <Zap size={13} />
            Override Gate
          </button>
        </div>
      </div>
    </div>
  );
}
