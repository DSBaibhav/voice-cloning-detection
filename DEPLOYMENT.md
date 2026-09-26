# Deployment Guide — Voice Cloning Detector

## Overview

| Service | Platform | Root dir |
|---------|----------|----------|
| Backend (FastAPI + ONNX) | [Render](https://render.com) | `backend/` |
| Frontend (React + Vite)  | [Vercel](https://vercel.com)  | `frontend/` |

---

## Prerequisites

Make sure `backend/app/models/model_weights.pth` exists (it was downloaded from
Google Drive).  The Docker image bundles it directly — no ONNX conversion needed.

The HuggingFace `facebook/wav2vec2-base` weights (~380 MB) are downloaded and
cached **at Docker build time** via the `RUN python -c "..."` pre-warm step in
the Dockerfile, so there's no cold-start delay on first request.

---

## 1. Deploy Backend to Render

### A. Create a new Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Fill in the settings:

| Field | Value |
|-------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` (auto-detected) |
| **Region** | Any (Oregon recommended) |
| **Instance Type** | **Standard (2 GB RAM minimum)** — PyTorch requires >1 GB |

> [!WARNING]
> The Free tier (512 MB RAM) is not enough for PyTorch + Wav2Vec2.
> Use **Standard ($25/mo, 2 GB RAM)** or higher.
> Alternatively, export to ONNX (run `python export_onnx.py` after installing `onnxscript`) to drop the PyTorch dependency and run on the free tier.

### B. Environment Variables (set in Render dashboard)

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | *(Render sets this automatically)* | Do not set manually |
| `FRONTEND_ORIGIN` | `https://your-app.vercel.app` | Set after Vercel deploy |
| `CORS_ORIGINS` | *(optional)* | Extra comma-separated origins |

### C. Build & Start Commands (Docker — auto from Dockerfile)

Render reads the `Dockerfile` automatically.  The `CMD` is:
```
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### D. Verify

Once deployed, open:
```
https://<render-url>.onrender.com/health
```
Expected: `{"status":"ok","model_ready":true}`

---

## 2. Deploy Frontend to Vercel

### A. Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Framework preset: **Vite** (auto-detected)

### B. Environment Variables (set in Vercel dashboard → Settings → Environment Variables)

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_BACKEND_WS_URL` | `wss://<render-url>.onrender.com/ws/monitor` | Production |

> **Important:** Vercel embeds env vars at build time. You must **redeploy** after
> changing `VITE_BACKEND_WS_URL`.

### C. Build settings (auto-detected)

| Field | Value |
|-------|-------|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 3. Wire Up URLs After Both Services Are Live

Once you have both URLs, update them as follows:

### Backend → allow the Vercel frontend

In Render dashboard → your service → **Environment**:

```
FRONTEND_ORIGIN = https://your-app.vercel.app
```

Then click **Manual Deploy → Deploy latest commit** (or Render auto-redeploys).

### Frontend → point at the Render backend

Option A — Vercel dashboard:
1. Settings → Environment Variables
2. Set `VITE_BACKEND_WS_URL = wss://your-backend.onrender.com/ws/monitor`
3. Redeploy

Option B — commit to repo:
```
# frontend/.env.production
VITE_BACKEND_WS_URL=wss://your-backend.onrender.com/ws/monitor
```
Then push; Vercel auto-deploys.

---

## 4. Local Docker Test

```bash
# Build
docker build -t voice-cloning-backend ./backend

# Run (simulate Render's PORT injection)
docker run -p 8000:8000 -e PORT=8000 voice-cloning-backend

# Verify
curl http://localhost:8000/health
# Expected: {"status":"ok","model_ready":true}
```

---

## 5. Tip — Keeping model.onnx out of git

If the model is too large for git (~360 MB), add to `.gitignore`:
```
backend/app/models/model.onnx
backend/app/models/model_weights.pth
```

Then add a download step to the Dockerfile:
```dockerfile
RUN pip install gdown && \
    gdown <GDRIVE_FILE_ID> -O app/models/model.onnx
```

Or store it in Render's **persistent disk** and mount it at `/app/app/models/`.

---

## Quick Reference

```
Backend health:  GET  https://<render>.onrender.com/health
WebSocket:       WSS  https://<render>.onrender.com/ws/monitor
Frontend:             https://<your-app>.vercel.app
```
