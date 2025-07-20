# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://postgres:Srijan22$$@localhost:5433/flashcard_db"

# engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# def get_db():
#     db = Session()
#     try:
#         yield db
#     finally:
#         db.close()


import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from platformdirs import user_data_dir

APP_NAME = "MementoFlashcards"
APP_AUTHOR = "SrijanRavisankar"

data_dir = user_data_dir(APP_NAME, APP_AUTHOR)
os.makedirs(data_dir, exist_ok=True)

db_path = os.path.join(data_dir, "memento_flashcard_db.sqlite3")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()