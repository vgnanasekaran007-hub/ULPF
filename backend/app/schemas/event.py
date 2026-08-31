from pydantic import BaseModel
from typing import Optional, List
import datetime

class NormalizedEventSchema(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    source: str
    user: Optional[str] = None
    source_ip: Optional[str] = None
    severity: str
    parser_id: str
    raw_log_hash: str
    status: str
    confidence: float
    processing_time_ms: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class EventDetailSchema(NormalizedEventSchema):
    raw_log: str

class EventListResponse(BaseModel):
    total: int
    events: List[NormalizedEventSchema]

class DashboardStatsResponse(BaseModel):
    total_logs: int
    processed: int
    failed: int
    unknown: int
    by_source: dict
    by_type: dict
    by_severity: dict
