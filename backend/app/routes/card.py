from fastapi import APIRouter, Response, status, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from .. import schemas, models

from ..database import get_db

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/", response_model=List[schemas.CardResponse])
def get_cards(session: Session = Depends(get_db)):
    print("Getting Flashcards")
    
    stmt = select(models.Flashcard)
    result = session.scalars(stmt)
    cards = result.all()
    
    return cards

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CardResponse)
def create_cards(card: schemas.CardCreate, db: Session = Depends(get_db)):
    new_card = models.Flashcard(**card.model_dump())
    
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    
    return new_card

@router.get("/{id}", response_model=schemas.CardResponse)
def get_card(id: int, db: Session = Depends(get_db)):
    card = db.query(models.Flashcard).filter(models.Flashcard.id == id).first()

