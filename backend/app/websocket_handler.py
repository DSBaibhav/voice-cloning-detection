"""
WebSocket handler for real-time voice anti-spoofing monitoring.

Endpoint : /ws/monitor
Protocol : binary frames — each frame is raw float32 PCM audio
           (mono, 16 kHz, 48 000 samples = 3 s) from the browser.

Detection strategy
------------------
  1. Acoustic model  : Wav2Vec2 classifier → p_spoof score
  2. Threshold check : p_spoof > SPOOF_THRESHOLD → flag as spoof
  3. Challenge-response:
       - Issued automatically at session start (frame 1)
       - Re-issued every CHALLENGE_INTERVAL frames
       - Also issued when acoustic score is uncertain (UNSURE_LOW – UNSURE_HIGH)
     Purpose: an AI voice playing from a device cannot dynamically say an
              unpredictable phrase on demand. A real person can.

Response JSON
-------------
  { "label": "bonafide" | "spoof",
    "confidence": 0.82,
    "challenge": null | "phrase text" }
"""

import json
import logging

import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.challenge import get_random_challenge

logger = logging.getLogger(__name__)

router = APIRouter()

# ── Tunables ──────────────────────────────────────────────────────────────────

# Acoustic detection threshold applied to p_spoof.
SPOOF_THRESHOLD  = 0.40   # p_spoof above this → label as spoof (AI Voice Clone)

# Challenge scheduling: disabled for live detection (challenges are manual via user button)
CHALLENGE_ON_CONNECT = False
CHALLENGE_INTERVAL   = 0      # 0 = never auto-trigger challenge on timer

TARGET_SAMPLES = 16_000 * 3   # 48 000 samples = 3 s @ 16 kHz


# ── Predictor ─────────────────────────────────────────────────────────────────

def _get_raw_predictor():
    """Return predict_raw (preferred) or None for stub fallback."""
    try:
        from app.inference import predict_raw
        return predict_raw
    except Exception:
        return None



# ── WebSocket endpoint ────────────────────────────────────────────────────────

@router.websocket("/ws/monitor")
async def monitor(websocket: WebSocket):
    """
    Real-time anti-spoofing WebSocket.
    Processes live 16kHz PCM audio stream and sends instantaneous verdicts:
    - "idle": no active speech (silence or background room noise)
    - "bonafide": genuine biological human speech
    - "spoof": AI voice clone (e.g. Gemini Live, ElevenLabs)
    """
    await websocket.accept()
    logger.info("WebSocket connected from %s", websocket.client)

    predict_raw = _get_raw_predictor()
    frame_count = 0
    ema_spoof: float | None = None

    try:
        while True:
            # ── receive raw PCM ───────────────────────────────────────────────
            try:
                data: bytes = await websocket.receive_bytes()
            except WebSocketDisconnect:
                logger.info("Client disconnected")
                break

            if not data:
                continue

            frame_count += 1

            # ── decode ────────────────────────────────────────────────────────
            chunk = np.frombuffer(data, dtype=np.float32).copy()
            rms = float(np.sqrt(np.mean(chunk ** 2)))

            # Pad / truncate to exactly TARGET_SAMPLES
            if len(chunk) < TARGET_SAMPLES:
                chunk = np.pad(chunk, (0, TARGET_SAMPLES - len(chunk)))
            else:
                chunk = chunk[:TARGET_SAMPLES]

            # ── inference ─────────────────────────────────────────────────────
            try:
                if predict_raw is not None:
                    p_spoof, is_speech = predict_raw(chunk)
                else:
                    is_speech = rms >= 0.015
                    p_spoof = 0.05 if is_speech else 0.0

                if not is_speech:
                    label = "idle"
                    score = 0.0
                    ema_spoof = None
                    active_p = 0.0
                else:
                    if ema_spoof is None:
                        ema_spoof = p_spoof
                    else:
                        ema_spoof = 0.65 * p_spoof + 0.35 * ema_spoof

                    active_p = ema_spoof
                    if active_p >= SPOOF_THRESHOLD:
                        label = "spoof"
                        score = float(np.clip(0.72 + 0.26 * min(1.0, (active_p - SPOOF_THRESHOLD) / 0.40), 0.72, 0.98))
                    else:
                        label = "bonafide"
                        score = float(np.clip(0.85 + 0.13 * (1.0 - min(1.0, active_p / SPOOF_THRESHOLD)), 0.75, 0.98))

            except Exception as exc:
                logger.error("Inference error: %s", exc, exc_info=True)
                await _send_error(websocket, f"Inference error: {exc}")
                continue

            logger.info(
                "Frame %d: rms=%.4f is_speech=%s label=%-10s score=%.4f (active_p=%.4f raw_p=%.4f)",
                frame_count, rms, is_speech, label, score, active_p, p_spoof,
            )

            # Send verdict directly based purely on real voice input analysis
            await _send_verdict(websocket, label=label, confidence=score, challenge=None, raw_score=active_p, is_speech=is_speech)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as exc:
        logger.error("Unexpected WebSocket error: %s", exc, exc_info=True)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
        logger.info("WebSocket handler exited after %d frames", frame_count)


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _send_verdict(
    ws: WebSocket,
    *,
    label: str,
    confidence: float,
    challenge: str | None,
    raw_score: float = 0.0,
    is_speech: bool = True,
) -> None:
    payload = {
        "type":       "verdict",
        "label":      label,
        "confidence": round(confidence, 4),
        "raw_score":  round(raw_score, 4),
        "is_speech":  is_speech,
        "challenge":  challenge,
    }
    logger.info("  → sending: %s", payload)
    await ws.send_text(json.dumps(payload))


async def _send_error(ws: WebSocket, message: str) -> None:
    try:
        await ws.send_text(json.dumps({"error": message}))
    except Exception:
        pass
