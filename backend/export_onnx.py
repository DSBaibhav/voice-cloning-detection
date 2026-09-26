"""
export_onnx.py — Convert the Wav2Vec2 + head checkpoint to ONNX.

Model architecture (from Colab training code):
  class RealWav2Vec2Classifier(nn.Module):
      backbone = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base")
      head     = Sequential(Linear(768,128), ReLU(), Linear(128,1))
      forward  → torch.sigmoid(head(mean_pool(backbone(x))))  → (B,) in [0,1]
                 probability >0.5 means SPOOF

ONNX output contract (matches inference.py expectations):
  input  "input"  : float32  (batch, 48000)   — 3s @ 16 kHz raw waveform
  output "output" : float32  (batch, 2)       — [p_bonafide, p_spoof]
"""

import os, sys, torch, torch.nn as nn, numpy as np

WEIGHTS_PATH  = "app/models/model_weights.pth"
ONNX_PATH     = "app/models/model.onnx"
CHUNK_SAMPLES = 16_000 * 3   # 48 000

# ── 1. Load state-dict ────────────────────────────────────────────────────────
print("Loading checkpoint …")
state_dict = torch.load(WEIGHTS_PATH, map_location="cpu", weights_only=False)
print(f"  {len(state_dict)} tensors loaded")

# ── 2. Build model matching Colab architecture exactly ────────────────────────
print("Building model (facebook/wav2vec2-base + head) …")
print("  [This downloads ~360 MB of HF weights the first time]")

try:
    from transformers import Wav2Vec2Model
except ImportError:
    print("ERROR: transformers not installed.  pip install transformers")
    sys.exit(1)

class RealWav2Vec2Classifier(nn.Module):
    """Exact replica of the Colab training class."""
    def __init__(self):
        super().__init__()
        self.backbone = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base")
        self.head = nn.Sequential(
            nn.Linear(768, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, T)  raw waveform
        # backbone returns last_hidden_state: (B, frames, 768)
        hidden = self.backbone(x).last_hidden_state.mean(dim=1)  # (B, 768)
        logit  = self.head(hidden)                                # (B, 1)
        p_spoof    = torch.sigmoid(logit).squeeze(-1)             # (B,)
        p_bonafide = 1.0 - p_spoof                               # (B,)
        return torch.stack([p_bonafide, p_spoof], dim=1)          # (B, 2)


# ── 3. Wrap for ONNX export (torch.no_grad on backbone, same as Colab) ───────
class ExportWrapper(nn.Module):
    def __init__(self, inner: RealWav2Vec2Classifier):
        super().__init__()
        self.inner = inner

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        hidden = self.inner.backbone(x).last_hidden_state.mean(dim=1)
        logit  = self.inner.head(hidden)
        p_spoof    = torch.sigmoid(logit).squeeze(-1)
        p_bonafide = 1.0 - p_spoof
        return torch.stack([p_bonafide, p_spoof], dim=1)


model = RealWav2Vec2Classifier()

# ── 4. Load our fine-tuned weights ───────────────────────────────────────────
print("Loading fine-tuned weights …")
missing, unexpected = model.load_state_dict(state_dict, strict=True)
if missing:
    print(f"  ⚠ Missing     ({len(missing)}): {missing[:5]}")
if unexpected:
    print(f"  ⚠ Unexpected  ({len(unexpected)}): {unexpected[:5]}")
print("  ✓ State-dict loaded")

model.eval()
wrapper = ExportWrapper(model).eval()

# ── 5. Smoke-test ─────────────────────────────────────────────────────────────
print("Smoke test …")
dummy = torch.randn(1, CHUNK_SAMPLES)
with torch.no_grad():
    out = wrapper(dummy)
print(f"  Output shape  : {tuple(out.shape)}")
print(f"  Output values : {out.detach().numpy()}")
assert out.shape == (1, 2), f"Expected (1,2), got {out.shape}"
total = float(out[0].sum().item())
assert abs(total - 1.0) < 1e-4, f"Probabilities must sum to 1, got {total}"
print("  ✓ Smoke test passed")

# ── 6. Export ─────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(ONNX_PATH), exist_ok=True)
print(f"Exporting ONNX → {ONNX_PATH} …")

torch.onnx.export(
    wrapper,
    dummy,
    ONNX_PATH,
    export_params=True,
    opset_version=17,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={
        "input":  {0: "batch_size"},
        "output": {0: "batch_size"},
    },
    verbose=False,
)
size_mb = os.path.getsize(ONNX_PATH) / 1024**2
print(f"  ✓ Written ({size_mb:.1f} MB)")

# ── 7. ORT verification ───────────────────────────────────────────────────────
print("Verifying with OnnxRuntime …")
import onnxruntime as ort

sess     = ort.InferenceSession(ONNX_PATH)
inp_name = sess.get_inputs()[0].name
out_name = sess.get_outputs()[0].name
print(f"  Input  : name='{inp_name}'  shape={sess.get_inputs()[0].shape}")
print(f"  Output : name='{out_name}'  shape={sess.get_outputs()[0].shape}")

sample = np.random.randn(1, CHUNK_SAMPLES).astype(np.float32)
result = sess.run([out_name], {inp_name: sample})[0]
print(f"  ORT result : {result}  sum={result.sum():.4f}")
assert result.shape == (1, 2)
print("  ✓ ORT verification passed")

print("\n🎉  model.onnx is ready for inference.")
