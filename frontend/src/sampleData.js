export const SAMPLE_LOGS = {
  linux: {
    title: "Linux SSH Auth Failure",
    subtitle: "Authentication failure event from /var/log/auth.log",
    content: `Aug 31 14:22:19 server01 sshd[24819]: Failed password for admin from 192.168.1.10 port 49210 ssh2`
  },
  sudo: {
    title: "Linux Sudo Escalation",
    subtitle: "Privilege escalation event from sudoers execution",
    content: `Aug 31 14:30:05 server01 sudo: sysadmin : TTY=pts/1 ; PWD=/home/sysadmin ; USER=root ; COMMAND=/bin/bash`
  },
  windows: {
    title: "Windows Logon Failure",
    subtitle: "Windows Security Event ID 4625 (Audit Failure)",
    content: `An account failed to log on.
Subject:
	Security ID: NULL SID
	Account Name: -
	Logon ID: 0x0
Account For Which Logon Failed:
	Account Name: admin
	Account Domain: WORKGROUP
Failure Information:
	Failure Reason: Unknown user name or bad password.
Network Information:
	Workstation Name: DESKTOP-SEC
	Source Network Address: 192.168.1.10
Event ID: 4625
Keywords: Audit Failure`
  },
  windows_audit: {
    title: "Windows Audit Cleared",
    subtitle: "Critical Security Event ID 1102 (Audit log cleared)",
    content: `The security audit log was cleared.
Subject:
	Security ID: S-1-5-21-1180699209
	Account Name: Administrator
	Domain Name: CORP-DOMAIN
Event ID: 1102
Keywords: Audit Success`
  },
  firewall: {
    title: "Firewall Packet Deny",
    subtitle: "Network security traffic deny policy event",
    content: `<189>1 2026-08-31T14:25:00.123Z fw01.corp FORTINET - - - date=2026-08-31 time=14:25:00 devname="FW-CORE-01" eventtype="system" level="warning" action="deny" status="BLOCKED" user="fw_admin" srcip=192.168.1.10 dstip=10.0.0.1 msg="Unauthorized packet drop on perimeter border"`
  },
  firewall_vpn: {
    title: "Firewall VPN Tunnel",
    subtitle: "Remote access VPN tunnel connection event",
    content: `<189>1 2026-08-31T14:27:12.880Z fw01.corp FORTINET - - - date=2026-08-31 time=14:27:12 devname="FW-CORE-01" eventtype="vpn" level="notice" action="accept" status="PASSED" user="jdoe_vpn" srcip=172.16.50.88 dstip=10.0.4.1 msg="IPsec VPN Tunnel Successfully Established"`
  },
  json: {
    title: "App Database Error",
    subtitle: "Microservice database connection failure JSON",
    content: `{
  "timestamp": "2026-08-31T14:35:10.512Z",
  "service": "payment-gateway-service",
  "level": "CRITICAL",
  "event_name": "database.connection.timeout",
  "user": "db_app_pool",
  "client_ip": "10.0.12.44",
  "database": "prod_orders_db",
  "error_code": "ETIMEDOUT",
  "message": "Connection pool exhausted after 30000ms"
}`
  },
  json_api: {
    title: "API Rate Limit Alert",
    subtitle: "API Gateway rate limiting threshold alert",
    content: `{
  "timestamp": "2026-08-31T14:38:22.100Z",
  "service": "api-gateway",
  "level": "WARN",
  "event_name": "api.rate_limit.exceeded",
  "user": "partner_dev_user",
  "client_ip": "198.51.100.42",
  "endpoint": "/v1/analytics/stream",
  "request_count": 1200,
  "limit": 1000
}`
  }
};

export const INITIAL_STATS = {
  total_logs: 14850,
  processed: 14820,
  failed: 20,
  unknown: 10,
  by_source: {
    "Linux": 4250,
    "Windows": 3820,
    "Firewall": 4340,
    "Application": 2440
  },
  by_type: {
    "authentication_failure": 4120,
    "authentication_success": 3890,
    "privilege_escalation": 1510,
    "network_traffic_deny": 2330,
    "database_connection_timeout": 1450,
    "security_audit_log_cleared": 120
  },
  by_severity: {
    "critical": 120,
    "high": 4200,
    "medium": 3850,
    "low": 6650
  }
};

export const INITIAL_PARSERS = [
  {
    id: 1,
    parser_id: "linux_auth_v1",
    name: "Linux Authentication & System Parser",
    version: "1.2.0",
    supported_format: "Linux /var/log/auth.log & syslog",
    status: "active",
    events_processed: 4250,
    created_at: "2026-01-15T08:00:00Z"
  },
  {
    id: 2,
    parser_id: "windows_sec_v1",
    name: "Windows Security Event Parser",
    version: "1.2.0",
    supported_format: "Windows Event Log (Event ID 4625/4624/4720/1102)",
    status: "active",
    events_processed: 3820,
    created_at: "2026-01-18T10:30:00Z"
  },
  {
    id: 3,
    parser_id: "firewall_syslog_v1",
    name: "Firewall / Syslog Parser",
    version: "1.2.0",
    supported_format: "Fortinet / Cisco Syslog (KV format)",
    status: "active",
    events_processed: 4340,
    created_at: "2026-02-01T14:15:00Z"
  },
  {
    id: 4,
    parser_id: "json_app_v1",
    name: "JSON Application Log Parser",
    version: "2.1.0",
    supported_format: "Structured JSON Microservice Logs",
    status: "active",
    events_processed: 2440,
    created_at: "2026-02-10T11:45:00Z"
  }
];

export const INITIAL_EVENTS = [
  {
    event_id: "EVT-89A1F2",
    timestamp: "2026-08-31T14:22:19Z",
    event_type: "authentication_failure",
    source: "Linux",
    user: "admin",
    source_ip: "192.168.1.10",
    severity: "high",
    parser_id: "linux_auth_v1",
    raw_log_hash: "8f4e2b10a99c8321045b81a7741029c38174201948d0a92841029e8471029a81",
    status: "processed",
    confidence: 0.98,
    processing_time_ms: 1.4,
    created_at: "2026-08-31T14:22:19Z"
  },
  {
    event_id: "EVT-5501C4",
    timestamp: "2026-08-31T14:30:05Z",
    event_type: "privilege_escalation",
    source: "Linux",
    user: "sysadmin",
    source_ip: "127.0.0.1",
    severity: "medium",
    parser_id: "linux_auth_v1",
    raw_log_hash: "45a91048b29c0194e827104b29c13a91b287c6e1045d98a2104e78f9104b2819",
    status: "processed",
    confidence: 0.97,
    processing_time_ms: 1.1,
    created_at: "2026-08-31T14:30:05Z"
  },
  {
    event_id: "EVT-1102AA",
    timestamp: "2026-08-31T14:32:00Z",
    event_type: "security_audit_log_cleared",
    source: "Windows",
    user: "Administrator",
    source_ip: "10.0.1.15",
    severity: "critical",
    parser_id: "windows_sec_v1",
    raw_log_hash: "99104b28194d9a1048b29c0194e827104b29c13a91b287c6e1045d98a2104e78",
    status: "processed",
    confidence: 0.99,
    processing_time_ms: 2.3,
    created_at: "2026-08-31T14:32:00Z"
  },
  {
    event_id: "EVT-7701B4",
    timestamp: "2026-08-31T14:25:00Z",
    event_type: "network_traffic_deny",
    source: "Firewall",
    user: "fw_admin",
    source_ip: "192.168.1.10",
    severity: "medium",
    parser_id: "firewall_syslog_v1",
    raw_log_hash: "194b810948c104928e1047b9104829c1048b9102948c10928e1048b9102948c2",
    status: "processed",
    confidence: 0.95,
    processing_time_ms: 1.1,
    created_at: "2026-08-31T14:25:00Z"
  },
  {
    event_id: "EVT-9901C8",
    timestamp: "2026-08-31T14:35:10Z",
    event_type: "database_connection_timeout",
    source: "Application",
    user: "db_app_pool",
    source_ip: "10.0.12.44",
    severity: "critical",
    parser_id: "json_app_v1",
    raw_log_hash: "771029c38174201948d0a92841029e8471029a818f4e2b10a99c8321045b81a7",
    status: "processed",
    confidence: 0.99,
    processing_time_ms: 0.8,
    created_at: "2026-08-31T14:35:10Z"
  },
  {
    event_id: "EVT-3381D9",
    timestamp: "2026-08-31T14:38:22Z",
    event_type: "api_rate_limit_exceeded",
    source: "Application",
    user: "partner_dev_user",
    source_ip: "198.51.100.42",
    severity: "medium",
    parser_id: "json_app_v1",
    raw_log_hash: "2201948d0a92841029e8471029a818f4e2b10a99c8321045b81a7771029c38174",
    status: "processed",
    confidence: 0.99,
    processing_time_ms: 0.9,
    created_at: "2026-08-31T14:38:22Z"
  }
];
