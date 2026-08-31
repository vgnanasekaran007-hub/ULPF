import re
import datetime
from typing import Dict, Any
from app.parsers.base import BaseParser

class LinuxAuthParser(BaseParser):
    parser_id = "linux_auth_v1"
    name = "Linux Authentication & System Parser"
    version = "1.2.0"
    supported_format = "Linux /var/log/auth.log & syslog"

    def can_parse(self, raw_log: str) -> bool:
        return bool(re.search(r'sshd\[\d+\]|sudo:|CRON\[\d+\]|Failed password|Accepted password|systemd:', raw_log, re.IGNORECASE))

    def parse(self, raw_log: str) -> Dict[str, Any]:
        # Extract event type & severity
        if re.search(r'Failed password', raw_log, re.IGNORECASE):
            event_type = "authentication_failure"
            severity = "high"
        elif re.search(r'Accepted password', raw_log, re.IGNORECASE):
            event_type = "authentication_success"
            severity = "low"
        elif re.search(r'sudo:', raw_log, re.IGNORECASE):
            event_type = "privilege_escalation"
            severity = "medium"
        elif re.search(r'CRON', raw_log, re.IGNORECASE):
            event_type = "cron_job_execution"
            severity = "low"
        else:
            event_type = "system_event"
            severity = "low"

        # Extract User
        user_match = re.search(r'(?:for|user|COMMAND=.*user\s+)\s*([a-zA-Z0-9_\-\.]+)', raw_log)
        user = user_match.group(1) if user_match else "root"

        # Extract IP
        ip_match = re.search(r'from\s+([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})', raw_log)
        source_ip = ip_match.group(1) if ip_match else "127.0.0.1"

        # Timestamp
        ts_match = re.search(r'^([A-Z][a-z]{2}\s+\d+\s+\d{2}:\d{2}:\d{2})', raw_log)
        timestamp = ts_match.group(1) if ts_match else datetime.datetime.utcnow().isoformat() + "Z"

        return {
            "timestamp": timestamp,
            "event_type": event_type,
            "source": "Linux",
            "user": user,
            "source_ip": source_ip,
            "severity": severity,
            "confidence": 0.98
        }
