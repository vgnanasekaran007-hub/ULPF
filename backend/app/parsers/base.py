from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple

class BaseParser(ABC):
    parser_id: str = "base_parser"
    name: str = "Base Parser"
    version: str = "1.0.0"
    supported_format: str = "Unknown"

    @abstractmethod
    def can_parse(self, raw_log: str) -> bool:
        """Return True if this parser can handle the raw log input."""
        pass

    @abstractmethod
    def parse(self, raw_log: str) -> Dict[str, Any]:
        """Parse raw log and return normalized dictionary."""
        pass
