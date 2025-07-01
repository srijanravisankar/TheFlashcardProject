from fastapi import APIRouter, Response, status, Depends
from typing import List
from sqlalchemy.orm import Session

from .. import schemas, models

from ..database import get_db

router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

@router.get("/", response_model=List[schemas.CardResponse])
def get_cards(db: Session = Depends(get_db)):
    print("Getting Flashcards")
    
    cards = db.query(models.Flashcard).all()
    
    return cards

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CardResponse)
def create_cards(card: schemas.CardCreate, db: Session = Depends(get_db)):
    new_card = models.Flashcard(**card.model_dump())
    
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    
    return new_card



