/**
 * Simulation Engine for VoxGuard
 * Provides realistic tick-by-tick attack and defense scenarios.
 */

export const SIMULATION_SCENARIOS = {
  mixed_attack: {
    id: 'mixed_attack',
    name: 'Mixed Attack (AI Voice + Impersonation + Wire Transfer)',
    caller: 'Unknown Caller (+91 98201 44521 Spoofed)',
    phone: '+91 98201 44521',
    claimedIdentity: 'Rajesh Sharma',
    claimedRole: 'Chief Financial Officer',
    durationTotal: 18, // compressed seconds for demo
    steps: [
      {
        tick: 1,
        time: '00:08',
        speaker: 'Analyst',
        text: 'Hello, Treasury Operations desk. How may I assist you?',
        risk: 12,
        syntheticProb: 15,
        speakerMatch: 88,
        contextRisk: 5,
        tag: null,
        timelineEvent: { time: '00:00', title: 'Call Initialized', desc: 'Inbound SIP connection established' }
      },
      {
        tick: 4,
        time: '00:24',
        speaker: 'Caller',
        text: 'Hello, this is Rajesh Sharma. I am currently in London for emergency board meetings.',
        risk: 28,
        syntheticProb: 44,
        speakerMatch: 72,
        contextRisk: 15,
        tag: null,
        timelineEvent: { time: '00:20', title: 'Claimed Identity Asserted', desc: 'Caller claims to be Rajesh Sharma (CFO)' }
      },
      {
        tick: 7,
        time: '01:05',
        speaker: 'Caller',
        text: 'I have an urgent vendor invoice that needs immediate processing today.',
        risk: 45,
        syntheticProb: 68,
        speakerMatch: 59,
        contextRisk: 35,
        tag: 'Anomalous pitch & vocoder phase jitter detected',
        timelineEvent: { time: '01:04', title: 'Vocoder Discontinuity Detected', desc: 'Phase jitter >4.2kHz indicates neural synthesis' }
      },
      {
        tick: 10,
        time: '02:11',
        speaker: 'Analyst',
        text: 'Understood Mr. Sharma, please submit the requisition via the SAP approval portal.',
        risk: 54,
        syntheticProb: 75,
        speakerMatch: 48,
        contextRisk: 42,
        tag: null,
        timelineEvent: { time: '02:11', title: 'Speaker Identity Mismatch', desc: 'Voiceprint match dropped to 48% (Expected >85%)' }
      },
      {
        tick: 13,
        time: '02:48',
        speaker: 'Caller',
        text: 'I cannot access the portal from here! Transfer ₹85,000 immediately to vendor account #092144!',
        risk: 76,
        syntheticProb: 84,
        speakerMatch: 41,
        contextRisk: 78,
        tag: '⚠️ FINANCIAL REQUEST DETECTED (+24 Risk)',
        timelineEvent: { time: '02:48', title: 'Financial Wire Request Flagged', desc: '₹85,000 transfer requested to unlisted account' }
      },
      {
        tick: 16,
        time: '03:15',
        speaker: 'Caller',
        text: 'I do not have time to verify this or wait for approvals. Authorize it immediately!',
        risk: 87,
        syntheticProb: 86,
        speakerMatch: 38,
        contextRisk: 92,
        tag: '🔴 URGENCY & VERIFICATION AVOIDANCE (+32 Risk)',
        timelineEvent: { time: '03:20', title: 'Social Engineering Detected', desc: 'High urgency and verification resistance' }
      },
      {
        tick: 18,
        time: '04:02',
        speaker: 'System',
        text: 'Risk Threshold Exceeded (87/100). Step-Up Verification & Transaction Hold Triggered.',
        risk: 87,
        syntheticProb: 88,
        speakerMatch: 38,
        contextRisk: 92,
        tag: '🚨 CRITICAL IMPERSONATION BLOCKED',
        timelineEvent: { time: '04:02', title: 'Policy #POL-01 Triggered', desc: 'Automated Transaction Hold and Security Escalation executed' },
        triggerAction: 'HOLD_TRANSACTION'
      }
    ]
  },
  ai_voice_clone: {
    id: 'ai_voice_clone',
    name: 'AI Voice Clone (Zero-Shot Synthesis)',
    caller: 'VoIP Gateway (+1 415 882 1092)',
    phone: '+1 415 882 1092',
    claimedIdentity: 'Vikram Malhotra',
    claimedRole: 'Managing Director',
    durationTotal: 12,
    steps: [
      {
        tick: 1,
        time: '00:10',
        speaker: 'Analyst',
        text: 'Executive Helpdesk, good afternoon.',
        risk: 15,
        syntheticProb: 20,
        speakerMatch: 90,
        contextRisk: 10,
        tag: null,
        timelineEvent: { time: '00:00', title: 'Call Initialized', desc: 'VoIP Trunk inbound' }
      },
      {
        tick: 5,
        time: '00:35',
        speaker: 'Caller',
        text: 'Hello, Vikram Malhotra here. Can you reset my primary MFA device token?',
        risk: 52,
        syntheticProb: 74,
        speakerMatch: 61,
        contextRisk: 55,
        tag: '⚠️ SENSITIVE CREDENTIAL RESET (+28 Risk)',
        timelineEvent: { time: '00:45', title: 'Acoustic Anomaly Flagged', desc: 'High-frequency spectral cutoff at 3.9kHz' }
      },
      {
        tick: 9,
        time: '01:15',
        speaker: 'Caller',
        text: 'I am boarding a flight, please bypass the standard video verification check.',
        risk: 82,
        syntheticProb: 88,
        speakerMatch: 52,
        contextRisk: 84,
        tag: '🔴 AI SYNTHETIC VOICE CONFIRMED (88%)',
        timelineEvent: { time: '01:15', title: 'Wav2Vec2 Latent Classification Flagged', desc: 'Synthesized vocoder envelope detected' }
      }
    ]
  },
  genuine_call: {
    id: 'genuine_call',
    name: 'Genuine Executive Call (Bonafide)',
    caller: 'Corporate Mobile (+91 97110 88234)',
    phone: '+91 97110 88234',
    claimedIdentity: 'Priya Patel',
    claimedRole: 'Head of Corporate Treasury',
    durationTotal: 10,
    steps: [
      {
        tick: 1,
        time: '00:05',
        speaker: 'Analyst',
        text: 'Treasury Operations, hello Priya.',
        risk: 8,
        syntheticProb: 5,
        speakerMatch: 96,
        contextRisk: 5,
        tag: '✓ Verified speaker match (96%)',
        timelineEvent: { time: '00:00', title: 'Call Initialized', desc: 'Encrypted WebRTC connection' }
      },
      {
        tick: 5,
        time: '00:25',
        speaker: 'Caller',
        text: 'Hi team, confirming the quarterly reconciliation summary is ready for sign-off.',
        risk: 9,
        syntheticProb: 4,
        speakerMatch: 96,
        contextRisk: 8,
        tag: '✓ Natural prosodic inflection & clean acoustics',
        timelineEvent: { time: '00:20', title: 'Voiceprint Verified', desc: 'Voice match 96% against enrolled profile' }
      },
      {
        tick: 9,
        time: '01:10',
        speaker: 'Caller',
        text: 'Thank you for preparing it on time. Have a good evening.',
        risk: 10,
        syntheticProb: 4,
        speakerMatch: 97,
        contextRisk: 6,
        tag: '✓ Verified Safe',
        timelineEvent: { time: '01:10', title: 'Call Verified Clean', desc: 'Zero synthetic or replay artifacts' }
      }
    ]
  },
  speaker_impersonation: {
    id: 'speaker_impersonation',
    name: 'Speaker Impersonation (Human Impersonator)',
    caller: 'Local Mobile (+91 98450 11928)',
    phone: '+91 98450 11928',
    claimedIdentity: 'Vikram Malhotra',
    claimedRole: 'Managing Director',
    durationTotal: 10,
    steps: [
      {
        tick: 1,
        time: '00:10',
        speaker: 'Caller',
        text: 'This is Vikram Malhotra speaking.',
        risk: 25,
        syntheticProb: 8,
        speakerMatch: 52,
        contextRisk: 10,
        tag: 'Human voice, but voiceprint match is only 52%',
        timelineEvent: { time: '00:10', title: 'Identity Mismatch', desc: 'Voiceprint similarity 52% (Expected >85%)' }
      },
      {
        tick: 6,
        time: '00:45',
        speaker: 'Caller',
        text: 'I lost my phone and need you to update my banking notification number right now.',
        risk: 72,
        syntheticProb: 12,
        speakerMatch: 45,
        contextRisk: 80,
        tag: '⚠️ SENSITIVE CONTACT CHANGE REQUEST',
        timelineEvent: { time: '00:45', title: 'Sensitive Account Mutation', desc: 'Attempt to change 2FA phone number' }
      }
    ]
  },
  replay_attack: {
    id: 'replay_attack',
    name: 'Replay Attack (Acoustic Noise Floor Repeat)',
    caller: 'Inbound Line (+91 99002 11342)',
    phone: '+91 99002 11342',
    claimedIdentity: 'Priya Patel',
    claimedRole: 'Head of Corporate Treasury',
    durationTotal: 10,
    steps: [
      {
        tick: 1,
        time: '00:15',
        speaker: 'Caller',
        text: 'Yes, proceed with the transfer as discussed in the earnings conference.',
        risk: 65,
        syntheticProb: 62,
        speakerMatch: 88,
        contextRisk: 45,
        tag: '⚠️ Zero temporal entropy in room acoustic impulse response',
        timelineEvent: { time: '00:15', title: 'Replay Signature Flagged', desc: 'Pre-recorded snippet replayed over speaker' }
      },
      {
        tick: 6,
        time: '00:40',
        speaker: 'System',
        text: 'Dynamic phrase challenge failed. Audio repeating identical background noise floor.',
        risk: 74,
        syntheticProb: 76,
        speakerMatch: 88,
        contextRisk: 60,
        tag: '🔴 REPLAY ATTACK BLOCKED',
        timelineEvent: { time: '00:40', title: 'Liveness Challenge Failed', desc: 'Caller failed interactive acoustic response' }
      }
    ]
  }
}
