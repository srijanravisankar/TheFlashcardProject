from pydantic import BaseModel, ConfigDict

class Card(BaseModel):
    front_text: str
    back_text: str
    
class CardCreate(Card):
    pass

class CardResponse(Card):
    id: int
    
    # Enables Pydantic to create the model from SQLAlchemy ORM objects by reading attributes instead of expecting a dict
    model_config = ConfigDict(from_attributes=True)