import React, { useState, useEffect } from 'react';
import { useTerminalAlert } from '../../context/TerminalAlertContext';
import {
  Search,
  Filter,
  Plus,
  Network,
  MapPin,
  GitMerge,
  FileEdit,
  X,
  User,
  Phone,
  Car,
  CreditCard,
  Building,
  Globe,
  Radio,
  Calendar,
  ShieldAlert,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { MOCK_ENTITIES, MOCK_RELATIONSHIPS } from '../../data/mockCaseData';
import { Entity, EntityType } from '../../types';

interface EntitiesViewProps {
  onNavigateToGraphWithEntity?: (entityId: string) => void;
  onNavigateToMapWithEntity?: (entityId: string) => void;
  selectedEntityId?: string;
  onSelectEntityId?: (id: string) => void;
}

export const EntitiesView: React.FC<EntitiesViewProps> = ({
  onNavigateToGraphWithEntity,
  onNavigateToMapWithEntity,
  selectedEntityId,
  onSelectEntityId
}) => {
  const { showAlert } = useTerminalAlert();
  const [entities, setEntities] = useState<Entity[]>(MOCK_ENTITIES);
  const [activeEntityId, setActiveEntityId] = useState<string>(selectedEntityId || 'E-004');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDetailTab, setActiveDetailTab] = useState<'OVERVIEW' | 'RELATIONS' | 'EVENTS' | 'EVIDENCE'>('OVERVIEW');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<EntityType>('PHONE');
  const [newAlias, setNewAlias] = useState('');

  // Synchronize activeEntityId if prop changes
  useEffect(() => {
    if (selectedEntityId) {
      setActiveEntityId(selectedEntityId);
    }
  }, [selectedEntityId]);

  const itemsPerPage = 10;

  const filteredEntities = entities.filter((ent) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ent.id.toLowerCase().includes(q) ||
      ent.label.toLowerCase().includes(q) ||
      (ent.alias && ent.alias.toLowerCase().includes(q)) ||
      (ent.notes && ent.notes.toLowerCase().includes(q));

    const matchesType = typeFilter === 'ALL' || ent.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntities = filteredEntities.slice(startIndex, startIndex + itemsPerPage);

  const selectedEntity = entities.find((e) => e.id === activeEntityId) || entities[0];

  // Entity relationships
  const entityRelations = MOCK_RELATIONSHIPS.filter(
    (r) => r.source === selectedEntity?.id || r.target === selectedEntity?.id
  );

  const handleSelect = (id: string) => {
    setActiveEntityId(id);
    if (onSelectEntityId) onSelectEntityId(id);
  };

  const handleAddEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const newId = `E-${String(entities.length + 1).padStart(3, '0')}`;
    const newEnt: Entity = {
      id: newId,
      label: newLabel.trim(),
      alias: newAlias.trim() || undefined,
      type: newType,
      identifiersCount: 1,
      state: 'NEW',
      confidence: 0.85,
      firstSeen: '16/09/2026',
      lastSeen: '16/09/2026',
      notes: 'Manually logged by STF terminal investigator.',
      linkedEntities: []
    };
    setEntities([newEnt, ...entities]);
    setActiveEntityId(newId);
    if (onSelectEntityId) onSelectEntityId(newId);
    setShowAddModal(false);
    setNewLabel('');
    setNewAlias('');
    showAlert(`Entity [${newId}] "${newEnt.label}" registered in Case MH-26189-042 directory.`, 'SUCCESS');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // ENTITIES
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            INVESTIGATIVE ENTITY DIRECTORY
          </div>
          <div className="text-[10px] text-amber-500/80">
            TOTAL 27 TRACKED SUSPECT NODES, PHONES, SIMS, ACCOUNTS, VEHICLES & INFRASTRUCTURE
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ ADD ENTITY</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-2.5 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-black/80 border border-amber-500/40 px-2.5 py-1 flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-amber-500/70" />
          <input
            type="text"
            placeholder="Search entities (name / ID / number / alias)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-amber-300 placeholder-amber-500/40 outline-none w-full text-xs font-mono"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-amber-500 hover:text-amber-300">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type selector */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2.5 py-1 outline-none font-mono"
        >
          <option value="ALL">All types</option>
          <option value="PERSON">Person</option>
          <option value="PHONE">Phone</option>
          <option value="SIM">SIM</option>
          <option value="VEHICLE">Vehicle</option>
          <option value="ACCOUNT">Account</option>
          <option value="LOCATION">Location</option>
          <option value="TOWER">Tower</option>
          <option value="DOMAIN">Domain</option>
          <option value="IP">IP</option>
          <option value="EVENT">Event</option>
        </select>
      </div>

      {/* TWO-COLUMN GRID: MAIN TABLE (LEFT) + DETAIL DRAWER (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* ENTITIES TABLE */}
        <div className="lg:col-span-7">
          <div className="bg-[#0b100b] border border-amber-500/35 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-500/40 bg-[#0e160e] text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">LABEL / ALIAS</th>
                  <th className="p-2.5">TYPE</th>
                  <th className="p-2.5 text-center">IDENTIFIERS</th>
                  <th className="p-2.5">STATE</th>
                  <th className="p-2.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/20 font-mono">
                {currentEntities.map((ent) => {
                  const isSelected = selectedEntity?.id === ent.id;
                  return (
                    <tr
                      key={ent.id}
                      onClick={() => handleSelect(ent.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 border-l-2 border-l-amber-400 text-amber-200'
                          : 'hover:bg-amber-950/30 text-amber-400'
                      }`}
                    >
                      <td className="p-2.5 font-bold text-amber-300">{ent.id}</td>
                      <td className="p-2.5">
                        <div className="font-medium text-amber-300 truncate max-w-[170px]">{ent.label}</div>
                        {ent.alias && (
                          <div className="text-[10px] text-amber-500/70 truncate max-w-[170px]">
                            {ent.alias}
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-[11px] text-amber-400/90">{ent.type}</td>
                      <td className="p-2.5 text-center text-amber-300 font-bold">{ent.identifiersCount}</td>
                      <td className="p-2.5">
                        <StatusBadge status={ent.state} size="sm" />
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(ent.id);
                          }}
                          className={`px-2.5 py-0.5 border text-[10px] uppercase tracking-wider ${
                            isSelected
                              ? 'bg-amber-500 text-black font-bold border-amber-400'
                              : 'bg-black/60 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                          }`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls matching screenshot */}
            <div className="p-2.5 border-t border-amber-500/30 bg-[#0c120c] flex items-center justify-between text-[11px]">
              <span className="text-amber-500/70">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredEntities.length)} of {filteredEntities.length} entities
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2 py-0.5 border border-amber-500/40 disabled:opacity-30 hover:bg-amber-500/20"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2 py-0.5 border text-[11px] ${
                      currentPage === i + 1
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2 py-0.5 border border-amber-500/40 disabled:opacity-30 hover:bg-amber-500/20"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ENTITY DETAIL DRAWER */}
        <div className="lg:col-span-5">
          {selectedEntity && (
            <div className="bg-[#0b100b] border border-amber-500/40 font-mono text-xs">
              {/* Header */}
              <div className="px-3 py-2 border-b border-amber-500/40 bg-[#0e160e] flex items-center justify-between">
                <div className="font-bold text-amber-300 tracking-wider">
                  // ENTITY DETAIL
                </div>
                <div className="text-[10px] text-amber-500/60 font-mono">
                  {selectedEntity.id}
                </div>
              </div>

              <div className="p-3 space-y-3">
                {/* Profile Header Box with Silhouette Avatar */}
                <div className="p-3 bg-black/60 border border-amber-500/30 flex gap-3">
                  {/* Technical Avatar Silhouette */}
                  <div className="w-16 h-20 bg-black border border-amber-500/40 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-amber-500/20 pointer-events-none" />
                    {selectedEntity.type === 'PERSON' ? (
                      <User className="w-10 h-10 text-amber-500/60" />
                    ) : selectedEntity.type === 'PHONE' ? (
                      <Phone className="w-10 h-10 text-amber-500/60" />
                    ) : selectedEntity.type === 'VEHICLE' ? (
                      <Car className="w-10 h-10 text-amber-500/60" />
                    ) : selectedEntity.type === 'ACCOUNT' ? (
                      <CreditCard className="w-10 h-10 text-amber-500/60" />
                    ) : selectedEntity.type === 'LOCATION' || selectedEntity.type === 'TOWER' ? (
                      <MapPin className="w-10 h-10 text-amber-500/60" />
                    ) : (
                      <Globe className="w-10 h-10 text-amber-500/60" />
                    )}
                    <span className="absolute bottom-0 text-[8px] text-amber-500/80 bg-black/80 w-full text-center py-0.5">
                      {selectedEntity.id}
                    </span>
                  </div>

                  {/* Summary Identity */}
                  <div className="flex-1 space-y-1 text-[11px] leading-tight">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-amber-300">{selectedEntity.id}</span>
                      <StatusBadge status={selectedEntity.state} size="sm" />
                    </div>
                    <div className="text-amber-500/80">
                      Type : <span className="text-amber-300 font-medium">{selectedEntity.type}</span>
                    </div>
                    <div className="text-amber-500/80 truncate">
                      Label : <span className="text-amber-300 font-bold">{selectedEntity.label}</span>
                    </div>
                    {selectedEntity.alias && (
                      <div className="text-amber-500/80 truncate">
                        Aliases : <span className="text-amber-400">{selectedEntity.alias}</span>
                      </div>
                    )}
                    <div className="text-amber-500/80">
                      Confidence : <span className="text-amber-300 font-bold">{selectedEntity.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs: OVERVIEW | RELATIONS | EVENTS | EVIDENCE */}
                <div className="flex border-b border-amber-500/30">
                  {(['OVERVIEW', 'RELATIONS', 'EVENTS', 'EVIDENCE'] as const).map((tab) => {
                    const isActive = activeDetailTab === tab;
                    let countLabel = '';
                    if (tab === 'RELATIONS') countLabel = ` (${entityRelations.length})`;
                    if (tab === 'EVENTS') countLabel = ' (4)';
                    if (tab === 'EVIDENCE') countLabel = ' (3)';

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveDetailTab(tab)}
                        className={`flex-1 py-1.5 text-[10px] font-bold tracking-wider transition-colors uppercase ${
                          isActive
                            ? 'bg-amber-500 text-black border-b-2 border-b-amber-300'
                            : 'bg-black/40 text-amber-400/80 hover:bg-amber-950/30'
                        }`}
                      >
                        {tab}{countLabel}
                      </button>
                    );
                  })}
                </div>

                {/* TAB CONTENT: OVERVIEW */}
                {activeDetailTab === 'OVERVIEW' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 border border-amber-500/20">
                      <div>
                        <span className="text-[10px] text-amber-500/70 block">FIRST SEEN</span>
                        <span className="text-amber-300 font-medium">{selectedEntity.firstSeen}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-500/70 block">LAST SEEN</span>
                        <span className="text-amber-300 font-medium">{selectedEntity.lastSeen}</span>
                      </div>
                      {selectedEntity.serviceProvider && (
                        <div>
                          <span className="text-[10px] text-amber-500/70 block">SERVICE PROVIDER</span>
                          <span className="text-amber-300">{selectedEntity.serviceProvider}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-amber-500/70 block">CIRCLE / REGION</span>
                        <span className="text-amber-300">Maharashtra / Pune STF</span>
                      </div>
                    </div>

                    {selectedEntity.knownLocations && selectedEntity.knownLocations.length > 0 && (
                      <div className="p-2 bg-black/40 border border-amber-500/20">
                        <span className="text-[10px] text-amber-500/70 block mb-1">KNOWN LOCATIONS</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedEntity.knownLocations.map((loc, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-black/80 border border-amber-500/30 text-amber-400 text-[10px]">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedEntity.imsiHash || selectedEntity.imeiHash) && (
                      <div className="p-2 bg-black/40 border border-amber-500/20 space-y-1 text-[10px]">
                        {selectedEntity.imsiHash && (
                          <div className="flex justify-between">
                            <span className="text-amber-500/70">IMSI HASH:</span>
                            <span className="font-mono text-amber-300">{selectedEntity.imsiHash}</span>
                          </div>
                        )}
                        {selectedEntity.imeiHash && (
                          <div className="flex justify-between">
                            <span className="text-amber-500/70">IMEI HASH:</span>
                            <span className="font-mono text-amber-300">{selectedEntity.imeiHash}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedEntity.notes && (
                      <div className="p-2 bg-black/40 border border-amber-500/20">
                        <span className="text-[10px] text-amber-500/70 block mb-0.5">NOTES:</span>
                        <p className="text-amber-300/90 leading-relaxed text-[11px]">{selectedEntity.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: RELATIONS */}
                {activeDetailTab === 'RELATIONS' && (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {entityRelations.map((rel) => {
                      const otherId = rel.source === selectedEntity.id ? rel.target : rel.source;
                      return (
                        <div
                          key={rel.id}
                          onClick={() => handleSelect(otherId)}
                          className="p-2 bg-black/60 border border-amber-500/30 hover:border-amber-400 cursor-pointer flex items-center justify-between text-[11px]"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-amber-300">{rel.type}</span>
                              <span className="text-amber-500/70">↝</span>
                              <span className="font-bold text-amber-200">{otherId}</span>
                            </div>
                            <div className="text-[10px] text-amber-500/70">{rel.description}</div>
                          </div>
                          <StatusBadge status={rel.evidenceType} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB CONTENT: EVENTS */}
                {activeDetailTab === 'EVENTS' && (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 bg-black/60 border border-amber-500/30">
                      <div className="flex justify-between text-amber-500/80 text-[10px]">
                        <span>EVENT-044</span>
                        <span>14/09/2026 23:14</span>
                      </div>
                      <div className="font-bold text-amber-300 mt-0.5">Quiet Market Extortion Rendezvous</div>
                      <div className="text-[10px] text-amber-500/70">Co-located with Tower Z-042 and vehicle V-12.</div>
                    </div>
                    <div className="p-2 bg-black/60 border border-amber-500/30">
                      <div className="flex justify-between text-amber-500/80 text-[10px]">
                        <span>EVENT-052</span>
                        <span>15/09/2026 03:22</span>
                      </div>
                      <div className="font-bold text-amber-300 mt-0.5">Expressway Toll 3 Transit</div>
                      <div className="text-[10px] text-amber-500/70">FASTag vehicle telemetry sync.</div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: EVIDENCE */}
                {activeDetailTab === 'EVIDENCE' && (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 bg-black/60 border border-amber-500/30">
                      <span className="font-bold text-amber-300">CDR_118</span>
                      <p className="text-[10px] text-amber-500/80">Tower Z-042 Call Detail Records & co-location dumps.</p>
                    </div>
                    <div className="p-2 bg-black/60 border border-amber-500/30">
                      <span className="font-bold text-amber-300">FIR_0042</span>
                      <p className="text-[10px] text-amber-500/80">Quiet Market extortion threat report lodged with STF.</p>
                    </div>
                  </div>
                )}

                {/* QUICK ACTIONS MATCHING SCREENSHOT */}
                <div className="pt-2 border-t border-amber-500/30">
                  <div className="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider mb-2">
                    ▶ QUICK ACTIONS
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onNavigateToGraphWithEntity && onNavigateToGraphWithEntity(selectedEntity.id)}
                      className="p-2 bg-black border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>View in Graph</span>
                    </button>
                    <button
                      onClick={() => onNavigateToMapWithEntity && onNavigateToMapWithEntity(selectedEntity.id)}
                      className="p-2 bg-black border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                    <button
                      onClick={() => alert(`Merge candidate workflow launched for entity ${selectedEntity.id}. Scanning Aadhaar/IMSI biometrics...`)}
                      className="p-2 bg-black border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Merge Candidates</span>
                    </button>
                    <button
                      onClick={() => {
                        const note = prompt(`Add intelligence note for ${selectedEntity.id}:`);
                        if (note) {
                          selectedEntity.notes = `${selectedEntity.notes || ''} [Update: ${note}]`;
                          setEntities([...entities]);
                        }
                      }}
                      className="p-2 bg-black border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD ENTITY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090e09] border-2 border-amber-500 p-4 font-mono text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/40 mb-3">
              <span className="font-bold text-amber-300 text-sm">▶ MANUAL ENTITY REGISTRATION</span>
              <button onClick={() => setShowAddModal(false)} className="text-amber-500 hover:text-amber-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntity} className="space-y-3">
              <div>
                <label className="block text-[10px] text-amber-500/80 uppercase mb-1">
                  LABEL / IDENTIFIER (PHONE, NAME, ACCOUNT, PLATE):
                </label>
                <input
                  type="text"
                  placeholder="e.g. +919876543210 or Rakesh Verma or MH-12-AB-1234"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-amber-500/80 uppercase mb-1">
                  ALIAS / CRYPTONYM (OPTIONAL):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shadow-9 or Operator B"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-amber-500/80 uppercase mb-1">
                  ENTITY TYPE:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EntityType)}
                  className="w-full p-2 bg-black border border-amber-500/40 text-amber-300 text-xs outline-none"
                >
                  <option value="PERSON">PERSON</option>
                  <option value="PHONE">PHONE</option>
                  <option value="SIM">SIM</option>
                  <option value="VEHICLE">VEHICLE</option>
                  <option value="ACCOUNT">ACCOUNT</option>
                  <option value="LOCATION">LOCATION</option>
                  <option value="TOWER">TOWER</option>
                  <option value="DOMAIN">DOMAIN</option>
                  <option value="IP">IP</option>
                  <option value="EVENT">EVENT</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-black border border-amber-500/30 text-amber-400"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400"
                >
                  REGISTER ENTITY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
