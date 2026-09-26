"""
Data models and in-memory mock/persistent data store for VoxGuard.
Includes:
- Enrolled Trusted Speakers
- Active & Historical Calls with multi-signal telemetry
- Detected Threats with forensic evidence & SHA-256 hashes
- Attack Pattern Intelligence
- Configurable Security Policies & Verification Rules
- Cryptographic Audit Log (with hash-chaining)
- Pre-packaged Demo Simulation Scenarios
"""

import time
import hashlib
from typing import Dict, List, Any, Optional

# ──────────────────────────────────────────────────────────────────────────────
# Helper: SHA-256 evidence hashing
# ──────────────────────────────────────────────────────────────────────────────
def calculate_sha256(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

# ──────────────────────────────────────────────────────────────────────────────
# Trusted Speakers Database
# ──────────────────────────────────────────────────────────────────────────────
TRUSTED_SPEAKERS = [
    {
        "id": "SPK-001",
        "name": "Rajesh Sharma",
        "role": "Chief Financial Officer",
        "department": "Finance & Treasury",
        "phone": "+91 98201 44521",
        "email": "r.sharma@enterprise.corp",
        "enrollmentDate": "2025-11-14",
        "voiceProfileConfidence": 96.4,
        "status": "Active",
        "verifiedCallsCount": 42,
        "lastVerified": "Today, 14:32",
        "knownDevices": ["iPhone 15 Pro (Corp-MDM)", "MacBook Pro M3 (Corp)"],
        "knownLocations": ["Mumbai HQ", "Bengaluru Office"],
        "baselineProsody": {
            "avgPitchHz": 128,
            "speakingRateWpm": 138,
            "pauseFrequency": "Normal (3.2s)",
            "jitterPercent": 0.42
        }
    },
    {
        "id": "SPK-002",
        "name": "Priya Patel",
        "role": "Head of Corporate Treasury",
        "department": "Treasury",
        "phone": "+91 97110 88234",
        "email": "p.patel@enterprise.corp",
        "enrollmentDate": "2025-12-02",
        "voiceProfileConfidence": 94.8,
        "status": "Active",
        "verifiedCallsCount": 31,
        "lastVerified": "Yesterday, 17:15",
        "knownDevices": ["Samsung Galaxy S24 (Corp-MDM)"],
        "knownLocations": ["Mumbai HQ", "New Delhi"],
        "baselineProsody": {
            "avgPitchHz": 210,
            "speakingRateWpm": 145,
            "pauseFrequency": "Normal (2.9s)",
            "jitterPercent": 0.38
        }
    },
    {
        "id": "SPK-003",
        "name": "Vikram Malhotra",
        "role": "Managing Director",
        "department": "Executive Board",
        "phone": "+91 98100 22001",
        "email": "v.malhotra@enterprise.corp",
        "enrollmentDate": "2025-10-08",
        "voiceProfileConfidence": 97.2,
        "status": "Active",
        "verifiedCallsCount": 58,
        "lastVerified": "Sep 24, 11:20",
        "knownDevices": ["iPhone 16 Pro Max (Secured)"],
        "knownLocations": ["London Office", "Mumbai HQ"],
        "baselineProsody": {
            "avgPitchHz": 115,
            "speakingRateWpm": 130,
            "pauseFrequency": "Deliberate (3.8s)",
            "jitterPercent": 0.35
        }
    },
    {
        "id": "SPK-004",
        "name": "Ananya Sen",
        "role": "VP Operations",
        "department": "Supply Chain & Ops",
        "phone": "+91 98450 77112",
        "email": "a.sen@enterprise.corp",
        "enrollmentDate": "2026-01-19",
        "voiceProfileConfidence": 93.5,
        "status": "Active",
        "verifiedCallsCount": 19,
        "lastVerified": "Sep 25, 16:45",
        "knownDevices": ["Pixel 9 Pro"],
        "knownLocations": ["Bengaluru Tech Park"],
        "baselineProsody": {
            "avgPitchHz": 225,
            "speakingRateWpm": 152,
            "pauseFrequency": "Rapid (2.2s)",
            "jitterPercent": 0.44
        }
    }
]

# ──────────────────────────────────────────────────────────────────────────────
# Pre-seeded Threats Data
# ──────────────────────────────────────────────────────────────────────────────
DETECTED_THREATS = [
    {
        "id": "THR-84921",
        "timestamp": "17:41:08",
        "date": "2026-09-26",
        "callerPhone": "+91 98201 44521 (Spoofed CLI)",
        "claimedIdentity": "Rajesh Sharma (CFO)",
        "threatType": "AI Voice + Financial Scam",
        "overallRisk": 87,
        "riskBand": "Critical",
        "voiceAuthenticityScore": 84,  # Synthetic probability
        "speakerMatchScore": 41,       # Identity match
        "actionTaken": "Transaction Held & Call Blocked",
        "status": "Blocked",
        "channel": "Inbound SIP Trunk",
        "evidenceHash": "a91f7d8ce6b2910fae12089ef0437612b73c4d81726a3109e4f58c73294be421",
        "blockchainStatus": "Verified (Block #491024)",
        "description": "Caller utilized a zero-shot voice clone of Rajesh Sharma demanding an urgent ₹85,000 vendor wire transfer without OTP verification.",
        "signals": [
            {"name": "Synthetic Voice", "value": "84% probability", "severity": "high"},
            {"name": "Speaker Identity Mismatch", "value": "41% match (Threshold > 85%)", "severity": "high"},
            {"name": "Vocoder Glitch Signature", "value": "High-frequency phase discontinuity (>4.2kHz)", "severity": "high"},
            {"name": "Social Engineering", "value": "High urgency + verification refusal", "severity": "high"}
        ]
    },
    {
        "id": "THR-84918",
        "timestamp": "16:22:45",
        "date": "2026-09-26",
        "callerPhone": "+91 99002 11342",
        "claimedIdentity": "Priya Patel (Treasury)",
        "threatType": "Voice Replay Attack",
        "overallRisk": 74,
        "riskBand": "High",
        "voiceAuthenticityScore": 76,
        "speakerMatchScore": 88,
        "actionTaken": "Step-Up Verification Failed",
        "status": "Blocked",
        "channel": "WebRTC Customer Gateway",
        "evidenceHash": "c47b8e192f038104de8291a7402c5e612984bb301fae73c9120938472910fa31",
        "blockchainStatus": "Verified (Block #490988)",
        "description": "Replay of previous recorded board call snippets. Detected flat room impulse response and repetitive spectral acoustic noise floor.",
        "signals": [
            {"name": "Replay Artifacts", "value": "Zero temporal entropy in ambient noise", "severity": "high"},
            {"name": "Liveness Challenge", "value": "Failed dynamic phrase repeat challenge", "severity": "high"}
        ]
    },
    {
        "id": "THR-84905",
        "timestamp": "14:15:30",
        "date": "2026-09-26",
        "callerPhone": "+91 97119 55431",
        "claimedIdentity": "IT Helpdesk Admin",
        "threatType": "Credential Harvesting",
        "overallRisk": 79,
        "riskBand": "High",
        "voiceAuthenticityScore": 68,
        "speakerMatchScore": 52,
        "actionTaken": "Session Terminated",
        "status": "Resolved",
        "channel": "Internal PBX",
        "evidenceHash": "81f09238472910fa31c47b8e192f038104de8291a7402c5e612984bb301fae73",
        "blockchainStatus": "Verified (Block #490812)",
        "description": "Impersonator attempting to extract Okta admin 2FA bypass code under pretense of routine security audit.",
        "signals": [
            {"name": "Credential Request", "value": "Admin 2FA Bypass / OTP requested", "severity": "high"},
            {"name": "Synthetic Prosody", "value": "Unnatural cadence & robotic pitch inflections", "severity": "medium"}
        ]
    }
]

# ──────────────────────────────────────────────────────────────────────────────
# Cryptographic Audit Log (Hash-Chained)
# ──────────────────────────────────────────────────────────────────────────────
INITIAL_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

AUDIT_LOGS = [
    {
        "id": "AUD-10041",
        "timestamp": "17:41:12",
        "event": "Transaction Held & Call Blocked",
        "user": "System (Automated Policy #POL-01)",
        "threatId": "THR-84921",
        "action": "Immediate Hold (₹85,000 Vendor Wire)",
        "result": "Success",
        "previousHash": INITIAL_HASH,
        "entryHash": calculate_sha256("AUD-10041:THR-84921:Transaction Held"),
        "blockchainStatus": "Verified (Block #491024)"
    },
    {
        "id": "AUD-10040",
        "timestamp": "17:41:08",
        "event": "Critical Impersonation Attack Intercepted",
        "user": "VoxGuard Risk Engine",
        "threatId": "THR-84921",
        "action": "Threat Flagged (Risk 87/100)",
        "result": "Escalated",
        "previousHash": calculate_sha256("AUD-10041:THR-84921:Transaction Held"),
        "entryHash": calculate_sha256("AUD-10040:THR-84921:Threat Flagged"),
        "blockchainStatus": "Verified (Block #491024)"
    },
    {
        "id": "AUD-10039",
        "timestamp": "16:23:01",
        "event": "Liveness Challenge Failed",
        "user": "Security Analyst (Neha S.)",
        "threatId": "THR-84918",
        "action": "Enforce Device Push Approval",
        "result": "Device Denied",
        "previousHash": calculate_sha256("AUD-10040:THR-84921:Threat Flagged"),
        "entryHash": calculate_sha256("AUD-10039:THR-84918:Device Denied"),
        "blockchainStatus": "Verified (Block #490988)"
    }
]

# ──────────────────────────────────────────────────────────────────────────────
# Configurable Security Policies
# ──────────────────────────────────────────────────────────────────────────────
SECURITY_POLICIES = [
    {
        "id": "POL-01",
        "name": "High-Risk Financial Impersonation Intercept",
        "enabled": True,
        "description": "Automatically freeze outgoing financial transactions if high voice cloning probability or speaker mismatch coincides with payment requests.",
        "condition": "WHEN [Risk Score] > 80 AND [Financial Request] = TRUE",
        "actions": ["Hold Transaction", "Require Step-Up Verification", "Alert SOC"],
        "priority": "Critical"
    },
    {
        "id": "POL-02",
        "name": "Synthetic Voice Stepped-Challenge",
        "enabled": True,
        "description": "Trigger dynamic cryptographic acoustic phrase challenge when synthetic probability crosses threshold.",
        "condition": "WHEN [Synthetic Probability] > 70%",
        "actions": ["Request Security Phrase", "Mute Audio Buffer"],
        "priority": "High"
    },
    {
        "id": "POL-03",
        "name": "Executive Speaker Mismatch Lockdown",
        "enabled": True,
        "description": "Enforce trusted mobile device biometric push if caller claims executive identity with low voiceprint match.",
        "condition": "WHEN [Claimed Role] = Executive AND [Speaker Match] < 75%",
        "actions": ["Send Verification to Trusted Device", "Escalate to Security"],
        "priority": "Critical"
    },
    {
        "id": "POL-04",
        "name": "Credential Harvesting Defense",
        "enabled": True,
        "description": "Terminate session and notify cybersecurity team if OTP, password, or security codes are requested over unverified voice channels.",
        "condition": "WHEN [Credential Request] = TRUE AND [Voice Authenticity] < 90%",
        "actions": ["End Call", "Trigger Incident Alert"],
        "priority": "Medium"
    }
]

# ──────────────────────────────────────────────────────────────────────────────
# Attack Pattern Intelligence
# ──────────────────────────────────────────────────────────────────────────────
ATTACK_PATTERNS = [
    {
        "id": "PAT-01",
        "name": "Urgent Finance Wire Impersonation",
        "occurrences": 19,
        "avgRisk": 86,
        "trend": "+24% this week",
        "commonCharacteristics": [
            "Neural TTS voice clone (ElevenLabs/VALL-E signature)",
            "Claimed CFO or Treasury Head identity",
            "Urgent ₹50,000 - ₹500,000 wire transfer request",
            "Reluctance to follow dual-custody authorization",
            "Background office noise overlay to mask vocoder buzz"
        ],
        "primaryTarget": "Accounts Payable & Treasury",
        "recommendedDefense": "Automated Transaction Hold + Step-Up Device Push"
    },
    {
        "id": "PAT-02",
        "name": "Executive Helpdesk 2FA Reset Hijack",
        "occurrences": 12,
        "avgRisk": 78,
        "trend": "+8% this week",
        "commonCharacteristics": [
            "Voice-cloned executive claiming to be travelling abroad",
            "Request for emergency MFA / Okta reset or VIP bypass",
            "High conversational urgency and simulated phone static"
        ],
        "primaryTarget": "IT Service Desk",
        "recommendedDefense": "Enforce Out-of-Band Video Verification"
    },
    {
        "id": "PAT-03",
        "name": "Board Meeting Recorded Snippet Replay",
        "occurrences": 8,
        "avgRisk": 72,
        "trend": "Stable",
        "commonCharacteristics": [
            "High speaker biometric match (genuine voice recorded from earnings calls)",
            "Zero temporal entropy and abrupt background acoustic cuts",
            "Failures during dynamic interactive questions"
        ],
        "primaryTarget": "Investor Relations & Secretarial",
        "recommendedDefense": "Random Acoustic Phrase Challenge"
    }
]

# ──────────────────────────────────────────────────────────────────────────────
# Pre-Packaged Demo Simulation Scenarios
# ──────────────────────────────────────────────────────────────────────────────
SIMULATION_SCENARIOS = {
    "mixed_attack": {
        "id": "mixed_attack",
        "name": "Mixed Attack (AI Voice + Impersonation + Wire Transfer)",
        "caller": "Unknown Caller (+91 98201 44521 Spoofed)",
        "claimedIdentity": "Rajesh Sharma (CFO)",
        "duration": "04:37",
        "initialRisk": 22,
        "finalRisk": 88,
        "syntheticProb": 84,
        "speakerMatch": 42,
        "transcriptSteps": [
            {"time": "00:08", "speaker": "Analyst", "text": "Hello, Treasury Operations desk. How may I assist you?"},
            {"time": "00:22", "speaker": "Caller", "text": "Hello, this is Rajesh Sharma. I am currently in London for board meetings.", "tag": None},
            {"time": "01:04", "speaker": "Caller", "text": "I have an emergency vendor invoice that needs immediate processing.", "tag": "Anomalous pitch variation flagged"},
            {"time": "02:11", "speaker": "Analyst", "text": "Understood Mr. Sharma, please send the requisition through the portal."},
            {"time": "02:45", "speaker": "Caller", "text": "I can't access the portal right now. Transfer ₹85,000 immediately to vendor account #092144.", "tag": "⚠️ FINANCIAL REQUEST DETECTED (+24 Risk)"},
            {"time": "03:15", "speaker": "Caller", "text": "I don't have time to verify this or wait for approvals. Do it right now!", "tag": "🔴 URGENCY & VERIFICATION AVOIDANCE (+32 Risk)"},
            {"time": "04:02", "speaker": "System", "text": "Threshold Exceeded. Step-Up Verification & Transaction Hold Triggered.", "tag": "🚨 HIGH-RISK THREAT BLOCKED"}
        ],
        "timeline": [
            {"time": "00:00", "title": "Call Initialized", "desc": "Inbound SIP connection established"},
            {"time": "00:18", "title": "Claimed Identity Asserted", "desc": "Caller claims to be Rajesh Sharma (CFO)"},
            {"time": "01:04", "title": "Vocoder Discontinuity Detected", "desc": "Phase jitter >4.2kHz indicates neural vocoder synthesis"},
            {"time": "02:11", "title": "Speaker Identity Mismatch", "desc": "Voiceprint match dropped to 42% (Expected >85%)"},
            {"time": "02:48", "title": "Financial Wire Request Flagged", "desc": "₹85,000 transfer requested to unlisted account"},
            {"time": "03:20", "title": "Social Engineering Detected", "desc": "High urgency and verification resistance detected"},
            {"time": "04:02", "title": "Policy #POL-01 Triggered", "desc": "Automated Transaction Hold and Security Escalation executed"}
        ],
        "recommendedAction": "Hold Transaction & Enforce Step-Up Verification"
    },
    "ai_voice_clone": {
        "id": "ai_voice_clone",
        "name": "AI Voice Clone (Zero-Shot Synthesis)",
        "caller": "VoIP Gateway (+1 415 882 1092)",
        "claimedIdentity": "Vikram Malhotra (MD)",
        "duration": "03:12",
        "initialRisk": 15,
        "finalRisk": 82,
        "syntheticProb": 88,
        "speakerMatch": 54,
        "transcriptSteps": [
            {"time": "00:10", "speaker": "Analyst", "text": "Corporate Executive line, good afternoon."},
            {"time": "00:25", "speaker": "Caller", "text": "Good afternoon, Vikram Malhotra here.", "tag": None},
            {"time": "01:12", "speaker": "Caller", "text": "Please provide the credentials for the offshore liquidity account.", "tag": "⚠️ SENSITIVE CREDENTIAL REQUEST (+28 Risk)"},
            {"time": "02:05", "speaker": "System", "text": "High synthetic vocoder probability (88%). Speech artifacts detected.", "tag": "🔴 AI SYNTHETIC VOICE DETECTED"}
        ],
        "timeline": [
            {"time": "00:00", "title": "Call Initialized", "desc": "VoIP SIP call received"},
            {"time": "00:45", "title": "Acoustic Analysis", "desc": "Spectral roll-off anomalies detected at 3.9kHz"},
            {"time": "01:15", "title": "Credential Request", "desc": "Offshore account credentials requested"},
            {"time": "02:05", "title": "Synthetic Voice Confirmed", "desc": "Wav2Vec2 latent classification flagged as cloned"}
        ],
        "recommendedAction": "Mute Audio Stream & Challenge Identity"
    },
    "genuine_call": {
        "id": "genuine_call",
        "name": "Genuine Executive Call (Bonafide)",
        "caller": "Corporate Mobile (+91 97110 88234)",
        "claimedIdentity": "Priya Patel (Treasury)",
        "duration": "02:40",
        "initialRisk": 8,
        "finalRisk": 12,
        "syntheticProb": 4,
        "speakerMatch": 96,
        "transcriptSteps": [
            {"time": "00:05", "speaker": "Analyst", "text": "Treasury Operations, hello Priya."},
            {"time": "00:18", "speaker": "Caller", "text": "Hi team, calling to confirm the quarterly reconciliation summary is ready for review.", "tag": "✓ Natural prosodic inflection"},
            {"time": "01:10", "speaker": "Analyst", "text": "Yes, everything matches the general ledger."},
            {"time": "01:45", "speaker": "Caller", "text": "Perfect. I'll review it on my desktop shortly. Thank you.", "tag": "✓ Verified speaker match (96%)"}
        ],
        "timeline": [
            {"time": "00:00", "title": "Call Initialized", "desc": "Encrypted WebRTC connection"},
            {"time": "00:20", "title": "Voiceprint Verified", "desc": "Voice match 96% against enrolled profile"},
            {"time": "01:15", "title": "Acoustic Authenticity Clean", "desc": "Zero synthetic or replay artifacts detected"},
            {"time": "02:40", "title": "Call Finished Normally", "desc": "Status: Verified & Secure"}
        ],
        "recommendedAction": "None (Verified Safe)"
    }
}
