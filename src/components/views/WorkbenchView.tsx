import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Search,
  HelpCircle,
  Database,
  Cpu
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface WorkbenchViewProps {
  onNavigateToGraph?: () => void;
  onNavigateToHypotheses?: () => void;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  onNavigateToGraph,
  onNavigateToHypotheses
}) => {
  const { showAlert } = useTerminalAlert();
  const [focusQuery, setFocusQuery] = useState(
    'Correlate extortion threats from E-004 with Pune hawala accounts and unidentified vehicle V-12'
  );
  const [engineType, setEngineType] = useState('PATH_FINDER');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [resultsReady, setResultsReady] = useState(true);

  const handleRunCorrelation = () => {
    setIsRunning(true);
    setProgress(15);
    setResultsReady(false);

    setTimeout(() => setProgress(45), 400);
    setTimeout(() => setProgress(75), 800);
    setTimeout(() => {
      setProgress(100);
      setIsRunning(false);
      setResultsReady(true);
      showAlert(
        'Correlation engine executed: 2-hop bridge resolved linking Ravi Kumar (E-008) and Suresh (E-015) via Scorpio V-12.',
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
            // INTELLIGENCE // WORKBENCH
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            INVESTIGATIVE CORRELATION WORKBENCH
          </div>
          <div className="text-[10px] text-amber-500/80">
            HYPOTHESIS GENERATION // MULTI-HOP PATH SEARCH // SIGNAL SYNTHESIZER
          </div>
        </div>

        <button
          onClick={handleRunCorrelation}
          disabled={isRunning}
          className="px-4 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isRunning ? 'RUNNING CORRELATION...' : 'EXECUTE CORRELATION ENGINE'}</span>
        </button>
      </div>

      {/* INPUT QUERY BAR */}
      <div className="p-3 bg-[#0c120c] border border-amber-500/40 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-amber-500/80 font-bold uppercase">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            INVESTIGATIVE HYPOTHESIS PROMPT:
          </span>
          <span className="text-[10px] text-amber-500/60">SYNTHETIC INFERENCE PIPELINE</span>
        </div>
        <textarea
          rows={2}
          value={focusQuery}
          onChange={(e) => setFocusQuery(e.target.value)}
          className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 font-mono text-xs outline-none focus:border-amber-400"
        />

        {/* Engine selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-500/70 uppercase">ALGORITHM:</span>
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
              className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-0.5 outline-none font-mono"
            >
              <option value="PATH_FINDER">MULTI-HOP BRIDGING (DIJKSTRA / HEURISTIC)</option>
              <option value="CO_LOCATION">TOWER BURST CO-LOCATION CLUSTERING</option>
              <option value="ENTITY_RESOLVER">DISAMBIGUATION & ALIAS MERGE</option>
              <option value="FLOW_ANALYSIS">HAWALA FINANCIAL FLOW RECONSTRUCTION</option>
            </select>
          </div>

          <div className="flex gap-2">
            {['E-004 (Phone-X)', 'E-008 (Ravi)', 'E-015 (Suresh)', 'V-12 (Vehicle)'].map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-black/60 border border-amber-500/30 text-amber-300 text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar when running */}
      {isRunning && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-amber-500/70">
            <span>TRAVERSING 84 RELATIONSHIP EDGES ACROSS CASE MH-26189-042...</span>
            <span className="font-bold text-amber-300">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black border border-amber-500/30 overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* RESULTS / FINDINGS */}
      {resultsReady && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main correlation findings (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <TerminalPanel title="DISCOVERED BRIDGING HYPOTHESIS" subtitle="OUTPUT: H-01">
              <div className="space-y-3 text-xs">
                {/* Visual Bridge Representation */}
                <div className="p-3 bg-black/80 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-2 text-center">
                  <div className="p-2 border border-amber-500/40 bg-[#0e160e] w-full md:w-auto">
                    <div className="text-[10px] text-amber-500/70">SUSPECT A</div>
                    <div className="font-bold text-amber-300 text-sm">RAVI KUMAR</div>
                    <div className="text-[9px] text-amber-400">E-008 (EXTORTION CELL)</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-amber-300">2-HOP DERIVED BRIDGE</span>
                    <span className="text-amber-500 text-sm">── [Scorpio V-12 + Tower Z-042] ──▶</span>
                    <span className="text-[9px] text-amber-400 font-bold bg-amber-500/20 px-1.5 border border-amber-500/40">
                      CONFIDENCE: 67%
                    </span>
                  </div>

                  <div className="p-2 border border-amber-500/40 bg-[#0e160e] w-full md:w-auto">
                    <div className="text-[10px] text-amber-500/70">SUSPECT B</div>
                    <div className="font-bold text-amber-300 text-sm">SURESH</div>
                    <div className="text-[9px] text-amber-400">E-015 (HAWALA COURIER)</div>
                  </div>
                </div>

                <div className="p-2.5 bg-black/40 border border-amber-500/25 space-y-1.5 text-[11px]">
                  <div className="font-bold text-amber-300">EXPLANATION MATRIX:</div>
                  <p className="text-amber-400/90 leading-relaxed">
                    Although neither suspect's primary handsets registered direct voice calls or SMS, their digital footprints intersect at Tower Z-042 on 14 separate occasions within a 15-minute window following extortion threat calls. Furthermore, FASTag logs verify Scorpio V-12 operated in the same corridor immediately prior to cash drops.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-amber-500/70">CORROBORATING SOURCES: FIR_0042, CDR_118, FASTag_TOLL3</span>
                  <button
                    onClick={onNavigateToHypotheses}
                    className="px-3 py-1 bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 flex items-center gap-1"
                  >
                    <span>VIEW FULL HYPOTHESIS DOSSIER</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </TerminalPanel>
          </div>

          {/* Side Workbench Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <TerminalPanel title="CORRELATION METRICS" subtitle="RUN STF-884">
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-amber-500/20">
                  <span className="text-amber-500/70">TOTAL NODES SCANNED:</span>
                  <span className="font-bold text-amber-300">27</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-500/20">
                  <span className="text-amber-500/70">CANDIDATE BRIDGES:</span>
                  <span className="font-bold text-amber-300">3 PATHS</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-500/20">
                  <span className="text-amber-500/70">SIGNAL-TO-NOISE:</span>
                  <span className="font-bold text-amber-300">8.4 : 1</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-500/20">
                  <span className="text-amber-500/70">PROCESSING LATENCY:</span>
                  <span className="font-bold text-amber-300">42ms</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToGraph}
                    className="w-full py-1.5 bg-black border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 font-bold text-xs"
                  >
                    HIGHLIGHT PATH IN GRAPH [⚯]
                  </button>
                </div>
              </div>
            </TerminalPanel>
          </div>
        </div>
      )}
    </div>
  );
};
