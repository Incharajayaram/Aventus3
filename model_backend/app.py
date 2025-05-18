import sys
import json
import requests
from pathlib import Path
from flask import Flask, request, jsonify, stream_with_context, Response
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import traceback

app = Flask(__name__)
CORS(app)  # allow all origins

print("[STARTUP] Loading model...", file=sys.stderr)

# Path to your local DeBERTa promptShield model directory
MODEL_DIR = (Path(__file__).parent / ".." / "base_model" / "deberta-promptShield").resolve()

try:
    tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
    model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_DIR))
    model.eval()
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(DEVICE)
    print(f"[STARTUP] Model loaded successfully on device: {DEVICE}", file=sys.stderr)
except Exception:
    print(f"🔥  Failed to load model from: {MODEL_DIR}", file=sys.stderr)
    raise

OLLAMA_URL = "http://127.0.0.1:11435/api/generate"  # Correct port
OLLAMA_MODEL = "mistral"


def is_injection(text: str) -> bool:
    print(f"[INJECTION CHECK] Received text: {text[:30]}...", file=sys.stderr)
    enc = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512,
    ).to(DEVICE)
    with torch.no_grad():
        logits = model(**enc).logits
    prediction = torch.argmax(logits, dim=1).item()
    print(f"[INJECTION CHECK] Prediction: {prediction}", file=sys.stderr)
    return prediction == 1

def ollama_generate(prompt, stream=False):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": stream,
    }
    resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
    resp.raise_for_status()
    data = resp.json()

    # Extract the actual text response from the JSON data
    return data.get("response", "")





@app.get("/")
def root():
    print("[REQUEST] GET /", file=sys.stderr)
    return "PromptShield API is running!"


@app.post("/analyze")
def analyze():
    print("[REQUEST] POST /analyze", file=sys.stderr)
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        print("[ERROR] Missing 'text' in request body", file=sys.stderr)
        return jsonify(error="Missing 'text'"), 400
    verdict = is_injection(data["text"])
    print(f"[RESULT] Injection verdict: {verdict}", file=sys.stderr)
    return jsonify(
        result="Injection Detected" if verdict else "Safe",
        prediction=int(verdict),
    )


@app.post("/ask")
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    prompt = data.get("prompt", "")
    
    print(f"[REQUEST] POST /ask with prompt: {prompt}")
    
    try:
        answer = ollama_generate(prompt, stream=False)

        if hasattr(answer, "__iter__") and not isinstance(answer, str):
            answer = "".join(answer)

        print(f"[ASK] Response received: {answer}")

    except Exception as e:
        print(f"[ERROR] Exception in /ask: {e}")
        answer = "Sorry, an error occurred."

    return jsonify({"flagged": False, "output": answer})



if __name__ == "__main__":
    print("[STARTUP] Starting Flask server on 0.0.0.0:5000", file=sys.stderr)
    app.run(host="0.0.0.0", port=5000, debug=True)
