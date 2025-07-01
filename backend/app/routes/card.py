from fastapi import status, APIRouter, Response, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, insert

from .. import schemas, models

from ..database import get_db

# Define the router 'cards'
router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

# Get all the cards from the 'flashcard' table
@router.get("/", response_model=List[schemas.CardResponse])
def get_cards(session: Session = Depends(get_db)):    
    stmt = select(models.Flashcard)
    result = session.scalars(stmt)
    cards = result.all()
    
    return cards

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CardResponse)
def create_cards(card: schemas.CardCreate, session: Session = Depends(get_db)):
    new_card = models.Flashcard(**card.model_dump())
    
    session.add(new_card)
    session.commit()
    session.refresh(new_card)
    
    return new_card

@router.get("/{id}", response_model=schemas.CardResponse)
def get_card(id: int, session: Session = Depends(get_db)):
    stmt = select(models.Flashcard).where(models.Flashcard.id == id)
    result = session.scalars(stmt)
    card = result.first()
    
    if card == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Post with id '{id}' was not found")
    
    return card

