from typing import List
from pydantic import BaseModel

class Card(BaseModel):
    card_name: str

class Deck(BaseModel):
    deck_name: str
    cards: List[Card]

class Folder(BaseModel):
    folder_name: str
    decks: List[Deck]