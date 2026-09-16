import React, { useState } from 'react';
import {
  Database,
  UploadCloud,
  FileText,
  Cpu,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

export const DataIngestionView: React.FC = () => {
  const { showAlert } = useTerminalAlert();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>('MAHARASHTRA_TELECOM_CDR_TOWER42_SUPP.csv');
  const [selectedPipeline, setSelectedPipeline] = useState('CDR_NORMALIZER');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState<string[]>([
    'SYSTEM: Ready for multi-format forensic ingestion.',
    'PIPELINE: Normalizer v2.4 (Regex + NER Parser) active.'
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleRunPipeline = () => {
    setIsProcessing(true);
    setProcessingLog([
      `[07:44:01] INTAKE: Opening forensic file ${selectedFile}...`,
      `[07:44:02] SHA-256 HASH GENERATED: sha256:e8f1b290ac9471d4...`,
      `[07:44:03] PARSING: Detected 1,482 records. Applying regex entity matchers...`,
      `[07:44:04] EXTRACTED: 14 Unique MSISDNs, 4 Cell Towers, 2 FASTag IDs.`,
      `[07:44:05] DISAMBIGUATION: Resolving against existing Case MH-26189-042 nodes...`,
      `[07:44:06] GRAPH UPDATE: 3 new entities created, 18 relationship edges appended.`,
      `[07:44:07] PIPELINE COMPLETED SUCCESSFULLY.`
    ]);

    setTimeout(() => {
      setIsProcessing(false);
      showAlert('Ingestion pipeline execution complete. 1,482 records normalized and merged into case graph.', 'SUCCESS');
    }, 1500);
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // TOOLS // DATA INGESTION
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            RAW EVIDENCE INTAKE & ENTITY EXTRACTION
          </div>
          <div className="text-[10px] text-amber-500/80">
            AUTO-NORMALIZATION // SHA-256 IMMUTABILITY // NER DISAMBIGUATION
          </div>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isProcessing}
          className="px-4 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
          <span>{isProcessing ? 'PROCESSING...' : 'RUN INGESTION PIPELINE'}</span>
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT: INTAKE CANVAS + PIPELINE MAPPING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT: DROP ZONE & CONFIG (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <TerminalPanel title="FILE INTAKE VAULT" subtitle="DRAG & DROP OR FILE SELECT">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-black/50 ${
                dragActive ? 'border-amber-400 bg-amber-500/10' : 'border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <UploadCloud className="w-10 h-10 text-amber-500 mb-2" />
              <div className="text-sm font-bold text-amber-300 mb-1">
                DRAG SOURCE EVIDENCE FILES HERE
              </div>
              <div className="text-[10px] text-amber-500/70 mb-3">
                SUPPORTED: CDR (.CSV), FIR (.PDF/.TXT), CCTV METADATA (.JSON), FASTAG (.XLS)
              </div>

              <label className="px-3 py-1.5 bg-black border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer text-xs font-bold">
                BROWSE FILES
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-3 p-2.5 bg-black/60 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-300 truncate">{selectedFile}</span>
                </div>
                <StatusBadge status="READY" size="sm" />
              </div>
            )}
          </TerminalPanel>

          {/* PARSER CONFIGURATION */}
          <TerminalPanel title="PARSING CONFIGURATION" subtitle="SCHEMA NORMALIZATION">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">INGESTION PRESET:</span>
                <select
                  value={selectedPipeline}
                  onChange={(e) => setSelectedPipeline(e.target.value)}
                  className="bg-black border border-amber-500/40 text-amber-300 px-2 py-0.5 outline-none font-mono text-xs"
                >
                  <option value="CDR_NORMALIZER">CELLULAR DETAIL RECORD (CDR)</option>
                  <option value="BANK_STR">FIU FINANCIAL TRANSACTION (STR/CTR)</option>
                  <option value="FASTAG_ANPR">HIGHWAY FASTAG / ANPR CAMERA</option>
                  <option value="FIR_LEGAL">FIR POLICE COMPLAINT (NLP)</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-amber-500/20">
                <span className="text-amber-500/70">CRYPTOGRAPHIC PROVENANCE:</span>
                <span className="font-bold text-amber-300">SHA-256 AUDIT LOG ON</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-amber-500/70">GRAPH DISAMBIGUATION:</span>
                <span className="font-bold text-amber-300">STRICT PHONE / AADHAAR HASH</span>
              </div>
            </div>
          </TerminalPanel>
        </div>

        {/* RIGHT: LIVE PROCESSING LOG (6 cols) */}
        <div className="lg:col-span-6">
          <TerminalPanel title="INGESTION EXECUTION LOG" subtitle="PIPELINE RUNTIME STREAM">
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-black/90 border border-amber-500/40 min-h-[280px] font-mono text-amber-300 space-y-1.5 overflow-y-auto max-h-[350px]">
                {processingLog.map((log, i) => (
                  <div key={i} className="leading-snug">
                    <span className="text-amber-500/60 select-none">&gt; </span>
                    <span>{log}</span>
                  </div>
                ))}
                {isProcessing && (
                  <div className="text-amber-400 animate-pulse">
                    &gt; EXECUTING ENTITY EXTRACTION...
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-black/60 border border-amber-500/20 text-[11px] text-amber-500/70 space-y-1">
                <div className="text-amber-400 font-bold uppercase">CHAIN OF CUSTODY NOTICE:</div>
                <p>
                  Every ingested dossier is hashed and time-stamped in the Bharat Electronics terminal vault. Admissible under Section 65B of the Indian Evidence Act.
                </p>
              </div>
            </div>
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
};
