import { FileText, Film, FileArchive, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useCommandCenter, classColor, type VaultDoc } from '@/state/CommandCenterContext';

const STATUS_META: Record<VaultDoc['status'], { color: string; icon: typeof ShieldCheck }> = {
  Secure: { color: 'text-green-400', icon: ShieldCheck },
  Active: { color: 'text-metron-amber', icon: FileText },
  Shared: { color: 'text-metron-violet', icon: FileArchive },
  Quarantined: { color: 'text-metron-crimson', icon: AlertTriangle },
};

function fileIcon(name: string): typeof FileText {
  if (name.endsWith('.mp4')) return Film;
  if (name.endsWith('.pdf')) return FileArchive;
  return FileText;
}

function VaultRow({ doc }: { doc: VaultDoc }) {
  const FileIcon = fileIcon(doc.name);
  const StatusIcon = STATUS_META[doc.status].icon;
  return (
    <tr className="border-b border-metron-border/60 hover:bg-metron-surface/60 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <FileIcon size={15} className="text-gray-500 shrink-0" />
          <span className="font-mono text-[13px] text-gray-200">{doc.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`font-mono text-[12px] font-semibold ${classColor(doc.ragClass)}`}>
          {doc.rag}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-[11px] text-gray-400">Class {doc.ragClass}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${STATUS_META[doc.status].color}`}>
          <StatusIcon size={12} />
          {doc.status}
        </span>
      </td>
    </tr>
  );
}

export default function VaultView() {
  const { vault } = useCommandCenter();

  return (
    <div className="px-6 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-wide text-white">THE VAULT</h1>
          <p className="mt-1 text-[13px] text-gray-500">Sovereign Data Silos</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-metron-surface border border-metron-border">
          <Lock size={12} className="text-gray-500" />
          <span className="font-mono text-[11px] text-gray-400">
            {vault.length} documents
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-metron-border bg-metron-surface/40 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-metron-border bg-metron-surface">
              <th className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Document Name
              </th>
              <th className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                RAG
              </th>
              <th className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Class
              </th>
              <th className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {vault.map((doc) => (
              <VaultRow key={doc.id} doc={doc} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
