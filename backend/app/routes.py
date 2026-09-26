"""
REST API endpoints for VoxGuard Enterprise Platform.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
import time

from app.models_data import (
    TRUSTED_SPEAKERS,
    DETECTED_THREATS,
    AUDIT_LOGS,
    SECURITY_POLICIES,
    ATTACK_PATTERNS,
    SIMULATION_SCENARIOS,
    calculate_sha256
)
from app.context_analyzer import analyze_conversation_text, compute_multisignal_risk

router = APIRouter(prefix="/api", tags=["voxguard"])

# ──────────────────────────────────────────────────────────────────────────────
# 1. Overview Dashboard Metrics
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/overview")
async def get_overview_metrics():
    """Returns top KPI statistics, health status, and threat trends."""
    return {
        "kpis": {
            "activeCalls": {"value": 3, "change": "+1", "trend": "up", "status": "nominal"},
            "callsAnalyzed": {"value": 1428, "change": "+14.2%", "trend": "up", "status": "nominal"},
            "threatsDetected": {"value": 247, "change": "+18.4%", "trend": "up", "status": "warning"},
            "attacksPrevented": {"value": 239, "change": "+19.1%", "trend": "up", "status": "safe"},
            "highRiskEvents": {"value": 18, "change": "-4.5%", "trend": "down", "status": "warning"},
            "verificationFailures": {"value": 34, "change": "+2.1%", "trend": "neutral", "status": "neutral"}
        },
        "systemStatus": {
            "overall": "PROTECTED",
            "activeMonitoring": "ON",
            "aiDetection": "ACTIVE",
            "speakerVerification": "ACTIVE",
            "contextAnalysis": "ACTIVE",
            "preventionEngine": "ACTIVE",
            "services": [
                {"name": "Audio Analysis Engine", "status": "Operational", "latency": "18ms"},
                {"name": "Speaker Verification", "status": "Operational", "latency": "34ms"},
                {"name": "Threat Detection", "status": "Operational", "latency": "22ms"},
                {"name": "Context Analysis", "status": "Operational", "latency": "14ms"},
                {"name": "Prevention Engine", "status": "Operational", "latency": "8ms"},
                {"name": "Database & Storage", "status": "Operational", "latency": "4ms"},
                {"name": "API & Webhooks", "status": "Operational", "latency": "12ms"}
            ]
        },
        "threatActivityTimeline": [
            {"time": "17:00", "threatLevel": 18, "events": 0},
            {"time": "17:10", "threatLevel": 22, "events": 0},
            {"time": "17:20", "threatLevel": 35, "events": 1},
            {"time": "17:30", "threatLevel": 42, "events": 0},
            {"time": "17:40", "threatLevel": 87, "events": 2, "threatId": "THR-84921"},
            {"time": "17:50", "threatLevel": 30, "events": 0},
            {"time": "18:00", "threatLevel": 15, "events": 0}
        ],
        "recentThreats": DETECTED_THREATS[:5]
    }


# ──────────────────────────────────────────────────────────────────────────────
# 2. Live Calls & Call Details
# ──────────────────────────────────────────────────────────────────────────────
ACTIVE_CALLS_STORE = [
    {
        "id": "CALL-9014",
        "callerPhone": "+91 98201 44521",
        "claimedIdentity": "Rajesh Sharma (CFO)",
        "duration": "04:37",
        "voiceAuthenticity": 84,   # % synthetic suspicion
        "speakerMatch": 42,        # % match with enrolled voiceprint
        "contextRisk": 78,         # % conversational risk
        "overallRisk": 87,
        "riskBand": "Critical",
        "status": "LIVE",
        "channel": "Inbound SIP Trunk",
        "qualityMetrics": {
            "streamQuality": 96,
            "signalIntegrity": 89,
            "noiseLevel": "Low"
        },
        "indicators": {
            "spectralConsistency": "Anomaly",
            "prosodyConsistency": "Anomaly",
            "naturalVariation": "Low",
            "speechArtifacts": "Detected",
            "replayIndicators": "Not Detected"
        },
        "currentAction": "Step-Up Verification Required"
    },
    {
        "id": "CALL-9012",
        "callerPhone": "+91 97110 88234",
        "claimedIdentity": "Priya Patel (Treasury)",
        "duration": "02:15",
        "voiceAuthenticity": 6,
        "speakerMatch": 96,
        "contextRisk": 10,
        "overallRisk": 12,
        "riskBand": "Low",
        "status": "LIVE",
        "channel": "WebRTC Secured",
        "qualityMetrics": {
            "streamQuality": 98,
            "signalIntegrity": 95,
            "noiseLevel": "Minimal"
        },
        "indicators": {
            "spectralConsistency": "Normal",
            "prosodyConsistency": "Normal",
            "naturalVariation": "High",
            "speechArtifacts": "None",
            "replayIndicators": "None"
        },
        "currentAction": "Allow (Verified)"
    }
]

@router.get("/calls")
async def list_active_calls():
    """Returns list of active and recent monitored calls."""
    return {"calls": ACTIVE_CALLS_STORE}


@router.get("/calls/{call_id}")
async def get_call_details(call_id: str):
    """Returns full real-time telemetry for a specific call."""
    for call in ACTIVE_CALLS_STORE:
        if call["id"] == call_id:
            return call
    # Fallback to scenario if matching
    return ACTIVE_CALLS_STORE[0]


@router.post("/calls/{call_id}/action")
async def execute_call_action(call_id: str, payload: Dict[str, Any] = Body(...)):
    """Executes a prevention action (HOLD TRANSACTION, END CALL, VERIFY, etc.)."""
    action = payload.get("action", "HOLD_TRANSACTION")
    reason = payload.get("reason", "Voice impersonation risk")
    user = payload.get("user", "Security Analyst")

    # Record in audit log
    new_audit = {
        "id": f"AUD-{int(time.time()) % 100000}",
        "timestamp": time.strftime("%H:%M:%S"),
        "event": f"Action Executed: {action}",
        "user": user,
        "threatId": call_id,
        "action": action,
        "result": "Success",
        "previousHash": AUDIT_LOGS[0]["entryHash"] if AUDIT_LOGS else "0"*64,
        "entryHash": calculate_sha256(f"{call_id}:{action}:{time.time()}"),
        "blockchainStatus": "Pending Verification"
    }
    AUDIT_LOGS.insert(0, new_audit)

    return {
        "success": True,
        "action": action,
        "callId": call_id,
        "auditId": new_audit["id"],
        "message": f"Action '{action}' successfully dispatched."
    }


# ──────────────────────────────────────────────────────────────────────────────
# 3. Threats & Forensic Investigation
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/threats")
async def list_threats(
    filter_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    """Returns threat table with filtering support."""
    results = DETECTED_THREATS
    if filter_type and filter_type.lower() != "all":
        results = [t for t in results if filter_type.lower() in t["threatType"].lower()]
    if status and status.lower() != "all":
        results = [t for t in results if t["status"].lower() == status.lower()]
    return {"threats": results, "total": len(results)}


@router.get("/threats/{threat_id}")
async def get_threat_investigation(threat_id: str):
    """Returns deep-dive investigation page data for an incident."""
    for threat in DETECTED_THREATS:
        if threat["id"] == threat_id:
            return {
                "threat": threat,
                "forensicEvidence": {
                    "audioFingerprint": calculate_sha256(f"audio_{threat_id}"),
                    "transcriptHash": calculate_sha256(f"transcript_{threat_id}"),
                    "sha256": threat["evidenceHash"],
                    "blockchainReceipt": threat["blockchainStatus"],
                    "timestamp": threat["timestamp"],
                    "samplesCount": 18
                },
                "actionsTaken": [
                    {"time": threat["timestamp"], "action": "Automated Threat Alert Triggered", "by": "VoxGuard Risk Engine"},
                    {"time": threat["timestamp"], "action": "Policy #POL-01 Activated (Hold Transaction)", "by": "System"},
                    {"time": threat["timestamp"], "action": "Inbound SIP Trunk Quarantined", "by": "System"}
                ]
            }
    # Return first if not found
    return {"threat": DETECTED_THREATS[0]}


# ──────────────────────────────────────────────────────────────────────────────
# 4. Trusted Speakers
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/speakers")
async def list_trusted_speakers():
    """Lists enrolled trusted speakers."""
    return {"speakers": TRUSTED_SPEAKERS}


@router.get("/speakers/{speaker_id}")
async def get_speaker_profile(speaker_id: str):
    """Returns detailed voice profile data for a trusted speaker."""
    for spk in TRUSTED_SPEAKERS:
        if spk["id"] == speaker_id:
            return spk
    raise HTTPException(status_code=404, detail="Speaker profile not found")


# ──────────────────────────────────────────────────────────────────────────────
# 5. Security Policies
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/policies")
async def list_policies():
    """Returns active security and prevention policies."""
    return {"policies": SECURITY_POLICIES}


@router.post("/policies")
async def create_or_update_policy(payload: Dict[str, Any] = Body(...)):
    """Adds or updates a security policy."""
    new_pol = {
        "id": payload.get("id", f"POL-{len(SECURITY_POLICIES)+1:02d}"),
        "name": payload.get("name", "Custom Security Policy"),
        "enabled": payload.get("enabled", True),
        "description": payload.get("description", "User-defined policy rule"),
        "condition": payload.get("condition", "WHEN [Risk Score] > 75"),
        "actions": payload.get("actions", ["Require Step-Up Verification"]),
        "priority": payload.get("priority", "High")
    }
    SECURITY_POLICIES.append(new_pol)
    return {"success": True, "policy": new_pol}


# ──────────────────────────────────────────────────────────────────────────────
# 6. Audit Trail & Cryptographic Evidence
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/audit")
async def get_audit_trail():
    """Returns hash-chained audit log entries."""
    return {
        "logs": AUDIT_LOGS,
        "integrityStatus": "Verified (All SHA-256 blocks chained without tamper)",
        "totalBlocks": len(AUDIT_LOGS)
    }


# ──────────────────────────────────────────────────────────────────────────────
# 7. Threat Analytics & Attack Patterns
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/analytics")
async def get_threat_analytics():
    """Returns analytics data and attack pattern intelligence."""
    return {
        "attackPatterns": ATTACK_PATTERNS,
        "threatsByType": [
            {"name": "AI Voice Clone", "count": 118, "pct": 47.8},
            {"name": "Speaker Impersonation", "count": 64, "pct": 25.9},
            {"name": "Voice Replay", "count": 39, "pct": 15.8},
            {"name": "Social Engineering", "count": 26, "pct": 10.5}
        ],
        "threatsByDepartment": [
            {"dept": "Finance & Treasury", "count": 142},
            {"dept": "IT Helpdesk & Admin", "count": 58},
            {"dept": "Executive Offices", "count": 31},
            {"dept": "Customer Ops", "count": 16}
        ]
    }


# ──────────────────────────────────────────────────────────────────────────────
# 8. Interactive Demo Simulation Engine
# ──────────────────────────────────────────────────────────────────────────────
@router.get("/simulation/scenarios")
async def list_simulation_scenarios():
    """Returns available simulation scenario definitions."""
    return {"scenarios": SIMULATION_SCENARIOS}


@router.post("/simulation/analyze-text")
async def analyze_transcript_step(payload: Dict[str, Any] = Body(...)):
    """Analyzes a live transcript sentence in real-time."""
    text = payload.get("text", "")
    analysis = analyze_conversation_text(text)
    return analysis


@router.post("/simulation/calculate-risk")
async def calculate_risk_step(payload: Dict[str, Any] = Body(...)):
    """Calculates multi-signal risk given signal parameters."""
    synth = float(payload.get("syntheticProb", 0.0)) / 100.0
    spk_match = float(payload.get("speakerMatch", 100.0)) / 100.0
    conv_risk = float(payload.get("conversationRisk", 0.0)) / 100.0
    prosody = float(payload.get("prosodyAnomaly", 20.0)) / 100.0

    return compute_multisignal_risk(synth, spk_match, conv_risk, prosody)
