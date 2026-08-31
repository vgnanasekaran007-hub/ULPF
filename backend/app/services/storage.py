import hashlib
import uuid
import time
from sqlalchemy.orm import Session
from app.models import RawEvent, NormalizedEvent, Parser

class StorageService:
    @staticmethod
    def calculate_sha256(raw_log: str) -> str:
        """Compute SHA-256 hash of raw log string."""
        return hashlib.sha256(raw_log.encode('utf-8')).hexdigest()

    @staticmethod
    def generate_event_id() -> str:
        """Generate a short unique event ID (e.g. EVT-9F812A)."""
        short_code = uuid.uuid4().hex[:6].upper()
        return f"EVT-{short_code}"

    @staticmethod
    def save_event(db: Session, raw_log: str, normalized_data: dict, parser_id: str, processing_time_ms: float) -> NormalizedEvent:
        """Persist raw event and normalized event atomically in DB."""
        event_id = StorageService.generate_event_id()
        raw_log_hash = StorageService.calculate_sha256(raw_log)

        # 1. Create Raw Event
        raw_event = RawEvent(
            event_id=event_id,
            raw_content=raw_log,
            raw_log_hash=raw_log_hash
        )
        db.add(raw_event)
        db.flush() # Populate raw_event.id

        # 2. Create Normalized Event
        norm_event = NormalizedEvent(
            event_id=event_id,
            raw_event_id=raw_event.id,
            timestamp=normalized_data.get("timestamp"),
            event_type=normalized_data.get("event_type", "unknown_event"),
            source=normalized_data.get("source", "Unknown"),
            user=normalized_data.get("user"),
            source_ip=normalized_data.get("source_ip"),
            severity=normalized_data.get("severity", "low"),
            parser_id=parser_id,
            status="processed",
            confidence=normalized_data.get("confidence", 1.0),
            processing_time_ms=processing_time_ms
        )
        db.add(norm_event)

        # 3. Update Parser Counter if exists
        parser_record = db.query(Parser).filter(Parser.parser_id == parser_id).first()
        if parser_record:
            parser_record.events_processed += 1

        db.commit()
        db.refresh(norm_event)
        return norm_event
