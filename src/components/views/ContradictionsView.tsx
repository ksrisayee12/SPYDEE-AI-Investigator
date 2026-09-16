import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Clock,
  MapPin,
  FileText,
  ShieldAlert,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_CONTRADICTIONS } from '../../data/mockCaseData';
import { Contradiction } from '../../types';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface ContradictionsViewProps {
  onNavigateToLeads?: () => void;
}

export const ContradictionsView: React.FC<ContradictionsViewProps> = ({ onNavigateToLeads }) => {
  const { showAlert } = useTerminalAlert();
  const [contradictions, setContradictions] = useState<Contradiction[]>(MOCK_CONTRADICTIONS);
  const [selectedContradiction, setSelectedContradiction] = useState<Contradiction>(MOCK_CONTRADICTIONS[0]);

  const handleUpdateStatus = (id: string, newStatus: 'REQUIRES REVIEW' | 'RESOLVED' | 'UNRESOLVED') => {
    setContradictions(contradictions.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedContradiction.id === id) {
      setSelectedContradiction({ ...selectedContradiction, status: newStatus });
    }
    showAlert(`Contradiction ${id} marked as ${newStatus}. Integrity ledger synchronized.`, 'SUCCESS');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // INTELLIGENCE // CONTRADICTIONS
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider flex items-center gap-2">
            <span>EVIDENTIARY CONTRADICTION DETECTOR</span>
            <span className="text-xs px-2 py-0.5 bg-red-950/80 border border-red-500 text-red-400 font-bold animate-pulse">
              2 CLASHES FLAGGED
            </span>
          </div>
          <div className="text-[10px] text-amber-500/80">
            TIME-SPACE IMPOSSIBILITIES // TELECOM VS PHYSICAL ALIBI INCOMPATIBILITIES
          </div>
        </div>

        <button
          onClick={onNavigateToLeads}
          className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>GENERATE RESOLUTION ACTIONS</span>
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT: CONTRADICTION LIST (LEFT) + DISCREPANCY MATRIX (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          {contradictions.map((c) => {
            const isSelected = selectedContradiction.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContradiction(c)}
                className={`p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#0a0f0a] border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300 text-xs">{c.id}</span>
                  <StatusBadge status={c.conflictType} size="sm" />
                </div>
                <div className="font-bold text-amber-200 text-xs mb-1">{c.title}</div>
                <p className="text-[11px] text-amber-500/80 line-clamp-2 mb-2">{c.resolutionNotes}</p>
                <div className="flex justify-between items-center text-[10px] text-amber-500/60 border-t border-amber-500/20 pt-1">
                  <span>SUBJECT: {c.entityLabel}</span>
                  <span className="text-amber-400 font-bold">{c.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED MATRIX (7 cols) */}
        <div className="lg:col-span-7">
          {selectedContradiction && (
            <TerminalPanel
              title={`EVIDENCE CLASH // ${selectedContradiction.id}`}
              subtitle={selectedContradiction.conflictType}
            >
              <div className="space-y-3 text-xs">
                {/* Title and subject */}
                <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm text-amber-300">
                      {selectedContradiction.title}
                    </div>
                    <StatusBadge status={selectedContradiction.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-amber-400 font-bold">
                    SUBJECT ENTITY: {selectedContradiction.entityLabel} ({selectedContradiction.entityId})
                  </div>
                </div>

                {/* SIDE-BY-SIDE CONFLICTING EVIDENCE A VS B */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* SOURCE A */}
                  <div className="p-2.5 bg-black/80 border border-amber-500/40 space-y-1">
                    <div className="text-[10px] text-amber-500/70 font-bold uppercase flex justify-between">
                      <span>CLAIM A // {selectedContradiction.sourceA.docId}</span>
                      <span>{selectedContradiction.sourceA.time}</span>
                    </div>
                    <div className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{selectedContradiction.sourceA.location}</span>
                    </div>
                    <p className="text-amber-400/90 text-[11px] leading-snug pt-1">
                      {selectedContradiction.sourceA.details}
                    </p>
                  </div>

                  {/* SOURCE B */}
                  <div className="p-2.5 bg-black/80 border border-red-500/40 space-y-1">
                    <div className="text-[10px] text-red-400/80 font-bold uppercase flex justify-between">
                      <span>CLAIM B // {selectedContradiction.sourceB.docId}</span>
                      <span>{selectedContradiction.sourceB.time}</span>
                    </div>
                    <div className="font-bold text-red-300 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{selectedContradiction.sourceB.location}</span>
                    </div>
                    <p className="text-red-300/90 text-[11px] leading-snug pt-1">
                      {selectedContradiction.sourceB.details}
                    </p>
                  </div>
                </div>

                {/* Forensic Discrepancy Assessment */}
                <div className="p-2.5 bg-black/50 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>FORENSIC DISCREPANCY ANALYSIS:</span>
                  </div>
                  <p className="text-amber-400/90 text-[11px] leading-relaxed">
                    {selectedContradiction.resolutionNotes}
                  </p>
                </div>

                {/* Resolution Action */}
                <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    ▶ INVESTIGATIVE RESOLUTION ACTIONS:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedContradiction.id, 'RESOLVED')}
                      className="px-3 py-1 bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                    >
                      MARK RESOLVED
                    </button>
                    <button
                      onClick={() =>
                        showAlert(
                          `Cross-examination summons and forensic re-examination dispatched for ${selectedContradiction.id} (${selectedContradiction.entityLabel}).`,
                          'WARNING'
                        )
                      }
                      className="px-3 py-1 bg-black border border-amber-500/50 text-amber-300 font-bold text-xs hover:bg-amber-950/30"
                    >
                      REQUEST CROSS-EXAMINATION
                    </button>
                  </div>
                </div>
              </div>
            </TerminalPanel>
          )}
        </div>
      </div>
    </div>
  );
};
