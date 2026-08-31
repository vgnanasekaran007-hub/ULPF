import re
import datetime
from typing import Dict, Any
from app.parsers.base import BaseParser

class FirewallSyslogParser(BaseParser):
    parser_id = "firewall_syslog_v1"
    name = "Firewall / Syslog Parser"
    version = "1.2.0"
    supported_format = "Fortinet / Cisco Syslog (KV format)"

    def can_parse(self, raw_log: str) -> bool:
        return bool(re.search(r'FORTINET|devname=|status="?(AUTH_FAIL|PASSED)"?|action="?(deny|block|accept|allow)"?|srcip=', raw_log, re.IGNORECASE))

    def parse(self, raw_log: str) -> Dict[str, Any]:
        if re.search(r'AUTH_FAIL', raw_log, re.IGNORECASE):
            event_type = "authentication_failure"
            severity = "high"
        elif re.search(r'action="?(deny|block)"?', raw_log, re.IGNORECASE):
            event_type = "network_traffic_deny"
            severity = "medium"
        elif re.search(r'action="?(accept|allow)"?', raw_log, re.IGNORECASE):
            event_type = "network_traffic_allow"
            severity = "low"
        elif re.search(r'vpn|tunnel', raw_log, re.IGNORECASE):
            event_type = "vpn_tunnel_connected"
            severity = "low"
        else:
            event_type = "firewall_security_event"
            severity = "low"

        # Extract User
        user_match = re.search(r'user="?([a-zA-Z0-9_\-\.]+)"?', raw_log)
        user = user_match.group(1) if user_match else "fw_admin"

        # Extract Source IP
        ip_match = re.search(r'(?:srcip|src)=\s*"?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})"?', raw_log)
        source_ip = ip_match.group(1) if ip_match else "192.168.1.10"

        # Timestamp
        ts_match = re.search(r'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)', raw_log)
        timestamp = ts_match.group(1) if ts_match else datetime.datetime.utcnow().isoformat() + "Z"

        return {
            "timestamp": timestamp,
            "event_type": event_type,
            "source": "Firewall",
            "user": user,
            "source_ip": source_ip,
            "severity": severity,
            "confidence": 0.95
        }
