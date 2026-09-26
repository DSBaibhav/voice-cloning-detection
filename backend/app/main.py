"""
FastAPI application entry-point for the voice cloning detector backend.

Startup behaviour
-----------------
* Attempts to load model.onnx via inference.load_model_at_startup().
* If the model file is absent the server still starts but logs a clear
  warning — inference will use the deterministic stub until the real
  model is placed in backend/app/models/model.onnx.

Endpoints
---------
  GET  /health      → liveness / readiness probe
  WS   /ws/monitor  → real-time audio anti-spoofing stream
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.websocket_handler import router as ws_router

# ──────────────────────────────────────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Lifespan (startup / shutdown hooks)
# ──────────────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup checks, then yield control to FastAPI."""
    logger.info("═══ SATYA VAANI — Real-Time Voice Cloning Defense Backend starting up ═══")

    # Try to initialize the detection engine
    try:
        from app.inference import load_model_at_startup
        load_model_at_startup()
        logger.info("✓ SATYA VAANI anti-spoofing engine initialized successfully")
    except Exception as exc:
        logger.warning("Engine startup note: %s", exc)

    yield  # application runs here

    logger.info("═══ SATYA VAANI — Backend shutting down ═══")


# ──────────────────────────────────────────────────────────────────────────────
# CORS origins
# ──────────────────────────────────────────────────────────────────────────────

_ALLOWED_ORIGINS: list[str] = [
    "http://localhost:5173",    # Vite dev server
    "http://127.0.0.1:5173",
]

# Production frontend origin — set FRONTEND_ORIGIN=https://your-app.vercel.app on Render
_frontend_origin = os.environ.get("FRONTEND_ORIGIN", "").strip()
if _frontend_origin:
    _ALLOWED_ORIGINS.append(_frontend_origin)
    logger.info("CORS: added production origin '%s'", _frontend_origin)

# Additional origins via comma-separated CORS_ORIGINS env var (fallback)
_extra = os.environ.get("CORS_ORIGINS", "")
if _extra:
    _ALLOWED_ORIGINS.extend(o.strip() for o in _extra.split(",") if o.strip())


# ──────────────────────────────────────────────────────────────────────────────
# App factory
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Voice Cloning Detector",
    description=(
        "Real-time voice anti-spoofing API.  "
        "Stream audio over /ws/monitor to receive liveness verdicts."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import router as api_router

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(ws_router)
app.include_router(api_router)


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["ops"])
async def health():
    """Liveness / readiness probe."""
    from pathlib import Path
    model_ready = (Path(__file__).parent / "models" / "model_weights.pth").exists()
    return {
        "status":      "ok",
        "app":         "SATYA VAANI",
        "model_ready": model_ready,
        "mode":        "dual_ensemble" if model_ready else "acoustic_vocoder_engine",
    }
