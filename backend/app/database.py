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
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path) # type: ignore
    # Use the folder where the executable/script is running
    return os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), relative_path)

db_path = resource_path("flashcard_db.sqlite3")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()