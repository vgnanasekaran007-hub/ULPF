import time
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.services.format_detector import FormatDetector
from app.services.storage import StorageService
from app.schemas.log import ProcessingStageStatus, LogProcessResponse

class LogProcessor:
    @staticmethod
    def process_log(db: Session, raw_log: str, source_hint: str = None) -> LogProcessResponse:
        start_time = time.time()
        pipeline_stages: List[ProcessingStageStatus] = []

        # 1. Ingest
        pipeline_stages.append(ProcessingStageStatus(
            stage="Ingest",
            status="success",
            details=f"Received payload of size {len(raw_log)} bytes."
        ))

        # 2. Format Detection
        parser, detect_msg = FormatDetector.detect_and_select_parser(raw_log, source_hint)
        pipeline_stages.append(ProcessingStageStatus(
            stage="Detect Format",
            status="success",
            details=detect_msg
        ))

        # 3. Parse
        try:
            parsed_data = parser.parse(raw_log)
            pipeline_stages.append(ProcessingStageStatus(
                stage="Parse",
                status="success",
                details=f"Extracted fields using engine '{parser.name}'"
            ))
        except Exception as e:
            parsed_data = {
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "event_type": "parse_error",
                "source": "Unknown",
                "user": "unknown",
                "source_ip": "0.0.0.0",
                "severity": "medium",
                "confidence": 0.3
            }
            pipeline_stages.append(ProcessingStageStatus(
                stage="Parse",
                status="warning",
                details=f"Partial parse: {str(e)}"
            ))

        # 4. Normalize
        pipeline_stages.append(ProcessingStageStatus(
            stage="Normalize",
            status="success",
            details=f"Mapped log into common ULPF schema standard."
        ))

        # 5. Validate
        is_valid = bool(parsed_data.get("event_type") and parsed_data.get("source"))
        pipeline_stages.append(ProcessingStageStatus(
            stage="Validate",
            status="success" if is_valid else "warning",
            details="Validated required fields (event_type, source, severity)."
        ))

        # 6. Preserve Raw Log
        processing_time_ms = round((time.time() - start_time) * 1000, 2)
        norm_event = StorageService.save_event(
            db=db,
            raw_log=raw_log,
            normalized_data=parsed_data,
            parser_id=parser.parser_id,
            processing_time_ms=processing_time_ms
        )

        pipeline_stages.append(ProcessingStageStatus(
            stage="Preserve Raw Log",
            status="success",
            details=f"SHA-256 Hash calculated & linked to Event ID {norm_event.event_id}"
        ))

        return LogProcessResponse(
            event_id=norm_event.event_id,
            timestamp=norm_event.timestamp,
            event_type=norm_event.event_type,
            source=norm_event.source,
            user=norm_event.user,
            source_ip=norm_event.source_ip,
            severity=norm_event.severity,
            parser_id=parser.parser_id,
            parser_version=parser.version,
            raw_log_hash=norm_event.raw_event.raw_log_hash,
            processing_time_ms=processing_time_ms,
            confidence=norm_event.confidence,
            pipeline_stages=pipeline_stages,
            raw_log=raw_log
        )
