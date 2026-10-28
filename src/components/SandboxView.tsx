import { FileText, Lock, ShieldAlert, Eye } from 'lucide-react';
import { useCommandCenter } from '@/state/CommandCenterContext';

export default function SandboxView() {
  const { vault } = useCommandCenter();
  const sandboxDocs = vault.filter((d) => d.rag === 'EXTERNAL_SANDBOX');

  return (
    <div className="px-6 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-wide text-white">
            EXTERNAL_SANDBOX
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">Class 4 Guest · Read-only access</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-metron-crimson/10 border border-metron-crimson/40">
          <ShieldAlert size={13} className="text-metron-crimson" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-metron-crimson">
            CLASS 4 GUEST
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-metron-violet/30 bg-metron-violet/5 p-4 flex items-start gap-3">
        <Lock size={15} className="text-metron-violet mt-0.5 shrink-0" />
        <p className="text-[13px] text-gray-400 leading-relaxed">
          You are viewing the Metron Command Center as a Class 4 Guest. Access is
          restricted to the EXTERNAL_SANDBOX silo. All other data classes
          (CANON, WORKSPACE, MARKET_VALIDATION) are physically hidden from this view.
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Shared Documents
        </div>
        <div className="grid grid-cols-1 gap-3">
          {sandboxDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-metron-surface border border-metron-border rounded-lg p-4 flex items-center justify-between hover:border-metron-violet/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-md bg-metron-bg border border-metron-border flex items-center justify-center">
                  <FileText size={18} className="text-metron-violet" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[13px] text-gray-200 truncate">
                    {doc.name}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600 mt-0.5">
                    {doc.rag} · Class {doc.ragClass}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-metron-violet/40 text-metron-violet font-mono text-[10px] font-semibold tracking-wider">
                  <Eye size={11} />
                  READ ONLY
                </span>
              </div>
            </div>
          ))}
          {sandboxDocs.length === 0 && (
            <div className="bg-metron-surface border border-metron-border rounded-lg p-8 text-center">
              <p className="font-mono text-[13px] text-gray-500">No sandbox documents available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
