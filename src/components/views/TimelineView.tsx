import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Search,
  Calendar,
  Layers,
  MapPin,
  Users,
  FileText,
  AlertTriangle,
  ArrowRight,
  GitCommit
} from 'lucide-react';
import { TerminalPanel } from '../common/TerminalPanel';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { MOCK_TIMELINE_EVENTS } from '../../data/mockCaseData';
import { TimelineEventItem } from '../../types';

interface TimelineViewProps {
  onNavigateToEntity?: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onNavigateToEntity }) => {
  const [events] = useState<TimelineEventItem[]>(MOCK_TIMELINE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventItem>(MOCK_TIMELINE_EVENTS[0]);
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredEvents = events.filter((ev) => {
    return selectedType === 'ALL' || ev.type === selectedType;
  });

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-500/40 gap-2">
        <div>
          <div className="text-[11px] text-amber-500/70 font-bold tracking-widest uppercase">
            // CASE CONSOLE // TIMELINE
          </div>
          <div className="text-base md:text-lg font-black text-amber-300 tracking-wider">
            CHRONOLOGICAL EVENT CORRELATOR
          </div>
          <div className="text-[10px] text-amber-500/80">
            CDR CALL BURSTS // TOWER HOPS // TOLL LOGS // HAWALA TRANSFERS
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-1 border border-amber-500/40 font-bold">
            TIMELINE HORIZON: T-30 TO T+2
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-2 bg-[#0a0f0a] border border-amber-500/30 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-amber-500/70 uppercase">EVENT TYPE:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-black border border-amber-500/40 text-amber-300 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="ALL">ALL EVENT TYPES</option>
            <option value="CALL">COMMUNICATION (CALL)</option>
            <option value="LOCATION">CO-LOCATION / TOWER</option>
            <option value="VEHICLE">VEHICLE / TOLL</option>
            <option value="TRANSACTION">TRANSACTION (HAWALA/BANK)</option>
            <option value="DEVICE CHANGE">DEVICE CHANGE</option>
            <option value="FIR">FIR POLICE LODGEMENT</option>
            <option value="DOMAIN">DOMAIN / CYBER</option>
          </select>
        </div>

        <div className="text-[10px] text-amber-500/60 ml-auto">
          CHRONOLOGY SPAN: 17 AUG 2026 – 16 SEP 2026 ({filteredEvents.length} INCIDENTS)
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: TIMELINE TRACK + EVENT INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* TIMELINE LIST (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="relative pl-6 border-l-2 border-amber-500/40 space-y-3">
            {filteredEvents.map((ev) => {
              const isSelected = selectedEvent.id === ev.id;
              const isSuspicious = ev.severity === 'SUSPICIOUS' || ev.severity === 'HIGH';
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`relative p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-[#090e09] border-amber-500/30 hover:border-amber-400'
                  }`}
                >
                  {/* Timeline Node Bullet on left line */}
                  <div
                    className={`absolute -left-[31px] top-4 w-3.5 h-3.5 border-2 ${
                      isSelected
                        ? 'bg-amber-400 border-black shadow-[0_0_8px_#f59e0b]'
                        : isSuspicious
                        ? 'bg-red-500 border-black animate-pulse'
                        : 'bg-black border-amber-500'
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <span className="px-1.5 py-0.5 bg-black/60 border border-amber-500/30 text-[10px] text-amber-400">
                        {ev.timeOffset}
                      </span>
                      <span>{ev.timestamp}</span>
                      <span className="text-amber-500/50">|</span>
                      <span className="text-xs text-amber-200">{ev.type}</span>
                    </div>
                    {ev.severity && <StatusBadge status={ev.severity} size="sm" />}
                  </div>

                  <p className="text-amber-400/90 text-[11px] mb-2 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Footer tags */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-amber-500/70 border-t border-amber-500/20 pt-1.5">
                    <div className="flex items-center gap-1.5 truncate max-w-xs">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{ev.location || 'Maharashtra Sector'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-bold">{ev.primaryEntityId}</span>
                      {ev.secondaryEntityId && (
                        <span>↝ {ev.secondaryEntityId}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EVENT DETAIL INSPECTOR (5 cols) */}
        <div className="lg:col-span-5">
          {selectedEvent && (
            <TerminalPanel
              title={`EVENT DOSSIER // ${selectedEvent.id}`}
              subtitle={selectedEvent.type}
            >
              <div className="space-y-3 text-xs">
                {/* Event Name & Time */}
                <div className="p-2.5 bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-amber-300">{selectedEvent.type} EVENT</span>
                    <span className="text-amber-400 text-[11px] font-bold">OFFSET: {selectedEvent.timeOffset}</span>
                  </div>
                  <div className="text-amber-500/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedEvent.timestamp}</span>
                  </div>
                </div>

                {selectedEvent.severity && (
                  <div className="flex justify-between items-center py-1 border-b border-amber-500/20">
                    <span className="text-amber-500/70">INVESTIGATIVE SEVERITY:</span>
                    <StatusBadge status={selectedEvent.severity} size="sm" />
                  </div>
                )}

                {/* Description */}
                <div className="p-2.5 bg-black/40 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                  {selectedEvent.description}
                </div>

                {/* Primary & Secondary Entities */}
                <div className="space-y-2">
                  <div className="text-[10px] text-amber-500/80 font-bold uppercase">
                    INVOLVED ENTITY NODES:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onNavigateToEntity && onNavigateToEntity(selectedEvent.primaryEntityId)}
                      className="px-2.5 py-1 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors font-mono text-[11px] flex items-center gap-1.5"
                    >
                      <span className="text-amber-500/70">PRIMARY:</span>
                      <span className="font-bold">{selectedEvent.primaryEntityId}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>

                    {selectedEvent.secondaryEntityId && (
                      <button
                        onClick={() => onNavigateToEntity && onNavigateToEntity(selectedEvent.secondaryEntityId!)}
                        className="px-2.5 py-1 bg-black border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors font-mono text-[11px] flex items-center gap-1.5"
                      >
                        <span className="text-amber-500/70">TARGET:</span>
                        <span className="font-bold">{selectedEvent.secondaryEntityId}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                {selectedEvent.location && (
                  <div className="p-2.5 bg-black/60 border border-amber-500/20 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-amber-500/70">PHYSICAL LOCATION:</span>
                      <span className="font-bold text-amber-300">{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </TerminalPanel>
          )}
        </div>
      </div>
    </div>
  );
};
