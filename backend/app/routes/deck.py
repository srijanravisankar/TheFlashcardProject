from fastapi import status, APIRouter, Response, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from .. import schemas, models

from ..database import get_db

# Define the router 'decks'
router = APIRouter(
    prefix="/decks",
    tags=["Decks"]
)

# Create a deck and add it into the 'deck' table
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.DeckResponse)
def create_deck(deck: schemas.DeckCreate, session: Session = Depends(get_db)):
    # check for folder existence
    parent_folder = session.get(models.Folder, deck.folder_id)
    if deck.folder_id is not None and parent_folder is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{deck.folder_id}' was not found")
    
    new_deck = models.Deck(**deck.model_dump())
    
    session.add(new_deck)
    session.commit()
    session.refresh(new_deck)
    
    return new_deck

# Get all the decks from the 'deck' table
@router.get("/", response_model=List[schemas.DeckResponse])
def get_decks(session: Session = Depends(get_db)):    
    stmt = select(models.Deck)
    result = session.scalars(stmt)
    decks = result.all()
    print(decks)
    
    return decks

# Get a deck from the 'deck' table given its given
@router.get("/{id}", response_model=schemas.DeckResponse)
def get_deck(id: int, session: Session = Depends(get_db)):
    stmt = select(models.Deck).where(models.Deck.id == id)
    result = session.scalars(stmt)
    deck = result.first()
    
    if deck == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deck with id '{id}' was not found")
    
    return deck

# Update a deck in the 'deck' table given its id
@router.put("/{id}", response_model=schemas.DeckResponse)
def update_deck(id: int, update_deck: schemas.DeckCreate, session: Session = Depends(get_db)):
    # check for folder existence
    parent_folder = session.get(models.Folder, update_deck.folder_id)
    if update_deck.folder_id is not None and parent_folder is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{update_deck.folder_id}' was not found")
    
    deck = session.get(models.Deck, id)
    
    if deck == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deck with id '{id}' was not found")
        
    update_data = update_deck.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(deck, key, value)
        
    session.commit()
    session.refresh(deck)
    
    return deck

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(id: int, session: Session = Depends(get_db)):
    deck = session.get(models.Deck, id)
    
    if deck == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Deck with id '{id}' was not found")
    
    session.delete(deck)
    session.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

