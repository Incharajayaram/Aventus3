# PromptArmour: Zero-Day Prompt Injection Firewall 

## Overview

PromptArmour is a lightweight security middleware designed to protect Large Language Models (LLMs) from **prompt injection attacks**. As the use of LLMs expands across industries—from customer service to analytics—these models are increasingly vulnerable to malicious inputs that can manipulate their responses, cause data leakage, or override safety protocols.

PromptArmour sits between the user and the LLM, acting as a real-time filter and intelligent firewall. It evaluates prompts for suspicious intent, blocks risky inputs, and logs interactions for future analysis.

The model trained is much better by having `94.8 percent` accuracy and `0.3 percent` false positive rate comparing it to the current benchmark of `65 percent` accuracy and `1 percent` false positive rate.

### Backend

The backend is built using **Node.js**, and acts as an API gateway. It captures user input, routes it through middleware checks, and forwards safe prompts to the LLM.

- **Entry Point**: `backend/index.js`
- **Key Features**:
  - Middleware for prompt interception
  - Routes for submitting and reviewing prompts
  - Communication with Flask model backend
- **Dependencies**: Refer to `backend/package.json`

### Base Model

The `base_model` directory houses **Jupyter notebooks** and pretrained models used for training and evaluating binary classifiers that differentiate between **malicious** and **benign** prompts.

- **Key Files**:
  - `deberta copy.ipynb`: DeBERTa Model experimentation and evaluation.
  - `dataset copy.ipynb`: BERT Tiny Model experimentation and evaluation.
   - **Dataset Source**: Patterns derived from datasets like `hendzh/PromptShield`.


### Frontend

The frontend is a **React + Vite** application that displays the dashboard for monitoring flagged and passed prompts.

- **Entry Point**: `frontend/src/`
- **Features**:
  - Live feed of flagged/allowed prompts
  - Warning messages for blocked inputs
  - Clean dark-themed UI with Tailwind CSS
- **Dependencies**: Refer to `frontend/package.json`

### Flask App (Model Backend)

The `model_backend` contains a Flask backend which loads the LLMs for the frontend, along with its middleware binary classifier api (deBERTa model)

- **Flask App**: `app.py`
- **Dependencies**: See `requirements.txt`
- **Features**:
  - Binary classification for prompt injection
  - Semantic similarity checks using embeddings
  - Chain-of-thought based intent verification


## 🚀 Installation Guide — *PromptArmour*

Follow these steps to set up and run **PromptArmour** locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/promptarmour.git
cd promptarmour
```

---

### 2. Setup the Backend (Node.js)

```bash
cd backend
npm install
npm start
```

> 📌 This will start the Node.js API gateway responsible for routing prompts and handling middleware.

---

### 3. Setup the Frontend (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

> 🎨 This will launch the frontend dashboard on `http://localhost:5173` by default.

---

### 4. Setup the Model Backend (Flask + ML)

```bash
cd ../model_backend
pip install -r requirements.txt
python app.py
```

> 🧠 This starts the Flask server running the prompt injection classifier and intent-checking logic.

---

### Final Step

Ensure all three services are running in parallel:

- Node.js API Gateway → `http://localhost:8000`
- Flask Model Server → `http://localhost:5000`
- React Frontend → `http://localhost:5173`

Now your **PromptArmour** defense system is live!

---

## Team

- **Inchara J** – Team Leader  
- **Shubhang Sinha**  
- **Harsh Kumar Gupta**  
- **Himanshu**

---

## Problem Statement

Prompt injection attacks manipulate LLMs through crafted instructions embedded in user inputs. These attacks can cause the model to behave maliciously, leak sensitive data, or override safety protocols. PromptArmour aims to solve this by adding a security layer to catch and block these inputs before they reach the LLM.

---

## 💡 Key Features

- **Prompt Interception Middleware** (Node.js)
- **Prompt Injection Detection** (Flask + ML classifier)
- **Chain-of-Thought (CoT) Intent Checker** using embeddings
- **Flag Handling & Alert System**
- **Activity Logging with SQLite**
- **Interactive Dashboard UI**

---

## 🧱 Tech Stack

| Category        | Tools/Frameworks                          |
|----------------|--------------------------------------------|
| ML Models       | HuggingFace Transformers, Scikit-learn     |
| LLM APIs        | OpenAI API, LLaMA (via llama.cpp)          |
| Backend         | Flask (ML), Node.js (API gateway)          |
| Frontend        | React, Vite, Tailwind CSS                  |
| Database        | MongoDB (User Logs), SQLite (Prompt Logs)  |
| NLP Utilities   | spaCy, nltk, OpenAI Embeddings             |
| Dev Tools       | Postman, Jupyter Notebooks                 |

---

## ✅ Why PromptArmour?

PromptArmour tackles prompt injection at the source by detecting both known and unknown attack patterns. Its modular architecture makes it easy to deploy in any LLM-based app, giving developers an early defense mechanism that's explainable, extensible, and efficient.