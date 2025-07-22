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

# Define the router 'generate'
router = APIRouter(
    prefix="/api",
    tags=["API Key Management"]
)

import os
import json
from platformdirs import user_data_dir

APP_NAME = "MementoFlashcards"
APP_AUTHOR = "SrijanRavisankar"

data_dir = user_data_dir(APP_NAME, APP_AUTHOR)
os.makedirs(data_dir, exist_ok=True)

config_path = os.path.join(data_dir, "config.json")

def save_api_key(api_key: str):
    if os.path.exists(config_path):
        return 
    config = {"OPENROUTER_API_KEY": api_key}
    with open(config_path, "w") as f:
        json.dump(config, f)

def load_api_key():
    if not os.path.exists(config_path):
        raise FileNotFoundError("API key not found. Please set it using `save_api_key()`.")
    
    with open(config_path, "r") as f:
        config = json.load(f)
        
    return config.get("OPENROUTER_API_KEY")

@router.post("/", status_code=status.HTTP_201_CREATED)
def set_api_key(api: schemas.Api):
    print(f"Received API key: {api.api_key})")
    if not api.api_key.startswith("sk-or-"):
        raise HTTPException(status_code=400, detail="Invalid API key format")
    save_api_key(api.api_key)
    return {"message": "API key saved successfully."}
