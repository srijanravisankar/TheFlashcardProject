# from fastapi import HTTPException, status
# from fsrs import Card
# from backend.app import models, schemas
# from backend.app.database import Session


# def create_card_in_db(card: schemas.CardCreate, session: Session) -> models.Flashcard:
#     deck = session.get(models.Deck, card.deck_id)
#     if deck is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
#                             detail=f"Deck with id '{card.deck_id}' was not found")
    
#     new_card = models.Flashcard(**card.model_dump(exclude={"rating"}))
#     session.add(new_card)
#     session.flush()
    
#     fsrs_card = Card(card_id=new_card.id)
#     fsrs_card.difficulty = 5.0
#     fsrs_card.stability = 0.1
#     new_card.fsrs_state = fsrs_card.to_dict()
    
#     session.commit()
#     session.refresh(new_card)
    
#     return new_card
