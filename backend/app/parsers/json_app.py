import json
import datetime
from typing import Dict, Any
from app.parsers.base import BaseParser

class JSONAppParser(BaseParser):
    parser_id = "json_app_v1"
    name = "JSON Application Log Parser"
    version = "2.1.0"
    supported_format = "Structured JSON Microservice Logs"

    def can_parse(self, raw_log: str) -> bool:
        trimmed = raw_log.strip()
        return (trimmed.startswith("{") and trimmed.endswith("}"))

    def parse(self, raw_log: str) -> Dict[str, Any]:
        try:
            data = json.loads(raw_log.strip())
        except Exception:
            data = {}

        event_name = data.get("event_name") or data.get("event") or data.get("message") or data.get("action") or ""
        level = (data.get("level") or data.get("log_level") or "").upper()

        if event_name:
            event_type = str(event_name).replace(".", "_").lower()
        elif level == "ERROR" or level == "CRITICAL":
            event_type = "application_error"
        else:
            event_type = "application_info"

        # Determine severity based on level or event_type
        if level in ["CRITICAL", "FATAL"] or "panic" in event_type or "audit_cleared" in event_type:
            severity = "critical"
        elif level == "ERROR" or "fail" in event_type or "error" in event_type or "denied" in event_type:
            severity = "high"
        elif level == "WARN" or level == "WARNING" or "limit" in event_type or "timeout" in event_type:
            severity = "medium"
        else:
            severity = "low"

        user = data.get("user") or data.get("username") or data.get("account") or "app_user"
        source_ip = data.get("client_ip") or data.get("ip") or data.get("source_ip") or "192.168.1.10"
        timestamp = data.get("timestamp") or datetime.datetime.utcnow().isoformat() + "Z"

        return {
            "timestamp": timestamp,
            "event_type": event_type,
            "source": "Application",
            "user": user,
            "source_ip": source_ip,
            "severity": severity,
            "confidence": 0.99
        }
