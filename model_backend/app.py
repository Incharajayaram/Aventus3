"""
PromptShield REST API  – DeBERTa edition
"""

import sys
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)                           # allow all origins

# ── 1. Model location ────────────────────────────────────────────────────────
MODEL_DIR = (Path(__file__).parent / ".." / "base_model" / "deberta-promptShield").resolve()

# ── 2. Load tokenizer & model once at startup ────────────────────────────────
try:
    tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))            # spm.model handled automatically
    model     = AutoModelForSequenceClassification.from_pretrained(str(MODEL_DIR))
    model.eval()
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(DEVICE)
except Exception:
    print(f"🔥  Failed to load model from: {MODEL_DIR}", file=sys.stderr)
    raise

# ── 3. Routes (same contract as before) ──────────────────────────────────────
@app.route("/", methods=["GET"])
def root():
    return "PromptShield API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify(error="Missing 'text'"), 400

    enc = tokenizer(
        data["text"],
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(DEVICE)

    with torch.no_grad():
        logits = model(**enc).logits
        pred   = torch.argmax(logits, dim=1).item()      # 0=safe, 1=attack

    return jsonify(
        result="Injection Detected" if pred else "Safe",
        prediction=pred
    )

# ── 4. Entrypoint ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
