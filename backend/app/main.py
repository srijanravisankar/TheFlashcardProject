# From installed packages
# module -> class -> function
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# From subpackages
# from .routes import folder, deck, card
from app.routes import folder, deck, card

# From modules
# from .models import Base
# from .database import engine
from app.models import Base
from app.database import engine

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

app.include_router(folder.router)
app.include_router(deck.router)
app.include_router(card.router)

from fastapi.responses import FileResponse
import os

@app.get("/")
def serve_react():
    index_path = resource_path(os.path.join("static", "index.html"))
    return FileResponse(index_path)

# ...existing code...
from fastapi.staticfiles import StaticFiles
import os
import sys

def resource_path(relative_path):
    # If running as a PyInstaller bundle
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path) # type: ignore
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), relative_path)

static_dir = resource_path("static")
app.mount("/static", StaticFiles(directory=static_dir, html=True), name="static")
# ...existing code...

# ...existing code...

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
    
    import webbrowser
    webbrowser.open("http://localhost:8000")
