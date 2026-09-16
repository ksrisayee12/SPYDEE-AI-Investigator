import React, { useState } from 'react';
import {
  Compass,
  FileCheck2,
  Send,
  CheckCircle,
  Clock,
  ShieldAlert,
  Download,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_LEADS } from '../../data/mockCaseData';
import { InvestigationLead } from '../../types';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

export const LeadsActionsView: React.FC = () => {
  const { showAlert } = useTerminalAlert();
  const [leads, setLeads] = useState<InvestigationLead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<InvestigationLead>(MOCK_LEADS[0]);
  const [draftGenerated, setDraftGenerated] = useState<boolean>(false);

  const handleUpdateStatus = (id: string, newStatus: 'AWAITING_REVIEW' | 'APPROVED' | 'DISMISSED' | 'IN_PROGRESS') => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    showAlert(`Action item LEAD-${selectedLead.number} marked as [${newStatus}].`, 'SUCCESS');
  };

  const handleGenerateWarrant = () => {
    setDraftGenerated(true);
    showAlert(`Statutory Section 91 CrPC subpoena notice compiled for ${selectedLead.title}.`, 'INFO');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // INTELLIGENCE // LEADS & ACTIONS
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            INVESTIGATIVE ACTION QUEUE
          </div>
          <div className="text-[10px] text-amber-500/80">
            SYSTEM-RECOMMENDED TACTICAL STEPS RANKED BY NETWORK ENTROPY REDUCTION
          </div>
        </div>

        <button
          onClick={() => {
            showAlert('Classified Investigation Tasking Docket (PDF/Form-91) compiled and queued for secure terminal print spooler.', 'SUCCESS');
          }}
          className="px-3 py-1.5 bg-black border border-amber-500 text-amber-300 font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-[0_0_8px_rgba(245,158,11,0.3)]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>PRINT TASKING DOCKET</span>
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT: LEADS QUEUE + ACTION DISPATCH DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEADS LIST (6 cols) */}
        <div className="lg:col-span-6 space-y-2">
          {leads.map((lead) => {
            const isSelected = selectedLead.id === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => {
                  setSelectedLead(lead);
                  setDraftGenerated(false);
                }}
                className={`p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#0a0f0a] border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 text-xs">LEAD-{lead.number}</span>
                    <StatusBadge status={lead.expectedGain} size="sm" />
                  </div>
                  <StatusBadge status={lead.status} size="sm" />
                </div>

                <div className="font-bold text-amber-200 text-xs mb-1">
                  {lead.title}
                </div>

                <p className="text-[11px] text-amber-500/80 line-clamp-2 mb-2">
                  {lead.why}
                </p>

                <div className="flex justify-between items-center text-[10px] text-amber-500/60 border-t border-amber-500/20 pt-1">
                  <span>PROVENANCE: {lead.provenanceEvidenceId}</span>
                  <span className="text-amber-400 font-bold">GAIN: {lead.expectedGain}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* LEAD DISPATCH DRAWER (6 cols) */}
        <div className="lg:col-span-6">
          {selectedLead && (
            <TerminalPanel
              title={`ACTION SPECIFICATION // LEAD-${selectedLead.number}`}
              subtitle={selectedLead.status}
            >
              <div className="space-y-3 text-xs">
                {/* Header */}
                <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300 text-sm">{selectedLead.title}</span>
                    <StatusBadge status={selectedLead.expectedGain} size="sm" />
                  </div>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    {selectedLead.why}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="p-2.5 bg-black/40 border border-amber-500/20 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">PROVENANCE DOSSIER:</span>
                    <span className="font-bold text-amber-300">{selectedLead.provenanceEvidenceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">EVIDENCE REQUIRED:</span>
                    <span className="font-bold text-amber-400 text-right max-w-[220px]">{selectedLead.evidenceRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">STATUTORY JURISDICTION:</span>
                    <span className="text-amber-300">SEC 91 CrPC // SPECIAL TASK FORCE</span>
                  </div>
                </div>

                {/* Statutory Form Draft Box */}
                {draftGenerated && (
                  <div className="p-2.5 bg-black/80 border border-amber-500/40 space-y-2 text-[10px]">
                    <div className="flex justify-between text-amber-400 font-bold border-b border-amber-500/30 pb-1">
                      <span>FORM 91 SUMMONS / LEGAL DEMAND NOTICE</span>
                      <span>BHARAT POLICE STF</span>
                    </div>
                    <div className="font-mono text-amber-300/90 leading-relaxed bg-black/60 p-2 border border-amber-500/20">
                      TO: NODAL COMPLIANCE OFFICER (TELECOM / BANK / RTO)<br />
                      RE: IMMEDIATE SUBPOENA UNDER SEC 91 CrPC.<br />
                      CASE REF: MH-26189-042 // SPECIAL TASK FORCE INVESTIGATION DIVISION.<br />
                      ACTION: {selectedLead.title}<br />
                      REQUIRED: {selectedLead.evidenceRequired}<br />
                      STATUS: FORMAL EVIDENTIARY PRODUCTION REQUISITION.
                    </div>
                  </div>
                )}

                {/* Tactical Dispatch Actions */}
                <div className="space-y-2 pt-2 border-t border-amber-500/30">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleGenerateWarrant}
                      className="flex-1 py-1.5 bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_8px_#f59e0b]"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>DRAFT STATUTORY NOTICE</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedLead.id, 'IN_PROGRESS')}
                      className="px-3 py-1.5 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-950/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>DISPATCH ORDER</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedLead.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-800/40 text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>APPROVE LEAD</span>
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
