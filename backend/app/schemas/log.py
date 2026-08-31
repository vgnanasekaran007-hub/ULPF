from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class LogIngestRequest(BaseModel):
    raw_log: str
    source_hint: Optional[str] = None

class ProcessingStageStatus(BaseModel):
    stage: str
    status: str # success, failed, skipped
    details: str

class LogProcessResponse(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    source: str
    user: Optional[str] = None
    source_ip: Optional[str] = None
    severity: str
    parser_id: str
    parser_version: str
    raw_log_hash: str
    processing_time_ms: float
    confidence: float
    pipeline_stages: List[ProcessingStageStatus]
    raw_log: str
