import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Radio,
  Clock,
  Play,
  Pause,
  Layers,
  Filter,
  Eye,
  Navigation,
  Crosshair,
  AlertTriangle,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { useTerminalAlert } from '../../context/TerminalAlertContext';

interface MapIntelligenceProps {
  initialEntityId?: string;
  onNavigateToEntity?: (id: string) => void;
}

export const MapIntelligence: React.FC<MapIntelligenceProps> = ({
  initialEntityId,
  onNavigateToEntity
}) => {
  const { showAlert } = useTerminalAlert();
  const [selectedLocation, setSelectedLocation] = useState<string>('TOWER-Z42');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [timelineStep, setTimelineStep] = useState<number>(3); // 0 to 5
  const [filterLayer, setFilterLayer] = useState<'ALL' | 'TOWERS' | 'EVENTS' | 'MOVEMENT'>('ALL');
  const [highlightCoLocation, setHighlightCoLocation] = useState<boolean>(true);

  // Auto-play timeline animation
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineStep((step) => (step + 1) % 6);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Locations data
  const mapNodes = [
    {
      id: 'TOWER-Z42',
      name: 'Tower Z-042 (BTS-42)',
      type: 'TOWER',
      x: 380,
      y: 220,
      coverageRadius: 75,
      azimuth: 140,
      observations: ['E-001 (+91792148803)', 'E-004 (+919692826578)', 'E-015 (Suresh)'],
      coLocationEvents: 14,
      timeWindow: '22:30–23:15',
      status: 'INVESTIGATIVE LEAD',
      details: 'Critical intersection where target phone E-004 and courier Suresh repeated co-locations occurred.'
    },
    {
      id: 'LOC-QM',
      name: 'Quiet Market (North Gate)',
      type: 'LOCATION',
      x: 480,
      y: 160,
      coverageRadius: 40,
      observations: ['E-006 (Sentry-2)', 'V-12 (Scorpio)', 'EVENT-044'],
      coLocationEvents: 8,
      timeWindow: '23:00–23:45',
      status: 'CRIME SCENE / RENDEZVOUS',
      details: 'Extortion delivery drop zone identified in FIR_0042. Scorpio parked with engine running.'
    },
    {
      id: 'LOC-IND',
      name: 'Industrial Area Sector 4',
      type: 'LOCATION',
      x: 180,
      y: 280,
      coverageRadius: 50,
      observations: ['E-002 (Courier-Line)', 'E-005 (Logistics)', 'E-012 (Rakesh Verma)'],
      coLocationEvents: 6,
      timeWindow: '18:00–21:30',
      status: 'STAGING WAREHOUSE',
      details: 'Registered address for Apex Logistics shell firm and vehicle V-12 maintenance garage.'
    },
    {
      id: 'LOC-TOLL3',
      name: 'Expressway Toll 3',
      type: 'EVENT',
      x: 570,
      y: 380,
      coverageRadius: 35,
      observations: ['V-12 (MH-12-DE-4419)', 'EVENT-052'],
      coLocationEvents: 2,
      timeWindow: '03:22–03:25',
      status: 'TRANSIT INTERCEPT',
      details: 'FASTag electronic toll plaza capture traveling northwest towards Mumbai.'
    }
  ];

  // Auto-select location if initialEntityId is provided
  useEffect(() => {
    if (initialEntityId) {
      const match = mapNodes.find((node) =>
        node.observations.some((obs) => obs.includes(initialEntityId))
      );
      if (match) {
        setSelectedLocation(match.id);
      }
    }
  }, [initialEntityId]);

  const currentLocation = mapNodes.find((m) => m.id === selectedLocation) || mapNodes[0];

  // Animated movement path coordinates based on timeline step
  const vehiclePath = [
    { x: 180, y: 280, time: '21:30', label: 'Industrial Yard' },
    { x: 280, y: 250, time: '22:15', label: 'Shivajinagar' },
    { x: 380, y: 220, time: '22:45', label: 'Tower Z-042' },
    { x: 480, y: 160, time: '23:14', label: 'Quiet Market (Event-044)' },
    { x: 520, y: 270, time: '01:30', label: 'Bypass Highway' },
    { x: 570, y: 380, time: '03:22', label: 'Expressway Toll 3' }
  ];

  const currentVehiclePos = vehiclePath[timelineStep];

  return (
    <div className="space-y-3 font-mono text-xs h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2 shrink-0">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // MAP INTELLIGENCE
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            TACTICAL GEO-SPATIAL INTELLIGENCE
          </div>
          <div className="text-[10px] text-amber-500/80">
            BTS CELL TOWERS // GPS TRACKS // GEOFENCES // SURVEILLANCE CO-LOCATIONS
          </div>
        </div>

        {/* Timeline Playback Controls */}
        <div className="flex items-center gap-2 bg-[#0c120c] border border-amber-500/40 p-1.5 self-start sm:self-auto">
          <button
            onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
            className="px-2.5 py-1 bg-amber-500 text-black font-bold flex items-center gap-1 text-[10px] hover:bg-amber-400"
          >
            {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlayingTimeline ? 'PAUSE' : 'PLAY SIMULATION'}</span>
          </button>

          <span className="text-[10px] text-amber-500/70 px-1 border-l border-amber-500/30">
            T-STEP: {timelineStep + 1}/6
          </span>

          <input
            type="range"
            min="0"
            max="5"
            value={timelineStep}
            onChange={(e) => setTimelineStep(parseInt(e.target.value))}
            className="w-20 accent-amber-500 cursor-pointer"
          />

          <span className="text-[11px] font-bold text-amber-300 w-12 text-right">
            {vehiclePath[timelineStep].time}
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-2 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-amber-500/70">LAYER:</span>
            <select
              value={filterLayer}
              onChange={(e) => setFilterLayer(e.target.value as any)}
              className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-0.5 outline-none font-mono"
            >
              <option value="ALL">ALL LAYERS</option>
              <option value="TOWERS">CELL TOWERS ONLY</option>
              <option value="EVENTS">CRIME EVENTS ONLY</option>
              <option value="MOVEMENT">VEHICLE TRACKS ONLY</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-400">
            <input
              type="checkbox"
              checked={highlightCoLocation}
              onChange={(e) => setHighlightCoLocation(e.target.checked)}
              className="accent-amber-500"
            />
            <span>HIGHLIGHT CO-LOCATION SPIKES</span>
          </label>
        </div>

        <div className="text-[10px] text-amber-500/60 flex items-center gap-2">
          <span>LAT: 18.5204° N</span>
          <span>LNG: 73.8567° E</span>
          <span className="text-amber-400">PUNE / MAHARASHTRA SECTOR</span>
        </div>
      </div>

      {/* MAP GRID CANVAS + LOCATION INTELLIGENCE PANEL */}
      <div className="flex-1 min-h-[480px] grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* TACTICAL MAP SVG (8 cols) */}
        <div className="lg:col-span-8 bg-[#070b07] border border-amber-500/40 relative overflow-hidden flex flex-col">
          {/* Coordinate Reticle Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(to right, #f59e0b 1px, transparent 1px), linear-gradient(to bottom, #f59e0b 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* SVG Map Canvas */}
          <svg className="w-full h-full cursor-crosshair select-none" viewBox="0 0 700 500">
            {/* Geofence Boundary Outline */}
            <polygon
              points="140,180 320,120 540,100 620,300 580,440 260,420 120,340"
              fill="rgba(245, 158, 11, 0.03)"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            <text x="150" y="160" fill="#f59e0b" opacity="0.5" fontSize="8" fontFamily="monospace">
              [PUNE METROPOLITAN SURVEILLANCE GEOFENCE]
            </text>

            {/* Roads / Corridor vectors */}
            <path
              d="M 100 290 Q 240 270 380 220 T 480 160 T 570 380"
              fill="none"
              stroke="#78350f"
              strokeWidth="2"
              opacity="0.6"
            />
            <text x="320" y="270" fill="#92400e" fontSize="7" fontFamily="monospace">
              HIGHWAY ARTERIAL CORRIDOR 4
            </text>

            {/* Movement Breadcrumbs Path */}
            {(filterLayer === 'ALL' || filterLayer === 'MOVEMENT') && (
              <g>
                <path
                  d="M 180 280 L 280 250 L 380 220 L 480 160 L 520 270 L 570 380"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="5 3"
                  className="animate-pulse"
                />
                {vehiclePath.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === timelineStep ? 5 : 2.5}
                    fill={i <= timelineStep ? '#f59e0b' : '#78350f'}
                    stroke="#000"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}

            {/* Active Moving Vehicle Marker */}
            {(filterLayer === 'ALL' || filterLayer === 'MOVEMENT') && (
              <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
                <circle r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="animate-ping" />
                <polygon points="0,-8 7,6 -7,6" fill="#f59e0b" stroke="#000" strokeWidth="1" />
                <rect x="-40" y="-22" width="80" height="13" fill="#080c08" stroke="#f59e0b" strokeWidth="0.8" />
                <text textAnchor="middle" y="-13" fill="#fbbf24" fontSize="7" fontWeight="bold">
                  V-12 // {currentVehiclePos.time}
                </text>
              </g>
            )}

            {/* Towers & Sites */}
            {mapNodes.map((node) => {
              const isSelected = selectedLocation === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedLocation(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Radio coverage circle */}
                  {node.type === 'TOWER' && (
                    <g>
                      <circle
                        r={node.coverageRadius}
                        fill="rgba(245, 158, 11, 0.05)"
                        stroke="#f59e0b"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity={isSelected ? 0.8 : 0.3}
                      />
                      {/* Radar sweep line */}
                      <line
                        x1="0"
                        y1="0"
                        x2={node.coverageRadius * 0.7}
                        y2={-node.coverageRadius * 0.7}
                        stroke="#f59e0b"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    </g>
                  )}

                  {/* Node icon marker */}
                  {node.type === 'TOWER' ? (
                    <g>
                      <circle r="10" fill="#0c120c" stroke={isSelected ? '#34d399' : '#f59e0b'} strokeWidth="2" />
                      <line x1="-5" y1="4" x2="5" y2="4" stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1="-3" y1="0" x2="3" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1="0" y1="-6" x2="0" y2="6" stroke="#f59e0b" strokeWidth="1.5" />
                    </g>
                  ) : node.type === 'EVENT' ? (
                    <polygon
                      points="0,-10 10,0 0,10 -10,0"
                      fill="#ef4444"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  ) : (
                    <rect
                      x="-8"
                      y="-8"
                      width="16"
                      height="16"
                      fill="#0c120c"
                      stroke={isSelected ? '#34d399' : '#f59e0b'}
                      strokeWidth="2"
                    />
                  )}

                  {/* Label */}
                  <text
                    textAnchor="middle"
                    y="20"
                    fill={isSelected ? '#34d399' : '#fbbf24'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.name}
                  </text>

                  {/* Co-location badge */}
                  {highlightCoLocation && node.coLocationEvents > 5 && (
                    <g transform="translate(14, -12)">
                      <rect x="-12" y="-6" width="24" height="12" fill="#ef4444" stroke="#000" strokeWidth="0.8" />
                      <text textAnchor="middle" y="3" fill="#fff" fontSize="7" fontWeight="bold">
                        {node.coLocationEvents}x
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Bottom map status HUD */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between p-1.5 bg-black/80 border border-amber-500/30 text-[10px]">
            <div className="flex items-center gap-3">
              <span>● CELL TOWER</span>
              <span>■ PHYSICAL LOCATION</span>
              <span>◆ HIGHWAY TOLL EVENT</span>
            </div>
            <span className="text-amber-300 font-bold">CLICK PINS TO INSPECT TELEMETRY</span>
          </div>
        </div>

        {/* LOCATION INTELLIGENCE PANEL (4 cols) */}
        <div className="lg:col-span-4">
          <TerminalPanel
            title="LOCATION INTELLIGENCE"
            subtitle={currentLocation.id}
          >
            <div className="space-y-3 text-xs">
              {/* Location Title & Status */}
              <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-300 text-sm">{currentLocation.name}</span>
                  <StatusBadge status={currentLocation.status} size="sm" />
                </div>
                <div className="text-[11px] text-amber-500/80">
                  Sector Azimuth: 120°-240° // Coverage: {currentLocation.coverageRadius}m
                </div>
              </div>

              {/* Observed Entities Matching Prompt Requirements */}
              <div>
                <div className="text-[10px] text-amber-500/80 font-bold uppercase mb-1">
                  OBSERVATIONS / DETECTED PHONES:
                </div>
                <div className="space-y-1">
                  {currentLocation.observations.map((obs, i) => {
                    const extractedId = obs.match(/\b(E-\d+|V-\d+)\b/)?.[0];
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (extractedId && onNavigateToEntity) {
                            onNavigateToEntity(extractedId);
                          }
                        }}
                        className={`p-1.5 bg-black/60 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between gap-1.5 transition-colors ${
                          extractedId ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-950/40 group' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Crosshair className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{obs}</span>
                        </div>
                        {extractedId && (
                          <span className="text-[9px] text-amber-400 font-bold px-1 py-0.5 border border-amber-500/40 bg-amber-500/10 shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                            DOSSIER →
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 border border-amber-500/20 text-[11px]">
                <div>
                  <span className="text-[10px] text-amber-500/70 block">CO-LOCATION EVENTS:</span>
                  <span className="text-lg font-bold text-amber-300">{currentLocation.coLocationEvents}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-500/70 block">TIME WINDOW:</span>
                  <span className="font-bold text-amber-300">{currentLocation.timeWindow}</span>
                </div>
              </div>

              {/* Details text */}
              <div className="p-2 bg-black/40 border border-amber-500/20 text-[11px] text-amber-400/90 leading-relaxed">
                {currentLocation.details}
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-amber-500/30 space-y-1.5">
                <button
                  onClick={() =>
                    showAlert(
                      `Tactical cellular interception grid locked around ${currentLocation.name}. Real-time signal intercept active.`,
                      'WARNING'
                    )
                  }
                  className="w-full py-1.5 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors text-center text-xs"
                >
                  LOCK CELLULAR INTERCEPTION ZONE
                </button>
              </div>
            </div>
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
};
