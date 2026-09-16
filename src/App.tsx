/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TerminalAlertProvider } from './context/TerminalAlertContext';
import { TerminalShell, NavTab } from './components/layout/TerminalShell';
import { CaseOverview } from './components/views/CaseOverview';
import { EvidenceFiles } from './components/views/EvidenceFiles';
import { EntitiesView } from './components/views/EntitiesView';
import { GraphIntelligence } from './components/views/GraphIntelligence';
import { MapIntelligence } from './components/views/MapIntelligence';
import { TimelineView } from './components/views/TimelineView';
import { WorkbenchView } from './components/views/WorkbenchView';
import { HypothesesView } from './components/views/HypothesesView';
import { ContradictionsView } from './components/views/ContradictionsView';
import { InformationGapsView } from './components/views/InformationGapsView';
import { LeadsActionsView } from './components/views/LeadsActionsView';
import { AIInvestigatorView } from './components/views/AIInvestigatorView';
import { DataIngestionView } from './components/views/DataIngestionView';
import { SystemAuditView } from './components/views/SystemAuditView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('E-004');

  const handleNavigateToEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveTab('entities');
  };

  const handleNavigateToGraphWithEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveTab('graph');
  };

  const handleNavigateToMapWithEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveTab('map');
  };

  return (
    <TerminalAlertProvider>
      <TerminalShell activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'overview' && (
          <CaseOverview
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectEntity={handleNavigateToEntity}
            onOpenHiddenLink={() => setActiveTab('graph')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceFiles
            onSelectEntity={handleNavigateToEntity}
            onNavigateToGraph={() => setActiveTab('graph')}
          />
        )}

        {activeTab === 'entities' && (
          <EntitiesView
            selectedEntityId={selectedEntityId}
            onSelectEntityId={setSelectedEntityId}
            onNavigateToGraphWithEntity={handleNavigateToGraphWithEntity}
            onNavigateToMapWithEntity={handleNavigateToMapWithEntity}
          />
        )}

        {activeTab === 'graph' && (
          <GraphIntelligence
            initialSelectedEntityId={selectedEntityId}
            onNavigateToEntity={handleNavigateToEntity}
            onNavigateToHypotheses={() => setActiveTab('hypotheses')}
          />
        )}

        {activeTab === 'map' && (
          <MapIntelligence
            initialEntityId={selectedEntityId}
            onNavigateToEntity={handleNavigateToEntity}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView onNavigateToEntity={handleNavigateToEntity} />
        )}

        {activeTab === 'workbench' && (
          <WorkbenchView
            onNavigateToGraph={() => setActiveTab('graph')}
            onNavigateToHypotheses={() => setActiveTab('hypotheses')}
          />
        )}

        {activeTab === 'hypotheses' && (
          <HypothesesView
            onNavigateToEvidence={() => setActiveTab('evidence')}
            onNavigateToLeads={() => setActiveTab('leads')}
          />
        )}

        {activeTab === 'contradictions' && (
          <ContradictionsView
            onNavigateToLeads={() => setActiveTab('leads')}
          />
        )}

        {activeTab === 'gaps' && (
          <InformationGapsView
            onNavigateToLeads={() => setActiveTab('leads')}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsActionsView />
        )}

        {activeTab === 'ai_investigator' && (
          <AIInvestigatorView />
        )}

        {activeTab === 'ingestion' && (
          <DataIngestionView />
        )}

        {activeTab === 'audit' && (
          <SystemAuditView />
        )}
      </TerminalShell>
    </TerminalAlertProvider>
  );
}
