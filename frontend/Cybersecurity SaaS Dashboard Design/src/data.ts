import type { ThreatRecord, LiveCall, Speaker, AuditEvent } from './types';

export const recentThreats: ThreatRecord[] = [
  { id: '84921', time: '17:41', caller: '+91 98XXX XXXXX', claimedIdentity: 'Finance Manager', threatType: 'AI Voice', riskScore: 87, action: 'Transaction Held', status: 'blocked' },
  { id: '84920', time: '17:26', caller: '+91 77XXX XXXXX', claimedIdentity: 'CEO', threatType: 'Speaker Mismatch', riskScore: 76, action: 'Verification', status: 'investigating' },
  { id: '84918', time: '16:54', caller: '+91 90XXX XXXXX', claimedIdentity: 'HR Manager', threatType: 'Replay Attack', riskScore: 69, action: 'Verification', status: 'resolved' },
  { id: '84915', time: '16:31', caller: '+1 415 XXX XXXX', claimedIdentity: 'IT Director', threatType: 'Social Engineering', riskScore: 73, action: 'Escalated', status: 'resolved' },
  { id: '84911', time: '15:48', caller: '+44 7XXX XXXXXX', claimedIdentity: 'CFO', threatType: 'AI Voice', riskScore: 91, action: 'Transaction Held', status: 'blocked' },
  { id: '84906', time: '15:12', caller: '+91 63XXX XXXXX', claimedIdentity: 'Operations Head', threatType: 'Identity Mismatch', riskScore: 65, action: 'Verification', status: 'resolved' },
  { id: '84901', time: '14:37', caller: '+91 84XXX XXXXX', claimedIdentity: 'Finance Manager', threatType: 'Suspicious Request', riskScore: 58, action: 'Monitored', status: 'resolved' },
];

export const liveCalls: LiveCall[] = [
  { id: 'lc-001', caller: '+91 98XXX XXXXX', claimedIdentity: 'Finance Manager', duration: '04:37', voiceAuthenticity: 82, speakerMatch: 71, contextRisk: 'high', overallRisk: 78, status: 'high-risk' },
  { id: 'lc-002', caller: '+91 77XXX XXXXX', claimedIdentity: 'Regional Director', duration: '01:12', voiceAuthenticity: 34, speakerMatch: 91, contextRisk: 'low', overallRisk: 22, status: 'safe' },
  { id: 'lc-003', caller: '+44 7XXX XXXXXX', claimedIdentity: 'IT Support', duration: '07:03', voiceAuthenticity: 61, speakerMatch: 67, contextRisk: 'medium', overallRisk: 55, status: 'suspicious' },
  { id: 'lc-004', caller: '+1 650 XXX XXXX', claimedIdentity: 'Sales Director', duration: '00:48', voiceAuthenticity: 18, speakerMatch: 96, contextRisk: 'low', overallRisk: 14, status: 'safe' },
];

export const trustedSpeakers: Speaker[] = [
  { id: 'sp-001', name: 'Rajesh Sharma', role: 'Finance Manager', department: 'Finance', voiceMatch: 94, lastVerified: 'Today, 14:32', status: 'active', enrollmentDate: '2024-03-15', verificationScore: 96, totalCalls: 247, alerts: 2 },
  { id: 'sp-002', name: 'Priya Nair', role: 'Chief Executive Officer', department: 'Executive', voiceMatch: 98, lastVerified: 'Today, 09:15', status: 'active', enrollmentDate: '2024-01-08', verificationScore: 99, totalCalls: 183, alerts: 0 },
  { id: 'sp-003', name: 'Arjun Mehta', role: 'Chief Financial Officer', department: 'Finance', voiceMatch: 96, lastVerified: 'Yesterday, 17:44', status: 'active', enrollmentDate: '2024-02-20', verificationScore: 97, totalCalls: 312, alerts: 1 },
  { id: 'sp-004', name: 'Sunita Kapoor', role: 'HR Director', department: 'Human Resources', voiceMatch: 89, lastVerified: '2 days ago', status: 'active', enrollmentDate: '2024-04-10', verificationScore: 91, totalCalls: 128, alerts: 3 },
  { id: 'sp-005', name: 'Vikram Singh', role: 'IT Director', department: 'Technology', voiceMatch: 92, lastVerified: 'Today, 11:20', status: 'active', enrollmentDate: '2024-03-01', verificationScore: 94, totalCalls: 89, alerts: 0 },
  { id: 'sp-006', name: 'Anita Desai', role: 'Operations Head', department: 'Operations', voiceMatch: 76, lastVerified: '5 days ago', status: 'inactive', enrollmentDate: '2024-05-12', verificationScore: 82, totalCalls: 64, alerts: 1 },
];

export const auditEvents: AuditEvent[] = [
  { id: 'AEV-001', timestamp: '17:41:08', event: 'Threat Detected', threatId: '#84921', actor: 'System', action: 'Transaction Held', result: 'success', integrity: 'verified' },
  { id: 'AEV-002', timestamp: '17:41:05', event: 'Risk Threshold Exceeded', threatId: '#84921', actor: 'AI Engine', action: 'Step-Up Verification', result: 'success', integrity: 'verified' },
  { id: 'AEV-003', timestamp: '17:40:02', event: 'Voice Anomaly Detected', threatId: '#84921', actor: 'AI Engine', action: 'Alert Generated', result: 'success', integrity: 'verified' },
  { id: 'AEV-004', timestamp: '17:26:33', event: 'Speaker Mismatch', threatId: '#84920', actor: 'AI Engine', action: 'Verification Triggered', result: 'success', integrity: 'verified' },
  { id: 'AEV-005', timestamp: '17:26:30', event: 'Verification Started', threatId: '#84920', actor: 'Agent: Kumar', action: 'Identity Challenge', result: 'success', integrity: 'verified' },
  { id: 'AEV-006', timestamp: '17:24:11', event: 'Call Flagged', threatId: '#84920', actor: 'System', action: 'Alert Generated', result: 'success', integrity: 'verified' },
  { id: 'AEV-007', timestamp: '16:54:22', event: 'Replay Attack Detected', threatId: '#84918', actor: 'AI Engine', action: 'Call Blocked', result: 'success', integrity: 'verified' },
  { id: 'AEV-008', timestamp: '16:31:05', event: 'Incident Escalated', threatId: '#84915', actor: 'Agent: Reddy', action: 'Escalate to Tier 2', result: 'success', integrity: 'verified' },
  { id: 'AEV-009', timestamp: '15:48:47', event: 'High-Risk Call Blocked', threatId: '#84911', actor: 'System', action: 'Auto-Block', result: 'success', integrity: 'verified' },
  { id: 'AEV-010', timestamp: '15:12:33', event: 'Identity Verified', threatId: '#84906', actor: 'Agent: Sharma', action: 'Manual Verify', result: 'success', integrity: 'verified' },
];

export const threatActivityData = [
  { time: '00:00', threats: 2, risk: 45 },
  { time: '01:00', threats: 1, risk: 30 },
  { time: '02:00', threats: 0, risk: 20 },
  { time: '03:00', threats: 3, risk: 55 },
  { time: '04:00', threats: 1, risk: 35 },
  { time: '05:00', threats: 2, risk: 42 },
  { time: '06:00', threats: 4, risk: 68 },
  { time: '07:00', threats: 3, risk: 58 },
  { time: '08:00', threats: 6, risk: 82 },
  { time: '09:00', threats: 8, risk: 91 },
  { time: '10:00', threats: 5, risk: 74 },
  { time: '11:00', threats: 7, risk: 85 },
  { time: '12:00', threats: 4, risk: 62 },
  { time: '13:00', threats: 9, risk: 94 },
  { time: '14:00', threats: 6, risk: 78 },
  { time: '15:00', threats: 11, risk: 97 },
  { time: '16:00', threats: 8, risk: 88 },
  { time: '17:00', threats: 13, risk: 99 },
  { time: '17:41', threats: 15, risk: 100 },
];

export const analyticsData = {
  threatTypes: [
    { name: 'AI Voice', value: 38, color: '#EF4444' },
    { name: 'Replay Attack', value: 22, color: '#F59E0B' },
    { name: 'Speaker Mismatch', value: 19, color: '#8B6CF6' },
    { name: 'Social Engineering', value: 14, color: '#3D7DF5' },
    { name: 'Identity Mismatch', value: 7, color: '#12B981' },
  ],
  weeklyThreats: [
    { day: 'Mon', threats: 18, blocked: 15 },
    { day: 'Tue', threats: 24, blocked: 20 },
    { day: 'Wed', threats: 31, blocked: 27 },
    { day: 'Thu', threats: 22, blocked: 19 },
    { day: 'Fri', threats: 41, blocked: 36 },
    { day: 'Sat', threats: 15, blocked: 14 },
    { day: 'Sun', threats: 11, blocked: 10 },
  ],
  riskDistribution: [
    { range: '0–20', count: 312 },
    { range: '21–40', count: 189 },
    { range: '41–60', count: 243 },
    { range: '61–80', count: 156 },
    { range: '81–100', count: 89 },
  ],
};

export const attackPatterns = [
  {
    id: 'ap-001',
    name: 'Urgent Finance Impersonation',
    occurrences: 17,
    avgRisk: 82,
    trend: 'up',
    signals: ['AI-generated voice', 'Finance identity claimed', 'Urgent payment request', 'Verification avoidance'],
    firstSeen: '2024-11-14',
    lastSeen: 'Today, 17:41',
  },
  {
    id: 'ap-002',
    name: 'Executive Replay Attack',
    occurrences: 9,
    avgRisk: 78,
    trend: 'stable',
    signals: ['Replayed audio segments', 'Executive identity claimed', 'Wire transfer request', 'Prosody anomalies'],
    firstSeen: '2024-12-01',
    lastSeen: 'Yesterday, 15:22',
  },
  {
    id: 'ap-003',
    name: 'HR Data Extraction',
    occurrences: 12,
    avgRisk: 64,
    trend: 'down',
    signals: ['Speaker mismatch', 'HR identity claimed', 'Employee data requests', 'Social engineering tactics'],
    firstSeen: '2024-10-28',
    lastSeen: '3 days ago',
  },
];
