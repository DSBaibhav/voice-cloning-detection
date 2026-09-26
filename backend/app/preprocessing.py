"""
Audio preprocessing utilities for the voice cloning detector.

Pipeline:
  1. resample_to_16k  – load any audio file and convert to 16 kHz mono
  2. vad_strip_silence – remove silent frames using WebRTC VAD
  3. chunk_audio       – split the resulting waveform into fixed 3-second windows
"""

import struct
import logging
from pathlib import Path

import numpy as np
import librosa
import webrtcvad

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────────────────────────────────────

TARGET_SR = 16_000          # Hz
CHUNK_SEC = 3               # seconds per window
VAD_FRAME_MS = 30           # WebRTC VAD supports 10 / 20 / 30 ms frames
VAD_AGGRESSIVENESS = 2      # 0 (least) – 3 (most aggressive)


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def resample_to_16k(path: str | Path) -> np.ndarray:
    """Load *path* and return a float32 mono waveform at 16 kHz.

    Args:
        path: Path to any audio file supported by librosa (wav, mp3, flac, …).

    Returns:
        1-D float32 numpy array normalised to [-1, 1].

    Raises:
        FileNotFoundError: if *path* does not exist.
        RuntimeError: if librosa fails to decode the file.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {path}")

    try:
        y, _ = librosa.load(str(path), sr=TARGET_SR, mono=True)
    except Exception as exc:
        raise RuntimeError(f"Failed to decode audio file '{path}': {exc}") from exc

    logger.debug("Loaded '%s' → %d samples @ %d Hz", path.name, len(y), TARGET_SR)
    return y


def vad_strip_silence(
    y: np.ndarray,
    sr: int = TARGET_SR,
    frame_ms: int = VAD_FRAME_MS,
    aggressiveness: int = VAD_AGGRESSIVENESS,
) -> np.ndarray:
    """Remove silent frames from *y* using WebRTC VAD.

    WebRTC VAD operates on 16-bit PCM at 8 / 16 / 32 / 48 kHz.
    We work internally at 16 kHz.

    Args:
        y:              Float32 waveform (mono, 16 kHz).
        sr:             Sample rate – must be 16000 for WebRTC VAD.
        frame_ms:       Frame length in milliseconds (10, 20, or 30).
        aggressiveness: VAD aggressiveness level 0–3.

    Returns:
        Float32 waveform with silent frames removed.  If nothing survives
        the VAD pass (very quiet audio) the original array is returned
        unchanged so downstream code still has something to work with.
    """
    if sr != 16_000:
        raise ValueError(f"vad_strip_silence requires 16 kHz audio, got {sr} Hz")

    vad = webrtcvad.Vad(aggressiveness)

    frame_len = int(sr * frame_ms / 1000)   # samples per VAD frame
    total_frames = len(y) // frame_len

    speech_frames: list[np.ndarray] = []

    for i in range(total_frames):
        frame = y[i * frame_len : (i + 1) * frame_len]
        # Convert float32 → int16 PCM bytes
        pcm_bytes = _float32_to_int16_bytes(frame)
        try:
            is_speech = vad.is_speech(pcm_bytes, sr)
        except Exception:
            # If the frame is somehow invalid, treat it as speech to be safe
            is_speech = True

        if is_speech:
            speech_frames.append(frame)

    if not speech_frames:
        logger.warning("VAD removed all audio frames; returning original signal")
        return y

    result = np.concatenate(speech_frames)
    logger.debug(
        "VAD: kept %d/%d frames (%.1f%%)",
        len(speech_frames),
        total_frames,
        100.0 * len(speech_frames) / max(total_frames, 1),
    )
    return result


def chunk_audio(
    y: np.ndarray,
    sr: int = TARGET_SR,
    chunk_sec: int = CHUNK_SEC,
) -> list[np.ndarray]:
    """Split *y* into fixed-length windows, discarding the trailing partial chunk.

    Args:
        y:         Float32 mono waveform.
        sr:        Sample rate in Hz.
        chunk_sec: Window length in seconds.

    Returns:
        List of float32 arrays, each exactly ``chunk_sec * sr`` samples long.
        Returns an empty list if *y* is shorter than one full chunk.
    """
    chunk_len = chunk_sec * sr
    n_chunks = len(y) // chunk_len

    chunks = [y[i * chunk_len : (i + 1) * chunk_len] for i in range(n_chunks)]
    logger.debug(
        "chunk_audio: %d samples → %d chunk(s) of %d samples (%.1f s each)",
        len(y),
        n_chunks,
        chunk_len,
        chunk_sec,
    )
    return chunks


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _float32_to_int16_bytes(frame: np.ndarray) -> bytes:
    """Convert a float32 array in [-1, 1] to signed 16-bit PCM bytes."""
    clipped = np.clip(frame, -1.0, 1.0)
    pcm16 = (clipped * 32767).astype(np.int16)
    return struct.pack(f"{len(pcm16)}h", *pcm16)


def preprocess_raw_float32(
    raw_bytes: bytes,
    sr: int = TARGET_SR,
    chunk_sec: int = CHUNK_SEC,
) -> list[np.ndarray]:
    """Full pipeline for raw float32 PCM bytes received over WebSocket.

    Steps:
        1. Decode bytes → float32 numpy array
        2. VAD silence stripping
        3. Chunking into fixed windows

    Args:
        raw_bytes:  Raw bytes containing float32 PCM samples (native endianness).
        sr:         Sample rate (must match what the client sends).
        chunk_sec:  Window length in seconds.

    Returns:
        List of float32 chunks ready for inference.
    """
    y = np.frombuffer(raw_bytes, dtype=np.float32).copy()
    y_voiced = vad_strip_silence(y, sr=sr)
    return chunk_audio(y_voiced, sr=sr, chunk_sec=chunk_sec)
