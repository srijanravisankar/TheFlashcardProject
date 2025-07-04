from pydantic import BaseModel, ConfigDict
from typing import Optional

# Folder -----------------------------------------------------------------------------------------
class Folder(BaseModel):
    name: str
    parent_id: Optional[int] = None
    
class FolderCreate(Folder):
    pass

class FolderResponse(Folder):
    id: int
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)

# Deck -----------------------------------------------------------------------------------------
class Deck(BaseModel):
    name: str
    folder_id: Optional[int] = None
    
class DeckCreate(Folder):
    pass

class DeckResponse(Folder):
    id: int
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)

# Card -----------------------------------------------------------------------------------------
class Card(BaseModel):
    front_text: str
    back_text: str
    
class CardCreate(Card):
    pass

class CardResponse(Card):
    id: int
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)