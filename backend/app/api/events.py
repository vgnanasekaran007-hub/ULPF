from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import NormalizedEvent, RawEvent
from app.schemas.event import EventListResponse, NormalizedEventSchema, EventDetailSchema

router = APIRouter(prefix="/events", tags=["Normalized Events"])

@router.get("", response_model=EventListResponse)
def get_events(
    search: Optional[str] = Query(None, description="Search query across user, IP, event type"),
    source: Optional[str] = Query(None, description="Filter by log source"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    db: Session = Depends(get_db)
):
    query = db.query(NormalizedEvent)

    if source:
        query = query.filter(NormalizedEvent.source.ilike(f"%{source}%"))

    if severity:
        query = query.filter(NormalizedEvent.severity.ilike(f"%{severity}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (NormalizedEvent.event_id.ilike(search_pattern)) |
            (NormalizedEvent.user.ilike(search_pattern)) |
            (NormalizedEvent.source_ip.ilike(search_pattern)) |
            (NormalizedEvent.event_type.ilike(search_pattern)) |
            (NormalizedEvent.source.ilike(search_pattern))
        )

    events = query.order_by(NormalizedEvent.created_at.desc()).all()
    
    # Map to schema with raw_log_hash from raw_event relation
    event_list = []
    for ev in events:
        hash_val = ev.raw_event.raw_log_hash if ev.raw_event else ""
        item = NormalizedEventSchema(
            event_id=ev.event_id,
            timestamp=ev.timestamp,
            event_type=ev.event_type,
            source=ev.source,
            user=ev.user,
            source_ip=ev.source_ip,
            severity=ev.severity,
            parser_id=ev.parser_id,
            raw_log_hash=hash_val,
            status=ev.status,
            confidence=ev.confidence,
            processing_time_ms=ev.processing_time_ms,
            created_at=ev.created_at
        )
        event_list.append(item)

    return EventListResponse(total=len(event_list), events=event_list)

@router.get("/{event_id}", response_model=EventDetailSchema)
def get_event_detail(event_id: str, db: Session = Depends(get_db)):
    ev = db.query(NormalizedEvent).filter(NormalizedEvent.event_id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found.")

    raw_content = ev.raw_event.raw_content if ev.raw_event else ""
    hash_val = ev.raw_event.raw_log_hash if ev.raw_event else ""

    return EventDetailSchema(
        event_id=ev.event_id,
        timestamp=ev.timestamp,
        event_type=ev.event_type,
        source=ev.source,
        user=ev.user,
        source_ip=ev.source_ip,
        severity=ev.severity,
        parser_id=ev.parser_id,
        raw_log_hash=hash_val,
        status=ev.status,
        confidence=ev.confidence,
        processing_time_ms=ev.processing_time_ms,
        created_at=ev.created_at,
        raw_log=raw_content
    )

@router.get("/{event_id}/raw")
def get_event_raw(event_id: str, db: Session = Depends(get_db)):
    ev = db.query(NormalizedEvent).filter(NormalizedEvent.event_id == event_id).first()
    if not ev or not ev.raw_event:
        raise HTTPException(status_code=404, detail="Raw log not found.")

    return {
        "event_id": ev.event_id,
        "raw_log_hash": ev.raw_event.raw_log_hash,
        "raw_content": ev.raw_event.raw_content
    }
