import React, { useState } from 'react';
import {
  HelpCircle,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { MOCK_INFORMATION_GAPS } from '../../data/mockCaseData';
import { InformationGap } from '../../types';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface InformationGapsViewProps {
  onNavigateToLeads?: () => void;
}

export const InformationGapsView: React.FC<InformationGapsViewProps> = ({ onNavigateToLeads }) => {
  const { showAlert } = useTerminalAlert();
  const [gaps, setGaps] = useState<InformationGap[]>(MOCK_INFORMATION_GAPS);
  const [selectedGap, setSelectedGap] = useState<InformationGap>(MOCK_INFORMATION_GAPS[0]);

  const handleUpdateStatus = (id: string, newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => {
    setGaps(gaps.map(g => g.id === id ? { ...g, status: newStatus } : g));
    if (selectedGap.id === id) {
      setSelectedGap({ ...selectedGap, status: newStatus });
    }
    showAlert(`Evidentiary gap ${id} updated to status [${newStatus}].`, 'SUCCESS');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // INTELLIGENCE // INFORMATION GAPS
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            CRITICAL EVIDENTIARY DEFICITS
          </div>
          <div className="text-[10px] text-amber-500/80">
            SYSTEM-IDENTIFIED BLIND SPOTS PREVENTING CERTAIN GRAPH RESOLUTION
          </div>
        </div>

        <button
          onClick={onNavigateToLeads}
          className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>VIEW EXECUTABLE LEADS</span>
        </button>
      </div>

      {/* TWO-COLUMN WORKSPACE: GAP LIST + GAP AUDIT DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* GAP LIST (6 cols) */}
        <div className="lg:col-span-6 space-y-2">
          {gaps.map((gap) => {
            const isSelected = selectedGap.id === gap.id;
            return (
              <div
                key={gap.id}
                onClick={() => setSelectedGap(gap)}
                className={`p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#0a0f0a] border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 text-xs">{gap.id}</span>
                    <span className="text-[10px] text-amber-500/60 uppercase">[{gap.entityOrSubject}]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={gap.informationGain} size="sm" />
                    <StatusBadge status={gap.status} size="sm" />
                  </div>
                </div>

                <div className="font-bold text-amber-200 text-xs mb-1">
                  {gap.title}
                </div>

                <p className="text-[11px] text-amber-500/80 line-clamp-2 mb-2">
                  {gap.actionRequired}
                </p>

                <div className="flex justify-between items-center text-[10px] text-amber-500/60 border-t border-amber-500/20 pt-1">
                  <span className="truncate max-w-[200px]">
                    CONNECTS: {gap.whyItMatters.clustersConnected} CLUSTERS, {gap.whyItMatters.entitiesConnected} NODES
                  </span>
                  <span className="text-amber-400 font-bold">CLICK TO AUDIT</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* GAP DETAILS (6 cols) */}
        <div className="lg:col-span-6">
          {selectedGap && (
            <TerminalPanel
              title={`GAP SPECIFICATION // ${selectedGap.id}`}
              subtitle={selectedGap.entityOrSubject}
            >
              <div className="space-y-3 text-xs">
                {/* Header info */}
                <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-bold text-amber-300">{selectedGap.title}</div>
                    <StatusBadge status={selectedGap.informationGain} size="sm" />
                  </div>
                  <div className="text-[11px] text-amber-400">
                    SUBJECT: <span className="font-bold text-amber-200">{selectedGap.entityOrSubject}</span>
                  </div>
                </div>

                {/* Graph Connectivity Impact */}
                <div className="p-2.5 bg-black/40 border border-amber-500/20 space-y-1 text-[11px]">
                  <div className="text-[10px] text-amber-500/70 font-bold uppercase">
                    ▶ GRAPH TOPOLOGY RESOLUTION IMPACT
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-1.5 bg-black border border-amber-500/20">
                      <div className="text-amber-300 font-bold text-sm">{selectedGap.whyItMatters.clustersConnected}</div>
                      <div className="text-[9px] text-amber-500/70 uppercase">CLUSTERS LINKED</div>
                    </div>
                    <div className="p-1.5 bg-black border border-amber-500/20">
                      <div className="text-amber-300 font-bold text-sm">{selectedGap.whyItMatters.entitiesConnected}</div>
                      <div className="text-[9px] text-amber-500/70 uppercase">ENTITIES RESOLVED</div>
                    </div>
                    <div className="p-1.5 bg-black border border-amber-500/20">
                      <div className="text-amber-300 font-bold text-sm">{selectedGap.whyItMatters.eventsConnected}</div>
                      <div className="text-[9px] text-amber-500/70 uppercase">EVENTS TIED</div>
                    </div>
                  </div>
                </div>

                {/* Recommended Evidence & Action Required */}
                <div className="p-2.5 bg-amber-950/25 border border-amber-500/35 space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    ▶ REQUIRED EVIDENTIARY DOSSIER
                  </div>
                  <div className="text-amber-300 font-bold text-[11px]">
                    {selectedGap.recommendedEvidence}
                  </div>
                  <p className="text-amber-200 text-[11px] leading-relaxed">
                    {selectedGap.actionRequired}
                  </p>
                </div>

                {/* Current Confidence */}
                <div className="p-2.5 bg-black/50 border border-amber-500/20">
                  <ConfidenceMeter confidence={selectedGap.currentConfidence} label="EVIDENTIARY CERTAINTY" />
                </div>

                {/* Status Toggle Buttons */}
                <div className="p-2.5 bg-black/60 border border-amber-500/20 space-y-1.5">
                  <div className="text-[10px] text-amber-500/70 font-bold uppercase">
                    UPDATE GAP STATUS:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedGap.id, 'INVESTIGATING')}
                      className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                        selectedGap.status === 'INVESTIGATING'
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-black border-amber-500/40 text-amber-400 hover:bg-amber-950/30'
                      }`}
                    >
                      INVESTIGATING
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedGap.id, 'RESOLVED')}
                      className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                        selectedGap.status === 'RESOLVED'
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-black border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30'
                      }`}
                    >
                      RESOLVED
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedGap.id, 'OPEN')}
                      className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                        selectedGap.status === 'OPEN'
                          ? 'bg-red-500 text-white border-red-400'
                          : 'bg-black border-red-500/40 text-red-400 hover:bg-red-950/30'
                      }`}
                    >
                      REOPEN
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
