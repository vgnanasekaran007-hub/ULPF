import os
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import Parser, RawEvent, NormalizedEvent
from app.api.logs import router as logs_router
from app.api.events import router as events_router
from app.api.dashboard import router as dashboard_router
from app.api.parsers import router as parsers_router

# Create DB Tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Universal Log Pre-processing Framework (ULPF) - Any Log → One Standard Schema"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(logs_router, prefix=settings.API_PREFIX)
app.include_router(events_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(parsers_router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def seed_initial_data():
    """Seed initial parsers and demo sample events if database is empty."""
    db = SessionLocal()
    try:
        # Seed Parsers
        if db.query(Parser).count() == 0:
            default_parsers = [
                Parser(
                    parser_id="linux_auth_v1",
                    name="Linux Authentication & System Parser",
                    version="1.2.0",
                    supported_format="Linux /var/log/auth.log & syslog",
                    status="active",
                    events_processed=4250
                ),
                Parser(
                    parser_id="windows_sec_v1",
                    name="Windows Security Event Parser",
                    version="1.2.0",
                    supported_format="Windows Event Log (Event ID 4625/4624/4720/1102)",
                    status="active",
                    events_processed=3820
                ),
                Parser(
                    parser_id="firewall_syslog_v1",
                    name="Firewall / Syslog Parser",
                    version="1.2.0",
                    supported_format="Fortinet / Cisco Syslog (KV format)",
                    status="active",
                    events_processed=4340
                ),
                Parser(
                    parser_id="json_app_v1",
                    name="JSON Application Log Parser",
                    version="2.1.0",
                    supported_format="Structured JSON Microservice Logs",
                    status="active",
                    events_processed=2440
                )
            ]
            db.add_all(default_parsers)
            db.commit()

        # Seed Demo Diverse Normalized Events if empty
        if db.query(NormalizedEvent).count() == 0:
            demo_items = [
                {
                    "event_id": "EVT-89A1F2",
                    "raw": "Aug 31 14:22:19 server01 sshd[24819]: Failed password for admin from 192.168.1.10 port 49210 ssh2",
                    "hash": "8f4e2b10a99c8321045b81a7741029c38174201948d0a92841029e8471029a81",
                    "timestamp": "2026-08-31T14:22:19Z",
                    "event_type": "authentication_failure",
                    "source": "Linux",
                    "user": "admin",
                    "source_ip": "192.168.1.10",
                    "severity": "high",
                    "parser_id": "linux_auth_v1"
                },
                {
                    "event_id": "EVT-5501C4",
                    "raw": "Aug 31 14:30:05 server01 sudo: sysadmin : TTY=pts/1 ; PWD=/home/sysadmin ; USER=root ; COMMAND=/bin/bash",
                    "hash": "45a91048b29c0194e827104b29c13a91b287c6e1045d98a2104e78f9104b2819",
                    "timestamp": "2026-08-31T14:30:05Z",
                    "event_type": "privilege_escalation",
                    "source": "Linux",
                    "user": "sysadmin",
                    "source_ip": "127.0.0.1",
                    "severity": "medium",
                    "parser_id": "linux_auth_v1"
                },
                {
                    "event_id": "EVT-1102AA",
                    "raw": "Event ID: 1102 The security audit log was cleared. Subject: Administrator CORP-DOMAIN",
                    "hash": "99104b28194d9a1048b29c0194e827104b29c13a91b287c6e1045d98a2104e78",
                    "timestamp": "2026-08-31T14:32:00Z",
                    "event_type": "security_audit_log_cleared",
                    "source": "Windows",
                    "user": "Administrator",
                    "source_ip": "10.0.1.15",
                    "severity": "critical",
                    "parser_id": "windows_sec_v1"
                },
                {
                    "event_id": "EVT-7701B4",
                    "raw": "FORTINET date=2026-08-31 time=14:25:00 devname=\"FW-CORE-01\" action=\"deny\" status=\"BLOCKED\" user=\"fw_admin\" srcip=192.168.1.10",
                    "hash": "194b810948c104928e1047b9104829c1048b9102948c10928e1048b9102948c2",
                    "timestamp": "2026-08-31T14:25:00Z",
                    "event_type": "network_traffic_deny",
                    "source": "Firewall",
                    "user": "fw_admin",
                    "source_ip": "192.168.1.10",
                    "severity": "medium",
                    "parser_id": "firewall_syslog_v1"
                },
                {
                    "event_id": "EVT-9901C8",
                    "raw": "{\"timestamp\": \"2026-08-31T14:35:10Z\", \"service\": \"payment-gateway\", \"level\": \"CRITICAL\", \"event_name\": \"database.connection.timeout\", \"user\": \"db_app_pool\", \"client_ip\": \"10.0.12.44\"}",
                    "hash": "771029c38174201948d0a92841029e8471029a818f4e2b10a99c8321045b81a7",
                    "timestamp": "2026-08-31T14:35:10Z",
                    "event_type": "database_connection_timeout",
                    "source": "Application",
                    "user": "db_app_pool",
                    "source_ip": "10.0.12.44",
                    "severity": "critical",
                    "parser_id": "json_app_v1"
                },
                {
                    "event_id": "EVT-3381D9",
                    "raw": "{\"timestamp\": \"2026-08-31T14:38:22Z\", \"service\": \"api-gateway\", \"level\": \"WARN\", \"event_name\": \"api.rate_limit.exceeded\", \"user\": \"partner_dev\", \"client_ip\": \"198.51.100.42\"}",
                    "hash": "2201948d0a92841029e8471029a818f4e2b10a99c8321045b81a7771029c38174",
                    "timestamp": "2026-08-31T14:38:22Z",
                    "event_type": "api_rate_limit_exceeded",
                    "source": "Application",
                    "user": "partner_dev",
                    "source_ip": "198.51.100.42",
                    "severity": "medium",
                    "parser_id": "json_app_v1"
                }
            ]

            for item in demo_items:
                raw_ev = RawEvent(
                    event_id=item["event_id"],
                    raw_content=item["raw"],
                    raw_log_hash=item["hash"]
                )
                db.add(raw_ev)
                db.flush()

                norm_ev = NormalizedEvent(
                    event_id=item["event_id"],
                    raw_event_id=raw_ev.id,
                    timestamp=item["timestamp"],
                    event_type=item["event_type"],
                    source=item["source"],
                    user=item["user"],
                    source_ip=item["source_ip"],
                    severity=item["severity"],
                    parser_id=item["parser_id"],
                    status="processed",
                    confidence=0.98,
                    processing_time_ms=1.4
                )
                db.add(norm_ev)

            db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "Any Log → One Standard Schema",
        "docs_url": "/docs"
    }
