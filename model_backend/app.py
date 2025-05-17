"""
PromptShield REST API
"""

import sys
from pathlib import Path
from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
import torch
from flask_cors import CORS  # import flask_cors

app = Flask(__name__)
CORS(app)  # allow all origins

# ─── 1. Model location (relative to this file) ────────────────────────────────
MODEL_DIR = (Path(__file__).parent / ".." / "base_model" / "bert-tiny-promptshield").resolve()

# ─── 2. Load model & tokenizer at startup ─────────────────────────────────────
try:
    tokenizer = BertTokenizer.from_pretrained(str(MODEL_DIR))
    model     = BertForSequenceClassification.from_pretrained(str(MODEL_DIR))
    model.eval()
except Exception:
    print(f"🔥  Failed to load model from: {MODEL_DIR}", file=sys.stderr)
    raise

# ─── 3. Routes ────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def root():
    return "PromptShield API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify(error="Missing 'text'"), 400

    # Tokenize with truncation and max_length to avoid length errors
    enc = tokenizer(
        data["text"],
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )
    # Predict
    outputs = model(**enc)
    pred = torch.argmax(outputs.logits, dim=1).item()

    # Return JSON with result and pred
    return jsonify(result="Injection Detected" if pred else "Safe", prediction=pred)

# ─── 4. Run ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
