# from installed packages
from fastapi import FastAPI

# from subpackages
from .routes import card

# from modules
from .models import Base
from .database import engine

# Create all database tables defined by SQLAlchemy models (if they don't already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(card.router)

@app.get("/")
def root():
    return {"message": "Hello World"}
