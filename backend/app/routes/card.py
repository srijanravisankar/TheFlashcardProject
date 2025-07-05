from fastapi import status, APIRouter, Response, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from .. import schemas, models

from ..database import get_db

# Define the router 'cards'
router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)

# Create a flashcard and add it into the 'flashcard' table
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CardResponse)
def create_card(card: schemas.CardCreate, session: Session = Depends(get_db)):
    # check for deck existence
    deck = session.get(models.Deck, card.deck_id)
    if deck is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{card.deck_id}' was not found")
    
    new_card = models.Flashcard(**card.model_dump())
    
    session.add(new_card)
    session.commit()
    session.refresh(new_card)
    
    return new_card

# Get all the flashcards from the 'flashcard' table
@router.get("/", response_model=List[schemas.CardResponse])
def get_cards(session: Session = Depends(get_db)):    
    stmt = select(models.Flashcard)
    result = session.scalars(stmt)
    cards = result.all()
    
    return cards

# Get a flashcard from the 'flashcard' table given its given
@router.get("/{id}", response_model=schemas.CardResponse)
def get_card(id: int, session: Session = Depends(get_db)):
    stmt = select(models.Flashcard).where(models.Flashcard.id == id)
    result = session.scalars(stmt)
    card = result.first()
    
    if card == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Card with id '{id}' was not found")
    
    return card

# Update a flashcard in the 'flashcard' table given its id
@router.put("/{id}", response_model=schemas.CardResponse)
def update_card(id: int, update_card: schemas.CardCreate, session: Session = Depends(get_db)):
    # check for deck existence
    deck = session.get(models.Deck, update_card.deck_id)
    if deck is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{update_card.deck_id}' was not found")
    
    card = session.get(models.Flashcard, id)
    
    if card == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Card with id '{id}' was not found")
        
    update_data = update_card.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(card, key, value)
        
    session.commit()
    session.refresh(card)
    
    return card

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(id: int, session: Session = Depends(get_db)):
    card = session.get(models.Flashcard, id)
    
    if card == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Card with id '{id}' was not found")
    
    session.delete(card)
    session.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

