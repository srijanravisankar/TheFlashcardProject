import json
import re
from fsrs import Card
import requests

from fastapi import Header, status, APIRouter, Response, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from .. import schemas, models

from ..database import get_db

from .card import create_card

from .api import load_api_key

# Define the router 'generate'
router = APIRouter(
    prefix="/generate",
    tags=["AI Generator"]
)

def send_request(content: str):
    headers = {
        "Authorization": f"Bearer {load_api_key()}",
        "HTTP-Referer": "http://localhost",
        "X-Title": "MementoFlashcards"
    }

    messages = [
        {
            "role": "system", 
            "content": """
                You are a flashcard generator. Your job is to return a list of concise flashcards based on the topic provided by the user.

                Each flashcard must be a JSON object with:
                - "question": a clear quiz-style question
                - "answer": a short, factual answer

                Only return a JSON array like:
                [
                {"question": "...", "answer": "..."},
                ...
                ]"""
        }, {"role": "user", "content": content}
    ]


    data = {
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": messages
    }
    
    return headers, data


@router.post("/{deck_id}", status_code=status.HTTP_201_CREATED)
def generate_flashcards(topic: schemas.CardGenerate, deck_id: int, session: Session = Depends(get_db)):
    deck = session.get(models.Deck, deck_id)
    if deck is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Deck with id '{deck_id}' was not found")
        
    headers, data = send_request(topic.prompt)    
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
    print(response)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to generate flashcards")
    
    json_str = response.json()["choices"][0]["message"]["content"]
    print(json_str, "\n\n")
    
    match = re.search(r"```json\s*(.*?)\s*```", json_str, re.DOTALL)
    if match:
        raw_json = match.group(1)
    else:
        raw_json = json_str.strip()
        
    try:
        print(raw_json, "\n\n")
        flashcards_data = json.loads(raw_json)
        print(flashcards_data, "\n\n")
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse flashcards: invalid JSON"
        )

    print(flashcards_data)
    
    if not isinstance(flashcards_data, list):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid response format from flashcard generation service")
    if not all(isinstance(card, dict) and "question" in card and "answer" in card for card in flashcards_data):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid flashcard format received from the service")
    
    create_list = [
        schemas.CardCreate(front_text=card["question"], back_text=card["answer"], deck_id=deck_id) for card in flashcards_data
    ]
    
    for card in create_list:
        new_card = models.Flashcard(**card.model_dump(exclude={"rating"}))
        session.add(new_card)
        session.flush()
        
        fsrs_card = Card(card_id=new_card.id)
        fsrs_card.difficulty = 5.0
        fsrs_card.stability = 0.1
        new_card.fsrs_state = fsrs_card.to_dict()
        
        session.commit()
        session.refresh(new_card)