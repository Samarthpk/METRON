import { Search, Bell, Shield, ShieldAlert } from 'lucide-react';
import { useCommandCenter } from '@/state/CommandCenterContext';

export default function TopBar() {
  const { guestView } = useCommandCenter();

  return (
    <header className="h-[52px] shrink-0 border-b border-metron-border bg-metron-bg/80 backdrop-blur flex items-center px-5 gap-4">
      {/* Left */}
      <div className="font-mono text-[12px] tracking-widest text-gray-600">
        METRON <span className="text-gray-700">//</span> EVIDENCE OS
      </div>

      {/* Center pill */}
      <div className="flex-1 flex justify-center">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            guestView
              ? 'bg-metron-crimson/10 border-metron-crimson/40'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor] ${
              guestView ? 'bg-metron-crimson' : 'bg-metron-amber'
            }`}
          />
          <span
            className={`font-mono text-[11px] font-medium tracking-wider ${
              guestView ? 'text-metron-crimson' : 'text-metron-amber'
            }`}
          >
            {guestView ? 'CLASS 4 GUEST · SANDBOX ONLY' : 'MODE B ACTIVE · NEUTRAL REFEREE'}
          </span>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3">
        {guestView ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-metron-crimson/10 border border-metron-crimson/40">
            <ShieldAlert size={12} className="text-metron-crimson" />
            <span className="font-mono text-[10px] font-semibold tracking-wider text-metron-crimson">
              CLASS 4 GUEST
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/30">
            <Shield size={12} className="text-green-400" />
            <span className="font-mono text-[10px] font-semibold tracking-wider text-green-400">
              CLASS 0 ACCESS
            </span>
          </div>
        )}

        <button className="h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-metron-surface transition-colors">
          <Search size={15} />
        </button>

        <button className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-metron-surface transition-colors">
          <Bell size={15} />
          {!guestView && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-metron-crimson" />
          )}
        </button>

        <div
          className={`h-8 w-8 rounded-full border flex items-center justify-center font-mono text-[11px] font-semibold ${
            guestView
              ? 'bg-gradient-to-br from-metron-crimson/40 to-metron-violet/20 border-metron-crimson/40 text-metron-crimson'
              : 'bg-gradient-to-br from-metron-cyan/40 to-metron-violet/30 border-metron-border text-gray-200'
          }`}
        >
          {guestView ? 'G' : 'OP'}
        </div>
      </div>
    </header>
  );
}
