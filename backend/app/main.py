# From installed packages
# module -> class -> function
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# From subpackages
from .routes import card, folder

# From modules
from .models import Base
from .database import engine

# Create all database tables defined by SQLAlchemy models (if they don't already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(card.router)
app.include_router(folder.router)

@app.get("/")
def root():
    return {"message": "Hello World"}
