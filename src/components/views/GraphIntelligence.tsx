import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  X,
  Play,
  Layers,
  Sliders,
  Maximize2,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { IntelligenceSignal } from '../common/IntelligenceSignal';
import { MOCK_ENTITIES, MOCK_RELATIONSHIPS } from '../../data/mockCaseData';
import { Entity, Relationship, EntityType, RelationshipType } from '../../types';

interface GraphIntelligenceProps {
  initialSelectedEntityId?: string;
  onNavigateToEntity?: (id: string) => void;
  onNavigateToHypotheses?: () => void;
}

export const GraphIntelligence: React.FC<GraphIntelligenceProps> = ({
  initialSelectedEntityId,
  onNavigateToEntity,
  onNavigateToHypotheses
}) => {
  const [entities, setEntities] = useState<Entity[]>(MOCK_ENTITIES);
  const [relationships, setRelationships] = useState<Relationship[]>(MOCK_RELATIONSHIPS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialSelectedEntityId || 'E-008');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(0.5);
  const [edgeTypeFilter, setEdgeTypeFilter] = useState<string>('ALL');
  const [hiddenLinkActive, setHiddenLinkActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Synchronize when initialSelectedEntityId prop updates
  useEffect(() => {
    if (initialSelectedEntityId) {
      setSelectedNodeId(initialSelectedEntityId);
    }
  }, [initialSelectedEntityId]);

  const svgRef = useRef<SVGSVGElement>(null);

  // Selected node details
  const selectedEntity = entities.find((e) => e.id === selectedNodeId) || null;

  // Filtered nodes
  const filteredEntities = entities.filter((ent) => {
    const matchesSearch = 
      ent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'ALL' || ent.type === selectedTypeFilter;
    const matchesConf = ent.confidence >= minConfidence;
    return matchesSearch && matchesType && matchesConf;
  });

  const visibleNodeIds = new Set(filteredEntities.map((e) => e.id));

  // Filtered edges
  const filteredRelationships = relationships.filter((rel) => {
    const nodesVisible = visibleNodeIds.has(rel.source) && visibleNodeIds.has(rel.target);
    const matchesEdgeType = edgeTypeFilter === 'ALL' || rel.type === edgeTypeFilter;
    const matchesConf = rel.confidence >= minConfidence;
    return nodesVisible && matchesEdgeType && matchesConf;
  });

  // Nodes position map helper
  const nodePositionMap = new Map<string, { x: number; y: number }>();
  entities.forEach((ent) => {
    nodePositionMap.set(ent.id, { x: ent.x || 300, y: ent.y || 300 });
  });

  // Hidden link nodes: Ravi Kumar (E-008) and Suresh (E-015)
  const isHighlightedNode = (id: string) => {
    if (!hiddenLinkActive) return false;
    return id === 'E-008' || id === 'E-015' || id === 'E-004' || id === 'E-011' || id === 'V-12';
  };

  const isHighlightedEdge = (rel: Relationship) => {
    if (!hiddenLinkActive) return false;
    return rel.id === 'R-13' || (isHighlightedNode(rel.source) && isHighlightedNode(rel.target));
  };

  // Canvas Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas-bg') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const resetCanvas = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setHiddenLinkActive(false);
    setSearchQuery('');
    setSelectedTypeFilter('ALL');
    setEdgeTypeFilter('ALL');
  };

  return (
    <div className="space-y-3 font-mono text-xs h-full flex flex-col">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2 shrink-0">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // GRAPH INTELLIGENCE
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider flex items-center gap-2">
            <span>KNOWLEDGE GRAPH ENGINE</span>
            <span className="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
              CASE {MOCK_ENTITIES[0] ? 'MH-26189-042' : ''}
            </span>
          </div>
          <div className="text-[10px] text-amber-500/80">
            SOLID = OBSERVED DIRECT // THIN = DERIVED // DASHED = INFERRED // RED DASHED = CONTRADICTION
          </div>
        </div>

        {/* PRIMARY ACTION: ANALYZE HIDDEN LINKS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHiddenLinkActive(!hiddenLinkActive)}
            className={`px-3 py-1.5 font-bold transition-all flex items-center gap-2 text-xs border ${
              hiddenLinkActive
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse'
                : 'bg-black/80 border-amber-500 text-amber-300 hover:bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hiddenLinkActive ? 'DISMISS HIDDEN LINK' : 'ANALYZE HIDDEN LINKS'}</span>
          </button>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="p-2 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-1.5 bg-black/80 border border-amber-500/40 px-2 py-1 min-w-[170px]">
            <Search className="w-3.5 h-3.5 text-amber-500/70" />
            <input
              type="text"
              placeholder="SEARCH GRAPH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-amber-300 placeholder-amber-500/40 outline-none w-full text-xs font-mono"
            />
          </div>

          {/* Node Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="ALL">ALL NODE TYPES</option>
            <option value="PERSON">PERSON</option>
            <option value="PHONE">PHONE</option>
            <option value="SIM">SIM</option>
            <option value="VEHICLE">VEHICLE</option>
            <option value="ACCOUNT">ACCOUNT</option>
            <option value="LOCATION">LOCATION</option>
            <option value="TOWER">TOWER</option>
            <option value="EVENT">EVENT</option>
            <option value="DOMAIN">DOMAIN</option>
            <option value="IP">IP</option>
          </select>

          {/* Edge Type Filter */}
          <select
            value={edgeTypeFilter}
            onChange={(e) => setEdgeTypeFilter(e.target.value)}
            className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="ALL">ALL EDGE TYPES</option>
            <option value="CALLED">CALLED</option>
            <option value="OWNED">OWNED</option>
            <option value="USED">USED</option>
            <option value="CO-LOCATED">CO-LOCATED</option>
            <option value="TRANSACTED">TRANSACTED</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="HOSTED">HOSTED</option>
            <option value="ATTENDED">ATTENDED</option>
            <option value="LINKED">LINKED</option>
          </select>

          {/* Confidence Filter Slider */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 border border-amber-500/30 text-[11px]">
            <span className="text-amber-500/70">CONF &gt;=</span>
            <input
              type="range"
              min="0.4"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer"
            />
            <span className="text-amber-300 font-bold w-7">
              {Math.round(minConfidence * 100)}%
            </span>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.2))}
            className="p-1 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
            className="p-1 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetCanvas}
            className="px-2 py-1 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-[10px] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* MAIN GRAPH WORKSPACE */}
      <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-12 gap-3 relative">
        {/* GRAPH CANVAS AREA */}
        <div className={`${selectedEntity || hiddenLinkActive ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} relative bg-[#060a06] border border-amber-500/35 overflow-hidden flex flex-col`}>
          {/* Subtle Grid / Radar Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          {/* SVG Canvas */}
          <svg
            ref={svgRef}
            id="graph-canvas-bg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            viewBox="0 0 800 600"
          >
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
              {/* EDGES */}
              {filteredRelationships.map((rel) => {
                const srcPos = nodePositionMap.get(rel.source);
                const tgtPos = nodePositionMap.get(rel.target);
                if (!srcPos || !tgtPos) return null;

                const isHighlighted = isHighlightedEdge(rel);
                const isSelectedConn = selectedNodeId === rel.source || selectedNodeId === rel.target;

                let strokeColor = '#d97706';
                let strokeWidth = 1.2;
                let strokeDash = 'none';

                if (rel.edgeStyle === 'dashed') {
                  strokeDash = '4 3';
                  strokeColor = '#fbbf24';
                  strokeWidth = 1.8;
                } else if (rel.edgeStyle === 'red_dashed') {
                  strokeDash = '3 3';
                  strokeColor = '#ef4444';
                  strokeWidth = 2;
                } else if (rel.edgeStyle === 'thin') {
                  strokeWidth = 0.8;
                  strokeColor = '#92400e';
                }

                if (isHighlighted) {
                  strokeColor = '#f59e0b';
                  strokeWidth = 3;
                } else if (isSelectedConn) {
                  strokeColor = '#fbbf24';
                  strokeWidth = 2;
                }

                const midX = (srcPos.x + tgtPos.x) / 2;
                const midY = (srcPos.y + tgtPos.y) / 2;

                return (
                  <g key={rel.id} className="group cursor-pointer">
                    <line
                      x1={srcPos.x}
                      y1={srcPos.y}
                      x2={tgtPos.x}
                      y2={tgtPos.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      opacity={hiddenLinkActive && !isHighlighted ? 0.2 : 0.8}
                    />

                    {/* Edge Label Badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-30"
                        y="-7"
                        width="60"
                        height="14"
                        fill="#080c08"
                        stroke={strokeColor}
                        strokeWidth="0.8"
                        opacity={isHighlighted || isSelectedConn ? 1 : 0.6}
                      />
                      <text
                        textAnchor="middle"
                        y="3"
                        fill={isHighlighted ? '#fbbf24' : '#f59e0b'}
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {rel.type}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Inferred Hidden Link Animated Line when Active */}
              {hiddenLinkActive && (
                <g>
                  <line
                    x1="420"
                    y1="130"
                    x2="520"
                    y2="430"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  <g transform="translate(470, 280)">
                    <rect x="-65" y="-12" width="130" height="24" fill="#0c120c" stroke="#f59e0b" strokeWidth="1.5" />
                    <text textAnchor="middle" y="-1" fill="#f59e0b" fontSize="8" fontWeight="bold">
                      HIDDEN LINK ↝ 67%
                    </text>
                    <text textAnchor="middle" y="9" fill="#fbbf24" fontSize="7">
                      [UNCONFIRMED HYPOTHESIS]
                    </text>
                  </g>
                </g>
              )}

              {/* NODES */}
              {filteredEntities.map((ent) => {
                const pos = nodePositionMap.get(ent.id) || { x: 300, y: 300 };
                const isSelected = selectedNodeId === ent.id;
                const isHighlighted = isHighlightedNode(ent.id);

                return (
                  <g
                    key={ent.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNodeId(ent.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing selection aura */}
                    {(isSelected || isHighlighted) && (
                      <circle
                        r="26"
                        fill="none"
                        stroke={isHighlighted ? '#f59e0b' : '#34d399'}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                    )}

                    {/* Geometric Shape depending on Entity Type */}
                    {ent.type === 'PERSON' ? (
                      <g>
                        <circle
                          r="16"
                          fill="#0f160f"
                          stroke={isSelected ? '#34d399' : isHighlighted ? '#f59e0b' : '#f59e0b'}
                          strokeWidth={isSelected || isHighlighted ? 2.5 : 1.5}
                        />
                        <circle r="6" fill="#f59e0b" opacity="0.6" />
                      </g>
                    ) : ent.type === 'PHONE' || ent.type === 'SIM' ? (
                      <rect
                        x="-14"
                        y="-14"
                        width="28"
                        height="28"
                        fill="#0f160f"
                        stroke={isSelected ? '#34d399' : '#d97706'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                    ) : ent.type === 'VEHICLE' ? (
                      <polygon
                        points="0,-16 16,12 -16,12"
                        fill="#0f160f"
                        stroke={isSelected ? '#34d399' : '#f59e0b'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                    ) : ent.type === 'ACCOUNT' ? (
                      <polygon
                        points="-14,-14 14,-14 14,14 -14,14"
                        transform="rotate(45)"
                        fill="#0f160f"
                        stroke={isSelected ? '#34d399' : '#34d399'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                    ) : ent.type === 'LOCATION' || ent.type === 'TOWER' ? (
                      <polygon
                        points="0,-15 13,-7 13,8 0,16 -13,8 -13,-7"
                        fill="#0f160f"
                        stroke={isSelected ? '#34d399' : '#f59e0b'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                    ) : (
                      <circle
                        r="14"
                        fill="#0f160f"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* ID Label */}
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#fbbf24"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {ent.id.length > 5 ? ent.id.slice(0, 5) : ent.id}
                    </text>

                    {/* Secondary Entity Name Label */}
                    <text
                      textAnchor="middle"
                      y="26"
                      fill="#f59e0b"
                      fontSize="8"
                      fontFamily="monospace"
                      opacity={isSelected ? 1 : 0.85}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      pointerEvents="none"
                    >
                      {ent.label.length > 14 ? ent.label.slice(0, 13) + '..' : ent.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Bottom Canvas Legend & Overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 p-2 bg-black/85 border border-amber-500/30 text-[10px]">
            <div className="flex items-center gap-3">
              <span className="text-amber-500/70 font-bold">LEGEND:</span>
              <span>● PERSON</span>
              <span>■ PHONE/SIM</span>
              <span>▲ VEHICLE</span>
              <span>◆ ACCOUNT</span>
              <span>⬡ TOWER/LOC</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-300 font-bold">── DIRECT OBSERVED</span>
              <span className="text-amber-400 font-bold">╌╌ INFERRED HYPOTHESIS</span>
              <span className="text-red-400 font-bold">╌╌ CONTRADICTION</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE INTELLIGENCE PANEL (OR HIDDEN LINK DETAILS) */}
        {(selectedEntity || hiddenLinkActive) && (
          <div className="lg:col-span-4 xl:col-span-3 space-y-3 overflow-y-auto">
            {/* SECTION 10: HIDDEN LINK INTELLIGENCE BANNER */}
            {hiddenLinkActive && (
              <div className="p-3 bg-amber-950/40 border-2 border-amber-500 text-xs font-mono space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <div className="flex items-center justify-between pb-1 border-b border-amber-500/40">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    HIDDEN LINK DETECTED
                  </span>
                  <button onClick={() => setHiddenLinkActive(false)} className="text-amber-500 hover:text-amber-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2 bg-black/60 border border-amber-500/30 text-center font-bold text-sm text-amber-300">
                  RAVI KUMAR <span className="text-amber-500 font-normal">↝</span> SURESH
                </div>

                <div className="flex justify-between items-center py-1 border-b border-amber-500/20 text-[11px]">
                  <span className="text-amber-500/80">CONFIDENCE:</span>
                  <span className="text-amber-300 font-bold text-sm">67% [MEDIUM]</span>
                </div>

                {/* Evidence chain */}
                <div className="text-[11px] space-y-1">
                  <span className="text-amber-500/80 font-bold block">EVIDENCE:</span>
                  <div className="text-emerald-400 pl-1">+ repeated tower co-location (14 times)</div>
                  <div className="text-emerald-400 pl-1">+ shared vehicle Scorpio V-12</div>
                  <div className="text-emerald-400 pl-1">+ synchronized communication burst</div>
                  <div className="text-red-400 pl-1">- no direct calls between phones</div>
                  <div className="text-red-400 pl-1">- no direct financial transaction</div>
                </div>

                <div className="flex justify-between text-[10px] pt-1">
                  <span className="text-amber-500/70">EVIDENCE TYPE:</span>
                  <span className="font-bold text-amber-300">DERIVED + INFERRED</span>
                </div>

                {/* Warning notice */}
                <div className="p-1.5 bg-black/80 border border-amber-500/40 text-[9px] text-amber-400 leading-tight">
                  CLASSIFICATION: <span className="font-bold text-amber-200">HYPOTHESIS // UNCONFIRMED</span>.<br />
                  AI correlation only. Physical verification required.
                </div>

                <button
                  onClick={onNavigateToHypotheses}
                  className="w-full py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors text-center text-xs block"
                >
                  EXPAND IN HYPOTHESES TAB [→]
                </button>
              </div>
            )}

            {/* Selected Node Panel */}
            {selectedEntity && (
              <TerminalPanel
                title={`NODE INTELLIGENCE // ${selectedEntity.id}`}
                subtitle={selectedEntity.type}
                headerRight={
                  <button onClick={() => setSelectedNodeId(null)} className="text-amber-500 hover:text-amber-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                }
              >
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-amber-500/20">
                    <div>
                      <div className="font-bold text-amber-300 text-sm">{selectedEntity.label}</div>
                      {selectedEntity.alias && (
                        <div className="text-[10px] text-amber-500/80">Alias: {selectedEntity.alias}</div>
                      )}
                    </div>
                    <StatusBadge status={selectedEntity.state} size="sm" />
                  </div>

                  <ConfidenceMeter value={selectedEntity.confidence} label="INTELLIGENCE CONFIDENCE" />

                  <div className="p-2 bg-black/60 border border-amber-500/20 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-amber-500/70">FIRST SEEN:</span>
                      <span className="text-amber-300">{selectedEntity.firstSeen}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-500/70">LAST SEEN:</span>
                      <span className="text-amber-300">{selectedEntity.lastSeen}</span>
                    </div>
                    {selectedEntity.serviceProvider && (
                      <div className="flex justify-between">
                        <span className="text-amber-500/70">SERVICE:</span>
                        <span className="text-amber-300">{selectedEntity.serviceProvider}</span>
                      </div>
                    )}
                  </div>

                  {selectedEntity.notes && (
                    <div className="p-2 bg-black/40 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                      {selectedEntity.notes}
                    </div>
                  )}

                  {/* Connected relations */}
                  <div>
                    <div className="text-[10px] text-amber-500/80 font-bold uppercase mb-1">
                      DIRECT CONNECTIONS:
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {relationships
                        .filter((r) => r.source === selectedEntity.id || r.target === selectedEntity.id)
                        .map((r) => {
                          const targetNode = r.source === selectedEntity.id ? r.target : r.source;
                          return (
                            <div
                              key={r.id}
                              onClick={() => setSelectedNodeId(targetNode)}
                              className="p-1.5 bg-black/60 border border-amber-500/20 hover:border-amber-400 cursor-pointer flex justify-between items-center text-[10px]"
                            >
                              <span className="text-amber-300 font-bold">{r.type} ↝ {targetNode}</span>
                              <span className="text-amber-500/70">{r.evidenceType}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToEntity && onNavigateToEntity(selectedEntity.id)}
                    className="w-full py-1.5 bg-black border border-amber-500/50 hover:bg-amber-500/20 text-amber-300 font-bold text-center text-xs flex items-center justify-center gap-1"
                  >
                    <span>OPEN DOSSIER IN ENTITIES</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </TerminalPanel>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
