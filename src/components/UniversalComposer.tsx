import { Plus, Paperclip, Camera, Mic, ArrowUp } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  useCommandCenter,
  makeMessage,
} from '@/state/CommandCenterContext';

interface ComposerButtonProps {
  icon: typeof Plus;
  onClick: () => void;
  className?: string;
  'aria-label': string;
}

function ComposerButton({ icon: Icon, onClick, className = '', 'aria-label': label }: ComposerButtonProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-metron-cyan hover:bg-metron-cyan/10 transition-colors ${className}`}
    >
      <Icon size={17} />
    </button>
  );
}

const TIMING_PHRASE = 'what is the timing bracket';

// Canned agent responses keyed by sender class.
function cannedResponse(dealAgent: string, dealClass: 1 | 2): { text: string; sender: string; cls: 1 | 2 } {
  if (dealClass === 2) {
    return {
      sender: dealAgent,
      cls: 2,
      text: 'Understood, updating the draft now. I will keep it within my Class 2 scope and flag anything that needs ARCH.',
    };
  }
  return {
    sender: dealAgent,
    cls: 1,
    text: 'Acknowledged. Pulling the relevant section from CANON and will surface a revised draft for your sign-off.',
  };
}

export default function UniversalComposer() {
  const {
    activeAgent,
    agents,
    sendChatMessage,
    activeDeal,
    appendThread,
    setTyping,
  } = useCommandCenter();
  const agent = agents.find((a) => a.id === activeAgent);
  const [pulse, setPulse] = useState(false);
  const [draft, setDraft] = useState('');
  const pulseTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const triggerPulse = () => {
    setPulse(false);
    requestAnimationFrame(() => setPulse(true));
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setPulse(false), 900);
  };

  const handleClick = (label: string) => {
    console.log(`[Composer] ${label} clicked`);
    triggerPulse();
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) {
      triggerPulse();
      return;
    }
    setDraft('');
    triggerPulse();
    inputRef.current?.focus();

    if (activeDeal) {
      // Append as AMIR (Class 0)
      appendThread(makeMessage('AMIR', 0, text));

      const lower = text.toLowerCase();
      if (lower.includes(TIMING_PHRASE)) {
        // Abstention flow handled by ChatStream's ask-timing mechanic.
        setTyping(true);
        window.setTimeout(() => {
          appendThread(
            makeMessage(activeDeal.agent, activeDeal.class, 'I have to abstain. I do not have Class 1 access to CANON.'),
          );
          appendThread(makeMessage(activeDeal.agent, activeDeal.class, '', 'abstention'));
          setTyping(false);
        }, 1400);
        return;
      }

      // Standard canned response from the owning agent.
      setTyping(true);
      const { sender, cls, text: reply } = cannedResponse(activeDeal.agent, activeDeal.class);
      window.setTimeout(() => {
        appendThread(makeMessage(sender, cls, reply));
        setTyping(false);
      }, 1500);
      return;
    }

    // Not in a deal — record in global chat history.
    sendChatMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = activeDeal
    ? `> Reply in ${activeDeal.title} or @mention agent...`
    : `> Command ${agent?.name ?? 'AGENT'} or @mention agent...`;

  return (
    <div className="px-5 pb-5 pt-2">
      <div
        className={`flex items-center gap-1 bg-metron-surface border rounded-xl shadow-2xl px-2 py-1.5 transition-colors ${
          pulse ? 'pulse-border border-metron-cyan' : 'border-metron-border'
        }`}
      >
        <ComposerButton icon={Plus} onClick={() => handleClick('add')} aria-label="Add" />
        <ComposerButton icon={Paperclip} onClick={() => handleClick('attach')} aria-label="Attach" />
        <ComposerButton icon={Camera} onClick={() => handleClick('camera')} aria-label="Camera" />

        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-2 text-[14px] text-white placeholder:text-gray-500 font-mono"
        />

        <ComposerButton icon={Mic} onClick={() => handleClick('mic')} aria-label="Microphone" />
        <button
          aria-label="Send"
          onClick={handleSend}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-metron-cyan text-metron-bg hover:bg-metron-cyan/90 shadow-[0_0_14px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
        >
          <ArrowUp size={17} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
