import React from 'react';
import {
  Users,
  Network,
  GitFork,
  HelpCircle,
  Compass,
  Activity,
  ArrowRight,
  ShieldCheck,
  FilePlus,
  Play,
  Share2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { IntelligenceSignal } from '../common/IntelligenceSignal';
import { StatusBadge } from '../common/StatusBadge';
import { CASE_METADATA, MOCK_INTEL_ALERTS, MOCK_ACTIVITY_FEED, MOCK_ENTITIES, MOCK_RELATIONSHIPS } from '../../data/mockCaseData';
import { NavTab } from '../layout/TerminalShell';

interface CaseOverviewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectEntity?: (id: string) => void;
  onOpenHiddenLink?: () => void;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({
  onNavigate,
  onSelectEntity,
  onOpenHiddenLink
}) => {
  // Metric card item helper
  const metrics = [
    { label: 'ENTITIES', value: CASE_METADATA.metrics.entities, tab: 'entities' as NavTab, icon: Users },
    { label: 'RELATIONSHIPS', value: CASE_METADATA.metrics.relationships, tab: 'graph' as NavTab, icon: Network },
    { label: 'ACTIVE HYPOTHESES', value: '06', tab: 'hypotheses' as NavTab, icon: GitFork },
    { label: 'INFORMATION GAPS', value: '09', tab: 'gaps' as NavTab, icon: HelpCircle },
    { label: 'HIGH-VALUE LEADS', value: '04', tab: 'leads' as NavTab, icon: Compass },
    { label: 'NETWORK CONFIDENCE', value: CASE_METADATA.networkConfidence, tab: 'graph' as NavTab, isConfidence: true }
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // OVERVIEW
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider flex items-center gap-2">
            <span>CASE {CASE_METADATA.id}</span>
            <span className="text-xs text-amber-500/60 font-normal hidden sm:inline-block">
              — {CASE_METADATA.title}
            </span>
          </div>
          <div className="text-[10px] text-amber-500/80 tracking-widest uppercase">
            AI-POWERED CRIMINAL NETWORK ANALYSIS // SYNTHETIC INTELLIGENCE RUN
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('workbench')}
            className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN AI CORRELATION</span>
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            onClick={() => onNavigate(m.tab)}
            className="p-3 bg-[#0c120c]/90 border border-amber-500/35 hover:border-amber-400 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="text-[10px] text-amber-500/70 uppercase tracking-widest mb-1 truncate">
              {m.label}
            </div>
            <div className="text-xl md:text-2xl font-black text-amber-300 tracking-tight group-hover:text-amber-200">
              {m.value}
            </div>
            <div className="mt-1 text-[9px] text-amber-500/50 flex items-center justify-between">
              <span>EXPLORE</span>
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform text-amber-400" />
            </div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/50" />
          </div>
        ))}
      </div>

      {/* THREE-COLUMN MAIN LAYOUT: CASE SUMMARY | NETWORK SNAPSHOT | INTELLIGENCE ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT: CASE SUMMARY (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <TerminalPanel title="CASE SUMMARY" subtitle="CLASSIFIED RECORD">
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">INVESTIGATION ID:</span>
                <span className="font-bold text-amber-300">{CASE_METADATA.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">OPENED DATE:</span>
                <span className="font-medium text-amber-400">{CASE_METADATA.openedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">JURISDICTION:</span>
                <span className="font-medium text-amber-400 text-right max-w-[180px] truncate">{CASE_METADATA.jurisdiction}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">CASE TYPE:</span>
                <span className="font-medium text-amber-400">EXTORTION / HAWALA / CYBER</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">INVESTIGATING UNIT:</span>
                <span className="font-medium text-amber-400">{CASE_METADATA.investigatingUnit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">DATA SOURCES:</span>
                <span className="font-bold text-amber-300">FIR, CDR, FIU, CCTV, OSINT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">LAST ANALYSIS:</span>
                <span className="font-medium text-amber-400">{CASE_METADATA.lastAnalysis}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-amber-500/70">LEAD DETECTIVE:</span>
                <span className="font-medium text-amber-300">INSPECTOR J. RAO (E-027)</span>
              </div>
            </div>

            {/* Quick Actions matching user image */}
            <div className="mt-3 pt-2 border-t border-amber-500/30">
              <div className="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider mb-2">
                ▶ QUICK ACTIONS
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onNavigate('evidence')}
                  className="p-1.5 bg-black/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/20 text-left flex items-center gap-1.5"
                >
                  <FilePlus className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] tracking-wider truncate">INGEST EVIDENCE</span>
                </button>
                <button
                  onClick={() => onNavigate('graph')}
                  className="p-1.5 bg-black/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/20 text-left flex items-center gap-1.5"
                >
                  <Network className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] tracking-wider truncate">OPEN GRAPH</span>
                </button>
                <button
                  onClick={() => onNavigate('map')}
                  className="p-1.5 bg-black/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/20 text-left flex items-center gap-1.5"
                >
                  <Compass className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] tracking-wider truncate">TACTICAL MAP</span>
                </button>
                <button
                  onClick={() => onNavigate('ai_investigator')}
                  className="p-1.5 bg-black/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/20 text-left flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[10px] tracking-wider truncate">AI INVESTIGATOR</span>
                </button>
              </div>
            </div>
          </TerminalPanel>
        </div>

        {/* CENTER: NETWORK SNAPSHOT PREVIEW (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <TerminalPanel
            title="NETWORK SNAPSHOT"
            subtitle="CORE SUSPECT CLUSTERS"
            headerRight={
              <button
                onClick={() => onNavigate('graph')}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline"
              >
                EXPAND [→]
              </button>
            }
          >
            {/* Interactive compact SVG graph preview */}
            <div className="relative h-64 bg-black/80 border border-amber-500/25 overflow-hidden flex items-center justify-center">
              {/* Radar sweep background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="w-56 h-56 rounded-full border border-amber-500" />
                <div className="w-40 h-40 rounded-full border border-amber-500 absolute" />
                <div className="w-24 h-24 rounded-full border border-amber-500 absolute" />
                <div className="absolute w-56 h-[1px] bg-amber-500" />
                <div className="absolute h-56 w-[1px] bg-amber-500" />
              </div>

              {/* Mini SVG Network */}
              <svg className="w-full h-full cursor-pointer" onClick={() => onNavigate('graph')}>
                {/* Edges */}
                <line x1="70" y1="60" x2="160" y2="130" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <line x1="160" y1="130" x2="250" y2="90" stroke="#f59e0b" strokeWidth="1.5" opacity="0.8" />
                <line x1="250" y1="90" x2="330" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" />
                <line x1="160" y1="130" x2="210" y2="200" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                <line x1="210" y1="200" x2="330" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                <line x1="250" y1="90" x2="210" y2="200" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

                {/* Nodes */}
                {/* Node 1: Person (Ravi Kumar) */}
                <g transform="translate(250, 90)">
                  <circle r="16" fill="#141e14" stroke="#f59e0b" strokeWidth="2" />
                  <text textAnchor="middle" y="4" fill="#fbbf24" fontSize="9" fontWeight="bold">RAVI</text>
                  <text textAnchor="middle" y="26" fill="#f59e0b" fontSize="8" opacity="0.8">E-008 (PERSON)</text>
                </g>

                {/* Node 2: Phone (E-004 Target-X) */}
                <g transform="translate(160, 130)">
                  <rect x="-14" y="-14" width="28" height="28" fill="#141e14" stroke="#f59e0b" strokeWidth="1.5" />
                  <text textAnchor="middle" y="3" fill="#fbbf24" fontSize="8" fontWeight="bold">E-004</text>
                  <text textAnchor="middle" y="24" fill="#f59e0b" fontSize="7">PHONE</text>
                </g>

                {/* Node 3: Person (Suresh) */}
                <g transform="translate(330, 150)">
                  <circle r="15" fill="#1f1414" stroke="#f97316" strokeWidth="2" strokeDasharray="2 2" />
                  <text textAnchor="middle" y="3" fill="#fdba74" fontSize="8" fontWeight="bold">SURESH</text>
                  <text textAnchor="middle" y="24" fill="#f97316" fontSize="7">E-015 (UNCONFIRMED)</text>
                </g>

                {/* Node 4: Vehicle (V-12) */}
                <g transform="translate(210, 200)">
                  <polygon points="0,-12 12,10 -12,10" fill="#141e14" stroke="#f59e0b" strokeWidth="1.5" />
                  <text textAnchor="middle" y="7" fill="#fbbf24" fontSize="7" fontWeight="bold">V-12</text>
                  <text textAnchor="middle" y="22" fill="#f59e0b" fontSize="7">VEHICLE</text>
                </g>

                {/* Node 5: Account (A-17) */}
                <g transform="translate(70, 60)">
                  <polygon points="-12,-12 12,-12 12,12 -12,12" fill="#141e14" stroke="#34d399" strokeWidth="1.5" />
                  <text textAnchor="middle" y="3" fill="#34d399" fontSize="8" fontWeight="bold">A-17</text>
                  <text textAnchor="middle" y="22" fill="#34d399" fontSize="7">ACCOUNT</text>
                </g>

                {/* Inferred link label */}
                <g transform="translate(290, 115)">
                  <rect x="-35" y="-8" width="70" height="16" fill="#080c08" stroke="#f97316" strokeWidth="1" strokeDasharray="2 2" />
                  <text textAnchor="middle" y="3" fill="#f97316" fontSize="7" fontWeight="bold">HIDDEN LINK 67%</text>
                </g>
              </svg>

              {/* Legend overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] bg-black/80 px-2 py-1 border border-amber-500/20 text-amber-400/80">
                <span>● PERSON</span>
                <span>■ PHONE</span>
                <span>▲ VEHICLE</span>
                <span>◆ ACCOUNT</span>
                <span className="text-amber-300 font-bold">CLICK TO INTERACT</span>
              </div>
            </div>

            {/* Quick caption under snapshot */}
            <div className="mt-2 text-[10px] text-amber-500/80 flex items-center justify-between">
              <span>CORRELATED CLUSTERS: 4</span>
              <span className="text-amber-300">DISCOVERED CONNECTIONS: 84</span>
            </div>
          </TerminalPanel>
        </div>

        {/* RIGHT: INTELLIGENCE ALERTS & SIGNALS (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <TerminalPanel title="INTELLIGENCE ALERTS" subtitle="ACTIVE SIGNALS">
            {/* Signature Intelligence Signal Component */}
            <div className="mb-3">
              <IntelligenceSignal
                title="NEW HIDDEN LINK DETECTED"
                sourceLabel="RAVI KUMAR (E-008)"
                targetLabel="SURESH (E-015)"
                confidence={0.67}
                evidenceCount="03"
                status="UNCONFIRMED"
                onClick={() => onNavigate('hypotheses')}
              />
            </div>

            {/* Other Alerts */}
            <div className="space-y-2">
              {MOCK_INTEL_ALERTS.slice(1).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => alert.severity === 'HIGH' ? onNavigate('hypotheses') : onNavigate('contradictions')}
                  className="p-2 border border-amber-500/30 bg-black/50 hover:bg-amber-950/30 cursor-pointer transition-colors text-[10px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={alert.severity} size="sm" />
                    <span className="text-amber-500/60">{alert.timestamp}</span>
                  </div>
                  <div className="font-bold text-amber-300 mb-0.5">{alert.title}</div>
                  <div className="text-amber-500/80 line-clamp-2">{alert.summary}</div>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>
      </div>

      {/* BOTTOM SECTION: RECENT SYSTEM ACTIVITY + TERMINAL MOTTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Activity feed (8 cols) */}
        <div className="lg:col-span-8">
          <TerminalPanel title="RECENT SYSTEM ACTIVITY" subtitle="CORRELATION RUN FEED">
            <div className="space-y-1.5">
              {MOCK_ACTIVITY_FEED.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-1 border-b border-amber-500/15 text-[11px] font-mono"
                >
                  <span className="text-amber-400/70 font-bold shrink-0">{act.time}</span>
                  <span className="text-amber-300 font-semibold shrink-0">{act.event}</span>
                  <span className="text-amber-500/80 truncate">-- {act.detail}</span>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>

        {/* Tactical Banner & Motto (4 cols) */}
        <div className="lg:col-span-4">
          <TerminalPanel title="INTELLIGENCE DIVISION" subtitle="BHARAT ELECTRONICS">
            <div className="p-2 bg-black/60 border border-amber-500/20 text-center space-y-2">
              <div className="text-[12px] font-bold text-amber-300 tracking-widest uppercase">
                "PATTERNS EXIST EVEN IN SILENCE."
              </div>
              <div className="text-[10px] text-amber-500/70">
                — SPYDEE CRIMINAL NETWORK SYSTEM
              </div>
              <div className="pt-2 border-t border-amber-500/20 text-[9px] text-amber-500/60 leading-relaxed text-left">
                NOTICE: AI generates investigative hypotheses and identifies hidden signals for human investigator corroboration. Inferred links must not be represented as confirmed facts without corroborating physical evidence.
              </div>
            </div>
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
};
