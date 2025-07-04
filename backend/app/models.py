from typing import Optional, List
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey

class Base(DeclarativeBase):
    pass

class Folder(Base):
    __tablename__ = "folder"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    
    # a deck has 0 or 1 parent folder
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folder.id"), nullable=True)
    
    # relationships: a folder can have 0 or 1 parent folder, 0 or more folder(s) and 0 or more deck(s)
    parent: Mapped[Optional["Folder"]] = relationship(back_populates="subfolders", remote_side=[id]) 
    subfolders: Mapped[List["Folder"]] = relationship(back_populates="parent", cascade="all, delete")
    decks: Mapped[List["Deck"]] = relationship(back_populates="folder", cascade="all, delete")

class Deck(Base):
    __tablename__ = "deck"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    
    # a deck has 0 or 1 parent folder
    folder_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folder.id"), nullable=True)
    
    # relationships: a deck can have 0 or 1 parent folder and 0 or more flashcard(s)
    folder: Mapped[Optional["Folder"]] = relationship(back_populates="decks")
    cards: Mapped[List["Flashcard"]] = relationship(back_populates="deck", cascade="all, delete")

class Flashcard(Base):
    __tablename__ = "flashcard"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    front_text: Mapped[str] = mapped_column(String, nullable=False)
    back_text: Mapped[str] = mapped_column(String, nullable=False)
    
    # a flashcard has 1 parent deck
    deck_id: Mapped[int] = mapped_column(ForeignKey("deck.id"), nullable=False)
    
    # relationship: a flashcard has 1 parent deck
    deck: Mapped["Deck"] = relationship(back_populates="cards")
    
    
    