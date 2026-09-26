"""
Multi-signal Security Risk Engine for VoxGuard.

Evaluates:
1. Voice Authenticity (Synthetic / Deepfake Probability)
2. Speaker Identity Verification (Voiceprint Match against claimed profile)
3. Prosody & Behavioral Anomalies (Pitch jitter, speech rate, pause rhythm)
4. Conversational & Contextual Intent Analysis (Financial transfers, credentials, urgency, avoidance)
5. Policy Evaluation & Recommended Response Action
"""

import re
from typing import Dict, Any, List

# Keyword and pattern matching dictionaries for conversation analysis
FINANCIAL_PATTERNS = [
    r"transfer", r"rupees", r"wire", r"amount", r"bank", r"payment", 
    r"₹", r"rs\.?", r"dollars", r"account", r"invoice", r"funds", r"liquidity"
]

CREDENTIAL_PATTERNS = [
    r"otp", r"password", r"passcode", r"pin", r"bypass", r"2fa", 
    r"mfa", r"okta", r"token", r"secret", r"credentials", r"login"
]

URGENCY_PATTERNS = [
    r"immediately", r"right now", r"urgent", r"hurry", r"emergency", 
    r"asap", r"no time", r"without delay", r"critical"
]

AVOIDANCE_PATTERNS = [
    r"don't have time", r"cannot verify", r"skip verification", 
    r"bypass procedure", r"later", r"trust me", r"board meeting"
]


def analyze_conversation_text(text: str) -> Dict[str, Any]:
    """
    Scans conversational text for social engineering signals.
    """
    lower = text.lower()
    financial_detected = any(re.search(pat, lower) for pat in FINANCIAL_PATTERNS)
    credential_detected = any(re.search(pat, lower) for pat in CREDENTIAL_PATTERNS)
    urgency_detected = any(re.search(pat, lower) for pat in URGENCY_PATTERNS)
    avoidance_detected = any(re.search(pat, lower) for pat in AVOIDANCE_PATTERNS)

    risk_addition = 0
    signals = []

    if financial_detected:
        risk_addition += 25
        signals.append({
            "type": "financial_request",
            "label": "Financial Transfer Request",
            "weight": 25,
            "description": "Caller requested an immediate wire/payment transfer."
        })

    if credential_detected:
        risk_addition += 30
        signals.append({
            "type": "credential_request",
            "label": "Sensitive Credential Request",
            "weight": 30,
            "description": "Caller requested 2FA, OTP, or security credentials."
        })

    if urgency_detected:
        risk_addition += 15
        signals.append({
            "type": "urgency",
            "label": "High Conversational Urgency",
            "weight": 15,
            "description": "Artificial pressure applied to bypass dual-authorization."
        })

    if avoidance_detected:
        risk_addition += 20
        signals.append({
            "type": "avoidance",
            "label": "Verification Avoidance",
            "weight": 20,
            "description": "Caller actively avoided security verification protocols."
        })

    return {
        "financial_detected": financial_detected,
        "credential_detected": credential_detected,
        "urgency_detected": urgency_detected,
        "avoidance_detected": avoidance_detected,
        "risk_contribution": min(risk_addition, 60),
        "signals": signals
    }


def compute_multisignal_risk(
    synthetic_prob: float,       # 0.0 to 1.0 (from Wav2Vec2 & acoustic features)
    speaker_match_score: float,  # 0.0 to 1.0 (from voiceprint embedding comparison)
    conversation_risk: float,    # 0.0 to 1.0 (from conversational intent)
    prosody_anomaly: float = 0.2 # 0.0 to 1.0 (from pitch/rhythm variances)
) -> Dict[str, Any]:
    """
    Computes an integrated 0-100 Model Risk Estimate across independent signals:
    - Synthetic Voice: 40%
    - Speaker Identity Mismatch: 25%
    - Conversation Intent Threat: 20%
    - Prosody & Behavior Anomaly: 15%
    """
    speaker_mismatch = max(0.0, 1.0 - speaker_match_score)

    weighted_risk = (
        (synthetic_prob * 40.0) +
        (speaker_mismatch * 25.0) +
        (conversation_risk * 20.0) +
        (prosody_anomaly * 15.0)
    )

    overall_risk = int(round(max(0.0, min(100.0, weighted_risk))))

    if overall_risk >= 75:
        risk_level = "CRITICAL"
        recommended_action = "HOLD TRANSACTION & STEP-UP VERIFY"
    elif overall_risk >= 50:
        risk_level = "ELEVATED"
        recommended_action = "REQUEST DYNAMIC SECURITY PHRASE"
    elif overall_risk >= 25:
        risk_level = "MONITORING"
        recommended_action = "PASSIVE AUDIT"
    else:
        risk_level = "LOW"
        recommended_action = "ALLOW"

    return {
        "overall_risk": overall_risk,
        "risk_level": risk_level,
        "recommended_action": recommended_action,
        "breakdown": {
            "synthetic_voice_prob": round(synthetic_prob * 100, 1),
            "speaker_match": round(speaker_match_score * 100, 1),
            "speaker_mismatch": round(speaker_mismatch * 100, 1),
            "conversation_threat": round(conversation_risk * 100, 1),
            "prosody_anomaly": round(prosody_anomaly * 100, 1)
        }
    }
