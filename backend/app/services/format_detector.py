from typing import Tuple, List, Type
from app.parsers.base import BaseParser
from app.parsers.linux_auth import LinuxAuthParser
from app.parsers.windows_sec import WindowsSecurityParser
from app.parsers.firewall_syslog import FirewallSyslogParser
from app.parsers.json_app import JSONAppParser

REGISTERED_PARSERS: List[BaseParser] = [
    JSONAppParser(),
    LinuxAuthParser(),
    WindowsSecurityParser(),
    FirewallSyslogParser()
]

class FormatDetector:
    @staticmethod
    def detect_and_select_parser(raw_log: str, source_hint: str = None) -> Tuple[BaseParser, str]:
        """Detect format and select the best matching parser instance."""
        for parser in REGISTERED_PARSERS:
            if parser.can_parse(raw_log):
                return parser, f"Format detected as {parser.supported_format}"

        # Default fallback
        fallback = LinuxAuthParser()
        return fallback, "Unknown log format. Fallback to generic Linux parser."
