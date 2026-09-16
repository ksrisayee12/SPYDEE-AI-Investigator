import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Search,
  MessageSquarePlus,
  Compass
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { IntelligenceSignal } from '../common/IntelligenceSignal';
import { MOCK_HYPOTHESES } from '../../data/mockCaseData';
import { Hypothesis } from '../../types';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface HypothesesViewProps {
  onNavigateToEvidence?: () => void;
  onNavigateToLeads?: () => void;
}

interface HypothesisNote {
  id: string;
  text: string;
  time: string;
  author: string;
}

export const HypothesesView: React.FC<HypothesesViewProps> = ({
  onNavigateToEvidence,
  onNavigateToLeads
}) => {
  const { showAlert } = useTerminalAlert();
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>(MOCK_HYPOTHESES);
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis>(MOCK_HYPOTHESES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [notesByHypothesis, setNotesByHypothesis] = useState<Record<string, HypothesisNote[]>>({
    'H-01': [
      {
        id: 'n-1',
        text: 'Surveillance corroborated: Mahindra Scorpio (V-12) driver matched courier Suresh physical description.',
        time: '07:15:22',
        author: 'INSP. J. RAO'
      }
    ]
  });

  const filtered = hypotheses.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkStatus = (newStatus: 'ACTIVE' | 'VERIFIED' | 'DISPROVEN' | 'INSUFFICIENT_EVIDENCE') => {
    const updated = { ...selectedHypothesis, status: newStatus };
    setSelectedHypothesis(updated);
    setHypotheses((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    showAlert(`Hypothesis ${updated.id} status transitioned to [${newStatus}].`, 'SUCCESS');
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newNote: HypothesisNote = {
      id: `n-${Date.now()}`,
      text: noteInput.trim(),
      time: new Date().toTimeString().split(' ')[0],
      author: 'INSP. J. RAO'
    };
    const currentNotes = notesByHypothesis[selectedHypothesis.id] || [];
    setNotesByHypothesis({
      ...notesByHypothesis,
      [selectedHypothesis.id]: [...currentNotes, newNote]
    });
    setNoteInput('');
    showAlert(`Field note logged to hypothesis ${selectedHypothesis.id}.`, 'SUCCESS');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // INTELLIGENCE // HYPOTHESES
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            AI-GENERATED INVESTIGATIVE THEORIES
          </div>
          <div className="text-[10px] text-amber-500/80">
            HYPOTHESIS ≠ CONFIRMED FACT // EXPLICIT SUPPORTING & REFUTING EVIDENCE AUDIT
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLeads}
            className="px-3 py-1.5 bg-black border border-amber-500 text-amber-300 font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CONVERT TO INVESTIGATIVE LEADS</span>
          </button>
        </div>
      </div>

      {/* FILTER / SEARCH */}
      <div className="p-2 bg-[#0a0f0a] border border-amber-500/30 flex items-center gap-2 text-xs">
        <Search className="w-3.5 h-3.5 text-amber-500/70" />
        <input
          type="text"
          placeholder="FILTER HYPOTHESIS TITLE OR ENTITY..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-amber-300 placeholder-amber-500/40 outline-none w-full text-xs font-mono"
        />
        <span className="text-[10px] text-amber-500/60 shrink-0">
          SHOWING {filtered.length} OF {hypotheses.length}
        </span>
      </div>

      {/* TWO-COLUMN WORKSPACE: CARDS LIST (LEFT) + FULL EXPLANATION MATRIX (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* HYPOTHESES LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((hyp) => {
            const isSelected = selectedHypothesis.id === hyp.id;
            return (
              <div
                key={hyp.id}
                onClick={() => setSelectedHypothesis(hyp)}
                className={`p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#0b100b] border-amber-500/30 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-amber-300 text-xs">{hyp.id}</span>
                  <StatusBadge status={hyp.status} size="sm" />
                </div>

                <div className="font-bold text-amber-200 text-xs mb-1 line-clamp-1">
                  {hyp.title}
                </div>

                <p className="text-[11px] text-amber-500/80 line-clamp-2 mb-2">
                  {hyp.summary}
                </p>

                <div className="flex items-center justify-between border-t border-amber-500/20 pt-1 text-[10px]">
                  <span className="text-amber-500/70">
                    + {hyp.supportingFacts.length} PRO | - {hyp.refutingFacts.length} CON
                  </span>
                  <span className="text-amber-300 font-bold">
                    CONF: {Math.round(hyp.confidence * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED EXPLANATION MATRIX (7 cols) */}
        <div className="lg:col-span-7">
          {selectedHypothesis && (
            <TerminalPanel
              title={`HYPOTHESIS AUDIT // ${selectedHypothesis.id}`}
              subtitle={selectedHypothesis.status}
            >
              <div className="space-y-3 text-xs">
                {/* Title & Confidence */}
                <div className="p-3 bg-black/60 border border-amber-500/30 space-y-2">
                  <div className="text-sm font-bold text-amber-300">
                    {selectedHypothesis.title}
                  </div>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    {selectedHypothesis.summary}
                  </p>
                  <ConfidenceMeter value={selectedHypothesis.confidence} label="MATHEMATICAL PROBABILITY SCORE" />
                </div>

                {/* PROMPT SPECIFIED: SUPPORTING FACTS */}
                <div className="p-2.5 bg-black/50 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>SUPPORTING EVIDENCE (+ CORROBORATING FACTS):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] pl-5 list-disc text-emerald-300/90">
                    {selectedHypothesis.supportingFacts.map((fact, i) => (
                      <li key={i} className="leading-snug">{fact}</li>
                    ))}
                  </ul>
                </div>

                {/* PROMPT SPECIFIED: MISSING FACTS / REFUTING EVIDENCE */}
                <div className="p-2.5 bg-black/50 border border-red-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-red-400 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>REFUTING EVIDENCE & MISSING DATA (- GAPS / CONTRADICTIONS):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] pl-5 list-disc text-red-300/90">
                    {selectedHypothesis.refutingFacts.map((fact, i) => (
                      <li key={i} className="leading-snug">{fact}</li>
                    ))}
                  </ul>
                </div>

                {/* PROMPT SPECIFIED: ALTERNATIVE EXPLANATIONS */}
                <div className="p-2.5 bg-black/50 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>ALTERNATIVE EXPLANATIONS (COUNTER-THEORIES):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] pl-5 list-disc text-amber-400/90">
                    {selectedHypothesis.alternativeExplanations.map((alt, i) => (
                      <li key={i} className="leading-snug">{alt}</li>
                    ))}
                  </ul>
                </div>

                {/* HUMAN INVESTIGATOR VERIFICATION ACTIONS */}
                <div className="p-2.5 bg-[#0a0f0a] border border-amber-500/30 space-y-2">
                  <div className="text-[10px] text-amber-500/70 font-bold uppercase">
                    ▶ INVESTIGATOR ADJUDICATION
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleMarkStatus('VERIFIED')}
                      className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-800/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>MARK VERIFIED</span>
                    </button>
                    <button
                      onClick={() => handleMarkStatus('DISPROVEN')}
                      className="px-2.5 py-1 bg-red-950/60 border border-red-500/50 hover:bg-red-800/40 text-red-300 font-bold text-[11px] flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>MARK DISPROVEN</span>
                    </button>
                    <button
                      onClick={() => handleMarkStatus('ACTIVE')}
                      className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/50 hover:bg-amber-800/40 text-amber-300 font-bold text-[11px] flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>MARK ACTIVE / UNCONFIRMED</span>
                    </button>
                  </div>

                  {/* Logged Notes */}
                  {notesByHypothesis[selectedHypothesis.id]?.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] text-amber-500/70 font-bold uppercase">
                        FIELD NOTES LOGGED ({notesByHypothesis[selectedHypothesis.id].length}):
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {notesByHypothesis[selectedHypothesis.id].map((note) => (
                          <div
                            key={note.id}
                            className="p-1.5 bg-black/70 border border-amber-500/20 text-[11px] space-y-0.5"
                          >
                            <div className="flex justify-between text-[10px] text-amber-500/60">
                              <span className="font-bold text-amber-400">{note.author}</span>
                              <span>{note.time}</span>
                            </div>
                            <div className="text-amber-300">{note.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add note */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add investigator field note..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="flex-1 p-1.5 bg-black border border-amber-500/30 text-amber-300 text-xs outline-none"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1.5 bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
                    >
                      LOG
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
