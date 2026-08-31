import re
import datetime
from typing import Dict, Any
from app.parsers.base import BaseParser

class WindowsSecurityParser(BaseParser):
    parser_id = "windows_sec_v1"
    name = "Windows Security Event Parser"
    version = "1.2.0"
    supported_format = "Windows Security Event Log (Event ID 4625/4624/4720/1102)"

    def can_parse(self, raw_log: str) -> bool:
        return bool(re.search(r'Event ID:\s*(4625|4624|4720|1102)|Account failed to log on|An account was successfully logged on|audit log was cleared', raw_log, re.IGNORECASE))

    def parse(self, raw_log: str) -> Dict[str, Any]:
        if re.search(r'4625|failed to log on', raw_log, re.IGNORECASE):
            event_type = "authentication_failure"
            severity = "high"
        elif re.search(r'4624|successfully logged on', raw_log, re.IGNORECASE):
            event_type = "authentication_success"
            severity = "low"
        elif re.search(r'4720|account was created', raw_log, re.IGNORECASE):
            event_type = "user_account_created"
            severity = "medium"
        elif re.search(r'1102|audit log was cleared', raw_log, re.IGNORECASE):
            event_type = "security_audit_log_cleared"
            severity = "critical"
        else:
            event_type = "windows_security_audit"
            severity = "low"

        # Extract Account Name
        all_users = re.findall(r'Account Name:\s*([a-zA-Z0-9_\-\.]+)', raw_log)
        user = "admin"
        if all_users:
            valid = [u for u in all_users if u != "-"]
            if valid:
                user = valid[-1]

        # Extract Source IP
        ip_match = re.search(r'Source Network Address:\s*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})', raw_log)
        source_ip = ip_match.group(1) if ip_match else "192.168.1.10"

        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        return {
            "timestamp": timestamp,
            "event_type": event_type,
            "source": "Windows",
            "user": user,
            "source_ip": source_ip,
            "severity": severity,
            "confidence": 0.96
        }
