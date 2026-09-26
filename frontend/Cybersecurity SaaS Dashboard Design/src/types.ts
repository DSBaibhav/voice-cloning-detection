export type Page =
  | 'dashboard'
  | 'live-calls'
  | 'call-history'
  | 'threat-center'
  | 'trusted-speakers'
  | 'voice-profiles'
  | 'verification'
  | 'threat-analytics'
  | 'attack-patterns'
  | 'prevention-center'
  | 'security-policies'
  | 'audit-logs'
  | 'evidence'
  | 'integrity'
  | 'notifications'
  | 'integrations'
  | 'settings'
  | 'live-call-analysis'
  | 'threat-investigation'
  | 'speaker-profile';

export type RiskLevel = 'safe' | 'analyzing' | 'suspicious' | 'high-risk' | 'blocked' | 'verified' | 'offline';

export interface ThreatRecord {
  id: string;
  time: string;
  caller: string;
  claimedIdentity: string;
  threatType: string;
  riskScore: number;
  action: string;
  status: 'blocked' | 'investigating' | 'resolved' | 'active';
}

export interface LiveCall {
  id: string;
  caller: string;
  claimedIdentity: string;
  duration: string;
  voiceAuthenticity: number;
  speakerMatch: number;
  contextRisk: 'low' | 'medium' | 'high';
  overallRisk: number;
  status: 'high-risk' | 'suspicious' | 'safe' | 'analyzing';
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  department: string;
  voiceMatch: number;
  lastVerified: string;
  status: 'active' | 'inactive' | 'suspended';
  enrollmentDate: string;
  verificationScore: number;
  totalCalls: number;
  alerts: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  threatId: string;
  actor: string;
  action: string;
  result: 'success' | 'failure' | 'pending';
  integrity: 'verified' | 'pending';
}
