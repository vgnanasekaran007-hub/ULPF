from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Parser
from app.schemas.parser import ParserSchema, ParserCreateRequest

router = APIRouter(prefix="/parsers", tags=["Parser Registry"])

@router.get("", response_model=List[ParserSchema])
def get_parsers(db: Session = Depends(get_db)):
    parsers = db.query(Parser).order_by(Parser.name).all()
    return parsers

@router.post("", response_model=ParserSchema)
def create_parser(payload: ParserCreateRequest, db: Session = Depends(get_db)):
    existing = db.query(Parser).filter(Parser.parser_id == payload.parser_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Parser ID '{payload.parser_id}' already exists.")

    new_parser = Parser(
        parser_id=payload.parser_id,
        name=payload.name,
        version=payload.version,
        supported_format=payload.supported_format,
        status="active",
        events_processed=0
    )
    db.add(new_parser)
    db.commit()
    db.refresh(new_parser)
    return new_parser
