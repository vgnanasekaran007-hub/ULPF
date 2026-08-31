from pydantic import BaseModel
from typing import Optional, List
import datetime

class ParserSchema(BaseModel):
    id: int
    parser_id: str
    name: str
    version: str
    supported_format: str
    status: str
    events_processed: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ParserCreateRequest(BaseModel):
    parser_id: str
    name: str
    version: str = "1.0.0"
    supported_format: str
    pattern_regex: Optional[str] = None
