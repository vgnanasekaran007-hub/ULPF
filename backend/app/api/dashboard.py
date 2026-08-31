from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import NormalizedEvent
from app.schemas.event import DashboardStatsResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(NormalizedEvent).count()
    processed = db.query(NormalizedEvent).filter(NormalizedEvent.status == "processed").count()
    failed = db.query(NormalizedEvent).filter(NormalizedEvent.status == "failed").count()
    unknown = db.query(NormalizedEvent).filter(NormalizedEvent.status == "unknown").count()

    # Source breakdown
    sources = db.query(NormalizedEvent.source, func.count(NormalizedEvent.id)).group_by(NormalizedEvent.source).all()
    by_source = {src: count for src, count in sources}

    # Type breakdown
    types = db.query(NormalizedEvent.event_type, func.count(NormalizedEvent.id)).group_by(NormalizedEvent.event_type).all()
    by_type = {tp: count for tp, count in types}

    # Severity breakdown
    severities = db.query(NormalizedEvent.severity, func.count(NormalizedEvent.id)).group_by(NormalizedEvent.severity).all()
    by_severity = {sev: count for sev, count in severities}

    return DashboardStatsResponse(
        total_logs=total,
        processed=processed,
        failed=failed,
        unknown=unknown,
        by_source=by_source,
        by_type=by_type,
        by_severity=by_severity
    )
