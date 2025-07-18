from typing import Optional, List
from datetime import datetime, timezone

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, ForeignKey, JSON, func

class Base(DeclarativeBase):
    pass

class Folder(Base):
    __tablename__ = "folder"
    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    # a deck has 0 or 1 parent folder
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folder.id"), nullable=True)
    
    # relationships: a folder can have 0 or 1 parent folder, 0 or more folder(s) and 0 or more deck(s)
    parent: Mapped[Optional["Folder"]] = relationship(back_populates="subfolders", remote_side="Folder.id") 
    subfolders: Mapped[List["Folder"]] = relationship(back_populates="parent", cascade="all, delete-orphan")
    decks: Mapped[List["Deck"]] = relationship(back_populates="folder", cascade="all, delete-orphan")

class Deck(Base):
    __tablename__ = "deck"
    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    # a deck has 0 or 1 parent folder
    folder_id: Mapped[Optional[int]] = mapped_column(ForeignKey("folder.id"), nullable=True)
    
    # relationships: a deck can have 0 or 1 parent folder and 0 or more flashcard(s)
    folder: Mapped[Optional["Folder"]] = relationship(back_populates="decks")
    cards: Mapped[List["Flashcard"]] = relationship(back_populates="deck", cascade="all, delete-orphan")

class Flashcard(Base):
    __tablename__ = "flashcard"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    front_text: Mapped[str] = mapped_column(String, nullable=False)
    back_text: Mapped[str] = mapped_column(String, nullable=False)
    fsrs_state: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    # a flashcard has 1 parent deck
    deck_id: Mapped[int] = mapped_column(ForeignKey("deck.id"), nullable=False)
    
    # relationship: a flashcard has 1 parent deck
    deck: Mapped["Deck"] = relationship(back_populates="cards")
    
    
    