import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowRight,
  X,
  CheckCircle2,
  Cpu,
  Hash,
  Clock,
  ExternalLink,
  ShieldAlert,
  Database
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { MOCK_EVIDENCE } from '../../data/mockCaseData';
import { EvidenceDocument } from '../../types';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface EvidenceFilesProps {
  onSelectEntity?: (id: string) => void;
  onNavigateToGraph?: () => void;
}

export const EvidenceFiles: React.FC<EvidenceFilesProps> = ({
  onSelectEntity,
  onNavigateToGraph
}) => {
  const { showAlert } = useTerminalAlert();
  const [evidenceList, setEvidenceList] = useState<EvidenceDocument[]>(MOCK_EVIDENCE);
  const [selectedDoc, setSelectedDoc] = useState<EvidenceDocument | null>(MOCK_EVIDENCE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'FIR' | 'CDR' | 'FINANCIAL' | 'CCTV' | 'CYBER_LOG' | 'VEHICLE_RTO'>('CDR');

  const filteredEvidence = evidenceList.filter((doc) => {
    const matchesSearch = 
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter;
    const matchesSource = sourceFilter === 'ALL' || doc.source.includes(sourceFilter);
    return matchesSearch && matchesType && matchesSource;
  });

  const handleSimulateIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newDoc: EvidenceDocument = {
      id: `INGEST_${Math.floor(1000 + Math.random() * 9000)}`,
      file: newFileName,
      type: newFileType,
      source: 'OPERATOR TERMINAL UPLOAD',
      ingested: '16 SEP 2026',
      entitiesCount: Math.floor(4 + Math.random() * 8),
      status: 'PROCESSED',
      confidence: 0.94,
      hash: `sha256:${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 8)}`,
      provenanceId: `STF-OP-UPLOAD-${Date.now().toString().slice(-4)}`,
      extractedEntities: ['E-004', 'E-008', 'E-015'],
      extractedRelationships: ['R-04', 'R-13'],
      summary: `Manual intake of investigative telecommunications dossier: ${newFileName}. Correlated into Case MH-26189-042.`
    };
    setEvidenceList([newDoc, ...evidenceList]);
    setSelectedDoc(newDoc);
    setNewFileName('');
    setShowIngestModal(false);
    showAlert(`Evidence item [${newDoc.id}] "${newDoc.file}" ingested with cryptographic checksum.`, 'SUCCESS');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // EVIDENCE & FILES
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            INVESTIGATIVE SOURCE DOSSIERS
          </div>
          <div className="text-[10px] text-amber-500/80">
            PROVENANCE-SECURED INGESTION PIPELINE & ENTITY EXTRACTION REPOSITORY
          </div>
        </div>

        <button
          onClick={() => setShowIngestModal(true)}
          className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ INGEST EVIDENCE</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-2.5 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center gap-2 text-xs">
        {/* Search */}
        <div className="flex items-center gap-1.5 bg-black/80 border border-amber-500/40 px-2 py-1 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-amber-500/70" />
          <input
            type="text"
            placeholder="SEARCH FILE / ID / EVIDENCE TEXT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-amber-300 placeholder-amber-500/40 outline-none w-full text-xs font-mono"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-amber-500 hover:text-amber-300">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-amber-500/70 uppercase">TYPE:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="ALL">ALL TYPES</option>
            <option value="FIR">FIR</option>
            <option value="CDR">CDR</option>
            <option value="FINANCIAL">FINANCIAL</option>
            <option value="CCTV">CCTV</option>
            <option value="CYBER_LOG">CYBER_LOG</option>
            <option value="VEHICLE_RTO">VEHICLE_RTO</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-amber-500/70 uppercase">SOURCE:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="ALL">ALL SOURCES</option>
            <option value="DISTRICT POLICE">DISTRICT POLICE</option>
            <option value="TELECOM">TELECOM</option>
            <option value="BANK DATA">BANK DATA</option>
            <option value="SURVEILLANCE">SURVEILLANCE</option>
            <option value="CERT-IN">CERT-IN</option>
          </select>
        </div>

        <div className="text-[10px] text-amber-500/60 ml-auto hidden md:block">
          MATCHING: {filteredEvidence.length} OF {evidenceList.length}
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE: TABLE + RIGHT INSPECTOR DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Evidence Table (7 or 8 cols) */}
        <div className={selectedDoc ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="bg-[#0b100b] border border-amber-500/35 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-500/40 bg-[#0e160e] text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">FILE</th>
                  <th className="p-2.5">TYPE</th>
                  <th className="p-2.5 hidden sm:table-cell">SOURCE</th>
                  <th className="p-2.5 hidden md:table-cell">INGESTED</th>
                  <th className="p-2.5 text-center">ENTITIES</th>
                  <th className="p-2.5">STATUS</th>
                  <th className="p-2.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/20">
                {filteredEvidence.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-amber-500/20 border-l-2 border-l-amber-400 text-amber-200' 
                          : 'hover:bg-amber-950/30 text-amber-400'
                      }`}
                    >
                      <td className="p-2.5 font-bold text-amber-300">{doc.id}</td>
                      <td className="p-2.5 flex items-center gap-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{doc.file}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 text-[9px] bg-black/60 border border-amber-500/30 text-amber-300">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-2.5 hidden sm:table-cell text-amber-500/80">{doc.source}</td>
                      <td className="p-2.5 hidden md:table-cell text-amber-500/70">{doc.ingested}</td>
                      <td className="p-2.5 text-center font-bold text-amber-300">{doc.entitiesCount}</td>
                      <td className="p-2.5">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoc(doc);
                          }}
                          className={`px-2 py-1 border text-[10px] uppercase tracking-wider ${
                            isSelected
                              ? 'bg-amber-500 text-black font-bold border-amber-400'
                              : 'bg-black/60 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                          }`}
                        >
                          {isSelected ? 'ACTIVE' : 'INSPECT'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: EVIDENCE INSPECTOR DRAWER (5 cols) */}
        {selectedDoc && (
          <div className="lg:col-span-5">
            <TerminalPanel
              title={`EVIDENCE INSPECTOR // ${selectedDoc.id}`}
              subtitle={selectedDoc.file}
              headerRight={
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 text-amber-500 hover:text-amber-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              }
            >
              <div className="space-y-3 text-xs">
                {/* File Metadata Overview */}
                <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">SOURCE DOCUMENT:</span>
                    <span className="font-bold text-amber-300">{selectedDoc.file}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">PROVENANCE ID:</span>
                    <span className="font-mono text-amber-400">{selectedDoc.provenanceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">INGESTION SOURCE:</span>
                    <span className="text-amber-300">{selectedDoc.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-500/70">TIMESTAMP:</span>
                    <span className="text-amber-400">{selectedDoc.ingested}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-500/70">PROCESSING STATUS:</span>
                    <StatusBadge status={selectedDoc.status} size="sm" />
                  </div>
                </div>

                {/* Cryptographic Verification Hash */}
                <div className="p-2 bg-black/80 border border-amber-500/20 text-[10px]">
                  <div className="flex items-center gap-1.5 text-amber-500/80 mb-1 font-bold">
                    <Hash className="w-3 h-3 text-amber-400" />
                    <span>CRYPTOGRAPHIC IMMUTABILITY HASH</span>
                  </div>
                  <div className="font-mono text-amber-300/80 break-all bg-black/60 p-1.5 border border-amber-500/20 select-all">
                    {selectedDoc.hash}
                  </div>
                </div>

                {/* Summary / Intelligence Digest */}
                <div className="p-2.5 bg-black/40 border border-amber-500/25">
                  <div className="text-[10px] text-amber-500/80 font-bold uppercase mb-1">
                    ▶ INTELLIGENCE SUMMARY
                  </div>
                  <p className="text-amber-400/90 leading-relaxed text-[11px]">
                    {selectedDoc.summary}
                  </p>
                </div>

                {/* Extracted Entities */}
                <div>
                  <div className="text-[10px] text-amber-500/80 font-bold uppercase mb-1.5 flex justify-between">
                    <span>EXTRACTED ENTITIES ({selectedDoc.extractedEntities.length})</span>
                    <span className="text-[9px] text-amber-500/60">CLICK TO JUMP</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.extractedEntities.map((entId) => (
                      <button
                        key={entId}
                        onClick={() => onSelectEntity && onSelectEntity(entId)}
                        className="px-2 py-1 bg-black/80 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors font-mono text-[10px] flex items-center gap-1"
                      >
                        <span>{entId}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extracted Relationships */}
                <div>
                  <div className="text-[10px] text-amber-500/80 font-bold uppercase mb-1.5">
                    EXTRACTED RELATIONSHIPS ({selectedDoc.extractedRelationships.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.extractedRelationships.map((relId) => (
                      <span
                        key={relId}
                        className="px-2 py-0.5 bg-black/60 border border-amber-500/30 text-amber-400 text-[10px]"
                      >
                        {relId}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between gap-2">
                  <button
                    onClick={onNavigateToGraph}
                    className="flex-1 py-1.5 bg-black border border-amber-500/50 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <span>VIEW ENTITIES IN GRAPH</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </TerminalPanel>
          </div>
        )}
      </div>

      {/* MODAL: INGEST EVIDENCE SIMULATOR */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090e09] border-2 border-amber-500 p-4 font-mono text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/40 mb-3">
              <span className="font-bold text-amber-300 text-sm">▶ INGEST SOURCE EVIDENCE</span>
              <button onClick={() => setShowIngestModal(false)} className="text-amber-500 hover:text-amber-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateIngest} className="space-y-3">
              <div>
                <label className="block text-[10px] text-amber-500/80 uppercase mb-1">
                  FILE NAME / IDENTIFIER:
                </label>
                <input
                  type="text"
                  placeholder="e.g. CDR_TOWER_Z_SUPPLEMENT.csv or BANK_STATEMENT_A17.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 text-xs outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-amber-500/80 uppercase mb-1">
                  DATA TYPE:
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 text-xs outline-none"
                >
                  <option value="CDR">CDR (Call Detail Records)</option>
                  <option value="FIR">FIR (First Information Report)</option>
                  <option value="FINANCIAL">FINANCIAL (Bank Statements / Hawala)</option>
                  <option value="CCTV">CCTV (Surveillance Metadata / OCR)</option>
                  <option value="CYBER_LOG">CYBER_LOG (DNS / WHOIS / IP Telemetry)</option>
                  <option value="VEHICLE_RTO">VEHICLE_RTO (ANPR / FASTag Logs)</option>
                </select>
              </div>

              <div className="p-2.5 bg-black/60 border border-amber-500/20 text-[10px] text-amber-500/80">
                Notice: Uploaded source files are processed via the SPYDEE extraction pipeline (Entity Parsing, Normalization, Disambiguation & Graph Correlation).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-3 py-1.5 bg-black border border-amber-500/30 text-amber-400 hover:bg-amber-950/30"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                >
                  START INGESTION PIPELINE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
