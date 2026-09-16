import React, { useState } from 'react';
import {
  ShieldCheck,
  Hash,
  Lock,
  CheckCircle2,
  RefreshCw,
  Search,
  FileCheck,
  Terminal,
  Clock,
  UserCheck
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface AuditRecord {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  station: string;
  hash: string;
  status: 'VERIFIED' | 'TAMPER_FREE';
}

export const SystemAuditView: React.FC = () => {
  const { showAlert } = useTerminalAlert();
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([
    {
      id: 'AUD-901',
      timestamp: '16 SEP 2026 07:44:02',
      operator: 'INSP. J. RAO (E-027)',
      action: 'INGEST_EVIDENCE',
      target: 'CDR_TOWER42_SUPP.csv',
      station: 'STF-PUNE-TERM04',
      hash: 'sha256:e8f1b290ac9471d4...',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-900',
      timestamp: '16 SEP 2026 07:38:15',
      operator: 'INSP. J. RAO (E-027)',
      action: 'CORRELATION_RUN',
      target: 'CASE MH-26189-042',
      station: 'STF-PUNE-TERM04',
      hash: 'sha256:7c91a03f44e189d2...',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-899',
      timestamp: '16 SEP 2026 07:12:44',
      operator: 'ANALYST V. SHARMA (A-104)',
      action: 'HYPOTHESIS_CREATE',
      target: 'H-01 (RAVI-SURESH)',
      station: 'STF-PUNE-TERM02',
      hash: 'sha256:b1836014cd76fe39...',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-898',
      timestamp: '15 SEP 2026 23:45:10',
      operator: 'SYSTEM_DAEMON',
      action: 'INTELLIGENCE_ALERT',
      target: 'LOCATION_CLASH_ATM_VS_TOWER',
      station: 'LOCAL_KERNEL',
      hash: 'sha256:f52b7194ea086b91...',
      status: 'TAMPER_FREE'
    },
    {
      id: 'AUD-897',
      timestamp: '15 SEP 2026 21:10:04',
      operator: 'SUB-INSP. K. PATIL (E-031)',
      action: 'ENTITY_REGISTER',
      target: 'VEHICLE V-12 (MH-12-DE-4419)',
      station: 'STF-PUNE-TERM01',
      hash: 'sha256:29c8914ab7710c55...',
      status: 'VERIFIED'
    }
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<string>('ALL 84 NODES & DOSSIERS IMMUTABLE');

  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIntegrityStatus('100% MERKLE TREE CRYPTOGRAPHIC INTEGRITY CONFIRMED');
      showAlert(
        'Integrity audit completed. Cryptographic chain of custody conforms to Section 65B Indian Evidence Act.',
        'SUCCESS'
      );
    }, 1200);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // TOOLS // SYSTEM AUDIT
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider flex items-center gap-2">
            <span>CHAIN-OF-CUSTODY & CRYPTOGRAPHIC AUDIT LOG</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-950/60 border border-emerald-500 text-emerald-400 font-bold">
              PASSED
            </span>
          </div>
          <div className="text-[10px] text-amber-500/80">
            SEC 65B INDIAN EVIDENCE ACT COMPLIANCE // SHA-256 IMMUTABILITY LEDGER
          </div>
        </div>

        <button
          onClick={handleVerifyIntegrity}
          disabled={isVerifying}
          className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{isVerifying ? 'VERIFYING...' : 'VERIFY MERKLE INTEGRITY'}</span>
        </button>
      </div>

      {/* METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 bg-[#0a0f0a] border border-amber-500/30">
          <div className="text-[10px] text-amber-500/70 uppercase">INTEGRITY STATUS</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">{integrityStatus}</div>
        </div>
        <div className="p-3 bg-[#0a0f0a] border border-amber-500/30">
          <div className="text-[10px] text-amber-500/70 uppercase">AUTHENTICATED OPERATOR</div>
          <div className="text-sm font-bold text-amber-300 mt-1">INSP. J. RAO // BADGE E-027</div>
        </div>
        <div className="p-3 bg-[#0a0f0a] border border-amber-500/30">
          <div className="text-[10px] text-amber-500/70 uppercase">TERMINAL HARDWARE ID</div>
          <div className="text-sm font-bold text-amber-300 mt-1">BEL-SECURE-STF-PUNE-04</div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-[#0b100b] border border-amber-500/35 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-amber-500/40 bg-[#0e160e] text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">
              <th className="p-2.5">AUDIT ID</th>
              <th className="p-2.5">TIMESTAMP</th>
              <th className="p-2.5">OPERATOR</th>
              <th className="p-2.5">ACTION</th>
              <th className="p-2.5">TARGET RECORD</th>
              <th className="p-2.5 hidden sm:table-cell">STATION</th>
              <th className="p-2.5 hidden md:table-cell">SHA-256 HASH</th>
              <th className="p-2.5 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-500/20 font-mono">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-amber-950/20 transition-colors text-amber-400">
                <td className="p-2.5 font-bold text-amber-300">{log.id}</td>
                <td className="p-2.5 text-amber-500/80">{log.timestamp}</td>
                <td className="p-2.5 text-amber-300">{log.operator}</td>
                <td className="p-2.5">
                  <span className="px-1.5 py-0.5 text-[9px] bg-black border border-amber-500/30 text-amber-300">
                    {log.action}
                  </span>
                </td>
                <td className="p-2.5 font-medium text-amber-200 truncate max-w-[180px]">{log.target}</td>
                <td className="p-2.5 hidden sm:table-cell text-amber-500/70">{log.station}</td>
                <td className="p-2.5 hidden md:table-cell text-amber-500/60 text-[10px] font-mono select-all">
                  {log.hash}
                </td>
                <td className="p-2.5 text-right">
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-950/60 border border-emerald-500/50 text-emerald-400">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
