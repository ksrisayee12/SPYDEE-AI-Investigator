import React, { useState } from 'react';
import {
  Cpu,
  Send,
  Sparkles,
  Terminal,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { IntelligenceSignal } from '../common/IntelligenceSignal';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface Message {
  id: string;
  sender: 'INVESTIGATOR' | 'SPYDEE_AI';
  timestamp: string;
  text: string;
  signals?: {
    type: 'FACT' | 'DERIVED' | 'INFERRED';
    detail: string;
  }[];
}

export const AIInvestigatorView: React.FC = () => {
  const { showAlert } = useTerminalAlert();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'SPYDEE_AI',
      timestamp: '07:30:12',
      text: 'SPYDEE SYNTHETIC INVESTIGATIVE COPILOT INITIALIZED. CASE MH-26189-042 LOADED INTO WORKING MEMORY (27 ENTITIES, 84 RELATIONSHIPS, 6 HYPOTHESES). ENTER QUERY OR SELECT AN INVESTIGATIVE PROMPT BELOW.'
    },
    {
      id: 'm-2',
      sender: 'INVESTIGATOR',
      timestamp: '07:32:45',
      text: 'Summarize the primary evidence connecting Ravi Kumar (E-008) to the extortion courier Suresh (E-015).'
    },
    {
      id: 'm-3',
      sender: 'SPYDEE_AI',
      timestamp: '07:32:48',
      text: 'ANALYSIS COMPLETED: Ravi Kumar (E-008) and Suresh (E-015) exhibit a strong indirect operational correlation (Confidence: 67%), though direct telecommunication links were deliberately avoided.',
      signals: [
        {
          type: 'FACT',
          detail: 'No direct call or SMS registered between E-008 and E-015 across 60 days of telecom CDR dumps (CDR_118).'
        },
        {
          type: 'DERIVED',
          detail: 'Both individuals co-located within 400m of Tower Z-042 on 14 separate dates, peaking 15 minutes before cash drop events.'
        },
        {
          type: 'DERIVED',
          detail: 'FASTag logs establish Mahindra Scorpio (V-12) used by Suresh was registered under Apex Logistics, where Ravi Kumar serves as silent partner.'
        },
        {
          type: 'INFERRED',
          detail: 'HYPOTHESIS H-01: Ravi Kumar operates as handler directing Suresh through disposable burner relays or physical drop dead-drops.'
        }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const presetQueries = [
    'Identify who holds the highest betweenness centrality in the graph.',
    'Highlight contradictions between telecom records and physical alibis.',
    'What are the top 3 gaps that would collapse Hypothesis H-01?',
    'Trace financial flow from extortion victim to Hawala account A-17.'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'INVESTIGATOR',
      timestamp: new Date().toLocaleTimeString(),
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let replyText = '';
      let signals: Message['signals'] = [];

      if (q.includes('centrality')) {
        replyText = 'GRAPH TOPOLOGY ANALYSIS: Betweenness centrality analysis reveals Burner Handset E-004 (+919692826578) acts as the primary operational bridge (Centrality: 0.842), connecting the upper leadership layer to tactical ground extortionists.';
        signals = [
          { type: 'FACT', detail: 'Handset E-004 contacted 7 distinct SIM cards within minutes of extortion deadlines.' },
          { type: 'DERIVED', detail: 'Device IMEI was switched 3 times across Pune metro sectors.' },
          { type: 'INFERRED', detail: 'Operated by a dedicated switchboard handler rather than the mastermind.' }
        ];
      } else if (q.includes('contradiction')) {
        replyText = 'CONTRADICTION DETECTOR: 2 high-severity evidentiary clashes identified.';
        signals = [
          { type: 'FACT', detail: 'Tower Z-042 pinged at 23:14 on 14/09/2026.' },
          { type: 'FACT', detail: 'ATM CCTV at Dadar recorded suspect debit card usage at 23:12 (160km away).' },
          { type: 'INFERRED', detail: 'Physical presence in two distant locations impossible. High probability of card cloning or proxy courier.' }
        ];
      } else if (q.includes('gap') || q.includes('H-01')) {
        replyText = 'SENSITIVITY AUDIT ON HYPOTHESIS H-01: The link between Ravi Kumar and Suresh relies on circumstantial co-location. It would collapse if:';
        signals = [
          { type: 'FACT', detail: 'Gap 1: If RTO logs prove Scorpio V-12 was leased to an unrelated third party on 14/09.' },
          { type: 'DERIVED', detail: 'Gap 2: If Tower Z-042 CDR identifies a separate third-party intermediary coordinating both men.' },
          { type: 'INFERRED', detail: 'Gap 3: If bank audit proves Hawala account A-17 funds originated from legitimate commercial trade.' }
        ];
      } else {
        replyText = `INTELLIGENCE SYNTHESIS ON "${q}": Graph and timeline data scanned. Correlation engine isolated 3 primary nodes (E-004, E-008, E-010). Confidence rating: 78%.`;
        signals = [
          { type: 'FACT', detail: 'Data verified against FIR_0042, CDR_118, and Bank TXN_009.' },
          { type: 'DERIVED', detail: 'Temporal alignment confirmed within 30-minute operational window.' },
          { type: 'INFERRED', detail: 'Subject remains an active flight risk. Warrant recommendation dispatched.' }
        ];
      }

      const aiMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'SPYDEE_AI',
        timestamp: new Date().toLocaleTimeString(),
        text: replyText,
        signals
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div className="space-y-3 font-mono text-xs h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2 shrink-0">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // TOOLS // AI INVESTIGATOR
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider flex items-center gap-2">
            <span>SYNTHETIC INTELLIGENCE INVESTIGATIVE COPILOT</span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              v1.0.3 READY
            </span>
          </div>
          <div className="text-[10px] text-amber-500/80">
            NATURAL LANGUAGE QUERYING OVER GRAPH KNOWLEDGE BASE & EVIDENTIARY ARCHIVE
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
            showAlert('AI Investigator chat session reset to initial state.', 'INFO');
          }}
          className="px-2.5 py-1 bg-black border border-amber-500/40 text-amber-400 hover:bg-amber-950/30 text-xs flex items-center gap-1 self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET SESSION</span>
        </button>
      </div>

      {/* PROMPT SUGGESTIONS CHIPS */}
      <div className="p-2 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-amber-500/70 font-bold uppercase mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          QUICK QUERIES:
        </span>
        {presetQueries.map((pq, i) => (
          <button
            key={i}
            onClick={() => handleSend(pq)}
            className="px-2 py-1 bg-black/80 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:bg-amber-500/20 text-[10px] truncate max-w-xs transition-colors"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* CHAT LOG STREAM */}
      <div className="flex-1 bg-[#060a06] border border-amber-500/40 p-3 overflow-y-auto space-y-3 min-h-[360px]">
        {messages.map((m) => {
          const isAI = m.sender === 'SPYDEE_AI';
          return (
            <div
              key={m.id}
              className={`p-3 border leading-relaxed ${
                isAI
                  ? 'bg-[#090f09] border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                  : 'bg-black/80 border-amber-500/60 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-amber-500/20 text-[10px]">
                <span className="font-bold tracking-wider text-amber-400">
                  {isAI ? '▶ SPYDEE INTELLIGENCE ENGINE' : '◀ INVESTIGATOR (STF-OP-04)'}
                </span>
                <span className="text-amber-500/60">{m.timestamp}</span>
              </div>

              <div className="text-xs leading-relaxed whitespace-pre-wrap">{m.text}</div>

              {/* Structured Signal Badges */}
              {m.signals && m.signals.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-amber-500/20 space-y-1.5">
                  <div className="text-[10px] text-amber-500/70 font-bold uppercase">
                    EVIDENTIARY DECOMPOSITION:
                  </div>
                  {m.signals.map((sig, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 bg-black/60 border border-amber-500/20 text-[11px] flex items-start gap-2"
                    >
                      <StatusBadge status={sig.type} size="sm" />
                      <span className="text-amber-300/90 leading-snug">{sig.detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="p-3 bg-[#090f09] border border-amber-500/40 text-amber-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 animate-spin text-amber-400" />
            <span className="text-xs animate-pulse">CORRELATING KNOWLEDGE GRAPH & SCANNING DOSSIERS...</span>
          </div>
        )}
      </div>

      {/* INPUT CONSOLE BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 bg-[#0a0f0a] border border-amber-500/40 flex items-center gap-2 shrink-0"
      >
        <span className="text-amber-400 font-bold pl-1">&gt;</span>
        <input
          type="text"
          placeholder="QUERY CASE INTELLIGENCE (e.g. 'Show timeline correlation around Quiet Market drop')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-transparent text-amber-300 placeholder-amber-500/40 text-xs font-mono outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_8px_#f59e0b]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>QUERY</span>
        </button>
      </form>
    </div>
  );
};
