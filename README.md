# ULPF — Universal Log Pre-processing Framework

[![SIH Prototype](https://img.shields.io/badge/SIH-Submission_Ready-0284c7.svg)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.11-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_Vite_Tailwind-61dafb.svg)](https://reactjs.org)

> **"Any Log → One Standard Schema"**

**ULPF (Universal Log Pre-processing Framework)** is a modern, high-performance cybersecurity platform designed to ingest raw logs from heterogeneous sources (Linux SSH, Windows Event ID 4625, Firewall Syslog, JSON App Microservices), detect their formats dynamically, parse fields, normalize them into a unified schema standard, compute cryptographic SHA-256 integrity hashes, and preserve original raw logs linked to unique Event IDs.

---

## 🚀 Quick 2-Minute Hackathon Demonstration Flow

1. **Dashboard View**: Overview of total logs ingested, processing success rates, system sources breakdown (Donut Chart), severity breakdown (Bar Chart), and real-time processing pipeline.
2. **Log Processing Centerpiece**:
   - Click **`LINUX`**, **`WINDOWS`**, **`FIREWALL`**, or **`JSON`** sample buttons (or upload/paste custom logs).
   - Click **`Process Log`**.
   - Observe live visual pipeline status (`Ingest → Detect → Parse → Normalize → Validate → Preserve`).
   - Compare **Original Raw Log** alongside **Normalized Event JSON** side-by-side.
   - Note that despite completely different raw log formats, all 4 formats normalize into the **EXACT SAME schema** (`event_type: authentication_failure`, `user: admin`, `source_ip: 192.168.1.10`, `severity: high`).
   - Verify SHA-256 fingerprint preservation and sub-2ms processing time.
3. **Events Search**: Filter and search normalized events by IP (`192.168.1.10`), User (`admin`), or Severity (`high`). Click any row to open the details drawer.
4. **Parser Registry**: Showcase modular parser engines (`linux_auth_v1`, `windows_sec_v1`, `firewall_syslog_v1`, `json_app_v1`) and click **"Add Parser"** to show instant engine expansion (`NEW SOURCE → ADD CONFIGURATION → REUSE ENGINE`).

---

## 🛠️ Architecture & Tech Stack

### Unified Event Schema Standard
```json
{
  "event_id": "EVT-89A1F2",
  "timestamp": "2026-08-31T14:22:19Z",
  "event_type": "authentication_failure",
  "source": "Linux",
  "user": "admin",
  "source_ip": "192.168.1.10",
  "severity": "high",
  "parser_id": "linux_auth_v1",
  "raw_log_hash": "8f4e2b10a99c8321045b81a7741029c38174201948d0a92841029e8471029a81"
}
```

### Stack Components
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (Hosted on **Vercel**).
- **Backend API**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy (Hosted on **Railway**).
- **Database**: PostgreSQL (Production) / SQLite (Zero-config local auto-fallback).
- **Storage & Search Architecture**: MinIO object storage raw log bucket design + OpenSearch index schemas.

---

## 📁 Project Structure

```
ulpf/
├── frontend/                  # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/        # Sidebar, Topbar, Pipeline, LogUploader, Raw/Normalized Viewers, EventTable
│   │   ├── pages/             # Dashboard, LogProcessing, Events, ParserRegistry
│   │   ├── services/          # API Axios service & client-side simulation engine fallback
│   │   ├── sampleData.js      # Built-in prototype sample logs
│   │   ├── App.jsx            # Application Router
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                   # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py            # FastAPI entrypoint with CORS & sample seeding
│   │   ├── config.py          # App settings & env loading
│   │   ├── database.py        # Dynamic PostgreSQL / SQLite session manager
│   │   ├── models.py          # DB Schema (raw_events, normalized_events, parsers)
│   │   ├── api/               # API endpoints (/logs, /events, /dashboard, /parsers)
│   │   ├── services/          # Format detector, storage service, log processor engine
│   │   ├── parsers/           # Linux, Windows, Firewall, and JSON parsers
│   │   └── schemas/           # Pydantic schemas
│   ├── requirements.txt
│   └── Dockerfile
│
├── sample_logs/               # Real log samples for demonstration
│   ├── linux_auth.log
│   ├── windows_sec.log
│   ├── firewall.log
│   └── app_json.json
├── docker-compose.yml         # Full local stack (PostgreSQL + MinIO + Backend + Frontend)
├── .env.example               # Environment variables template
└── README.md
```

---

## ⚡ Running Locally

### Option A: 1-Command Docker Compose (Full Stack)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
- MinIO Storage Console: `http://localhost:9001`

### Option B: Local Development (Separate Terminals)

#### 1. Backend Server
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in browser.

---

## 🌐 Deployment Instructions

### Deployment to Vercel (Frontend)
1. Push repository code to GitHub.
2. Import `frontend` root directory into Vercel.
3. Set environment variable: `VITE_API_BASE_URL=https://your-railway-backend.up.railway.app/api`.
4. Deploy!

### Deployment to Railway (Backend + PostgreSQL)
1. Create new project on Railway.
2. Add a **PostgreSQL** database service.
3. Deploy backend code from GitHub repository (`backend` folder).
4. Add Environment Variable:
   - `DATABASE_URL=${PostgreSQL.DATABASE_URL}`
   - `CORS_ORIGINS=https://your-app.vercel.app`
5. Railway starts `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 🛡️ Security & Integrity Highlights
- **No Hardcoded Secrets**: All backend API endpoints and DB connections consume environment variables.
- **Input Validation**: Pydantic models validate raw log payloads and prevents malformed requests.
- **SHA-256 Hashing**: Every raw log is cryptographically hashed prior to normalization, providing immutable audit trail traceability between `raw_events` and `normalized_events`.
