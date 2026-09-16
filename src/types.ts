export type EntityType = 
  | 'PERSON'
  | 'PHONE'
  | 'SIM'
  | 'VEHICLE'
  | 'ACCOUNT'
  | 'LOCATION'
  | 'TOWER'
  | 'EVENT'
  | 'DOMAIN'
  | 'IP'
  | 'ORGANIZATION';

export type EntityState = 'NEW' | 'LINKED' | 'NEEDS_VERIFICATION' | 'FLAGGED' | 'RESOLVED';

export interface Entity {
  id: string;
  label: string;
  alias?: string;
  type: EntityType;
  identifiersCount: number;
  state: EntityState;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  serviceProvider?: string;
  knownLocations?: string[];
  linkedEntities?: string[];
  imsiHash?: string;
  imeiHash?: string;
  notes?: string;
  photoPlaceholder?: string;
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
}

export type RelationshipType = 
  | 'CALLED'
  | 'USED'
  | 'OWNED'
  | 'CO-LOCATED'
  | 'TRAVELED'
  | 'TRANSACTED'
  | 'REGISTERED'
  | 'HOSTED'
  | 'ATTENDED'
  | 'MENTIONED_IN'
  | 'DERIVED_FROM'
  | 'INFERRED_FROM'
  | 'LINKED';

export type EvidenceType = 'DIRECT' | 'DERIVED' | 'INFERRED';
export type EdgeStyle = 'solid' | 'thin' | 'dashed' | 'red_dashed';

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  evidenceType: EvidenceType;
  edgeStyle: EdgeStyle;
  confidence: number;
  timestamp: string;
  sourceDoc: string;
  provenanceId: string;
  description: string;
  count?: number;
}

export interface EvidenceDocument {
  id: string;
  file: string;
  type: 'FIR' | 'CDR' | 'FINANCIAL' | 'CCTV' | 'CYBER_LOG' | 'VEHICLE_RTO';
  source: string;
  ingested: string;
  entitiesCount: number;
  status: 'PROCESSED' | 'INDEXING' | 'PENDING' | 'CORRELATING';
  confidence: number;
  hash: string;
  provenanceId: string;
  extractedEntities: string[];
  extractedRelationships: string[];
  summary: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  sourceEntityId: string;
  sourceEntityLabel: string;
  targetEntityId: string;
  targetEntityLabel: string;
  status: 'UNCONFIRMED' | 'IN_REVIEW' | 'VERIFIED' | 'DISMISSED';
  confidence: number; // 0.0 - 1.0
  evidenceFor: string[];
  evidenceAgainst: string[];
  evidenceType: 'DERIVED' | 'INFERRED' | 'DERIVED + INFERRED';
  createdDate: string;
  pathChain: string[];
}

export interface InformationGap {
  id: string;
  title: string;
  entityOrSubject: string;
  whyItMatters: {
    clustersConnected: number;
    entitiesConnected: number;
    eventsConnected: number;
  };
  informationGain: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  currentConfidence: number;
  recommendedEvidence: string;
  actionRequired: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface InvestigationLead {
  id: string;
  number: string;
  title: string;
  expectedGain: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  why: string;
  evidenceRequired: string;
  status: 'AWAITING_REVIEW' | 'APPROVED' | 'DISMISSED' | 'IN_PROGRESS';
  provenanceEvidenceId: string;
}

export interface Contradiction {
  id: string;
  title: string;
  entityId: string;
  entityLabel: string;
  sourceA: {
    docId: string;
    location: string;
    time: string;
    details: string;
  };
  sourceB: {
    docId: string;
    location: string;
    time: string;
    details: string;
  };
  conflictType: 'TEMPORAL-SPATIAL OVERLAP' | 'IDENTITY-ALIAS MISMATCH' | 'FINANCIAL RECORD DIVERGENCE';
  status: 'REQUIRES REVIEW' | 'RESOLVED' | 'UNRESOLVED';
  resolutionNotes?: string;
}

export interface IntelAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  timestamp: string;
  summary: string;
  entityIds?: string[];
}

export interface SystemAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'QUERY_EXEC' | 'ENTITY_LINKED' | 'GRAPH_MUTATION' | 'EVIDENCE_ACCESS' | 'HYPOTHESIS_GEN' | 'EXPORT';
  object: string;
  source: string;
  hash: string;
  status: 'VERIFIED' | 'AUTH_OK' | 'AUDITED';
}

export interface TimelineEventItem {
  id: string;
  timestamp: string;
  timeOffset: string; // T-30, T-14, etc.
  type: 'CALL' | 'TRANSACTION' | 'LOCATION' | 'DEVICE CHANGE' | 'FIR' | 'VEHICLE' | 'DOMAIN' | 'ALERT';
  description: string;
  primaryEntityId: string;
  secondaryEntityId?: string;
  location?: string;
  severity?: 'NORMAL' | 'HIGH' | 'SUSPICIOUS';
}
