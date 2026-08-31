import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class RawEvent(Base):
    __tablename__ = "raw_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True, nullable=False)
    raw_content = Column(Text, nullable=False)
    raw_log_hash = Column(String(64), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship to normalized event
    normalized_event = relationship("NormalizedEvent", back_populates="raw_event", uselist=False)

class NormalizedEvent(Base):
    __tablename__ = "normalized_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True, nullable=False)
    raw_event_id = Column(Integer, ForeignKey("raw_events.id"), nullable=False)
    timestamp = Column(String(100), nullable=False)
    event_type = Column(String(100), index=True, nullable=False)
    source = Column(String(100), index=True, nullable=False)
    user = Column(String(100), index=True, nullable=True)
    source_ip = Column(String(50), index=True, nullable=True)
    severity = Column(String(20), index=True, nullable=False) # low, medium, high, critical
    parser_id = Column(String(50), nullable=False)
    status = Column(String(20), default="processed") # processed, failed, unknown
    confidence = Column(Float, default=1.0)
    processing_time_ms = Column(Float, default=1.2)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship to raw event
    raw_event = relationship("RawEvent", back_populates="normalized_event")

class Parser(Base):
    __tablename__ = "parsers"

    id = Column(Integer, primary_key=True, index=True)
    parser_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    version = Column(String(20), nullable=False)
    supported_format = Column(String(100), nullable=False)
    status = Column(String(20), default="active") # active, inactive, testing
    events_processed = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
