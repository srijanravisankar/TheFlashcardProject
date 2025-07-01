from sqlalchemy.orm import DeclarativeBase, mapped_column
from sqlalchemy import Integer, String

class Base(DeclarativeBase):
    pass

class Flashcard(Base):
    __tablename__ = "flashcard"
    
    id = mapped_column(Integer, primary_key=True)
    front_text = mapped_column(String, nullable=False)
    back_text = mapped_column(String, nullable=False)
    
    