import sqlite3

DATABASE_NAME = 'flashcards.db'

def connect_db():
    """
    Establishes a connection to the SQLite database.
    Database file is created if the file doesn't exist 
    """
    con = sqlite3.connect(DATABASE_NAME)
    con.row_factory = sqlite3.Row # allows to access columns by name instead of index
    return con

def create_table():
    """Creates a 'flashcards' table in the database if it doesn't exist."""
    con = connect_db() # connect to the database
    cur = con.cursor() # a pointer into the database
    cur.execute("""
        CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            front_text TEXT NOT NULL,
            back_text TEXT NOT NULL
        )            
    """)
    con.commit() # saves changes to the database
    con.close() # closes connection to the 

# code inside will only run when you execute database_manager.py directly and not when it's imported as a module
if __name__ == "__main__":
    print(f"Attempting to connect to {DATABASE_NAME}")
    create_table()
    