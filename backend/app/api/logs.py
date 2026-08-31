from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.log import LogIngestRequest, LogProcessResponse
from app.services.log_processor import LogProcessor

router = APIRouter(prefix="/logs", tags=["Log Processing"])

@router.post("/process", response_model=LogProcessResponse)
def process_log(payload: LogIngestRequest, db: Session = Depends(get_db)):
    if not payload.raw_log or not payload.raw_log.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Raw log content cannot be empty."
        )
    return LogProcessor.process_log(db=db, raw_log=payload.raw_log, source_hint=payload.source_hint)
