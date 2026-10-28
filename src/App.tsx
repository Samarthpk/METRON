import { CommandCenterProvider, useCommandCenter } from '@/state/CommandCenterContext';
import TopBar from '@/components/TopBar';
import UniversalComposer from '@/components/UniversalComposer';
import RightRail from '@/components/RightRail';
import LeftSidebar from '@/components/LeftSidebar';
import TriageBoard from '@/components/TriageBoard';
import ChatStream from '@/components/ChatStream';
import PipelineView from '@/components/PipelineView';
import VaultView from '@/components/VaultView';
import SandboxView from '@/components/SandboxView';
import TollGatesView from '@/components/TollGatesView';
import ArchitectureView from '@/components/ArchitectureView';
import GateBlockModal from '@/components/GateBlockModal';

const CLASS_LABEL: Record<number, string> = {
  0: 'Class 0 · Harness',
  1: 'Class 1 · Tech',
  2: 'Class 2 · Ops',
  3: 'Class 3 · Sandbox',
};

const VIEW_LABEL: Record<string, string> = {
  triage: 'Mission Control',
  aidc: 'AI DC Pipeline',
  aiapps: 'AI Apps Pipeline',
  simsp: 'SI/MSP Channel',
  vault: 'The Vault',
  sandbox: 'External Sandbox',
  tollgates: 'Critical Path',
  architecture: 'System Architecture',
};

function CommandCenterShell() {
  const { activeView, activeAgent, agents, activeDeal, guestView } = useCommandCenter();
  const agent = agents.find((a) => a.id === activeAgent);

  // Guest mode forces the sandbox view and hides the deal chat.
  const effectiveView = guestView ? 'sandbox' : activeView;
  const showChat = !guestView && activeDeal;

  const renderView = () => {
    switch (effectiveView) {
      case 'triage':
        return <TriageBoard />;
      case 'aidc':
      case 'aiapps':
      case 'simsp':
        return <PipelineView view={effectiveView} />;
      case 'vault':
        return <VaultView />;
      case 'sandbox':
        return <SandboxView />;
      case 'tollgates':
        return <TollGatesView />;
      case 'architecture':
        return <ArchitectureView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-metron-bg text-gray-200">
      <LeftSidebar />

      {/* Center + Right rail wrapper so TopBar spans both */}
      <div className="flex-1 flex min-w-0">
        {/* Center pane */}
        <main className="flex-1 flex flex-col relative min-w-0">
          <TopBar />

          <GateBlockModal />

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {showChat ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <ChatStream />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-thin relative">
                {/* Center header */}
                <div className="sticky top-0 z-10 bg-metron-bg/90 backdrop-blur border-b border-metron-border px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tracking-widest text-gray-500">
                      VIEW
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="font-mono text-[14px] font-semibold tracking-wide text-gray-200">
                      {VIEW_LABEL[effectiveView] ?? effectiveView}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span
                      className={`font-mono text-[12px] tracking-wide ${
                        agent?.color ?? 'text-gray-400'
                      }`}
                    >
                      {agent?.name ?? '—'}
                    </span>
                    <span className="font-mono text-[11px] text-gray-500">
                      {agent ? CLASS_LABEL[agent.class] : ''}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-600">
                    {agent?.role ?? ''}
                  </span>
                </div>

                {renderView()}
              </div>
            )}
          </div>

          {/* Floating composer — hidden on architecture docs view */}
          {effectiveView !== 'architecture' && (
            <div className="shrink-0">
              <UniversalComposer />
            </div>
          )}
        </main>

        <RightRail />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CommandCenterProvider>
      <CommandCenterShell />
    </CommandCenterProvider>
  );
}
