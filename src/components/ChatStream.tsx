import { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  ArrowUpCircle,
  Clock,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import {
  useCommandCenter,
  classColor,
  makeMessage,
  type ThreadMessage,
} from '@/state/CommandCenterContext';

const CLASS_BORDER: Record<number, string> = {
  0: 'border-metron-green/40',
  1: 'border-metron-cyan/40',
  2: 'border-metron-amber/40',
};

const CLASS_DOT: Record<number, string> = {
  0: 'bg-metron-green',
  1: 'bg-metron-cyan',
  2: 'bg-metron-amber',
};

function SenderTag({ msg }: { msg: ThreadMessage }) {
  const isUser = msg.class === 0;
  return (
    <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${CLASS_DOT[msg.class]}`} />
      <span className={`font-mono text-[11px] font-semibold tracking-wide ${classColor(msg.class)}`}>
        {msg.sender}
      </span>
      <span className="font-mono text-[10px] text-gray-600">· Class {msg.class}</span>
    </div>
  );
}

function DraftCard({ msg, onSeal }: { msg: ThreadMessage; onSeal: () => void }) {
  const isSealed = msg.draftRag === 'canon';
  return (
    <div
      className={`border rounded-lg p-3 mt-1 ${
        isSealed
          ? 'border-metron-cyan/50 bg-metron-cyan/5'
          : 'border-blue-400/50 bg-blue-400/5'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <FileText size={13} className={isSealed ? 'text-metron-cyan' : 'text-blue-400'} />
          <span
            className={`font-mono text-[11px] font-semibold tracking-wide ${
              isSealed ? 'text-metron-cyan' : 'text-blue-400'
            }`}
          >
            {msg.draftTitle ?? 'Draft'}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border ${
            isSealed
              ? 'border-metron-cyan/40 text-metron-cyan bg-metron-cyan/10'
              : 'border-blue-400/40 text-blue-400 bg-blue-400/10'
          }`}
        >
          {isSealed ? (
            <>
              <CheckCircle2 size={9} />
              SEALED: CANON
            </>
          ) : (
            <>
              <Lock size={9} />
              DRAFT: WORKSPACE
            </>
          )}
        </span>
      </div>
      <p className="text-[13px] text-gray-300 leading-relaxed">{msg.text}</p>
      {!isSealed && (
        <button
          onClick={onSeal}
          className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-metron-cyan/50 text-metron-cyan text-[11px] font-semibold hover:bg-metron-cyan/10 transition-colors"
        >
          <CheckCircle2 size={13} />
          Approve & Seal to CANON
        </button>
      )}
      {isSealed && (
        <div className="mt-2 text-[10px] text-gray-600 font-mono">
          Document locked. Hash generated. Moved to CANON.
        </div>
      )}
    </div>
  );
}

function AbstentionCard({ onEscalate }: { onEscalate: () => void }) {
  return (
    <div className="border border-metron-crimson/60 bg-metron-crimson/5 rounded-lg p-3 mt-1">
      <div className="flex items-center gap-2 mb-1.5">
        <ShieldAlert size={13} className="text-metron-crimson" />
        <span className="font-mono text-[11px] font-semibold tracking-wide text-metron-crimson">
          ACCESS DENIED: CLASS 1 DATA REQUIRED
        </span>
      </div>
      <button
        onClick={onEscalate}
        className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-metron-cyan/50 text-metron-cyan text-[11px] font-semibold hover:bg-metron-cyan/10 transition-colors"
      >
        <ArrowUpCircle size={13} />
        Escalate to ARCH
      </button>
    </div>
  );
}

function MessageBubble({ msg, onEscalate, onSeal }: { msg: ThreadMessage; onEscalate: () => void; onSeal: (id: string) => void }) {
  const isUser = msg.class === 0;
  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      <SenderTag msg={msg} />
      <div
        className={`max-w-[80%] bg-metron-surface border rounded-lg px-4 py-3 ${CLASS_BORDER[msg.class]}`}
      >
        {msg.type === 'text' && (
          <p className="text-[14px] text-gray-200 leading-relaxed whitespace-pre-wrap">
            {msg.text}
          </p>
        )}
        {msg.type === 'draft' && (
          <>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-1">
              {msg.sender} shared a draft:
            </p>
            <DraftCard msg={msg} onSeal={() => onSeal(msg.id)} />
          </>
        )}
        {msg.type === 'abstention' && <AbstentionCard onEscalate={onEscalate} />}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-metron-amber" />
        <span className="font-mono text-[11px] font-semibold tracking-wide text-metron-amber">
          MAYA
        </span>
        <span className="font-mono text-[10px] text-gray-600">· Class 2</span>
      </div>
      <div className="bg-metron-surface border border-metron-amber/30 rounded-lg px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-metron-amber/70 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const TIMING_TRIGGER = 'what is the timing bracket?';

export default function ChatStream() {
  const {
    activeDeal,
    activeThread,
    isTyping,
    appendThread,
    setTyping,
    closeDeal,
    setTechCanonUnlocked,
    setActiveAgent,
    sealDraft,
  } = useCommandCenter();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeThread, isTyping]);

  if (!activeDeal) return null;

  const handleEscalate = () => {
    setActiveAgent('arch');
    setTechCanonUnlocked(true);
    setTyping(true);
    window.setTimeout(() => {
      appendThread(
        makeMessage(
          'ARCH',
          1,
          'ARCH has joined the thread. The timing bracket is 50ms. Do not promise sub-millisecond.',
        ),
      );
      setTyping(false);
    }, 1400);
  };

  const handleAskTiming = () => {
    appendThread(makeMessage('AMIR', 0, 'What is the timing bracket for this?'));
    setTyping(true);
    window.setTimeout(() => {
      appendThread(
        makeMessage('MAYA', 2, 'I have to abstain. I do not have Class 1 access to CANON.'),
      );
      appendThread(
        makeMessage('MAYA', 2, '', 'abstention'),
      );
      setTyping(false);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="shrink-0 border-b border-metron-border px-6 py-3 flex items-center justify-between bg-metron-bg/90 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={closeDeal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-metron-surface transition-colors text-[12px] font-medium"
          >
            <ArrowLeft size={14} />
            Back to Triage
          </button>
          <span className="text-gray-600">/</span>
          <h2 className="font-mono text-[15px] font-semibold text-white truncate">
            {activeDeal.title}
          </h2>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${classColor(
              activeDeal.class,
            )} border-current/30`}
          >
            CLASS {activeDeal.class}
          </span>
        </div>
        <button
          onClick={handleAskTiming}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-metron-border text-gray-400 hover:text-metron-amber hover:border-metron-amber/40 transition-colors text-[12px] font-medium"
        >
          <Clock size={13} />
          Ask about timing
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-6 flex flex-col gap-5">
        {activeThread.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onEscalate={handleEscalate} onSeal={sealDraft} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

export { TIMING_TRIGGER };
