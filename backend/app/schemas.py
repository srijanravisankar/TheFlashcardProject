from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any

# Folder -----------------------------------------------------------------------------------------
class Folder(BaseModel):
    label: str
    
class FolderCreate(Folder):
    parent_id: Optional[int] = None
    pass

class FolderResponse(Folder):
    id: int
    subfolders: List["FolderResponse"] = Field(default_factory=list)
    decks: List["DeckResponse"] = Field(default_factory=list)
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)

# Deck -----------------------------------------------------------------------------------------
class Deck(BaseModel):
    label: str
    
class DeckCreate(Deck):
    folder_id: Optional[int] = None
    pass

class DeckResponse(Deck):
    folder_id: Optional[int] = None
    id: int
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)

# Card -----------------------------------------------------------------------------------------
class Card(BaseModel):
    front_text: str
    back_text: str
    deck_id: int
    
class CardCreate(Card):
    rating: Optional[int] = None
    pass

class CardResponse(Card):
    id: int
    fsrs_state: dict[str, int | float | str | None]
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)