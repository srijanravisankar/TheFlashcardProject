from fastapi import Query, status, APIRouter, Response, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, text

from datetime import datetime, timezone

from fsrs import Scheduler, Card, Rating, ReviewLog

from .. import schemas, models

from ..database import get_db

scheduler = Scheduler()

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
    
    new_card = models.Flashcard(**card.model_dump(exclude={"rating"}))
    session.add(new_card)
    session.flush()
    
    fsrs_card = Card(card_id=new_card.id)
    fsrs_card.difficulty = 5.0
    fsrs_card.stability = 0.1
    new_card.fsrs_state = fsrs_card.to_dict()
    
    session.commit()
    session.refresh(new_card)
    
    return new_card

# Get all the flashcards from the 'flashcard' table
@router.get("/", response_model=List[schemas.CardResponse])
def get_cards(deck_id: Optional[int] = Query(None), study: Optional[bool] = Query(None), session: Session = Depends(get_db)):    
    if study:
        # Study mode: only due cards
        if deck_id is not None:
            # stmt = text("""
            #     SELECT *
            #     FROM flashcard
            #     WHERE deck_id = :deck_id
            #     AND ((fsrs_state->>'state')::int = 1
            #     OR ((fsrs_state->>'state')::int IN (2, 3) AND (fsrs_state->>'due')::timestamp <= (NOW() AT TIME ZONE 'UTC')))
            #     ORDER BY 
            #         CASE (fsrs_state->>'state')::int
            #             WHEN 3 THEN 1
            #             WHEN 2 THEN 2
            #             WHEN 1 THEN 3
            #         END,
            #         (fsrs_state->>'due')::timestamp DESC;
            # """).bindparams(deck_id=deck_id)
            
            stmt = text("""
                SELECT *
                FROM flashcard
                WHERE deck_id = :deck_id
                AND (
                    json_extract(fsrs_state, '$.state') = 1
                    OR (
                        json_extract(fsrs_state, '$.state') IN (2, 3)
                        AND datetime(json_extract(fsrs_state, '$.due')) <= datetime('now')
                    )
                )
                ORDER BY
                    CASE json_extract(fsrs_state, '$.state')
                        WHEN 3 THEN 1
                        WHEN 2 THEN 2
                        WHEN 1 THEN 3
                    END,
                    datetime(json_extract(fsrs_state, '$.due')) DESC;
            """).bindparams(deck_id=deck_id)

        else:
            # stmt = text("""
            #     SELECT *
            #     FROM flashcard
            #     WHERE ((fsrs_state->>'state')::int = 1
            #     OR ((fsrs_state->>'state')::int IN (2, 3) AND (fsrs_state->>'due')::timestamp <= (NOW() AT TIME ZONE 'UTC')))
            #     ORDER BY 
            #         CASE (fsrs_state->>'state')::int
            #             WHEN 2 THEN 1
            #             WHEN 3 THEN 2
            #             WHEN 1 THEN 3
            #         END,
            #         (fsrs_state->>'due')::timestamp DESC;
            # """)
            
            stmt = text("""
                SELECT *
                FROM flashcard
                WHERE (
                    json_extract(fsrs_state, '$.state') = 1
                    OR (
                        json_extract(fsrs_state, '$.state') IN (2, 3)
                        AND datetime(json_extract(fsrs_state, '$.due')) <= datetime('now')
                    )
                )
                ORDER BY 
                    CASE json_extract(fsrs_state, '$.state')
                        WHEN 3 THEN 1
                        WHEN 2 THEN 2
                        WHEN 1 THEN 3
                    END,
                    datetime(json_extract(fsrs_state, '$.due')) DESC;
            """)

        
        cards = session.execute(stmt).fetchall()
        return [session.get(models.Flashcard, card.id) for card in cards]

    # If not in study mode, fall back to standard query
    stmt = select(models.Flashcard)
    if deck_id is not None:
        stmt = stmt.where(models.Flashcard.deck_id == deck_id)
        
    stmt = stmt.order_by(models.Flashcard.created_at)

    result = session.scalars(stmt)
    return result.all()

# Get a flashcard from the 'flashcard' table given its id
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
def update_card(id: int, update_card: schemas.CardCreate, study: Optional[bool] = Query(None), session: Session = Depends(get_db)):
    # check for deck existence
    deck = session.get(models.Deck, update_card.deck_id)
    if deck is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{update_card.deck_id}' was not found")
    
    card = session.get(models.Flashcard, id)
    
    if card == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Card with id '{id}' was not found")
        
    # update FSRS state
    if study and update_card.rating is not None:
        rating = Rating.Again
        if update_card.rating == 2:
            rating = Rating.Hard
        elif update_card.rating == 3:
            rating = Rating.Good
        elif update_card.rating == 4:
            rating = Rating.Easy
        
        now = datetime.now(timezone.utc)
        old_fsrs_card = Card.from_dict(card.fsrs_state)
        new_fsrs_card, review_log = scheduler.review_card(old_fsrs_card, rating, now)  
        
        card.fsrs_state = new_fsrs_card.to_dict()
    else:
        fsrs_card = Card(card_id=card.id)
        fsrs_card.difficulty = 5.0
        fsrs_card.stability = 0.1
        card.fsrs_state = fsrs_card.to_dict()
    
    update_data = update_card.model_dump(exclude_unset=True, exclude={"fsrs_state", "rating"})
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

