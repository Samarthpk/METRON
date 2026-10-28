import {
  LayoutGrid,
  Target,
  Bot,
  Handshake,
  Archive,
  Eye,
  EyeOff,
  ShieldAlert,
  Network,
  type LucideIcon,
} from 'lucide-react';
import { useCommandCenter, type ViewId } from '@/state/CommandCenterContext';

interface NavItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  guestHidden?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'triage', label: 'Mission Control', icon: LayoutGrid },
  { id: 'tollgates', label: 'Critical Path (Toll Gates)', icon: ShieldAlert },
  { id: 'aidc', label: 'AI DC Pipeline', icon: Target, guestHidden: true },
  { id: 'aiapps', label: 'AI Apps Pipeline', icon: Bot, guestHidden: true },
  { id: 'simsp', label: 'SI/MSP Channel', icon: Handshake, guestHidden: true },
  { id: 'vault', label: 'The Vault', icon: Archive },
];

const SYSTEM_ITEMS: NavItem[] = [
  { id: 'architecture', label: 'System Architecture', icon: Network, guestHidden: true },
];

const STATUS_DOT: Record<string, string> = {
  active: 'bg-green-400',
  working: 'bg-amber-400',
  alert: 'bg-red-400',
  idle: 'bg-gray-500',
};

const CLASS_GROUPS: { class: 0 | 1 | 2 | 3; label: string; headerColor: string }[] = [
  { class: 0, label: 'CLASS 0: HARNESS', headerColor: 'text-gray-500' },
  { class: 1, label: 'CLASS 1: TECH (INTERNAL IP)', headerColor: 'text-metron-cyan' },
  { class: 2, label: 'CLASS 2: OPS (BUSINESS)', headerColor: 'text-metron-amber' },
  { class: 3, label: 'CLASS 3: SANDBOX (PUBLIC)', headerColor: 'text-metron-violet' },
];

export default function LeftSidebar() {
  const {
    agents,
    activeAgent,
    setActiveAgent,
    activeView,
    setActiveView,
    guestView,
    setGuestView,
  } = useCommandCenter();

  const visibleNav = NAV_ITEMS.filter((item) => !(guestView && item.guestHidden));
  const visibleSystem = SYSTEM_ITEMS.filter((item) => !(guestView && item.guestHidden));
  const visibleAgents = agents.filter((a) => {
    if (!guestView) return true;
    return a.class === 0 || a.class === 3;
  });

  return (
    <aside className="w-[260px] shrink-0 border-r border-metron-border bg-metron-bg flex flex-col">
      {/* Logo */}
      <div className="h-[52px] shrink-0 flex items-center px-4 border-b border-metron-border">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-metron-cyan/30 to-metron-cyan/5 border border-metron-cyan/40 flex items-center justify-center">
            <div className="h-2 w-2 rounded-sm bg-metron-cyan shadow-[0_0_8px_#00E5FF]" />
          </div>
          <div className="font-mono text-[13px] font-semibold tracking-wider text-metron-cyan leading-none">
            METRON
          </div>
          <div className="font-mono text-[11px] text-gray-500 leading-none tracking-widest">
            // COMMAND
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-3 border-b border-metron-border">
        <div className="px-2 mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Navigation
        </div>
        <ul className="space-y-0.5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                    isActive
                      ? 'bg-metron-cyan/10 text-metron-cyan border border-metron-cyan/20'
                      : 'text-gray-400 hover:bg-metron-surface hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-metron-cyan' : 'text-gray-500'} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {visibleSystem.length > 0 && (
          <>
            <div className="px-2 mt-4 mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
              System
            </div>
            <ul className="space-y-0.5">
              {visibleSystem.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                        isActive
                          ? 'bg-metron-cyan/10 text-metron-cyan border border-metron-cyan/20'
                          : 'text-gray-400 hover:bg-metron-surface hover:text-gray-200 border border-transparent'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-metron-cyan' : 'text-gray-500'} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Agent Roster */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        <div className="px-2 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Agent Roster
          </span>
          <span className="text-[10px] font-mono text-gray-600">{visibleAgents.length}</span>
        </div>

        {CLASS_GROUPS.map((group) => {
          const groupAgents = visibleAgents.filter((a) => a.class === group.class);
          if (groupAgents.length === 0) return null;
          return (
            <div key={group.class} className="mb-3">
              <div className={`px-2 mb-1 text-xs font-medium tracking-wider ${group.headerColor}`}>
                {group.label}
              </div>
              <ul className="space-y-1">
                {groupAgents.map((agent) => {
                  const isActive = agent.id === activeAgent;
                  return (
                    <li key={agent.id}>
                      <button
                        onClick={() => setActiveAgent(agent.id)}
                        className={`w-full group flex items-start gap-2.5 px-2.5 py-2 rounded-md text-left transition-all border ${
                          isActive
                            ? 'bg-metron-surface border-metron-border'
                            : 'border-transparent hover:bg-metron-surface/60'
                        }`}
                      >
                        <span className={`mt-1 h-1.5 w-1.5 rounded-full ${agent.color.replace('text-', 'bg-')} shadow-sm`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono text-sm font-semibold tracking-wide ${
                                isActive ? agent.color : 'text-gray-200'
                              }`}
                            >
                              {agent.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 truncate">{agent.role}</div>
                          <div className="text-xs text-gray-500 leading-snug mt-1">
                            {agent.mandate}
                          </div>
                        </div>
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full ${STATUS_DOT[agent.status]} ${
                            agent.status === 'active' || agent.status === 'working'
                              ? 'shadow-[0_0_6px_currentColor]'
                              : ''
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Guest View toggle */}
      <div className="shrink-0 border-t border-metron-border px-3 py-2.5 space-y-2">
        <button
          onClick={() => setGuestView(!guestView)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-[11px] font-mono font-bold tracking-wider transition-all border-2 ${
            guestView
              ? 'bg-metron-crimson/15 border-metron-crimson/60 text-metron-crimson hover:bg-metron-crimson/25 shadow-[0_0_12px_rgba(220,38,38,0.15)]'
              : 'bg-metron-violet/10 border-metron-violet/60 text-metron-violet hover:bg-metron-violet/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
          }`}
        >
          {guestView ? <EyeOff size={13} /> : <Eye size={13} />}
          {guestView ? 'EXIT GUEST VIEW' : 'GUEST VIEW (CLASS 4)'}
        </button>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-gray-600">SYSTEM</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#00E676]" />
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
