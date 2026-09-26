"""
Challenge phrase generation for liveness verification.

When the model is uncertain (confidence in the 0.4–0.6 band) the system
issues a spoken challenge.  The user must repeat the phrase aloud and the
next audio chunk is used as the definitive verdict.
"""

import random

# ──────────────────────────────────────────────────────────────────────────────
# Challenge phrase pool (at least 8 entries, mix of digits & sentences)
# ──────────────────────────────────────────────────────────────────────────────

_CHALLENGE_PHRASES: list[str] = [
    # Number sequences
    "4 7 2 9 1 8",
    "3 6 0 5 7 2",
    "8 1 4 3 9 6",
    "2 5 7 0 4 1",
    # Short sentences
    "The sky is blue and clear today",
    "Please speak this phrase out loud",
    "Verify your identity right now",
    "My voice is my passport",
    "Open the front door slowly",
    "The quick brown fox jumps high",
    "Security check in progress now",
    "Repeat after me one two three",
]


def get_random_challenge() -> str:
    """Return a random challenge phrase from the pool.

    Returns:
        A string the user should speak aloud into the microphone.
    """
    return random.choice(_CHALLENGE_PHRASES)


def get_all_phrases() -> list[str]:
    """Return a copy of the full phrase pool (useful for testing)."""
    return list(_CHALLENGE_PHRASES)
