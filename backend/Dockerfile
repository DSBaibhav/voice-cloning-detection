# ── Voice Cloning Detector — Backend Dockerfile ───────────────────────────────
# Base: python:3.11-slim
# Model: loaded at runtime from app/models/model_weights.pth (PyTorch .pth)
# Render injects $PORT at runtime; we read it in CMD.

FROM python:3.11-slim

# System deps needed by librosa / soundfile / webrtcvad
RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg \
        libsndfile1 \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer-cached unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source (including app/models/model_weights.pth)
COPY app/ ./app/

# On first startup, the model downloads facebook/wav2vec2-base from HuggingFace
# (~380 MB) and loads model_weights.pth. To avoid this delay at runtime,
# pre-warm the HF cache during build:
RUN python -c "\
from transformers import Wav2Vec2Model, Wav2Vec2Processor; \
Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base'); \
Wav2Vec2Model.from_pretrained('facebook/wav2vec2-base'); \
print('HuggingFace cache warmed')"

# Expose the default port (Render overrides via $PORT)
EXPOSE 8000

# Render injects $PORT; fall back to 8000 for local docker run
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
