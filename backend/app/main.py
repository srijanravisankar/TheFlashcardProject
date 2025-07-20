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


# ...existing code...

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import sys

def resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path) # type: ignore
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), relative_path)

# static_dir = resource_path("app/static")
static_dir = resource_path("/")
app.mount("/static", StaticFiles(directory=static_dir, html=True), name="static")

@app.get("/")
def serve_react():
    index_path = resource_path(os.path.join("app", "static", "index.html"))
    return FileResponse(index_path)

@app.get("/deck/{deck_id}")
def serve_react_deck():
    index_path = resource_path(os.path.join("app", "static", "index.html"))
    return FileResponse(index_path)

@app.get("/deck/{deck_id}/study")
def serve_react_study():
    index_path = resource_path(os.path.join("app", "static", "index.html"))
    return FileResponse(index_path)

if __name__ == "__main__":
    import webbrowser
    import threading
    import time
    import uvicorn

    def open_browser():
        time.sleep(1)  # Give the server a moment to start
        webbrowser.open("http://127.0.0.1:8000")

    threading.Thread(target=open_browser).start()

    uvicorn.run(app, host="127.0.0.1", port=8000, log_config=None)


# ...existing code...